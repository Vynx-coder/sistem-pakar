/* =========================================================
   MESIN INFERENSI: Dempster-Shafer + Certainty Factor
   Mengikuti alur Manual Bab 4.2:
   1. Filter E_obs (CF_user > 0)
   2. Normalisasi CF pakar per gejala        (pers. 2.2)
   3. Mass function: m(Hj) = CFnorm × CFuser,
      m(θ) = 1 − CFuser                        (pers. 2.3, 2.4)
   4. Kombinasi Dempster bertahap              (pers. 2.5)
   5. Belief akhir → hipotesis tertinggi
   ========================================================= */

const JUMLAH_H = 6;

function hitungDiagnosa(jawaban) {
  // jawaban: { E1: 0.8, E7: 0.6, ... }
  const eObs = GEJALA
    .map((g, i) => ({ kode: g.kode, idx: i, cf: Number(jawaban[g.kode] || 0) }))
    .filter((e) => e.cf > 0);

  if (eObs.length === 0) return null;

  // Langkah 2 & 3: normalisasi + mass function tiap gejala
  const massList = eObs.map((e) => {
    const baris = CF_PAKAR[e.idx];
    const total = baris.reduce((a, b) => a + b, 0);
    const norm = baris.map((v) => (total > 0 ? v / total : 0));
    const m = norm.map((v) => v * e.cf);
    return { kode: e.kode, cf: e.cf, norm, m, theta: 1 - e.cf };
  });

  // Langkah 4: kombinasi bertahap.
  // Fokus hanya singleton {Hj} dan θ, sehingga:
  //   {Hi}∩{Hj} = {Hi} jika i=j, ∅ jika i≠j;  {Hi}∩θ = {Hi};  θ∩θ = θ
  let gabungan = { m: massList[0].m.slice(), theta: massList[0].theta };
  const langkah = [];

  for (let s = 1; s < massList.length; s++) {
    const b = massList[s];
    const pembilang = new Array(JUMLAH_H).fill(0);
    let K = 0;
    for (let i = 0; i < JUMLAH_H; i++) {
      for (let j = 0; j < JUMLAH_H; j++) {
        const p = gabungan.m[i] * b.m[j];
        if (i === j) pembilang[i] += p;
        else K += p;
      }
      pembilang[i] += gabungan.m[i] * b.theta + gabungan.theta * b.m[i];
    }
    const thetaBaru = gabungan.theta * b.theta;

    if (1 - K < 1e-12) {
      // Konflik total (K = 1): rumus Dempster tidak terdefinisi.
      // Bukti ini dilewati agar perhitungan tetap berjalan.
      langkah.push({ dengan: b.kode, K: 1, dilewati: true, hasil: { m: gabungan.m.slice(), theta: gabungan.theta } });
      continue;
    }
    gabungan = {
      m: pembilang.map((v) => v / (1 - K)),
      theta: thetaBaru / (1 - K),
    };
    langkah.push({ dengan: b.kode, K, dilewati: false, hasil: { m: gabungan.m.slice(), theta: gabungan.theta } });
  }

  // Langkah 5: belief akhir
  const belief = GANGGUAN.map((g, i) => ({ ...g, nilai: gabungan.m[i] }));
  const urut = belief.slice().sort((a, b) => b.nilai - a.nilai);

  return {
    eObs: massList,
    langkah,
    belief,
    theta: gabungan.theta,
    utama: urut[0],
    urut,
  };
}

// Ekspor untuk pengujian di Node.js (diabaikan di browser)
if (typeof module !== "undefined") module.exports = { hitungDiagnosa };
