import type { Card, Rank } from "./cards";

export enum HandRank {
  HIGH_CARD = 1,
  PAIR = 2,
  TWO_PAIR = 3,
  THREE_KIND = 4,
  STRAIGHT = 5,
  FLUSH = 6,
  FULL_HOUSE = 7,
  FOUR_KIND = 8,
  STRAIGHT_FLUSH = 9,
  ROYAL_FLUSH = 10,
}

export const HAND_NAME: Record<HandRank, string> = {
  [HandRank.HIGH_CARD]: "Carta Alta",
  [HandRank.PAIR]: "Par",
  [HandRank.TWO_PAIR]: "Dois Pares",
  [HandRank.THREE_KIND]: "Trinca",
  [HandRank.STRAIGHT]: "Sequência",
  [HandRank.FLUSH]: "Flush",
  [HandRank.FULL_HOUSE]: "Full House",
  [HandRank.FOUR_KIND]: "Quadra",
  [HandRank.STRAIGHT_FLUSH]: "Straight Flush",
  [HandRank.ROYAL_FLUSH]: "Royal Flush",
};

export interface EvaluatedHand {
  rank: HandRank;
  /** Score numérico comparável: rank*1e10 + tiebreakers packed. */
  score: number;
  /** 5 cartas que formam a melhor mão. */
  best: Card[];
  name: string;
}

// Escolhe k de n → combinações. n<=7 tá tranquilo (C(7,5)=21).
function combinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = [];
  const recur = (start: number, combo: T[]) => {
    if (combo.length === k) { result.push([...combo]); return; }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      recur(i + 1, combo);
      combo.pop();
    }
  };
  recur(0, []);
  return result;
}

function eval5(cards: Card[]): { rank: HandRank; tiebreak: number[] } {
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);
  const counts = new Map<Rank, number>();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
  const byCount = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);

  const isFlush = suits.every((s) => s === suits[0]);

  // Sequência
  const unique = [...new Set(ranks)];
  let isStraight = false;
  let straightHigh = 0;
  if (unique.length === 5) {
    if (unique[0] - unique[4] === 4) { isStraight = true; straightHigh = unique[0]; }
    // A-2-3-4-5 (wheel)
    else if (unique[0] === 14 && unique[1] === 5 && unique[2] === 4 && unique[3] === 3 && unique[4] === 2) {
      isStraight = true; straightHigh = 5;
    }
  }

  if (isFlush && isStraight) {
    if (straightHigh === 14) return { rank: HandRank.ROYAL_FLUSH, tiebreak: [14] };
    return { rank: HandRank.STRAIGHT_FLUSH, tiebreak: [straightHigh] };
  }
  if (byCount[0][1] === 4) {
    const kicker = byCount[1][0];
    return { rank: HandRank.FOUR_KIND, tiebreak: [byCount[0][0], kicker] };
  }
  if (byCount[0][1] === 3 && byCount[1][1] === 2) {
    return { rank: HandRank.FULL_HOUSE, tiebreak: [byCount[0][0], byCount[1][0]] };
  }
  if (isFlush) return { rank: HandRank.FLUSH, tiebreak: ranks };
  if (isStraight) return { rank: HandRank.STRAIGHT, tiebreak: [straightHigh] };
  if (byCount[0][1] === 3) {
    const kickers = byCount.slice(1).map((e) => e[0]).sort((a, b) => b - a).slice(0, 2);
    return { rank: HandRank.THREE_KIND, tiebreak: [byCount[0][0], ...kickers] };
  }
  if (byCount[0][1] === 2 && byCount[1][1] === 2) {
    const pairs = [byCount[0][0], byCount[1][0]].sort((a, b) => b - a);
    const kicker = byCount[2][0];
    return { rank: HandRank.TWO_PAIR, tiebreak: [...pairs, kicker] };
  }
  if (byCount[0][1] === 2) {
    const kickers = byCount.slice(1).map((e) => e[0]).sort((a, b) => b - a).slice(0, 3);
    return { rank: HandRank.PAIR, tiebreak: [byCount[0][0], ...kickers] };
  }
  return { rank: HandRank.HIGH_CARD, tiebreak: ranks };
}

function packScore(rank: HandRank, tiebreak: number[]): number {
  // rank * 15^5 + sum tiebreaks em base 15
  let score = rank * Math.pow(15, 5);
  for (let i = 0; i < 5; i++) {
    const t = tiebreak[i] ?? 0;
    score += t * Math.pow(15, 4 - i);
  }
  return score;
}

/** Melhor mão 5-de-N (5..7). */
export function evaluateBest(cards: Card[]): EvaluatedHand {
  if (cards.length < 5) throw new Error("Necessário 5+ cartas");
  const combos = cards.length === 5 ? [cards] : combinations(cards, 5);
  let best: { rank: HandRank; tiebreak: number[]; combo: Card[] } | null = null;
  for (const c of combos) {
    const ev = eval5(c);
    if (!best || packScore(ev.rank, ev.tiebreak) > packScore(best.rank, best.tiebreak)) {
      best = { ...ev, combo: c };
    }
  }
  const b = best!;
  return {
    rank: b.rank,
    score: packScore(b.rank, b.tiebreak),
    best: b.combo,
    name: HAND_NAME[b.rank],
  };
}
