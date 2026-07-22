import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  createInitialState, startHand as engineStartHand,
  playerAction as enginePlayerAction, nextHand as engineNextHand,
  type GameState, type PokerAction,
} from "@/lib/poker/engine";
import type { VariantId } from "@/lib/poker/variants";
import type { Card } from "@/lib/poker/cards";

function randomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "PKR-";
  for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// ============ CREATE ROOM ============
export const createRoom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({
    variant: z.enum(["holdem", "omaha", "shortdeck"]),
    smallBlind: z.number().int().min(1).max(1000),
    bigBlind: z.number().int().min(2).max(2000),
    startStack: z.number().int().min(100).max(100000),
    maxPlayers: z.number().int().min(2).max(6),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    let code = "";
    let attempts = 0;
    while (attempts < 5) {
      code = randomCode();
      const { data: existing } = await supabase.from("rooms").select("id").eq("code", code).maybeSingle();
      if (!existing) break;
      attempts++;
    }
    const { data: room, error } = await supabase.from("rooms").insert({
      code,
      variant: data.variant,
      small_blind: data.smallBlind,
      big_blind: data.bigBlind,
      start_stack: data.startStack,
      max_players: data.maxPlayers,
      created_by: userId,
      status: "lobby",
    }).select("*").single();
    if (error) throw new Error(error.message);
    // Auto-junta o criador no seat 0
    const { error: joinErr } = await supabase.from("room_players").insert({
      room_id: room.id, user_id: userId, seat: 0, stack: data.startStack,
    });
    if (joinErr) throw new Error(joinErr.message);
    return { code, roomId: room.id };
  });

// ============ JOIN ROOM ============
export const joinRoom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ code: z.string().min(4).max(20) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: room, error: roomErr } = await supabase.from("rooms")
      .select("*").eq("code", data.code.toUpperCase()).maybeSingle();
    if (roomErr) throw new Error(roomErr.message);
    if (!room) throw new Error("Sala não encontrada");

    const { data: existing } = await supabase.from("room_players")
      .select("seat").eq("room_id", room.id).eq("user_id", userId).maybeSingle();
    if (existing) return { roomId: room.id, code: room.code, seat: existing.seat };

    const { data: seats } = await supabase.from("room_players")
      .select("seat").eq("room_id", room.id);
    const taken = new Set((seats ?? []).map((s) => s.seat));
    if (taken.size >= room.max_players) throw new Error("Sala cheia");
    let seat = 0;
    while (taken.has(seat)) seat++;

    const { error } = await supabase.from("room_players").insert({
      room_id: room.id, user_id: userId, seat, stack: room.start_stack,
    });
    if (error) throw new Error(error.message);
    return { roomId: room.id, code: room.code, seat };
  });

// ============ LEAVE ============
export const leaveRoom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ roomId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase.from("room_players")
      .delete().eq("room_id", data.roomId).eq("user_id", userId);
    return { ok: true };
  });

// ============ TOGGLE READY ============
export const toggleReady = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ roomId: z.string().uuid(), ready: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("room_players")
      .update({ is_ready: data.ready })
      .eq("room_id", data.roomId).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ START HAND (creator only) ============
export const startRoomHand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ roomId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: room, error: rErr } = await supabase.from("rooms")
      .select("*").eq("id", data.roomId).single();
    if (rErr || !room) throw new Error("Sala não encontrada");
    if (room.created_by !== userId) throw new Error("Apenas o criador pode iniciar");

    const { data: players, error: pErr } = await supabase.from("room_players")
      .select("*").eq("room_id", data.roomId).order("seat", { ascending: true });
    if (pErr) throw new Error(pErr.message);
    if (!players || players.length < 2) throw new Error("Precisa de ao menos 2 jogadores");

    // Pega usernames
    const ids = players.map((p) => p.user_id);
    const { data: profiles } = await supabase.from("profiles")
      .select("id, username, avatar_emoji").in("id", ids);
    const profMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

    // Carrega estado existente (se houver) pra manter stacks
    const { data: prev } = await supabase.from("game_states")
      .select("state, version").eq("room_id", data.roomId).maybeSingle();

    let state: GameState;
    if (prev?.state) {
      // Continua mão nova mantendo stacks; sincroniza jogadores com room_players atual
      const prevState = prev.state as unknown as GameState;
      const stackByUser = new Map(prevState.players.map((p) => [p.id, p.stack]));
      state = createInitialState({
        players: players.map((rp) => {
          const prof = profMap.get(rp.user_id);
          return {
            id: rp.user_id,
            name: prof?.username ?? "Jogador",
            isBot: false,
            startStack: stackByUser.get(rp.user_id) ?? rp.stack,
          };
        }),
        smallBlind: room.small_blind,
        bigBlind: room.big_blind,
        variant: room.variant as VariantId,
      });
    } else {
      state = createInitialState({
        players: players.map((rp) => {
          const prof = profMap.get(rp.user_id);
          return {
            id: rp.user_id,
            name: prof?.username ?? "Jogador",
            isBot: false,
            startStack: rp.stack,
          };
        }),
        smallBlind: room.small_blind,
        bigBlind: room.big_blind,
        variant: room.variant as VariantId,
      });
    }

    const newState = engineStartHand(state);

    const { error: upsertErr } = await supabase.from("game_states")
      .upsert({
        room_id: data.roomId,
        state: newState as never,
        version: (prev?.version ?? 0) + 1,
        updated_at: new Date().toISOString(),
      });
    if (upsertErr) throw new Error(upsertErr.message);

    await supabase.from("rooms").update({ status: "playing" }).eq("id", data.roomId);

    await supabase.from("game_actions").insert({
      room_id: data.roomId, user_id: userId, action_type: "hand_start",
      hand_number: newState.handNumber,
    });

    return { ok: true };
  });

// ============ SUBMIT ACTION ============
const actionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("fold") }),
  z.object({ type: z.literal("check") }),
  z.object({ type: z.literal("call") }),
  z.object({ type: z.literal("raise"), amount: z.number().int().min(1) }),
  z.object({ type: z.literal("allin") }),
]);

export const submitAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({
    roomId: z.string().uuid(),
    action: actionSchema,
  }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase.from("game_states")
      .select("state, version").eq("room_id", data.roomId).single();
    if (error || !row) throw new Error("Estado não encontrado");
    const state = row.state as unknown as GameState;
    if (state.awaitingAdvance) throw new Error("Aguardando próxima mão");
    const current = state.players[state.actionIdx];
    if (current.id !== userId) throw new Error("Não é sua vez");

    const newState = enginePlayerAction(state, userId, data.action as PokerAction);

    await supabase.from("game_states").update({
      state: newState as never,
      version: row.version + 1,
      updated_at: new Date().toISOString(),
    }).eq("room_id", data.roomId);

    await supabase.from("game_actions").insert({
      room_id: data.roomId, user_id: userId,
      action_type: data.action.type,
      payload: (data.action as never),
      hand_number: newState.handNumber,
    });

    return { ok: true, version: row.version + 1 };
  });

// ============ NEXT HAND ============
export const nextRoomHand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ roomId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: room } = await supabase.from("rooms").select("created_by").eq("id", data.roomId).single();
    if (!room || room.created_by !== userId) throw new Error("Só o criador avança");
    const { data: row, error } = await supabase.from("game_states")
      .select("state, version").eq("room_id", data.roomId).single();
    if (error || !row) throw new Error("Estado não encontrado");
    const state = row.state as unknown as GameState;
    if (!state.awaitingAdvance) throw new Error("Mão em andamento");
    const newState = engineNextHand(state);
    await supabase.from("game_states").update({
      state: newState as never,
      version: row.version + 1,
      updated_at: new Date().toISOString(),
    }).eq("room_id", data.roomId);
    await supabase.from("game_actions").insert({
      room_id: data.roomId, user_id: userId, action_type: "hand_start",
      hand_number: newState.handNumber,
    });
    return { ok: true };
  });

// ============ GET MY VIEW (masked) ============
export const getRoomView = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ roomId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row } = await supabase.from("game_states")
      .select("state, version").eq("room_id", data.roomId).maybeSingle();
    if (!row) return { state: null, version: 0 };
    const state = row.state as unknown as GameState;
    // Máscara: em outros players não-showdown, oculta hole cards
    const showdown = state.street === "showdown";
    const masked: GameState = {
      ...state,
      deck: [], // nunca envia deck
      players: state.players.map((p) => {
        if (p.id === userId || showdown) return p;
        return { ...p, hole: p.hole.map(() => null as unknown as Card) };
      }),
    };
    return { state: masked, version: row.version };
  });
