import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as VARIANT_LIST } from "./variants-C5Uqq510.mjs";
import { t as sfx } from "./sfx-D-XZLET1.mjs";
import { t as ThemeToggle } from "./ThemeToggle-Csl9CZxL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DKAD1sWz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THEMES = [
	{
		id: "hq",
		name: "Clássica HQ",
		cls: "",
		swatch: "bg-pow-yellow",
		desc: "O visual pop art padrão."
	},
	{
		id: "neon",
		name: "Neon Noturna",
		cls: "theme-neon",
		swatch: "bg-purple-500",
		desc: "Cores fluorescentes de cassino noturno."
	},
	{
		id: "minimal",
		name: "Minimalista",
		cls: "theme-minimal",
		swatch: "bg-gray-200",
		desc: "Tudo mais limpo e direto."
	}
];
function Settings() {
	const [theme, setTheme] = (0, import_react.useState)("hq");
	const [sfxOn, setSfxOn] = (0, import_react.useState)(true);
	const [volume, setVolume] = (0, import_react.useState)(40);
	(0, import_react.useEffect)(() => {
		const saved = typeof window !== "undefined" ? localStorage.getItem("ip_theme") : null;
		if (saved) setTheme(saved);
		setSfxOn(sfx.getEnabled());
		setVolume(Math.round(sfx.getVolume() * 100));
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof document === "undefined") return;
		document.documentElement.classList.remove("theme-neon", "theme-minimal");
		const t = THEMES.find((x) => x.id === theme);
		if (t && t.cls) document.documentElement.classList.add(t.cls);
		localStorage.setItem("ip_theme", theme);
	}, [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "ink-border-thick bg-pow-blue p-4 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "font-display text-xl text-white shrink-0",
				children: "← MENU"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl md:text-3xl text-white truncate",
				children: "⚙️ AJUSTES"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-3xl mx-auto p-4 md:p-6 space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl mb-3",
					children: "MODO"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ink-border-thick hard-shadow-sm bg-card text-card-foreground p-4 rounded-lg flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg",
						children: "Claro / Escuro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: "Alterna o esquema global. Contrastes ajustados para AA."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl mb-3",
					children: "TEMA DA MESA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-3",
					children: THEMES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sfx.unlock();
							sfx.play("click");
							setTheme(t.id);
						},
						className: `ink-border-thick hard-shadow-sm rounded-lg p-4 text-left transition-transform hover:-translate-y-1 ${theme === t.id ? "bg-pow-yellow text-ink-fixed" : "bg-card"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-full h-16 ${t.swatch} ink-border rounded mb-3` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: t.desc
							}),
							theme === t.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-sm text-pow-red",
								children: "✓ ATIVO"
							})
						]
					}, t.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl mb-3",
					children: "SOM"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ink-border-thick hard-shadow-sm bg-card p-4 rounded-lg space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: sfxOn,
							onChange: (e) => {
								sfx.unlock();
								setSfxOn(e.target.checked);
								sfx.setEnabled(e.target.checked);
								if (e.target.checked) sfx.play("chipDrop");
							},
							className: "w-5 h-5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg",
							children: "Efeitos sonoros"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between font-body text-sm font-bold mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Volume" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-pow-red",
							children: [volume, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 100,
						step: 5,
						value: volume,
						onChange: (e) => {
							const v = parseInt(e.target.value, 10);
							setVolume(v);
							sfx.setVolume(v / 100);
						},
						onMouseUp: () => {
							sfx.unlock();
							sfx.play("chipDrop");
						},
						onTouchEnd: () => {
							sfx.unlock();
							sfx.play("chipDrop");
						},
						className: "w-full",
						disabled: !sfxOn
					})] })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl mb-3",
					children: "MODALIDADES DISPONÍVEIS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: VARIANT_LIST.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ink-border hard-shadow-sm bg-card p-3 rounded flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl shrink-0",
								children: v.emoji
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg",
									children: v.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: v.description
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-pow-red text-sm shrink-0",
							children: "✓ ATIVA"
						})]
					}, v.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
							variant: "primary",
							children: "VOLTAR AO MENU"
						})
					})
				})
			]
		})]
	});
}
//#endregion
export { Settings as component };
