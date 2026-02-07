-- Create app_settings table for storing application configuration
CREATE TABLE app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Public can read app_settings" ON app_settings
  FOR SELECT USING (true);

-- Admin can manage settings
CREATE POLICY "Admin can manage app_settings" ON app_settings
  FOR ALL TO authenticated USING (true);

-- Insert default WhatsApp contact
INSERT INTO app_settings (key, value) 
VALUES ('admin_whatsapp', '6281234567890')
ON CONFLICT (key) DO NOTHING;

-- Insert default email contact
INSERT INTO app_settings (key, value) 
VALUES ('admin_email', 'himatik@pnup.ac.id')
ON CONFLICT (key) DO NOTHING;
