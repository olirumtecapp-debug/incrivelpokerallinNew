import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as getVariant } from "./variants-C5Uqq510.mjs";
import { t as LandscapeHint } from "./LandscapeHint-BRdq-UXF.mjs";
import { t as sfx } from "./sfx-D-XZLET1.mjs";
import { n as AvatarPicker, r as DEFAULT_AVATAR_ID, t as AvatarBadge } from "./AvatarPicker-CbZ3CfpK.mjs";
import { i as PlayingCard, n as ImpactText, r as PlayerSeat, t as ActionPanel } from "./ImpactText-ikfLxe6q.mjs";
import { a as getRoomByCode, c as joinRoom, d as setGuestAvatarId, f as setGuestName, g as useServerFn, h as toggleReady, i as getGuestName, l as leaveRoom, m as submitAction, n as getGuestAvatarId, o as getRoomLobby, p as startRoomHand, r as getGuestId, s as getRoomView, u as nextRoomHand } from "./guest-B77Sch8M.mjs";
import { t as Route } from "./play.multiplayer._code-CHIpatX4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play.multiplayer._code-4ymL5bFG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Room() {
	const { code } = Route.useParams();
	const navigate = useNavigate();
	const [room, setRoom] = (0, import_react.useState)(null);
	const [players, setPlayers] = (0, import_react.useState)([]);
	const [gameState, setGameState] = (0, import_react.useState)(null);
	const [myGuestId, setMyGuestId] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [full, setFull] = (0, import_react.useState)(false);
	const [needName, setNeedName] = (0, import_react.useState)(false);
	const [nameInput, setNameInput] = (0, import_react.useState)("");
	const [avatarInput, setAvatarInput] = (0, import_react.useState)(DEFAULT_AVATAR_ID);
	const fnGetView = useServerFn(getRoomView);
	const fnSubmit = useServerFn(submitAction);
	const fnStart = useServerFn(startRoomHand);
	const fnNext = useServerFn(nextRoomHand);
	const fnLeave = useServerFn(leaveRoom);
	const fnReady = useServerFn(toggleReady);
	const fnJoin = useServerFn(joinRoom);
	const fnRoomByCode = useServerFn(getRoomByCode);
	const fnLobby = useServerFn(getRoomLobby);
	const lastActionRef = (0, import_react.useRef)("");
	const fetchState = (0, import_react.useCallback)(async (roomId, guestId) => {
		try {
			const { state } = await fnGetView({ data: {
				roomId,
				guestId
			} });
			if (state) setGameState((prev) => {
				const s = state;
				const key = `${s.handNumber}:${s.street}:${s.actionIdx}:${s.pot}`;
				if (lastActionRef.current && lastActionRef.current !== key) {
					if (prev && s.handNumber !== prev.handNumber) sfx.play("cardDeal");
					else if (prev && s.pot > prev.pot) sfx.play("chipDrop");
				}
				lastActionRef.current = key;
				return s;
			});
		} catch (e) {
			console.error(e);
		}
	}, [fnGetView]);
	const fetchLobby = (0, import_react.useCallback)(async (roomId, guestId) => {
		try {
			const { room: r, players: pls } = await fnLobby({ data: {
				roomId,
				guestId
			} });
			if (r) setRoom(r);
			setPlayers(pls);
			const me = pls.find((p) => p.is_self);
			if (me) setReady(me.is_ready);
		} catch (e) {
			console.error(e);
		}
	}, [fnLobby]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const guestId = getGuestId();
			setMyGuestId(guestId);
			sfx.unlock();
			const { room: r } = await fnRoomByCode({ data: { code } });
			if (!r) {
				toast.error("Sala não encontrada");
				navigate({ to: "/play/multiplayer" });
				return;
			}
			if (cancelled) return;
			setRoom(r);
			const lobby = await fnLobby({ data: {
				roomId: r.id,
				guestId
			} });
			if (cancelled) return;
			if (!lobby.isMember) {
				const savedName = getGuestName();
				if (!savedName) {
					setAvatarInput(getGuestAvatarId());
					setNeedName(true);
					return;
				}
				try {
					await fnJoin({ data: {
						code: r.code,
						guestId,
						displayName: savedName,
						avatarEmoji: getGuestAvatarId()
					} });
				} catch (e) {
					const msg = e instanceof Error ? e.message : "Falhou";
					if (msg.toLowerCase().includes("cheia")) {
						setFull(true);
						return;
					}
					toast.error(msg);
					navigate({ to: "/play/multiplayer" });
					return;
				}
			}
			await fetchLobby(r.id, guestId);
			await fetchState(r.id, guestId);
		})();
		return () => {
			cancelled = true;
		};
	}, [code]);
	(0, import_react.useEffect)(() => {
		if (!room || !myGuestId) return;
		const roomId = room.id;
		const iv = window.setInterval(() => {
			fetchLobby(roomId, myGuestId);
			fetchState(roomId, myGuestId);
		}, 1500);
		return () => {
			window.clearInterval(iv);
		};
	}, [
		room,
		myGuestId,
		fetchLobby,
		fetchState
	]);
	async function submitNameAndJoin() {
		const trimmed = nameInput.trim();
		if (trimmed.length < 2) {
			toast.error("Apelido muito curto");
			return;
		}
		if (!room) return;
		setGuestName(trimmed);
		setGuestAvatarId(avatarInput);
		try {
			await fnJoin({ data: {
				code: room.code,
				guestId: myGuestId,
				displayName: trimmed,
				avatarEmoji: avatarInput
			} });
			setNeedName(false);
			await fetchLobby(room.id, myGuestId);
			await fetchState(room.id, myGuestId);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Falhou";
			if (msg.toLowerCase().includes("cheia")) {
				setFull(true);
				return;
			}
			toast.error(msg);
		}
	}
	async function handleReady() {
		if (!room) return;
		const next = !ready;
		setReady(next);
		try {
			await fnReady({ data: {
				roomId: room.id,
				guestId: myGuestId,
				ready: next
			} });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falhou");
			setReady(!next);
		}
	}
	async function handleStart() {
		if (!room) return;
		setBusy(true);
		try {
			await fnStart({ data: {
				roomId: room.id,
				guestId: myGuestId
			} });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falhou");
		} finally {
			setBusy(false);
		}
	}
	async function handleNext() {
		if (!room) return;
		setBusy(true);
		try {
			await fnNext({ data: {
				roomId: room.id,
				guestId: myGuestId
			} });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falhou");
		} finally {
			setBusy(false);
		}
	}
	async function handleLeave() {
		if (!room) return;
		await fnLeave({ data: {
			roomId: room.id,
			guestId: myGuestId
		} });
		navigate({ to: "/play/multiplayer" });
	}
	async function handleAction(action) {
		if (!room) return;
		try {
			await fnSubmit({ data: {
				roomId: room.id,
				guestId: myGuestId,
				action
			} });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Ação inválida");
		}
	}
	if (full) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-4xl text-pow-red",
				children: "SALA CHEIA"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted-foreground",
				children: [
					"Esta sala já atingiu o limite de ",
					6,
					" jogadores."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/play/multiplayer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
					variant: "primary",
					children: "VOLTAR AO LOBBY"
				})
			})
		]
	});
	if (needName) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ink-border-thick hard-shadow bg-card rounded-lg p-6 max-w-md w-full space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl text-center",
					children: ["ENTRAR NA SALA ", code]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarBadge, {
						avatarId: avatarInput,
						size: 56
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: nameInput,
						onChange: (e) => setNameInput(e.target.value),
						placeholder: "Seu apelido",
						maxLength: 20,
						className: "ink-border-thick bg-white text-ink-fixed px-3 py-2 font-display text-xl flex-1"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-bold uppercase tracking-wide",
					children: "Escolha seu personagem"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarPicker, {
					value: avatarInput,
					onChange: setAvatarInput
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
					variant: "primary",
					onClick: submitNameAndJoin,
					children: "ENTRAR"
				})
			]
		})
	});
	if (!room) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center font-display text-2xl",
		children: "carregando sala..."
	});
	const isCreator = players.some((p) => p.is_host && p.is_self);
	const readyCount = players.filter((p) => p.is_ready).length;
	const canStart = isCreator && players.length >= 2 && readyCount === players.length;
	if (!gameState) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "ink-border-thick bg-felt text-white p-4 flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/play/multiplayer",
					className: "font-display text-xl text-white shrink-0",
					children: "← LOBBY"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-2xl md:text-3xl truncate flex-1",
					children: ["SALA ", room.code]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleLeave,
					className: "ink-border bg-pow-red text-white px-3 py-1 text-sm font-display",
					children: "SAIR"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-3xl mx-auto p-4 md:p-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ink-border-thick hard-shadow bg-card rounded-lg p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center mb-3 gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-xl flex items-center gap-2",
							children: [
								"JOGADORES (",
								players.length,
								"/",
								Math.min(room.max_players, 6),
								")",
								players.length >= Math.min(room.max_players, 6) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ink-border bg-pow-red text-white text-xs px-2 py-0.5 font-display",
									children: "CHEIA"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-bold",
							children: [
								getVariant(room.variant).name,
								" · SB ",
								room.small_blind,
								" / BB ",
								room.big_blind
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "ink-border bg-white text-ink-fixed p-2 rounded flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarBadge, {
									avatarId: p.avatar_emoji,
									size: 40
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display flex-1 truncate",
									children: p.display_name
								}),
								p.is_host && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs ink-border bg-pow-yellow text-ink-fixed px-2 py-0.5 font-display",
									children: "HOST"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-display px-2 py-0.5 ink-border ${p.is_ready ? "bg-pow-yellow text-ink-fixed" : "bg-muted"}`,
									children: p.is_ready ? "PRONTO" : "aguardando"
								})
							]
						}, p.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ink-border-thick hard-shadow bg-card rounded-lg p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "halftone-yellow ink-border-thick hard-shadow-sm p-4 inline-block mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold",
								children: "CÓDIGO"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-4xl tracking-widest",
								children: room.code
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 justify-center flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									navigator.clipboard?.writeText(room.code);
									toast.success("Código copiado!");
								},
								className: "ink-border bg-white text-ink-fixed px-3 py-1 font-display text-sm hover:bg-pow-yellow hover:text-ink-fixed",
								children: "📋 CÓDIGO"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									const url = `${window.location.origin}/play/multiplayer/${room.code}`;
									navigator.clipboard?.writeText(url);
									toast.success("Link copiado!");
								},
								className: "ink-border bg-white text-ink-fixed px-3 py-1 font-display text-sm hover:bg-pow-yellow hover:text-ink-fixed",
								children: "🔗 LINK"
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: ready ? "secondary" : "primary",
						onClick: handleReady,
						children: ready ? "DESMARCAR" : "PRONTO!"
					}), isCreator && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "allin",
						onClick: handleStart,
						disabled: !canStart || busy,
						children: "INICIAR PARTIDA"
					})]
				}),
				isCreator && !canStart && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-muted-foreground",
					children: "Aguardando todos ficarem prontos (mínimo 2 jogadores)."
				})
			]
		})]
	});
	const v = getVariant(gameState.variant);
	const me = gameState.players.find((p) => p.id === myGuestId);
	const others = gameState.players.filter((p) => p.id !== myGuestId);
	const meIdx = gameState.players.findIndex((p) => p.id === myGuestId);
	const isMyTurn = meIdx === gameState.actionIdx && !gameState.awaitingAdvance && me && !me.folded && !me.allIn;
	const winnerIds = new Set(gameState.winners.map((w) => w.playerId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-[100dvh] landscape-short:h-[100dvh] landscape-short:overflow-hidden overflow-y-auto flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandscapeHint, { blocking: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpactText, {
				text: gameState.lastImpact?.text,
				ts: gameState.lastImpact?.ts
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "shrink-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-1.5 md:py-2 landscape-short:py-0.5 landscape-short:px-2 ink-border-thick bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/play/multiplayer",
							className: "font-display text-base md:text-lg landscape-short:text-xs text-pow-red hover:text-ink-fixed shrink-0",
							children: "← LOBBY"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate font-display text-sm md:text-base landscape-short:text-xs",
							children: ["SALA ", room.code]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden md:inline landscape-short:!hidden ink-border bg-pow-yellow text-ink-fixed px-2 py-0.5 text-xs font-display",
							children: v.short
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-body text-xs md:text-sm landscape-short:text-[10px] font-bold",
					children: ["Mão #", gameState.handNumber]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-h-0 relative grid grid-rows-[auto_1fr_auto] items-center justify-items-center gap-1 md:gap-2 landscape-short:gap-0 px-2 py-1 md:px-4 md:py-2 landscape-short:px-1 landscape-short:py-0",
				style: { background: "radial-gradient(ellipse at center, var(--color-felt) 0%, var(--color-felt-dark) 100%)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5 md:gap-3 landscape-short:gap-1 justify-center pt-1 landscape-short:pt-0",
						children: others.map((p) => {
							const idx = gameState.players.findIndex((x) => x.id === p.id);
							const pr = players.find((rp) => rp.display_name === p.name);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSeat, {
								player: p,
								isActive: gameState.actionIdx === idx && !gameState.awaitingAdvance,
								isDealer: gameState.dealerIdx === idx,
								reveal: gameState.street === "showdown",
								isWinner: winnerIds.has(p.id),
								holeCount: v.holeCards,
								avatarId: pr?.avatar_emoji
							}, p.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-1 md:gap-2 landscape-short:gap-0.5 w-full max-w-4xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ink-border-thick hard-shadow bg-paper/90 rounded-full px-3 py-0.5 md:px-5 md:py-1.5 landscape-short:px-2 landscape-short:py-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-base md:text-2xl landscape-short:text-xs text-pow-red text-center leading-tight",
								children: ["POT: ", gameState.pot.toLocaleString("pt-BR")]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1 md:gap-2 landscape-short:gap-0.5 items-center justify-center flex-nowrap min-w-max mx-auto px-1",
								children: [
									0,
									1,
									2,
									3,
									4
								].map((i) => {
									const c = gameState.community[i];
									if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "shrink-0 w-10 h-14 sm:w-14 sm:h-20 md:w-16 md:h-24 lg:w-20 lg:h-28 landscape-short:w-8 landscape-short:h-11 rounded-md border-2 border-dashed border-white/30" }, i);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
										card: c,
										size: "md",
										dealDelay: i * 60
									}, i);
								})
							})
						})]
					}),
					me && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pb-1 landscape-short:pb-0 min-h-[140px] md:min-h-[170px] landscape-short:min-h-0 flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSeat, {
							player: me,
							isActive: meIdx === gameState.actionIdx && !gameState.awaitingAdvance,
							isDealer: gameState.dealerIdx === meIdx,
							reveal: gameState.street === "showdown",
							isWinner: winnerIds.has(me.id),
							holeCount: v.holeCards,
							isMe: true,
							avatarId: players.find((rp) => rp.is_self)?.avatar_emoji
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 relative z-10 bg-background p-2 md:p-3 short:py-1.5 landscape-short:p-1",
				children: gameState.awaitingAdvance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ink-border-thick hard-shadow bg-card rounded-lg p-2 md:p-3 flex flex-col items-center gap-1 max-w-3xl mx-auto",
					children: [gameState.winners.map((w, i) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-base md:text-xl text-center",
							children: [
								gameState.players.find((pl) => pl.id === w.playerId).name,
								" ganhou ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-pow-red",
									children: w.amount
								}),
								w.handName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground text-xs md:text-base",
									children: [" — ", w.handName]
								})
							]
						}, i);
					}), isCreator ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "primary",
						size: "sm",
						onClick: handleNext,
						disabled: busy,
						children: "PRÓXIMA MÃO"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs md:text-sm text-muted-foreground",
						children: "Aguardando o host iniciar a próxima mão..."
					})]
				}) : me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionPanel, {
					state: gameState,
					onAction: handleAction,
					disabled: !isMyTurn
				}) : null
			})
		]
	});
}
//#endregion
export { Room as component };
