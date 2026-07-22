// Identidade local de convidado para multiplayer sem login.
const GUEST_ID_KEY = "ipa_guest_id";
const GUEST_NAME_KEY = "ipa_guest_name";
const GUEST_EMOJI_KEY = "ipa_guest_emoji";

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

export function getGuestEmoji(): string {
  if (typeof window === "undefined") return "🎭";
  return window.localStorage.getItem(GUEST_EMOJI_KEY) ?? "🎭";
}

export function setGuestEmoji(emoji: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_EMOJI_KEY, emoji.slice(0, 4));
}

export const EMOJI_CHOICES = ["🎭", "🃏", "🤠", "🦁", "🐺", "🦊", "🐼", "🐸", "🦄", "👑", "🧙", "🥷"];
