import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { a as numberType, o as objectType, r as enumType, s as stringType, t as booleanType } from "../_libs/zod.mjs";
import { n as guestSchema, r as nameSchema, t as actionSchema } from "./rooms.shared-2_8e5J4s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms.functions-Bnx-BAHN.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var createRoom_createServerFn_handler = createServerRpc({
	id: "6a56a1959ab0c01348361c8afd3f81642ccaed0e6f7386bdeffc960904161e74",
	name: "createRoom",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => createRoom.__executeServer(opts));
var createRoom = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	guestId: guestSchema,
	displayName: nameSchema,
	avatarEmoji: stringType().max(32).optional(),
	variant: enumType([
		"holdem",
		"omaha",
		"shortdeck"
	]),
	smallBlind: numberType().int().min(1).max(1e3),
	bigBlind: numberType().int().min(2).max(2e3),
	startStack: numberType().int().min(100).max(1e5),
	maxPlayers: numberType().int().min(2).max(6)
}).parse(d)).handler(createRoom_createServerFn_handler, async ({ data }) => {
	const { getAdmin, randomCode } = await import("./rooms.server-DORbsStY.mjs");
	const supa = await getAdmin();
	const maxPlayers = Math.min(data.maxPlayers, 6);
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
		status: "lobby"
	}).select("*").single();
	if (error) throw new Error(error.message);
	const { error: joinErr } = await supa.from("room_players").insert({
		room_id: room.id,
		guest_id: data.guestId,
		display_name: data.displayName,
		avatar_emoji: data.avatarEmoji ?? "🎭",
		seat: 0,
		stack: data.startStack
	});
	if (joinErr) throw new Error(joinErr.message);
	return {
		code,
		roomId: room.id
	};
});
var joinRoom_createServerFn_handler = createServerRpc({
	id: "b1eaa648fafcba7ac73372187e97f4cb3c08e5c04c0bd53ec434bee5327384db",
	name: "joinRoom",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => joinRoom.__executeServer(opts));
var joinRoom = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	code: stringType().min(4).max(20),
	guestId: guestSchema,
	displayName: nameSchema,
	avatarEmoji: stringType().max(32).optional()
}).parse(d)).handler(joinRoom_createServerFn_handler, async ({ data }) => {
	const { getAdmin } = await import("./rooms.server-DORbsStY.mjs");
	const supa = await getAdmin();
	const { data: room, error: roomErr } = await supa.from("rooms").select("*").eq("code", data.code.toUpperCase()).maybeSingle();
	if (roomErr) throw new Error(roomErr.message);
	if (!room) throw new Error("Sala não encontrada");
	const { data: existing } = await supa.from("room_players").select("seat").eq("room_id", room.id).eq("guest_id", data.guestId).maybeSingle();
	if (existing) return {
		roomId: room.id,
		code: room.code,
		seat: existing.seat
	};
	const { data: seats } = await supa.from("room_players").select("seat").eq("room_id", room.id);
	const taken = new Set((seats ?? []).map((s) => s.seat));
	const effectiveMax = Math.min(room.max_players ?? 6, 6);
	if (taken.size >= effectiveMax) throw new Error(`Sala cheia (limite 6 jogadores)`);
	let seat = 0;
	while (taken.has(seat)) seat++;
	const { error } = await supa.from("room_players").insert({
		room_id: room.id,
		guest_id: data.guestId,
		display_name: data.displayName,
		avatar_emoji: data.avatarEmoji ?? "🎭",
		seat,
		stack: room.start_stack
	});
	if (error) throw new Error(error.message);
	return {
		roomId: room.id,
		code: room.code,
		seat
	};
});
var leaveRoom_createServerFn_handler = createServerRpc({
	id: "573aaae5ed954ebedc3dbafa50daf911c6bb786d98ae5d6ef582ddb0351f22cb",
	name: "leaveRoom",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => leaveRoom.__executeServer(opts));
var leaveRoom = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(leaveRoom_createServerFn_handler, async ({ data }) => {
	const { getAdmin } = await import("./rooms.server-DORbsStY.mjs");
	await (await getAdmin()).from("room_players").delete().eq("room_id", data.roomId).eq("guest_id", data.guestId);
	return { ok: true };
});
var toggleReady_createServerFn_handler = createServerRpc({
	id: "82da632dbd64be13103ad5d2c6c609412028d8e43b50ed2bc748dfa5e5a7b504",
	name: "toggleReady",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => toggleReady.__executeServer(opts));
var toggleReady = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema,
	ready: booleanType()
}).parse(d)).handler(toggleReady_createServerFn_handler, async ({ data }) => {
	const { getAdmin } = await import("./rooms.server-DORbsStY.mjs");
	const { error } = await (await getAdmin()).from("room_players").update({ is_ready: data.ready }).eq("room_id", data.roomId).eq("guest_id", data.guestId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var startRoomHand_createServerFn_handler = createServerRpc({
	id: "abab1adfa75250d6735bb6c291c8ca7e02026065f0ba33cf7eacb248ca857796",
	name: "startRoomHand",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => startRoomHand.__executeServer(opts));
var startRoomHand = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(startRoomHand_createServerFn_handler, async ({ data }) => {
	const { getAdmin } = await import("./rooms.server-DORbsStY.mjs");
	const { createInitialState, startHand: engineStartHand } = await import("./engine-CieTYigx.mjs").then((n) => n.n).then((n) => n.n);
	const supa = await getAdmin();
	const { data: room, error: rErr } = await supa.from("rooms").select("*").eq("id", data.roomId).single();
	if (rErr || !room) throw new Error("Sala não encontrada");
	if (room.created_by_guest !== data.guestId) throw new Error("Apenas o criador pode iniciar");
	const { data: players, error: pErr } = await supa.from("room_players").select("*").eq("room_id", data.roomId).order("seat", { ascending: true });
	if (pErr) throw new Error(pErr.message);
	if (!players || players.length < 2) throw new Error("Precisa de ao menos 2 jogadores");
	const { data: prev } = await supa.from("game_states").select("state, version").eq("room_id", data.roomId).maybeSingle();
	let state;
	if (prev?.state) {
		const prevState = prev.state;
		const stackByGuest = new Map(prevState.players.map((p) => [p.id, p.stack]));
		state = createInitialState({
			players: players.map((rp) => ({
				id: rp.guest_id,
				name: rp.display_name,
				isBot: false,
				startStack: stackByGuest.get(rp.guest_id) ?? rp.stack
			})),
			smallBlind: room.small_blind,
			bigBlind: room.big_blind,
			variant: room.variant
		});
	} else state = createInitialState({
		players: players.map((rp) => ({
			id: rp.guest_id,
			name: rp.display_name,
			isBot: false,
			startStack: rp.stack
		})),
		smallBlind: room.small_blind,
		bigBlind: room.big_blind,
		variant: room.variant
	});
	const newState = engineStartHand(state);
	const { error: upsertErr } = await supa.from("game_states").upsert({
		room_id: data.roomId,
		state: newState,
		version: (prev?.version ?? 0) + 1,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (upsertErr) throw new Error(upsertErr.message);
	await supa.from("rooms").update({ status: "playing" }).eq("id", data.roomId);
	await supa.from("game_actions").insert({
		room_id: data.roomId,
		action_type: "hand_start",
		hand_number: newState.handNumber
	});
	return { ok: true };
});
var submitAction_createServerFn_handler = createServerRpc({
	id: "28c07e44642f707c87c0d9a4fe07c21eee2001afee8d25dca5dd3bacb6fbd285",
	name: "submitAction",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => submitAction.__executeServer(opts));
var submitAction = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema,
	action: actionSchema
}).parse(d)).handler(submitAction_createServerFn_handler, async ({ data }) => {
	const { getAdmin } = await import("./rooms.server-DORbsStY.mjs");
	const { playerAction: enginePlayerAction } = await import("./engine-CieTYigx.mjs").then((n) => n.n).then((n) => n.n);
	const supa = await getAdmin();
	const { data: row, error } = await supa.from("game_states").select("state, version").eq("room_id", data.roomId).single();
	if (error || !row) throw new Error("Estado não encontrado");
	const state = row.state;
	if (state.awaitingAdvance) throw new Error("Aguardando próxima mão");
	if (state.players[state.actionIdx].id !== data.guestId) throw new Error("Não é sua vez");
	const newState = enginePlayerAction(state, data.guestId, data.action);
	await supa.from("game_states").update({
		state: newState,
		version: row.version + 1,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("room_id", data.roomId);
	await supa.from("game_actions").insert({
		room_id: data.roomId,
		action_type: data.action.type,
		payload: data.action,
		hand_number: newState.handNumber
	});
	return {
		ok: true,
		version: row.version + 1
	};
});
var nextRoomHand_createServerFn_handler = createServerRpc({
	id: "c349f7ba386b3db5266825b9fcbfcbc603791dfa1ac8d8399a2e22004e009549",
	name: "nextRoomHand",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => nextRoomHand.__executeServer(opts));
var nextRoomHand = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(nextRoomHand_createServerFn_handler, async ({ data }) => {
	const { getAdmin } = await import("./rooms.server-DORbsStY.mjs");
	const { nextHand: engineNextHand } = await import("./engine-CieTYigx.mjs").then((n) => n.n).then((n) => n.n);
	const supa = await getAdmin();
	const { data: room } = await supa.from("rooms").select("created_by_guest").eq("id", data.roomId).single();
	if (!room || room.created_by_guest !== data.guestId) throw new Error("Só o criador avança");
	const { data: row, error } = await supa.from("game_states").select("state, version").eq("room_id", data.roomId).single();
	if (error || !row) throw new Error("Estado não encontrado");
	const state = row.state;
	if (!state.awaitingAdvance) throw new Error("Mão em andamento");
	const newState = engineNextHand(state);
	await supa.from("game_states").update({
		state: newState,
		version: row.version + 1,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("room_id", data.roomId);
	await supa.from("game_actions").insert({
		room_id: data.roomId,
		action_type: "hand_start",
		hand_number: newState.handNumber
	});
	return { ok: true };
});
var getRoomView_createServerFn_handler = createServerRpc({
	id: "da1afb5b395ccee959dd11fae248ad34ede036cfec85f4f1b1f2881a34b11cde",
	name: "getRoomView",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => getRoomView.__executeServer(opts));
var getRoomView = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(getRoomView_createServerFn_handler, async ({ data }) => {
	const { getAdmin } = await import("./rooms.server-DORbsStY.mjs");
	const { data: row } = await (await getAdmin()).from("game_states").select("state, version").eq("room_id", data.roomId).maybeSingle();
	if (!row) return {
		state: null,
		version: 0
	};
	const state = row.state;
	const showdown = state.street === "showdown";
	return {
		state: {
			...state,
			deck: [],
			players: state.players.map((p) => {
				if (p.id === data.guestId || showdown) return p;
				return {
					...p,
					hole: p.hole.map(() => null)
				};
			})
		},
		version: row.version
	};
});
var getRoomByCode_createServerFn_handler = createServerRpc({
	id: "46e88b5816d6c80c13744b3ad10987854d967bd7fb8fbcdc11bdc6afa8bea26b",
	name: "getRoomByCode",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => getRoomByCode.__executeServer(opts));
var getRoomByCode = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ code: stringType().min(4).max(20) }).parse(d)).handler(getRoomByCode_createServerFn_handler, async ({ data }) => {
	const { getAdmin } = await import("./rooms.server-DORbsStY.mjs");
	const { data: room } = await (await getAdmin()).from("rooms").select("id, code, status, small_blind, big_blind, variant, max_players").eq("code", data.code.toUpperCase()).maybeSingle();
	if (!room) return { room: null };
	return { room };
});
var getRoomLobby_createServerFn_handler = createServerRpc({
	id: "fdc2173e7661366fb15b81b7f2a59874ae39dd1c548e0c8545afa35afbac2f46",
	name: "getRoomLobby",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => getRoomLobby.__executeServer(opts));
var getRoomLobby = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(getRoomLobby_createServerFn_handler, async ({ data }) => {
	const { getAdmin } = await import("./rooms.server-DORbsStY.mjs");
	const supa = await getAdmin();
	const { data: room } = await supa.from("rooms").select("id, code, status, small_blind, big_blind, variant, max_players, created_by_guest").eq("id", data.roomId).maybeSingle();
	if (!room) return {
		room: null,
		players: [],
		isMember: false,
		isHost: false
	};
	const { data: pls } = await supa.from("room_players").select("id, room_id, guest_id, display_name, avatar_emoji, seat, stack, is_ready, joined_at").eq("room_id", data.roomId).order("seat", { ascending: true });
	const rows = pls ?? [];
	const isMember = rows.some((p) => p.guest_id === data.guestId);
	const masked = rows.map((p) => ({
		id: p.id,
		seat: p.seat,
		display_name: p.display_name,
		avatar_emoji: p.avatar_emoji,
		stack: p.stack,
		is_ready: p.is_ready,
		joined_at: p.joined_at,
		guest_id: p.guest_id === data.guestId ? p.guest_id : null,
		is_host: p.guest_id === room.created_by_guest,
		is_self: p.guest_id === data.guestId
	}));
	return {
		room: {
			id: room.id,
			code: room.code,
			status: room.status,
			small_blind: room.small_blind,
			big_blind: room.big_blind,
			variant: room.variant,
			max_players: room.max_players
		},
		players: masked,
		isMember,
		isHost: room.created_by_guest === data.guestId
	};
});
//#endregion
export { createRoom_createServerFn_handler, getRoomByCode_createServerFn_handler, getRoomLobby_createServerFn_handler, getRoomView_createServerFn_handler, joinRoom_createServerFn_handler, leaveRoom_createServerFn_handler, nextRoomHand_createServerFn_handler, startRoomHand_createServerFn_handler, submitAction_createServerFn_handler, toggleReady_createServerFn_handler };
