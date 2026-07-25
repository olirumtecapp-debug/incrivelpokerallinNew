import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "md";
  className?: string;
  label?: string;
}

/** Botão HQ de doação — navega para a página /doacao com Pix. */
export function DonateButton({
  size = "sm",
  className,
  label = "APOIAR",
}: Props) {
  const sizeCls =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : "px-4 py-2 text-base";
  return (
    <Link
      to="/doacao"
      className={cn(
        "inline-flex items-center gap-2 font-display uppercase tracking-wide",
        "ink-border-thick hard-shadow bg-pow-yellow text-ink-fixed rounded",
        "hover:scale-105 active:scale-95 transition-transform",
        sizeCls,
        className,
      )}
      title="Apoie o projeto"
    >
      <span aria-hidden>❤️</span>
      <span>{label}</span>
    </Link>
  );
}
