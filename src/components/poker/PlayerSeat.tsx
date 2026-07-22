import type { Player } from "@/lib/poker/engine";
import { PlayingCard } from "./PlayingCard";
import { SpeechBubble } from "@/components/comic/SpeechBubble";
import { AvatarBadge } from "@/components/multiplayer/AvatarPicker";
import { cn } from "@/lib/utils";

interface Props {
  player: Player;
  isActive: boolean;
  isDealer: boolean;
  reveal: boolean;
  taunt?: string;
  isWinner?: boolean;
  holeCount?: number;
  isMe?: boolean;
  /** Se preenchido, exibe avatar HQ (multiplayer). Bots single-player continuam com emoji do personality. */
  avatarId?: string | null;
}

export function PlayerSeat({ player, isActive, isDealer, reveal, taunt, isWinner, holeCount = 2, isMe = false, avatarId }: Props) {
  const showCards = !player.folded && (reveal || !player.isBot);
  const slots = holeCount === 4 ? [0, 1, 2, 3] : [0, 1];
  const size = isMe ? "md" : "sm";
  return (
    <div className={cn(
      "relative flex flex-col items-center gap-1",
      isMe && "flex-col-reverse",
      player.folded && "opacity-40",
      isWinner && "animate-shake",
    )}>
      {taunt && player.isBot && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 max-w-[200px]">
          <SpeechBubble tail="bottom-left" className="text-xs whitespace-nowrap">
            {taunt}
          </SpeechBubble>
        </div>
      )}

      <div className={cn("flex gap-1 shrink-0", holeCount === 4 && "grid grid-cols-2 gap-1")}>
        {slots.map((i) => {
          const c = player.hole[i];
          if (!c) return <PlayingCard key={i} size={size} faceDown dealDelay={i * 60} />;
          return <PlayingCard key={i} card={c} faceDown={!showCards} size={size} dealDelay={i * 60} />;
        })}
      </div>

      <div className={cn(
        "ink-border-thick hard-shadow-sm bg-card px-2 py-1 md:px-3 md:py-1.5 min-w-[110px] md:min-w-[140px] text-center rounded-md",
        isActive && "bg-pow-yellow scale-105 transition-transform",
        isWinner && "bg-pow-yellow",
      )}>
        <div className="flex items-center justify-center gap-1.5">
          {avatarId ? (
            <AvatarBadge avatarId={avatarId} size={isMe ? 32 : 24} />
          ) : (
            player.personality?.emoji && <span className="text-base md:text-lg">{player.personality.emoji}</span>
          )}
          <div className="font-display text-sm md:text-base truncate">{player.name}</div>
          {isDealer && (
            <span className="ink-border bg-white text-ink text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">D</span>
          )}
        </div>
        <div className="font-body font-bold text-xs text-muted-foreground">
          🪙 {player.stack.toLocaleString("pt-BR")}
        </div>
        {player.currentBet > 0 && (
          <div className="mt-0.5 font-body font-bold text-[10px] bg-chip-red text-white rounded px-1.5 py-0.5 inline-block animate-chip-drop">
            aposta: {player.currentBet}
          </div>
        )}
        {player.lastAction && !player.folded && (
          <div className="font-display text-[10px] text-pow-red">{player.lastAction}</div>
        )}
        {player.folded && <div className="font-display text-[10px] text-muted-foreground">FOLD</div>}
        {player.allIn && <div className="font-display text-[10px] text-pow-red">ALL-IN</div>}
      </div>
    </div>
  );
}
