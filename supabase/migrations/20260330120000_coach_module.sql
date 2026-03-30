-- 1. Enum untuk Tipe Sesi Latihan & Lisensi
DROP TYPE IF EXISTS training_session_type CASCADE;
DROP TYPE IF EXISTS coach_license_type CASCADE;

CREATE TYPE training_session_type AS ENUM ('teknik', 'taktik', 'fisik', 'uji coba');
CREATE TYPE coach_license_type AS ENUM ('A', 'B', 'C', 'D');

-- 2. Tabel Profil Pelatih
DROP TABLE IF EXISTS coaches CASCADE;
CREATE TABLE coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    foto_url TEXT,
    spesialisasi VARCHAR(100),
    kontak VARCHAR(20),
    alamat TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Lisensi Pelatih
DROP TABLE IF EXISTS coach_licenses CASCADE;
CREATE TABLE coach_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    jenis_lisensi coach_license_type NOT NULL,
    nomor_sertifikat VARCHAR(50) UNIQUE NOT NULL,
    lembaga_penerbit VARCHAR(100) NOT NULL,
    tgl_dikeluarkan DATE NOT NULL,
    tgl_kadaluarsa DATE NOT NULL,
    sertifikat_url TEXT, -- Added for document storage
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Relasi Pelatih dan Tim (Age Categories)
DROP TABLE IF EXISTS coach_teams CASCADE;
CREATE TABLE coach_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    kategori_usia VARCHAR(10) CHECK (kategori_usia IN ('U9', 'U13', 'U17', 'U21', 'Senior')),
    musim VARCHAR(20) NOT NULL,
    status_aktif BOOLEAN DEFAULT true,
    UNIQUE(coach_id, team_id, musim)
);

-- 5. Update Tabel training_sessions (Menambahkan Field Modul Pelatih)
ALTER TABLE players ADD COLUMN IF NOT EXISTS current_team_id UUID REFERENCES teams(id);
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS coach_id UUID REFERENCES coaches(id);
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS tipe_sesi training_session_type DEFAULT 'teknik';
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS kapasitas_lapangan INT;
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS catatan_khusus TEXT;
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;

-- 6. Update Tabel player_attendances (Menambahkan Field GPS & Selfie)
ALTER TABLE player_attendances ADD COLUMN IF NOT EXISTS check_in_location_gps POINT;
ALTER TABLE player_attendances ADD COLUMN IF NOT EXISTS selfie_url TEXT;
ALTER TABLE player_attendances ADD COLUMN IF NOT EXISTS notes TEXT;

-- 7. RLS Policies untuk Modul Pelatih
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_teams ENABLE ROW LEVEL SECURITY;

-- Pelatih bisa melihat profil mereka sendiri
CREATE POLICY "Coaches can view own profile" ON coaches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Coaches can update own profile" ON coaches FOR UPDATE USING (auth.uid() = user_id);

-- Pelatih bisa melihat data pemain di tim yang mereka ampu
CREATE POLICY "Coaches can view players in their teams" ON players FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM coach_teams ct
        JOIN coaches c ON ct.coach_id = c.id
        WHERE c.user_id = auth.uid() AND ct.team_id = players.current_team_id
    )
);

-- Pelatih hanya bisa menginput absen untuk sesi yang mereka ampu
CREATE POLICY "Coaches can manage attendance for own sessions" ON player_attendances FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM training_sessions ts
        JOIN coaches c ON ts.coach_id = c.id
        WHERE c.user_id = auth.uid() AND ts.id = player_attendances.session_id
    )
);
