import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getRoomView, submitAction, startRoomHand, nextRoomHand, leaveRoom, toggleReady, joinRoom, getRoomByCode, getRoomLobby } from "@/lib/rooms.functions";
import { MAX_ROOM_PLAYERS, type SubmitActionInput } from "@/lib/rooms.shared";

import type { GameState } from "@/lib/poker/engine";
import { getVariant } from "@/lib/poker/variants";
import { PlayerSeat } from "@/components/poker/PlayerSeat";
import { PlayingCard } from "@/components/poker/PlayingCard";
import { ActionPanel } from "@/components/poker/ActionPanel";
import { ImpactText } from "@/components/comic/ImpactText";
import { ComicButton } from "@/components/comic/ComicButton";
import { LandscapeHint } from "@/components/comic/LandscapeHint";
import { toast } from "sonner";
import { sfx } from "@/lib/audio/sfx";
import { getGuestId, getGuestName, getGuestAvatarId, setGuestName, setGuestAvatarId } from "@/lib/guest";
import { AvatarPicker, AvatarBadge } from "@/components/multiplayer/AvatarPicker";
import { DEFAULT_AVATAR_ID, type AvatarId } from "@/lib/avatars";

export const Route = createFileRoute("/play/multiplayer/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Sala ${params.code} — Incrível Poker` },
      { name: "description", content: "Sala privada de poker online, sem cadastro." },
      { property: "og:title", content: `Sala ${params.code}` },
      { property: "og:description", content: "Entre na sala com o código." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Room,
});

interface RoomRow {
  id: string;
  code: string;
  status: string;
  small_blind: number;
  big_blind: number;
  variant: string;
  max_players: number;
}
interface RoomPlayerRow {
  id: string; guest_id: string | null; display_name: string;
  avatar_emoji: string; seat: number; stack: number; is_ready: boolean; joined_at: string;
  is_host: boolean; is_self: boolean;
}

function Room() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [players, setPlayers] = useState<RoomPlayerRow[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myGuestId, setMyGuestId] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [full, setFull] = useState(false);
  const [needName, setNeedName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [avatarInput, setAvatarInput] = useState<AvatarId>(DEFAULT_AVATAR_ID);

  const fnGetView = useServerFn(getRoomView);
  const fnSubmit = useServerFn(submitAction);
  const fnStart = useServerFn(startRoomHand);
  const fnNext = useServerFn(nextRoomHand);
  const fnLeave = useServerFn(leaveRoom);
  const fnReady = useServerFn(toggleReady);
  const fnJoin = useServerFn(joinRoom);
  const fnRoomByCode = useServerFn(getRoomByCode);
  const fnLobby = useServerFn(getRoomLobby);

  const lastActionRef = useRef<string>("");

  const fetchState = useCallback(async (roomId: string, guestId: string) => {
    try {
      const { state } = await fnGetView({ data: { roomId, guestId } });
      if (state) {
        setGameState((prev) => {
          const s = state as GameState;
          // Detect and play sfx on state transitions
          const key = `${s.handNumber}:${s.street}:${s.actionIdx}:${s.pot}`;
          if (lastActionRef.current && lastActionRef.current !== key) {
            if (prev && s.handNumber !== prev.handNumber) sfx.play("cardDeal");
            else if (prev && s.pot > prev.pot) sfx.play("chipDrop");
          }
          lastActionRef.current = key;
          return s;
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [fnGetView]);

  const fetchLobby = useCallback(async (roomId: string, guestId: string) => {
    try {
      const { room: r, players: pls } = await fnLobby({ data: { roomId, guestId } });
      if (r) setRoom(r as RoomRow);
      setPlayers(pls as RoomPlayerRow[]);
      const me = pls.find((p) => p.is_self);
      if (me) setReady(me.is_ready);
    } catch (e) {
      console.error(e);
    }
  }, [fnLobby]);

  // Bootstrap
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const guestId = getGuestId();
      setMyGuestId(guestId);
      sfx.unlock();

      const { room: r } = await fnRoomByCode({ data: { code } });
      if (!r) { toast.error("Sala não encontrada"); navigate({ to: "/play/multiplayer" }); return; }
      if (cancelled) return;
      setRoom(r as RoomRow);

      // Check membership via lobby fetch
      const lobby = await fnLobby({ data: { roomId: r.id, guestId } });
      if (cancelled) return;

      if (!lobby.isMember) {
        const savedName = getGuestName();
        if (!savedName) {
          setAvatarInput(getGuestAvatarId());
          setNeedName(true);
          return;
        }
        try {
          await fnJoin({ data: { code: r.code, guestId, displayName: savedName, avatarEmoji: getGuestAvatarId() } });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Falhou";
          if (msg.toLowerCase().includes("cheia")) { setFull(true); return; }
          toast.error(msg);
          navigate({ to: "/play/multiplayer" });
          return;
        }
      }

      await fetchLobby(r.id, guestId);
      await fetchState(r.id, guestId);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Polling (Realtime canais respeitam RLS — usamos polling curto)
  useEffect(() => {
    if (!room || !myGuestId) return;
    const roomId = room.id;
    const iv = window.setInterval(() => {
      void fetchLobby(roomId, myGuestId);
      void fetchState(roomId, myGuestId);
    }, 1500);
    return () => { window.clearInterval(iv); };
  }, [room, myGuestId, fetchLobby, fetchState]);

  async function submitNameAndJoin() {
    const trimmed = nameInput.trim();
    if (trimmed.length < 2) { toast.error("Apelido muito curto"); return; }
    if (!room) return;
    setGuestName(trimmed);
    setGuestAvatarId(avatarInput);
    try {
      await fnJoin({ data: { code: room.code, guestId: myGuestId, displayName: trimmed, avatarEmoji: avatarInput } });
      setNeedName(false);
      await fetchLobby(room.id, myGuestId);
      await fetchState(room.id, myGuestId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falhou";
      if (msg.toLowerCase().includes("cheia")) { setFull(true); return; }
      toast.error(msg);
    }
  }

  async function handleReady() {
    if (!room) return;
    const next = !ready;
    setReady(next);
    try { await fnReady({ data: { roomId: room.id, guestId: myGuestId, ready: next } }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Falhou"); setReady(!next); }
  }

  async function handleStart() {
    if (!room) return;
    setBusy(true);
    try { await fnStart({ data: { roomId: room.id, guestId: myGuestId } }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Falhou"); }
    finally { setBusy(false); }
  }

  async function handleNext() {
    if (!room) return;
    setBusy(true);
    try { await fnNext({ data: { roomId: room.id, guestId: myGuestId } }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Falhou"); }
    finally { setBusy(false); }
  }

  async function handleLeave() {
    if (!room) return;
    await fnLeave({ data: { roomId: room.id, guestId: myGuestId } });
    navigate({ to: "/play/multiplayer" });
  }

  async function handleAction(action: SubmitActionInput) {
    if (!room) return;
    try { await fnSubmit({ data: { roomId: room.id, guestId: myGuestId, action } }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Ação inválida"); }
  }

  if (full) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="font-display text-4xl text-pow-red">SALA CHEIA</div>
        <p className="text-muted-foreground">Esta sala já atingiu o limite de {MAX_ROOM_PLAYERS} jogadores.</p>
        <Link to="/play/multiplayer"><ComicButton variant="primary">VOLTAR AO LOBBY</ComicButton></Link>
      </div>
    );
  }

  if (needName) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="ink-border-thick hard-shadow bg-card rounded-lg p-6 max-w-md w-full space-y-4">
          <h2 className="font-display text-2xl text-center">ENTRAR NA SALA {code}</h2>
          <div className="flex gap-3 items-center">
            <AvatarBadge avatarId={avatarInput} size={56} />
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Seu apelido"
              maxLength={20}
              className="ink-border-thick bg-white text-ink-fixed px-3 py-2 font-display text-xl flex-1"
            />
          </div>
          <div className="text-xs font-bold uppercase tracking-wide">Escolha seu personagem</div>
          <AvatarPicker value={avatarInput} onChange={setAvatarInput} />
          <ComicButton variant="primary" onClick={submitNameAndJoin}>ENTRAR</ComicButton>
        </div>
      </div>
    );
  }

  if (!room) return <div className="min-h-screen flex items-center justify-center font-display text-2xl">carregando sala...</div>;

  // Host vem do server (is_host); "isCreator" é quando o próprio jogador é host
  const hostPlayer = players.find((p) => p.is_host);
  const isCreator = players.some((p) => p.is_host && p.is_self);
  const readyCount = players.filter((p) => p.is_ready).length;
  const canStart = isCreator && players.length >= 2 && readyCount === players.length;

  // Lobby view
  if (!gameState) {
    return (
      <div className="min-h-screen bg-background">
        <header className="ink-border-thick bg-felt text-white p-4 flex items-center gap-3">
          <Link to="/play/multiplayer" className="font-display text-xl text-white shrink-0">← LOBBY</Link>
          <h1 className="font-display text-2xl md:text-3xl truncate flex-1">SALA {room.code}</h1>
          <button onClick={handleLeave} className="ink-border bg-pow-red text-white px-3 py-1 text-sm font-display">SAIR</button>
        </header>
        <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
          <div className="ink-border-thick hard-shadow bg-card rounded-lg p-5">
            <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
              <h2 className="font-display text-xl flex items-center gap-2">
                JOGADORES ({players.length}/{Math.min(room.max_players, MAX_ROOM_PLAYERS)})
                {players.length >= Math.min(room.max_players, MAX_ROOM_PLAYERS) && (
                  <span className="ink-border bg-pow-red text-white text-xs px-2 py-0.5 font-display">CHEIA</span>
                )}
              </h2>
              <div className="text-sm font-bold">{getVariant(room.variant as never).name} · SB {room.small_blind} / BB {room.big_blind}</div>
            </div>

            <ul className="space-y-2">
              {players.map((p) => (
                <li key={p.id} className="ink-border bg-white text-ink-fixed p-2 rounded flex items-center gap-3">
                  <AvatarBadge avatarId={p.avatar_emoji} size={40} />
                  <span className="font-display flex-1 truncate">{p.display_name}</span>
                  {p.is_host && <span className="text-xs ink-border bg-pow-yellow text-ink-fixed px-2 py-0.5 font-display">HOST</span>}
                  <span className={`text-xs font-display px-2 py-0.5 ink-border ${p.is_ready ? "bg-pow-yellow text-ink-fixed" : "bg-muted"}`}>
                    {p.is_ready ? "PRONTO" : "aguardando"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ink-border-thick hard-shadow bg-card rounded-lg p-5">
            <div className="text-center">
              <div className="halftone-yellow ink-border-thick hard-shadow-sm p-4 inline-block mb-3">
                <div className="text-sm font-bold">CÓDIGO</div>
                <div className="font-display text-4xl tracking-widest">{room.code}</div>
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  onClick={() => { navigator.clipboard?.writeText(room.code); toast.success("Código copiado!"); }}
                  className="ink-border bg-white text-ink-fixed px-3 py-1 font-display text-sm hover:bg-pow-yellow hover:text-ink-fixed"
                >📋 CÓDIGO</button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/play/multiplayer/${room.code}`;
                    navigator.clipboard?.writeText(url);
                    toast.success("Link copiado!");
                  }}
                  className="ink-border bg-white text-ink-fixed px-3 py-1 font-display text-sm hover:bg-pow-yellow hover:text-ink-fixed"
                >🔗 LINK</button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <ComicButton variant={ready ? "secondary" : "primary"} onClick={handleReady}>
              {ready ? "DESMARCAR" : "PRONTO!"}
            </ComicButton>
            {isCreator && (
              <ComicButton variant="allin" onClick={handleStart} disabled={!canStart || busy}>
                INICIAR PARTIDA
              </ComicButton>
            )}
          </div>
          {isCreator && !canStart && (
            <p className="text-center text-sm text-muted-foreground">
              Aguardando todos ficarem prontos (mínimo 2 jogadores).
            </p>
          )}
        </main>
      </div>
    );
  }

  // Game view
  const v = getVariant(gameState.variant);
  const me = gameState.players.find((p) => p.id === myGuestId);
  const others = gameState.players.filter((p) => p.id !== myGuestId);
  const meIdx = gameState.players.findIndex((p) => p.id === myGuestId);
  const isMyTurn = meIdx === gameState.actionIdx && !gameState.awaitingAdvance && me && !me.folded && !me.allIn;
  const winnerIds = new Set(gameState.winners.map((w) => w.playerId));

  return (
    <div className="relative min-h-[100dvh] landscape-short:h-[100dvh] landscape-short:overflow-hidden overflow-y-auto flex flex-col">
      <LandscapeHint blocking />
      <ImpactText text={gameState.lastImpact?.text} ts={gameState.lastImpact?.ts} />
      <header className="shrink-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-1.5 md:py-2 landscape-short:py-0.5 landscape-short:px-2 ink-border-thick bg-card">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/play/multiplayer" className="font-display text-base md:text-lg landscape-short:text-xs text-pow-red hover:text-ink-fixed shrink-0">← LOBBY</Link>
          <span className="truncate font-display text-sm md:text-base landscape-short:text-xs">SALA {room.code}</span>
          <span className="hidden md:inline landscape-short:!hidden ink-border bg-pow-yellow text-ink-fixed px-2 py-0.5 text-xs font-display">{v.short}</span>
        </div>
        <div className="font-body text-xs md:text-sm landscape-short:text-[10px] font-bold">Mão #{gameState.handNumber}</div>
      </header>

      <div className="flex-1 min-h-0 relative grid grid-rows-[auto_1fr_auto] items-center justify-items-center gap-1 md:gap-2 landscape-short:gap-0 px-2 py-1 md:px-4 md:py-2 landscape-short:px-1 landscape-short:py-0"
           style={{ background: "radial-gradient(ellipse at center, var(--color-felt) 0%, var(--color-felt-dark) 100%)" }}>

        <div className="flex flex-wrap gap-1.5 md:gap-3 landscape-short:gap-1 justify-center pt-1 landscape-short:pt-0">
          {others.map((p) => {
            const idx = gameState.players.findIndex((x) => x.id === p.id);
            const pr = players.find((rp) => rp.guest_id === p.id);
            return (
              <PlayerSeat
                key={p.id}
                player={p}
                isActive={gameState.actionIdx === idx && !gameState.awaitingAdvance}
                isDealer={gameState.dealerIdx === idx}
                reveal={gameState.street === "showdown"}
                isWinner={winnerIds.has(p.id)}
                holeCount={v.holeCards}
                avatarId={pr?.avatar_emoji}
              />
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1 md:gap-2 landscape-short:gap-0.5 w-full max-w-4xl">
          <div className="ink-border-thick hard-shadow bg-paper/90 rounded-full px-3 py-0.5 md:px-5 md:py-1.5 landscape-short:px-2 landscape-short:py-0">
            <div className="font-display text-base md:text-2xl landscape-short:text-xs text-pow-red text-center leading-tight">
              POT: {gameState.pot.toLocaleString("pt-BR")}
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="flex gap-1 md:gap-2 landscape-short:gap-0.5 items-center justify-center flex-nowrap min-w-max mx-auto px-1">
              {[0, 1, 2, 3, 4].map((i) => {
                const c = gameState.community[i];
                if (!c) return <div key={i} className="shrink-0 w-10 h-14 sm:w-14 sm:h-20 md:w-16 md:h-24 lg:w-20 lg:h-28 landscape-short:w-8 landscape-short:h-11 rounded-md border-2 border-dashed border-white/30" />;
                return <PlayingCard key={i} card={c} size="md" dealDelay={i * 60} />;
              })}
            </div>
          </div>
        </div>

        {me && (
          <div className="pb-1 landscape-short:pb-0 min-h-[140px] md:min-h-[170px] landscape-short:min-h-0 flex items-end">
            <PlayerSeat
              player={me}
              isActive={meIdx === gameState.actionIdx && !gameState.awaitingAdvance}
              isDealer={gameState.dealerIdx === meIdx}
              reveal={gameState.street === "showdown"}
              isWinner={winnerIds.has(me.id)}
              holeCount={v.holeCards}
              isMe
              avatarId={players.find((rp) => rp.guest_id === myGuestId)?.avatar_emoji}
            />
          </div>
        )}
      </div>


      <div className="shrink-0 relative z-10 bg-background p-2 md:p-3 short:py-1.5 landscape-short:p-1">

        {gameState.awaitingAdvance ? (
          <div className="ink-border-thick hard-shadow bg-card rounded-lg p-2 md:p-3 flex flex-col items-center gap-1 max-w-3xl mx-auto">
            {gameState.winners.map((w, i) => {
              const p = gameState.players.find((pl) => pl.id === w.playerId)!;
              return (
                <div key={i} className="font-display text-base md:text-xl text-center">
                  {p.name} ganhou <span className="text-pow-red">{w.amount}</span>
                  {w.handName && <span className="text-muted-foreground text-xs md:text-base"> — {w.handName}</span>}
                </div>
              );
            })}
            {isCreator ? (
              <ComicButton variant="primary" size="sm" onClick={handleNext} disabled={busy}>PRÓXIMA MÃO</ComicButton>
            ) : (
              <div className="text-xs md:text-sm text-muted-foreground">Aguardando o host iniciar a próxima mão...</div>
            )}
          </div>
        ) : me ? (
          <ActionPanel state={gameState} onAction={handleAction} disabled={!isMyTurn} />
        ) : null}
      </div>
    </div>
  );
}
