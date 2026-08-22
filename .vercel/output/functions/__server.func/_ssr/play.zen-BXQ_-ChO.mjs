import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as VARIANT_LIST } from "./variants-C5Uqq510.mjs";
import { t as sfx } from "./sfx-D-XZLET1.mjs";
import { n as PokerTable } from "./PokerTable-D9YB4BLX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play.zen-BXQ_-ChO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ZenPage() {
	const [variant, setVariant] = (0, import_react.useState)(null);
	if (variant) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PokerTable, {
		difficulty: "beginner",
		variant,
		modeLabel: "🧘 ZEN POKER",
		smallBlind: 5,
		bigBlind: 10,
		startStack: 2e3
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "ink-border-thick bg-pow-blue text-white p-4 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "font-display text-xl text-white shrink-0",
				children: "← MENU"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl md:text-3xl truncate",
				children: "🧘 ZEN POKER"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-3xl mx-auto p-4 md:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 font-body",
				children: "Escolha a modalidade. Blinds baixas, IA relaxada, stack dobrado."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-3",
				children: VARIANT_LIST.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						sfx.unlock();
						setVariant(v.id);
					},
					className: "ink-border-thick hard-shadow bg-card rounded-lg p-4 text-left transition-transform hover:-translate-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl mb-1",
							children: v.emoji
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-xl",
							children: v.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: v.description
						})
					]
				}, v.id))
			})]
		})]
	});
}
//#endregion
export { ZenPage as component };
