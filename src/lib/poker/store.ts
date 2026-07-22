import { create } from "zustand";
import type { GameState } from "./engine";
import { createInitialState, startHand, playerAction, nextHand } from "./engine";
import { decideAction, personalityForDifficulty, type Difficulty } from "./ai";

interface PokerStore {
  state: GameState | null;
  botThinking: boolean;
  taunt: { playerId: string; text: string; ts: number } | null;
  startGame: (opts: { difficulty: Difficulty; startStack?: number; smallBlind?: number; bigBlind?: number; playerName?: string }) => void;
  humanAction: (action: Parameters<typeof playerAction>[2]) => void;
  advanceHand: () => void;
  runBotIfNeeded: () => void;
}

export const usePokerStore = create<PokerStore>((set, get) => ({
  state: null,
  botThinking: false,
  taunt: null,

  startGame: ({ difficulty, startStack = 1000, smallBlind = 10, bigBlind = 20, playerName = "Você" }) => {
    const personality = personalityForDifficulty(difficulty);
    let s = createInitialState({
      players: [
        { id: "human", name: playerName, isBot: false, startStack },
        { id: "bot1", name: personality.name, isBot: true, personality, startStack },
      ],
      smallBlind, bigBlind,
    });
    s = startHand(s);
    set({ state: s, taunt: null });
    setTimeout(() => get().runBotIfNeeded(), 500);
  },

  humanAction: (action) => {
    const s = get().state;
    if (!s || s.awaitingAdvance) return;
    const cur = s.players[s.actionIdx];
    if (cur.isBot) return;
    const next = playerAction(s, cur.id, action);
    set({ state: next });
    setTimeout(() => get().runBotIfNeeded(), 400);
  },

  advanceHand: () => {
    const s = get().state;
    if (!s || !s.awaitingAdvance) return;
    const alive = s.players.filter((p) => p.stack > 0);
    if (alive.length < 2) return; // fim de jogo
    const next = nextHand(s);
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
      });
      const next = playerAction(cs, p.id, decision);
      // taunt
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
