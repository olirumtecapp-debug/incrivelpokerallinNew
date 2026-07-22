// Identidade local de convidado para multiplayer sem login.
import { isAvatarId, randomAvatarId, DEFAULT_AVATAR_ID, type AvatarId } from "./avatars";

const GUEST_ID_KEY = "ipa_guest_id";
const GUEST_NAME_KEY = "ipa_guest_name";
const GUEST_AVATAR_KEY = "ipa_guest_avatar";
// Legado: chave antiga que guardava emoji
const LEGACY_EMOJI_KEY = "ipa_guest_emoji";

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `g_${crypto.randomUUID()}`;
  }
  return `g_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function getGuestId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = makeId();
    window.localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export function getGuestName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(GUEST_NAME_KEY) ?? "";
}

export function setGuestName(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_NAME_KEY, name.trim().slice(0, 20));
}

/** Retorna o AvatarId salvo. Se for emoji legado ou inválido, gera um aleatório e persiste. */
export function getGuestAvatarId(): AvatarId {
  if (typeof window === "undefined") return DEFAULT_AVATAR_ID;
  const stored = window.localStorage.getItem(GUEST_AVATAR_KEY);
  if (isAvatarId(stored)) return stored;
  // Migração: descarta emoji antigo e sorteia um avatar HQ.
  window.localStorage.removeItem(LEGACY_EMOJI_KEY);
  const fresh = randomAvatarId();
  window.localStorage.setItem(GUEST_AVATAR_KEY, fresh);
  return fresh;
}

export function setGuestAvatarId(id: AvatarId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_AVATAR_KEY, id);
}
