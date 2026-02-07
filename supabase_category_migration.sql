-- MIGRASI CATEGORY MASTER SYSTEM
-- Jalankan script ini di SQL Editor Supabase Anda

-- 1. Buat tabel categories
CREATE TABLE competition_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tambahkan category_id ke tabel competitions
ALTER TABLE competitions ADD COLUMN category_id UUID REFERENCES competition_categories(id);

-- 3. Ekstrak data 'type' yang sudah ada ke tabel categories (Data Migration)
INSERT INTO competition_categories (name)
SELECT DISTINCT type FROM competitions;

-- 4. Hubungkan data competitions lama ke categories yang baru dibuat
UPDATE competitions
SET category_id = (SELECT id FROM competition_categories WHERE name = competitions.type);

-- 5. Aktifkan RLS untuk tabel baru
ALTER TABLE competition_categories ENABLE ROW LEVEL SECURITY;

-- 6. Kebijakan Akses (Policies)
CREATE POLICY "Public can read categories" ON competition_categories
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage categories" ON competition_categories
  FOR ALL TO authenticated USING (true);
