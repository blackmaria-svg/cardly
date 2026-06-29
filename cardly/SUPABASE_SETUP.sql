-- ============================================
-- CARDLY DATABASE SETUP
-- Run this in Supabase SQL Editor (one time)
-- ============================================

-- Drop old tables if re-running (safe to ignore errors)
drop table if exists booking_slots cascade;
drop table if exists menu_items cascade;
drop table if exists services cascade;
drop table if exists profiles cascade;

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  username text unique not null,
  business_name text,
  business_type text check (business_type in ('barber','food','generic')),
  bio text, phone text, address text,
  instagram text, tiktok text, facebook text, whatsapp text,
  profile_image_url text, payment_qr_url text,
  created_at timestamptz default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  name text not null, description text,
  price numeric(10,2), duration_minutes int,
  created_at timestamptz default now()
);

create table booking_slots (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  service_id uuid references services(id),
  slot_datetime timestamptz not null,
  is_booked boolean default false,
  customer_name text, customer_phone text,
  created_at timestamptz default now()
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  name text not null, description text,
  price numeric(10,2), category text, image_url text,
  is_available boolean default true,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table services enable row level security;
alter table booking_slots enable row level security;
alter table menu_items enable row level security;

-- public read
create policy "p_read" on profiles for select using (true);
create policy "s_read" on services for select using (true);
create policy "b_read" on booking_slots for select using (true);
create policy "m_read" on menu_items for select using (true);

-- owner write
create policy "p_write" on profiles for all using (auth.uid() = user_id);
create policy "s_write" on services for all using (profile_id in (select id from profiles where user_id = auth.uid()));
create policy "b_owner" on booking_slots for all using (profile_id in (select id from profiles where user_id = auth.uid()));
create policy "m_write" on menu_items for all using (profile_id in (select id from profiles where user_id = auth.uid()));

-- anyone can book an open slot (update only)
create policy "b_book" on booking_slots for update using (true);

-- storage buckets
insert into storage.buckets (id, name, public) values ('avatars','avatars',true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('qr-codes','qr-codes',true) on conflict do nothing;

create policy "av_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "av_write" on storage.objects for insert with check (bucket_id = 'avatars');
create policy "av_update" on storage.objects for update using (bucket_id = 'avatars');
create policy "qr_read" on storage.objects for select using (bucket_id = 'qr-codes');
create policy "qr_write" on storage.objects for insert with check (bucket_id = 'qr-codes');
create policy "qr_update" on storage.objects for update using (bucket_id = 'qr-codes');
