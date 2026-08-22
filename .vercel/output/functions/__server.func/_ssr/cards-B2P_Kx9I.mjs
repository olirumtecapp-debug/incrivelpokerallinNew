//#region node_modules/.nitro/vite/services/ssr/assets/cards-B2P_Kx9I.js
var SUITS = [
	"S",
	"H",
	"D",
	"C"
];
var RANKS = [
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14
];
var SHORT_DECK_RANKS = [
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14
];
var SUIT_LABEL = {
	S: "♠",
	H: "♥",
	D: "♦",
	C: "♣"
};
var RANK_LABEL = {
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10",
	11: "J",
	12: "Q",
	13: "K",
	14: "A"
};
function isRed(suit) {
	return suit === "H" || suit === "D";
}
function newDeck(variant) {
	const ranks = variant === "shortdeck" ? SHORT_DECK_RANKS : RANKS;
	const deck = [];
	for (const s of SUITS) for (const r of ranks) deck.push({
		rank: r,
		suit: s
	});
	return deck;
}
function shuffle(arr) {
	const out = [...arr];
	const cryptoObj = typeof globalThis !== "undefined" ? globalThis.crypto : void 0;
	const randomInt = (max) => {
		if (cryptoObj?.getRandomValues) {
			const buf = /* @__PURE__ */ new Uint32Array(1);
			cryptoObj.getRandomValues(buf);
			return buf[0] % max;
		}
		return Math.floor(Math.random() * max);
	};
	for (let i = out.length - 1; i > 0; i--) {
		const j = randomInt(i + 1);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}
//#endregion
export { shuffle as a, newDeck as i, SUIT_LABEL as n, isRed as r, RANK_LABEL as t };
