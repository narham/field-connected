-- Migration: Parent Module Schema
-- Membangun subsistem manajemen orang tua/wali yang terintegrasi dengan pemain

-- 1. Enum untuk Status Tagihan
CREATE TYPE bill_status AS ENUM ('unpaid', 'paid', 'overdue');

-- 2. Tabel Orang Tua / Wali
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    nama VARCHAR(60) NOT NULL CHECK (char_length(nama) >= 3 AND nama ~ '^[A-Za-z .]+$'),
    whatsapp VARCHAR(20) NOT NULL UNIQUE, -- Format +62
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Relasi Orang Tua ke Pemain
CREATE TYPE relation_type AS ENUM ('ayah', 'ibu', 'wali_lain');

CREATE TABLE parent_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE NOT NULL,
    player_id UUID REFERENCES players(id) ON DELETE RESTRICT NOT NULL,
    hubungan relation_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(parent_id, player_id)
);

-- 4. Tabel Tagihan Iuran (Bills)
CREATE TABLE player_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
    periode VARCHAR(20) NOT NULL, -- Format: MM-YYYY
    nominal DECIMAL(15, 2) NOT NULL,
    status bill_status DEFAULT 'unpaid',
    due_date DATE NOT NULL,
    virtual_account VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Update Tabel Pembayaran (Expansion)
ALTER TABLE player_payments ADD COLUMN IF NOT EXISTS bill_id UUID REFERENCES player_bills(id);
ALTER TABLE player_payments ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50); -- 'transfer', 'qris', 'e-wallet'
ALTER TABLE player_payments ADD COLUMN IF NOT EXISTS proof_url TEXT; -- Bukti bayar
ALTER TABLE player_payments ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE player_payments ADD COLUMN IF NOT EXISTS notes TEXT;

-- 6. Tabel Evaluasi Pelatih
CREATE TABLE coach_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    session_id UUID REFERENCES training_sessions(id) ON DELETE SET NULL,
    parameter_teknis INT CHECK (parameter_teknis BETWEEN 1 AND 10),
    parameter_fisik INT CHECK (parameter_fisik BETWEEN 1 AND 10),
    parameter_mental INT CHECK (parameter_mental BETWEEN 1 AND 10),
    catatan_kualitatif TEXT,
    rekomendasi_posisi player_position,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. RLS Policies (Role: Parent)
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_evaluations ENABLE ROW LEVEL SECURITY;

-- Orang tua hanya bisa melihat data mereka sendiri
CREATE POLICY "Parents can view own profile" ON parents FOR SELECT USING (auth.uid() = user_id);

-- Orang tua bisa melihat relasi anak mereka
CREATE POLICY "Parents can view their children relations" ON parent_players FOR SELECT USING (
    parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
);

-- Orang tua bisa melihat tagihan anak mereka
CREATE POLICY "Parents can view bills of their children" ON player_bills FOR SELECT USING (
    player_id IN (
        SELECT player_id FROM parent_players 
        WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
    )
);

-- Orang tua bisa melihat evaluasi anak mereka
CREATE POLICY "Parents can view evaluations of their children" ON coach_evaluations FOR SELECT USING (
    player_id IN (
        SELECT player_id FROM parent_players 
        WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
    )
);

-- Orang tua bisa melihat kehadiran anak mereka (di tabel player_attendances)
CREATE POLICY "Parents can view attendances of their children" ON player_attendances FOR SELECT USING (
    player_id IN (
        SELECT player_id FROM parent_players 
        WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
    )
);

-- Orang tua bisa melihat pembayaran mereka sendiri
CREATE POLICY "Parents can view their own payments" ON player_payments FOR SELECT USING (
    player_id IN (
        SELECT player_id FROM parent_players 
        WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
    )
);

-- Orang tua bisa mengunggah bukti bayar (Insert ke player_payments)
CREATE POLICY "Parents can submit payment proof" ON player_payments FOR INSERT WITH CHECK (
    player_id IN (
        SELECT player_id FROM parent_players 
        WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
    )
);
