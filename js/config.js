/* =========================================================
   KONFIGURASI SUPABASE
   Isi dua nilai di bawah ini dari Supabase:
   Project Settings → API → "Project URL" dan "anon public key".
   Anon key memang aman ditaruh di sini; keamanan data dijaga
   oleh Row Level Security (lihat supabase.sql).

   Jika dibiarkan kosong, aplikasi berjalan dalam MODE DEMO:
   riwayat disimpan di browser (localStorage) dan login admin
   memakai akun demo. Cocok untuk mencoba tampilan saja.
   ========================================================= */
const SUPABASE_URL = "https://vxwjyyxrsqtvbatgtlww.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BevNC0rp8b6aOo6grf_Z3A_y7Z1wexy";
