import type { Card } from "./cards";
import { newDeck, shuffle } from "./cards";
import { evaluateBest, HandRank, HAND_NAME } from "./evaluator";
import type { AiPersonality } from "./ai";

export type Street = "preflop" | "flop" | "turn" | "river" | "showdown" | "ended";

export interface Player {
  id: string;
  name: string;
  stack: number;
  hole: Card[];
  folded: boolean;
  allIn: boolean;
  currentBet: number;   // aposta na rodada atual
  totalBet: number;     // aposta total nesta mão
  hasActed: boolean;
  isBot: boolean;
  personality?: AiPersonality;
  lastAction?: string;  // "CALL", "RAISE 100", ...
  seat: number;
}

export interface LogEntry {
  id: string;
  text: string;
  kind: "info" | "action" | "impact";
}

export interface Winner {
  playerId: string;
  amount: number;
  handName?: string;
  cards?: Card[];
}

export interface GameState {
  players: Player[];
  deck: Card[];
  community: Card[];
  pot: number;
  currentBet: number;
  minRaise: number;
  smallBlind: number;
  bigBlind: number;
  dealerIdx: number;
  actionIdx: number;
  street: Street;
  log: LogEntry[];
  handNumber: number;
  winners: Winner[];
  lastImpact?: { text: string; ts: number };
  awaitingAdvance: boolean;
}

let idCounter = 0;
const nextId = () => `l${++idCounter}_${Date.now().toString(36)}`;

function log(state: GameState, text: string, kind: LogEntry["kind"] = "info") {
  state.log = [...state.log, { id: nextId(), text, kind }].slice(-40);
}
function impact(state: GameState, text: string) {
  state.lastImpact = { text, ts: Date.now() };
  log(state, text, "impact");
}

export function createInitialState(opts: {
  players: Array<{ id: string; name: string; isBot: boolean; personality?: AiPersonality; startStack: number }>;
  smallBlind: number;
  bigBlind: number;
}): GameState {
  const players: Player[] = opts.players.map((p, i) => ({
    id: p.id, name: p.name, stack: p.startStack, hole: [],
    folded: false, allIn: false, currentBet: 0, totalBet: 0, hasActed: false,
    isBot: p.isBot, personality: p.personality, seat: i,
  }));
  return {
    players, deck: [], community: [], pot: 0, currentBet: 0,
    minRaise: opts.bigBlind, smallBlind: opts.smallBlind, bigBlind: opts.bigBlind,
    dealerIdx: 0, actionIdx: 0, street: "ended", log: [], handNumber: 0,
    winners: [], awaitingAdvance: false,
  };
}

/** Inicia nova mão. */
export function startHand(state: GameState): GameState {
  const s = clone(state);
  s.handNumber += 1;
  s.deck = shuffle(newDeck());
  s.community = [];
  s.pot = 0;
  s.currentBet = 0;
  s.minRaise = s.bigBlind;
  s.winners = [];
  s.awaitingAdvance = false;
  s.lastImpact = undefined;

  // Reset players
  const activePlayers = s.players.filter((p) => p.stack > 0);
  if (activePlayers.length < 2) { s.street = "ended"; log(s, "Fim de jogo!"); return s; }

  for (const p of s.players) {
    p.hole = []; p.folded = p.stack <= 0;
    p.allIn = false; p.currentBet = 0; p.totalBet = 0; p.hasActed = false; p.lastAction = undefined;
  }

  // Move dealer
  if (s.handNumber > 1) {
    s.dealerIdx = nextActiveSeat(s, s.dealerIdx);
  } else {
    s.dealerIdx = s.players.findIndex((p) => !p.folded);
  }

  // Blinds — heads-up: dealer = SB, other = BB
  const activeSeats = s.players.map((p, i) => (!p.folded ? i : -1)).filter((i) => i >= 0);
  let sbIdx: number, bbIdx: number;
  if (activeSeats.length === 2) {
    sbIdx = s.dealerIdx;
    bbIdx = activeSeats.find((i) => i !== s.dealerIdx)!;
  } else {
    sbIdx = nextActiveSeat(s, s.dealerIdx);
    bbIdx = nextActiveSeat(s, sbIdx);
  }
  postBlind(s, sbIdx, s.smallBlind, "SB");
  postBlind(s, bbIdx, s.bigBlind, "BB");
  s.currentBet = s.bigBlind;
  s.minRaise = s.bigBlind;

  // Deal 2 hole cards em ordem
  for (let round = 0; round < 2; round++) {
    let idx = nextActiveSeat(s, s.dealerIdx);
    for (let k = 0; k < activeSeats.length; k++) {
      s.players[idx].hole.push(s.deck.pop()!);
      idx = nextActiveSeat(s, idx);
    }
  }

  // Ação começa: heads-up preflop = dealer (SB), 3+ preflop = após BB
  s.actionIdx = activeSeats.length === 2 ? sbIdx : nextActiveSeat(s, bbIdx);
  s.street = "preflop";
  log(s, `— Mão #${s.handNumber} —`);
  return s;
}

function postBlind(s: GameState, idx: number, amount: number, label: "SB" | "BB") {
  const p = s.players[idx];
  const pay = Math.min(amount, p.stack);
  p.stack -= pay; p.currentBet += pay; p.totalBet += pay; s.pot += pay;
  if (p.stack === 0) p.allIn = true;
  log(s, `${p.name} paga ${label} ${pay}`, "action");
}

function nextActiveSeat(s: GameState, from: number): number {
  const n = s.players.length;
  for (let step = 1; step <= n; step++) {
    const idx = (from + step) % n;
    const p = s.players[idx];
    if (!p.folded && !p.allIn) return idx;
  }
  return from;
}

function anyoneCanAct(s: GameState): boolean {
  return s.players.some((p) => !p.folded && !p.allIn && (!p.hasActed || p.currentBet < s.currentBet));
}

function roundIsSettled(s: GameState): boolean {
  const active = s.players.filter((p) => !p.folded);
  if (active.length <= 1) return true;
  return active.every((p) => p.allIn || (p.hasActed && p.currentBet === s.currentBet));
}

function clone(s: GameState): GameState {
  return {
    ...s,
    players: s.players.map((p) => ({ ...p, hole: [...p.hole] })),
    deck: [...s.deck],
    community: [...s.community],
    log: [...s.log],
    winners: [...s.winners],
    lastImpact: s.lastImpact ? { ...s.lastImpact } : undefined,
  };
}

// ---- Actions ----
export function playerAction(state: GameState, playerId: string, action:
  | { type: "fold" } | { type: "check" } | { type: "call" }
  | { type: "raise"; amount: number } | { type: "allin" }
): GameState {
  const s = clone(state);
  const idx = s.players.findIndex((p) => p.id === playerId);
  if (idx !== s.actionIdx) return s;
  const p = s.players[idx];
  if (p.folded || p.allIn) return s;

  const toCall = s.currentBet - p.currentBet;

  switch (action.type) {
    case "fold": {
      p.folded = true; p.hasActed = true; p.lastAction = "FOLD";
      impact(s, `${p.name.toUpperCase()} SAIU!`);
      break;
    }
    case "check": {
      if (toCall > 0) return state; // inválido
      p.hasActed = true; p.lastAction = "CHECK";
      log(s, `${p.name} deu check`, "action");
      break;
    }
    case "call": {
      const pay = Math.min(toCall, p.stack);
      p.stack -= pay; p.currentBet += pay; p.totalBet += pay; s.pot += pay;
      if (p.stack === 0) p.allIn = true;
      p.hasActed = true; p.lastAction = `PAGOU ${pay}`;
      log(s, `${p.name} pagou ${pay}`, "action");
      break;
    }
    case "raise": {
      const targetTotal = action.amount; // total de currentBet após raise
      const raiseBy = targetTotal - s.currentBet;
      if (raiseBy < s.minRaise) return state;
      const pay = targetTotal - p.currentBet;
      if (pay > p.stack) return state;
      p.stack -= pay; p.currentBet = targetTotal; p.totalBet += pay; s.pot += pay;
      if (p.stack === 0) p.allIn = true;
      s.currentBet = targetTotal;
      s.minRaise = raiseBy;
      p.hasActed = true; p.lastAction = `RAISE ${targetTotal}`;
      // Reset hasActed dos outros ativos
      s.players.forEach((op) => { if (op.id !== p.id && !op.folded && !op.allIn) op.hasActed = false; });
      impact(s, `RAISE! ${targetTotal}`);
      break;
    }
    case "allin": {
      const pay = p.stack;
      const newTotal = p.currentBet + pay;
      p.stack = 0; p.currentBet = newTotal; p.totalBet += pay; s.pot += pay;
      p.allIn = true; p.hasActed = true; p.lastAction = "ALL-IN!";
      if (newTotal > s.currentBet) {
        const raiseBy = newTotal - s.currentBet;
        s.currentBet = newTotal;
        if (raiseBy >= s.minRaise) s.minRaise = raiseBy;
        s.players.forEach((op) => { if (op.id !== p.id && !op.folded && !op.allIn) op.hasActed = false; });
      }
      impact(s, `${p.name.toUpperCase()} ALL-IN!`);
      break;
    }
  }

  return advanceIfNeeded(s);
}

function advanceIfNeeded(s: GameState): GameState {
  // Se só sobrou 1 → vence
  const active = s.players.filter((p) => !p.folded);
  if (active.length === 1) return finishHand(s);

  if (roundIsSettled(s)) return advanceStreet(s);

  // Se ninguém pode agir (todos all-in) → roda até showdown
  if (!anyoneCanAct(s)) return advanceStreet(s);

  // Próximo jogador
  s.actionIdx = nextActiveSeat(s, s.actionIdx);
  return s;
}

function advanceStreet(s: GameState): GameState {
  // Reset per-round
  s.players.forEach((p) => { p.currentBet = 0; p.hasActed = false; });
  s.currentBet = 0;
  s.minRaise = s.bigBlind;

  if (s.street === "preflop") {
    s.deck.pop(); // burn
    s.community.push(s.deck.pop()!, s.deck.pop()!, s.deck.pop()!);
    s.street = "flop"; impact(s, "FLOP!");
  } else if (s.street === "flop") {
    s.deck.pop(); s.community.push(s.deck.pop()!);
    s.street = "turn"; impact(s, "TURN!");
  } else if (s.street === "turn") {
    s.deck.pop(); s.community.push(s.deck.pop()!);
    s.street = "river"; impact(s, "RIVER!");
  } else if (s.street === "river") {
    return finishHand(s);
  }

  // Se todos all-in / apenas 1 ativo — continua deal automático
  if (!anyoneCanAct(s)) {
    if (s.street !== "river") return advanceStreet(s);
    return finishHand(s);
  }

  // Postflop: primeiro ativo à esquerda do dealer
  s.actionIdx = nextActiveSeat(s, s.dealerIdx);
  return s;
}

function finishHand(s: GameState): GameState {
  s.street = "showdown";
  const inHand = s.players.filter((p) => !p.folded);
  if (inHand.length === 1) {
    const winner = inHand[0];
    winner.stack += s.pot;
    s.winners = [{ playerId: winner.id, amount: s.pot }];
    impact(s, `${winner.name.toUpperCase()} LEVA ${s.pot}!`);
    s.pot = 0;
    s.awaitingAdvance = true;
    return s;
  }

  // Side pots baseados em totalBet
  const contenders = [...inHand].sort((a, b) => a.totalBet - b.totalBet);
  const allInHand = s.players.filter((p) => p.totalBet > 0);
  const winners: Winner[] = [];
  let remaining = s.pot;
  const processed: Set<string> = new Set();
  let prevCap = 0;
  for (const c of contenders) {
    const cap = c.totalBet;
    if (cap === prevCap) { processed.add(c.id); continue; }
    // pot = sum de min(cap - prevCap, p.totalBet - prevCap) para todos que apostaram >= prevCap
    let potSize = 0;
    for (const p of allInHand) {
      if (p.totalBet <= prevCap) continue;
      const contrib = Math.min(p.totalBet, cap) - prevCap;
      potSize += contrib;
    }
    // Elegíveis: inHand com totalBet >= cap
    const eligible = inHand.filter((p) => p.totalBet >= cap);
    // Melhor mão
    let best: { score: number; ids: string[]; handName: string; cards: Card[] } | null = null;
    for (const p of eligible) {
      const ev = evaluateBest([...p.hole, ...s.community]);
      if (!best || ev.score > best.score) best = { score: ev.score, ids: [p.id], handName: ev.name, cards: ev.best };
      else if (ev.score === best.score) best.ids.push(p.id);
    }
    if (best) {
      const share = Math.floor(potSize / best.ids.length);
      for (const id of best.ids) {
        const p = s.players.find((x) => x.id === id)!;
        p.stack += share;
        winners.push({ playerId: id, amount: share, handName: best.handName, cards: best.cards });
      }
      remaining -= share * best.ids.length;
    }
    prevCap = cap;
    processed.add(c.id);
  }
  // resíduo → primeiro elegível
  if (remaining > 0 && winners[0]) {
    const p = s.players.find((x) => x.id === winners[0].playerId)!;
    p.stack += remaining;
    winners[0].amount += remaining;
  }
  s.winners = winners;
  s.pot = 0;

  // Impact message
  const w = winners[0];
  if (w) {
    const player = s.players.find((p) => p.id === w.playerId)!;
    impact(s, `${player.name.toUpperCase()} — ${w.handName?.toUpperCase()}!`);
  }
  s.awaitingAdvance = true;
  return s;
}

/** Chama após showdown pra ir para próxima mão. */
export function nextHand(state: GameState): GameState {
  return startHand(state);
}

export { HandRank, HAND_NAME };
