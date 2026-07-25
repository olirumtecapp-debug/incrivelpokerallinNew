import { useEffect, useState } from "react";

interface Props {
  /** Se true, mostra apenas em landscape E mobile. */
  onlyMobileLandscape?: boolean;
  /** Se true, exibe botão de fechar e guarda no localStorage. */
  dismissible?: boolean;
  storageKey?: string;
  /** Se true, cobre a tela inteira bloqueando interação até girar. Ideal em telas de jogo. */
  blocking?: boolean;
}

/**
 * Balão HQ orientando o jogador a manter o celular EM PÉ (portrait).
 * O layout HQ foi desenhado para portrait mobile — em landscape as cartas
 * ficam pequenas demais, então bloqueamos e pedimos para girar de volta.
 * Em modo `blocking`, vira um overlay de tela cheia impedindo interação
 * (fallback universal para navegadores que não travam orientação — ex.: iOS Safari).
 */
export function LandscapeHint({
  onlyMobileLandscape = true,
  dismissible = false,
  storageKey = "orientation-hint-dismissed",
  blocking = false,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissible && typeof window !== "undefined") {
      setDismissed(localStorage.getItem(storageKey) === "1");
    }
  }, [dismissible, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Mobile landscape: largura curta E altura baixa (evita disparar em tablets/desktop).
    const mq = window.matchMedia(onlyMobileLandscape
      ? "(max-width: 900px) and (orientation: landscape) and (max-height: 500px)"
      : "(orientation: landscape)");
    const update = () => setVisible(mq.matches);
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [onlyMobileLandscape]);

  if (!visible || dismissed) return null;

  if (blocking) {
    return (
      <div className="fixed inset-0 z-[9999] bg-ink/90 grid place-items-center p-6 text-center">
        <div className="ink-border-thick hard-shadow-lg halftone-yellow bg-pow-yellow rounded-lg px-6 py-8 max-w-xs">
          <div className="text-6xl mb-3 animate-shake" aria-hidden>📱</div>
          <h2 className="font-display text-2xl text-ink-fixed leading-tight mb-2">
            GIRE PRA CIMA!
          </h2>
          <p className="font-body text-sm text-ink-fixed font-bold">
            Este jogo funciona melhor com o celular <span className="whitespace-nowrap">EM PÉ</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ink-border-thick hard-shadow-sm halftone-yellow bg-pow-yellow rounded-md px-3 py-2 flex items-center gap-3 text-ink-fixed animate-shake">
      <span className="text-2xl shrink-0" aria-hidden>📱</span>
      <p className="font-display text-sm leading-tight flex-1 min-w-0">
        Melhor experiência com o celular <span className="whitespace-nowrap">EM PÉ!</span>
      </p>
      {dismissible && (
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") localStorage.setItem(storageKey, "1");
            setDismissed(true);
          }}
          className="ink-border bg-white text-ink-fixed font-display text-xs px-2 py-1 rounded shrink-0 hover:bg-pow-red hover:text-white transition-colors"
          aria-label="Ok, entendi"
        >
          OK
        </button>
      )}
    </div>
  );
}
