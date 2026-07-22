
-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_emoji TEXT NOT NULL DEFAULT '🎭',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are readable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-cria profile ao criar auth.user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_emoji)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'Jogador'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '🎭')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ ROOMS ============
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  variant TEXT NOT NULL DEFAULT 'holdem',
  small_blind INTEGER NOT NULL DEFAULT 10,
  big_blind INTEGER NOT NULL DEFAULT 20,
  start_stack INTEGER NOT NULL DEFAULT 1000,
  max_players INTEGER NOT NULL DEFAULT 6,
  status TEXT NOT NULL DEFAULT 'lobby',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rooms TO authenticated;
GRANT ALL ON public.rooms TO service_role;

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- ============ ROOM_PLAYERS ============
CREATE TABLE public.room_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seat INTEGER NOT NULL,
  stack INTEGER NOT NULL DEFAULT 1000,
  is_ready BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id),
  UNIQUE(room_id, seat)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.room_players TO authenticated;
GRANT ALL ON public.room_players TO service_role;

ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;

-- Security definer para evitar recursão em RLS
CREATE OR REPLACE FUNCTION public.is_room_member(_room_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.room_players
    WHERE room_id = _room_id AND user_id = _user_id
  );
$$;

-- ============ GAME_STATES ============
CREATE TABLE public.game_states (
  room_id UUID NOT NULL PRIMARY KEY REFERENCES public.rooms(id) ON DELETE CASCADE,
  state JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_states TO authenticated;
GRANT ALL ON public.game_states TO service_role;

ALTER TABLE public.game_states ENABLE ROW LEVEL SECURITY;

-- ============ GAME_ACTIONS ============
CREATE TABLE public.game_actions (
  id BIGSERIAL PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  hand_number INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.game_actions TO authenticated;
GRANT ALL ON public.game_actions TO service_role;

ALTER TABLE public.game_actions ENABLE ROW LEVEL SECURITY;

-- ============ POLICIES ============
-- Rooms: qualquer autenticado pode criar e ver salas (para poder entrar por código);
-- só o criador pode editar/deletar.
CREATE POLICY "Anyone authenticated can see rooms"
  ON public.rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create rooms"
  ON public.rooms FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creator can update room"
  ON public.rooms FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creator can delete room"
  ON public.rooms FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Room players: membros veem membros da mesma sala; qualquer autenticado se insere; só remove a si.
CREATE POLICY "Members see room players"
  ON public.room_players FOR SELECT TO authenticated
  USING (public.is_room_member(room_id, auth.uid()));
CREATE POLICY "Self can join room"
  ON public.room_players FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Self can update own row"
  ON public.room_players FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Self can leave room"
  ON public.room_players FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Game states: só membros veem/atualizam
CREATE POLICY "Members see game state"
  ON public.game_states FOR SELECT TO authenticated
  USING (public.is_room_member(room_id, auth.uid()));
CREATE POLICY "Members write game state"
  ON public.game_states FOR INSERT TO authenticated WITH CHECK (public.is_room_member(room_id, auth.uid()));
CREATE POLICY "Members update game state"
  ON public.game_states FOR UPDATE TO authenticated USING (public.is_room_member(room_id, auth.uid())) WITH CHECK (public.is_room_member(room_id, auth.uid()));

-- Actions: membros leem/registram
CREATE POLICY "Members see actions"
  ON public.game_actions FOR SELECT TO authenticated
  USING (public.is_room_member(room_id, auth.uid()));
CREATE POLICY "Members insert actions"
  ON public.game_actions FOR INSERT TO authenticated
  WITH CHECK (public.is_room_member(room_id, auth.uid()) AND auth.uid() = user_id);

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_states;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_actions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;

-- Full replica identity para captar deletes/updates completos
ALTER TABLE public.game_states REPLICA IDENTITY FULL;
ALTER TABLE public.room_players REPLICA IDENTITY FULL;
