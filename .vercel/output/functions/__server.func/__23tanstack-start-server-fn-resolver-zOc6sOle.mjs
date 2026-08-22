//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-zOc6sOle.js
var manifest = {
	"28c07e44642f707c87c0d9a4fe07c21eee2001afee8d25dca5dd3bacb6fbd285": {
		functionName: "submitAction_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	},
	"46e88b5816d6c80c13744b3ad10987854d967bd7fb8fbcdc11bdc6afa8bea26b": {
		functionName: "getRoomByCode_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	},
	"573aaae5ed954ebedc3dbafa50daf911c6bb786d98ae5d6ef582ddb0351f22cb": {
		functionName: "leaveRoom_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	},
	"6a56a1959ab0c01348361c8afd3f81642ccaed0e6f7386bdeffc960904161e74": {
		functionName: "createRoom_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	},
	"82da632dbd64be13103ad5d2c6c609412028d8e43b50ed2bc748dfa5e5a7b504": {
		functionName: "toggleReady_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	},
	"abab1adfa75250d6735bb6c291c8ca7e02026065f0ba33cf7eacb248ca857796": {
		functionName: "startRoomHand_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	},
	"b1eaa648fafcba7ac73372187e97f4cb3c08e5c04c0bd53ec434bee5327384db": {
		functionName: "joinRoom_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	},
	"c349f7ba386b3db5266825b9fcbfcbc603791dfa1ac8d8399a2e22004e009549": {
		functionName: "nextRoomHand_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	},
	"da1afb5b395ccee959dd11fae248ad34ede036cfec85f4f1b1f2881a34b11cde": {
		functionName: "getRoomView_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	},
	"fdc2173e7661366fb15b81b7f2a59874ae39dd1c548e0c8545afa35afbac2f46": {
		functionName: "getRoomLobby_createServerFn_handler",
		importer: () => import("./_ssr/rooms.functions-Bnx-BAHN.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
