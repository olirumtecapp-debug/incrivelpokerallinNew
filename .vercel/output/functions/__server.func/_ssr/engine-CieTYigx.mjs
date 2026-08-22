import { n as __exportAll$1 } from "../_runtime.mjs";
import { a as shuffle, i as newDeck } from "./cards-B2P_Kx9I.mjs";
import { n as getVariant } from "./variants-C5Uqq510.mjs";
import { r as evaluateHand } from "./evaluator-gzvo6JmB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-CieTYigx.js
var engine_CieTYigx_exports = /* @__PURE__ */ __exportAll$1({
	a: () => startHand,
	i: () => playerAction,
	n: () => engine_exports,
	r: () => nextHand,
	t: () => createInitialState
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var engine_exports = /* @__PURE__ */ __exportAll({
	createInitialState: () => createInitialState,
	nextHand: () => nextHand,
	playerAction: () => playerAction,
	startHand: () => startHand
});
var idCounter = 0;
var nextId = () => `l${++idCounter}_${Date.now().toString(36)}`;
function log(state, text, kind = "info") {
	state.log = [...state.log, {
		id: nextId(),
		text,
		kind
	}].slice(-40);
}
function impact(state, text) {
	state.lastImpact = {
		text,
		ts: Date.now()
	};
	log(state, text, "impact");
}
function createInitialState(opts) {
	const players = opts.players.map((p, i) => ({
		id: p.id,
		name: p.name,
		stack: p.startStack,
		hole: [],
		folded: false,
		allIn: false,
		currentBet: 0,
		totalBet: 0,
		hasActed: false,
		isBot: p.isBot,
		personality: p.personality,
		seat: i
	}));
	return {
		variant: opts.variant ?? "holdem",
		players,
		deck: [],
		community: [],
		pot: 0,
		currentBet: 0,
		minRaise: opts.bigBlind,
		smallBlind: opts.smallBlind,
		bigBlind: opts.bigBlind,
		dealerIdx: 0,
		actionIdx: 0,
		street: "ended",
		log: [],
		handNumber: 0,
		winners: [],
		awaitingAdvance: false
	};
}
function startHand(state) {
	const s = clone(state);
	const v = getVariant(s.variant);
	s.handNumber += 1;
	s.deck = shuffle(newDeck(s.variant));
	s.community = [];
	s.pot = 0;
	s.currentBet = 0;
	s.minRaise = s.bigBlind;
	s.winners = [];
	s.awaitingAdvance = false;
	s.lastImpact = void 0;
	if (s.players.filter((p) => p.stack > 0).length < 2) {
		s.street = "ended";
		log(s, "Fim de jogo!");
		return s;
	}
	for (const p of s.players) {
		p.hole = [];
		p.folded = p.stack <= 0;
		p.allIn = false;
		p.currentBet = 0;
		p.totalBet = 0;
		p.hasActed = false;
		p.lastAction = void 0;
	}
	if (s.handNumber > 1) s.dealerIdx = nextActiveSeat(s, s.dealerIdx);
	else s.dealerIdx = s.players.findIndex((p) => !p.folded);
	const activeSeats = s.players.map((p, i) => !p.folded ? i : -1).filter((i) => i >= 0);
	let sbIdx, bbIdx;
	if (activeSeats.length === 2) {
		sbIdx = s.dealerIdx;
		bbIdx = activeSeats.find((i) => i !== s.dealerIdx);
	} else {
		sbIdx = nextActiveSeat(s, s.dealerIdx);
		bbIdx = nextActiveSeat(s, sbIdx);
	}
	postBlind(s, sbIdx, s.smallBlind, "SB");
	postBlind(s, bbIdx, s.bigBlind, "BB");
	s.currentBet = s.bigBlind;
	s.minRaise = s.bigBlind;
	for (let round = 0; round < v.holeCards; round++) {
		let idx = nextActiveSeat(s, s.dealerIdx);
		for (let k = 0; k < activeSeats.length; k++) {
			s.players[idx].hole.push(s.deck.pop());
			idx = nextActiveSeat(s, idx);
		}
	}
	s.actionIdx = activeSeats.length === 2 ? sbIdx : nextActiveSeat(s, bbIdx);
	s.street = "preflop";
	log(s, `— Mão #${s.handNumber} (${v.short}) —`);
	return s;
}
function postBlind(s, idx, amount, label) {
	const p = s.players[idx];
	const pay = Math.min(amount, p.stack);
	p.stack -= pay;
	p.currentBet += pay;
	p.totalBet += pay;
	s.pot += pay;
	if (p.stack === 0) p.allIn = true;
	log(s, `${p.name} paga ${label} ${pay}`, "action");
}
function nextActiveSeat(s, from) {
	const n = s.players.length;
	for (let step = 1; step <= n; step++) {
		const idx = (from + step) % n;
		const p = s.players[idx];
		if (!p.folded && !p.allIn) return idx;
	}
	return from;
}
function anyoneCanAct(s) {
	return s.players.some((p) => !p.folded && !p.allIn && (!p.hasActed || p.currentBet < s.currentBet));
}
function roundIsSettled(s) {
	const active = s.players.filter((p) => !p.folded);
	if (active.length <= 1) return true;
	return active.every((p) => p.allIn || p.hasActed && p.currentBet === s.currentBet);
}
function clone(s) {
	return {
		...s,
		players: s.players.map((p) => ({
			...p,
			hole: [...p.hole]
		})),
		deck: [...s.deck],
		community: [...s.community],
		log: [...s.log],
		winners: [...s.winners],
		lastImpact: s.lastImpact ? { ...s.lastImpact } : void 0
	};
}
function playerAction(state, playerId, action) {
	const s = clone(state);
	const idx = s.players.findIndex((p) => p.id === playerId);
	if (idx !== s.actionIdx) return s;
	const p = s.players[idx];
	if (p.folded || p.allIn) return s;
	const toCall = s.currentBet - p.currentBet;
	switch (action.type) {
		case "fold":
			p.folded = true;
			p.hasActed = true;
			p.lastAction = "FOLD";
			impact(s, `${p.name.toUpperCase()} SAIU!`);
			break;
		case "check":
			if (toCall > 0) return state;
			p.hasActed = true;
			p.lastAction = "CHECK";
			log(s, `${p.name} deu check`, "action");
			break;
		case "call": {
			const pay = Math.min(toCall, p.stack);
			p.stack -= pay;
			p.currentBet += pay;
			p.totalBet += pay;
			s.pot += pay;
			if (p.stack === 0) p.allIn = true;
			p.hasActed = true;
			p.lastAction = `PAGOU ${pay}`;
			log(s, `${p.name} pagou ${pay}`, "action");
			break;
		}
		case "raise": {
			const targetTotal = action.amount;
			const raiseBy = targetTotal - s.currentBet;
			if (raiseBy < s.minRaise) return state;
			const pay = targetTotal - p.currentBet;
			if (pay > p.stack) return state;
			p.stack -= pay;
			p.currentBet = targetTotal;
			p.totalBet += pay;
			s.pot += pay;
			if (p.stack === 0) p.allIn = true;
			s.currentBet = targetTotal;
			s.minRaise = raiseBy;
			p.hasActed = true;
			p.lastAction = `RAISE ${targetTotal}`;
			s.players.forEach((op) => {
				if (op.id !== p.id && !op.folded && !op.allIn) op.hasActed = false;
			});
			impact(s, `RAISE! ${targetTotal}`);
			break;
		}
		case "allin": {
			const pay = p.stack;
			const newTotal = p.currentBet + pay;
			p.stack = 0;
			p.currentBet = newTotal;
			p.totalBet += pay;
			s.pot += pay;
			p.allIn = true;
			p.hasActed = true;
			p.lastAction = "ALL-IN!";
			if (newTotal > s.currentBet) {
				const raiseBy = newTotal - s.currentBet;
				s.currentBet = newTotal;
				if (raiseBy >= s.minRaise) s.minRaise = raiseBy;
				s.players.forEach((op) => {
					if (op.id !== p.id && !op.folded && !op.allIn) op.hasActed = false;
				});
			}
			impact(s, `${p.name.toUpperCase()} ALL-IN!`);
			break;
		}
	}
	return advanceIfNeeded(s);
}
function advanceIfNeeded(s) {
	if (s.players.filter((p) => !p.folded).length === 1) return finishHand(s);
	if (roundIsSettled(s)) return advanceStreet(s);
	if (!anyoneCanAct(s)) return advanceStreet(s);
	s.actionIdx = nextActiveSeat(s, s.actionIdx);
	return s;
}
function advanceStreet(s) {
	s.players.forEach((p) => {
		p.currentBet = 0;
		p.hasActed = false;
	});
	s.currentBet = 0;
	s.minRaise = s.bigBlind;
	if (s.street === "preflop") {
		s.deck.pop();
		s.community.push(s.deck.pop(), s.deck.pop(), s.deck.pop());
		s.street = "flop";
		impact(s, "FLOP!");
	} else if (s.street === "flop") {
		s.deck.pop();
		s.community.push(s.deck.pop());
		s.street = "turn";
		impact(s, "TURN!");
	} else if (s.street === "turn") {
		s.deck.pop();
		s.community.push(s.deck.pop());
		s.street = "river";
		impact(s, "RIVER!");
	} else if (s.street === "river") return finishHand(s);
	if (!anyoneCanAct(s)) {
		if (s.street !== "river") return advanceStreet(s);
		return finishHand(s);
	}
	s.actionIdx = nextActiveSeat(s, s.dealerIdx);
	return s;
}
function finishHand(s) {
	s.street = "showdown";
	const inHand = s.players.filter((p) => !p.folded);
	if (inHand.length === 1) {
		const winner = inHand[0];
		winner.stack += s.pot;
		s.winners = [{
			playerId: winner.id,
			amount: s.pot
		}];
		impact(s, `${winner.name.toUpperCase()} LEVA ${s.pot}!`);
		s.pot = 0;
		s.awaitingAdvance = true;
		return s;
	}
	const contenders = [...inHand].sort((a, b) => a.totalBet - b.totalBet);
	const allInHand = s.players.filter((p) => p.totalBet > 0);
	const winners = [];
	let remaining = s.pot;
	const processed = /* @__PURE__ */ new Set();
	let prevCap = 0;
	for (const c of contenders) {
		const cap = c.totalBet;
		if (cap === prevCap) {
			processed.add(c.id);
			continue;
		}
		let potSize = 0;
		for (const p of allInHand) {
			if (p.totalBet <= prevCap) continue;
			potSize += Math.min(p.totalBet, cap) - prevCap;
		}
		const eligible = inHand.filter((p) => p.totalBet >= cap);
		let best = null;
		for (const p of eligible) {
			const ev = evaluateHand(p.hole, s.community, s.variant);
			if (!best || ev.score > best.score) best = {
				score: ev.score,
				ids: [p.id],
				handName: ev.name,
				cards: ev.best
			};
			else if (ev.score === best.score) best.ids.push(p.id);
		}
		if (best) {
			const share = Math.floor(potSize / best.ids.length);
			for (const id of best.ids) {
				const p = s.players.find((x) => x.id === id);
				p.stack += share;
				winners.push({
					playerId: id,
					amount: share,
					handName: best.handName,
					cards: best.cards
				});
			}
			remaining -= share * best.ids.length;
		}
		prevCap = cap;
		processed.add(c.id);
	}
	if (remaining > 0 && winners[0]) {
		const p = s.players.find((x) => x.id === winners[0].playerId);
		p.stack += remaining;
		winners[0].amount += remaining;
	}
	s.winners = winners;
	s.pot = 0;
	const w = winners[0];
	if (w) impact(s, `${s.players.find((p) => p.id === w.playerId).name.toUpperCase()} — ${w.handName?.toUpperCase()}!`);
	s.awaitingAdvance = true;
	return s;
}
function nextHand(state) {
	return startHand(state);
}
//#endregion
export { startHand as a, playerAction as i, engine_CieTYigx_exports as n, nextHand as r, createInitialState as t };
