-- Create contact_submissions table
create table public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text,
  message text not null
);

-- Enable RLS
alter table public.contact_submissions enable row level security;

-- Allow anonymous inserts (public can submit contact forms)
create policy "Enable anonymous inserts"
on public.contact_submissions
for insert
with check (true);

-- Restrict SELECT to authenticated users only (admin access)
create policy "Enable read for authenticated users only"
on public.contact_submissions
for select
to authenticated
using (true);

-- Restrict DELETE to authenticated users only
create policy "Enable delete for authenticated users only"
on public.contact_submissions
for delete
to authenticated
using (true);
