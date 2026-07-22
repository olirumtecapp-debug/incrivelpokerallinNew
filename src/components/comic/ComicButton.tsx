import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "allin";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-pow-yellow text-ink",
  secondary: "bg-white text-ink",
  danger: "bg-pow-red text-white",
  ghost: "bg-transparent text-ink",
  allin: "halftone-red text-white",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-lg",
  lg: "px-6 py-3 text-2xl",
};

export function ComicButton({ children, variant = "primary", size = "md", className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={cn(
        "font-display tracking-wide ink-border-thick hard-shadow-sm transition-all",
        "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        "hover:-translate-y-0.5 hover:-translate-x-0.5",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0",
        variantClass[variant], sizeClass[size], className,
      )}
    >
      {children}
    </button>
  );
}
