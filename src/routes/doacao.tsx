import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Copy, Check, Home } from "lucide-react";
import { ComicButton } from "@/components/comic/ComicButton";
import { sfx } from "@/lib/audio/sfx";

export const Route = createFileRoute("/doacao")({
  head: () => ({
    meta: [
      { title: "Doação — Incrível Poker All In" },
      {
        name: "description",
        content:
          "Curtiu o Incrível Poker All In? Apoie o desenvolvedor com uma doação via Pix. Qualquer valor ajuda a manter o projeto vivo!",
      },
      { property: "og:title", content: "Apoie o Incrível Poker All In" },
      {
        property: "og:description",
        content:
          "Se você gostou do jogo, considere fazer uma doação. Toda ajuda faz diferença!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Apoie o Incrível Poker All In" },
      {
        name: "twitter:description",
        content: "Doe via Pix e ajude o Incrível Poker All In a crescer.",
      },
    ],
  }),
  component: DoacaoPage,
});

const PIX_COPIA_E_COLA =
  "00020101021126420014br.gov.bcb.pix0120olirumdev1@gmail.com5204000053039865802BR5918MURILO SILVA - PIJ6008BRASILIA62070503***630432FF";

function DoacaoPage() {
  const [copied, setCopied] = useState(false);

  const copyPixCode = async () => {
    let success = false;
    try {
      await navigator.clipboard.writeText(PIX_COPIA_E_COLA);
      success = true;
    } catch {
      // Fallback para navegadores/contextos que bloqueiam a Clipboard API.
      try {
        const textarea = document.createElement("textarea");
        textarea.value = PIX_COPIA_E_COLA;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        success = true;
      } catch {}
    }
    try { sfx.play("click"); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    if (!success) {
      // eslint-disable-next-line no-console
      console.warn("Não foi possível copiar o código Pix automaticamente.");
    }
  };

  return (
    <main className="min-h-[100svh] bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <ComicButton variant="ghost" size="sm">← Menu</ComicButton>
          </Link>
          <div className="font-display text-2xl uppercase text-pow-red text-ink-fixed">
            Doação
          </div>
          <div className="w-[72px]" />
        </div>

        <div className="ink-border-thick hard-shadow rounded-xl bg-pow-red text-white p-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 bg-pow-yellow text-ink-fixed ink-border rounded-md font-display uppercase text-xs tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" /> Apoie o projeto
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-[0.95] uppercase">
            FAÇA UMA<br />DOAÇÃO ♠♥
          </h1>
          <p className="mt-4 max-w-lg text-sm sm:text-base font-display">
            Se você curtiu o <span className="underline decoration-pow-yellow decoration-[3px]">Incrível Poker All In</span> e acha que tem potencial, considere apoiar o desenvolvedor. Qualquer valor ajuda a manter o projeto vivo e trazer novidades! 🚀
          </p>
        </div>

        <div className="mt-5 grid gap-5 items-start">
          <div className="ink-border rounded-xl bg-card text-card-foreground p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <div className="font-display uppercase text-xs opacity-70 tracking-widest mb-1">Favorecido</div>
                <div className="font-bold text-2xl">MURILO SILVA - PIJ</div>
                <div className="text-sm italic opacity-70 font-display">
                  Desenvolvedor 💻
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-display uppercase text-xs opacity-70 tracking-widest">Código Pix Copia e Cola</div>
                <div className="relative group">
                  <div 
                    className="ink-border rounded-lg bg-background p-4 font-mono text-[10px] sm:text-xs break-all leading-relaxed pr-12 min-h-[80px] flex items-center"
                    onClick={copyPixCode}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && copyPixCode()}
                  >
                    {PIX_COPIA_E_COLA}
                  </div>
                  <button
                    onClick={copyPixCode}
                    className="absolute right-2 top-1/2 -translate-y-1/2 ink-border rounded-md bg-pow-yellow p-2 hover:scale-105 transition-transform active:scale-95 shadow-sm"
                    title="Copiar código Pix"
                    aria-label="Copiar código Pix"
                  >
                    {copied ? <Check className="w-5 h-5 text-ink-fixed" /> : <Copy className="w-5 h-5 text-ink-fixed" />}
                  </button>
                </div>
                {copied && (
                  <div className="font-display text-sm text-pow-red font-bold animate-bounce">
                    ✓ Código Pix copiado! Cole no app do seu banco.
                  </div>
                )}
              </div>

              <ComicButton 
                variant="primary" 
                className="w-full justify-center gap-2 text-lg py-6"
                onClick={copyPixCode}
              >
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                {copied ? "COPIADO!" : "COPIAR CÓDIGO PIX"}
              </ComicButton>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-foreground/20">
              <p className="text-sm font-display text-center italic">
                💛 Obrigado pelo apoio! Cada contribuição ajuda a manter o servidor e as atualizações.
              </p>
            </div>

            <div className="flex justify-center">
              <Link to="/">
                <ComicButton variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-1 inline" /> Voltar pro jogo
                </ComicButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
