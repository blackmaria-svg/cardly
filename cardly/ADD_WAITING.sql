-- Run this once in Supabase SQL editor to enable orange "waiting" status
alter table booking_slots add column if not exists waiting boolean default false;
