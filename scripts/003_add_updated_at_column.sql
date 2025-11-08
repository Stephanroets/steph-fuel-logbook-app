-- Add updated_at column to track when entries are modified
-- This helps with debugging and tracking changes

ALTER TABLE fuel_entries 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS update_fuel_entries_updated_at ON fuel_entries;

-- Create the trigger
CREATE TRIGGER update_fuel_entries_updated_at
    BEFORE UPDATE ON fuel_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON COLUMN fuel_entries.updated_at IS 'Timestamp when the entry was last updated';
