import type { Card } from "@/lib/poker/cards";
import { RANK_LABEL, SUIT_LABEL, isRed } from "@/lib/poker/cards";
import { cn } from "@/lib/utils";

interface Props {
  card?: Card;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  dealDelay?: number;
  highlighted?: boolean;
}

const sizeMap = {
  sm: "w-10 h-14 sm:w-12 sm:h-[68px] text-lg sm:text-xl",
  md: "w-14 h-20 md:w-16 md:h-24 text-xl md:text-2xl",
  lg: "w-12 h-16 sm:w-16 sm:h-24 md:w-20 md:h-28 lg:w-24 lg:h-36 text-2xl md:text-3xl lg:text-4xl",
  xl: "w-20 h-28 md:w-32 md:h-48 text-4xl md:text-5xl",
};

export function PlayingCard({ card, faceDown, size = "md", dealDelay = 0, highlighted }: Props) {
  if (faceDown || !card) {
    return (
      <div
        className={cn(
          "relative ink-border-thick rounded-md halftone-red overflow-hidden animate-card-deal",
          sizeMap[size],
        )}
        style={{ animationDelay: `${dealDelay}ms` }}
      >
        <div className="absolute inset-1 rounded-sm border-2 border-white/70 flex items-center justify-center">
          <span className="font-display text-white text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">♠♥</span>
        </div>
      </div>
    );
  }

  const red = isRed(card.suit);
  return (
    <div
      className={cn(
        "relative ink-border-thick rounded-md bg-white flex flex-col items-center justify-center animate-card-deal font-display leading-none",
        sizeMap[size],
        highlighted && "ring-4 ring-pow-yellow ring-offset-2 ring-offset-transparent",
        red ? "text-pow-red" : "text-ink",
      )}
      style={{ animationDelay: `${dealDelay}ms` }}
    >
      <div className="absolute top-0.5 left-1 text-[0.65em] leading-none">
        <div>{RANK_LABEL[card.rank]}</div>
        <div>{SUIT_LABEL[card.suit]}</div>
      </div>
      <div className="text-[1.4em]">{SUIT_LABEL[card.suit]}</div>
      <div className="absolute bottom-0.5 right-1 rotate-180 text-[0.65em] leading-none">
        <div>{RANK_LABEL[card.rank]}</div>
        <div>{SUIT_LABEL[card.suit]}</div>
      </div>
    </div>
  );
}
