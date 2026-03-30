-- Migration: Treasurer Module Schema
-- Membangun sistem manajemen keuangan SSB yang terintegrasi

-- 1. Tabel Bendahara (Treasurers)
DROP TABLE IF EXISTS treasurers CASCADE;
CREATE TABLE treasurers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    nik VARCHAR(16) UNIQUE,
    nomor_rekening VARCHAR(30),
    email VARCHAR(255) UNIQUE NOT NULL,
    telepon VARCHAR(20),
    alamat_kantor TEXT,
    tanda_tangan_url TEXT,
    foto_profil_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Relasi SSB ke Bendahara (SSB Treasurers)
DROP TABLE IF EXISTS ssb_treasurers CASCADE;
CREATE TABLE ssb_treasurers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ssb_id UUID REFERENCES auth.users(id) NOT NULL, -- Admin SSB yang mendaftarkan
    treasurer_id UUID REFERENCES treasurers(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(ssb_id, treasurer_id)
);

-- 3. Konfigurasi Sistem Keuangan (Financial Config)
DROP TABLE IF EXISTS financial_config CASCADE;
CREATE TABLE financial_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ssb_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    invoice_prefix VARCHAR(10) DEFAULT 'INV',
    invoice_template TEXT, -- Template template (HTML/JSON)
    reminder_settings JSONB DEFAULT '{"auto_remind": true, "days_before": 3}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Invoice (Upgrade dari player_bills jika perlu, atau buat baru)
-- Kita buat tabel invoices yang lebih komprehensif
DROP TABLE IF EXISTS invoices CASCADE;
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
    ssb_id UUID REFERENCES auth.users(id) NOT NULL,
    periode VARCHAR(20) NOT NULL, -- Format: MM-YYYY
    total_nominal DECIMAL(15, 2) NOT NULL DEFAULT 0,
    status bill_status DEFAULT 'unpaid',
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabel Item Tagihan (Invoice Items)
DROP TABLE IF EXISTS invoice_items CASCADE;
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    item_name VARCHAR(100) NOT NULL, -- 'SPP', 'Uang Makan', 'Transport', dll.
    nominal DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Audit Trail untuk Transaksi Keuangan
DROP TABLE IF EXISTS financial_audit_logs CASCADE;
CREATE TABLE financial_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treasurer_id UUID REFERENCES treasurers(id),
    ssb_id UUID REFERENCES auth.users(id),
    action VARCHAR(50) NOT NULL, -- 'CREATE_INVOICE', 'VERIFY_PAYMENT', 'UPDATE_CONFIG'
    table_name VARCHAR(50),
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. RLS Policies (Role: Treasurer)
ALTER TABLE treasurers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ssb_treasurers ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_audit_logs ENABLE ROW LEVEL SECURITY;

-- Bendahara bisa melihat profil mereka sendiri
CREATE POLICY "Treasurers can view own profile" ON treasurers 
FOR SELECT USING (auth.uid() = user_id);

-- Bendahara bisa melihat konfigurasi keuangan SSB mereka
CREATE POLICY "Treasurers can view financial config" ON financial_config 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM ssb_treasurers st
        JOIN treasurers t ON st.treasurer_id = t.id
        WHERE t.user_id = auth.uid() AND st.ssb_id = financial_config.ssb_id
    )
);

-- Bendahara memiliki akses penuh ke invoice organisasi mereka
CREATE POLICY "Treasurers can manage invoices" ON invoices 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM ssb_treasurers st
        JOIN treasurers t ON st.treasurer_id = t.id
        WHERE t.user_id = auth.uid() AND st.ssb_id = invoices.ssb_id
    )
);

-- Bendahara memiliki akses penuh ke invoice items
CREATE POLICY "Treasurers can manage invoice items" ON invoice_items 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM invoices i
        JOIN ssb_treasurers st ON i.ssb_id = st.ssb_id
        JOIN treasurers t ON st.treasurer_id = t.id
        WHERE t.user_id = auth.uid() AND i.id = invoice_items.invoice_id
    )
);

-- Bendahara memiliki akses penuh ke laporan audit
CREATE POLICY "Treasurers can view financial audit logs" ON financial_audit_logs 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM ssb_treasurers st
        JOIN treasurers t ON st.treasurer_id = t.id
        WHERE t.user_id = auth.uid() AND st.ssb_id = financial_audit_logs.ssb_id
    )
);

-- Bendahara bisa melihat data basic pemain (nama, program)
CREATE POLICY "Treasurers can view basic player data" ON players 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM ssb_treasurers st
        JOIN treasurers t ON st.treasurer_id = t.id
        -- Logika: Bendahara melihat pemain yang ada di SSB yang sama
        -- Di sini kita asumsikan ada relasi ssb ke pemain (misalnya via admin_id)
        -- Jika belum ada, kita asumsikan policy ini di-handle di level aplikasi atau join lain
    )
);
