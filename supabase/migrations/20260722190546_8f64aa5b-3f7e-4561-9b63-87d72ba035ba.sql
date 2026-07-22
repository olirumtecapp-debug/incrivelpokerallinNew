-- Multiplayer sem login: identidade por guest_id + display_name
ALTER TABLE public.room_players
  ALTER COLUMN user_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS guest_id text,
  ADD COLUMN IF NOT EXISTS display_name text NOT NULL DEFAULT 'Jogador',
  ADD COLUMN IF NOT EXISTS avatar_emoji text NOT NULL DEFAULT '🎭';

ALTER TABLE public.rooms
  ALTER COLUMN created_by DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS created_by_guest text;

-- Índice para lookup rápido por guest
CREATE INDEX IF NOT EXISTS idx_room_players_guest ON public.room_players(room_id, guest_id);

-- Políticas RLS: permitir leitura pública (o servidor filtra via supabaseAdmin/máscara)
DROP POLICY IF EXISTS "Anyone authenticated can see rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated can create rooms" ON public.rooms;
DROP POLICY IF EXISTS "Creator can update room" ON public.rooms;
DROP POLICY IF EXISTS "Creator can delete room" ON public.rooms;

CREATE POLICY "rooms_public_read" ON public.rooms FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Members see room players" ON public.room_players;
DROP POLICY IF EXISTS "Self can join room" ON public.room_players;
DROP POLICY IF EXISTS "Self can leave room" ON public.room_players;
DROP POLICY IF EXISTS "Self can update own row" ON public.room_players;

CREATE POLICY "room_players_public_read" ON public.room_players FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Members see game state" ON public.game_states;
DROP POLICY IF EXISTS "Members write game state" ON public.game_states;
DROP POLICY IF EXISTS "Members update game state" ON public.game_states;

CREATE POLICY "game_states_public_read" ON public.game_states FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Members see actions" ON public.game_actions;
DROP POLICY IF EXISTS "Members insert actions" ON public.game_actions;

CREATE POLICY "game_actions_public_read" ON public.game_actions FOR SELECT TO anon, authenticated USING (true);

-- GRANTs para leitura pública (writes só via service_role no servidor)
GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT SELECT ON public.room_players TO anon, authenticated;
GRANT SELECT ON public.game_states TO anon, authenticated;
GRANT SELECT ON public.game_actions TO anon, authenticated;
GRANT ALL ON public.rooms TO service_role;
GRANT ALL ON public.room_players TO service_role;
GRANT ALL ON public.game_states TO service_role;
GRANT ALL ON public.game_actions TO service_role;