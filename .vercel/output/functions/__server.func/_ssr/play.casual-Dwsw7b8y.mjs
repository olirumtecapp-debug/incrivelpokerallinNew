import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as VARIANT_LIST } from "./variants-C5Uqq510.mjs";
import { t as sfx } from "./sfx-D-XZLET1.mjs";
import { t as AvatarBadge } from "./AvatarPicker-CbZ3CfpK.mjs";
import { n as PokerTable, t as PERSONALITIES } from "./PokerTable-D9YB4BLX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play.casual-Dwsw7b8y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CasualPage() {
	const [variant, setVariant] = (0, import_react.useState)("holdem");
	const [difficulty, setDifficulty] = (0, import_react.useState)(null);
	if (difficulty) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PokerTable, {
		difficulty,
		variant,
		modeLabel: `CASUAL · ${difficulty.toUpperCase()}`
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "ink-border-thick bg-pow-yellow text-ink-fixed p-4 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "font-display text-xl shrink-0",
				children: "← MENU"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl md:text-3xl truncate",
				children: "🎲 CASUAL"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-4xl mx-auto p-4 md:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "halftone-yellow ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "MODALIDADE"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-3 mb-6",
					children: VARIANT_LIST.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sfx.unlock();
							sfx.play("click");
							setVariant(v.id);
						},
						className: `ink-border-thick hard-shadow-sm rounded-lg p-4 text-left transition-transform hover:-translate-y-1 ${variant === v.id ? "bg-pow-yellow text-ink-fixed" : "bg-card"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl mb-1",
								children: v.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg",
								children: v.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: v.description
							}),
							variant === v.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-sm text-pow-red",
								children: "✓ ESCOLHIDA"
							})
						]
					}, v.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "halftone-yellow ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "ESCOLHA O ADVERSÁRIO"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: PERSONALITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sfx.unlock();
							setDifficulty(p.difficulty);
						},
						className: "ink-border-thick hard-shadow bg-card rounded-lg p-4 text-left transition-transform hover:-translate-y-1 hover:-translate-x-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `${p.avatarBg} ink-border-thick w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarBadge, {
									avatarId: p.avatarId,
									size: 60,
									className: "!border-0"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-2xl truncate",
										children: p.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-pow-red",
										children: p.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground uppercase mt-1",
										children: ["Dif: ", p.difficulty]
									})
								]
							})]
						})
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tutorial",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
							variant: "secondary",
							children: "📖 REVER REGRAS"
						})
					})
				})
			]
		})]
	});
}
//#endregion
export { CasualPage as component };
