import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  createInitialState, startHand as engineStartHand,
  playerAction as enginePlayerAction, nextHand as engineNextHand,
  type GameState, type PokerAction,
} from "@/lib/poker/engine";
import type { VariantId } from "@/lib/poker/variants";
import type { Card } from "@/lib/poker/cards";

export const MAX_ROOM_PLAYERS = 6;

function randomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "PKR-";
  for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const nameSchema = z.string().trim().min(2).max(20);
const guestSchema = z.string().min(8).max(64);

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ============ CREATE ROOM ============
export const createRoom = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({
    guestId: guestSchema,
    displayName: nameSchema,
    avatarEmoji: z.string().max(4).optional(),
    variant: z.enum(["holdem", "omaha", "shortdeck"]),
    smallBlind: z.number().int().min(1).max(1000),
    bigBlind: z.number().int().min(2).max(2000),
    startStack: z.number().int().min(100).max(100000),
    maxPlayers: z.number().int().min(2).max(MAX_ROOM_PLAYERS),
  }).parse(d))
  .handler(async ({ data }) => {
    const supa = await admin();
    const maxPlayers = Math.min(data.maxPlayers, MAX_ROOM_PLAYERS);

    let code = "";
    let attempts = 0;
    while (attempts < 5) {
      code = randomCode();
      const { data: existing } = await supa.from("rooms").select("id").eq("code", code).maybeSingle();
      if (!existing) break;
      attempts++;
    }
    const { data: room, error } = await supa.from("rooms").insert({
      code,
      variant: data.variant,
      small_blind: data.smallBlind,
      big_blind: data.bigBlind,
      start_stack: data.startStack,
      max_players: maxPlayers,
      created_by_guest: data.guestId,
      status: "lobby",
    }).select("*").single();

    if (error) throw new Error(error.message);
    const { error: joinErr } = await supa.from("room_players").insert({
      room_id: room.id,
      guest_id: data.guestId,
      display_name: data.displayName,
      avatar_emoji: data.avatarEmoji ?? "🎭",
      seat: 0,
      stack: data.startStack,
    });
    if (joinErr) throw new Error(joinErr.message);
    return { code, roomId: room.id };
  });

// ============ JOIN ROOM ============
export const joinRoom = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({
    code: z.string().min(4).max(20),
    guestId: guestSchema,
    displayName: nameSchema,
    avatarEmoji: z.string().max(4).optional(),
  }).parse(d))
  .handler(async ({ data }) => {
    const supa = await admin();
    const { data: room, error: roomErr } = await supa.from("rooms")
      .select("*").eq("code", data.code.toUpperCase()).maybeSingle();
    if (roomErr) throw new Error(roomErr.message);
    if (!room) throw new Error("Sala não encontrada");

    const { data: existing } = await supa.from("room_players")
      .select("seat").eq("room_id", room.id).eq("guest_id", data.guestId).maybeSingle();
    if (existing) return { roomId: room.id, code: room.code, seat: existing.seat };

    const { data: seats } = await supa.from("room_players")
      .select("seat").eq("room_id", room.id);
    const taken = new Set((seats ?? []).map((s) => s.seat));
    const effectiveMax = Math.min(room.max_players ?? MAX_ROOM_PLAYERS, MAX_ROOM_PLAYERS);
    if (taken.size >= effectiveMax) throw new Error(`Sala cheia (limite ${MAX_ROOM_PLAYERS} jogadores)`);
    let seat = 0;
    while (taken.has(seat)) seat++;

    const { error } = await supa.from("room_players").insert({
      room_id: room.id,
      guest_id: data.guestId,
      display_name: data.displayName,
      avatar_emoji: data.avatarEmoji ?? "🎭",
      seat,
      stack: room.start_stack,
    });
    if (error) throw new Error(error.message);
    return { roomId: room.id, code: room.code, seat };
  });

// ============ LEAVE ============
export const leaveRoom = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ roomId: z.string().uuid(), guestId: guestSchema }).parse(d))
  .handler(async ({ data }) => {
    const supa = await admin();
    await supa.from("room_players")
      .delete().eq("room_id", data.roomId).eq("guest_id", data.guestId);
    return { ok: true };
  });

// ============ TOGGLE READY ============
export const toggleReady = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ roomId: z.string().uuid(), guestId: guestSchema, ready: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    const supa = await admin();
    const { error } = await supa.from("room_players")
      .update({ is_ready: data.ready })
      .eq("room_id", data.roomId).eq("guest_id", data.guestId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ START HAND (creator only) ============
export const startRoomHand = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ roomId: z.string().uuid(), guestId: guestSchema }).parse(d))
  .handler(async ({ data }) => {
    const supa = await admin();
    const { data: room, error: rErr } = await supa.from("rooms")
      .select("*").eq("id", data.roomId).single();
    if (rErr || !room) throw new Error("Sala não encontrada");
    if (room.created_by_guest !== data.guestId) throw new Error("Apenas o criador pode iniciar");

    const { data: players, error: pErr } = await supa.from("room_players")
      .select("*").eq("room_id", data.roomId).order("seat", { ascending: true });
    if (pErr) throw new Error(pErr.message);
    if (!players || players.length < 2) throw new Error("Precisa de ao menos 2 jogadores");

    const { data: prev } = await supa.from("game_states")
      .select("state, version").eq("room_id", data.roomId).maybeSingle();

    let state: GameState;
    if (prev?.state) {
      const prevState = prev.state as unknown as GameState;
      const stackByGuest = new Map(prevState.players.map((p) => [p.id, p.stack]));
      state = createInitialState({
        players: players.map((rp) => ({
          id: rp.guest_id!,
          name: rp.display_name,
          isBot: false,
          startStack: stackByGuest.get(rp.guest_id!) ?? rp.stack,
        })),
        smallBlind: room.small_blind,
        bigBlind: room.big_blind,
        variant: room.variant as VariantId,
      });
    } else {
      state = createInitialState({
        players: players.map((rp) => ({
          id: rp.guest_id!,
          name: rp.display_name,
          isBot: false,
          startStack: rp.stack,
        })),
        smallBlind: room.small_blind,
        bigBlind: room.big_blind,
        variant: room.variant as VariantId,
      });
    }

    const newState = engineStartHand(state);

    const { error: upsertErr } = await supa.from("game_states")
      .upsert({
        room_id: data.roomId,
        state: newState as never,
        version: (prev?.version ?? 0) + 1,
        updated_at: new Date().toISOString(),
      });
    if (upsertErr) throw new Error(upsertErr.message);

    await supa.from("rooms").update({ status: "playing" }).eq("id", data.roomId);

    await supa.from("game_actions").insert({
      room_id: data.roomId,
      action_type: "hand_start",
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
export type SubmitActionInput = z.infer<typeof actionSchema>;

export const submitAction = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({
    roomId: z.string().uuid(),
    guestId: guestSchema,
    action: actionSchema,
  }).parse(d))
  .handler(async ({ data }) => {
    const supa = await admin();
    const { data: row, error } = await supa.from("game_states")
      .select("state, version").eq("room_id", data.roomId).single();
    if (error || !row) throw new Error("Estado não encontrado");
    const state = row.state as unknown as GameState;
    if (state.awaitingAdvance) throw new Error("Aguardando próxima mão");
    const current = state.players[state.actionIdx];
    if (current.id !== data.guestId) throw new Error("Não é sua vez");

    const newState = enginePlayerAction(state, data.guestId, data.action as PokerAction);

    await supa.from("game_states").update({
      state: newState as never,
      version: row.version + 1,
      updated_at: new Date().toISOString(),
    }).eq("room_id", data.roomId);

    await supa.from("game_actions").insert({
      room_id: data.roomId,
      action_type: data.action.type,
      payload: (data.action as never),
      hand_number: newState.handNumber,
    });

    return { ok: true, version: row.version + 1 };
  });

// ============ NEXT HAND ============
export const nextRoomHand = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ roomId: z.string().uuid(), guestId: guestSchema }).parse(d))
  .handler(async ({ data }) => {
    const supa = await admin();
    const { data: room } = await supa.from("rooms").select("created_by_guest").eq("id", data.roomId).single();
    if (!room || room.created_by_guest !== data.guestId) throw new Error("Só o criador avança");
    const { data: row, error } = await supa.from("game_states")
      .select("state, version").eq("room_id", data.roomId).single();
    if (error || !row) throw new Error("Estado não encontrado");
    const state = row.state as unknown as GameState;
    if (!state.awaitingAdvance) throw new Error("Mão em andamento");
    const newState = engineNextHand(state);
    await supa.from("game_states").update({
      state: newState as never,
      version: row.version + 1,
      updated_at: new Date().toISOString(),
    }).eq("room_id", data.roomId);
    await supa.from("game_actions").insert({
      room_id: data.roomId,
      action_type: "hand_start",
      hand_number: newState.handNumber,
    });
    return { ok: true };
  });

// ============ GET VIEW (masked por guestId) ============
export const getRoomView = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ roomId: z.string().uuid(), guestId: guestSchema }).parse(d))
  .handler(async ({ data }) => {
    const supa = await admin();
    const { data: row } = await supa.from("game_states")
      .select("state, version").eq("room_id", data.roomId).maybeSingle();
    if (!row) return { state: null, version: 0 };
    const state = row.state as unknown as GameState;
    const showdown = state.street === "showdown";
    const masked: GameState = {
      ...state,
      deck: [],
      players: state.players.map((p) => {
        if (p.id === data.guestId || showdown) return p;
        return { ...p, hole: p.hole.map(() => null as unknown as Card) };
      }),
    };
    return { state: masked, version: row.version };
  });
