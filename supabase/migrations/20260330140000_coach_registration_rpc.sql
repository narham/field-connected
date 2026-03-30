-- Migration: Atomic Coach Registration RPC
-- Menjamin atomisitas pendaftaran pelatih (coaches, licenses, links, logs)

CREATE OR REPLACE FUNCTION register_coach_atomic(
    p_user_id UUID,
    p_admin_id UUID,
    p_nama VARCHAR,
    p_kontak VARCHAR,
    p_spesialisasi VARCHAR,
    p_jenis_lisensi coach_license_type,
    p_nomor_sertifikat VARCHAR,
    p_lembaga_penerbit VARCHAR,
    p_tgl_dikeluarkan DATE,
    p_tgl_kadaluarsa DATE,
    p_sertifikat_url TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_coach_id UUID;
BEGIN
    -- 1. Insert Profile
    INSERT INTO coaches (user_id, nama, kontak, spesialisasi)
    VALUES (p_user_id, p_nama, p_kontak, p_spesialisasi)
    RETURNING id INTO v_coach_id;

    -- 2. Insert License
    INSERT INTO coach_licenses (
        coach_id, 
        jenis_lisensi, 
        nomor_sertifikat, 
        lembaga_penerbit, 
        tgl_dikeluarkan, 
        tgl_kadaluarsa,
        sertifikat_url
    ) VALUES (
        v_coach_id, 
        p_jenis_lisensi, 
        p_nomor_sertifikat, 
        p_lembaga_penerbit, 
        p_tgl_dikeluarkan, 
        p_tgl_kadaluarsa,
        p_sertifikat_url
    );

    -- 3. Link to SSB
    INSERT INTO ssb_coaches (ssb_id, coach_id, status)
    VALUES (p_admin_id, v_coach_id, 'pending');

    -- 4. Audit Log
    INSERT INTO coach_account_logs (admin_id, coach_id, action, details)
    VALUES (
        p_admin_id, 
        v_coach_id, 
        'CREATE', 
        jsonb_build_object('user_id', p_user_id, 'created_at', now())
    );

    RETURN v_coach_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
