import { cn } from "@/lib/utils";

interface Props {
  href?: string;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}

/** Botão HQ de doação — abre link externo em nova aba. */
export function DonateButton({
  href = "https://ko-fi.com/incrivelbanana",
  size = "sm",
  className,
  label = "APOIAR",
}: Props) {
  const sizeCls =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : "px-4 py-2 text-base";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
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
    </a>
  );
}
