import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./ComicButton-C6kzs4iI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AvatarPicker-CbZ3CfpK.js
var import_jsx_runtime = require_jsx_runtime();
var AVATARS = [
	{
		id: "shark",
		name: "O Tubarão",
		url: {
			version: 1,
			asset_id: "13446e80-73af-4c52-bbe1-e0a8346a6d9c",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/13446e80-73af-4c52-bbe1-e0a8346a6d9c/shark.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/13446e80-73af-4c52-bbe1-e0a8346a6d9c/shark.png",
			original_filename: "shark.png",
			size: 229518,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-slate-800"
	},
	{
		id: "queen",
		name: "A Rainha",
		url: {
			version: 1,
			asset_id: "adb965de-546e-4da0-92da-2f90699e07d9",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/adb965de-546e-4da0-92da-2f90699e07d9/queen.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/adb965de-546e-4da0-92da-2f90699e07d9/queen.png",
			original_filename: "queen.png",
			size: 271689,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-pow-yellow"
	},
	{
		id: "cowboy",
		name: "O Cowboy",
		url: {
			version: 1,
			asset_id: "450d696b-05d0-4789-a5b5-7d95399f1bbc",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/450d696b-05d0-4789-a5b5-7d95399f1bbc/cowboy.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/450d696b-05d0-4789-a5b5-7d95399f1bbc/cowboy.png",
			original_filename: "cowboy.png",
			size: 297588,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-amber-700"
	},
	{
		id: "detective",
		name: "O Detetive",
		url: {
			version: 1,
			asset_id: "facdb152-f798-45c6-8d02-fd41ec528bb3",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/facdb152-f798-45c6-8d02-fd41ec528bb3/detective.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/facdb152-f798-45c6-8d02-fd41ec528bb3/detective.png",
			original_filename: "detective.png",
			size: 206971,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-slate-500"
	},
	{
		id: "mage",
		name: "O Mago",
		url: {
			version: 1,
			asset_id: "3df32436-4fb4-42f1-b483-1b8a733cfaf4",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/3df32436-4fb4-42f1-b483-1b8a733cfaf4/mage.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/3df32436-4fb4-42f1-b483-1b8a733cfaf4/mage.png",
			original_filename: "mage.png",
			size: 342658,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-purple-700"
	},
	{
		id: "hacker",
		name: "A Hacker",
		url: {
			version: 1,
			asset_id: "3150d198-0e3a-4bb8-b246-fa106f627112",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/3150d198-0e3a-4bb8-b246-fa106f627112/hacker.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/3150d198-0e3a-4bb8-b246-fa106f627112/hacker.png",
			original_filename: "hacker.png",
			size: 323209,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:23Z"
		}.url,
		accent: "bg-emerald-500"
	},
	{
		id: "boss",
		name: "O Chefe",
		url: {
			version: 1,
			asset_id: "127b2e98-1556-4554-a52d-a8dc9d2e8638",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/127b2e98-1556-4554-a52d-a8dc9d2e8638/boss.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/127b2e98-1556-4554-a52d-a8dc9d2e8638/boss.png",
			original_filename: "boss.png",
			size: 322929,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-pow-red"
	},
	{
		id: "rocker",
		name: "O Rocker",
		url: {
			version: 1,
			asset_id: "6413bb42-881a-4c5b-ab48-d48a6e622a98",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/6413bb42-881a-4c5b-ab48-d48a6e622a98/rocker.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/6413bb42-881a-4c5b-ab48-d48a6e622a98/rocker.png",
			original_filename: "rocker.png",
			size: 362976,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-orange-500"
	},
	{
		id: "robot",
		name: "O Robô",
		url: {
			version: 1,
			asset_id: "79713609-4591-4297-b9f0-03ab09accebe",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/79713609-4591-4297-b9f0-03ab09accebe/robot.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/79713609-4591-4297-b9f0-03ab09accebe/robot.png",
			original_filename: "robot.png",
			size: 211067,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-zinc-400"
	},
	{
		id: "pirate",
		name: "O Pirata",
		url: {
			version: 1,
			asset_id: "f7fef1f6-a062-4f95-b9f0-30f3a4411ad8",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/f7fef1f6-a062-4f95-b9f0-30f3a4411ad8/pirate.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/f7fef1f6-a062-4f95-b9f0-30f3a4411ad8/pirate.png",
			original_filename: "pirate.png",
			size: 336123,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-teal-600"
	},
	{
		id: "ninja",
		name: "A Ninja",
		url: {
			version: 1,
			asset_id: "00e70e8f-af20-41dd-b9c3-a5d80a5f45ae",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/00e70e8f-af20-41dd-b9c3-a5d80a5f45ae/ninja.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/00e70e8f-af20-41dd-b9c3-a5d80a5f45ae/ninja.png",
			original_filename: "ninja.png",
			size: 261716,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-neutral-900"
	},
	{
		id: "clown",
		name: "O Palhaço",
		url: {
			version: 1,
			asset_id: "58c2c864-92ed-4abb-ad41-17c312eddbda",
			project_id: "11006422-cf6a-4c0d-bcb3-20b2fbb0f967",
			url: "/__l5e/assets-v1/58c2c864-92ed-4abb-ad41-17c312eddbda/clown.png",
			r2_key: "a/v1/11006422-cf6a-4c0d-bcb3-20b2fbb0f967/58c2c864-92ed-4abb-ad41-17c312eddbda/clown.png",
			original_filename: "clown.png",
			size: 379528,
			content_type: "image/png",
			created_at: "2026-07-22T19:24:22Z"
		}.url,
		accent: "bg-pink-500"
	}
];
var AVATAR_MAP = Object.fromEntries(AVATARS.map((a) => [a.id, a]));
var DEFAULT_AVATAR_ID = "shark";
function getAvatar(id) {
	if (id && AVATAR_MAP[id]) return AVATAR_MAP[id];
	return AVATAR_MAP[DEFAULT_AVATAR_ID];
}
function isAvatarId(id) {
	return !!id && !!AVATAR_MAP[id];
}
function randomAvatarId() {
	return AVATARS[Math.floor(Math.random() * AVATARS.length)].id;
}
/** Grade HQ 3x4 de avatares selecionáveis. */
function AvatarPicker({ value, onChange, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid grid-cols-4 sm:grid-cols-6 gap-2", className),
		children: AVATARS.map((a) => {
			const selected = a.id === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(a.id),
				title: a.name,
				"aria-label": a.name,
				"aria-pressed": selected,
				className: cn("ink-border rounded-lg overflow-hidden aspect-square bg-white text-ink-fixed transition-transform", "hover:scale-105 hover:hard-shadow-sm", selected && "ink-border-thick hard-shadow bg-pow-yellow text-ink-fixed scale-105"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: a.url,
					alt: a.name,
					width: 128,
					height: 128,
					loading: "lazy",
					className: "w-full h-full object-cover"
				})
			}, a.id);
		})
	});
}
/** Avatar circular pequeno para uso em listas / assentos. */
function AvatarBadge({ avatarId, size = 40, className }) {
	const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
	const fallback = !AVATARS.some((a) => a.id === avatarId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("ink-border shrink-0 rounded-full overflow-hidden bg-white text-ink-fixed grid place-items-center", className),
		style: {
			width: size,
			height: size
		},
		children: fallback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-xs",
			children: "?"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: avatar.url,
			alt: avatar.name,
			width: size,
			height: size,
			loading: "lazy",
			className: "w-full h-full object-cover"
		})
	});
}
//#endregion
export { isAvatarId as a, getAvatar as i, AvatarPicker as n, randomAvatarId as o, DEFAULT_AVATAR_ID as r, AvatarBadge as t };
