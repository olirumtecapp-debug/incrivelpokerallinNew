import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { ComicButton } from "@/components/comic/ComicButton";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Incrível Poker All In" },
      { name: "description", content: "Entre ou crie sua conta pra jogar Multiplayer online." },
      { property: "og:title", content: "Entrar · Incrível Poker" },
      { property: "og:description", content: "Login pra Multiplayer online." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/play/multiplayer" });
    });
  }, [navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { username: username || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Confira seu email pra confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/play/multiplayer" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falhou");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth",
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      // Token flow
      navigate({ to: "/play/multiplayer" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google falhou");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="ink-border-thick bg-pow-yellow text-ink-fixed p-4 flex items-center gap-3">
        <Link to="/" className="font-display text-xl shrink-0">← MENU</Link>
        <h1 className="font-display text-2xl md:text-3xl truncate">🔑 ENTRAR</h1>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-4 md:p-6">
        <div className="ink-border-thick hard-shadow bg-card rounded-lg p-6">
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 ink-border font-display py-2 rounded ${mode === "signin" ? "bg-pow-yellow" : "bg-white"}`}
            >ENTRAR</button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 ink-border font-display py-2 rounded ${mode === "signup" ? "bg-pow-yellow" : "bg-white"}`}
            >CRIAR CONTA</button>
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="font-body font-bold text-sm">Apelido</label>
                <input
                  type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu nick no jogo" maxLength={30}
                  className="w-full ink-border bg-white px-3 py-2 rounded font-body"
                />
              </div>
            )}
            <div>
              <label className="font-body font-bold text-sm">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email"
                className="w-full ink-border bg-white px-3 py-2 rounded font-body"
              />
            </div>
            <div>
              <label className="font-body font-bold text-sm">Senha</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full ink-border bg-white px-3 py-2 rounded font-body"
              />
            </div>
            <ComicButton type="submit" variant="primary" disabled={busy} className="w-full">
              {busy ? "..." : (mode === "signin" ? "ENTRAR" : "CRIAR CONTA")}
            </ComicButton>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-ink/20" />
            <span className="text-xs font-bold text-muted-foreground">OU</span>
            <div className="flex-1 h-px bg-ink/20" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="w-full ink-border-thick hard-shadow-sm bg-white hover:bg-pow-yellow px-4 py-3 rounded font-display text-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <span className="text-xl">🔍</span> ENTRAR COM GOOGLE
          </button>
        </div>
      </main>
    </div>
  );
}
