import { createFileRoute, Link } from "@tanstack/react-router";
import { HandRank, HAND_NAME } from "@/lib/poker/evaluator";
import { ComicButton } from "@/components/comic/ComicButton";
import { VARIANT_LIST } from "@/lib/poker/variants";

export const Route = createFileRoute("/tutorial")({
  head: () => ({
    meta: [
      { title: "Como Jogar — Incrível Poker All In" },
      { name: "description", content: "Aprenda a hierarquia das mãos e as regras do Hold'em, Omaha e Short Deck." },
      { property: "og:title", content: "Tutorial · Incrível Poker" },
      { property: "og:description", content: "Aprenda as regras de todas as modalidades em estilo HQ." },
    ],
  }),
  component: Tutorial,
});

const HANDS = [
  { rank: HandRank.ROYAL_FLUSH, ex: "A♠ K♠ Q♠ J♠ 10♠", desc: "Sequência do 10 ao Ás, todas do mesmo naipe." },
  { rank: HandRank.STRAIGHT_FLUSH, ex: "9♥ 8♥ 7♥ 6♥ 5♥", desc: "Cinco em sequência, do mesmo naipe." },
  { rank: HandRank.FOUR_KIND, ex: "K♠ K♥ K♦ K♣ 3♠", desc: "Quatro do mesmo valor." },
  { rank: HandRank.FULL_HOUSE, ex: "Q♠ Q♥ Q♦ 8♣ 8♠", desc: "Trinca + par." },
  { rank: HandRank.FLUSH, ex: "A♦ J♦ 8♦ 6♦ 2♦", desc: "Cinco do mesmo naipe." },
  { rank: HandRank.STRAIGHT, ex: "9♠ 8♥ 7♦ 6♣ 5♠", desc: "Cinco em sequência, naipes variados." },
  { rank: HandRank.THREE_KIND, ex: "7♠ 7♥ 7♦ K♣ 4♠", desc: "Três do mesmo valor." },
  { rank: HandRank.TWO_PAIR, ex: "J♠ J♥ 4♦ 4♣ 9♠", desc: "Dois pares diferentes." },
  { rank: HandRank.PAIR, ex: "10♠ 10♥ 8♦ 5♣ 2♠", desc: "Duas do mesmo valor." },
  { rank: HandRank.HIGH_CARD, ex: "A♠ J♥ 8♦ 6♣ 3♠", desc: "Nada acima. Ganha a maior carta." },
];

const RULES = [
  { title: "1. BLINDS", body: "Antes das cartas, dois jogadores pagam Small Blind e Big Blind." },
  { title: "2. HOLE CARDS", body: "Cada um recebe cartas fechadas: 2 no Hold'em/Short, 4 no Omaha." },
  { title: "3. PRÉ-FLOP", body: "Rodada de apostas. DOBRAR, PAGAR ou AUMENTAR." },
  { title: "4. FLOP", body: "3 cartas comunitárias abertas." },
  { title: "5. TURN & RIVER", body: "Mais 2 cartas comunitárias, uma por vez." },
  { title: "6. SHOWDOWN", body: "Melhor mão de 5 leva. No Omaha: exatamente 2 hole + 3 mesa." },
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
          <div className="halftone-yellow ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4">
            <h2 className="font-display text-2xl md:text-3xl">MODALIDADES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {VARIANT_LIST.map((v) => (
              <div key={v.id} className="ink-border hard-shadow-sm bg-card p-4 rounded-md">
                <div className="text-3xl mb-1">{v.emoji}</div>
                <div className="font-display text-xl">{v.name}</div>
                <div className="text-sm mt-1">{v.description}</div>
                {v.id === "shortdeck" && <div className="mt-2 text-xs font-bold text-pow-red">⚠ Flush &gt; Full House · A-6-7-8-9 é straight</div>}
                {v.id === "omaha" && <div className="mt-2 text-xs font-bold text-pow-red">⚠ Você DEVE usar exatamente 2 hole cards + 3 do board</div>}
              </div>
            ))}
          </div>
        </section>

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
            <Card title="DOBRAR (FOLD)" body="Desiste da mão. Perde o que já apostou." />
            <Card title="CHECK" body="Passa a vez sem apostar. Só quando ninguém apostou nesta rodada." />
            <Card title="PAGAR (CALL)" body="Iguala a aposta atual." />
            <Card title="AUMENTAR (RAISE)" body="Aumenta a aposta." />
            <Card title="ALL-IN" body="Todas as fichas. POW!" />
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
