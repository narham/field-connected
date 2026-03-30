-- Migrasi kedua: Skema Players Sederhana
-- Ini akan menimpa tabel players jika sudah ada dari migrasi sebelumnya

DROP TABLE IF EXISTS players CASCADE;

CREATE TABLE players ( 
   id uuid default uuid_generate_v4() primary key, 
   parent_id uuid references auth.users(id), 
   nama text not null, 
   tanggal_lahir date not null, 
   posisi text not null, 
   nik bytea not null, -- Untuk menyimpan data terenkripsi 
   nama_ibu_kandung bytea not null, -- Untuk menyimpan data terenkripsi 
   status text default 'nonaktif', 
   verified boolean default false, 
   created_at timestamp with time zone default now() 
 ); 
 
 -- Aktifkan RLS 
 ALTER TABLE players ENABLE ROW LEVEL SECURITY; 
 
 -- Policy agar user hanya bisa melihat/mengedit pemain yang mereka buat 
 CREATE POLICY "Users can manage their own players" 
   ON players FOR ALL 
   USING (auth.uid() = parent_id);
