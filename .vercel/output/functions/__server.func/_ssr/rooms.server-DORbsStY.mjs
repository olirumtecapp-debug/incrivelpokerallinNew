//#region node_modules/.nitro/vite/services/ssr/assets/rooms.server-DORbsStY.js
function randomCode() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "PKR-";
	for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * 32)];
	return out;
}
async function getAdmin() {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	return supabaseAdmin;
}
//#endregion
export { getAdmin, randomCode };
