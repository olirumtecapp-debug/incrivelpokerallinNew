import { n as getVariant } from "./variants-C5Uqq510.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evaluator-gzvo6JmB.js
var HandRank = /* @__PURE__ */ function(HandRank) {
	HandRank[HandRank["HIGH_CARD"] = 1] = "HIGH_CARD";
	HandRank[HandRank["PAIR"] = 2] = "PAIR";
	HandRank[HandRank["TWO_PAIR"] = 3] = "TWO_PAIR";
	HandRank[HandRank["THREE_KIND"] = 4] = "THREE_KIND";
	HandRank[HandRank["STRAIGHT"] = 5] = "STRAIGHT";
	HandRank[HandRank["FLUSH"] = 6] = "FLUSH";
	HandRank[HandRank["FULL_HOUSE"] = 7] = "FULL_HOUSE";
	HandRank[HandRank["FOUR_KIND"] = 8] = "FOUR_KIND";
	HandRank[HandRank["STRAIGHT_FLUSH"] = 9] = "STRAIGHT_FLUSH";
	HandRank[HandRank["ROYAL_FLUSH"] = 10] = "ROYAL_FLUSH";
	return HandRank;
}({});
var HAND_NAME = {
	[1]: "Carta Alta",
	[2]: "Par",
	[3]: "Dois Pares",
	[4]: "Trinca",
	[5]: "Sequência",
	[6]: "Flush",
	[7]: "Full House",
	[8]: "Quadra",
	[9]: "Straight Flush",
	[10]: "Royal Flush"
};
function combinations(arr, k) {
	const result = [];
	const recur = (start, combo) => {
		if (combo.length === k) {
			result.push([...combo]);
			return;
		}
		for (let i = start; i < arr.length; i++) {
			combo.push(arr[i]);
			recur(i + 1, combo);
			combo.pop();
		}
	};
	recur(0, []);
	return result;
}
function eval5(cards, shortDeck) {
	const ranks = cards.map((c) => c.rank).sort((a, b) => b - a);
	const suits = cards.map((c) => c.suit);
	const counts = /* @__PURE__ */ new Map();
	for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
	const byCount = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
	const isFlush = suits.every((s) => s === suits[0]);
	const unique = [...new Set(ranks)];
	let isStraight = false;
	let straightHigh = 0;
	if (unique.length === 5) {
		if (unique[0] - unique[4] === 4) {
			isStraight = true;
			straightHigh = unique[0];
		} else if (!shortDeck && unique[0] === 14 && unique[1] === 5 && unique[2] === 4 && unique[3] === 3 && unique[4] === 2) {
			isStraight = true;
			straightHigh = 5;
		} else if (shortDeck && unique[0] === 14 && unique[1] === 9 && unique[2] === 8 && unique[3] === 7 && unique[4] === 6) {
			isStraight = true;
			straightHigh = 9;
		}
	}
	if (isFlush && isStraight) {
		if (straightHigh === 14) return {
			rank: 10,
			tiebreak: [14]
		};
		return {
			rank: 9,
			tiebreak: [straightHigh]
		};
	}
	if (byCount[0][1] === 4) return {
		rank: 8,
		tiebreak: [byCount[0][0], byCount[1][0]]
	};
	if (byCount[0][1] === 3 && byCount[1][1] === 2) return {
		rank: 7,
		tiebreak: [byCount[0][0], byCount[1][0]]
	};
	if (isFlush) return {
		rank: 6,
		tiebreak: ranks
	};
	if (isStraight) return {
		rank: 5,
		tiebreak: [straightHigh]
	};
	if (byCount[0][1] === 3) {
		const kickers = byCount.slice(1).map((e) => e[0]).sort((a, b) => b - a).slice(0, 2);
		return {
			rank: 4,
			tiebreak: [byCount[0][0], ...kickers]
		};
	}
	if (byCount[0][1] === 2 && byCount[1][1] === 2) return {
		rank: 3,
		tiebreak: [...[byCount[0][0], byCount[1][0]].sort((a, b) => b - a), byCount[2][0]]
	};
	if (byCount[0][1] === 2) {
		const kickers = byCount.slice(1).map((e) => e[0]).sort((a, b) => b - a).slice(0, 3);
		return {
			rank: 2,
			tiebreak: [byCount[0][0], ...kickers]
		};
	}
	return {
		rank: 1,
		tiebreak: ranks
	};
}
function rankValue(rank, shortDeck) {
	if (!shortDeck) return rank;
	if (rank === 6) return 7;
	if (rank === 7) return 6;
	return rank;
}
function packScore(rank, tiebreak, shortDeck) {
	let score = rankValue(rank, shortDeck) * Math.pow(15, 5);
	for (let i = 0; i < 5; i++) {
		const t = tiebreak[i] ?? 0;
		score += t * Math.pow(15, 4 - i);
	}
	return score;
}
/** Melhor mão para variante escolhida (Hold'em, Omaha, Short Deck). */
function evaluateHand(hole, community, variantId = "holdem") {
	const v = getVariant(variantId);
	if (hole.length + community.length < 5) throw new Error("Necessário 5+ cartas");
	let best = null;
	if (v.mustUseExactHoleCards !== null) {
		const need = v.mustUseExactHoleCards;
		const holeCombos = combinations(hole, need);
		const boardCombos = combinations(community, 5 - need);
		for (const h of holeCombos) for (const b of boardCombos) {
			const combo = [...h, ...b];
			const ev = eval5(combo, v.shortDeck);
			if (!best || packScore(ev.rank, ev.tiebreak, v.shortDeck) > packScore(best.rank, best.tiebreak, v.shortDeck)) best = {
				...ev,
				combo
			};
		}
	} else {
		const all = [...hole, ...community];
		const combos = all.length === 5 ? [all] : combinations(all, 5);
		for (const combo of combos) {
			const ev = eval5(combo, v.shortDeck);
			if (!best || packScore(ev.rank, ev.tiebreak, v.shortDeck) > packScore(best.rank, best.tiebreak, v.shortDeck)) best = {
				...ev,
				combo
			};
		}
	}
	const b = best;
	return {
		rank: b.rank,
		score: packScore(b.rank, b.tiebreak, v.shortDeck),
		best: b.combo,
		name: HAND_NAME[b.rank]
	};
}
//#endregion
export { HandRank as n, evaluateHand as r, HAND_NAME as t };
