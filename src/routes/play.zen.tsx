import { createFileRoute } from "@tanstack/react-router";
import { PokerTable } from "@/components/poker/PokerTable";

export const Route = createFileRoute("/play/zen")({
  head: () => ({
    meta: [
      { title: "Zen Poker — Incrível Poker All In" },
      { name: "description", content: "Modo relax: blinds baixas, sem pressão, foco em treino." },
      { property: "og:title", content: "Zen Poker · Incrível Poker" },
      { property: "og:description", content: "Treine poker sem pressão." },
    ],
  }),
  component: ZenPage,
});

function ZenPage() {
  return (
    <PokerTable
      difficulty="beginner"
      modeLabel="🧘 ZEN POKER"
      smallBlind={5}
      bigBlind={10}
      startStack={2000}
    />
  );
}
