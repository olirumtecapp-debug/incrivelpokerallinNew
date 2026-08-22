import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./ComicButton-C6kzs4iI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ThemeToggle-Csl9CZxL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function readMode() {
	if (typeof window === "undefined") return "light";
	const saved = localStorage.getItem("ip_mode");
	if (saved === "light" || saved === "dark") return saved;
	return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyMode(mode) {
	if (typeof document === "undefined") return;
	document.documentElement.classList.toggle("dark", mode === "dark");
}
function ThemeToggle({ className }) {
	const [mode, setMode] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const m = readMode();
		setMode(m);
		applyMode(m);
	}, []);
	function toggle() {
		const next = mode === "dark" ? "light" : "dark";
		setMode(next);
		applyMode(next);
		try {
			localStorage.setItem("ip_mode", next);
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: toggle,
		"aria-label": mode === "dark" ? "Ativar modo claro" : "Ativar modo escuro",
		className: cn("ink-border-thick hard-shadow-sm font-display tracking-wide px-3 py-2 text-sm transition-all", "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none", mode === "dark" ? "bg-pow-yellow text-ink-fixed" : "bg-ink text-paper", className),
		children: mode === "dark" ? "☀ CLARO" : "☾ ESCURO"
	});
}
//#endregion
export { ThemeToggle as t };
