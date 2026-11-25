# cucisepatu.bjb (NEO Sneakers Lab | Nota Online)

Aplikasi web manajemen pesanan dan nota elektronik (nota online) untuk layanan cuci sepatu **cucisepatu.bjb** di Banjarbaru, Kalimantan Selatan. Aplikasi ini memudahkan pelanggan memantau status cucian sepatu secara online serta membantu admin mencatat pesanan dan mengirimkan faktur elektronik melalui WhatsApp.

## Fitur Utama

- **Cek Status Pesanan (`/`)**: Pelanggan dapat mencari pesanan dengan memasukkan nomor nota (format `CSB-...`).
- **Nota Elektronik Publik (`/nota/[id]`)**: Menampilkan detail pesanan secara publik, meliputi nomor nota, nama pelanggan, tanggal masuk, total tagihan, status pengerjaan (`Proses` / `Selesai`), status pembayaran (`Lunas` / `Belum Lunas`), dan foto kondisi awal sepatu (*before*).
- **Autentikasi Admin (`/login`)**: Proteksi rute `/admin/*` menggunakan middleware dan cookie sesi `admin_auth` (`httpOnly`) melalui endpoint `/api/login` dan `/api/logout`.
- **Dashboard Admin (`/admin/dashboard`)**: Menampilkan daftar pesanan terbaru dari database, fitur pencarian berdasarkan nama pelanggan atau nomor nota, serta pengubahan status pengerjaan (otomatis mengisi `completed_at` saat `Selesai`) dan status pembayaran.
- **Input Pesanan & Kirim Nota WhatsApp (`/admin/tambah`)**: Form penambahan pesanan baru (foto sebelum cuci, nama pelanggan, nomor WhatsApp, dan harga layanan), unggah foto ke Supabase Storage (`shoe-photos`), pembuatan nomor nota otomatis (`CSB-<timestamp>`), serta pengalihan ke tautan WhatsApp (`wa.me`) berisi ringkasan faktur elektronik dan tautan nota.

## Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org/) (`16.2.6`, App Router)
- **UI & Bahasa**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Ikon**: Lucide React
- **Database & Storage**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`) — tabel `orders` dan bucket storage `shoe-photos`

## Struktur Proyek

```text
cucisepatubjb/
├── app/
│   ├── admin/
│   │   ├── dashboard/page.tsx   # Dashboard daftar & status pesanan admin
│   │   └── tambah/page.tsx      # Form input pesanan & generator tautan WhatsApp
│   ├── api/
│   │   ├── login/route.ts       # API login admin
│   │   └── logout/route.ts      # API logout admin
│   ├── login/page.tsx           # Halaman login admin
│   ├── nota/[id]/page.tsx       # Halaman detail nota elektronik publik
│   ├── globals.css              # Konfigurasi style global
│   ├── layout.tsx               # Root layout aplikasi
│   └── page.tsx                 # Halaman utama (pencarian nomor nota)
├── lib/
│   └── supabase.ts              # Inisialisasi client Supabase
├── middleware.ts                # Middleware proteksi rute /admin/* dan /login
├── next.config.ts
└── package.json
```

## Konfigurasi Environment

Buat file `.env.local` di root proyek (mengacu pada `.env.example` jika tersedia) dan isi variabel lingkungan berikut sesuai konfigurasi Supabase dan kata sandi admin Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

## Instalasi & Menjalankan Proyek

1. **Clone repositori dan masuk ke direktori proyek:**

   ```bash
   git clone https://github.com/BevandJanuartama/cucisepatubjb.git
   cd cucisepatubjb
   ```

2. **Install dependensi:**

   ```bash
   npm install
   ```

3. **Siapkan environment variable** pada `.env.local` sesuai bagian [Konfigurasi Environment](#konfigurasi-environment).

4. **Jalankan server pengembangan:**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser.

5. **Perintah lain yang tersedia:**

   ```bash
   npm run build   # Build aplikasi untuk produksi
   npm run start   # Menjalankan hasil build produksi
   npm run lint    # Menjalankan pemeriksaan ESLint
   ```
