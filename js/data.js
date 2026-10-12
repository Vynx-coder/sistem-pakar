/* =========================================================
   BASIS PENGETAHUAN
   Sumber: Manual Bab 4 (Tabel 4.1 – 4.4)
   ========================================================= */

// Tabel 4.1 Jenis gangguan perkembangan anak (usia 1–5 tahun)
const GANGGUAN = [
  { kode: "H1", nama: "Autism Spectrum Disorder", singkat: "ASD", warna: "#7c5cff",
    deskripsi: "Gangguan perkembangan yang membuat anak kesulitan berinteraksi dan berkomunikasi dengan orang lain, misalnya jarang menatap mata atau tidak menoleh saat dipanggil. Anak juga cenderung melakukan hal yang sama berulang-ulang dan hanya tertarik pada hal tertentu saja. Tanda-tandanya biasanya sudah terlihat sejak usia dini dan memengaruhi cara anak bergaul dengan orang di sekitarnya." },
  { kode: "H2", nama: "Attention Deficit Hyperactivity Disorder", singkat: "ADHD", warna: "#ff7a59",
    deskripsi: "Gangguan yang membuat anak sulit fokus atau memusatkan perhatian, sangat aktif bergerak hingga sulit diam, dan sering bertindak tanpa berpikir terlebih dahulu. Perilaku ini terlihat di lebih dari satu tempat, misalnya di rumah dan juga saat bermain dengan anak lain." },
  { kode: "H3", nama: "Speech Delay", singkat: "Speech Delay", warna: "#21b6a8",
    deskripsi: "Keterlambatan bicara terjadi ketika kemampuan bahasa anak tertinggal dibandingkan anak seusianya. Anak bisa kesulitan memahami ucapan orang lain, kesulitan mengungkapkan keinginannya dengan kata-kata, atau keduanya." },
  { kode: "H4", nama: "Global Developmental Delay", singkat: "GDD", warna: "#f5b301",
    deskripsi: "Keterlambatan perkembangan yang terjadi pada beberapa kemampuan sekaligus, misalnya gerak tubuh (duduk, merangkak, berjalan), bicara, berpikir, bergaul, dan kemandirian, sehingga anak tertinggal dibandingkan anak seusianya." },
  { kode: "H5", nama: "Intellectual Disability", singkat: "ID", warna: "#3b82f6",
    deskripsi: "Gangguan yang membuat kemampuan berpikir anak lebih terbatas dibandingkan anak seusianya, misalnya dalam memahami sesuatu, memecahkan masalah sederhana, dan belajar dari pengalaman. Anak juga lebih sulit menyesuaikan diri dan melakukan kegiatan sehari-hari, seperti makan atau berpakaian sendiri." },
  { kode: "H6", nama: "Sensory Processing Disorder", singkat: "SPD", warna: "#ec4899",
    deskripsi: "Kondisi ketika anak kesulitan menerima, mengolah, dan menanggapi rangsangan dari sekitarnya, seperti suara, sentuhan, atau tekstur. Akibatnya anak bisa terlalu peka (misalnya menutup telinga saat mendengar suara biasa atau menolak disentuh) atau justru kurang peka (misalnya tidak merasa sakit saat terjatuh). Hal ini dapat memengaruhi perilaku, sikap tubuh, dan cara anak bergaul dengan orang lain." },
];

// Tabel 4.2 Gejala pada gangguan perkembangan anak
const GEJALA = [
  "Anak saya tidak menatap mata saat diajak bicara", // E1
  "Anak saya tidak menunjuk benda untuk mengajak Anda ikut melihat sesuatu yang menarik baginya (misalnya menunjuk pesawat)", // E2
  "Anak saya tidak menoleh atau merespons saat dipanggil namanya, padahal pendengarannya normal", // E3
  "Ekspresi wajah anak saya tidak sesuai situasi (misalnya tidak tersenyum saat diajak bercanda)", // E4
  "Anak saya tidak tertarik bermain dengan anak lain", // E5
  "Anak saya tidak memahami perasaan orang lain (misalnya tidak peduli saat orang lain sedih atau marah)", // E6
  "Anak saya sering mengulang-ulang kata atau kalimat yang ia dengar", // E7
  "Anak saya sering melakukan gerakan yang sama berulang-ulang dan hanya tertarik pada hal tertentu saja", // E8
  "Anak saya sangat terganggu oleh suara keras", // E9
  "Anak saya sering menutup telinga tanpa alasan yang jelas", // E10
  "Anak saya sangat suka memandangi cahaya atau benda yang berputar secara berlebihan", // E11
  "Anak saya tidak bisa fokus lama saat bermain", // E12
  "Anak saya sering tidak menyelesaikan kegiatan yang sudah ia mulai", // E13
  "Anak saya seperti tidak mendengarkan saat diajak bicara", // E14
  "Perhatian anak saya mudah teralihkan oleh hal kecil di sekitarnya", // E15
  "Anak saya tidak bisa duduk dengan tenang", // E16
  "Anak saya sangat aktif, sering berlari atau memanjat tanpa tujuan", // E17
  "Anak saya sering memotong pembicaraan orang lain", // E18
  "Anak saya tidak sabar menunggu giliran", // E19
  "Anak saya sering bertindak tanpa berpikir (misalnya langsung mengambil barang milik orang lain)", // E20
  "Anak saya terlambat mengoceh, mengucapkan kata, atau merangkai kata dibandingkan anak seusianya", // E21
  "Anak saya tidak menirukan suara atau kata yang ia dengar", // E22
  "Anak saya lebih sering memakai isyarat tangan atau tubuh daripada berbicara", // E23
  "Anak saya kesulitan memahami perintah sederhana (misalnya \"ambil bola\")", // E24
  "Anak saya terlambat bisa duduk, merangkak, atau berjalan", // E25
  "Kemampuan bicara anak saya jauh tertinggal dibandingkan anak seusianya", // E26
  "Anak saya sulit mengenali benda atau warna sederhana", // E27
  "Anak saya kurang menanggapi saat diajak berinteraksi (misalnya saat diajak bermain atau disapa)", // E28
  "Anak saya belum bisa makan atau berpakaian sendiri seperti anak seusianya", // E29
  "Anak saya sering menjatuhkan benda yang dipegangnya", // E30
  "Anak saya kesulitan menyusun balok", // E31
  "Anak saya kesulitan memakai sendok atau alat makan", // E32
  "Gerakan anak saya terlihat kaku atau canggung", // E33
  "Anak saya kesulitan menyelaraskan gerakan tangan dan mata (misalnya saat menangkap bola)", // E34
  "Anak saya sulit memahami dan mengikuti arahan sederhana, meskipun sudah dijelaskan berulang kali", // E35
  "Anak saya lambat memahami hal-hal dasar seperti warna dan angka", // E36
  "Anak saya belum mandiri seperti anak seusianya", // E37
  "Anak saya kesulitan melakukan kegiatan sehari-hari (misalnya mandi, makan, atau merapikan mainan)", // E38
  "Anak saya jarang berinteraksi atau bergaul dengan orang lain", // E39
  "Anak saya mudah ikut-ikutan atau dipengaruhi orang lain", // E40
  "Anak saya menutup telinga saat mendengar suara yang sebenarnya biasa saja", // E41
  "Anak saya menolak atau tidak suka disentuh", // E42
  "Anak saya sangat pilih-pilih makanan karena teksturnya (misalnya hanya mau makanan yang lembek)", // E43
  "Anak saya seperti tidak merasa sakit (misalnya tidak menangis saat terjatuh atau terbentur)", // E44
  "Anak saya sering mencari rangsangan seperti melompat-lompat atau menabrakkan diri", // E45
  "Anak saya mudah marah", // E46
  "Anak saya sering kesal atau mudah tersinggung", // E47
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
