
-- 1) profiles: restringir leitura ao próprio dono
DROP POLICY IF EXISTS "Profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Profiles readable by owner"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
REVOKE SELECT ON public.profiles FROM anon;

-- 2) game_actions: negar explicitamente mutações vindas do cliente
CREATE POLICY "game_actions deny client insert" ON public.game_actions
  FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "game_actions deny client update" ON public.game_actions
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "game_actions deny client delete" ON public.game_actions
  FOR DELETE TO anon, authenticated USING (false);

-- 3) game_states: mesma proteção de integridade
CREATE POLICY "game_states deny client insert" ON public.game_states
  FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "game_states deny client update" ON public.game_states
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "game_states deny client delete" ON public.game_states
  FOR DELETE TO anon, authenticated USING (false);

-- 4) room_players: negar mutações do cliente + esconder user_id
CREATE POLICY "room_players deny client insert" ON public.room_players
  FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "room_players deny client update" ON public.room_players
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "room_players deny client delete" ON public.room_players
  FOR DELETE TO anon, authenticated USING (false);
REVOKE SELECT (user_id) ON public.room_players FROM anon, authenticated;

-- 5) rooms: negar mutações do cliente + esconder identidade dos criadores
CREATE POLICY "rooms deny client insert" ON public.rooms
  FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "rooms deny client update" ON public.rooms
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "rooms deny client delete" ON public.rooms
  FOR DELETE TO anon, authenticated USING (false);
REVOKE SELECT (created_by, created_by_guest) ON public.rooms FROM anon, authenticated;
