import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LandscapeHint-BRdq-UXF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Balão HQ orientando o jogador a manter o celular EM PÉ (portrait).
* O layout HQ foi desenhado para portrait mobile — em landscape as cartas
* ficam pequenas demais, então bloqueamos e pedimos para girar de volta.
* Em modo `blocking`, vira um overlay de tela cheia impedindo interação
* (fallback universal para navegadores que não travam orientação — ex.: iOS Safari).
*/
function LandscapeHint({ onlyMobileLandscape = true, dismissible = false, storageKey = "orientation-hint-dismissed", blocking = false }) {
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (dismissible && typeof window !== "undefined") setDismissed(localStorage.getItem(storageKey) === "1");
	}, [dismissible, storageKey]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const mq = window.matchMedia(onlyMobileLandscape ? "(max-width: 900px) and (orientation: landscape) and (max-height: 500px)" : "(orientation: landscape)");
		const update = () => setVisible(mq.matches);
		update();
		mq.addEventListener("change", update);
		window.addEventListener("resize", update);
		return () => {
			mq.removeEventListener("change", update);
			window.removeEventListener("resize", update);
		};
	}, [onlyMobileLandscape]);
	if (!visible || dismissed) return null;
	if (blocking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[9999] bg-ink/90 grid place-items-center p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ink-border-thick hard-shadow-lg halftone-yellow bg-pow-yellow rounded-lg px-6 py-8 max-w-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-6xl mb-3 animate-shake",
					"aria-hidden": true,
					children: "📱"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-ink-fixed leading-tight mb-2",
					children: "GIRE PRA CIMA!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-body text-sm text-ink-fixed font-bold",
					children: [
						"Este jogo funciona melhor com o celular ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "whitespace-nowrap",
							children: "EM PÉ"
						}),
						"."
					]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ink-border-thick hard-shadow-sm halftone-yellow bg-pow-yellow rounded-md px-3 py-2 flex items-center gap-3 text-ink-fixed animate-shake",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xl shrink-0",
				"aria-hidden": true,
				children: "📱"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-display text-sm leading-tight flex-1 min-w-0",
				children: ["Melhor experiência com o celular ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "whitespace-nowrap",
					children: "EM PÉ!"
				})]
			}),
			dismissible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					if (typeof window !== "undefined") localStorage.setItem(storageKey, "1");
					setDismissed(true);
				},
				className: "ink-border bg-white text-ink-fixed font-display text-xs px-2 py-1 rounded shrink-0 hover:bg-pow-red hover:text-white transition-colors",
				"aria-label": "Ok, entendi",
				children: "OK"
			})
		]
	});
}
//#endregion
export { LandscapeHint as t };
