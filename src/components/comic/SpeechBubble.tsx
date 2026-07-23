import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  tail?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

export function SpeechBubble({ children, className, tail = "bottom-left" }: Props) {
  return (
    <div
      className={cn(
        "relative inline-block bg-white ink-border-thick hard-shadow-sm rounded-2xl px-4 py-2 font-body font-bold text-ink-fixed animate-bubble-pop",
        className,
      )}
    >
      {children}
      <span
        className={cn(
          "absolute w-0 h-0 border-solid",
          "border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent",
          tail === "bottom-left" && "left-4 -bottom-3 border-t-[14px] border-t-ink",
          tail === "bottom-right" && "right-4 -bottom-3 border-t-[14px] border-t-ink",
          tail === "top-left" && "left-4 -top-3 border-b-[14px] border-b-ink",
          tail === "top-right" && "right-4 -top-3 border-b-[14px] border-b-ink",
        )}
      />
      <span
        className={cn(
          "absolute w-0 h-0 border-solid",
          "border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent",
          tail === "bottom-left" && "left-[19px] -bottom-[9px] border-t-[11px] border-t-white",
          tail === "bottom-right" && "right-[19px] -bottom-[9px] border-t-[11px] border-t-white",
          tail === "top-left" && "left-[19px] -top-[9px] border-b-[11px] border-b-white",
          tail === "top-right" && "right-[19px] -top-[9px] border-b-[11px] border-b-white",
        )}
      />
    </div>
  );
}
