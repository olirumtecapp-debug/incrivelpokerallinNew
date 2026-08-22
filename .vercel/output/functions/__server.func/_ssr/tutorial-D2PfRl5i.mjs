import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as VARIANT_LIST } from "./variants-C5Uqq510.mjs";
import { n as HandRank, t as HAND_NAME } from "./evaluator-gzvo6JmB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tutorial-D2PfRl5i.js
var import_jsx_runtime = require_jsx_runtime();
var HANDS = [
	{
		rank: HandRank.ROYAL_FLUSH,
		ex: "A♠ K♠ Q♠ J♠ 10♠",
		desc: "Sequência do 10 ao Ás, todas do mesmo naipe."
	},
	{
		rank: HandRank.STRAIGHT_FLUSH,
		ex: "9♥ 8♥ 7♥ 6♥ 5♥",
		desc: "Cinco em sequência, do mesmo naipe."
	},
	{
		rank: HandRank.FOUR_KIND,
		ex: "K♠ K♥ K♦ K♣ 3♠",
		desc: "Quatro do mesmo valor."
	},
	{
		rank: HandRank.FULL_HOUSE,
		ex: "Q♠ Q♥ Q♦ 8♣ 8♠",
		desc: "Trinca + par."
	},
	{
		rank: HandRank.FLUSH,
		ex: "A♦ J♦ 8♦ 6♦ 2♦",
		desc: "Cinco do mesmo naipe."
	},
	{
		rank: HandRank.STRAIGHT,
		ex: "9♠ 8♥ 7♦ 6♣ 5♠",
		desc: "Cinco em sequência, naipes variados."
	},
	{
		rank: HandRank.THREE_KIND,
		ex: "7♠ 7♥ 7♦ K♣ 4♠",
		desc: "Três do mesmo valor."
	},
	{
		rank: HandRank.TWO_PAIR,
		ex: "J♠ J♥ 4♦ 4♣ 9♠",
		desc: "Dois pares diferentes."
	},
	{
		rank: HandRank.PAIR,
		ex: "10♠ 10♥ 8♦ 5♣ 2♠",
		desc: "Duas do mesmo valor."
	},
	{
		rank: HandRank.HIGH_CARD,
		ex: "A♠ J♥ 8♦ 6♣ 3♠",
		desc: "Nada acima. Ganha a maior carta."
	}
];
var RULES = [
	{
		title: "1. BLINDS",
		body: "Antes das cartas, dois jogadores pagam Small Blind e Big Blind."
	},
	{
		title: "2. HOLE CARDS",
		body: "Cada um recebe cartas fechadas: 2 no Hold'em/Short, 4 no Omaha."
	},
	{
		title: "3. PRÉ-FLOP",
		body: "Rodada de apostas. DOBRAR, PAGAR ou AUMENTAR."
	},
	{
		title: "4. FLOP",
		body: "3 cartas comunitárias abertas."
	},
	{
		title: "5. TURN & RIVER",
		body: "Mais 2 cartas comunitárias, uma por vez."
	},
	{
		title: "6. SHOWDOWN",
		body: "Melhor mão de 5 leva. No Omaha: exatamente 2 hole + 3 mesa."
	}
];
function Tutorial() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "ink-border-thick bg-pow-yellow text-ink-fixed p-4 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "font-display text-xl shrink-0",
				children: "← MENU"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl md:text-3xl truncate",
				children: "📖 COMO JOGAR"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-4xl mx-auto p-4 md:p-6 space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "halftone-yellow ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl md:text-3xl",
						children: "MODALIDADES"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-3",
					children: VARIANT_LIST.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ink-border hard-shadow-sm bg-card p-4 rounded-md",
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
								className: "text-sm mt-1",
								children: v.description
							}),
							v.id === "shortdeck" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-xs font-bold text-pow-red",
								children: "⚠ Flush > Full House · A-6-7-8-9 é straight"
							}),
							v.id === "omaha" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-xs font-bold text-pow-red",
								children: "⚠ Você DEVE usar exatamente 2 hole cards + 3 do board"
							})
						]
					}, v.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "halftone-red ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl md:text-3xl text-white",
						children: "RANKING DAS MÃOS"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: HANDS.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ink-border hard-shadow-sm bg-card rounded-md p-3 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ink-border bg-pow-yellow text-ink-fixed font-display text-2xl w-12 h-12 flex items-center justify-center shrink-0",
							children: HANDS.length - i
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg",
									children: HAND_NAME[h.rank]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-sm text-pow-red",
									children: h.ex
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: h.desc
								})
							]
						})]
					}, h.rank))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "halftone-yellow ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl md:text-3xl",
						children: "FLUXO DA RODADA"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-3",
					children: RULES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ink-border hard-shadow-sm bg-card p-4 rounded-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl mb-1",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: r.body
						})]
					}, r.title))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "halftone-red ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl md:text-3xl text-white",
						children: "AÇÕES"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "DOBRAR (FOLD)",
							body: "Desiste da mão. Perde o que já apostou."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "CHECK",
							body: "Passa a vez sem apostar. Só quando ninguém apostou nesta rodada."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "PAGAR (CALL)",
							body: "Iguala a aposta atual."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "AUMENTAR (RAISE)",
							body: "Aumenta a aposta."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "ALL-IN",
							body: "Todas as fichas. POW!"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/play/casual",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
							variant: "primary",
							size: "lg",
							children: "JOGAR AGORA"
						})
					})
				})
			]
		})]
	});
}
function Card({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ink-border hard-shadow-sm bg-card p-4 rounded-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-lg text-pow-red",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm",
			children: body
		})]
	});
}
//#endregion
export { Tutorial as component };
