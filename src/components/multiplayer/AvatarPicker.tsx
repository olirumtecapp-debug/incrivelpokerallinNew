import { AVATARS, type AvatarId } from "@/lib/avatars";
import { cn } from "@/lib/utils";

interface Props {
  value: AvatarId;
  onChange: (id: AvatarId) => void;
  className?: string;
}

/** Grade HQ 3x4 de avatares selecionáveis. */
export function AvatarPicker({ value, onChange, className }: Props) {
  return (
    <div className={cn("grid grid-cols-4 sm:grid-cols-6 gap-2", className)}>
      {AVATARS.map((a) => {
        const selected = a.id === value;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onChange(a.id)}
            title={a.name}
            aria-label={a.name}
            aria-pressed={selected}
            className={cn(
              "ink-border rounded-lg overflow-hidden aspect-square bg-white text-ink-fixed transition-transform",
              "hover:scale-105 hover:hard-shadow-sm",
              selected && "ink-border-thick hard-shadow bg-pow-yellow text-ink-fixed scale-105",
            )}
          >
            <img
              src={a.url}
              alt={a.name}
              width={128}
              height={128}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}

/** Avatar circular pequeno para uso em listas / assentos. */
export function AvatarBadge({
  avatarId,
  size = 40,
  className,
}: {
  avatarId: string | null | undefined;
  size?: number;
  className?: string;
}) {
  const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
  const fallback = !AVATARS.some((a) => a.id === avatarId);
  return (
    <div
      className={cn(
        "ink-border shrink-0 rounded-full overflow-hidden bg-white text-ink-fixed grid place-items-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {fallback ? (
        <span className="font-display text-xs">?</span>
      ) : (
        <img
          src={avatar.url}
          alt={avatar.name}
          width={size}
          height={size}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
