-- PHASE 13: Many-to-Many Categories Migration
-- This script creates a junction table to allow multiple categories per competition.

-- 1. Create junction table
CREATE TABLE competition_category_pivot (
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  category_id UUID REFERENCES competition_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (competition_id, category_id)
);

-- 2. Migrate existing single-category data
-- This assumes you have already run previous migrations and category_id in competitions is populated.
INSERT INTO competition_category_pivot (competition_id, category_id)
SELECT id, category_id 
FROM competitions 
WHERE category_id IS NOT NULL;

-- 3. Update competitions table (Keep category_id for now as "Primary Category", but eventually it can be dropped)
-- Note: Most logic will shift to fetching from the pivot table.

-- 4. Enable RLS
ALTER TABLE competition_category_pivot ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
CREATE POLICY "Public can read pivot" ON competition_category_pivot
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage pivot" ON competition_category_pivot
  FOR ALL TO authenticated USING (true);
