-- Create a bucket for file uploads
insert into storage.buckets (id, name, public)
values ('files', 'files', true);

-- Create a table for file metadata
create table public.files (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  file_path text not null,
  code text not null unique,
  expires_at timestamp with time zone not null,
  download_count int default 0,
  encryption_iv text,
  encryption_key text -- Storing key to allow code-only access
);

-- Enable RLS
alter table public.files enable row level security;

-- Allow public read access to files table
create policy "Public files are viewable by everyone"
on public.files for select
using (true);

-- Allow public insert access to files table
create policy "Anyone can upload files"
on public.files for insert
with check (true);

-- Allow public access to storage bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'files' );

create policy "Public Upload"
on storage.objects for insert
with check ( bucket_id = 'files' );
