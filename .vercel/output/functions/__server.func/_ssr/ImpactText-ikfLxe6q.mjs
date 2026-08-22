import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn, t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { n as SUIT_LABEL, r as isRed, t as RANK_LABEL } from "./cards-B2P_Kx9I.mjs";
import { t as AvatarBadge } from "./AvatarPicker-CbZ3CfpK.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ImpactText-ikfLxe6q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sizeMap = {
	sm: "w-10 h-14 sm:w-12 sm:h-[68px] text-lg sm:text-xl landscape-short:w-8 landscape-short:h-11 landscape-short:text-sm",
	md: "w-14 h-20 md:w-16 md:h-24 text-xl md:text-2xl landscape-short:w-10 landscape-short:h-14 landscape-short:text-base",
	lg: "w-12 h-16 sm:w-16 sm:h-24 md:w-20 md:h-28 lg:w-24 lg:h-36 text-2xl md:text-3xl lg:text-4xl landscape-short:w-12 landscape-short:h-16 landscape-short:text-lg",
	xl: "w-20 h-28 md:w-32 md:h-48 text-4xl md:text-5xl landscape-short:w-14 landscape-short:h-20 landscape-short:text-xl"
};
function PlayingCard({ card, faceDown, size = "md", dealDelay = 0, highlighted }) {
	if (faceDown || !card) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative ink-border-thick rounded-md halftone-red overflow-hidden animate-card-deal", sizeMap[size]),
		style: { animationDelay: `${dealDelay}ms` },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-1 rounded-sm border-2 border-white/70 flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-white text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]",
				children: "♠♥"
			})
		})
	});
	const red = isRed(card.suit);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative ink-border-thick rounded-md bg-white flex flex-col items-center justify-center animate-card-deal font-display leading-none", sizeMap[size], highlighted && "ring-4 ring-pow-yellow ring-offset-2 ring-offset-transparent", red ? "text-pow-red" : "text-ink-fixed"),
		style: { animationDelay: `${dealDelay}ms` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-0.5 left-1 text-[0.65em] leading-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: RANK_LABEL[card.rank] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: SUIT_LABEL[card.suit] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[1.4em]",
				children: SUIT_LABEL[card.suit]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-0.5 right-1 rotate-180 text-[0.65em] leading-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: RANK_LABEL[card.rank] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: SUIT_LABEL[card.suit] })]
			})
		]
	});
}
function SpeechBubble({ children, className, tail = "bottom-left" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative inline-block bg-white ink-border-thick hard-shadow-sm rounded-2xl px-4 py-2 font-body font-bold text-ink-fixed animate-bubble-pop", className),
		children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute w-0 h-0 border-solid", "border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent", tail === "bottom-left" && "left-4 -bottom-3 border-t-[14px] border-t-ink", tail === "bottom-right" && "right-4 -bottom-3 border-t-[14px] border-t-ink", tail === "top-left" && "left-4 -top-3 border-b-[14px] border-b-ink", tail === "top-right" && "right-4 -top-3 border-b-[14px] border-b-ink") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute w-0 h-0 border-solid", "border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent", tail === "bottom-left" && "left-[19px] -bottom-[9px] border-t-[11px] border-t-white", tail === "bottom-right" && "right-[19px] -bottom-[9px] border-t-[11px] border-t-white", tail === "top-left" && "left-[19px] -top-[9px] border-b-[11px] border-b-white", tail === "top-right" && "right-[19px] -top-[9px] border-b-[11px] border-b-white") })
		]
	});
}
function PlayerSeat({ player, isActive, isDealer, reveal, taunt, isWinner, holeCount = 2, isMe = false, avatarId }) {
	const showCards = !player.folded && (reveal || !player.isBot);
	const slots = holeCount === 4 ? [
		0,
		1,
		2,
		3
	] : [0, 1];
	const size = isMe ? "md" : "sm";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex flex-col items-center gap-1", isMe && "flex-col-reverse", player.folded && "opacity-40", isWinner && "animate-shake"),
		children: [
			taunt && player.isBot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -top-14 left-1/2 -translate-x-1/2 z-20 max-w-[200px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeechBubble, {
					tail: "bottom-left",
					className: "text-xs whitespace-nowrap",
					children: taunt
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex gap-1 shrink-0", holeCount === 4 && "grid grid-cols-2 gap-1"),
				children: slots.map((i) => {
					const c = player.hole[i];
					if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
						size,
						faceDown: true,
						dealDelay: i * 60
					}, i);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
						card: c,
						faceDown: !showCards,
						size,
						dealDelay: i * 60
					}, i);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("ink-border-thick hard-shadow-sm bg-card px-2 py-1 md:px-3 md:py-1.5 landscape-short:px-1.5 landscape-short:py-0.5 min-w-[110px] md:min-w-[140px] landscape-short:!min-w-[90px] text-center rounded-md", isActive && "bg-pow-yellow text-ink-fixed scale-105 transition-transform", isWinner && "bg-pow-yellow text-ink-fixed"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-1.5 landscape-short:gap-1",
						children: [
							avatarId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarBadge, {
								avatarId,
								size: isMe ? 32 : 24
							}) : player.personality?.avatarId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarBadge, {
								avatarId: player.personality.avatarId,
								size: isMe ? 32 : 24
							}) : player.personality?.emoji && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base md:text-lg landscape-short:text-xs",
								children: player.personality.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-sm md:text-base landscape-short:text-xs truncate",
								children: player.name
							}),
							isDealer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ink-border bg-white text-ink-fixed text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center",
								children: "D"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-body font-bold text-xs landscape-short:text-[10px] text-muted-foreground",
						children: ["🪙 ", player.stack.toLocaleString("pt-BR")]
					}),
					player.currentBet > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 font-body font-bold text-[10px] bg-chip-red text-white rounded px-1.5 py-0.5 inline-block animate-chip-drop",
						children: ["aposta: ", player.currentBet]
					}),
					player.lastAction && !player.folded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-[10px] text-pow-red landscape-short:hidden",
						children: player.lastAction
					}),
					player.folded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-[10px] text-muted-foreground",
						children: "FOLD"
					}),
					player.allIn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-[10px] text-pow-red",
						children: "ALL-IN"
					})
				]
			})
		]
	});
}
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
function ActionPanel({ state, onAction, disabled }) {
	const human = state.players.find((p) => p.id === "human");
	if (!human) return null;
	const toCall = state.currentBet - human.currentBet;
	const canCheck = toCall === 0;
	const canCall = toCall > 0 && human.stack > 0;
	const callAmt = Math.min(toCall, human.stack);
	const minRaiseTotal = state.currentBet + state.minRaise;
	const maxTotal = human.currentBet + human.stack;
	const raiseAvailable = human.stack > toCall && maxTotal >= minRaiseTotal;
	const [raise, setRaise] = (0, import_react.useState)(minRaiseTotal);
	const [openRaise, setOpenRaise] = (0, import_react.useState)(false);
	const clamped = Math.max(minRaiseTotal, Math.min(maxTotal, raise));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ink-border-thick hard-shadow bg-card rounded-lg p-2 md:p-3 landscape-short:p-1 flex flex-col gap-2 landscape-short:gap-1 max-w-3xl mx-auto w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between text-xs landscape-short:text-[10px] font-body font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["POT: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-pow-red",
					children: state.pot.toLocaleString("pt-BR")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["P/ PAGAR: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-pow-red",
					children: toCall.toLocaleString("pt-BR")
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-4 gap-1.5 md:gap-2 landscape-short:gap-1 landscape-short:[&_button]:!py-1 landscape-short:[&_button]:!text-[11px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "danger",
						size: "sm",
						onClick: () => onAction({ type: "fold" }),
						disabled,
						children: "FOLD"
					}),
					canCheck ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "secondary",
						size: "sm",
						onClick: () => onAction({ type: "check" }),
						disabled,
						children: "CHECK"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComicButton, {
						variant: "secondary",
						size: "sm",
						onClick: () => onAction({ type: "call" }),
						disabled: disabled || !canCall,
						children: ["CALL ", callAmt > 0 ? callAmt : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "primary",
						size: "sm",
						onClick: () => onAction({
							type: "raise",
							amount: clamped
						}),
						disabled: disabled || !raiseAvailable,
						children: "RAISE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "allin",
						size: "sm",
						onClick: () => onAction({ type: "allin" }),
						disabled: disabled || human.stack === 0,
						children: "ALL-IN!"
					})
				]
			}),
			raiseAvailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "md:hidden landscape-short:!block",
				open: openRaise,
				onToggle: (e) => setOpenRaise(e.target.open),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
					className: "text-xs landscape-short:text-[10px] font-display cursor-pointer select-none flex justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ajustar aposta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-pow-red",
						children: clamped.toLocaleString("pt-BR")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 landscape-short:mt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: minRaiseTotal,
						max: maxTotal,
						step: state.bigBlind,
						value: [clamped],
						onValueChange: (v) => setRaise(v[0]),
						disabled
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 mt-2 landscape-short:mt-1 flex-wrap",
						children: [[
							.5,
							.75,
							1,
							1.5
						].map((mult) => {
							const val = Math.min(maxTotal, Math.max(minRaiseTotal, human.currentBet + Math.floor(state.pot * mult)));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ink-border bg-muted px-2 py-0.5 text-xs landscape-short:text-[10px] font-bold hover:bg-pow-yellow hover:text-ink-fixed",
								onClick: () => setRaise(val),
								disabled,
								children: mult === 1 ? "POT" : `${mult}x`
							}, mult);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "ink-border bg-muted px-2 py-0.5 text-xs landscape-short:text-[10px] font-bold hover:bg-pow-yellow hover:text-ink-fixed",
							onClick: () => setRaise(maxTotal),
							disabled,
							children: "MAX"
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden md:block landscape-short:!hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-xs font-body font-bold mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Aumentar para:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-pow-red",
							children: clamped.toLocaleString("pt-BR")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: minRaiseTotal,
						max: maxTotal,
						step: state.bigBlind,
						value: [clamped],
						onValueChange: (v) => setRaise(v[0]),
						disabled
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 mt-2 flex-wrap",
						children: [[
							.5,
							.75,
							1,
							1.5
						].map((mult) => {
							const val = Math.min(maxTotal, Math.max(minRaiseTotal, human.currentBet + Math.floor(state.pot * mult)));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ink-border bg-muted px-2 py-0.5 text-xs font-bold hover:bg-pow-yellow hover:text-ink-fixed",
								onClick: () => setRaise(val),
								disabled,
								children: mult === 1 ? "POT" : `${mult}x pot`
							}, mult);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "ink-border bg-muted px-2 py-0.5 text-xs font-bold hover:bg-pow-yellow hover:text-ink-fixed",
							onClick: () => setRaise(maxTotal),
							disabled,
							children: "MAX"
						})]
					})
				]
			})] })
		]
	});
}
/** Explosão HQ centralizada com texto de impacto. Auto-hide após 1.4s. */
function ImpactText({ text, ts }) {
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!text || !ts) return;
		setVisible(true);
		const t = setTimeout(() => setVisible(false), 1400);
		return () => clearTimeout(t);
	}, [text, ts]);
	if (!visible || !text) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-50 flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("burst-clip halftone-yellow ink-border-thick px-14 py-10 animate-pop-in"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-5xl md:text-7xl text-ink text-center drop-shadow-[4px_4px_0_rgba(0,0,0,0.3)]",
				children: text
			})
		})
	});
}
//#endregion
export { PlayingCard as i, ImpactText as n, PlayerSeat as r, ActionPanel as t };
