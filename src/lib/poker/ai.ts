import type { Card } from "./cards";
import { evaluateHand } from "./evaluator";
import { newDeck } from "./cards";
import type { VariantId } from "./variants";
import { getVariant } from "./variants";
import type { AvatarId } from "@/lib/avatars";

export type Difficulty = "beginner" | "easy" | "medium" | "hard";

export interface AiPersonality {
  id: string;
  name: string;
  title: string;
  difficulty: Difficulty;
  avatarBg: string;
  emoji: string;
  avatarId: AvatarId;
  taunts: {
    win: string[];
    lose: string[];
    bluffCalled: string[];
    allIn: string[];
    fold: string[];
  };
}

export const PERSONALITIES: AiPersonality[] = [
  // ---------------- BEGINNER ----------------
  {
    id: "aprendiz", name: "Zé Cartinhas", title: "Aprendiz de Cartas", difficulty: "beginner",
    avatarBg: "bg-pow-blue", emoji: "🎓", avatarId: "clown",
    taunts: {
      win: ["Serio? Ganhei? UEBA!", "Foi sorte, juro!"],
      lose: ["Ainda tô aprendendo...", "Ops."],
      bluffCalled: ["Eu tentei blefar!!"],
      allIn: ["ALLIN! É agora ou nunca!"],
      fold: ["Deixa pra próxima..."],
    },
  },
  {
    id: "novato", name: "Novato Sortudo", title: "Iniciante de Sorte", difficulty: "beginner",
    avatarBg: "bg-zinc-400", emoji: "🍀", avatarId: "robot",
    taunts: {
      win: ["Bip bop! Ganhei!", "Cálculo? Não, sorte!"],
      lose: ["Erro 404: vitória.", "Reiniciando..."],
      bluffCalled: ["Blefe detectado."],
      allIn: ["ALL-IN.EXE"],
      fold: ["Abortar missão."],
    },
  },
  {
    id: "timida", name: "Roquinha Tímida", title: "Aprendiz do Palco", difficulty: "beginner",
    avatarBg: "bg-orange-500", emoji: "🎸", avatarId: "rocker",
    taunts: {
      win: ["Ai... ganhei?", "Foi mal, foi mal!"],
      lose: ["Tudo bem, próxima!", "Nem doeu."],
      bluffCalled: ["Foi mal a tentativa..."],
      allIn: ["Vai tudo! AAAH!"],
      fold: ["Melhor não arriscar."],
    },
  },

  // ---------------- EASY ----------------
  {
    id: "sorridente", name: "Dona Sorriso", title: "Sorridente da Média", difficulty: "easy",
    avatarBg: "bg-pow-yellow", emoji: "😄", avatarId: "queen",
    taunts: {
      win: ["Aha! Que fofinho!", "Toma essa!"],
      lose: ["Ah que penaaa hihi", "Foi por pouco!"],
      bluffCalled: ["Peguei você!"],
      allIn: ["Vamu de tudo, meu bem!"],
      fold: ["Passo, passo!"],
    },
  },
  {
    id: "capitao", name: "Capitão Gargalhada", title: "Corsário do Rio", difficulty: "easy",
    avatarBg: "bg-teal-600", emoji: "🏴‍☠️", avatarId: "pirate",
    taunts: {
      win: ["ARRR! Tesouro meu!", "Ha-har! Fácil!"],
      lose: ["Maldição do mar!", "Escapou dessa vez."],
      bluffCalled: ["Bom faro, marujo!"],
      allIn: ["Tudo pro baú!"],
      fold: ["Recuar as velas..."],
    },
  },
  {
    id: "cowboy", name: "Cowboy Feliz", title: "Xerife das Fichas", difficulty: "easy",
    avatarBg: "bg-amber-700", emoji: "🤠", avatarId: "cowboy",
    taunts: {
      win: ["Yeee-haw!", "Ficha na algibeira!"],
      lose: ["Diacho...", "Perdi por um triz."],
      bluffCalled: ["Bem visto, parceiro."],
      allIn: ["Duelo ao amanhecer!"],
      fold: ["Saco a bota."],
    },
  },

  // ---------------- MEDIUM ----------------
  {
    id: "tatico", name: "Doutor Naipe", title: "Tático de HQ", difficulty: "medium",
    avatarBg: "bg-felt", emoji: "🧠", avatarId: "detective",
    taunts: {
      win: ["Cálculo perfeito.", "Exatamente como previ."],
      lose: ["Interessante...", "Variação estatística."],
      bluffCalled: ["Bem observado."],
      allIn: ["All-in. Convicção matemática."],
      fold: ["Retiro-me. EV negativo."],
    },
  },
  {
    id: "mago", name: "Mago dos Números", title: "Feiticeiro do Range", difficulty: "medium",
    avatarBg: "bg-purple-700", emoji: "🔮", avatarId: "mage",
    taunts: {
      win: ["A cartomancia falou.", "Vi no cristal."],
      lose: ["A magia falhou hoje.", "Estranho..."],
      bluffCalled: ["Sua visão é apurada."],
      allIn: ["Feitiço supremo!"],
      fold: ["Guardo a varinha."],
    },
  },
  {
    id: "chefe", name: "O Chefe", title: "Mandachuva da Mesa", difficulty: "medium",
    avatarBg: "bg-pow-red", emoji: "🎩", avatarId: "boss",
    taunts: {
      win: ["Negócio fechado.", "Como combinado."],
      lose: ["Isso vai custar caro.", "Erro contabilizado."],
      bluffCalled: ["Você tem olho, hein?"],
      allIn: ["Vamos ao que interessa."],
      fold: ["Hoje não é o dia."],
    },
  },

  // ---------------- HARD ----------------
  {
    id: "mestre", name: "Vilão do Blefe", title: "Mestre do Bluff", difficulty: "hard",
    avatarBg: "bg-pow-red", emoji: "🎭", avatarId: "hacker",
    taunts: {
      win: ["Você caiu direitinho.", "HAHA! Previsível."],
      lose: ["Sorte de principiante.", "Aproveita, não se repete."],
      bluffCalled: ["Boa leitura, humano."],
      allIn: ["ALL IN. Vai ter coragem?"],
      fold: ["Guardando as balas."],
    },
  },
  {
    id: "tubarao", name: "Tubarão Silencioso", title: "Predador da Mesa", difficulty: "hard",
    avatarBg: "bg-slate-800", emoji: "🦈", avatarId: "shark",
    taunts: {
      win: ["...", "Sangue na água."],
      lose: ["Interessante escolha.", "Anotado."],
      bluffCalled: ["Você me viu."],
      allIn: ["Mergulhe comigo."],
      fold: ["Espero minha vez."],
    },
  },
  {
    id: "ninja", name: "Sombra Ninja", title: "Assassina de Fichas", difficulty: "hard",
    avatarBg: "bg-neutral-900", emoji: "🥷", avatarId: "ninja",
    taunts: {
      win: ["Silencioso e letal.", "Golpe certeiro."],
      lose: ["Sombra dissipada.", "Retiro-me."],
      bluffCalled: ["Boa emboscada."],
      allIn: ["Tudo ou nada. Ninpo!"],
      fold: ["Desapareço."],
    },
  },
];

export function personalitiesForDifficulty(d: Difficulty): AiPersonality[] {
  return PERSONALITIES.filter((p) => p.difficulty === d);
}

export function personalityForDifficulty(d: Difficulty): AiPersonality {
  const pool = personalitiesForDifficulty(d);
  if (pool.length === 0) return PERSONALITIES[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Monte Carlo com suporte a variantes. */
export function estimateEquity(
  hole: Card[], community: Card[],
  variantId: VariantId = "holdem",
  iterations = 200,
): number {
  const v = getVariant(variantId);
  const known = new Set([...hole, ...community].map((c) => `${c.rank}${c.suit}`));
  const remaining = newDeck(variantId).filter((c) => !known.has(`${c.rank}${c.suit}`));
  let wins = 0; let ties = 0;
  for (let i = 0; i < iterations; i++) {
    const deck = [...remaining];
    const pick = (n: number) => {
      const out: Card[] = [];
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

export interface AiContext {
  hole: Card[];
  community: Card[];
  stack: number;
  currentBet: number;
  myCurrentBet: number;
  pot: number;
  minRaise: number;
  bigBlind: number;
  canCheck: boolean;
  difficulty: Difficulty;
  variant: VariantId;
}

export type AiAction =
  | { type: "fold" }
  | { type: "check" }
  | { type: "call" }
  | { type: "raise"; amount: number }
  | { type: "allin" };

export function decideAction(ctx: AiContext): AiAction {
  const toCall = Math.max(0, ctx.currentBet - ctx.myCurrentBet);
  const potOdds = toCall > 0 ? toCall / (ctx.pot + toCall) : 0;

  // Omaha aumenta o custo do MC (60 combos por eval); reduz iterações.
  const baseIters = ctx.difficulty === "hard" ? 400 : ctx.difficulty === "medium" ? 220 : 100;
  const iters = ctx.variant === "omaha" ? Math.max(50, Math.floor(baseIters / 3)) : baseIters;
  const equity = estimateEquity(ctx.hole, ctx.community, ctx.variant, iters);

  const cfg = {
    beginner: { aggression: 0.15, bluff: 0.05, foldThreshold: 0.15 },
    easy:     { aggression: 0.3,  bluff: 0.08, foldThreshold: 0.25 },
    medium:   { aggression: 0.5,  bluff: 0.15, foldThreshold: 0.35 },
    hard:     { aggression: 0.7,  bluff: 0.22, foldThreshold: 0.42 },
  }[ctx.difficulty];

  const wantRaise = equity > 0.65 || (Math.random() < cfg.bluff && ctx.community.length >= 3);

  if (ctx.canCheck && toCall === 0) {
    if (wantRaise && equity > 0.5) {
      const raiseSize = Math.min(ctx.stack + ctx.myCurrentBet,
        ctx.myCurrentBet + Math.max(ctx.minRaise, Math.floor(ctx.pot * cfg.aggression)));
      if (raiseSize >= ctx.stack + ctx.myCurrentBet) return { type: "allin" };
      return { type: "raise", amount: raiseSize };
    }
    return { type: "check" };
  }

  if (equity < cfg.foldThreshold && Math.random() > cfg.bluff * 0.3) {
    if (toCall > ctx.stack * 0.5) return { type: "fold" };
    if (Math.random() > equity + 0.1) return { type: "fold" };
  }

  if ((equity > 0.6 && equity > potOdds + 0.1) || (wantRaise && Math.random() < cfg.aggression)) {
    const raiseTotal = ctx.myCurrentBet + toCall +
      Math.max(ctx.minRaise, Math.floor(ctx.pot * cfg.aggression));
    if (raiseTotal >= ctx.stack + ctx.myCurrentBet) return { type: "allin" };
    return { type: "raise", amount: raiseTotal };
  }

  if (toCall >= ctx.stack) return { type: "allin" };
  return { type: "call" };
}
