-- PHASE 14: Renaming Categories to Types (Standardization)
-- Renames tables to avoid confusion with the 'category' (Internal/Eksternal) field.

-- 1. Rename junction table
ALTER TABLE competition_category_pivot RENAME TO competition_type_pivot;
ALTER TABLE competition_type_pivot RENAME COLUMN category_id TO type_id;

-- 2. Rename categories table
ALTER TABLE competition_categories RENAME TO competition_types;

-- 3. Update RLS policies (They usually follow the table rename, but let's be explicit if needed)
-- Note: Subabase handles this automatically usually, but check your policy names.
-- Rename policies if you used specific names:
ALTER POLICY "Admin can manage categories" ON competition_types RENAME TO "Admin can manage types";
ALTER POLICY "Public can read categories" ON competition_types RENAME TO "Public can read types";
