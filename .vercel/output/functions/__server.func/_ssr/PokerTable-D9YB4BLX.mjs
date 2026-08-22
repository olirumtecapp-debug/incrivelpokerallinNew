import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as newDeck } from "./cards-B2P_Kx9I.mjs";
import { n as getVariant } from "./variants-C5Uqq510.mjs";
import { r as evaluateHand } from "./evaluator-gzvo6JmB.mjs";
import { a as startHand, i as playerAction, r as nextHand, t as createInitialState } from "./engine-CieTYigx.mjs";
import { t as LandscapeHint } from "./LandscapeHint-BRdq-UXF.mjs";
import { t as sfx } from "./sfx-D-XZLET1.mjs";
import { i as PlayingCard, n as ImpactText, r as PlayerSeat, t as ActionPanel } from "./ImpactText-ikfLxe6q.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PokerTable-D9YB4BLX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PERSONALITIES = [
	{
		id: "aprendiz",
		name: "Zé Cartinhas",
		title: "Aprendiz de Cartas",
		difficulty: "beginner",
		avatarBg: "bg-pow-blue",
		emoji: "🎓",
		avatarId: "clown",
		taunts: {
			win: ["Serio? Ganhei? UEBA!", "Foi sorte, juro!"],
			lose: ["Ainda tô aprendendo...", "Ops."],
			bluffCalled: ["Eu tentei blefar!!"],
			allIn: ["ALLIN! É agora ou nunca!"],
			fold: ["Deixa pra próxima..."]
		}
	},
	{
		id: "novato",
		name: "Novato Sortudo",
		title: "Iniciante de Sorte",
		difficulty: "beginner",
		avatarBg: "bg-zinc-400",
		emoji: "🍀",
		avatarId: "robot",
		taunts: {
			win: ["Bip bop! Ganhei!", "Cálculo? Não, sorte!"],
			lose: ["Erro 404: vitória.", "Reiniciando..."],
			bluffCalled: ["Blefe detectado."],
			allIn: ["ALL-IN.EXE"],
			fold: ["Abortar missão."]
		}
	},
	{
		id: "timida",
		name: "Roquinha Tímida",
		title: "Aprendiz do Palco",
		difficulty: "beginner",
		avatarBg: "bg-orange-500",
		emoji: "🎸",
		avatarId: "rocker",
		taunts: {
			win: ["Ai... ganhei?", "Foi mal, foi mal!"],
			lose: ["Tudo bem, próxima!", "Nem doeu."],
			bluffCalled: ["Foi mal a tentativa..."],
			allIn: ["Vai tudo! AAAH!"],
			fold: ["Melhor não arriscar."]
		}
	},
	{
		id: "sorridente",
		name: "Dona Sorriso",
		title: "Sorridente da Média",
		difficulty: "easy",
		avatarBg: "bg-pow-yellow",
		emoji: "😄",
		avatarId: "queen",
		taunts: {
			win: ["Aha! Que fofinho!", "Toma essa!"],
			lose: ["Ah que penaaa hihi", "Foi por pouco!"],
			bluffCalled: ["Peguei você!"],
			allIn: ["Vamu de tudo, meu bem!"],
			fold: ["Passo, passo!"]
		}
	},
	{
		id: "capitao",
		name: "Capitão Gargalhada",
		title: "Corsário do Rio",
		difficulty: "easy",
		avatarBg: "bg-teal-600",
		emoji: "🏴‍☠️",
		avatarId: "pirate",
		taunts: {
			win: ["ARRR! Tesouro meu!", "Ha-har! Fácil!"],
			lose: ["Maldição do mar!", "Escapou dessa vez."],
			bluffCalled: ["Bom faro, marujo!"],
			allIn: ["Tudo pro baú!"],
			fold: ["Recuar as velas..."]
		}
	},
	{
		id: "cowboy",
		name: "Cowboy Feliz",
		title: "Xerife das Fichas",
		difficulty: "easy",
		avatarBg: "bg-amber-700",
		emoji: "🤠",
		avatarId: "cowboy",
		taunts: {
			win: ["Yeee-haw!", "Ficha na algibeira!"],
			lose: ["Diacho...", "Perdi por um triz."],
			bluffCalled: ["Bem visto, parceiro."],
			allIn: ["Duelo ao amanhecer!"],
			fold: ["Saco a bota."]
		}
	},
	{
		id: "tatico",
		name: "Doutor Naipe",
		title: "Tático de HQ",
		difficulty: "medium",
		avatarBg: "bg-felt",
		emoji: "🧠",
		avatarId: "detective",
		taunts: {
			win: ["Cálculo perfeito.", "Exatamente como previ."],
			lose: ["Interessante...", "Variação estatística."],
			bluffCalled: ["Bem observado."],
			allIn: ["All-in. Convicção matemática."],
			fold: ["Retiro-me. EV negativo."]
		}
	},
	{
		id: "mago",
		name: "Mago dos Números",
		title: "Feiticeiro do Range",
		difficulty: "medium",
		avatarBg: "bg-purple-700",
		emoji: "🔮",
		avatarId: "mage",
		taunts: {
			win: ["A cartomancia falou.", "Vi no cristal."],
			lose: ["A magia falhou hoje.", "Estranho..."],
			bluffCalled: ["Sua visão é apurada."],
			allIn: ["Feitiço supremo!"],
			fold: ["Guardo a varinha."]
		}
	},
	{
		id: "chefe",
		name: "O Chefe",
		title: "Mandachuva da Mesa",
		difficulty: "medium",
		avatarBg: "bg-pow-red",
		emoji: "🎩",
		avatarId: "boss",
		taunts: {
			win: ["Negócio fechado.", "Como combinado."],
			lose: ["Isso vai custar caro.", "Erro contabilizado."],
			bluffCalled: ["Você tem olho, hein?"],
			allIn: ["Vamos ao que interessa."],
			fold: ["Hoje não é o dia."]
		}
	},
	{
		id: "mestre",
		name: "Vilão do Blefe",
		title: "Mestre do Bluff",
		difficulty: "hard",
		avatarBg: "bg-pow-red",
		emoji: "🎭",
		avatarId: "hacker",
		taunts: {
			win: ["Você caiu direitinho.", "HAHA! Previsível."],
			lose: ["Sorte de principiante.", "Aproveita, não se repete."],
			bluffCalled: ["Boa leitura, humano."],
			allIn: ["ALL IN. Vai ter coragem?"],
			fold: ["Guardando as balas."]
		}
	},
	{
		id: "tubarao",
		name: "Tubarão Silencioso",
		title: "Predador da Mesa",
		difficulty: "hard",
		avatarBg: "bg-slate-800",
		emoji: "🦈",
		avatarId: "shark",
		taunts: {
			win: ["...", "Sangue na água."],
			lose: ["Interessante escolha.", "Anotado."],
			bluffCalled: ["Você me viu."],
			allIn: ["Mergulhe comigo."],
			fold: ["Espero minha vez."]
		}
	},
	{
		id: "ninja",
		name: "Sombra Ninja",
		title: "Assassina de Fichas",
		difficulty: "hard",
		avatarBg: "bg-neutral-900",
		emoji: "🥷",
		avatarId: "ninja",
		taunts: {
			win: ["Silencioso e letal.", "Golpe certeiro."],
			lose: ["Sombra dissipada.", "Retiro-me."],
			bluffCalled: ["Boa emboscada."],
			allIn: ["Tudo ou nada. Ninpo!"],
			fold: ["Desapareço."]
		}
	}
];
function personalitiesForDifficulty(d) {
	return PERSONALITIES.filter((p) => p.difficulty === d);
}
function personalityForDifficulty(d) {
	const pool = personalitiesForDifficulty(d);
	if (pool.length === 0) return PERSONALITIES[0];
	return pool[Math.floor(Math.random() * pool.length)];
}
/** Monte Carlo com suporte a variantes. */
function estimateEquity(hole, community, variantId = "holdem", iterations = 200) {
	const v = getVariant(variantId);
	const known = new Set([...hole, ...community].map((c) => `${c.rank}${c.suit}`));
	const remaining = newDeck(variantId).filter((c) => !known.has(`${c.rank}${c.suit}`));
	let wins = 0;
	let ties = 0;
	for (let i = 0; i < iterations; i++) {
		const deck = [...remaining];
		const pick = (n) => {
			const out = [];
			for (let k = 0; k < n; k++) {
				const idx = Math.floor(Math.random() * deck.length);
				out.push(deck[idx]);
				deck.splice(idx, 1);
			}
			return out;
		};
		const oppHole = pick(v.holeCards);
		const need = 5 - community.length;
		const board = [...community, ...pick(need)];
		const my = evaluateHand(hole, board, variantId).score;
		const op = evaluateHand(oppHole, board, variantId).score;
		if (my > op) wins++;
		else if (my === op) ties++;
	}
	return (wins + ties / 2) / iterations;
}
function decideAction(ctx) {
	const toCall = Math.max(0, ctx.currentBet - ctx.myCurrentBet);
	const potOdds = toCall > 0 ? toCall / (ctx.pot + toCall) : 0;
	const baseIters = ctx.difficulty === "hard" ? 400 : ctx.difficulty === "medium" ? 220 : 100;
	const iters = ctx.variant === "omaha" ? Math.max(50, Math.floor(baseIters / 3)) : baseIters;
	const equity = estimateEquity(ctx.hole, ctx.community, ctx.variant, iters);
	const cfg = {
		beginner: {
			aggression: .15,
			bluff: .05,
			foldThreshold: .15
		},
		easy: {
			aggression: .3,
			bluff: .08,
			foldThreshold: .25
		},
		medium: {
			aggression: .5,
			bluff: .15,
			foldThreshold: .35
		},
		hard: {
			aggression: .7,
			bluff: .22,
			foldThreshold: .42
		}
	}[ctx.difficulty];
	const wantRaise = equity > .65 || Math.random() < cfg.bluff && ctx.community.length >= 3;
	if (ctx.canCheck && toCall === 0) {
		if (wantRaise && equity > .5) {
			const raiseSize = Math.min(ctx.stack + ctx.myCurrentBet, ctx.myCurrentBet + Math.max(ctx.minRaise, Math.floor(ctx.pot * cfg.aggression)));
			if (raiseSize >= ctx.stack + ctx.myCurrentBet) return { type: "allin" };
			return {
				type: "raise",
				amount: raiseSize
			};
		}
		return { type: "check" };
	}
	if (equity < cfg.foldThreshold && Math.random() > cfg.bluff * .3) {
		if (toCall > ctx.stack * .5) return { type: "fold" };
		if (Math.random() > equity + .1) return { type: "fold" };
	}
	if (equity > .6 && equity > potOdds + .1 || wantRaise && Math.random() < cfg.aggression) {
		const raiseTotal = ctx.myCurrentBet + toCall + Math.max(ctx.minRaise, Math.floor(ctx.pot * cfg.aggression));
		if (raiseTotal >= ctx.stack + ctx.myCurrentBet) return { type: "allin" };
		return {
			type: "raise",
			amount: raiseTotal
		};
	}
	if (toCall >= ctx.stack) return { type: "allin" };
	return { type: "call" };
}
function triggerSfxForState(prev, next) {
	if (prev && next.lastImpact && (!prev.lastImpact || prev.lastImpact.ts !== next.lastImpact.ts)) {
		const text = next.lastImpact.text;
		if (text.startsWith("FLOP") || text.startsWith("TURN") || text.startsWith("RIVER")) sfx.play("cardFlip");
		else if (text.includes("ALL-IN")) sfx.play("allInWhoosh");
		else if (text.startsWith("RAISE")) sfx.play("chipDrop");
		else if (text.includes("SAIU")) sfx.play("fold");
		else if (text.includes("LEVA") || next.winners.length > 0 && text.includes("—")) sfx.play("potWin");
	} else if (prev) {
		if (next.players.some((p, i) => {
			const pp = prev.players[i];
			return pp && p.lastAction && p.lastAction !== pp.lastAction;
		})) {
			const changed = next.players.find((p, i) => p.lastAction && p.lastAction !== prev.players[i]?.lastAction);
			if (changed?.lastAction?.startsWith("PAGOU")) sfx.play("chipDrop");
			else if (changed?.lastAction === "CHECK") sfx.play("click");
		}
	}
	if (!prev || prev.handNumber !== next.handNumber && next.community.length === 0) sfx.play("cardDeal");
}
var usePokerStore = create((set, get) => ({
	state: null,
	botThinking: false,
	taunt: null,
	lastImpactTs: 0,
	startGame: ({ difficulty, variant = "holdem", startStack = 1e3, smallBlind = 10, bigBlind = 20, playerName = "Você" }) => {
		const personality = personalityForDifficulty(difficulty);
		let s = createInitialState({
			players: [{
				id: "human",
				name: playerName,
				isBot: false,
				startStack
			}, {
				id: "bot1",
				name: personality.name,
				isBot: true,
				personality,
				startStack
			}],
			smallBlind,
			bigBlind,
			variant
		});
		s = startHand(s);
		triggerSfxForState(null, s);
		set({
			state: s,
			taunt: null
		});
		setTimeout(() => get().runBotIfNeeded(), 500);
	},
	humanAction: (action) => {
		const s = get().state;
		if (!s || s.awaitingAdvance) return;
		const cur = s.players[s.actionIdx];
		if (cur.isBot) return;
		const next = playerAction(s, cur.id, action);
		triggerSfxForState(s, next);
		set({ state: next });
		setTimeout(() => get().runBotIfNeeded(), 400);
	},
	advanceHand: () => {
		const s = get().state;
		if (!s || !s.awaitingAdvance) return;
		if (s.players.filter((p) => p.stack > 0).length < 2) return;
		const next = nextHand(s);
		triggerSfxForState(s, next);
		set({
			state: next,
			taunt: null
		});
		setTimeout(() => get().runBotIfNeeded(), 500);
	},
	runBotIfNeeded: () => {
		const s = get().state;
		if (!s || s.awaitingAdvance) return;
		const cur = s.players[s.actionIdx];
		if (!cur.isBot || cur.folded || cur.allIn) return;
		set({ botThinking: true });
		const delay = 700 + Math.random() * 900;
		setTimeout(() => {
			const cs = get().state;
			if (!cs) {
				set({ botThinking: false });
				return;
			}
			const p = cs.players[cs.actionIdx];
			if (!p.isBot) {
				set({ botThinking: false });
				return;
			}
			const toCall = cs.currentBet - p.currentBet;
			const decision = decideAction({
				hole: p.hole,
				community: cs.community,
				stack: p.stack,
				currentBet: cs.currentBet,
				myCurrentBet: p.currentBet,
				pot: cs.pot,
				minRaise: cs.minRaise,
				bigBlind: cs.bigBlind,
				canCheck: toCall === 0,
				difficulty: p.personality?.difficulty ?? "easy",
				variant: cs.variant
			});
			const next = playerAction(cs, p.id, decision);
			triggerSfxForState(cs, next);
			const taunts = p.personality?.taunts;
			let tauntText = null;
			if (taunts) {
				if (decision.type === "fold") tauntText = pick(taunts.fold);
				else if (decision.type === "allin") tauntText = pick(taunts.allIn);
				else if (decision.type === "raise" && Math.random() < .55) tauntText = pick([...taunts.win, ...RAISE_CHATTER]);
				else if (decision.type === "call" && Math.random() < .35) tauntText = pick(CALL_CHATTER);
				else if (decision.type === "check" && Math.random() < .3) tauntText = pick(CHECK_CHATTER);
				else if (Math.random() < .15) tauntText = pick(IDLE_CHATTER);
			}
			set({
				state: next,
				botThinking: false,
				taunt: tauntText ? {
					playerId: p.id,
					text: tauntText,
					ts: Date.now()
				} : null
			});
			setTimeout(() => get().runBotIfNeeded(), 400);
		}, delay);
	}
}));
function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
var RAISE_CHATTER = [
	"Bora aumentar!",
	"Subo mais um pouquinho 😎",
	"Tá quente essa mão!",
	"Vou dar uma esquentada!",
	"Aposta na mesa!",
	"Aumenta aí!"
];
var CALL_CHATTER = [
	"Vou nessa!",
	"Pago pra ver.",
	"Curioso, curioso...",
	"Tô dentro!",
	"Bora ver o que vem.",
	"Aceito o desafio!"
];
var CHECK_CHATTER = [
	"Passo a vez.",
	"Só olhando 👀",
	"Vou esperar.",
	"Segura essa.",
	"Vamos com calma.",
	"Tudo tranquilo."
];
var IDLE_CHATTER = [
	"Cartas boas hoje!",
	"Que jogo bom!",
	"Tô me divertindo!",
	"Mesa animada!",
	"Boa partida!",
	"Vamos que vamos!"
];
function PokerTable({ difficulty, modeLabel, variant = "holdem", smallBlind = 10, bigBlind = 20, startStack = 1e3 }) {
	const state = usePokerStore((s) => s.state);
	const taunt = usePokerStore((s) => s.taunt);
	const botThinking = usePokerStore((s) => s.botThinking);
	const startGame = usePokerStore((s) => s.startGame);
	const humanAction = usePokerStore((s) => s.humanAction);
	const advanceHand = usePokerStore((s) => s.advanceHand);
	(0, import_react.useEffect)(() => {
		sfx.unlock();
		startGame({
			difficulty,
			variant,
			smallBlind,
			bigBlind,
			startStack
		});
	}, [
		difficulty,
		variant,
		smallBlind,
		bigBlind,
		startStack
	]);
	if (!state) return null;
	const v = getVariant(state.variant);
	const human = state.players.find((p) => p.id === "human");
	const bot = state.players.find((p) => p.id !== "human");
	const humanIdx = state.players.findIndex((p) => p.id === "human");
	const botIdx = state.players.findIndex((p) => p.id === bot.id);
	const isHumanTurn = state.actionIdx === humanIdx && !state.awaitingAdvance && !human.folded && !human.allIn;
	const winnerIds = new Set(state.winners.map((w) => w.playerId));
	const gameOver = state.players.filter((p) => p.stack > 0).length < 2 && state.awaitingAdvance;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-[100dvh] landscape-short:h-[100dvh] landscape-short:overflow-hidden overflow-y-auto flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandscapeHint, { blocking: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpactText, {
				text: state.lastImpact?.text,
				ts: state.lastImpact?.ts
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "shrink-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-1.5 md:py-2 landscape-short:py-0.5 landscape-short:px-2 ink-border-thick bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "font-display text-base md:text-lg landscape-short:text-xs text-pow-red hover:text-ink shrink-0",
							onClick: () => sfx.play("click"),
							children: "← MENU"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-display text-sm md:text-base landscape-short:text-xs",
							children: modeLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden md:inline landscape-short:!hidden ink-border bg-pow-yellow text-ink-fixed px-2 py-0.5 text-xs font-display",
							children: v.short
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-body text-xs md:text-sm landscape-short:text-[10px] font-bold",
					children: ["Mão #", state.handNumber]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-h-0 relative grid grid-rows-[auto_1fr_auto] items-center justify-items-center gap-1 md:gap-2 landscape-short:gap-0 px-2 py-1 md:px-4 md:py-2 landscape-short:px-1 landscape-short:py-0",
				style: { background: "radial-gradient(ellipse at center, var(--color-felt) 0%, var(--color-felt-dark) 100%)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-1 landscape-short:pt-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSeat, {
							player: bot,
							isActive: state.actionIdx === botIdx && !state.awaitingAdvance,
							isDealer: state.dealerIdx === botIdx,
							reveal: state.street === "showdown",
							taunt: taunt?.playerId === bot.id ? taunt.text : void 0,
							isWinner: winnerIds.has(bot.id),
							holeCount: v.holeCards
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-1 md:gap-2 landscape-short:gap-0.5 w-full max-w-4xl relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ink-border-thick hard-shadow bg-paper/90 rounded-full px-3 py-0.5 md:px-5 md:py-1.5 landscape-short:px-2 landscape-short:py-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-display text-base md:text-2xl landscape-short:text-xs text-pow-red text-center leading-tight",
									children: ["POT: ", state.pot.toLocaleString("pt-BR")]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										const c = state.community[i];
										if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "shrink-0 w-10 h-14 sm:w-14 sm:h-20 md:w-16 md:h-24 lg:w-20 lg:h-28 landscape-short:w-8 landscape-short:h-11 rounded-md border-2 border-dashed border-white/30" }, i);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
											card: c,
											size: "md",
											dealDelay: i * 80
										}, i);
									})
								})
							}),
							botThinking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute -top-1 right-2 ink-border bg-white/90 text-ink-fixed font-display text-xs px-2 py-0.5 rounded animate-pulse",
								children: "🤔"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pb-1 landscape-short:pb-0 min-h-[140px] md:min-h-[170px] landscape-short:min-h-0 flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSeat, {
							player: human,
							isActive: state.actionIdx === humanIdx && !state.awaitingAdvance,
							isDealer: state.dealerIdx === humanIdx,
							reveal: state.street === "showdown",
							isWinner: winnerIds.has(human.id),
							holeCount: v.holeCards,
							isMe: true
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 relative z-10 bg-background p-2 md:p-3 short:py-1.5 landscape-short:p-1",
				children: gameOver ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ink-border-thick hard-shadow bg-card rounded-lg p-4 md:p-6 text-center max-w-3xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl md:text-3xl mb-3",
						children: human.stack > 0 ? "🏆 VOCÊ VENCEU!" : "💀 GAME OVER!"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
							variant: "primary",
							size: "sm",
							onClick: () => startGame({
								difficulty,
								variant,
								smallBlind,
								bigBlind,
								startStack
							}),
							children: "JOGAR DE NOVO"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
								variant: "secondary",
								size: "sm",
								children: "MENU"
							})
						})]
					})]
				}) : state.awaitingAdvance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ink-border-thick hard-shadow bg-card rounded-lg p-2 md:p-3 flex flex-col items-center gap-1 max-w-3xl mx-auto",
					children: [state.winners.map((w, i) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-base md:text-xl text-center",
							children: [
								state.players.find((pl) => pl.id === w.playerId).name,
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "primary",
						size: "sm",
						onClick: advanceHand,
						className: "mt-1",
						children: "PRÓXIMA MÃO"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionPanel, {
					state,
					onAction: humanAction,
					disabled: !isHumanTurn
				})
			})
		]
	});
}
//#endregion
export { PokerTable as n, usePokerStore as r, PERSONALITIES as t };
