import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ComicButton-C6kzs4iI.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var variantClass = {
	primary: "bg-pow-yellow text-ink-fixed",
	secondary: "bg-white text-ink-fixed",
	danger: "bg-pow-red text-white",
	ghost: "bg-transparent text-ink-fixed dark:text-foreground",
	allin: "halftone-red text-white"
};
var sizeClass = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-lg",
	lg: "px-6 py-3 text-2xl"
};
function ComicButton({ children, variant = "primary", size = "md", className, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...rest,
		className: cn("font-display tracking-wide ink-border-thick hard-shadow-sm transition-all", "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none", "hover:-translate-y-0.5 hover:-translate-x-0.5", "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0", variantClass[variant], sizeClass[size], className),
		children
	});
}
//#endregion
export { cn as n, ComicButton as t };
