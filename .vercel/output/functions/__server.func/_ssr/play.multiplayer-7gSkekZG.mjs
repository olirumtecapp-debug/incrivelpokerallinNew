import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as VARIANT_LIST } from "./variants-C5Uqq510.mjs";
import { i as getAvatar, n as AvatarPicker, r as DEFAULT_AVATAR_ID, t as AvatarBadge } from "./AvatarPicker-CbZ3CfpK.mjs";
import { c as joinRoom, d as setGuestAvatarId, f as setGuestName, g as useServerFn, i as getGuestName, n as getGuestAvatarId, r as getGuestId, t as createRoom } from "./guest-B77Sch8M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play.multiplayer-7gSkekZG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Lobby() {
	const navigate = useNavigate();
	const create = useServerFn(createRoom);
	const join = useServerFn(joinRoom);
	const [variant, setVariant] = (0, import_react.useState)("holdem");
	const [smallBlind, setSmallBlind] = (0, import_react.useState)(10);
	const [bigBlind, setBigBlind] = (0, import_react.useState)(20);
	const [maxPlayers, setMaxPlayers] = (0, import_react.useState)(4);
	const [isMobile, setIsMobile] = (0, import_react.useState)(false);
	const [joinCode, setJoinCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [avatarId, setAvatarId] = (0, import_react.useState)(DEFAULT_AVATAR_ID);
	(0, import_react.useEffect)(() => {
		setName(getGuestName());
		setAvatarId(getGuestAvatarId());
		const mq = window.matchMedia("(max-width: 768px)");
		const apply = () => {
			const mob = mq.matches;
			setIsMobile(mob);
			setMaxPlayers((prev) => mob ? Math.min(prev, 4) : prev);
		};
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);
	const currentAvatar = getAvatar(avatarId);
	function persistIdentity() {
		const trimmed = name.trim();
		if (trimmed.length < 2) {
			toast.error("Digite um apelido de pelo menos 2 caracteres");
			return {
				ok: false,
				guestId: "",
				displayName: ""
			};
		}
		setGuestName(trimmed);
		setGuestAvatarId(avatarId);
		return {
			ok: true,
			guestId: getGuestId(),
			displayName: trimmed.slice(0, 20)
		};
	}
	async function handleCreate() {
		const id = persistIdentity();
		if (!id.ok) return;
		setBusy(true);
		try {
			const { code } = await create({ data: {
				guestId: id.guestId,
				displayName: id.displayName,
				avatarEmoji: avatarId,
				variant,
				smallBlind,
				bigBlind,
				startStack: 1e3,
				maxPlayers
			} });
			toast.success(`Sala criada! Código ${code}`);
			navigate({
				to: "/play/multiplayer/$code",
				params: { code }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Falhou");
		} finally {
			setBusy(false);
		}
	}
	async function handleJoin() {
		const id = persistIdentity();
		if (!id.ok) return;
		setBusy(true);
		try {
			const { code } = await join({ data: {
				code: joinCode.toUpperCase(),
				guestId: id.guestId,
				displayName: id.displayName,
				avatarEmoji: avatarId
			} });
			navigate({
				to: "/play/multiplayer/$code",
				params: { code }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Falhou");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "ink-border-thick bg-felt text-white p-4 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "font-display text-xl text-white shrink-0",
				children: "← MENU"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl md:text-3xl truncate flex-1",
				children: "👥 MULTIPLAYER"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-3xl mx-auto p-4 md:p-6 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "ink-border-thick hard-shadow bg-card rounded-lg p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl mb-3",
							children: "SUA IDENTIDADE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 items-center mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarBadge, {
								avatarId,
								size: 64
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "Como te chamam?",
									maxLength: 20,
									className: "w-full ink-border-thick bg-white text-ink-fixed px-3 py-2 font-display text-xl"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground font-display",
									children: currentAvatar.name
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold mb-2 uppercase tracking-wide",
							children: "Escolha seu personagem"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarPicker, {
							value: avatarId,
							onChange: setAvatarId
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "ink-border-thick hard-shadow bg-card rounded-lg p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl mb-4",
							children: "CRIAR SALA"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-3 mb-4",
							children: VARIANT_LIST.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setVariant(v.id),
								className: `ink-border p-3 rounded text-left transition ${variant === v.id ? "bg-pow-yellow text-ink-fixed" : "bg-white text-ink-fixed hover:bg-muted"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl",
									children: v.emoji
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display",
									children: v.name
								})]
							}, v.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-bold",
								children: ["SB", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									max: 1e3,
									value: smallBlind,
									onChange: (e) => setSmallBlind(parseInt(e.target.value) || 10),
									className: "w-full ink-border bg-white text-ink-fixed px-2 py-1 rounded font-mono"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-bold",
								children: ["BB", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 2,
									max: 2e3,
									value: bigBlind,
									onChange: (e) => setBigBlind(parseInt(e.target.value) || 20),
									className: "w-full ink-border bg-white text-ink-fixed px-2 py-1 rounded font-mono"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-bold mb-2",
									children: "Máx jogadores"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: (isMobile ? [
										2,
										3,
										4
									] : [
										2,
										3,
										4,
										5,
										6
									]).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMaxPlayers(n),
										className: `ink-border px-3 py-1.5 font-display text-lg rounded ${maxPlayers === n ? "bg-pow-yellow text-ink-fixed" : "bg-white text-ink-fixed hover:bg-muted"}`,
										children: n
									}, n))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-2",
									children: isMobile ? "No celular, máximo 4 jogadores por sala pra caber tudo na tela." : `No desktop, até 6 jogadores.`
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
							variant: "primary",
							onClick: handleCreate,
							disabled: busy,
							children: busy ? "..." : "CRIAR SALA"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "ink-border-thick hard-shadow bg-card rounded-lg p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl mb-3",
						children: "ENTRAR EM SALA"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: joinCode,
							onChange: (e) => setJoinCode(e.target.value.toUpperCase()),
							placeholder: "PKR-XXXX",
							className: "ink-border-thick bg-white text-ink-fixed px-3 py-2 font-display text-2xl text-center flex-1 tracking-widest uppercase",
							maxLength: 8
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
							variant: "primary",
							onClick: handleJoin,
							disabled: busy || joinCode.length < 6,
							children: "ENTRAR"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ink-border hard-shadow-sm bg-pow-yellow text-ink-fixed rounded p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ℹ Aviso:" }), " jogo entre amigos, sem cadastro. Qualquer um com o código entra na sala."]
				})
			]
		})]
	});
}
//#endregion
export { Lobby as component };
