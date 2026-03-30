-- Migration: Fix Missing Column in coach_licenses
-- Memastikan kolom sertifikat_url ada untuk mendukung penyimpanan dokumen di RPC register_coach_atomic

DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='coach_licenses' AND column_name='sertifikat_url'
    ) THEN 
        ALTER TABLE coach_licenses ADD COLUMN sertifikat_url TEXT;
    END IF;
END $$;
