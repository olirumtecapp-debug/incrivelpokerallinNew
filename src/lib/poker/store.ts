import { create } from "zustand";
import type { GameState, PokerAction } from "./engine";
import { createInitialState, startHand, playerAction, nextHand } from "./engine";
import { decideAction, personalityForDifficulty, type Difficulty } from "./ai";
import type { VariantId } from "./variants";
import { sfx } from "@/lib/audio/sfx";

interface StartOpts {
  difficulty: Difficulty;
  variant?: VariantId;
  startStack?: number;
  smallBlind?: number;
  bigBlind?: number;
  playerName?: string;
}

interface PokerStore {
  state: GameState | null;
  botThinking: boolean;
  taunt: { playerId: string; text: string; ts: number } | null;
  lastImpactTs: number;
  startGame: (opts: StartOpts) => void;
  humanAction: (action: PokerAction) => void;
  advanceHand: () => void;
  runBotIfNeeded: () => void;
}

// Toca SFX baseado no impact ou última ação
function triggerSfxForState(prev: GameState | null, next: GameState) {
  if (prev && next.lastImpact && (!prev.lastImpact || prev.lastImpact.ts !== next.lastImpact.ts)) {
    const text = next.lastImpact.text;
    if (text.startsWith("FLOP") || text.startsWith("TURN") || text.startsWith("RIVER")) sfx.play("cardFlip");
    else if (text.includes("ALL-IN")) sfx.play("allInWhoosh");
    else if (text.startsWith("RAISE")) sfx.play("chipDrop");
    else if (text.includes("SAIU")) sfx.play("fold");
    else if (text.includes("LEVA") || (next.winners.length > 0 && text.includes("—"))) sfx.play("potWin");
  } else if (prev) {
    // Ações "quietas": call/check
    const anyChanged = next.players.some((p, i) => {
      const pp = prev.players[i];
      return pp && p.lastAction && p.lastAction !== pp.lastAction;
    });
    if (anyChanged) {
      const changed = next.players.find((p, i) => p.lastAction && p.lastAction !== prev.players[i]?.lastAction);
      if (changed?.lastAction?.startsWith("PAGOU")) sfx.play("chipDrop");
      else if (changed?.lastAction === "CHECK") sfx.play("click");
    }
  }
  if (!prev || (prev.handNumber !== next.handNumber && next.community.length === 0)) {
    // deal inicial
    sfx.play("cardDeal");
  }
}

export const usePokerStore = create<PokerStore>((set, get) => ({
  state: null,
  botThinking: false,
  taunt: null,
  lastImpactTs: 0,

  startGame: ({ difficulty, variant = "holdem", startStack = 1000, smallBlind = 10, bigBlind = 20, playerName = "Você" }) => {
    const personality = personalityForDifficulty(difficulty);
    let s = createInitialState({
      players: [
        { id: "human", name: playerName, isBot: false, startStack },
        { id: "bot1", name: personality.name, isBot: true, personality, startStack },
      ],
      smallBlind, bigBlind, variant,
    });
    s = startHand(s);
    triggerSfxForState(null, s);
    set({ state: s, taunt: null });
    setTimeout(() => get().runBotIfNeeded(), 500);
  },

  humanAction: (action) => {
    const s = get().state;
    if (!s || s.awaitingAdvance) return;
    const cur = s.players[s.actionIdx];
    if (cur.isBot) return;
    const next = playerAction(s, cur.id, action);
    triggerSfxForState(s, next);
    set({ state: next });
    setTimeout(() => get().runBotIfNeeded(), 400);
  },

  advanceHand: () => {
    const s = get().state;
    if (!s || !s.awaitingAdvance) return;
    const alive = s.players.filter((p) => p.stack > 0);
    if (alive.length < 2) return;
    const next = nextHand(s);
    triggerSfxForState(s, next);
    set({ state: next, taunt: null });
    setTimeout(() => get().runBotIfNeeded(), 500);
  },

  runBotIfNeeded: () => {
    const s = get().state;
    if (!s || s.awaitingAdvance) return;
    const cur = s.players[s.actionIdx];
    if (!cur.isBot || cur.folded || cur.allIn) return;
    set({ botThinking: true });
    const delay = 700 + Math.random() * 900;
    setTimeout(() => {
      const cs = get().state;
      if (!cs) { set({ botThinking: false }); return; }
      const p = cs.players[cs.actionIdx];
      if (!p.isBot) { set({ botThinking: false }); return; }
      const toCall = cs.currentBet - p.currentBet;
      const decision = decideAction({
        hole: p.hole, community: cs.community, stack: p.stack,
        currentBet: cs.currentBet, myCurrentBet: p.currentBet, pot: cs.pot,
        minRaise: cs.minRaise, bigBlind: cs.bigBlind,
        canCheck: toCall === 0, difficulty: p.personality?.difficulty ?? "easy",
        variant: cs.variant,
      });
      const next = playerAction(cs, p.id, decision);
      triggerSfxForState(cs, next);
      const taunts = p.personality?.taunts;
      let tauntText: string | null = null;
      if (taunts) {
        if (decision.type === "fold") tauntText = pick(taunts.fold);
        else if (decision.type === "allin") tauntText = pick(taunts.allIn);
        else if (Math.random() < 0.3) tauntText = pick(taunts.win);
      }
      set({
        state: next, botThinking: false,
        taunt: tauntText ? { playerId: p.id, text: tauntText, ts: Date.now() } : null,
      });
      setTimeout(() => get().runBotIfNeeded(), 400);
    }, delay);
  },
}));

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
