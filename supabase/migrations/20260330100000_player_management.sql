-- Hapus tabel yang ada dalam urutan terbalik untuk menangani dependensi 
 DROP TABLE IF EXISTS player_audit_logs; 
 DROP TABLE IF EXISTS player_match_stats; 
 DROP TABLE IF EXISTS player_payments; 
 DROP TABLE IF EXISTS player_attendances; 
 DROP TABLE IF EXISTS player_club_history; 
 DROP TABLE IF EXISTS players; 
 DROP TABLE IF EXISTS training_sessions; 
 DROP TABLE IF EXISTS matches; 
 DROP TABLE IF EXISTS seasons; 
 DROP TABLE IF EXISTS teams; 
 
 -- Hapus tipe kustom jika ada 
 DROP TYPE IF EXISTS player_position; 
 DROP TYPE IF EXISTS player_status; 
 DROP TYPE IF EXISTS attendance_status; 
 DROP TYPE IF EXISTS payment_status; 
 
 
 -- Aktifkan ekstensi yang diperlukan 
 CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 
 CREATE EXTENSION IF NOT EXISTS "pgsodium"; 
 CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- [FIX] Tambahkan ekstensi ini 
 
 -- Buat tipe ENUM kustom 
 CREATE TYPE player_position AS ENUM ('GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST'); 
 CREATE TYPE player_status AS ENUM ('aktif', 'nonaktif'); 
 CREATE TYPE attendance_status AS ENUM ('hadir', 'izin', 'sakit', 'alpha'); 
 CREATE TYPE payment_status AS ENUM ('lunas', 'cicil', 'belum_bayar'); 
 
 -- Tabel Placeholder untuk Foreign Keys 
 CREATE TABLE teams ( 
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
     name VARCHAR(100) NOT NULL, 
     created_at TIMESTAMPTZ DEFAULT now() 
 ); 
 
 CREATE TABLE seasons ( 
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
     name VARCHAR(100) NOT NULL, 
     start_date DATE NOT NULL, 
     end_date DATE NOT NULL, 
     created_at TIMESTAMPTZ DEFAULT now() 
 ); 
 
 CREATE TABLE matches ( 
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
     season_id UUID REFERENCES seasons(id), 
     match_date TIMESTAMPTZ NOT NULL, 
     created_at TIMESTAMPTZ DEFAULT now() 
 ); 
 
 CREATE TABLE training_sessions ( 
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
     team_id UUID REFERENCES teams(id), 
     session_date TIMESTAMPTZ NOT NULL, 
     created_at TIMESTAMPTZ DEFAULT now() 
 ); 
 
 
 -- 1. Tabel Utama: Players (dengan Enkripsi) 
 CREATE TABLE players ( 
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
     global_player_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(), 
     parent_id UUID REFERENCES auth.users(id) NOT NULL, 
     nama VARCHAR(100) NOT NULL CHECK (nama ~ '^[A-Za-z .]+$'), 
     tanggal_lahir DATE NOT NULL, 
     posisi player_position NOT NULL, 
     nik bytea NOT NULL UNIQUE, 
     nama_ibu_kandung bytea NOT NULL, 
     current_team_id UUID REFERENCES teams(id), 
     status player_status NOT NULL DEFAULT 'nonaktif', 
     created_at TIMESTAMPTZ DEFAULT now(), 
     updated_at TIMESTAMPTZ DEFAULT now() 
 ); 
 CREATE INDEX idx_players_parent_id ON players(parent_id); 
 CREATE INDEX idx_players_current_team_id ON players(current_team_id); 
 
 
 -- 2. Sub-Data: Riwayat Klub (FIXED) 
 CREATE TABLE player_club_history ( 
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
     player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE, 
     club_id UUID NOT NULL REFERENCES teams(id), 
     nomor_punggung INT, 
     tgl_mulai DATE NOT NULL, 
     tgl_selesai DATE, 
     status_akhir VARCHAR(100), 
     created_at TIMESTAMPTZ DEFAULT now(), 
     -- [FIX] Menggunakan GIST secara eksplisit untuk exclusion constraint 
     CONSTRAINT no_date_overlap EXCLUDE USING GIST (player_id WITH =, daterange(tgl_mulai, tgl_selesai, '[]') WITH &&) 
 ); 
 CREATE INDEX idx_player_club_history_player_id ON player_club_history(player_id); 
 CREATE INDEX idx_player_club_history_club_id ON player_club_history(club_id); 
 
 
 -- 3. Sub-Data: Kehadiran 
 CREATE TABLE player_attendances ( 
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
     player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE, 
     session_id UUID NOT NULL REFERENCES training_sessions(id), 
     status attendance_status NOT NULL, 
     check_in TIMESTAMPTZ, 
     check_out TIMESTAMPTZ, 
     created_at TIMESTAMPTZ DEFAULT now(), 
     UNIQUE(player_id, session_id) 
 ); 
 CREATE INDEX idx_player_attendances_player_id ON player_attendances(player_id); 
 
 
 -- 4. Sub-Data: Status Pembayaran 
 CREATE TABLE player_payments ( 
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
     player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE, 
     season_id UUID NOT NULL REFERENCES seasons(id), 
     jenis_bayar VARCHAR(100) NOT NULL, 
     jumlah NUMERIC(12, 2) NOT NULL, 
     tanggal_jatuh_tempo DATE NOT NULL, 
     tanggal_bayar DATE, 
     status_bayar payment_status NOT NULL DEFAULT 'belum_bayar', 
     created_at TIMESTAMPTZ DEFAULT now() 
 ); 
 CREATE INDEX idx_player_payments_player_id_season_id ON player_payments(player_id, season_id); 
 
 
 -- 5. Sub-Data: Statistik Pertandingan 
 CREATE TABLE player_match_stats ( 
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
     player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE, 
     match_id UUID NOT NULL REFERENCES matches(id), 
     menit_main INT DEFAULT 0, 
     goal INT DEFAULT 0, 
     assist INT DEFAULT 0, 
     kartu_kuning INT DEFAULT 0, 
     kartu_merah INT DEFAULT 0, 
     save_rate NUMERIC(5, 2), 
     rating NUMERIC(3, 1), 
     created_at TIMESTAMPTZ DEFAULT now(), 
     UNIQUE(player_id, match_id) 
 ); 
 CREATE INDEX idx_player_match_stats_player_id_match_id ON player_match_stats(player_id, match_id); 
 
 
 -- 6. Tabel Keamanan: Audit Log 
 CREATE TABLE player_audit_logs ( 
     id BIGSERIAL PRIMARY KEY, 
     user_id UUID REFERENCES auth.users(id), 
     action VARCHAR(50) NOT NULL, 
     record_id UUID NOT NULL, 
     table_name VARCHAR(50) NOT NULL, 
     old_values JSONB, 
     new_values JSONB, 
     ip_address INET, 
     timestamp TIMESTAMPTZ NOT NULL DEFAULT now() 
 ); 
 CREATE INDEX idx_player_audit_logs_record_id ON player_audit_logs(record_id);

-- Aktifkan RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own players" ON players FOR ALL USING (auth.uid() = parent_id);
