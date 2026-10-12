/* =========================================================
   APLIKASI PENGGUNA (tanpa login)
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pct = (v) => (v * 100).toFixed(2).replace(".", ",") + "%";

const state = {
  anak: null,
  jawaban: {},   // { E1: 0.8, ... } — hanya yang sudah dijawab
  grup: 0,
};

/* ---------- Navigasi tampilan ---------- */
const VIEWS = ["Home", "Form", "Quiz", "Loading", "Result"];
function tampil(nama) {
  VIEWS.forEach((v) => $("#view" + v).classList.toggle("hidden", v !== nama));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-go]");
  if (!t) return;
  e.preventDefault();
  const tujuan = t.dataset.go;
  if (tujuan === "home") tampil("Home");
  if (tujuan === "form") tampil("Form");
  if (tujuan === "beranda") { resetForm(); tampil("Home"); }
  if (tujuan === "baru") { resetForm(); tampil("Form"); }
});

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2800);
}

/* ---------- Beranda ---------- */
$("#disorderList").innerHTML = GANGGUAN.map((g) => `
  <div class="disorder" style="--c:${g.warna}">
    <span class="tag">${g.kode} · ${g.singkat}</span>
    <h3>${g.nama}</h3>
    <p>${g.deskripsi}</p>
  </div>`).join("");
$("#year").textContent = new Date().getFullYear();
if (DB.demo) $("#demoBanner").classList.remove("hidden");

/* ---------- Form data anak ---------- */
function hitungUsiaBulan(tgl) {
  const lahir = new Date(tgl + "T00:00:00");
  const now = new Date();
  let bulan = (now.getFullYear() - lahir.getFullYear()) * 12 + (now.getMonth() - lahir.getMonth());
  if (now.getDate() < lahir.getDate()) bulan--;
  return bulan;
}
function teksUsia(bulan) {
  const th = Math.floor(bulan / 12), bl = bulan % 12;
  return [th ? th + " tahun" : "", bl ? bl + " bulan" : ""].filter(Boolean).join(" ") || "0 bulan";
}

// Nama hanya boleh huruf dan spasi (tanpa angka, titik, atau tanda lain)
const POLA_NAMA = /^[\p{L} ]+$/u;
["#namaAnak", "#namaOrtu"].forEach((id) => {
  $(id).addEventListener("input", (e) => {
    const bersih = e.target.value.replace(/[^\p{L} ]/gu, "").replace(/ {2,}/g, " ");
    if (bersih !== e.target.value) e.target.value = bersih;
  });
});

function resetForm() {
  $("#formAnak").reset();
  $("#formErr").classList.add("hidden");
  const hint = $("#usiaHint");
  hint.textContent = "Sistem ini untuk anak usia 1–5 tahun.";
  hint.style.color = "";
  state.anak = null;
  state.jawaban = {};
  state.grup = 0;
}

const tgl = $("#tglLahir");
tgl.max = new Date().toISOString().slice(0, 10);
tgl.addEventListener("change", () => {
  if (!tgl.value) return;
  const b = hitungUsiaBulan(tgl.value);
  const hint = $("#usiaHint");
  hint.textContent = b >= 0 ? `Usia: ${teksUsia(b)}` + (b < 12 || b > 71 ? " · di luar rentang 1–5 tahun" : "") : "Tanggal tidak valid";
  hint.style.color = b < 12 || b > 71 ? "var(--danger)" : "var(--mint)";
});

$("#formAnak").addEventListener("submit", (e) => {
  e.preventDefault();
  const nama = $("#namaAnak").value.trim();
  const jk = ($("input[name=jk]:checked") || {}).value;
  const lahir = tgl.value;
  const err = $("#formErr");
  let pesan = "";
  const ortu = $("#namaOrtu").value.trim();
  if (!nama) pesan = "Nama anak wajib diisi.";
  else if (!POLA_NAMA.test(nama)) pesan = "Nama anak hanya boleh berisi huruf.";
  else if (ortu && !POLA_NAMA.test(ortu)) pesan = "Nama orang tua/wali hanya boleh berisi huruf.";
  else if (!jk) pesan = "Pilih jenis kelamin anak.";
  else if (!lahir) pesan = "Tanggal lahir wajib diisi.";
  else {
    const b = hitungUsiaBulan(lahir);
    // 1–5 tahun: 12 bulan sampai sebelum ulang tahun ke-6 (71 bulan)
    if (b < 12 || b > 71) pesan = "Sistem ini dirancang untuk anak usia 1–5 tahun.";
  }
  if (pesan) { err.textContent = pesan; err.classList.remove("hidden"); return; }
  err.classList.add("hidden");

  state.anak = {
    nama_anak: nama,
    jenis_kelamin: jk,
    tanggal_lahir: lahir,
    usia_bulan: hitungUsiaBulan(lahir),
    nama_ortu: $("#namaOrtu").value.trim() || null,
  };
  state.jawaban = {};
  state.grup = 0;
  renderGrup();
  tampil("Quiz");
});

/* ---------- Kuesioner ---------- */
const GEJALA_MAP = Object.fromEntries(GEJALA.map((g) => [g.kode, g]));
const TOTAL = GEJALA.length;

function renderDots() {
  $("#stepDots").innerHTML = KELOMPOK.map((k, i) => {
    const selesai = k.kode.every((c) => c in state.jawaban);
    const cls = i === state.grup ? "active" : selesai ? "done" : "";
    return `<button type="button" class="${cls}" data-g="${i}" title="${esc(k.judul)}">${k.ikon} ${i + 1}</button>`;
  }).join("");
}

function updateProgress() {
  const n = Object.keys(state.jawaban).length;
  $("#answerCount").textContent = `${n} / ${TOTAL} dijawab`;
  $("#progressBar").style.width = (n / TOTAL) * 100 + "%";
  renderDots();
}

function renderGrup() {
  const k = KELOMPOK[state.grup];
  $("#groupTitle").innerHTML = `<span>${k.ikon}</span> ${esc(k.judul)}`;
  $("#qList").innerHTML = k.kode.map((kode) => {
    const g = GEJALA_MAP[kode];
    const v = state.jawaban[kode];
    return `
      <div class="q ${v !== undefined ? "answered" : ""}" data-kode="${kode}">
        <div class="q-head"><span class="q-code">${kode}</span><span class="q-text">${esc(g.teks)}</span></div>
        <div class="opts" role="radiogroup" aria-label="${esc(g.teks)}">
          ${PILIHAN_CF.map((p, i) => `
            <input type="radio" name="${kode}" id="${kode}_${i}" value="${p.nilai}" ${v === p.nilai ? "checked" : ""} />
            <label for="${kode}_${i}" class="o${i}">${p.label}</label>`).join("")}
        </div>
      </div>`;
  }).join("") + `<button type="button" class="btn btn-ghost btn-sm" id="allNo" style="align-self:flex-start;white-space:normal;text-align:center">Tandai sisa di bagian ini sebagai "Tidak"</button>`;

  $("#btnPrev").textContent = state.grup === 0 ? "← Data Anak" : "← Sebelumnya";
  $("#btnNext").textContent = state.grup === KELOMPOK.length - 1 ? "Lihat Hasil ✨" : "Selanjutnya →";
  $("#quizErr").classList.add("hidden");
  updateProgress();
}

$("#qList").addEventListener("change", (e) => {
  if (e.target.type !== "radio") return;
  state.jawaban[e.target.name] = Number(e.target.value);
  e.target.closest(".q").classList.add("answered");
  updateProgress();
});
$("#qList").addEventListener("click", (e) => {
  if (e.target.id !== "allNo") return;
  KELOMPOK[state.grup].kode.forEach((c) => { if (!(c in state.jawaban)) state.jawaban[c] = 0; });
  renderGrup();
});
$("#stepDots").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-g]");
  if (!b) return;
  state.grup = Number(b.dataset.g);
  renderGrup();
  $("#viewQuiz").scrollIntoView({ behavior: "smooth" });
});

$("#btnPrev").addEventListener("click", () => {
  if (state.grup === 0) return tampil("Form");
  state.grup--;
  renderGrup();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#btnNext").addEventListener("click", () => {
  const belum = KELOMPOK[state.grup].kode.filter((c) => !(c in state.jawaban));
  if (belum.length) {
    const err = $("#quizErr");
    err.textContent = `Masih ada ${belum.length} pertanyaan yang belum dijawab di bagian ini.`;
    err.classList.remove("hidden");
    $(`.q[data-kode="${belum[0]}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (state.grup < KELOMPOK.length - 1) {
    state.grup++;
    renderGrup();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  // Semua bagian harus terjawab
  const idx = KELOMPOK.findIndex((k) => k.kode.some((c) => !(c in state.jawaban)));
  if (idx !== -1) { state.grup = idx; renderGrup(); toast("Lengkapi dulu bagian yang belum dijawab"); return; }
  prosesHasil();
});

/* ---------- Hasil ---------- */
async function prosesHasil() {
  const hasil = hitungDiagnosa(state.jawaban);
  tampil("Loading");
  await new Promise((r) => setTimeout(r, 1200));

  if (!hasil) {
    renderTanpaGejala();
    tampil("Result");
    simpan(null);
    return;
  }
  renderHasil(hasil);
  tampil("Result");
  simpan(hasil);
}

async function simpan(hasil) {
  const data = {
    ...state.anak,
    jawaban: state.jawaban,
    hasil: hasil ? Object.fromEntries(hasil.belief.map((b) => [b.kode, Number(b.nilai.toFixed(6))])) : {},
    diagnosa_kode: hasil ? hasil.utama.kode : "-",
    diagnosa_nama: hasil ? hasil.utama.nama : "Tidak ada gejala",
    persentase: hasil ? Number((hasil.utama.nilai * 100).toFixed(2)) : 0,
  };
  const r = await DB.simpanKonsultasi(data);
  toast(r.ok ? "✓ Hasil konsultasi tersimpan" : "Gagal menyimpan riwayat: " + r.error);
}

function metaAnak() {
  const a = state.anak;
  return `<div class="child-meta">
    <span>${a.jenis_kelamin === "Laki-laki" ? "👦" : "👧"} ${esc(a.nama_anak)}</span>
    <span>🎂 ${teksUsia(a.usia_bulan)}</span>
    <span>📅 ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
  </div>`;
}

function renderTanpaGejala() {
  $("#resultBox").innerHTML = `
    <div class="panel fade-in" style="text-align:center">
      <div style="font-size:4rem">🌟</div>
      <h2 style="font-family:var(--display);font-weight:600;margin:6px 0">Tidak ada gejala yang dipilih</h2>
      <p style="color:var(--ink-2);max-width:520px;margin:0 auto">Berdasarkan jawaban Anda, tidak ditemukan tanda gangguan perkembangan pada ${esc(state.anak.nama_anak)}. Tetap pantau tumbuh kembang anak dan lakukan pemeriksaan rutin ke posyandu/dokter.</p>
      ${metaAnak().replace('class="child-meta"', 'class="child-meta" style="justify-content:center"')}
      <div class="result-actions"><button class="btn btn-ghost" data-go="beranda">🏠 Kembali ke Beranda</button><button class="btn btn-primary" data-go="baru">Konsultasi Baru</button></div>
    </div>`;
}

function renderHasil(h) {
  const u = h.utama;
  const persen = u.nilai * 100;
  const gejalaDipilih = h.eObs.map((e) => {
    const label = PILIHAN_CF.find((p) => p.nilai === e.cf)?.label || e.cf;
    return `<span><b>${e.kode}</b> ${esc(GEJALA_MAP[e.kode].teks)} · <i>${label}</i></span>`;
  }).join("");

  const f4 = (v) => v.toFixed(4);
  const tabelMass = h.eObs.map((e) => `<tr><td>${e.kode}</td><td class="num">${e.cf}</td>${e.m.map((v) => `<td class="num">${f4(v)}</td>`).join("")}<td class="num">${f4(e.theta)}</td></tr>`).join("");
  const tabelLangkah = h.langkah.map((l, i) => `<tr><td>${i + 1}</td><td>⊕ ${l.dengan}</td><td class="num">${f4(l.K)}</td>${l.hasil.m.map((v) => `<td class="num">${f4(v)}</td>`).join("")}<td class="num">${f4(l.hasil.theta)}</td><td>${l.dilewati ? "Konflik total, dilewati" : ""}</td></tr>`).join("");
  const headH = GANGGUAN.map((g) => `<th>${g.kode}</th>`).join("");

  $("#resultBox").innerHTML = `
    <div class="panel fade-in">
      <div class="result-hero">
        <div class="ring" id="ring" style="--c:${u.warna}"><div><b id="ringVal">0%</b><small>Belief</small></div></div>
        <div>
          <div class="eyebrow">Hasil Skrining Awal</div>
          <h2>Kemungkinan mengarah pada <span style="color:${u.warna}">${u.nama}</span></h2>
          <p style="color:var(--ink-2);margin:0">${u.deskripsi}</p>
          ${metaAnak()}
        </div>
      </div>
    </div>

    <div class="panel fade-in" style="margin-top:20px">
      <h3 style="margin:0 0 18px;font-size:1.15rem">📊 Nilai belief setiap gangguan</h3>
      <div class="bars">
        ${h.urut.map((b) => `
          <div class="bar-row">
            <div class="name">${b.nama}<small>${b.kode} · ${b.singkat}</small></div>
            <div class="bar-track"><div class="bar-fill" style="--c:${b.warna}" data-w="${(b.nilai * 100).toFixed(2)}"></div></div>
            <div class="val">${pct(b.nilai)}</div>
          </div>`).join("")}
      </div>
    </div>

    <div class="grid-2" style="margin-top:20px">
      <div class="card fade-in">
        <h3>🏡 Saran penanganan awal di rumah</h3>
        <ul class="tips">${SARAN[u.kode].map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </div>
      <div class="card fade-in">
        <h3>📝 Gejala yang Anda pilih (${h.eObs.length})</h3>
        <div class="symptom-tags">${gejalaDipilih}</div>
      </div>
    </div>

    <div class="notice fade-in" style="margin-top:20px">
      <span>⚠️</span>
      <div>Hasil deteksi ini merupakan <b>skrining awal</b> dan tidak menggantikan pemeriksaan serta diagnosis oleh psikolog atau dokter. Disarankan berkonsultasi dengan tenaga profesional untuk memastikan kondisi anak.</div>
    </div>

    <details class="calc card">
      <summary>Lihat detail perhitungan Dempster-Shafer</summary>
      <p style="color:var(--ink-2);font-size:.9rem">Mass function tiap gejala: m(H) = CF<sub>norm</sub> × CF<sub>user</sub>, m(θ) = 1 − CF<sub>user</sub></p>
      <div class="table-wrap"><table class="t"><thead><tr><th>Gejala</th><th>CF user</th>${headH}<th>θ</th></tr></thead><tbody>${tabelMass}</tbody></table></div>
      ${h.langkah.length ? `<p style="color:var(--ink-2);font-size:.9rem;margin-top:18px">Kombinasi bertahap (K = konflik):</p>
      <div class="table-wrap"><table class="t"><thead><tr><th>#</th><th>Kombinasi</th><th>K</th>${headH}<th>θ</th><th></th></tr></thead><tbody>${tabelLangkah}</tbody></table></div>` : ""}
    </details>

    <div class="result-actions">
      <button class="btn btn-ghost" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
      <button class="btn btn-ghost" data-go="beranda">🏠 Kembali ke Beranda</button>
      <button class="btn btn-primary" data-go="baru">Konsultasi Baru</button>
    </div>`;

  // Animasi
  requestAnimationFrame(() => {
    setTimeout(() => {
      $$(".bar-fill").forEach((b) => (b.style.width = b.dataset.w + "%"));
      animRing(persen);
    }, 80);
  });
}

function animRing(target) {
  const ring = $("#ring"), val = $("#ringVal");
  const start = performance.now(), dur = 1100;
  function step(t) {
    const p = Math.min(1, (t - start) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    const v = target * e;
    ring.style.setProperty("--p", v);
    val.textContent = v.toFixed(v >= 99.995 ? 0 : 1).replace(".", ",") + "%";
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
