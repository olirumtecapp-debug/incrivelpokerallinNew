import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ComicButton } from "@/components/comic/ComicButton";
import { VARIANT_LIST, type VariantId } from "@/lib/poker/variants";
import { createRoom, joinRoom } from "@/lib/rooms.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/play/multiplayer")({
  head: () => ({
    meta: [
      { title: "Multiplayer — Incrível Poker All In" },
      { name: "description", content: "Crie uma sala privada e convide amigos pra jogar online." },
      { property: "og:title", content: "Multiplayer · Incrível Poker" },
      { property: "og:description", content: "Sala privada, código pra compartilhar." },
    ],
  }),
  component: Lobby,
});

function Lobby() {
  const navigate = useNavigate();
  const create = useServerFn(createRoom);
  const join = useServerFn(joinRoom);
  const [variant, setVariant] = useState<VariantId>("holdem");
  const [smallBlind, setSmallBlind] = useState(10);
  const [bigBlind, setBigBlind] = useState(20);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function handleCreate() {
    setBusy(true);
    try {
      const { code } = await create({ data: { variant, smallBlind, bigBlind, startStack: 1000, maxPlayers } });
      navigate({ to: "/play/multiplayer/$code", params: { code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falhou");
    } finally { setBusy(false); }
  }

  async function handleJoin() {
    setBusy(true);
    try {
      const { code } = await join({ data: { code: joinCode.toUpperCase() } });
      navigate({ to: "/play/multiplayer/$code", params: { code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falhou");
    } finally { setBusy(false); }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="ink-border-thick bg-felt text-white p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl text-white shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl truncate flex-1">👥 MULTIPLAYER</h1>
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="opacity-80">{email}</span>
          <button onClick={signOut} className="ink-border bg-pow-red text-white px-2 py-1 text-xs font-display">SAIR</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <section className="ink-border-thick hard-shadow bg-card rounded-lg p-5">
          <h2 className="font-display text-2xl mb-4">CRIAR SALA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {VARIANT_LIST.map((v) => (
              <button key={v.id} onClick={() => setVariant(v.id)}
                className={`ink-border p-3 rounded text-left transition ${variant === v.id ? "bg-pow-yellow" : "bg-white hover:bg-muted"}`}>
                <div className="text-2xl">{v.emoji}</div>
                <div className="font-display">{v.name}</div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <label className="text-sm font-bold">
              SB
              <input type="number" min={1} max={1000} value={smallBlind}
                onChange={(e) => setSmallBlind(parseInt(e.target.value) || 10)}
                className="w-full ink-border bg-white px-2 py-1 rounded font-mono" />
            </label>
            <label className="text-sm font-bold">
              BB
              <input type="number" min={2} max={2000} value={bigBlind}
                onChange={(e) => setBigBlind(parseInt(e.target.value) || 20)}
                className="w-full ink-border bg-white px-2 py-1 rounded font-mono" />
            </label>
            <label className="text-sm font-bold">
              Máx jogadores
              <input type="number" min={2} max={6} value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value) || 4)}
                className="w-full ink-border bg-white px-2 py-1 rounded font-mono" />
            </label>
          </div>
          <ComicButton variant="primary" onClick={handleCreate} disabled={busy}>
            {busy ? "..." : "CRIAR SALA"}
          </ComicButton>
        </section>

        <section className="ink-border-thick hard-shadow bg-card rounded-lg p-5">
          <h2 className="font-display text-2xl mb-3">ENTRAR EM SALA</h2>
          <div className="flex gap-2">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="PKR-XXXX"
              className="ink-border-thick bg-white px-3 py-2 font-display text-2xl text-center flex-1 tracking-widest uppercase"
              maxLength={8}
            />
            <ComicButton variant="primary" onClick={handleJoin} disabled={busy || joinCode.length < 6}>
              ENTRAR
            </ComicButton>
          </div>
        </section>

        <div className="ink-border hard-shadow-sm bg-pow-yellow rounded p-3 text-sm">
          <b>ℹ Aviso amigável:</b> a comunicação de estado é criptografada e o servidor autoriza cada ação,
          mas por ser um jogo entre amigos as cartas dos oponentes trafegam por Realtime — jogue com quem confia.
        </div>
      </main>
    </div>
  );
}
