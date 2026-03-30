

# Football Grassroots Ecosystem Platform

## Overview
Platform terpadu untuk manajemen SSB (Akademi Sepak Bola) dan Event Organizer kompetisi grassroots, dengan database pemain terpusat. Desain Clean & Modern, mobile-first untuk modul SSB.

## Phase 1: Foundation & Auth
- **Koneksi Supabase** — User menghubungkan project Supabase external
- **Database Schema** — Setup semua tabel inti: `organizations`, `user_roles`, `clubs`, `teams`, `players`, `coaches`, `training_sessions`, `attendance`, `payments`, `competitions`, `categories`, `registrations`, `matches`, `standings`, `player_stats`, `player_global_profile`, `player_competition_history`
- **Multi-tenant RLS** — Semua tabel dilindungi `organization_id` dengan Row Level Security
- **Auth** — Email + Google login, role-based access (Super Admin, SSB Admin, EO Admin, Coach)
- **Role management** — Tabel `user_roles` terpisah dengan enum `app_role`

## Phase 2: SSB Management (Mobile-First)
- **Dashboard SSB** — Overview ringkasan: jumlah pemain aktif, jadwal hari ini, tagihan pending
- **Player Management** — CRUD pemain (profil, umur, posisi, data orang tua), status aktif/nonaktif, riwayat klub
- **Training Management** — Jadwal latihan, pembagian kelompok umur, kalender latihan
- **Attendance** — Absensi manual per sesi latihan, statistik kehadiran per pemain
- **Coach Management** — Data pelatih, penugasan ke tim, jadwal
- **Payment System** — Iuran bulanan, buat tagihan, tracking status pembayaran (lunas/belum)

## Phase 3: Competition System (EO Module)
- **Dashboard EO** — Overview kompetisi aktif, pendaftaran masuk
- **Competition Management** — Buat turnamen/liga, pilih format (group stage, knockout, group+knockout), multi kategori umur
- **Team Registration** — SSB mendaftarkan tim ke kompetisi, upload roster pemain
- **Player Validation** — Cek umur pemain otomatis dari database terpusat (anti curang)
- **Match Management** — Jadwal pertandingan, input skor, statistik pertandingan (goal, kartu)
- **Standings & Results** — Klasemen otomatis terhitung dari hasil pertandingan, top scorer

## Phase 4: Integration (SSB ↔ EO)
- **SSB Join Kompetisi** — Dari dashboard SSB, langsung lihat & daftar kompetisi yang tersedia
- **Central Player Database** — Satu pemain = satu global ID, data otomatis masuk ke sistem EO saat didaftarkan
- **Player History** — Riwayat klub, riwayat kompetisi, statistik performa lintas turnamen

## Design & UX
- **Style**: Clean & Modern — warna hijau lapangan sebagai primary, palette natural, ikon minimalis
- **Mobile-first**: Seluruh modul SSB dioptimalkan untuk smartphone — bottom navigation, card-based layout, touch-friendly controls
- **EO module**: Responsive (desktop & mobile), tabel data untuk match management
- **Navigation SSB (mobile)**: Bottom tab bar — Home, Pemain, Latihan, Pembayaran, Lainnya
- **Navigation EO**: Sidebar dengan menu kompetisi, tim terdaftar, jadwal, klasemen

## Halaman Utama
1. **Landing Page** — Pengenalan platform, CTA daftar sebagai SSB atau EO
2. **Login/Register** — Email + Google, pilih role (SSB/EO)
3. **SSB Dashboard** — Mobile-optimized overview
4. **SSB > Pemain** — List, detail, tambah pemain
5. **SSB > Latihan** — Jadwal, absensi
6. **SSB > Pembayaran** — Tagihan & status
7. **SSB > Coach** — Manajemen pelatih
8. **EO Dashboard** — Overview kompetisi
9. **EO > Kompetisi** — CRUD kompetisi, detail format
10. **EO > Pendaftaran** — Tim terdaftar, validasi pemain
11. **EO > Pertandingan** — Jadwal, input skor
12. **EO > Klasemen** — Standings, top scorer
13. **Super Admin** — User & organization management

