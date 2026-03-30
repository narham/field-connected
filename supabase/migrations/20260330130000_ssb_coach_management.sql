-- 1. Penambahan Relasi SSB ke Coach
-- Tabel ssb_coaches menghubungkan SSB (organisasi) dengan Pelatih (Coach)
CREATE TABLE ssb_coaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ssb_id UUID REFERENCES auth.users(id) NOT NULL, -- Admin SSB yang mendaftarkan
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'active', 'pending', 'inactive'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(ssb_id, coach_id)
);

-- 2. Audit Trail untuk Manajemen Akun Coach
CREATE TABLE coach_account_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id) NOT NULL,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE_STATUS', 'VERIFY_LICENSE'
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Kebijakan RLS untuk ssb_coaches
ALTER TABLE ssb_coaches ENABLE ROW LEVEL SECURITY;

-- Admin SSB hanya bisa melihat pelatih yang mereka daftarkan
CREATE POLICY "SSB Admins can view their coaches" ON ssb_coaches 
FOR SELECT USING (auth.uid() = ssb_id);

-- Admin SSB bisa mendaftarkan pelatih
CREATE POLICY "SSB Admins can register coaches" ON ssb_coaches 
FOR INSERT WITH CHECK (auth.uid() = ssb_id);

-- Admin SSB bisa memperbarui status pelatih mereka
CREATE POLICY "SSB Admins can update coach status" ON ssb_coaches 
FOR UPDATE USING (auth.uid() = ssb_id);

-- 4. Kebijakan RLS untuk coaches (diperbarui)
-- Pelatih bisa melihat data mereka sendiri (sudah ada)
-- Admin SSB bisa melihat data pelatih yang mereka daftarkan
CREATE POLICY "SSB Admins can view coaches profiles" ON coaches 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM ssb_coaches 
        WHERE ssb_coaches.coach_id = coaches.id 
        AND ssb_coaches.ssb_id = auth.uid()
    )
);

-- 5. Bucket Storage untuk Dokumen Sertifikasi
-- Note: Dalam Supabase sesungguhnya ini dilakukan via Dashboard/CLI, 
-- namun secara logika kita asumsikan bucket 'coach-documents' tersedia.
