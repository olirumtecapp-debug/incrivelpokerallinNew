import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "light" | "dark";

function readMode(): Mode {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("ip_mode");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyMode(mode: Mode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const m = readMode();
    setMode(m);
    applyMode(m);
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyMode(next);
    try { localStorage.setItem("ip_mode", next); } catch { /* ignore */ }
  }

  return (
    <button
      onClick={toggle}
      aria-label={mode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className={cn(
        "ink-border-thick hard-shadow-sm font-display tracking-wide px-3 py-2 text-sm transition-all",
        "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        mode === "dark" ? "bg-pow-yellow text-ink-fixed" : "bg-ink text-paper",
        className,
      )}
    >
      {mode === "dark" ? "☀ CLARO" : "☾ ESCURO"}
    </button>
  );
}
