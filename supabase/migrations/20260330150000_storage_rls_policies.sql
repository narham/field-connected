-- 1. Kebijakan untuk mengizinkan Admin SSB mengunggah sertifikat pelatih
CREATE POLICY "SSB Admins can upload coach certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'coach-documents'
  AND (storage.foldername(name))[1] = 'certificates'
  AND auth.role() = 'authenticated'
  -- Memastikan hanya file gambar atau PDF yang diizinkan
  AND (
    storage.extension(name) = 'jpg' OR 
    storage.extension(name) = 'jpeg' OR 
    storage.extension(name) = 'png' OR 
    storage.extension(name) = 'pdf'
  )
);

-- 2. Kebijakan untuk mengizinkan Admin SSB melihat sertifikat pelatih yang mereka daftarkan
CREATE POLICY "SSB Admins can view certificates of their coaches"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'coach-documents'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM ssb_coaches
    JOIN coaches ON ssb_coaches.coach_id = coaches.id
    WHERE ssb_coaches.ssb_id = auth.uid()
  )
);

-- 3. Kebijakan untuk mengizinkan Pelatih melihat sertifikat mereka sendiri
CREATE POLICY "Coaches can view their own certificates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'coach-documents'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM coaches
    WHERE coaches.user_id = auth.uid()
  )
);
