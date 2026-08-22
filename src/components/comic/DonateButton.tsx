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
    
  );
}
