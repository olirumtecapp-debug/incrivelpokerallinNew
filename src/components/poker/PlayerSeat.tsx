import type { Player } from "@/lib/poker/engine";
import { PlayingCard } from "./PlayingCard";
import { SpeechBubble } from "@/components/comic/SpeechBubble";
import { cn } from "@/lib/utils";

interface Props {
  player: Player;
  isActive: boolean;
  isDealer: boolean;
  reveal: boolean;
  taunt?: string;
  isWinner?: boolean;
}

export function PlayerSeat({ player, isActive, isDealer, reveal, taunt, isWinner }: Props) {
  const showCards = !player.folded && (reveal || !player.isBot);
  return (
    <div className={cn(
      "relative flex flex-col items-center gap-2",
      player.folded && "opacity-40",
      isWinner && "animate-shake",
    )}>
      {taunt && player.isBot && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 max-w-[220px]">
          <SpeechBubble tail="bottom-left" className="text-sm whitespace-nowrap">
            {taunt}
          </SpeechBubble>
        </div>
      )}

      <div className="flex gap-1">
        {player.hole.length === 0
          ? [0, 1].map((i) => <PlayingCard key={i} size="sm" faceDown dealDelay={i * 80} />)
          : player.hole.map((c, i) => (
              <PlayingCard key={i} card={c} faceDown={!showCards} size="sm" dealDelay={i * 80} />
            ))}
      </div>

      <div className={cn(
        "ink-border-thick hard-shadow-sm bg-card px-3 py-2 min-w-[140px] text-center rounded-md",
        isActive && "bg-pow-yellow scale-105 transition-transform",
        isWinner && "bg-pow-yellow",
      )}>
        <div className="flex items-center justify-center gap-2">
          {player.personality?.emoji && <span className="text-xl">{player.personality.emoji}</span>}
          <div className="font-display text-lg truncate">{player.name}</div>
          {isDealer && (
            <span className="ink-border bg-white text-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">D</span>
          )}
        </div>
        <div className="font-body font-bold text-sm text-muted-foreground">
          🪙 {player.stack.toLocaleString("pt-BR")}
        </div>
        {player.currentBet > 0 && (
          <div className="mt-1 font-body font-bold text-xs bg-chip-red text-white rounded px-2 py-0.5 inline-block animate-chip-drop">
            aposta: {player.currentBet}
          </div>
        )}
        {player.lastAction && !player.folded && (
          <div className="font-display text-xs mt-1 text-pow-red">{player.lastAction}</div>
        )}
        {player.folded && <div className="font-display text-xs mt-1 text-muted-foreground">FOLD</div>}
        {player.allIn && <div className="font-display text-xs mt-1 text-pow-red">ALL-IN</div>}
      </div>
    </div>
  );
}
