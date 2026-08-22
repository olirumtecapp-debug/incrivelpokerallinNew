import { a as numberType, i as literalType, n as discriminatedUnionType, o as objectType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms.shared-2_8e5J4s.js
var nameSchema = stringType().trim().min(2).max(20);
var guestSchema = stringType().min(8).max(64);
var actionSchema = discriminatedUnionType("type", [
	objectType({ type: literalType("fold") }),
	objectType({ type: literalType("check") }),
	objectType({ type: literalType("call") }),
	objectType({
		type: literalType("raise"),
		amount: numberType().int().min(1)
	}),
	objectType({ type: literalType("allin") })
]);
//#endregion
export { guestSchema as n, nameSchema as r, actionSchema as t };
