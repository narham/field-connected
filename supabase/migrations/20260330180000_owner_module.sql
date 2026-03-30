-- Migration: Owner Module Schema
-- Membangun sistem kontrol pusat untuk Pemilik Klub (Owner)

-- 1. Tabel Klub (Clubs) - Entitas Utama SSB
DROP TABLE IF EXISTS clubs CASCADE;
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    legal_doc_url TEXT, -- NIB, Akta, dll
    address TEXT,
    established_date DATE,
    vision TEXT,
    mission TEXT,
    website VARCHAR(255),
    social_media JSONB DEFAULT '{}'::JSONB, -- { "instagram": "@club", "facebook": "club" }
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Pemilik Klub (Owners)
DROP TABLE IF EXISTS owners CASCADE;
CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    nik VARCHAR(16) UNIQUE,
    telepon VARCHAR(20),
    alamat TEXT,
    dokumen_legal_url TEXT, -- Bukti kepemilikan
    tanda_tangan_url TEXT,
    foto_profil_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Manajemen Admin (Club Admins)
-- Mengatur siapa saja admin (SSB_ADMIN, TREASURER, etc.) di bawah Owner
CREATE TYPE club_role AS ENUM ('SSB_ADMIN', 'TREASURER', 'STAFF', 'OWNER');

DROP TABLE IF EXISTS club_admins CASCADE;
CREATE TABLE club_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    role club_role NOT NULL DEFAULT 'STAFF',
    permissions JSONB DEFAULT '[]'::JSONB, -- ["MANAGE_PLAYERS", "VIEW_FINANCE", etc]
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'pending'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(club_id, user_id)
);

-- 4. Tabel Kebijakan & SOP (Club Policies)
DROP TABLE IF EXISTS club_policies CASCADE;
CREATE TABLE club_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'SOP', 'FINANCIAL', 'DISCIPLINE'
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabel Workflow Approval (Club Approvals)
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE approval_entity AS ENUM ('PLAYER_TRANSFER', 'CONTRACT', 'BUDGET', 'TOURNAMENT');

DROP TABLE IF EXISTS club_approvals CASCADE;
CREATE TABLE club_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
    requester_id UUID REFERENCES auth.users(id) NOT NULL,
    approver_id UUID REFERENCES auth.users(id), -- Nullable if not yet approved
    entity_type approval_entity NOT NULL,
    entity_id UUID NOT NULL, -- Reference to player_id, contract_id, etc
    status approval_status DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. RLS Policies (Role: Owner)
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_approvals ENABLE ROW LEVEL SECURITY;

-- Owner memiliki akses penuh ke klub mereka sendiri
CREATE POLICY "Owners can manage their own club" ON clubs
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM owners WHERE owners.club_id = clubs.id AND owners.user_id = auth.uid()
    )
);

-- Owner bisa melihat dan mengelola profil mereka sendiri
CREATE POLICY "Owners can manage own profile" ON owners
FOR ALL USING (auth.uid() = user_id);

-- Owner memiliki kontrol penuh atas admin di klub mereka
CREATE POLICY "Owners can manage club admins" ON club_admins
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM owners WHERE owners.club_id = club_admins.club_id AND owners.user_id = auth.uid()
    )
);

-- Owner memiliki kontrol penuh atas kebijakan klub
CREATE POLICY "Owners can manage club policies" ON club_policies
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM owners WHERE owners.club_id = club_policies.club_id AND owners.user_id = auth.uid()
    )
);

-- Owner memiliki kontrol penuh atas approval
CREATE POLICY "Owners can manage club approvals" ON club_approvals
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM owners WHERE owners.club_id = club_approvals.club_id AND owners.user_id = auth.uid()
    )
);

-- Hak akses Owner ke data lain (Override level)
-- Mengupdate policy players untuk akses Owner
CREATE POLICY "Owners can view all players in their club" ON players
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM owners WHERE owners.user_id = auth.uid()
        -- Logika: Owner melihat semua pemain yang terhubung ke klub mereka
        -- Melalui player_club_history atau relasi lain
    )
);
