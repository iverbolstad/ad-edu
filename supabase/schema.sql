-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  school_name text,
  preferred_variant text not null default 'bokmal' check (preferred_variant in ('bokmal', 'nynorsk')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Themes (seed/reference)
create table if not exists public.themes (
  id uuid default gen_random_uuid() primary key,
  label_nb text not null,
  label_en text not null,
  sort_order integer not null default 0
);

alter table public.themes enable row level security;

create policy "Themes are readable by all authenticated users"
  on public.themes for select
  to authenticated
  using (true);

-- Seed themes
insert into public.themes (label_nb, label_en, sort_order) values
  ('Dagligliv', 'Daily life', 1),
  ('Arbeid', 'Work', 2),
  ('Helse', 'Health', 3),
  ('Handel', 'Shopping', 4),
  ('Utdanning', 'Education', 5),
  ('Sosialt liv', 'Social life', 6),
  ('Reise', 'Travel', 7),
  ('Bolig', 'Housing', 8),
  ('Familie', 'Family', 9),
  ('Natur', 'Nature', 10);

-- Storybooks (core table)
create table if not exists public.storybooks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  cefr_level text not null check (cefr_level in ('A1', 'A2', 'B1', 'B2')),
  theme text not null,
  variant text not null default 'bokmal' check (variant in ('bokmal', 'nynorsk')),
  spor text check (spor in ('1', '2', '3')),
  vocabulary_focus text[] default '{}',
  story_text text not null,
  vocabulary_list jsonb not null default '[]',
  comprehension_questions jsonb not null default '[]',
  word_count integer not null default 0,
  is_edited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.storybooks enable row level security;

create policy "Users can view own storybooks"
  on public.storybooks for select
  using (auth.uid() = user_id);

create policy "Users can insert own storybooks"
  on public.storybooks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own storybooks"
  on public.storybooks for update
  using (auth.uid() = user_id);

create policy "Users can delete own storybooks"
  on public.storybooks for delete
  using (auth.uid() = user_id);

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_storybooks_updated_at
  before update on public.storybooks
  for each row execute procedure public.update_updated_at();
