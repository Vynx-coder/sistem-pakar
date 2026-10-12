/* =========================================================
   PANEL ADMIN
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const G = Object.fromEntries(GANGGUAN.map((g) => [g.kode, g]));
const GEJALA_MAP = Object.fromEntries(GEJALA.map((g) => [g.kode, g]));
let rows = [];

if (DB.demo) $("#demoBanner").classList.remove("hidden");

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2800);
}
const tglID = (s) => new Date(s).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const usia = (b) => { const t = Math.floor(b / 12), m = b % 12; return (t ? t + " th " : "") + (m ? m + " bln" : t ? "" : "0 bln"); };

/* ---------- Auth ---------- */
async function init() {
  const user = await DB.sesi();
  if (user) bukaDashboard(user);
  else { $("#viewLogin").classList.remove("hidden"); $("#viewDash").classList.add("hidden"); $("#btnLogout").classList.add("hidden"); }
}

$("#formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("#btnLogin"), err = $("#loginErr");
  btn.disabled = true; btn.textContent = "Memeriksa…";
  const r = await DB.login($("#email").value.trim(), $("#password").value);
  btn.disabled = false; btn.textContent = "Masuk";
  if (!r.ok) { err.textContent = r.error; err.classList.remove("hidden"); return; }
  err.classList.add("hidden");
  init();
});

$("#btnLogout").addEventListener("click", async () => { await DB.logout(); location.reload(); });

async function bukaDashboard(user) {
  $("#viewLogin").classList.add("hidden");
  $("#viewDash").classList.remove("hidden");
  $("#btnLogout").classList.remove("hidden");
  $("#adminEmail").textContent = "Masuk sebagai " + (user.email || "admin");
  $("#fDiag").innerHTML = `<option value="">Semua diagnosa</option>` + GANGGUAN.map((g) => `<option value="${g.kode}">${g.nama}</option>`).join("") + `<option value="-">Tidak ada gejala</option>`;
  await muat();
}

async function muat() {
  $("#tbody").innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--ink-3)">Memuat…</td></tr>`;
  const r = await DB.ambilRiwayat();
  if (!r.ok) toast("Gagal memuat: " + r.error);
  rows = r.rows || [];
  if (r.ok && rows.length === 0 && !DB.demo) {
    // Bisa juga karena akun belum terdaftar di tabel admins
    $("#empty").innerHTML = `<div>🗂️</div>Belum ada riwayat konsultasi.<br><small>Jika seharusnya ada data, pastikan akun ini sudah didaftarkan di tabel <code>admins</code> (lihat panduan).</small>`;
  }
  renderStats();
  renderTabel();
}
$("#btnRefresh").addEventListener("click", muat);

/* ---------- Statistik ---------- */
function barHTML(list, total) {
  if (!total) return `<p style="color:var(--ink-3);margin:0">Belum ada data.</p>`;
  return list.map((x) => `
    <div class="bar-row">
      <div class="name">${esc(x.label)}</div>
      <div class="bar-track"><div class="bar-fill" style="--c:${x.warna};width:${(x.n / total) * 100}%"></div></div>
      <div class="val">${x.n}</div>
    </div>`).join("");
}

function renderStats() {
  const total = rows.length;
  const now = new Date();
  const bulanIni = rows.filter((r) => { const d = new Date(r.created_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;
  const hitung = {};
  rows.forEach((r) => (hitung[r.diagnosa_kode] = (hitung[r.diagnosa_kode] || 0) + 1));
  const top = Object.entries(hitung).filter(([k]) => k !== "-").sort((a, b) => b[1] - a[1])[0];
  const rata = total ? rows.reduce((a, r) => a + Number(r.usia_bulan || 0), 0) / total : 0;

  $("#sTotal").textContent = total;
  $("#sBulan").textContent = bulanIni;
  $("#sTop").textContent = top ? G[top[0]].nama : "-";
  $("#sUsia").textContent = total ? usia(Math.round(rata)) : "-";

  $("#distBars").innerHTML = barHTML(GANGGUAN.map((g) => ({ label: g.singkat, warna: g.warna, n: hitung[g.kode] || 0 })), total);
  const L = rows.filter((r) => r.jenis_kelamin === "Laki-laki").length;
  $("#jkBars").innerHTML = barHTML([{ label: "Laki-laki", warna: "#3b82f6", n: L }, { label: "Perempuan", warna: "#ec4899", n: total - L }], total);
  const kel = [[12, 23, "1 tahun"], [24, 35, "2 tahun"], [36, 47, "3 tahun"], [48, 59, "4 tahun"], [60, 71, "5 tahun"]];
  $("#usiaBars").innerHTML = barHTML(kel.map(([a, b, l], i) => ({ label: l, warna: ["#7c5cff", "#21b6a8", "#f5b301", "#ff7a59", "#ec4899"][i], n: rows.filter((r) => r.usia_bulan >= a && r.usia_bulan <= b).length })), total);
}

/* ---------- Tabel ---------- */
function terfilter() {
  const q = $("#q").value.trim().toLowerCase();
  const d = $("#fDiag").value;
  return rows.filter((r) =>
    (!q || (r.nama_anak || "").toLowerCase().includes(q) || (r.nama_ortu || "").toLowerCase().includes(q)) &&
    (!d || r.diagnosa_kode === d));
}

function badge(kode, nama) {
  const g = G[kode];
  return `<span class="badge" style="--c:${g ? g.warna : "#8d89ad"}">${esc(g ? g.singkat : nama)}</span>`;
}

function renderTabel() {
  const list = terfilter();
  $("#empty").classList.toggle("hidden", list.length > 0);
  $("#tbody").innerHTML = list.map((r) => `
    <tr>
      <td data-l="Tanggal">${tglID(r.created_at)}</td>
      <td data-l="Nama anak"><b>${esc(r.nama_anak)}</b></td>
      <td data-l="JK">${r.jenis_kelamin === "Laki-laki" ? "L" : "P"}</td>
      <td data-l="Usia">${usia(r.usia_bulan)}</td>
      <td data-l="Orang tua">${esc(r.nama_ortu || "-")}</td>
      <td data-l="Hasil">${badge(r.diagnosa_kode, r.diagnosa_nama)}</td>
      <td data-l="Belief" class="num">${Number(r.persentase).toFixed(2).replace(".", ",")}%</td>
      <td class="act" style="text-align:right">
        <button class="btn btn-ghost btn-sm" data-detail="${r.id}">Detail</button>
        <button class="btn btn-danger btn-sm" data-hapus="${r.id}" aria-label="Hapus">🗑</button>
      </td>
    </tr>`).join("");
}
$("#q").addEventListener("input", renderTabel);
$("#fDiag").addEventListener("change", renderTabel);

$("#tbody").addEventListener("click", async (e) => {
  const d = e.target.closest("[data-detail]");
  const h = e.target.closest("[data-hapus]");
  if (d) bukaDetail(rows.find((r) => String(r.id) === d.dataset.detail));
  if (h) {
    const r = rows.find((x) => String(x.id) === h.dataset.hapus);
    if (!confirm(`Hapus riwayat konsultasi "${r.nama_anak}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const res = await DB.hapus(r.id);
    if (!res.ok) return toast("Gagal menghapus: " + res.error);
    rows = rows.filter((x) => x.id !== r.id);
    renderStats(); renderTabel(); toast("Riwayat dihapus");
  }
});

/* ---------- Detail ---------- */
function bukaDetail(r) {
  if (!r) return;
  const hasil = r.hasil || {};
  const urut = GANGGUAN.map((g) => ({ ...g, v: Number(hasil[g.kode] || 0) })).sort((a, b) => b.v - a.v);
  const label = (v) => (PILIHAN_CF.find((p) => p.nilai === Number(v)) || {}).label || v;
  const dipilih = Object.entries(r.jawaban || {}).filter(([, v]) => Number(v) > 0)
    .sort((a, b) => Number(a[0].slice(1)) - Number(b[0].slice(1)));

  $("#modalBox").innerHTML = `
    <div class="modal-head">
      <div>
        <div class="eyebrow">Detail Konsultasi</div>
        <h2>${esc(r.nama_anak)}</h2>
        <div class="child-meta" style="margin-top:6px">
          <span>${r.jenis_kelamin === "Laki-laki" ? "👦" : "👧"} ${esc(r.jenis_kelamin)}</span>
          <span>🎂 ${usia(r.usia_bulan)} (lahir ${new Date(r.tanggal_lahir + "T00:00:00").toLocaleDateString("id-ID")})</span>
          <span>👤 ${esc(r.nama_ortu || "-")}</span>
          <span>📅 ${tglID(r.created_at)}</span>
        </div>
      </div>
      <button class="x" id="closeModal" aria-label="Tutup">✕</button>
    </div>
    <div class="card" style="margin-bottom:16px">
      <h3>Hasil: ${badge(r.diagnosa_kode, r.diagnosa_nama)} ${esc(r.diagnosa_nama)} · ${Number(r.persentase).toFixed(2).replace(".", ",")}%</h3>
      <div class="bars">${urut.map((g) => `
        <div class="bar-row"><div class="name">${g.singkat}</div>
        <div class="bar-track"><div class="bar-fill" style="--c:${g.warna};width:${g.v * 100}%"></div></div>
        <div class="val">${(g.v * 100).toFixed(2).replace(".", ",")}%</div></div>`).join("")}</div>
    </div>
    <div class="card">
      <h3>Gejala yang dipilih (${dipilih.length})</h3>
      ${dipilih.length ? `<div class="table-wrap"><table class="t"><thead><tr><th>Kode</th><th>Gejala</th><th>Jawaban</th></tr></thead><tbody>
        ${dipilih.map(([k, v]) => `<tr><td>${k}</td><td style="white-space:normal">${esc(GEJALA_MAP[k]?.teks || "")}</td><td>${label(v)}</td></tr>`).join("")}
      </tbody></table></div>` : `<p style="color:var(--ink-3);margin:0">Tidak ada gejala yang dipilih.</p>`}
    </div>`;
  $("#modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function tutupModal() { $("#modal").classList.add("hidden"); document.body.style.overflow = ""; }
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal" || e.target.closest("#closeModal")) tutupModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") tutupModal(); });

/* ---------- Ekspor CSV ---------- */
$("#btnExport").addEventListener("click", () => {
  const list = terfilter();
  if (!list.length) return toast("Tidak ada data untuk diekspor");
  const head = ["Tanggal", "Nama Anak", "Jenis Kelamin", "Tanggal Lahir", "Usia (bulan)", "Nama Orang Tua", "Diagnosa", "Belief (%)",
    ...GANGGUAN.map((g) => g.kode + " " + g.singkat + " (%)"), ...GEJALA.map((g) => g.kode)];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = list.map((r) => [
    tglID(r.created_at), r.nama_anak, r.jenis_kelamin, r.tanggal_lahir, r.usia_bulan, r.nama_ortu || "", r.diagnosa_nama,
    Number(r.persentase).toFixed(2),
    ...GANGGUAN.map((g) => (Number((r.hasil || {})[g.kode] || 0) * 100).toFixed(2)),
    ...GEJALA.map((g) => (r.jawaban || {})[g.kode] ?? ""),
  ].map(q).join(";"));
  const blob = new Blob(["﻿" + [head.map(q).join(";"), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `riwayat-konsultasi-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
});

init();
