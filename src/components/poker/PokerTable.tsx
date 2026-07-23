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
    <div className="relative min-h-[100dvh] landscape-short:h-[100dvh] landscape-short:overflow-hidden overflow-y-auto flex flex-col">
      <LandscapeHint blocking />
      <ImpactText text={state.lastImpact?.text} ts={state.lastImpact?.ts} />

      <header className="shrink-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-1.5 md:py-2 landscape-short:py-0.5 landscape-short:px-2 ink-border-thick bg-card">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" className="font-display text-base md:text-lg landscape-short:text-xs text-pow-red hover:text-ink shrink-0" onClick={() => sfx.play("click")}>← MENU</Link>
          <span className="truncate font-display text-sm md:text-base landscape-short:text-xs">{modeLabel}</span>
          <span className="hidden md:inline landscape-short:!hidden ink-border bg-pow-yellow px-2 py-0.5 text-xs font-display">{v.short}</span>
        </div>
        <div className="font-body text-xs md:text-sm landscape-short:text-[10px] font-bold">Mão #{state.handNumber}</div>
      </header>

      <div className="flex-1 min-h-0 relative grid grid-rows-[auto_1fr_auto] items-center justify-items-center gap-1 md:gap-2 landscape-short:gap-0 px-2 py-1 md:px-4 md:py-2 landscape-short:px-1 landscape-short:py-0"
           style={{ background: "radial-gradient(ellipse at center, var(--color-felt) 0%, var(--color-felt-dark) 100%)" }}>

        <div className="pt-1 landscape-short:pt-0">
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

        <div className="flex flex-col items-center gap-1 md:gap-2 landscape-short:gap-0.5 w-full max-w-4xl relative">
          <div className="ink-border-thick hard-shadow bg-paper/90 rounded-full px-3 py-0.5 md:px-5 md:py-1.5 landscape-short:px-2 landscape-short:py-0">
            <div className="font-display text-base md:text-2xl landscape-short:text-xs text-pow-red text-center leading-tight">
              POT: {state.pot.toLocaleString("pt-BR")}
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="flex gap-1 md:gap-2 landscape-short:gap-0.5 items-center justify-center flex-nowrap min-w-max mx-auto px-1">
              {[0, 1, 2, 3, 4].map((i) => {
                const c = state.community[i];
                if (!c) return <div key={i} className="shrink-0 w-10 h-14 sm:w-14 sm:h-20 md:w-16 md:h-24 lg:w-20 lg:h-28 landscape-short:w-8 landscape-short:h-11 rounded-md border-2 border-dashed border-white/30" />;
                return <PlayingCard key={i} card={c} size="md" dealDelay={i * 80} />;
              })}
            </div>
          </div>
          {botThinking && (
            <div className="absolute -top-1 right-2 ink-border bg-white/90 text-ink font-display text-xs px-2 py-0.5 rounded animate-pulse">🤔</div>
          )}
        </div>

        <div className="pb-1 landscape-short:pb-0 min-h-[140px] md:min-h-[170px] landscape-short:min-h-0 flex items-end">
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


      <div className="shrink-0 relative z-10 bg-background p-2 md:p-3 short:py-1.5 landscape-short:p-1">

        {gameOver ? (
          <div className="ink-border-thick hard-shadow bg-card rounded-lg p-4 md:p-6 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl mb-3">
              {human.stack > 0 ? "🏆 VOCÊ VENCEU!" : "💀 GAME OVER!"}
            </h2>
            <div className="flex gap-3 justify-center">
              <ComicButton variant="primary" size="sm" onClick={() => startGame({ difficulty, variant, smallBlind, bigBlind, startStack })}>
                JOGAR DE NOVO
              </ComicButton>
              <Link to="/"><ComicButton variant="secondary" size="sm">MENU</ComicButton></Link>
            </div>
          </div>
        ) : state.awaitingAdvance ? (
          <div className="ink-border-thick hard-shadow bg-card rounded-lg p-2 md:p-3 flex flex-col items-center gap-1 max-w-3xl mx-auto">
            {state.winners.map((w, i) => {
              const p = state.players.find((pl) => pl.id === w.playerId)!;
              return (
                <div key={i} className="font-display text-base md:text-xl text-center">
                  {p.name} ganhou <span className="text-pow-red">{w.amount}</span>
                  {w.handName && <span className="text-muted-foreground text-xs md:text-base"> — {w.handName}</span>}
                </div>
              );
            })}
            <ComicButton variant="primary" size="sm" onClick={advanceHand} className="mt-1">PRÓXIMA MÃO</ComicButton>
          </div>
        ) : (
          <ActionPanel state={state} onAction={humanAction} disabled={!isHumanTurn} />
        )}
      </div>
    </div>
  );
}
