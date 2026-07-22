import { useEffect } from "react";
import { usePokerStore } from "@/lib/poker/store";
import { PlayingCard } from "./PlayingCard";
import { PlayerSeat } from "./PlayerSeat";
import { ActionPanel } from "./ActionPanel";
import { ImpactText } from "@/components/comic/ImpactText";
import { ComicButton } from "@/components/comic/ComicButton";
import { Link } from "@tanstack/react-router";
import type { Difficulty } from "@/lib/poker/ai";

interface Props {
  difficulty: Difficulty;
  modeLabel: string;
  smallBlind?: number;
  bigBlind?: number;
  startStack?: number;
}

export function PokerTable({ difficulty, modeLabel, smallBlind = 10, bigBlind = 20, startStack = 1000 }: Props) {
  const state = usePokerStore((s) => s.state);
  const taunt = usePokerStore((s) => s.taunt);
  const botThinking = usePokerStore((s) => s.botThinking);
  const startGame = usePokerStore((s) => s.startGame);
  const humanAction = usePokerStore((s) => s.humanAction);
  const advanceHand = usePokerStore((s) => s.advanceHand);

  useEffect(() => {
    startGame({ difficulty, smallBlind, bigBlind, startStack });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, smallBlind, bigBlind, startStack]);

  if (!state) return null;

  const human = state.players.find((p) => p.id === "human")!;
  const bot = state.players.find((p) => p.id !== "human")!;
  const humanIdx = state.players.findIndex((p) => p.id === "human");
  const botIdx = state.players.findIndex((p) => p.id === bot.id);
  const isHumanTurn = state.actionIdx === humanIdx && !state.awaitingAdvance && !human.folded && !human.allIn;
  const winnerIds = new Set(state.winners.map((w) => w.playerId));
  const gameOver = state.players.filter((p) => p.stack > 0).length < 2 && state.awaitingAdvance;

  return (
    <div className="relative min-h-screen flex flex-col">
      <ImpactText text={state.lastImpact?.text} ts={state.lastImpact?.ts} />

      {/* Header */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 ink-border-thick bg-card">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="font-display text-xl text-pow-red hover:text-ink shrink-0">← MENU</Link>
          <span className="truncate font-display text-lg">{modeLabel}</span>
        </div>
        <div className="font-body text-sm font-bold">Mão #{state.handNumber}</div>
      </header>

      {/* Mesa */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 relative"
           style={{ background: "radial-gradient(ellipse at center, var(--color-felt) 0%, var(--color-felt-dark) 100%)" }}>

        {/* Oponente (topo) */}
        <div className="mt-4">
          <PlayerSeat
            player={bot}
            isActive={state.actionIdx === botIdx && !state.awaitingAdvance}
            isDealer={state.dealerIdx === botIdx}
            reveal={state.street === "showdown"}
            taunt={taunt?.playerId === bot.id ? taunt.text : undefined}
            isWinner={winnerIds.has(bot.id)}
          />
        </div>

        {/* Community */}
        <div className="flex flex-col items-center gap-3 my-6">
          <div className="ink-border-thick hard-shadow bg-paper/90 rounded-full px-6 py-2">
            <div className="font-display text-2xl md:text-3xl text-pow-red text-center">
              POT: {state.pot.toLocaleString("pt-BR")}
            </div>
          </div>
          <div className="flex gap-2 min-h-[112px] items-center">
            {[0, 1, 2, 3, 4].map((i) => {
              const c = state.community[i];
              if (!c) return <div key={i} className="w-14 h-20 md:w-20 md:h-28 rounded-md border-2 border-dashed border-white/30" />;
              return <PlayingCard key={i} card={c} size="lg" dealDelay={i * 80} />;
            })}
          </div>
          {botThinking && (
            <div className="font-display text-white text-lg animate-pulse">🤔 pensando...</div>
          )}
        </div>

        {/* Humano (base) */}
        <div className="mb-4">
          <PlayerSeat
            player={human}
            isActive={state.actionIdx === humanIdx && !state.awaitingAdvance}
            isDealer={state.dealerIdx === humanIdx}
            reveal={state.street === "showdown"}
            isWinner={winnerIds.has(human.id)}
          />
        </div>
      </div>

      {/* Painel de ação */}
      <div className="p-3 md:p-4">
        {gameOver ? (
          <div className="ink-border-thick hard-shadow bg-card rounded-lg p-6 text-center">
            <h2 className="font-display text-3xl mb-3">
              {human.stack > 0 ? "🏆 VOCÊ VENCEU!" : "💀 GAME OVER!"}
            </h2>
            <div className="flex gap-3 justify-center">
              <ComicButton variant="primary" onClick={() => startGame({ difficulty, smallBlind, bigBlind, startStack })}>
                JOGAR DE NOVO
              </ComicButton>
              <Link to="/"><ComicButton variant="secondary">MENU</ComicButton></Link>
            </div>
          </div>
        ) : state.awaitingAdvance ? (
          <div className="ink-border-thick hard-shadow bg-card rounded-lg p-4 flex flex-col items-center gap-2">
            {state.winners.map((w, i) => {
              const p = state.players.find((pl) => pl.id === w.playerId)!;
              return (
                <div key={i} className="font-display text-xl">
                  {p.name} ganhou <span className="text-pow-red">{w.amount}</span>
                  {w.handName && <span className="text-muted-foreground text-base"> — {w.handName}</span>}
                </div>
              );
            })}
            <ComicButton variant="primary" onClick={advanceHand} className="mt-2">PRÓXIMA MÃO</ComicButton>
          </div>
        ) : (
          <ActionPanel state={state} onAction={humanAction} disabled={!isHumanTurn} />
        )}
      </div>
    </div>
  );
}
