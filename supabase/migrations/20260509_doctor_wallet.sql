create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.doctor_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_locations (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  address text,
  default_new_fee_bdt integer not null default 500 check (default_new_fee_bdt >= 0),
  default_old_fee_bdt integer not null default 300 check (default_old_fee_bdt >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (doctor_id, id)
);

create table if not exists public.doctor_wallet_entries (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
  location_id uuid not null references public.doctor_locations(id) on delete cascade,
  entry_date date not null,
  new_patient_count integer not null default 0 check (new_patient_count >= 0),
  old_patient_count integer not null default 0 check (old_patient_count >= 0),
  new_fee_bdt integer not null default 500 check (new_fee_bdt >= 0),
  old_fee_bdt integer not null default 300 check (old_fee_bdt >= 0),
  total_bdt integer not null check (total_bdt >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint doctor_wallet_location_owner_fk
    foreign key (doctor_id, location_id)
    references public.doctor_locations(doctor_id, id)
    deferrable initially immediate
);

create index if not exists doctor_wallet_entries_doctor_date_idx
  on public.doctor_wallet_entries (doctor_id, entry_date desc);

create index if not exists doctor_wallet_entries_location_date_idx
  on public.doctor_wallet_entries (location_id, entry_date desc);

drop trigger if exists set_doctor_profiles_updated_at on public.doctor_profiles;
create trigger set_doctor_profiles_updated_at
before update on public.doctor_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_doctor_locations_updated_at on public.doctor_locations;
create trigger set_doctor_locations_updated_at
before update on public.doctor_locations
for each row execute function public.set_updated_at();

drop trigger if exists set_doctor_wallet_entries_updated_at on public.doctor_wallet_entries;
create trigger set_doctor_wallet_entries_updated_at
before update on public.doctor_wallet_entries
for each row execute function public.set_updated_at();

alter table public.doctor_profiles enable row level security;
alter table public.doctor_locations enable row level security;
alter table public.doctor_wallet_entries enable row level security;

drop policy if exists "doctor profile owner access" on public.doctor_profiles;
create policy "doctor profile owner access"
on public.doctor_profiles
for all
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

drop policy if exists "doctor location owner access" on public.doctor_locations;
create policy "doctor location owner access"
on public.doctor_locations
for all
using (
  exists (
    select 1
    from public.doctor_profiles p
    where p.id = doctor_locations.doctor_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.doctor_profiles p
    where p.id = doctor_locations.doctor_id
      and p.auth_user_id = auth.uid()
  )
);

drop policy if exists "doctor wallet entry owner access" on public.doctor_wallet_entries;
create policy "doctor wallet entry owner access"
on public.doctor_wallet_entries
for all
using (
  exists (
    select 1
    from public.doctor_profiles p
    where p.id = doctor_wallet_entries.doctor_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.doctor_profiles p
    where p.id = doctor_wallet_entries.doctor_id
      and p.auth_user_id = auth.uid()
  )
);
