create extension if not exists pgcrypto;

-- Updated at trigger function
create or replace function trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- admin_profiles
create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

-- rooms
create table rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  regular_rate numeric(12,2) not null check (regular_rate >= 0),
  standard_guests integer not null check (standard_guests >= 0),
  max_extra_guests integer not null default 0 check (max_extra_guests >= 0),
  breakfast_guests integer not null check (breakfast_guests >= 0),
  has_jacuzzi boolean not null default true,
  has_dipping_tub boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger set_timestamp_rooms
before update on rooms
for each row
execute procedure trigger_set_timestamp();

-- resort_settings
create table resort_settings (
  id integer primary key default 1 check (id = 1),
  global_discount_percentage numeric(5,2) not null default 33.33 check (global_discount_percentage >= 0 and global_discount_percentage <= 100),
  extra_person_fee numeric(12,2) not null default 1300 check (extra_person_fee >= 0),
  security_deposit numeric(12,2) not null default 2000 check (security_deposit >= 0),
  check_in_time time not null default '14:00',
  check_out_time time not null default '12:30',

  bank_transfer_enabled boolean not null default true,
  bank_name text,
  bank_account_name text,
  bank_account_number text,

  gcash_enabled boolean not null default true,
  gcash_name text,
  gcash_number text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger set_timestamp_resort_settings
before update on resort_settings
for each row
execute procedure trigger_set_timestamp();

-- bookings
create table bookings (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  room_id uuid not null references rooms(id),

  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  special_requests text,

  check_in date not null,
  check_out date not null,
  adult_guests integer not null,
  child_guests integer not null default 0,
  nights integer not null,

  regular_rate_snapshot numeric(12,2) not null,
  discount_percentage_snapshot numeric(5,2) not null,
  discounted_rate_snapshot numeric(12,2) not null,
  extra_person_fee_snapshot numeric(12,2) not null,
  security_deposit_snapshot numeric(12,2) not null,

  room_total numeric(12,2) not null,
  extra_person_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null,

  payment_option text not null,
  amount_due_now numeric(12,2) not null,
  remaining_balance numeric(12,2) not null default 0,

  status text not null default 'awaiting_payment',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint check_dates check (check_out > check_in),
  constraint check_guests check (adult_guests > 0 and child_guests >= 0),
  constraint check_nights check (nights > 0),
  constraint check_payment_option check (payment_option in ('full', 'half')),
  constraint check_status check (status in ('awaiting_payment', 'pending_review', 'approved', 'rejected', 'cancelled', 'completed'))
);

create trigger set_timestamp_bookings
before update on bookings
for each row
execute procedure trigger_set_timestamp();

-- payment_submissions
create table payment_submissions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  payment_method text not null,
  proof_storage_path text not null,
  amount_claimed numeric(12,2) not null,
  status text not null default 'pending_review',
  rejection_reason text,
  reviewed_by uuid references admin_profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint check_payment_method check (payment_method in ('bank_transfer', 'gcash')),
  constraint check_payment_status check (status in ('pending_review', 'approved', 'rejected', 'cancelled')),
  constraint check_amount_claimed check (amount_claimed > 0)
);

create trigger set_timestamp_payment_submissions
before update on payment_submissions
for each row
execute procedure trigger_set_timestamp();

-- Seed data
insert into rooms (slug, name, regular_rate, standard_guests, max_extra_guests, breakfast_guests) values
  ('cabin-suite', 'Cabin Suite', 6750.00, 3, 1, 3),
  ('cabin-villa', 'Cabin Villa', 9000.00, 4, 1, 4),
  ('ibiza-room', 'Ibiza Room', 9750.00, 4, 0, 4),
  ('family-room', 'Family Room', 19500.00, 10, 2, 10),
  ('cancun', 'Cancun', 10500.00, 5, 2, 5);

insert into resort_settings (id, bank_name, bank_account_name, bank_account_number, gcash_name, gcash_number) values
  (1, null, null, null, null, null);

-- Storage bucket
insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', false) on conflict do nothing;

-- RLS
alter table admin_profiles enable row level security;
alter table rooms enable row level security;
alter table resort_settings enable row level security;
alter table bookings enable row level security;
alter table payment_submissions enable row level security;

-- Rooms policies
create policy "Rooms are publicly readable if active" on rooms for select using (is_active = true);
create policy "Admins can do everything on rooms" on rooms for all to authenticated using (
  exists (select 1 from admin_profiles where id = auth.uid())
);

-- Resort settings policies
-- NOT public. Only admins can read/write.
create policy "Admins can do everything on resort_settings" on resort_settings for all to authenticated using (
  exists (select 1 from admin_profiles where id = auth.uid())
);

-- Bookings policies
create policy "Admins can do everything on bookings" on bookings for all to authenticated using (
  exists (select 1 from admin_profiles where id = auth.uid())
);

-- Payment submissions policies
create policy "Admins can do everything on payment_submissions" on payment_submissions for all to authenticated using (
  exists (select 1 from admin_profiles where id = auth.uid())
);

-- Storage bucket policies (payment-proofs)
create policy "Admins can read payment proofs" on storage.objects for select to authenticated using (
  bucket_id = 'payment-proofs' and exists (select 1 from admin_profiles where id = auth.uid())
);
create policy "Admins can write payment proofs" on storage.objects for insert to authenticated with check (
  bucket_id = 'payment-proofs' and exists (select 1 from admin_profiles where id = auth.uid())
);
create policy "Admins can update payment proofs" on storage.objects for update to authenticated using (
  bucket_id = 'payment-proofs' and exists (select 1 from admin_profiles where id = auth.uid())
);
create policy "Admins can delete payment proofs" on storage.objects for delete to authenticated using (
  bucket_id = 'payment-proofs' and exists (select 1 from admin_profiles where id = auth.uid())
);
