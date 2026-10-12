/* =========================================================
   BASIS PENGETAHUAN
   Sumber: Manual Bab 4 (Tabel 4.1 – 4.4)
   ========================================================= */

// Tabel 4.1 Jenis gangguan perkembangan anak (usia 1–5 tahun)
const GANGGUAN = [
  { kode: "H1", nama: "Autism Spectrum Disorder", singkat: "ASD", warna: "#7c5cff",
    deskripsi: "Gangguan perkembangan yang memengaruhi komunikasi, interaksi sosial, serta ditandai pola perilaku dan minat yang berulang." },
  { kode: "H2", nama: "Attention Deficit Hyperactivity Disorder", singkat: "ADHD", warna: "#ff7a59",
    deskripsi: "Gangguan yang ditandai kesulitan memusatkan perhatian, hiperaktivitas, dan perilaku impulsif." },
  { kode: "H3", nama: "Speech Delay", singkat: "Speech Delay", warna: "#21b6a8",
    deskripsi: "Keterlambatan kemampuan berbicara dan berbahasa dibandingkan anak seusianya." },
  { kode: "H4", nama: "Global Developmental Delay", singkat: "GDD", warna: "#f5b301",
    deskripsi: "Keterlambatan pada dua atau lebih area perkembangan (motorik, bahasa, kognitif, sosial, kemandirian)." },
  { kode: "H5", nama: "Intellectual Disability", singkat: "ID", warna: "#3b82f6",
    deskripsi: "Keterbatasan fungsi intelektual dan perilaku adaptif dalam kehidupan sehari-hari." },
  { kode: "H6", nama: "Sensory Processing Disorder", singkat: "SPD", warna: "#ec4899",
    deskripsi: "Kesulitan otak dalam menerima dan merespons rangsangan sensorik (suara, sentuhan, tekstur, gerak)." },
];

// Tabel 4.2 Gejala pada gangguan perkembangan anak
const GEJALA = [
  "Tidak melakukan kontak mata saat diajak bicara",
  "Tidak menunjuk benda untuk berbagi minat (joint attention)",
  "Tidak merespon saat dipanggil (meskipun pendengaran normal)",
  "Tidak menunjukkan ekspresi wajah sesuai situasi",
  "Tidak tertarik bermain dengan anak lain",
  "Tidak memahami emosi orang lain",
  "Mengulang kata",
  "Menunjukkan perilaku berulang dan minat yang sangat terbatas",
  "Sangat sensitif terhadap suara keras",
  "Menutup telinga tanpa sebab jelas",
  "Menyukai cahaya/putaran berlebihan",
  "Tidak mampu mempertahankan perhatian saat bermain",
  "Tidak menyelesaikan aktivitas",
  "Tidak mendengarkan saat diajak bicara",
  "Mudah terdistraksi oleh stimulus kecil",
  "Tidak bisa duduk tenang",
  "Hiperaktif berlebihan, berlari/memanjat tanpa tujuan",
  "Menyela pembicaraan",
  "Tidak sabar menunggu giliran",
  "Bertindak tanpa berpikir (misal langsung mengambil barang)",
  "Terlambat mengoceh, mengucapkan kata, atau menggabungkan kata sesuai usia",
  "Tidak meniru suara atau kata",
  "Lebih sering menggunakan gestur daripada bicara",
  "Kesulitan memahami perintah sederhana",
  "Terlambat duduk, merangkak, berjalan",
  "Keterlambatan bicara signifikan",
  "Sulit mengenali benda/warna sederhana",
  "Kurang respons sosial",
  "Tidak bisa makan/berpakaian sesuai usia",
  "Sering menjatuhkan benda",
  "Kesulitan menyusun balok",
  "Sulit menggunakan sendok/alat makan",
  "Gerakan tampak kikuk",
  "Kesulitan koordinasi tangan-mata",
  "Sulit memahami instruksi sederhana",
  "Lambat belajar konsep dasar (warna, angka)",
  "Tidak mandiri sesuai usia",
  "Kesulitan aktivitas sehari-hari",
  "Interaksi sosial terbatas",
  "Mudah dipengaruhi orang lain",
  "Menutup telinga terhadap suara biasa",
  "Menolak disentuh",
  "Pilih-pilih makanan ekstrem (tekstur)",
  "Tidak respons terhadap rasa sakit",
  "Sering mencari rangsangan (melompat, menabrak)",
  "Mudah marah",
  "Sering kesal/tersinggung",
].map((teks, i) => ({ kode: "E" + (i + 1), teks }));

// Tabel 4.3 CF pakar P(E|H) — kolom: H1, H2, H3, H4, H5, H6
const CF_PAKAR = [
  [0.9, 0.8, 0.3, 0.3, 0.2, 0.1], // E1
  [0.9, 0.8, 0.3, 0.4, 0,   0  ], // E2
  [0.8, 0.5, 0.3, 0.2, 0.2, 0.5], // E3
  [0.8, 0.5, 0.2, 0.2, 0.3, 0.5], // E4
  [0.9, 0.7, 0,   0.2, 0,   0.3], // E5
  [0.7, 0.7, 0,   0.3, 0.5, 0.3], // E6
  [0.9, 0.8, 0,   0,   0,   0  ], // E7
  [0.9, 0,   0,   0,   0,   0  ], // E8
  [0.9, 0,   0.1, 0.2, 0,   0.5], // E9
  [0.8, 0,   0,   0,   0,   0.5], // E10
  [0.7, 0,   0,   0,   0,   0  ], // E11
  [0.8, 0.9, 0,   0,   0,   0  ], // E12
  [0.7, 0.9, 0,   0,   0,   0  ], // E13
  [0.7, 0.9, 0.1, 0.3, 0.2, 0.2], // E14
  [0.2, 0.1, 0.2, 0.3, 0.2, 0.2], // E15
  [0.3, 1,   0,   0,   0,   0  ], // E16
  [0,   1,   0,   0,   0,   0  ], // E17
  [0,   0.8, 0,   0,   0,   0  ], // E18
  [0.2, 0.8, 0.1, 0,   0,   0  ], // E19
  [0.2, 0.9, 0,   0,   0,   0  ], // E20
  [0.1, 0.1, 0.9, 0.2, 0,   0  ], // E21
  [0.1, 0.1, 0.8, 0.2, 0,   0.3], // E22
  [0.2, 0.3, 0.9, 0.2, 0.5, 0.5], // E23
  [0.5, 0.5, 0.8, 0.7, 0.7, 0.5], // E24
  [0.3, 0.3, 0.7, 0.8, 0.3, 0.2], // E25
  [0.5, 0.4, 0.9, 0.8, 0.5, 0.4], // E26
  [0.5, 0.5, 0.6, 0.8, 0.7, 0.4], // E27
  [0.7, 0.7, 0.1, 0.8, 0.2, 0.4], // E28
  [0.5, 0.5, 0,   0.7, 0,   0  ], // E29
  [0,   0,   0,   0.2, 0,   0.5], // E30
  [0,   0,   0,   0.2, 0,   0.3], // E31
  [0,   0,   0,   0,   0,   0.3], // E32
  [0.1, 0.1, 0,   0,   0,   0.3], // E33
  [0.5, 0.6, 0,   0.5, 0,   0.3], // E34
  [0.3, 0.4, 0,   0.5, 0.9, 0.3], // E35
  [0.1, 0.1, 0.5, 0.5, 0.8, 0.2], // E36
  [0.7, 0.3, 0.1, 0.5, 0.9, 0  ], // E37
  [0.7, 0.5, 0,   0,   0.8, 0.3], // E38
  [0.7, 0.7, 0,   0.3, 0.7, 0.2], // E39
  [0,   0,   0,   0.2, 0.8, 0  ], // E40
  [0.1, 0,   0,   0,   0,   0.9], // E41
  [0,   0,   0,   0,   0,   0.8], // E42
  [0.3, 0.3, 0.2, 0,   0,   0.8], // E43
  [0.7, 0.4, 0,   0,   0,   0.5], // E44
  [0.1, 0.6, 0,   0,   0,   0.5], // E45
  [0,   0.3, 0.3, 0.2, 0,   0.3], // E46
  [0.5, 0,   0,   0,   0,   0  ], // E47
];

// Tabel 4.4 Saran penanganan awal
const SARAN = {
  H1: [
    "Ajak anak bermain tatap muka (face to face) setiap hari",
    "Latih kontak mata saat memberi sesuatu (tunggu anak melihat dulu)",
    "Gunakan permainan sederhana seperti cilukba atau meniru ekspresi",
    "Panggil nama anak dengan suara lembut dan konsisten",
    "Kurangi screen time, perbanyak interaksi langsung",
    "Gunakan rutinitas harian yang terstruktur (jadwal tetap)",
    "Diet Gluten (mengurangi makanan yang terbuat dari tepung terigu atau gandum)",
  ],
  H2: [
    "Berikan aktivitas fisik terarah (lari, lompat, bermain luar)",
    "Buat kegiatan dalam durasi pendek (5–10 menit)",
    "Gunakan instruksi singkat dan jelas (1 perintah saja)",
    "Beri pujian saat anak bisa fokus atau tenang",
    "Hindari lingkungan yang terlalu ramai atau banyak distraksi",
    "Buat jadwal harian sederhana dan konsisten",
    "Diet Gluten (mengurangi makanan yang terbuat dari tepung terigu atau gandum)",
  ],
  H3: [
    "Sering ajak anak berbicara dalam aktivitas sehari-hari",
    "Sebutkan nama benda yang sedang digunakan (misalnya: \"ini bola\")",
    "Bacakan buku bergambar dan ajak anak menunjuk",
    "Tiru suara anak lalu kembangkan jadi kata",
    "Jangan langsung memenuhi keinginan, tunggu anak mencoba bicara",
    "Batasi penggunaan gadget",
  ],
  H4: [
    "Latih motorik: bermain bola, berjalan, menyusun benda",
    "Latih kognitif: mengenal warna, bentuk, benda sekitar",
    "Latih bahasa: ajak bicara sederhana setiap hari",
    "Latih kemandirian: makan sendiri, pakai baju sederhana",
    "Berikan stimulasi rutin sesuai usia",
    "Buat aktivitas harian yang terstruktur",
  ],
  H5: [
    "Ajarkan hal sederhana secara bertahap dan berulang",
    "Gunakan contoh langsung (visual) saat mengajarkan sesuatu",
    "Latih aktivitas sehari-hari secara rutin (makan, mandi)",
    "Gunakan bahasa sederhana dan jelas",
    "Beri pujian untuk setiap kemajuan kecil",
    "Jangan memberi terlalu banyak instruksi sekaligus",
  ],
  H6: [
    "Ciptakan lingkungan yang nyaman (tidak terlalu bising atau ramai)",
    "Perkenalkan berbagai rangsangan (suara, sentuhan, tekstur) secara bertahap",
    "Ajak anak melakukan aktivitas fisik seperti bermain, melompat, atau berlari",
    "Gunakan permainan yang melibatkan sentuhan dan koordinasi (misalnya bola, pasir, air)",
    "Biasakan sentuhan secara perlahan agar anak lebih nyaman",
    "Perkenalkan variasi makanan secara bertahap tanpa paksaan",
    "Berikan rutinitas harian yang teratur agar anak merasa aman",
    "Amati respon anak terhadap rangsangan dan sesuaikan aktivitas",
  ],
};

// Pilihan jawaban & nilai CF user (sesuai Tabel 4.5)
const PILIHAN_CF = [
  { label: "Tidak", nilai: 0 },
  { label: "Sedikit Yakin", nilai: 0.4 },
  { label: "Cukup Yakin", nilai: 0.6 },
  { label: "Yakin", nilai: 0.8 },
  { label: "Sangat Yakin", nilai: 1 },
];

// Pengelompokan gejala agar kuesioner lebih nyaman diisi (urutan kode tetap)
const KELOMPOK = [
  { judul: "Interaksi Sosial & Komunikasi", ikon: "🤝", kode: ["E1","E2","E3","E4","E5","E6","E7","E8"] },
  { judul: "Respons Sensorik", ikon: "👂", kode: ["E9","E10","E11","E41","E42","E43","E44","E45"] },
  { judul: "Perhatian & Perilaku", ikon: "🎯", kode: ["E12","E13","E14","E15","E16","E17","E18","E19","E20"] },
  { judul: "Bicara & Bahasa", ikon: "💬", kode: ["E21","E22","E23","E24","E26"] },
  { judul: "Motorik", ikon: "🧸", kode: ["E25","E30","E31","E32","E33","E34"] },
  { judul: "Kognitif & Kemandirian", ikon: "🧩", kode: ["E27","E28","E29","E35","E36","E37","E38","E39","E40"] },
  { judul: "Emosi", ikon: "🌈", kode: ["E46","E47"] },
];
