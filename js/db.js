/* =========================================================
   LAPISAN DATA: Supabase (produksi) atau localStorage (demo)
   ========================================================= */
const MODE_DEMO = !SUPABASE_URL || !SUPABASE_ANON_KEY;
const sb = !MODE_DEMO && window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const DEMO_KEY = "sp_riwayat_demo";
const DEMO_SESSION = "sp_admin_demo";
const DEMO_ADMIN = { email: "admin@demo.id", password: "admin123" };

function bacaDemo() {
  try { return JSON.parse(localStorage.getItem(DEMO_KEY) || "[]"); } catch { return []; }
}
function tulisDemo(rows) {
  try { localStorage.setItem(DEMO_KEY, JSON.stringify(rows)); } catch {}
}

const DB = {
  demo: MODE_DEMO,

  async simpanKonsultasi(data) {
    if (MODE_DEMO) {
      const rows = bacaDemo();
      rows.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), created_at: new Date().toISOString(), ...data });
      tulisDemo(rows);
      return { ok: true };
    }
    const { error } = await sb.from("konsultasi").insert(data);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },

  async login(email, password) {
    if (MODE_DEMO) {
      if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        sessionStorage.setItem(DEMO_SESSION, "1");
        return { ok: true };
      }
      return { ok: false, error: "Email atau kata sandi salah." };
    }
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: "Email atau kata sandi salah." };
    return { ok: true };
  },

  async logout() {
    if (MODE_DEMO) { sessionStorage.removeItem(DEMO_SESSION); return; }
    await sb.auth.signOut();
  },

  async sesi() {
    if (MODE_DEMO) return sessionStorage.getItem(DEMO_SESSION) ? { email: DEMO_ADMIN.email } : null;
    const { data } = await sb.auth.getSession();
    return data.session ? data.session.user : null;
  },

  async ambilRiwayat() {
    if (MODE_DEMO) return { ok: true, rows: bacaDemo() };
    const { data, error } = await sb.from("konsultasi").select("*").order("created_at", { ascending: false }).limit(5000);
    if (error) return { ok: false, error: error.message, rows: [] };
    return { ok: true, rows: data };
  },

  async hapus(id) {
    if (MODE_DEMO) { tulisDemo(bacaDemo().filter((r) => r.id !== id)); return { ok: true }; }
    const { error } = await sb.from("konsultasi").delete().eq("id", id);
    return error ? { ok: false, error: error.message } : { ok: true };
  },
};
