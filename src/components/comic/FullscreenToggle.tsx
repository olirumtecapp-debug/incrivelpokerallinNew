import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { lockLandscape, unlockOrientation } from "@/lib/orientation";

export function FullscreenToggle({ className }: { className?: string }) {
  const [supported, setSupported] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    const ok = !!(el.requestFullscreen || el.webkitRequestFullscreen);
    setSupported(ok);
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isFs) { unlockOrientation(); return; }
    lockLandscape();
    setShowHint(true);
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, [isFs]);

  if (!supported) return null;

  async function toggle() {
    try {
      const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> };
      const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
      if (document.fullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } else {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn("fixed bottom-4 right-4 landscape-short:bottom-1 landscape-short:right-1 z-50 flex flex-col items-end gap-2", className)}>
      {isFs && showHint && (
        <div className="ink-border bg-paper text-ink font-body text-xs px-2 py-1 hard-shadow-sm max-w-[180px] text-right">
          toque em SAIR para voltar
        </div>
      )}
      <button
        onClick={toggle}
        aria-label={isFs ? "Sair da tela cheia" : "Entrar em tela cheia"}
        className={cn(
          "ink-border-thick hard-shadow-sm font-display tracking-wide px-3 py-2 text-sm transition-all",
          "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
          isFs ? "bg-pow-red text-white" : "bg-pow-yellow text-ink",
        )}
      >
        {isFs ? "✕ SAIR" : "⛶ TELA CHEIA"}
      </button>
    </div>
  );
}
