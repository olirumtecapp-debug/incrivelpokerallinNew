-- Remove permissive public SELECT policies from multiplayer tables.
DROP POLICY IF EXISTS "rooms_public_read" ON public.rooms;
DROP POLICY IF EXISTS "room_players_public_read" ON public.room_players;
DROP POLICY IF EXISTS "game_states_public_read" ON public.game_states;
DROP POLICY IF EXISTS "game_actions_public_read" ON public.game_actions;

-- Explicit deny for SELECT to anon/authenticated (service_role bypasses RLS entirely).
CREATE POLICY "rooms deny client select"
  ON public.rooms FOR SELECT TO anon, authenticated USING (false);

CREATE POLICY "room_players deny client select"
  ON public.room_players FOR SELECT TO anon, authenticated USING (false);

CREATE POLICY "game_states deny client select"
  ON public.game_states FOR SELECT TO anon, authenticated USING (false);

CREATE POLICY "game_actions deny client select"
  ON public.game_actions FOR SELECT TO anon, authenticated USING (false);