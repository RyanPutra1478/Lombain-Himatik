-- Create categories table
CREATE TABLE competition_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create competitions table
CREATE TABLE competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Internal', 'Eksternal')),
  category_id UUID REFERENCES competition_categories(id), -- RELATIONAL Bidang Lomba
  deadline DATE NOT NULL,
  link TEXT,
  description TEXT,
  is_priority BOOLEAN DEFAULT false,
  -- Primary Image Fields
  image_url TEXT,
  image_path TEXT, -- Storage path for easy deletion
  image_source TEXT DEFAULT 'url' CHECK (image_source IN ('url', 'file')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create competition_images table (for 4 additional images)
CREATE TABLE competition_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  path TEXT, -- Storage path for easy deletion
  source TEXT DEFAULT 'url' CHECK (source IN ('url', 'file')),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (READ ONLY)
CREATE POLICY "Public can read competitions" ON competitions
  FOR SELECT USING (true);

CREATE POLICY "Public can read competition_images" ON competition_images
  FOR SELECT USING (true);

-- Create policies for admin (FULL ACCESS)
-- Note: Replace 'authenticated' with your specific admin logic if needed
CREATE POLICY "Admin can manage competitions" ON competitions
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin can manage competition_images" ON competition_images
  FOR ALL TO authenticated USING (true);
