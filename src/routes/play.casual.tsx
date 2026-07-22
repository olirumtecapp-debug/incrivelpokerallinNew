import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Difficulty } from "@/lib/poker/ai";
import { PERSONALITIES } from "@/lib/poker/ai";
import { PokerTable } from "@/components/poker/PokerTable";
import { ComicButton } from "@/components/comic/ComicButton";

export const Route = createFileRoute("/play/casual")({
  head: () => ({
    meta: [
      { title: "Casual — Incrível Poker All In" },
      { name: "description", content: "Partida casual de Texas Hold'em contra IA em estilo HQ." },
      { property: "og:title", content: "Casual · Incrível Poker" },
      { property: "og:description", content: "Escolha o adversário e jogue." },
    ],
  }),
  component: CasualPage,
});

function CasualPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  if (difficulty) {
    return <PokerTable difficulty={difficulty} modeLabel={`CASUAL · ${difficulty.toUpperCase()}`} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="ink-border-thick bg-pow-yellow p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl truncate">🎲 CASUAL</h1>
      </header>
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="halftone-yellow ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4">
          <h2 className="font-display text-2xl">ESCOLHA O ADVERSÁRIO</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERSONALITIES.map((p) => (
            <button
              key={p.id}
              onClick={() => setDifficulty(p.difficulty)}
              className="ink-border-thick hard-shadow bg-card rounded-lg p-4 text-left transition-transform hover:-translate-y-1 hover:-translate-x-1"
            >
              <div className="flex items-center gap-3">
                <div className={`${p.avatarBg} ink-border-thick w-16 h-16 rounded-full flex items-center justify-center text-4xl shrink-0`}>{p.emoji}</div>
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
