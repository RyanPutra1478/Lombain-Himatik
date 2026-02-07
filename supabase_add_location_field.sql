-- Migration: Add location column to competitions table
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS location TEXT;

-- Update RLS policies if necessary (usually not needed if already using * for columns)
-- But if we renamed policies, they might need checking. 
-- Existing policies use FROM competitions which covers all columns.

COMMENT ON COLUMN competitions.location IS 'Competition venue or location (Online/Physical address)';
