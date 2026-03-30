# Field Connected — Technical Documentation

## Deskripsi Fitur
Aplikasi **Field Connected** adalah platform manajemen ekosistem sepak bola (Grassroots) yang menghubungkan Sekolah Sepak Bola (SSB), Event Organizer (EO), dan Pelatih (Coach). Aplikasi ini menyediakan alat untuk manajemen pemain, pendaftaran kompetisi, jadwal latihan, absensi, dan pembayaran.

## Arsitektur & Teknologi
- **Frontend**: React 18, Vite, TypeScript.
- **Styling**: Tailwind CSS, Radix UI (via shadcn/ui).
- **Backend-as-a-Service**: Supabase (Auth, Database PostgreSQL, Storage, Edge Functions).
- **State Management**: TanStack Query (React Query) v5.
- **Routing**: React Router DOM v6.
- **Form Handling**: React Hook Form + Zod.

## Alur Bisnis Utama
1.  **Modul SSB (Sekolah Sepak Bola)**
    - Manajemen Pemain: Pendaftaran pemain dengan validasi NIK dan Nama Ibu Kandung (terenkripsi).
    - Pendaftaran Kompetisi: Mendaftarkan tim ke turnamen yang diselenggarakan oleh EO.
    - Pembayaran: Pelacakan status iuran bulanan atau pendaftaran turnamen.
2.  **Modul EO (Event Organizer)**
    - Manajemen Kompetisi: Membuat turnamen, mengatur kategori umur, dan jadwal pertandingan.
    - Verifikasi Registrasi: Meninjau pendaftaran dari SSB dan mengelola klasemen (*standings*).
3.  **Modul Coach (Pelatih)**
    - Manajemen Tim: Melihat roster pemain dan jadwal latihan.
    - Absensi: Mencatat kehadiran pemain dalam sesi latihan atau pertandingan.

## Struktur Data (Skema Database)
- **`players`**: Data inti pemain dengan enkripsi pgsodium pada kolom sensitif (NIK, Nama Ibu).
- **`teams`**: Grup pemain dalam satu SSB atau kategori umur.
- **`competitions`**: Detail turnamen yang dibuat oleh EO.
- **`registrations`**: Relasi antara tim (SSB) dan kompetisi (EO).
- **`player_attendances`**: Catatan kehadiran untuk sesi latihan/pertandingan.

## Panduan Pengembangan
### Prasyarat
- Node.js (v18+)
- Supabase CLI (untuk migrasi database)

### Instalasi
```bash
npm install
```

### Konfigurasi Lingkungan (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Jalankan Pengembangan
```bash
npm run dev
```

## Kontak & Penanggung Jawab
- **Versi**: 1.0.0
- **Tanggal**: 2026-03-30
- **Tim**: Development Team (Field Connected)
