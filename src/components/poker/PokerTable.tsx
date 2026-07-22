import { useEffect } from "react";
import { usePokerStore } from "@/lib/poker/store";
import { PlayingCard } from "./PlayingCard";
import { PlayerSeat } from "./PlayerSeat";
import { ActionPanel } from "./ActionPanel";
import { ImpactText } from "@/components/comic/ImpactText";
import { ComicButton } from "@/components/comic/ComicButton";
import { LandscapeHint } from "@/components/comic/LandscapeHint";
import { Link } from "@tanstack/react-router";
import type { Difficulty } from "@/lib/poker/ai";
import type { VariantId } from "@/lib/poker/variants";
import { getVariant } from "@/lib/poker/variants";
import { sfx } from "@/lib/audio/sfx";

interface Props {
  difficulty: Difficulty;
  modeLabel: string;
  variant?: VariantId;
  smallBlind?: number;
  bigBlind?: number;
  startStack?: number;
}

export function PokerTable({ difficulty, modeLabel, variant = "holdem", smallBlind = 10, bigBlind = 20, startStack = 1000 }: Props) {
  const state = usePokerStore((s) => s.state);
  const taunt = usePokerStore((s) => s.taunt);
  const botThinking = usePokerStore((s) => s.botThinking);
  const startGame = usePokerStore((s) => s.startGame);
  const humanAction = usePokerStore((s) => s.humanAction);
  const advanceHand = usePokerStore((s) => s.advanceHand);

  useEffect(() => {
    sfx.unlock();
    startGame({ difficulty, variant, smallBlind, bigBlind, startStack });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, variant, smallBlind, bigBlind, startStack]);

  if (!state) return null;

  const v = getVariant(state.variant);
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

      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 ink-border-thick bg-card">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="font-display text-xl text-pow-red hover:text-ink shrink-0" onClick={() => sfx.play("click")}>← MENU</Link>
          <span className="truncate font-display text-lg">{modeLabel}</span>
          <span className="hidden md:inline ink-border bg-pow-yellow px-2 py-0.5 text-xs font-display">{v.short}</span>
        </div>
        <div className="font-body text-sm font-bold">Mão #{state.handNumber}</div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-between px-2 py-2 md:px-4 md:py-3 relative gap-2"
           style={{ background: "radial-gradient(ellipse at center, var(--color-felt) 0%, var(--color-felt-dark) 100%)" }}>

        <div className="md:hidden w-full max-w-md">
          <LandscapeHint />
        </div>

        <div className="mt-1">
          <PlayerSeat
            player={bot}
            isActive={state.actionIdx === botIdx && !state.awaitingAdvance}
            isDealer={state.dealerIdx === botIdx}
            reveal={state.street === "showdown"}
            taunt={taunt?.playerId === bot.id ? taunt.text : undefined}
            isWinner={winnerIds.has(bot.id)}
            holeCount={v.holeCards}
          />
        </div>

        <div className="flex flex-col items-center gap-2 my-1">
          <div className="ink-border-thick hard-shadow bg-paper/90 rounded-full px-5 py-1.5">
            <div className="font-display text-xl md:text-3xl text-pow-red text-center leading-tight">
              POT: {state.pot.toLocaleString("pt-BR")}
            </div>
          </div>
          <div className="flex gap-1.5 md:gap-2 items-center justify-center flex-wrap max-w-full">
            {[0, 1, 2, 3, 4].map((i) => {
              const c = state.community[i];
              if (!c) return <div key={i} className="w-20 h-28 md:w-24 md:h-36 rounded-md border-2 border-dashed border-white/30" />;
              return <PlayingCard key={i} card={c} size="lg" dealDelay={i * 80} />;
            })}
          </div>
          {botThinking && (
            <div className="font-display text-white text-lg animate-pulse">🤔 pensando...</div>
          )}
        </div>

        <div className="mb-1">
          <PlayerSeat
            player={human}
            isActive={state.actionIdx === humanIdx && !state.awaitingAdvance}
            isDealer={state.dealerIdx === humanIdx}
            reveal={state.street === "showdown"}
            isWinner={winnerIds.has(human.id)}
            holeCount={v.holeCards}
            isMe
          />
        </div>
      </div>

      <div className="p-3 md:p-4">
        {gameOver ? (
          <div className="ink-border-thick hard-shadow bg-card rounded-lg p-6 text-center">
            <h2 className="font-display text-3xl mb-3">
              {human.stack > 0 ? "🏆 VOCÊ VENCEU!" : "💀 GAME OVER!"}
            </h2>
            <div className="flex gap-3 justify-center">
              <ComicButton variant="primary" onClick={() => startGame({ difficulty, variant, smallBlind, bigBlind, startStack })}>
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
