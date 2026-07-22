import { useState } from "react";
import type { GameState } from "@/lib/poker/engine";
import { ComicButton } from "@/components/comic/ComicButton";
import { Slider } from "@/components/ui/slider";

interface Props {
  state: GameState;
  onAction: (action:
    | { type: "fold" } | { type: "check" } | { type: "call" }
    | { type: "raise"; amount: number } | { type: "allin" }
  ) => void;
  disabled?: boolean;
}

export function ActionPanel({ state, onAction, disabled }: Props) {
  const human = state.players.find((p) => p.id === "human");
  if (!human) return null;

  const toCall = state.currentBet - human.currentBet;
  const canCheck = toCall === 0;
  const canCall = toCall > 0 && human.stack > 0;
  const callAmt = Math.min(toCall, human.stack);
  const minRaiseTotal = state.currentBet + state.minRaise;
  const maxTotal = human.currentBet + human.stack;
  const raiseAvailable = human.stack > toCall && maxTotal >= minRaiseTotal;

  const [raise, setRaise] = useState(minRaiseTotal);
  const [openRaise, setOpenRaise] = useState(false);
  const clamped = Math.max(minRaiseTotal, Math.min(maxTotal, raise));

  return (
    <div className="ink-border-thick hard-shadow bg-card rounded-lg p-2 md:p-3 flex flex-col gap-2 max-w-3xl mx-auto w-full">
      <div className="flex justify-between text-xs font-body font-bold">
        <span>POT: <span className="text-pow-red">{state.pot.toLocaleString("pt-BR")}</span></span>
        <span>P/ PAGAR: <span className="text-pow-red">{toCall.toLocaleString("pt-BR")}</span></span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 md:gap-2">
        <ComicButton variant="danger" size="sm" onClick={() => onAction({ type: "fold" })} disabled={disabled}>
          FOLD
        </ComicButton>
        {canCheck ? (
          <ComicButton variant="secondary" size="sm" onClick={() => onAction({ type: "check" })} disabled={disabled}>
            CHECK
          </ComicButton>
        ) : (
          <ComicButton variant="secondary" size="sm" onClick={() => onAction({ type: "call" })} disabled={disabled || !canCall}>
            CALL {callAmt > 0 ? callAmt : ""}
          </ComicButton>
        )}
        <ComicButton variant="primary" size="sm" onClick={() => onAction({ type: "raise", amount: clamped })} disabled={disabled || !raiseAvailable}>
          RAISE
        </ComicButton>
        <ComicButton variant="allin" size="sm" onClick={() => onAction({ type: "allin" })} disabled={disabled || human.stack === 0}>
          ALL-IN!
        </ComicButton>
      </div>

      {raiseAvailable && (
        <>
          {/* Mobile: collapsible */}
          <details
            className="md:hidden"
            open={openRaise}
            onToggle={(e) => setOpenRaise((e.target as HTMLDetailsElement).open)}
          >
            <summary className="text-xs font-display cursor-pointer select-none flex justify-between items-center">
              <span>Ajustar aposta</span>
              <span className="text-pow-red">{clamped.toLocaleString("pt-BR")}</span>
            </summary>
            <div className="mt-2">
              <Slider
                min={minRaiseTotal} max={maxTotal} step={state.bigBlind}
                value={[clamped]}
                onValueChange={(v) => setRaise(v[0])}
                disabled={disabled}
              />
              <div className="flex gap-1 mt-2 flex-wrap">
                {[0.5, 0.75, 1, 1.5].map((mult) => {
                  const val = Math.min(maxTotal, Math.max(minRaiseTotal, human.currentBet + Math.floor(state.pot * mult)));
                  return (
                    <button key={mult}
                      className="ink-border bg-muted px-2 py-0.5 text-xs font-bold hover:bg-pow-yellow"
                      onClick={() => setRaise(val)} disabled={disabled}>
                      {mult === 1 ? "POT" : `${mult}x`}
                    </button>
                  );
                })}
                <button className="ink-border bg-muted px-2 py-0.5 text-xs font-bold hover:bg-pow-yellow"
                  onClick={() => setRaise(maxTotal)} disabled={disabled}>MAX</button>
              </div>
            </div>
          </details>

          {/* Desktop: always open */}
          <div className="hidden md:block">
            <div className="flex justify-between text-xs font-body font-bold mb-1">
              <span>Aumentar para:</span>
              <span className="text-pow-red">{clamped.toLocaleString("pt-BR")}</span>
            </div>
            <Slider
              min={minRaiseTotal} max={maxTotal} step={state.bigBlind}
              value={[clamped]}
              onValueChange={(v) => setRaise(v[0])}
              disabled={disabled}
            />
            <div className="flex gap-1 mt-2 flex-wrap">
              {[0.5, 0.75, 1, 1.5].map((mult) => {
                const val = Math.min(maxTotal, Math.max(minRaiseTotal, human.currentBet + Math.floor(state.pot * mult)));
                return (
                  <button key={mult}
                    className="ink-border bg-muted px-2 py-0.5 text-xs font-bold hover:bg-pow-yellow"
                    onClick={() => setRaise(val)} disabled={disabled}>
                    {mult === 1 ? "POT" : `${mult}x pot`}
                  </button>
                );
              })}
              <button className="ink-border bg-muted px-2 py-0.5 text-xs font-bold hover:bg-pow-yellow"
                onClick={() => setRaise(maxTotal)} disabled={disabled}>MAX</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
