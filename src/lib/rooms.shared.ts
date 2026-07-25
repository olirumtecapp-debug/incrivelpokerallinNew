import { z } from "zod";

export const MAX_ROOM_PLAYERS = 6;

export const nameSchema = z.string().trim().min(2).max(20);
export const guestSchema = z.string().min(8).max(64);

export const actionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("fold") }),
  z.object({ type: z.literal("check") }),
  z.object({ type: z.literal("call") }),
  z.object({ type: z.literal("raise"), amount: z.number().int().min(1) }),
  z.object({ type: z.literal("allin") }),
]);
export type SubmitActionInput = z.infer<typeof actionSchema>;
