// Catálogo HQ dos avatares de identidade do multiplayer.
import shark from "@/assets/avatars/shark.png.asset.json";
import queen from "@/assets/avatars/queen.png.asset.json";
import cowboy from "@/assets/avatars/cowboy.png.asset.json";
import detective from "@/assets/avatars/detective.png.asset.json";
import mage from "@/assets/avatars/mage.png.asset.json";
import hacker from "@/assets/avatars/hacker.png.asset.json";
import boss from "@/assets/avatars/boss.png.asset.json";
import rocker from "@/assets/avatars/rocker.png.asset.json";
import robot from "@/assets/avatars/robot.png.asset.json";
import pirate from "@/assets/avatars/pirate.png.asset.json";
import ninja from "@/assets/avatars/ninja.png.asset.json";
import clown from "@/assets/avatars/clown.png.asset.json";

export type AvatarId =
  | "shark" | "queen" | "cowboy" | "detective"
  | "mage" | "hacker" | "boss" | "rocker"
  | "robot" | "pirate" | "ninja" | "clown";

export interface Avatar {
  id: AvatarId;
  name: string;
  url: string;
  accent: string; // cor de destaque hex-ish (tailwind bg)
}

export const AVATARS: Avatar[] = [
  { id: "shark",     name: "O Tubarão",  url: shark.url,     accent: "bg-slate-800" },
  { id: "queen",     name: "A Rainha",   url: queen.url,     accent: "bg-pow-yellow" },
  { id: "cowboy",    name: "O Cowboy",   url: cowboy.url,    accent: "bg-amber-700" },
  { id: "detective", name: "O Detetive", url: detective.url, accent: "bg-slate-500" },
  { id: "mage",      name: "O Mago",     url: mage.url,      accent: "bg-purple-700" },
  { id: "hacker",    name: "A Hacker",   url: hacker.url,    accent: "bg-emerald-500" },
  { id: "boss",      name: "O Chefe",    url: boss.url,      accent: "bg-pow-red" },
  { id: "rocker",    name: "O Rocker",   url: rocker.url,    accent: "bg-orange-500" },
  { id: "robot",     name: "O Robô",     url: robot.url,     accent: "bg-zinc-400" },
  { id: "pirate",    name: "O Pirata",   url: pirate.url,    accent: "bg-teal-600" },
  { id: "ninja",     name: "A Ninja",    url: ninja.url,     accent: "bg-neutral-900" },
  { id: "clown",     name: "O Palhaço",  url: clown.url,     accent: "bg-pink-500" },
];

const AVATAR_MAP: Record<string, Avatar> = Object.fromEntries(
  AVATARS.map((a) => [a.id, a]),
);

export const DEFAULT_AVATAR_ID: AvatarId = "shark";

export function getAvatar(id: string | null | undefined): Avatar {
  if (id && AVATAR_MAP[id]) return AVATAR_MAP[id];
  return AVATAR_MAP[DEFAULT_AVATAR_ID];
}

export function isAvatarId(id: string | null | undefined): id is AvatarId {
  return !!id && !!AVATAR_MAP[id];
}

export function randomAvatarId(): AvatarId {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)].id;
}
