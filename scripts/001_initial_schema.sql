-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create vehicles table
create table if not exists public.vehicles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  make text not null,
  model text not null,
  year integer not null,
  registration_number text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, registration_number)
);

-- Create fuel_entries table
create table if not exists public.fuel_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  entry_date date not null default current_date,
  odometer_reading numeric(10, 2) not null,
  liters numeric(10, 2) not null,
  price_per_liter numeric(10, 2) not null,
  total_cost numeric(10, 2) not null,
  petrol_station_name text,
  receipt_url text,
  is_work_travel boolean default false,
  work_km numeric(10, 2),
  is_locked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint positive_odometer check (odometer_reading > 0),
  constraint positive_liters check (liters > 0),
  constraint positive_price check (price_per_liter > 0),
  constraint work_km_when_work_travel check (
    (is_work_travel = false and work_km is null) or
    (is_work_travel = true and work_km is not null and work_km >= 0)
  )
);

-- Create indexes for better query performance
create index if not exists idx_vehicles_user_id on public.vehicles(user_id);
create index if not exists idx_fuel_entries_user_id on public.fuel_entries(user_id);
create index if not exists idx_fuel_entries_vehicle_id on public.fuel_entries(vehicle_id);
create index if not exists idx_fuel_entries_date on public.fuel_entries(entry_date desc);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.fuel_entries enable row level security;

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for vehicles
create policy "Users can view their own vehicles"
  on public.vehicles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own vehicles"
  on public.vehicles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own vehicles"
  on public.vehicles for update
  using (auth.uid() = user_id);

create policy "Users can delete their own vehicles"
  on public.vehicles for delete
  using (auth.uid() = user_id);

-- RLS Policies for fuel_entries
create policy "Users can view their own fuel entries"
  on public.fuel_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own fuel entries"
  on public.fuel_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own unlocked fuel entries"
  on public.fuel_entries for update
  using (auth.uid() = user_id and is_locked = false);

create policy "Users can delete their own unlocked fuel entries"
  on public.fuel_entries for delete
  using (auth.uid() = user_id and is_locked = false);

-- Create function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_vehicles_updated_at
  before update on public.vehicles
  for each row
  execute function public.handle_updated_at();

create trigger set_fuel_entries_updated_at
  before update on public.fuel_entries
  for each row
  execute function public.handle_updated_at();
