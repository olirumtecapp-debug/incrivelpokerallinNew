import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ComicButton } from "@/components/comic/ComicButton";
import { PERSONALITIES } from "@/lib/poker/ai";
import { PokerTable } from "@/components/poker/PokerTable";
import { usePokerStore } from "@/lib/poker/store";

export const Route = createFileRoute("/play/campaign")({
  head: () => ({
    meta: [
      { title: "Campanha — Copa do Mundo de Poker HQ" },
      { name: "description", content: "Enfrente chefes caricatos em uma jornada narrativa de poker." },
      { property: "og:title", content: "Campanha · Incrível Poker" },
      { property: "og:description", content: "Copa do Mundo de Poker HQ." },
    ],
  }),
  component: CampaignPage,
});

interface Stage {
  id: number;
  country: string;
  flag: string;
  bossId: string;
  intro: string;
}

const STAGES: Stage[] = [
  { id: 1, country: "Vilarejo dos Bluffs", flag: "🏘️", bossId: "aprendiz", intro: "Sua primeira parada. O Zé Cartinhas mal sabe embaralhar!" },
  { id: 2, country: "Reino do Sorriso", flag: "🌈", bossId: "sorridente", intro: "Dona Sorriso te recebe com um chá... e um par de damas." },
  { id: 3, country: "Metrópole dos Naipes", flag: "🏙️", bossId: "tatico", intro: "Doutor Naipe calcula tudo. Prepare-se pra matemática." },
  { id: 4, country: "Fortaleza do Blefe", flag: "🏰", bossId: "mestre", intro: "O chefão. Vilão do Blefe. Só coragem te salva agora." },
];

const STORAGE_KEY = "ip_campaign_progress";

function CampaignPage() {
  const [progress, setProgress] = useState<number>(1);
  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProgress(parseInt(saved, 10) || 1);
  }, []);

  if (activeStage) {
    const boss = PERSONALITIES.find((p) => p.id === activeStage.bossId)!;
    return (
      <CampaignMatch
        stage={activeStage}
        boss={boss}
        onExit={() => setActiveStage(null)}
        onWin={() => {
          const newP = Math.max(progress, activeStage.id + 1);
          setProgress(newP);
          localStorage.setItem(STORAGE_KEY, String(newP));
          setActiveStage(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="ink-border-thick bg-pow-red p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl text-white shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl text-white truncate">🏆 COPA DO MUNDO DE POKER HQ</h1>
      </header>
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="halftone-red ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4">
          <h2 className="font-display text-2xl text-white">MAPA DA JORNADA</h2>
        </div>
        <div className="space-y-3">
          {STAGES.map((s) => {
            const boss = PERSONALITIES.find((p) => p.id === s.bossId)!;
            const locked = s.id > progress;
            const completed = s.id < progress;
            return (
              <button
                key={s.id}
                disabled={locked}
                onClick={() => setActiveStage(s)}
                className={`w-full ink-border-thick hard-shadow rounded-lg p-4 text-left transition-transform disabled:opacity-40 disabled:cursor-not-allowed ${completed ? "bg-pow-yellow" : "bg-card"} enabled:hover:-translate-y-1 enabled:hover:-translate-x-1`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl shrink-0">{s.flag}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xl">
                      FASE {s.id} · {s.country}
                    </div>
                    <div className="text-sm">Chefe: <span className="font-bold text-pow-red">{boss.name}</span> ({boss.title})</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.intro}</div>
                  </div>
                  <div className="shrink-0">
                    {locked && <span className="text-3xl">🔒</span>}
                    {completed && <span className="text-3xl">✅</span>}
                    {!locked && !completed && <span className="font-display text-pow-red">JOGAR →</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {progress > STAGES.length && (
          <div className="mt-6 ink-border-thick hard-shadow bg-pow-yellow p-4 text-center">
            <div className="font-display text-3xl">🏆 CAMPEÃO MUNDIAL!</div>
            <div className="text-sm mt-1">Você conquistou a Copa do Mundo de Poker HQ.</div>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-2">
          <ComicButton variant="secondary" size="sm" onClick={() => {
            localStorage.removeItem(STORAGE_KEY); setProgress(1);
          }}>
            Reiniciar progresso
          </ComicButton>
        </div>
      </main>
    </div>
  );
}

function CampaignMatch({ stage, boss, onExit, onWin }: {
  stage: Stage; boss: typeof PERSONALITIES[number]; onExit: () => void; onWin: () => void;
}) {
  // Mostra intro, depois joga
  const [showIntro, setShowIntro] = useState(true);
  if (showIntro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full ink-border-thick hard-shadow-lg bg-card rounded-lg p-6 -rotate-1">
          <div className="text-6xl text-center mb-3">{stage.flag}</div>
          <div className="font-display text-2xl text-center mb-1">FASE {stage.id}</div>
          <div className="font-display text-xl text-center text-pow-red mb-4">{stage.country}</div>
          <div className="ink-border bg-white p-3 rounded font-body italic text-center">
            "{stage.intro}"
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className={`${boss.avatarBg} ink-border-thick w-14 h-14 rounded-full flex items-center justify-center text-3xl`}>{boss.emoji}</div>
            <div>
              <div className="font-display text-lg">{boss.name}</div>
              <div className="text-xs font-bold text-pow-red">{boss.title}</div>
            </div>
          </div>
          <div className="mt-5 flex gap-2 justify-center">
            <ComicButton variant="danger" onClick={onExit}>VOLTAR</ComicButton>
            <ComicButton variant="primary" onClick={() => setShowIntro(false)}>DUELAR!</ComicButton>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative">
      <PokerTable
        difficulty={boss.difficulty}
        modeLabel={`CAMPANHA · FASE ${stage.id} · ${stage.country}`}
        smallBlind={10 + stage.id * 5}
        bigBlind={20 + stage.id * 10}
        startStack={1000}
      />
      {/* Botão de conclusão flutuante — chamado quando player vence */}
      <CampaignWinWatcher onWin={onWin} />
    </div>
  );
}
// Observa a store pra marcar vitória e liberar próxima fase
function CampaignWinWatcher({ onWin }: { onWin: () => void }) {
  const state = usePokerStore((s) => s.state);
  useEffect(() => {
    if (!state) return;
    const alive = state.players.filter((p) => p.stack > 0);
    if (alive.length === 1 && alive[0].id === "human" && state.awaitingAdvance) {
      const t = setTimeout(onWin, 2200);
      return () => clearTimeout(t);
    }
  }, [state, onWin]);
  return null;
}
