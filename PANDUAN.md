# Panduan Lengkap: Sistem Pakar TumbuhKembang

Sistem pakar deteksi dini gangguan perkembangan anak usia 1–5 tahun, metode **Dempster-Shafer + Certainty Factor**, sesuai Manual Bab 4.

- **Pengguna umum**: tanpa login, cukup isi data singkat anak lalu menjawab 47 pertanyaan.
- **Admin**: login di `/admin` untuk melihat, mencari, menghapus, dan mengekspor (CSV/Excel) riwayat konsultasi.
- **Teknologi**: HTML + CSS + JavaScript murni (tanpa build), hosting di **Vercel**, database & login admin di **Supabase** (gratis).

> Kenapa butuh Supabase? Vercel hanya menyajikan file statis. Agar riwayat tersimpan permanen dan bisa dilihat admin dari perangkat mana pun, dibutuhkan database. Supabase menyediakan database + login dalam satu tempat, gratis, dan bisa dipanggil langsung dari JavaScript.

---

## 0. Struktur folder

```
sistem-pakar/
├── index.html        ← halaman pengguna (beranda, data anak, kuesioner, hasil)
├── admin.html        ← halaman admin (login + riwayat)
├── vercel.json       ← konfigurasi Vercel (URL rapi + header keamanan)
├── supabase.sql      ← script pembuat tabel & keamanan database
├── css/style.css     ← seluruh tampilan (responsif HP & laptop)
├── assets/favicon.svg
└── js/
    ├── config.js     ← ISI URL & KEY SUPABASE DI SINI
    ├── data.js       ← basis pengetahuan (Tabel 4.1–4.4)
    ├── engine.js     ← mesin inferensi Dempster-Shafer
    ├── db.js         ← simpan/baca data (Supabase atau mode demo)
    ├── app.js        ← logika halaman pengguna
    └── admin.js      ← logika halaman admin
```

## 1. Coba dulu di komputer (opsional)

Aplikasi langsung bisa dicoba tanpa Supabase (**mode demo**: data hanya tersimpan di browser, login admin `admin@demo.id` / `admin123`).

- Cara termudah: pasang ekstensi **Live Server** di VS Code → klik kanan `index.html` → *Open with Live Server*.
- Atau lewat terminal di dalam folder: `python -m http.server 8000` lalu buka `http://localhost:8000`.

> Mode demo **hanya untuk mencoba**. Setelah Supabase diisi, mode demo otomatis mati.

## 2. Siapkan Supabase (database + login admin)

1. Buka **https://supabase.com** → *Start your project* → daftar (bisa pakai akun GitHub).
2. Klik **New project**:
   - *Name*: `sistem-pakar`
   - *Database Password*: buat & simpan baik-baik
   - *Region*: **Southeast Asia (Singapore)** (paling dekat dengan Indonesia)
   - Klik **Create new project**, tunggu ±1–2 menit.
3. **Buat tabel**: menu kiri **SQL Editor** → **New query** → salin seluruh isi file `supabase.sql` → klik **Run**. Harus muncul *Success. No rows returned*.
4. **Buat akun admin**: menu **Authentication → Users → Add user → Create new user**
   - Isi email & kata sandi admin
   - Centang **Auto Confirm User** → **Create user**
5. **Daftarkan akun itu sebagai admin**: kembali ke **SQL Editor**, jalankan (ganti emailnya):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'emailadmin@anda.com';
   ```
6. **Matikan pendaftaran umum** (penting, agar orang lain tidak bisa membuat akun):
   **Authentication → Sign In / Providers** (atau *Providers → Email*) → matikan **Allow new users to sign up** → Save.
7. **Ambil kunci API**: **Project Settings → API** (atau **Data API / API Keys**). Salin:
   - **Project URL** (contoh `https://abcdxyz.supabase.co`)
   - **anon / public key** (teks panjang diawali `eyJ...`, atau `sb_publishable_...` pada project baru)
8. Buka `js/config.js`, isi:
   ```js
   const SUPABASE_URL = "https://abcdxyz.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```
   Jangan pernah memakai **service_role / secret key** di sini.

> Aman menaruh *anon key* di website? **Ya.** Keamanan diatur oleh Row Level Security di `supabase.sql`: publik **hanya bisa menambah** data konsultasi; **membaca dan menghapus** hanya untuk akun yang terdaftar di tabel `admins`.

## 3. Upload ke Vercel

Pilih **salah satu** cara.

### Cara A: lewat GitHub (disarankan, setiap perubahan otomatis ter-update)

1. Buat akun di **https://github.com** → tombol **+ → New repository** → nama `sistem-pakar` → *Public* atau *Private* → **Create repository**.
2. Di halaman repo baru, klik **uploading an existing file** → seret **isi** folder `sistem-pakar` (bukan foldernya; `index.html` harus berada di paling atas repo) → **Commit changes**.
3. Buka **https://vercel.com** → **Sign Up → Continue with GitHub**.
4. **Add New… → Project** → pilih repo `sistem-pakar` → **Import**.
5. Pengaturan:
   - *Framework Preset*: **Other**
   - *Root Directory*: `./`
   - *Build Command* & *Output Directory*: biarkan kosong
6. Klik **Deploy**. Selesai ±30 detik, Anda mendapat alamat seperti `https://sistem-pakar.vercel.app`.
7. Nanti jika mengubah file: edit/upload ulang di GitHub → Vercel otomatis deploy ulang.

### Cara B: tanpa GitHub (Vercel CLI)

1. Pasang **Node.js** dari https://nodejs.org (versi LTS).
2. Buka terminal/CMD di dalam folder `sistem-pakar`, lalu:
   ```bash
   npm i -g vercel
   vercel login
   vercel          # jawab pertanyaan: set up and deploy? Y, framework: Other
   vercel --prod   # rilis ke alamat utama
   ```

### Setelah online

- Halaman pengguna: `https://nama-anda.vercel.app`
- Halaman admin: `https://nama-anda.vercel.app/admin`
- **Ganti nama domain** (opsional): Vercel → Project → **Settings → Domains** → ubah jadi misalnya `tumbuhkembang.vercel.app` (jika tersedia) atau pasang domain sendiri.
- Tambahkan alamat Vercel di Supabase: **Authentication → URL Configuration → Site URL** = alamat Vercel Anda.

## 4. Uji akhir (checklist)


1. Buka situs di HP dan laptop → isi data anak → jawab semua pertanyaan → hasil muncul dan ada notifikasi *"Hasil konsultasi tersimpan"*.
2. Coba kasus Manual Tabel 4.5 (E1 Yakin, E7 Cukup Yakin, E9 Sangat Yakin, E17 Yakin, E24 Cukup Yakin, E28 Sedikit Yakin, E42 Yakin, lainnya Tidak) → hasil harus **Autism Spectrum Disorder ±54,8%** (manual: 54,82%).
3. Buka `/admin` → login → riwayat tadi tampil.
4. Di Supabase **Table Editor → konsultasi** data juga terlihat.

## 5. Masalah umum

| Gejala | Penyebab & solusi |
|---|---|
| "Gagal menyimpan riwayat" | `config.js` salah isi, atau `supabase.sql` belum dijalankan. |
| Admin login berhasil tapi riwayat kosong | Akun belum dimasukkan ke tabel `admins` (langkah 2.5). |
| "Email atau kata sandi salah" | Pastikan *Auto Confirm User* dicentang saat membuat user, atau konfirmasi user di menu Users. |
| Masih muncul banner "Mode demo" | `config.js` belum terisi / belum ter-upload ulang ke GitHub. |
| Tampilan lama setelah update | Tekan Ctrl+F5 (laptop) atau hapus cache browser HP. |
| Project Supabase "Paused" | Project gratis dijeda setelah ±7 hari tanpa aktivitas; buka dashboard Supabase → **Restore project**. |

## 6. Cara mengubah isi

- **Gejala, bobot pakar, saran**: edit `js/data.js` (urutan baris `CF_PAKAR` = E1…E47, kolom = H1…H6).
- **Pilihan jawaban & nilai CF**: `PILIHAN_CF` di `js/data.js`.
- **Warna/tampilan**: variabel di bagian atas `css/style.css` (`--primary`, dll).
- **Nama aplikasi**: cari teks `TumbuhKembang` di `index.html` dan `admin.html`.

## 7. Catatan metode

Alur di `js/engine.js` sama persis dengan Manual 4.2:
1. Ambil gejala dengan CF user > 0 (E_obs).
2. Normalisasi CF pakar: CF_norm(Ei,Hj) = CF_pakar(Ei,Hj) / Σ CF_pakar(Ei,Hk).
3. Mass function: m(Hj) = CF_norm × CF_user, m(θ) = 1 − CF_user.
4. Kombinasi Dempster bertahap: m₁₂(C) = Σ m₁(A)m₂(B) [A∩B=C] / (1 − K).
5. Hipotesis dengan belief tertinggi = hasil diagnosa.

Perbedaan kecil di digit ke-4 (mis. 0,3863 vs 0,3862) terjadi karena manual membulatkan setiap langkah, sedangkan program memakai presisi penuh.

**Kasus khusus konflik total (K = 1)**: terjadi jika dua gejala "Sangat Yakin" sama sekali tidak berbagi gangguan (mis. E8 dan E17). Rumus Dempster tidak terdefinisi (dibagi nol), jadi program **melewati** bukti tersebut dan mencatatnya di tabel detail perhitungan. Manual tidak membahas kasus ini.

## 8. Saran pengembangan

- Tambahkan halaman **"Tentang"** berisi nama pakar/psikolog validator dan referensi DSM-5-TR (menambah kredibilitas untuk sidang).
- Tambahkan kolom **persetujuan (consent)** sebelum konsultasi, karena data anak termasuk data pribadi (UU PDP No. 27/2022).
- Untuk pengujian akurasi skripsi, ekspor CSV dari admin bisa langsung dipakai menghitung akurasi vs diagnosis pakar.
- Jika ingin tanpa Supabase: alternatifnya **Vercel Serverless Functions + database dari Vercel Marketplace (mis. Neon Postgres)**, tetapi butuh kode backend dan login buatan sendiri, jadi lebih rumit.
