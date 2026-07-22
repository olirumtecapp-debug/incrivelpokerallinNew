import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ComicButton } from "@/components/comic/ComicButton";

export const Route = createFileRoute("/play/multiplayer")({
  head: () => ({
    meta: [
      { title: "Multiplayer — Sala Privada" },
      { name: "description", content: "Crie uma sala privada e convide amigos para jogar." },
      { property: "og:title", content: "Multiplayer · Incrível Poker" },
      { property: "og:description", content: "Sala privada com código." },
    ],
  }),
  component: MultiplayerPage,
});

function generateCode() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `PKR-${n}`;
}

function MultiplayerPage() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <header className="ink-border-thick bg-felt text-white p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl text-white shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl truncate">👥 MULTIPLAYER</h1>
      </header>
      <main className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        <div className="ink-border-thick hard-shadow bg-card rounded-lg p-5">
          <h2 className="font-display text-2xl mb-3">CRIAR SALA PRIVADA</h2>
          {roomCode ? (
            <>
              <div className="halftone-yellow ink-border-thick hard-shadow-sm p-6 text-center">
                <div className="text-sm font-bold">SEU CÓDIGO</div>
                <div className="font-display text-5xl text-ink my-2 tracking-widest">{roomCode}</div>
                <div className="text-xs text-muted-foreground">Compartilhe com seus amigos</div>
              </div>
              <div className="mt-3 flex gap-2 justify-center">
                <ComicButton size="sm" variant="secondary" onClick={() => navigator.clipboard?.writeText(roomCode)}>
                  📋 COPIAR
                </ComicButton>
                <ComicButton size="sm" variant="danger" onClick={() => setRoomCode(null)}>FECHAR</ComicButton>
              </div>
              <div className="mt-4 ink-border bg-muted p-3 rounded text-sm">
                <b>⚡ Aguardando jogadores...</b> A sincronização online completa chega na próxima atualização.
                Por enquanto, use o modo Casual pra jogar contra a IA.
              </div>
            </>
          ) : (
            <ComicButton variant="primary" onClick={() => setRoomCode(generateCode())}>
              GERAR CÓDIGO DA SALA
            </ComicButton>
          )}
        </div>

        <div className="ink-border-thick hard-shadow bg-card rounded-lg p-5">
          <h2 className="font-display text-2xl mb-3">ENTRAR EM UMA SALA</h2>
          <div className="flex gap-2">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="PKR-0000"
              className="ink-border-thick bg-white px-3 py-2 font-display text-2xl text-center flex-1 tracking-widest uppercase"
              maxLength={8}
            />
            <ComicButton variant="primary" disabled={joinCode.length < 6}>
              ENTRAR
            </ComicButton>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Digite o código que seu amigo compartilhou.
          </div>
        </div>

        <div className="ink-border-thick hard-shadow bg-pow-yellow rounded-lg p-4">
          <div className="font-display text-lg">🚧 EM CONSTRUÇÃO</div>
          <div className="text-sm">
            A infra multiplayer online real (sincronização em tempo real entre jogadores) será ativada
            na próxima onda. A UI de sala já está pronta. Enquanto isso, jogue no <Link to="/play/casual" className="underline font-bold">Modo Casual</Link>.
          </div>
        </div>
      </main>
    </div>
  );
}
