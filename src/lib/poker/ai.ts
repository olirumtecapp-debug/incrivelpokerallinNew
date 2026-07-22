import type { Card } from "./cards";
import { evaluateBest, HandRank } from "./evaluator";
import { newDeck } from "./cards";

export type Difficulty = "beginner" | "easy" | "medium" | "hard";

export interface AiPersonality {
  id: string;
  name: string;
  title: string;
  difficulty: Difficulty;
  avatarBg: string; // tailwind class
  emoji: string;
  taunts: {
    win: string[];
    lose: string[];
    bluffCalled: string[];
    allIn: string[];
    fold: string[];
  };
}

export const PERSONALITIES: AiPersonality[] = [
  {
    id: "aprendiz", name: "Zé Cartinhas", title: "Aprendiz de Cartas", difficulty: "beginner",
    avatarBg: "bg-pow-blue", emoji: "🎓",
    taunts: {
      win: ["Serio? Ganhei? UEBA!", "Foi sorte, juro!"],
      lose: ["Ainda tô aprendendo...", "Ops."],
      bluffCalled: ["Eu tentei blefar!!"],
      allIn: ["ALLIN! É agora ou nunca!"],
      fold: ["Deixa pra próxima..."],
    },
  },
  {
    id: "sorridente", name: "Dona Sorriso", title: "Sorridente da Média", difficulty: "easy",
    avatarBg: "bg-pow-yellow", emoji: "😄",
    taunts: {
      win: ["Aha! Que fofinho!", "Toma essa!"],
      lose: ["Ah que penaaa hihi", "Foi por pouco!"],
      bluffCalled: ["Peguei você!"],
      allIn: ["Vamu de tudo, meu bem!"],
      fold: ["Passo, passo!"],
    },
  },
  {
    id: "tatico", name: "Doutor Naipe", title: "Tático de HQ", difficulty: "medium",
    avatarBg: "bg-felt", emoji: "🧠",
    taunts: {
      win: ["Cálculo perfeito.", "Exatamente como previ."],
      lose: ["Interessante...", "Variação estatística."],
      bluffCalled: ["Bem observado."],
      allIn: ["All-in. Convicção matemática."],
      fold: ["Retiro-me. EV negativo."],
    },
  },
  {
    id: "mestre", name: "Vilão do Blefe", title: "Mestre do Bluff", difficulty: "hard",
    avatarBg: "bg-pow-red", emoji: "🎭",
    taunts: {
      win: ["Você caiu direitinho.", "HAHA! Previsível."],
      lose: ["Sorte de principiante.", "Aproveita, não se repete."],
      bluffCalled: ["Boa leitura, humano."],
      allIn: ["ALL IN. Vai ter coragem?"],
      fold: ["Guardando as balas."],
    },
  },
];

export function personalityForDifficulty(d: Difficulty): AiPersonality {
  return PERSONALITIES.find((p) => p.difficulty === d) ?? PERSONALITIES[0];
}

/** Monte Carlo simplificado: estima equity vs 1 oponente aleatório. */
export function estimateEquity(hole: Card[], community: Card[], iterations = 200): number {
  const known = new Set([...hole, ...community].map((c) => `${c.rank}${c.suit}`));
  const remaining = newDeck().filter((c) => !known.has(`${c.rank}${c.suit}`));
  let wins = 0; let ties = 0;
  for (let i = 0; i < iterations; i++) {
    const deck = [...remaining];
    // sample sem repetição
    const pick = (n: number) => {
      const out: Card[] = [];
      for (let k = 0; k < n; k++) {
        const idx = Math.floor(Math.random() * deck.length);
        out.push(deck[idx]);
        deck.splice(idx, 1);
      }
      return out;
    };
    const oppHole = pick(2);
    const need = 5 - community.length;
    const board = [...community, ...pick(need)];
    const my = evaluateBest([...hole, ...board]).score;
    const op = evaluateBest([...oppHole, ...board]).score;
    if (my > op) wins++;
    else if (my === op) ties++;
  }
  return (wins + ties / 2) / iterations;
}

export interface AiContext {
  hole: Card[];
  community: Card[];
  stack: number;
  currentBet: number;      // maior bet da rodada
  myCurrentBet: number;    // meu commit na rodada
  pot: number;
  minRaise: number;
  bigBlind: number;
  canCheck: boolean;
  difficulty: Difficulty;
}

export type AiAction =
  | { type: "fold" }
  | { type: "check" }
  | { type: "call" }
  | { type: "raise"; amount: number } // amount = NOVO total de bet na rodada
  | { type: "allin" };

/** Escolhe ação para IA. */
export function decideAction(ctx: AiContext): AiAction {
  const toCall = Math.max(0, ctx.currentBet - ctx.myCurrentBet);
  const potOdds = toCall > 0 ? toCall / (ctx.pot + toCall) : 0;

  // Iterations por dificuldade
  const iters = ctx.difficulty === "hard" ? 400 : ctx.difficulty === "medium" ? 220 : 100;
  const equity = estimateEquity(ctx.hole, ctx.community, iters);

  // Aggression + bluff freq por dificuldade
  const cfg = {
    beginner: { aggression: 0.15, bluff: 0.05, foldThreshold: 0.15 },
    easy:     { aggression: 0.3,  bluff: 0.08, foldThreshold: 0.25 },
    medium:   { aggression: 0.5,  bluff: 0.15, foldThreshold: 0.35 },
    hard:     { aggression: 0.7,  bluff: 0.22, foldThreshold: 0.42 },
  }[ctx.difficulty];

  const wantRaise = equity > 0.65 || (Math.random() < cfg.bluff && ctx.community.length >= 3);

  // Se pode dar check
  if (ctx.canCheck && toCall === 0) {
    if (wantRaise && equity > 0.5) {
      const raiseSize = Math.min(ctx.stack + ctx.myCurrentBet,
        ctx.myCurrentBet + Math.max(ctx.minRaise, Math.floor(ctx.pot * cfg.aggression)));
      if (raiseSize >= ctx.stack + ctx.myCurrentBet) return { type: "allin" };
      return { type: "raise", amount: raiseSize };
    }
    return { type: "check" };
  }

  // Precisa pagar
  if (equity < cfg.foldThreshold && Math.random() > cfg.bluff * 0.3) {
    if (toCall > ctx.stack * 0.5) return { type: "fold" };
    if (Math.random() > equity + 0.1) return { type: "fold" };
  }

  // Equity boa OR bluff → raise
  if ((equity > 0.6 && equity > potOdds + 0.1) || (wantRaise && Math.random() < cfg.aggression)) {
    const raiseTotal = ctx.myCurrentBet + toCall +
      Math.max(ctx.minRaise, Math.floor(ctx.pot * cfg.aggression));
    if (raiseTotal >= ctx.stack + ctx.myCurrentBet) return { type: "allin" };
    return { type: "raise", amount: raiseTotal };
  }

  // Call
  if (toCall >= ctx.stack) return { type: "allin" };
  return { type: "call" };
}
