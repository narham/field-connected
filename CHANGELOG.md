# CHANGELOG — Field Connected

Semua perubahan pada proyek ini akan didokumentasikan di sini.

## [1.0.0] - 2026-03-30

### Ditambahkan
- **Modul SSB**: Implementasi manajemen pemain dengan enkripsi data sensitif (NIK, Nama Ibu).
- **Modul EO**: Manajemen pendaftaran kompetisi dan klasemen tim.
- **Modul Coach**: Fitur roster tim, jadwal latihan, dan pencatatan absensi.
- **Skema Database (Migrasi)**:
  - `20260330100000_player_management.sql`: Skema dasar pemain, tim, dan kehadiran.
  - `20260330110000_simple_players.sql`: Penyederhanaan model data pemain.
  - `20260330120000_coach_module.sql`: Skema khusus untuk kebutuhan operasional pelatih.
- **UI/UX**: Komponen UI berbasis **shadcn/ui** untuk konsistensi di seluruh platform.

### Diubah
- Migrasi dari struktur monolitik ke arsitektur berbasis peran (*SSB*, *EO*, *Coach*).
- Pembaruan `App.tsx` untuk mendukung *nested routing* yang lebih terorganisir.

### Keamanan
- Implementasi enkripsi kolom `nik` dan `nama_ibu_kandung` menggunakan ekstensi `pgsodium` di Supabase.
- Penambahan *auth guards* pada layout utama untuk membatasi akses berdasarkan peran pengguna.

## [Inisialisasi] - 2026-03-29
- Pengaturan proyek awal dengan Vite, React, dan Tailwind CSS.
- Integrasi Supabase Client.
