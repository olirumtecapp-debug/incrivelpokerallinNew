import { createFileRoute, Link } from "@tanstack/react-router";
import { HandRank, HAND_NAME } from "@/lib/poker/evaluator";
import { ComicButton } from "@/components/comic/ComicButton";

export const Route = createFileRoute("/tutorial")({
  head: () => ({
    meta: [
      { title: "Como Jogar — Incrível Poker All In" },
      { name: "description", content: "Aprenda a hierarquia das mãos e as regras básicas do Texas Hold'em." },
      { property: "og:title", content: "Tutorial · Incrível Poker" },
      { property: "og:description", content: "Aprenda o Texas Hold'em em estilo HQ." },
    ],
  }),
  component: Tutorial,
});

const HANDS = [
  { rank: HandRank.ROYAL_FLUSH, ex: "A♠ K♠ Q♠ J♠ 10♠", desc: "Sequência do 10 ao Ás, todas do mesmo naipe. A rainha das mãos." },
  { rank: HandRank.STRAIGHT_FLUSH, ex: "9♥ 8♥ 7♥ 6♥ 5♥", desc: "Cinco cartas em sequência, do mesmo naipe." },
  { rank: HandRank.FOUR_KIND, ex: "K♠ K♥ K♦ K♣ 3♠", desc: "Quatro cartas de mesmo valor." },
  { rank: HandRank.FULL_HOUSE, ex: "Q♠ Q♥ Q♦ 8♣ 8♠", desc: "Trinca + par." },
  { rank: HandRank.FLUSH, ex: "A♦ J♦ 8♦ 6♦ 2♦", desc: "Cinco cartas do mesmo naipe (sem ordem)." },
  { rank: HandRank.STRAIGHT, ex: "9♠ 8♥ 7♦ 6♣ 5♠", desc: "Cinco cartas em sequência, naipes variados." },
  { rank: HandRank.THREE_KIND, ex: "7♠ 7♥ 7♦ K♣ 4♠", desc: "Três cartas do mesmo valor." },
  { rank: HandRank.TWO_PAIR, ex: "J♠ J♥ 4♦ 4♣ 9♠", desc: "Dois pares diferentes." },
  { rank: HandRank.PAIR, ex: "10♠ 10♥ 8♦ 5♣ 2♠", desc: "Duas cartas de mesmo valor." },
  { rank: HandRank.HIGH_CARD, ex: "A♠ J♥ 8♦ 6♣ 3♠", desc: "Nenhuma das combinações acima. Ganha quem tem a carta mais alta." },
];

const RULES = [
  { title: "1. BLINDS", body: "Antes das cartas, dois jogadores pagam o Small Blind (SB) e o Big Blind (BB). Isso põe fichas no pote pra rodada começar." },
  { title: "2. HOLE CARDS", body: "Cada jogador recebe 2 cartas fechadas. Só você vê as suas." },
  { title: "3. PRÉ-FLOP", body: "Rodada de apostas. Você pode DOBRAR, PAGAR ou AUMENTAR." },
  { title: "4. FLOP", body: "3 cartas comunitárias abertas na mesa. Nova rodada de apostas." },
  { title: "5. TURN & RIVER", body: "Mais 2 cartas comunitárias, uma de cada vez, com apostas entre elas." },
  { title: "6. SHOWDOWN", body: "Quem chegou aqui abre as cartas. A melhor mão de 5 cartas (das 2 suas + 5 da mesa) leva o pote!" },
];

function Tutorial() {
  return (
    <div className="min-h-screen bg-background">
      <header className="ink-border-thick bg-pow-yellow p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl truncate">📖 COMO JOGAR</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
        <section>
          <div className="halftone-red ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4">
            <h2 className="font-display text-2xl md:text-3xl text-white">RANKING DAS MÃOS</h2>
          </div>
          <div className="space-y-2">
            {HANDS.map((h, i) => (
              <div key={h.rank} className="ink-border hard-shadow-sm bg-card rounded-md p-3 flex items-center gap-4">
                <div className="ink-border bg-pow-yellow font-display text-2xl w-12 h-12 flex items-center justify-center shrink-0">
                  {HANDS.length - i}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-lg">{HAND_NAME[h.rank]}</div>
                  <div className="font-mono text-sm text-pow-red">{h.ex}</div>
                  <div className="text-sm text-muted-foreground">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="halftone-yellow ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4">
            <h2 className="font-display text-2xl md:text-3xl">FLUXO DA RODADA</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RULES.map((r) => (
              <div key={r.title} className="ink-border hard-shadow-sm bg-card p-4 rounded-md">
                <h3 className="font-display text-xl mb-1">{r.title}</h3>
                <p className="text-sm">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="halftone-red ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4">
            <h2 className="font-display text-2xl md:text-3xl text-white">AÇÕES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card title="DOBRAR (FOLD)" body="Desiste da mão. Perde o que já apostou, mas não paga mais." />
            <Card title="CHECK" body="Passa a vez sem apostar. Só quando ninguém apostou nesta rodada." />
            <Card title="PAGAR (CALL)" body="Iguala a aposta atual pra continuar na mão." />
            <Card title="AUMENTAR (RAISE)" body="Aumenta a aposta. Todos precisam pagar o novo valor pra continuar." />
            <Card title="ALL-IN" body="Aposta TODAS as suas fichas. Sem volta. POW!" />
          </div>
        </section>

        <div className="flex justify-center pt-2">
          <Link to="/play/casual"><ComicButton variant="primary" size="lg">JOGAR AGORA</ComicButton></Link>
        </div>
      </main>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="ink-border hard-shadow-sm bg-card p-4 rounded-md">
      <div className="font-display text-lg text-pow-red">{title}</div>
      <div className="text-sm">{body}</div>
    </div>
  );
}
