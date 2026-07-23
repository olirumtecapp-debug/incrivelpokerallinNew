import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Difficulty } from "@/lib/poker/ai";
import { PERSONALITIES } from "@/lib/poker/ai";
import { VARIANT_LIST, type VariantId } from "@/lib/poker/variants";
import { PokerTable } from "@/components/poker/PokerTable";
import { ComicButton } from "@/components/comic/ComicButton";
import { AvatarBadge } from "@/components/multiplayer/AvatarPicker";
import { sfx } from "@/lib/audio/sfx";

export const Route = createFileRoute("/play/casual")({
  head: () => ({
    meta: [
      { title: "Casual — Incrível Poker All In" },
      { name: "description", content: "Partida casual: Hold'em, Omaha ou Short Deck contra a IA em estilo HQ." },
      { property: "og:title", content: "Casual · Incrível Poker" },
      { property: "og:description", content: "Escolha modalidade, adversário e jogue." },
    ],
  }),
  component: CasualPage,
});

function CasualPage() {
  const [variant, setVariant] = useState<VariantId>("holdem");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  if (difficulty) {
    return <PokerTable difficulty={difficulty} variant={variant} modeLabel={`CASUAL · ${difficulty.toUpperCase()}`} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="ink-border-thick bg-pow-yellow text-ink-fixed p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl truncate">🎲 CASUAL</h1>
      </header>
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="halftone-yellow ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4">
          <h2 className="font-display text-2xl">MODALIDADE</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {VARIANT_LIST.map((v) => (
            <button
              key={v.id}
              onClick={() => { sfx.unlock(); sfx.play("click"); setVariant(v.id); }}
              className={`ink-border-thick hard-shadow-sm rounded-lg p-4 text-left transition-transform hover:-translate-y-1 ${variant === v.id ? "bg-pow-yellow text-ink-fixed" : "bg-card"}`}
            >
              <div className="text-3xl mb-1">{v.emoji}</div>
              <div className="font-display text-lg">{v.name}</div>
              <div className="text-xs text-muted-foreground">{v.description}</div>
              {variant === v.id && <div className="mt-2 font-display text-sm text-pow-red">✓ ESCOLHIDA</div>}
            </button>
          ))}
        </div>

        <div className="halftone-yellow ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4">
          <h2 className="font-display text-2xl">ESCOLHA O ADVERSÁRIO</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERSONALITIES.map((p) => (
            <button
              key={p.id}
              onClick={() => { sfx.unlock(); setDifficulty(p.difficulty); }}
              className="ink-border-thick hard-shadow bg-card rounded-lg p-4 text-left transition-transform hover:-translate-y-1 hover:-translate-x-1"
            >
              <div className="flex items-center gap-3">
                <div className={`${p.avatarBg} ink-border-thick w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden`}>
                  <AvatarBadge avatarId={p.avatarId} size={60} className="!border-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-2xl truncate">{p.name}</div>
                  <div className="text-sm font-bold text-pow-red">{p.title}</div>
                  <div className="text-xs text-muted-foreground uppercase mt-1">Dif: {p.difficulty}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/tutorial"><ComicButton variant="secondary">📖 REVER REGRAS</ComicButton></Link>
        </div>
      </main>
    </div>
  );
}
