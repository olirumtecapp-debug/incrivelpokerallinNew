export type VariantId = "holdem" | "omaha" | "shortdeck";

export interface Variant {
  id: VariantId;
  name: string;
  short: string;
  description: string;
  holeCards: number;
  deckSize: number;
  /** null = free (Hold'em/Short Deck). Number = deve usar exatamente esse número de hole cards (Omaha=2). */
  mustUseExactHoleCards: number | null;
  shortDeck: boolean;
  emoji: string;
}

export const VARIANTS: Record<VariantId, Variant> = {
  holdem: {
    id: "holdem",
    name: "Texas Hold'em",
    short: "HOLD'EM",
    description: "O clássico: 2 hole cards + 5 comunitárias. Baralho completo.",
    holeCards: 2,
    deckSize: 52,
    mustUseExactHoleCards: null,
    shortDeck: false,
    emoji: "🃏",
  },
  omaha: {
    id: "omaha",
    name: "Omaha",
    short: "OMAHA",
    description: "4 hole cards. Você DEVE usar exatamente 2 delas + 3 da mesa.",
    holeCards: 4,
    deckSize: 52,
    mustUseExactHoleCards: 2,
    shortDeck: false,
    emoji: "🎴",
  },
  shortdeck: {
    id: "shortdeck",
    name: "Short Deck",
    short: "SHORT",
    description: "Baralho de 36 cartas (sem 2-5). Flush vale mais que Full House. A-6-7-8-9 é uma sequência.",
    holeCards: 2,
    deckSize: 36,
    mustUseExactHoleCards: null,
    shortDeck: true,
    emoji: "⚡",
  },
};

export const VARIANT_LIST: Variant[] = [VARIANTS.holdem, VARIANTS.omaha, VARIANTS.shortdeck];

export function getVariant(id: VariantId | undefined | null): Variant {
  if (!id) return VARIANTS.holdem;
  return VARIANTS[id] ?? VARIANTS.holdem;
}
