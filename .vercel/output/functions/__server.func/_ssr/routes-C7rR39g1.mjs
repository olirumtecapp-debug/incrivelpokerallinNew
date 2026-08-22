import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn, t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as LandscapeHint } from "./LandscapeHint-BRdq-UXF.mjs";
import { t as ThemeToggle } from "./ThemeToggle-Csl9CZxL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C7rR39g1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var logo_default = "/assets/logo-r2Rh1qQ5.png";
var hero_bg_default = "/assets/hero-bg-BN_BYILm.jpg";
function isMobileDevice() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
async function lockPortrait() {
	if (typeof window === "undefined") return;
	if (!isMobileDevice()) return;
	try {
		const orient = window.screen?.orientation ?? null;
		if (orient?.lock) await orient.lock("portrait");
	} catch {}
}
function unlockOrientation() {
	if (typeof window === "undefined") return;
	try {
		window.screen?.orientation?.unlock?.();
	} catch {}
}
function FullscreenToggle({ className }) {
	const [supported, setSupported] = (0, import_react.useState)(false);
	const [isFs, setIsFs] = (0, import_react.useState)(false);
	const [showHint, setShowHint] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = document.documentElement;
		const ok = !!(el.requestFullscreen || el.webkitRequestFullscreen);
		setSupported(ok);
		const onChange = () => setIsFs(!!document.fullscreenElement);
		document.addEventListener("fullscreenchange", onChange);
		document.addEventListener("webkitfullscreenchange", onChange);
		return () => {
			document.removeEventListener("fullscreenchange", onChange);
			document.removeEventListener("webkitfullscreenchange", onChange);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isFs) {
			unlockOrientation();
			return;
		}
		lockPortrait();
		setShowHint(true);
		const t = setTimeout(() => setShowHint(false), 3e3);
		return () => clearTimeout(t);
	}, [isFs]);
	if (!supported) return null;
	async function toggle() {
		try {
			const doc = document;
			const el = document.documentElement;
			if (document.fullscreenElement) {
				if (document.exitFullscreen) await document.exitFullscreen();
				else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
			} else if (el.requestFullscreen) await el.requestFullscreen();
			else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("fixed bottom-4 right-4 landscape-short:bottom-1 landscape-short:right-1 z-50 flex flex-col items-end gap-2", className),
		children: [isFs && showHint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ink-border bg-card text-card-foreground font-body text-xs px-2 py-1 hard-shadow-sm max-w-[180px] text-right",
			children: "toque em SAIR para voltar"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: toggle,
			"aria-label": isFs ? "Sair da tela cheia" : "Entrar em tela cheia",
			className: cn("ink-border-thick hard-shadow-sm font-display tracking-wide px-3 py-2 text-sm transition-all", "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none", isFs ? "bg-pow-red text-white" : "bg-pow-yellow text-ink-fixed"),
			children: isFs ? "✕ SAIR" : "⛶ TELA CHEIA"
		})]
	});
}
var MODES = [
	{
		to: "/play/campaign",
		title: "CAMPANHA",
		subtitle: "Copa do Mundo de Poker HQ",
		color: "bg-pow-red text-white",
		emoji: "🏆"
	},
	{
		to: "/play/casual",
		title: "CASUAL",
		subtitle: "Partida rápida contra a IA",
		color: "bg-pow-yellow text-ink-fixed",
		emoji: "🎲"
	},
	{
		to: "/play/zen",
		title: "ZEN POKER",
		subtitle: "Modo relax, sem pressão",
		color: "bg-pow-blue text-white",
		emoji: "🧘"
	},
	{
		to: "/play/multiplayer",
		title: "MULTIPLAYER",
		subtitle: "Sala privada com amigos",
		color: "bg-felt text-white",
		emoji: "👥"
	}
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen relative",
		style: {
			backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${hero_bg_default})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundAttachment: "fixed"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 halftone opacity-[0.04] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-6xl mx-auto px-4 py-4 md:py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandscapeHint, { dismissible: true })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logo_default,
							alt: "Incrível Poker All In",
							className: "w-full max-w-[200px] sm:max-w-[240px] md:max-w-[300px] h-auto drop-shadow-[6px_6px_0_rgba(0,0,0,0.6)]"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 md:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3",
						children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: m.to,
							className: "block group",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `${m.color} ink-border-thick hard-shadow-lg rounded-lg p-3 md:p-4 transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 relative overflow-hidden`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute -top-3 -right-3 text-6xl opacity-20",
									children: m.emoji
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-2xl mb-1",
											children: m.emoji
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-xl md:text-2xl",
											children: m.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-body text-xs md:text-sm font-semibold opacity-90",
											children: m.subtitle
										})
									]
								})]
							})
						}, m.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tutorial",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
								variant: "secondary",
								size: "sm",
								children: "📖 COMO JOGAR"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
								variant: "secondary",
								size: "sm",
								children: "⚙️ AJUSTES"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "mt-10 text-center text-white/60 font-body text-xs",
						children: "Incrível Poker All In · Feito em estilo HQ · v1.0"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed top-4 right-4 z-50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullscreenToggle, {})
		]
	});
}
//#endregion
export { Home as component };
