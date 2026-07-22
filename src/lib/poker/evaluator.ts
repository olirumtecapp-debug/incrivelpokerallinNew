import type { Card, Rank } from "./cards";
import type { VariantId } from "./variants";
import { getVariant } from "./variants";

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
  score: number;
  best: Card[];
  name: string;
}

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

function eval5(cards: Card[], shortDeck: boolean): { rank: HandRank; tiebreak: number[] } {
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);
  const counts = new Map<Rank, number>();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
  const byCount = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);

  const isFlush = suits.every((s) => s === suits[0]);

  const unique = [...new Set(ranks)];
  let isStraight = false;
  let straightHigh = 0;
  if (unique.length === 5) {
    if (unique[0] - unique[4] === 4) { isStraight = true; straightHigh = unique[0]; }
    else if (!shortDeck && unique[0] === 14 && unique[1] === 5 && unique[2] === 4 && unique[3] === 3 && unique[4] === 2) {
      // Wheel Hold'em: A-2-3-4-5
      isStraight = true; straightHigh = 5;
    }
    else if (shortDeck && unique[0] === 14 && unique[1] === 9 && unique[2] === 8 && unique[3] === 7 && unique[4] === 6) {
      // Wheel Short Deck: A-6-7-8-9
      isStraight = true; straightHigh = 9;
    }
  }

  if (isFlush && isStraight) {
    if (straightHigh === 14) return { rank: HandRank.ROYAL_FLUSH, tiebreak: [14] };
    return { rank: HandRank.STRAIGHT_FLUSH, tiebreak: [straightHigh] };
  }
  if (byCount[0][1] === 4) {
    return { rank: HandRank.FOUR_KIND, tiebreak: [byCount[0][0], byCount[1][0]] };
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
    return { rank: HandRank.TWO_PAIR, tiebreak: [...pairs, byCount[2][0]] };
  }
  if (byCount[0][1] === 2) {
    const kickers = byCount.slice(1).map((e) => e[0]).sort((a, b) => b - a).slice(0, 3);
    return { rank: HandRank.PAIR, tiebreak: [byCount[0][0], ...kickers] };
  }
  return { rank: HandRank.HIGH_CARD, tiebreak: ranks };
}

function rankValue(rank: HandRank, shortDeck: boolean): number {
  if (!shortDeck) return rank;
  // Short deck: flush > full house. Swap FLUSH(6) and FULL_HOUSE(7).
  if (rank === HandRank.FLUSH) return HandRank.FULL_HOUSE;
  if (rank === HandRank.FULL_HOUSE) return HandRank.FLUSH;
  return rank;
}

function packScore(rank: HandRank, tiebreak: number[], shortDeck: boolean): number {
  const rv = rankValue(rank, shortDeck);
  let score = rv * Math.pow(15, 5);
  for (let i = 0; i < 5; i++) {
    const t = tiebreak[i] ?? 0;
    score += t * Math.pow(15, 4 - i);
  }
  return score;
}

/** Melhor mão para variante escolhida (Hold'em, Omaha, Short Deck). */
export function evaluateHand(hole: Card[], community: Card[], variantId: VariantId = "holdem"): EvaluatedHand {
  const v = getVariant(variantId);
  const total = hole.length + community.length;
  if (total < 5) throw new Error("Necessário 5+ cartas");

  let best: { rank: HandRank; tiebreak: number[]; combo: Card[] } | null = null;

  if (v.mustUseExactHoleCards !== null) {
    const need = v.mustUseExactHoleCards;
    const holeCombos = combinations(hole, need);
    const boardCombos = combinations(community, 5 - need);
    for (const h of holeCombos) for (const b of boardCombos) {
      const combo = [...h, ...b];
      const ev = eval5(combo, v.shortDeck);
      if (!best || packScore(ev.rank, ev.tiebreak, v.shortDeck) > packScore(best.rank, best.tiebreak, v.shortDeck)) {
        best = { ...ev, combo };
      }
    }
  } else {
    const all = [...hole, ...community];
    const combos = all.length === 5 ? [all] : combinations(all, 5);
    for (const combo of combos) {
      const ev = eval5(combo, v.shortDeck);
      if (!best || packScore(ev.rank, ev.tiebreak, v.shortDeck) > packScore(best.rank, best.tiebreak, v.shortDeck)) {
        best = { ...ev, combo };
      }
    }
  }

  const b = best!;
  return {
    rank: b.rank,
    score: packScore(b.rank, b.tiebreak, v.shortDeck),
    best: b.combo,
    name: HAND_NAME[b.rank],
  };
}

/** Legacy Hold'em helper. */
export function evaluateBest(cards: Card[]): EvaluatedHand {
  if (cards.length < 5) throw new Error("Necessário 5+ cartas");
  const combos = cards.length === 5 ? [cards] : combinations(cards, 5);
  let best: { rank: HandRank; tiebreak: number[]; combo: Card[] } | null = null;
  for (const c of combos) {
    const ev = eval5(c, false);
    if (!best || packScore(ev.rank, ev.tiebreak, false) > packScore(best.rank, best.tiebreak, false)) {
      best = { ...ev, combo: c };
    }
  }
  const b = best!;
  return {
    rank: b.rank,
    score: packScore(b.rank, b.tiebreak, false),
    best: b.combo,
    name: HAND_NAME[b.rank],
  };
}
