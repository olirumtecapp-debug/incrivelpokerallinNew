import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DWjXzGfm.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DehIPRru.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => {
			if (data.user) navigate({ to: "/play/multiplayer" });
		});
	}, [navigate]);
	async function handleEmail(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: `${window.location.origin}/auth`,
						data: { username: username || email.split("@")[0] }
					}
				});
				if (error) throw error;
				toast.success("Conta criada! Confira seu email pra confirmar.");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Bem-vindo de volta!");
				navigate({ to: "/play/multiplayer" });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Falhou");
		} finally {
			setBusy(false);
		}
	}
	async function handleGoogle() {
		setBusy(true);
		try {
			const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
			if (result.error) throw result.error;
			if (result.redirected) return;
			navigate({ to: "/play/multiplayer" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Google falhou");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "ink-border-thick bg-pow-yellow text-ink-fixed p-4 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "font-display text-xl shrink-0",
				children: "← MENU"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl md:text-3xl truncate",
				children: "🔑 ENTRAR"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 max-w-md w-full mx-auto p-4 md:p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ink-border-thick hard-shadow bg-card rounded-lg p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("signin"),
							className: `flex-1 ink-border font-display py-2 rounded ${mode === "signin" ? "bg-pow-yellow text-ink-fixed" : "bg-white text-ink-fixed"}`,
							children: "ENTRAR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("signup"),
							className: `flex-1 ink-border font-display py-2 rounded ${mode === "signup" ? "bg-pow-yellow text-ink-fixed" : "bg-white text-ink-fixed"}`,
							children: "CRIAR CONTA"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleEmail,
						className: "space-y-3",
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-body font-bold text-sm",
								children: "Apelido"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: username,
								onChange: (e) => setUsername(e.target.value),
								placeholder: "Seu nick no jogo",
								maxLength: 30,
								className: "w-full ink-border bg-white text-ink-fixed px-3 py-2 rounded font-body"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-body font-bold text-sm",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								autoComplete: "email",
								className: "w-full ink-border bg-white text-ink-fixed px-3 py-2 rounded font-body"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-body font-bold text-sm",
								children: "Senha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 6,
								autoComplete: mode === "signup" ? "new-password" : "current-password",
								className: "w-full ink-border bg-white text-ink-fixed px-3 py-2 rounded font-body"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
								type: "submit",
								variant: "primary",
								disabled: busy,
								className: "w-full",
								children: busy ? "..." : mode === "signin" ? "ENTRAR" : "CRIAR CONTA"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-4 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-ink/20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-muted-foreground",
								children: "OU"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-ink/20" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleGoogle,
						disabled: busy,
						className: "w-full ink-border-thick hard-shadow-sm bg-white text-ink-fixed hover:bg-pow-yellow px-4 py-3 rounded font-display text-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl",
							children: "🔍"
						}), " ENTRAR COM GOOGLE"]
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };
