-- ============================================
-- CARDLY — run this once in Supabase SQL editor
-- Enables: orange "waiting" status + admin can read all bookings
-- ============================================

-- 1. waiting status column (orange dot)
alter table booking_slots add column if not exists waiting boolean default false;

-- 2. let owner (admin) read all bookings for the admin panel
--    (public read on profiles + booking_slots already exists, this is safe)
drop policy if exists "b_read" on booking_slots;
create policy "b_read" on booking_slots for select using (true);
