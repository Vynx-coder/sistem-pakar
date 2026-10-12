-- =========================================================
-- SETUP DATABASE SUPABASE — Sistem Pakar Tumbuh Kembang Anak
-- Jalankan seluruh isi file ini di Supabase → SQL Editor → Run
-- =========================================================

-- 1) Tabel riwayat konsultasi
create table if not exists public.konsultasi (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  nama_anak      text not null check (char_length(nama_anak) between 1 and 80),
  jenis_kelamin  text not null check (jenis_kelamin in ('Laki-laki','Perempuan')),
  tanggal_lahir  date not null,
  usia_bulan     int  not null check (usia_bulan between 0 and 120),
  nama_ortu      text check (char_length(nama_ortu) <= 80),
  jawaban        jsonb not null,          -- { "E1": 0.8, "E7": 0.6, ... }
  hasil          jsonb not null,          -- belief tiap gangguan
  diagnosa_kode  text not null,
  diagnosa_nama  text not null,
  persentase     numeric(6,2) not null
);

-- 2) Daftar admin (hanya user di tabel ini yang boleh melihat riwayat)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 3) Aktifkan Row Level Security
alter table public.konsultasi enable row level security;
alter table public.admins     enable row level security;

-- Pengguna umum (tanpa login) HANYA boleh menambah data
drop policy if exists "publik boleh insert" on public.konsultasi;
create policy "publik boleh insert" on public.konsultasi
  for insert to anon, authenticated with check (true);

-- Hanya admin yang boleh membaca riwayat
drop policy if exists "admin boleh baca" on public.konsultasi;
create policy "admin boleh baca" on public.konsultasi
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Hanya admin yang boleh menghapus riwayat
drop policy if exists "admin boleh hapus" on public.konsultasi;
create policy "admin boleh hapus" on public.konsultasi
  for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Admin boleh mengecek dirinya sendiri di tabel admins
drop policy if exists "admin lihat diri" on public.admins;
create policy "admin lihat diri" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- =========================================================
-- 4) DAFTARKAN ADMIN
-- Buat dulu user di Authentication → Users → Add user
-- (centang "Auto Confirm User"), lalu ganti email di bawah
-- dan jalankan baris ini:
-- =========================================================
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'admin@contoh.com';
