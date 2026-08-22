import { i as __toESM } from "../_runtime.mjs";
import { a as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as isRedirect, _ as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as isAvatarId, o as randomAvatarId, r as DEFAULT_AVATAR_ID } from "./AvatarPicker-CbZ3CfpK.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-zOc6sOle.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { a as numberType, o as objectType, r as enumType, s as stringType, t as booleanType } from "../_libs/zod.mjs";
import { n as guestSchema, r as nameSchema, t as actionSchema } from "./rooms.shared-2_8e5J4s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guest-B77Sch8M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
}).parse(d)).handler(createSsrRpc("6a56a1959ab0c01348361c8afd3f81642ccaed0e6f7386bdeffc960904161e74"));
var joinRoom = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	code: stringType().min(4).max(20),
	guestId: guestSchema,
	displayName: nameSchema,
	avatarEmoji: stringType().max(32).optional()
}).parse(d)).handler(createSsrRpc("b1eaa648fafcba7ac73372187e97f4cb3c08e5c04c0bd53ec434bee5327384db"));
var leaveRoom = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(createSsrRpc("573aaae5ed954ebedc3dbafa50daf911c6bb786d98ae5d6ef582ddb0351f22cb"));
var toggleReady = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema,
	ready: booleanType()
}).parse(d)).handler(createSsrRpc("82da632dbd64be13103ad5d2c6c609412028d8e43b50ed2bc748dfa5e5a7b504"));
var startRoomHand = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(createSsrRpc("abab1adfa75250d6735bb6c291c8ca7e02026065f0ba33cf7eacb248ca857796"));
var submitAction = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema,
	action: actionSchema
}).parse(d)).handler(createSsrRpc("28c07e44642f707c87c0d9a4fe07c21eee2001afee8d25dca5dd3bacb6fbd285"));
var nextRoomHand = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(createSsrRpc("c349f7ba386b3db5266825b9fcbfcbc603791dfa1ac8d8399a2e22004e009549"));
var getRoomView = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(createSsrRpc("da1afb5b395ccee959dd11fae248ad34ede036cfec85f4f1b1f2881a34b11cde"));
var getRoomByCode = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ code: stringType().min(4).max(20) }).parse(d)).handler(createSsrRpc("46e88b5816d6c80c13744b3ad10987854d967bd7fb8fbcdc11bdc6afa8bea26b"));
var getRoomLobby = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	roomId: stringType().uuid(),
	guestId: guestSchema
}).parse(d)).handler(createSsrRpc("fdc2173e7661366fb15b81b7f2a59874ae39dd1c548e0c8545afa35afbac2f46"));
var GUEST_ID_KEY = "ipa_guest_id";
var GUEST_NAME_KEY = "ipa_guest_name";
var GUEST_AVATAR_KEY = "ipa_guest_avatar";
var LEGACY_EMOJI_KEY = "ipa_guest_emoji";
function makeId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `g_${crypto.randomUUID()}`;
	return `g_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}
function getGuestId() {
	if (typeof window === "undefined") return "";
	let id = window.localStorage.getItem(GUEST_ID_KEY);
	if (!id) {
		id = makeId();
		window.localStorage.setItem(GUEST_ID_KEY, id);
	}
	return id;
}
function getGuestName() {
	if (typeof window === "undefined") return "";
	return window.localStorage.getItem(GUEST_NAME_KEY) ?? "";
}
function setGuestName(name) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(GUEST_NAME_KEY, name.trim().slice(0, 20));
}
/** Retorna o AvatarId salvo. Se for emoji legado ou inválido, gera um aleatório e persiste. */
function getGuestAvatarId() {
	if (typeof window === "undefined") return DEFAULT_AVATAR_ID;
	const stored = window.localStorage.getItem(GUEST_AVATAR_KEY);
	if (isAvatarId(stored)) return stored;
	window.localStorage.removeItem(LEGACY_EMOJI_KEY);
	const fresh = randomAvatarId();
	window.localStorage.setItem(GUEST_AVATAR_KEY, fresh);
	return fresh;
}
function setGuestAvatarId(id) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(GUEST_AVATAR_KEY, id);
}
//#endregion
export { getRoomByCode as a, joinRoom as c, setGuestAvatarId as d, setGuestName as f, useServerFn as g, toggleReady as h, getGuestName as i, leaveRoom as l, submitAction as m, getGuestAvatarId as n, getRoomLobby as o, startRoomHand as p, getGuestId as r, getRoomView as s, createRoom as t, nextRoomHand as u };
