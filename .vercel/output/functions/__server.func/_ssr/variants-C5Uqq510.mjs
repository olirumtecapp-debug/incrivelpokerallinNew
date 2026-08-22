//#region node_modules/.nitro/vite/services/ssr/assets/variants-C5Uqq510.js
var VARIANTS = {
	holdem: {
		id: "holdem",
		name: "Texas Hold'em",
		short: "HOLD'EM",
		description: "O clássico: 2 hole cards + 5 comunitárias. Baralho completo.",
		holeCards: 2,
		deckSize: 52,
		mustUseExactHoleCards: null,
		shortDeck: false,
		emoji: "🃏"
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
		emoji: "🎴"
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
		emoji: "⚡"
	}
};
var VARIANT_LIST = [
	VARIANTS.holdem,
	VARIANTS.omaha,
	VARIANTS.shortdeck
];
function getVariant(id) {
	if (!id) return VARIANTS.holdem;
	return VARIANTS[id] ?? VARIANTS.holdem;
}
//#endregion
export { getVariant as n, VARIANT_LIST as t };
