import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PokerTable } from "@/components/poker/PokerTable";
import { VARIANT_LIST, type VariantId } from "@/lib/poker/variants";
import { sfx } from "@/lib/audio/sfx";

export const Route = createFileRoute("/play/zen")({
  head: () => ({
    meta: [
      { title: "Zen Poker — Incrível Poker All In" },
      { name: "description", content: "Modo relax: blinds baixas, sem pressão, foco em treino. Hold'em, Omaha ou Short Deck." },
      { property: "og:title", content: "Zen Poker · Incrível Poker" },
      { property: "og:description", content: "Treine poker sem pressão." },
    ],
  }),
  component: ZenPage,
});

function ZenPage() {
  const [variant, setVariant] = useState<VariantId | null>(null);

  if (variant) {
    return (
      <PokerTable
        difficulty="beginner"
        variant={variant}
        modeLabel="🧘 ZEN POKER"
        smallBlind={5}
        bigBlind={10}
        startStack={2000}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="ink-border-thick bg-pow-blue text-white p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl text-white shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl truncate">🧘 ZEN POKER</h1>
      </header>
      <main className="max-w-3xl mx-auto p-4 md:p-6">
        <p className="mb-4 font-body">Escolha a modalidade. Blinds baixas, IA relaxada, stack dobrado.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {VARIANT_LIST.map((v) => (
            <button
              key={v.id}
              onClick={() => { sfx.unlock(); setVariant(v.id); }}
              className="ink-border-thick hard-shadow bg-card rounded-lg p-4 text-left transition-transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-1">{v.emoji}</div>
              <div className="font-display text-xl">{v.name}</div>
              <div className="text-xs text-muted-foreground">{v.description}</div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
