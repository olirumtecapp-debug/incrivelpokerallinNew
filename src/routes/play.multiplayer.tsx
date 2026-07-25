import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ComicButton } from "@/components/comic/ComicButton";
import { VARIANT_LIST, type VariantId } from "@/lib/poker/variants";
import { createRoom, joinRoom, MAX_ROOM_PLAYERS } from "@/lib/rooms.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getGuestId, getGuestName, setGuestName, getGuestAvatarId, setGuestAvatarId } from "@/lib/guest";
import { AvatarPicker, AvatarBadge } from "@/components/multiplayer/AvatarPicker";
import { DEFAULT_AVATAR_ID, getAvatar, type AvatarId } from "@/lib/avatars";

export const Route = createFileRoute("/play/multiplayer")({
  head: () => ({
    meta: [
      { title: "Multiplayer — Incrível Poker All In" },
      { name: "description", content: "Crie uma sala privada e convide amigos pra jogar poker online, sem cadastro." },
      { property: "og:title", content: "Multiplayer · Incrível Poker" },
      { property: "og:description", content: "Sala privada, código pra compartilhar. Sem login." },
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
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [isMobile, setIsMobile] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState<AvatarId>(DEFAULT_AVATAR_ID);

  useEffect(() => {
    setName(getGuestName());
    setAvatarId(getGuestAvatarId());
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      const mob = mq.matches;
      setIsMobile(mob);
      setMaxPlayers((prev) => (mob ? Math.min(prev, 4) : prev));
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const currentAvatar = getAvatar(avatarId);

  function persistIdentity(): { ok: boolean; guestId: string; displayName: string } {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error("Digite um apelido de pelo menos 2 caracteres");
      return { ok: false, guestId: "", displayName: "" };
    }
    setGuestName(trimmed);
    setGuestAvatarId(avatarId);
    return { ok: true, guestId: getGuestId(), displayName: trimmed.slice(0, 20) };
  }

  async function handleCreate() {
    const id = persistIdentity();
    if (!id.ok) return;
    setBusy(true);
    try {
      const { code } = await create({
        data: {
          guestId: id.guestId,
          displayName: id.displayName,
          avatarEmoji: avatarId,
          variant, smallBlind, bigBlind, startStack: 1000, maxPlayers,
        },
      });
      toast.success(`Sala criada! Código ${code}`);
      navigate({ to: "/play/multiplayer/$code", params: { code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falhou");
    } finally { setBusy(false); }
  }

  async function handleJoin() {
    const id = persistIdentity();
    if (!id.ok) return;
    setBusy(true);
    try {
      const { code } = await join({
        data: {
          code: joinCode.toUpperCase(),
          guestId: id.guestId,
          displayName: id.displayName,
          avatarEmoji: avatarId,
        },
      });
      navigate({ to: "/play/multiplayer/$code", params: { code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falhou");
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="ink-border-thick bg-felt text-white p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl text-white shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl truncate flex-1">👥 MULTIPLAYER</h1>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <section className="ink-border-thick hard-shadow bg-card rounded-lg p-5">
          <h2 className="font-display text-2xl mb-3">SUA IDENTIDADE</h2>
          <div className="flex gap-3 items-center mb-4">
            <AvatarBadge avatarId={avatarId} size={64} />
            <div className="flex-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como te chamam?"
                maxLength={20}
                className="w-full ink-border-thick bg-white text-ink-fixed px-3 py-2 font-display text-xl"
              />
              <div className="mt-1 text-xs text-muted-foreground font-display">
                {currentAvatar.name}
              </div>
            </div>
          </div>
          <div className="text-xs font-bold mb-2 uppercase tracking-wide">Escolha seu personagem</div>
          <AvatarPicker value={avatarId} onChange={setAvatarId} />
        </section>

        <section className="ink-border-thick hard-shadow bg-card rounded-lg p-5">
          <h2 className="font-display text-2xl mb-4">CRIAR SALA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {VARIANT_LIST.map((v) => (
              <button key={v.id} onClick={() => setVariant(v.id)}
                className={`ink-border p-3 rounded text-left transition ${variant === v.id ? "bg-pow-yellow text-ink-fixed" : "bg-white text-ink-fixed hover:bg-muted"}`}>
                <div className="text-2xl">{v.emoji}</div>
                <div className="font-display">{v.name}</div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="text-sm font-bold">
              SB
              <input type="number" min={1} max={1000} value={smallBlind}
                onChange={(e) => setSmallBlind(parseInt(e.target.value) || 10)}
                className="w-full ink-border bg-white text-ink-fixed px-2 py-1 rounded font-mono" />
            </label>
            <label className="text-sm font-bold">
              BB
              <input type="number" min={2} max={2000} value={bigBlind}
                onChange={(e) => setBigBlind(parseInt(e.target.value) || 20)}
                className="w-full ink-border bg-white text-ink-fixed px-2 py-1 rounded font-mono" />
            </label>
          </div>
          <div className="mb-4">
            <div className="text-sm font-bold mb-2">Máx jogadores</div>
            <div className="flex flex-wrap gap-2">
              {(isMobile ? [2, 3, 4] : [2, 3, 4, 5, 6]).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMaxPlayers(n)}
                  className={`ink-border px-3 py-1.5 font-display text-lg rounded ${
                    maxPlayers === n ? "bg-pow-yellow text-ink-fixed" : "bg-white text-ink-fixed hover:bg-muted"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isMobile
                ? "No celular, máximo 4 jogadores por sala pra caber tudo na tela."
                : `No desktop, até ${MAX_ROOM_PLAYERS} jogadores.`}
            </p>
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
              className="ink-border-thick bg-white text-ink-fixed px-3 py-2 font-display text-2xl text-center flex-1 tracking-widest uppercase"
              maxLength={8}
            />
            <ComicButton variant="primary" onClick={handleJoin} disabled={busy || joinCode.length < 6}>
              ENTRAR
            </ComicButton>
          </div>
        </section>

        <div className="ink-border hard-shadow-sm bg-pow-yellow text-ink-fixed rounded p-3 text-sm">
          <b>ℹ Aviso:</b> jogo entre amigos, sem cadastro. Qualquer um com o código entra na sala.
        </div>
      </main>
    </div>
  );
}
