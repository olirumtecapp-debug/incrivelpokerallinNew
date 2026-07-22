import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  text: string | undefined;
  ts?: number;
}

/** Explosão HQ centralizada com texto de impacto. Auto-hide após 1.4s. */
export function ImpactText({ text, ts }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!text || !ts) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(t);
  }, [text, ts]);

  if (!visible || !text) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className={cn(
        "burst-clip halftone-yellow ink-border-thick px-14 py-10 animate-pop-in",
      )}>
        <div className="font-display text-5xl md:text-7xl text-ink text-center drop-shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
          {text}
        </div>
      </div>
    </div>
  );
}
