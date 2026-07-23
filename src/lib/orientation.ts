// Helpers para tentar travar orientação em paisagem.
// Nem todos os browsers suportam (iOS Safari não). Usamos best-effort +
// overlay bloqueante no LandscapeHint como fallback universal.

type OrientationLike = ScreenOrientation & {
  lock?: (o: "landscape" | "portrait" | "any" | "natural") => Promise<void>;
};

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export async function lockLandscape(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!isMobileDevice()) return;
  try {
    const orient = (window.screen?.orientation ?? null) as OrientationLike | null;
    if (orient?.lock) await orient.lock("landscape");
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
