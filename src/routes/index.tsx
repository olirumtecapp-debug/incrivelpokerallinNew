import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import { ComicButton } from "@/components/comic/ComicButton";
import { LandscapeHint } from "@/components/comic/LandscapeHint";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Incrível Poker All In — Poker HQ Pop Art" },
      { name: "description", content: "Jogue Texas Hold'em com visual de história em quadrinhos. Modo Campanha, Casual, Zen e Multiplayer." },
      { property: "og:title", content: "Incrível Poker All In" },
      { property: "og:description", content: "Poker Texas Hold'em em estilo HQ Pop Art." },
    ],
  }),
  component: Home,
});

const MODES = [
  { to: "/play/campaign", title: "CAMPANHA", subtitle: "Copa do Mundo de Poker HQ", color: "bg-pow-red text-white", emoji: "🏆" },
  { to: "/play/casual", title: "CASUAL", subtitle: "Partida rápida contra a IA", color: "bg-pow-yellow text-ink", emoji: "🎲" },
  { to: "/play/zen", title: "ZEN POKER", subtitle: "Modo relax, sem pressão", color: "bg-pow-blue text-white", emoji: "🧘" },
  { to: "/play/multiplayer", title: "MULTIPLAYER", subtitle: "Sala privada com amigos", color: "bg-felt text-white", emoji: "👥" },
] as const;

function Home() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${heroBg})`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 halftone opacity-[0.04] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-8">
        <div className="mb-3 md:hidden">
          <LandscapeHint dismissible />
        </div>
        <div className="flex flex-col items-center">
          <img src={logo} alt="Incrível Poker All In" className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[300px] h-auto drop-shadow-[6px_6px_0_rgba(0,0,0,0.6)]" />
        </div>

        <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {MODES.map((m) => (
            <Link key={m.to} to={m.to} className="block group">
              <div className={`${m.color} ink-border-thick hard-shadow-lg rounded-lg p-5 md:p-6 transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 relative overflow-hidden`}>
                <div className="absolute -top-4 -right-4 text-8xl opacity-20">{m.emoji}</div>
                <div className="relative">
                  <div className="text-4xl mb-2">{m.emoji}</div>
                  <h2 className="font-display text-3xl md:text-4xl">{m.title}</h2>
                  <p className="font-body text-sm md:text-base font-semibold opacity-90">{m.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/tutorial"><ComicButton variant="secondary">📖 COMO JOGAR</ComicButton></Link>
          <Link to="/settings"><ComicButton variant="secondary">⚙️ AJUSTES</ComicButton></Link>
        </div>

        <footer className="mt-10 text-center text-white/60 font-body text-xs">
          Incrível Poker All In · Feito em estilo HQ · v1.0
        </footer>
      </div>
    </div>
  );
}
