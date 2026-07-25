// Helpers para tentar travar orientação em retrato (portrait).
// O layout HQ é desenhado para portrait no mobile; landscape espreme cartas
// e mesa. Nem todos os browsers suportam a Screen Orientation API
// (iOS Safari não), então usamos best-effort + overlay bloqueante no
// LandscapeHint como fallback universal.

type OrientationLike = ScreenOrientation & {
  lock?: (o: "landscape" | "portrait" | "any" | "natural") => Promise<void>;
};

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export async function lockPortrait(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!isMobileDevice()) return;
  try {
    const orient = (window.screen?.orientation ?? null) as OrientationLike | null;
    if (orient?.lock) await orient.lock("portrait");
  } catch {
    // ignore — muitos browsers exigem fullscreen ou simplesmente não suportam
  }
}

export function unlockOrientation(): void {
  if (typeof window === "undefined") return;
  try {
    window.screen?.orientation?.unlock?.();
  } catch {
    // ignore
  }
}
