import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ComicButton } from "@/components/comic/ComicButton";
import { VARIANT_LIST } from "@/lib/poker/variants";
import { sfx } from "@/lib/audio/sfx";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Ajustes — Incrível Poker All In" },
      { name: "description", content: "Personalize tema da mesa, som e modalidades preferidas." },
      { property: "og:title", content: "Ajustes · Incrível Poker" },
      { property: "og:description", content: "Escolha o tema da mesa e outras preferências." },
    ],
  }),
  component: Settings,
});

const THEMES = [
  { id: "hq", name: "Clássica HQ", cls: "", swatch: "bg-pow-yellow", desc: "O visual pop art padrão." },
  { id: "neon", name: "Neon Noturna", cls: "theme-neon", swatch: "bg-purple-500", desc: "Cores fluorescentes de cassino noturno." },
  { id: "minimal", name: "Minimalista", cls: "theme-minimal", swatch: "bg-gray-200", desc: "Tudo mais limpo e direto." },
] as const;

function Settings() {
  const [theme, setTheme] = useState<string>("hq");
  const [sfxOn, setSfxOn] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(40);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("ip_theme") : null;
    if (saved) setTheme(saved);
    setSfxOn(sfx.getEnabled());
    setVolume(Math.round(sfx.getVolume() * 100));
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.remove("theme-neon", "theme-minimal");
    const t = THEMES.find((x) => x.id === theme);
    if (t && t.cls) document.documentElement.classList.add(t.cls);
    localStorage.setItem("ip_theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background">
      <header className="ink-border-thick bg-pow-blue p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl text-white shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl text-white truncate">⚙️ AJUSTES</h1>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-8">
        <section>
          <h2 className="font-display text-2xl mb-3">TEMA DA MESA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { sfx.unlock(); sfx.play("click"); setTheme(t.id); }}
                className={`ink-border-thick hard-shadow-sm rounded-lg p-4 text-left transition-transform hover:-translate-y-1 ${theme === t.id ? "bg-pow-yellow" : "bg-card"}`}
              >
                <div className={`w-full h-16 ${t.swatch} ink-border rounded mb-3`} />
                <div className="font-display text-lg">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.desc}</div>
                {theme === t.id && <div className="mt-2 font-display text-sm text-pow-red">✓ ATIVO</div>}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl mb-3">SOM</h2>
          <div className="ink-border-thick hard-shadow-sm bg-card p-4 rounded-lg space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sfxOn}
                onChange={(e) => { sfx.unlock(); setSfxOn(e.target.checked); sfx.setEnabled(e.target.checked); if (e.target.checked) sfx.play("chipDrop"); }}
                className="w-5 h-5"
              />
              <span className="font-display text-lg">Efeitos sonoros</span>
            </label>
            <div>
              <div className="flex justify-between font-body text-sm font-bold mb-1">
                <span>Volume</span>
                <span className="text-pow-red">{volume}%</span>
              </div>
              <input
                type="range" min={0} max={100} step={5}
                value={volume}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setVolume(v); sfx.setVolume(v / 100);
                }}
                onMouseUp={() => { sfx.unlock(); sfx.play("chipDrop"); }}
                onTouchEnd={() => { sfx.unlock(); sfx.play("chipDrop"); }}
                className="w-full"
                disabled={!sfxOn}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl mb-3">MODALIDADES DISPONÍVEIS</h2>
          <div className="space-y-2">
            {VARIANT_LIST.map((v) => (
              <div key={v.id} className="ink-border hard-shadow-sm bg-card p-3 rounded flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{v.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-display text-lg">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.description}</div>
                  </div>
                </div>
                <span className="font-display text-pow-red text-sm shrink-0">✓ ATIVA</span>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-4">
          <Link to="/"><ComicButton variant="primary">VOLTAR AO MENU</ComicButton></Link>
        </div>
      </main>
    </div>
  );
}
