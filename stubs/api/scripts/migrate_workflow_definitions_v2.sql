-- Migration: Add Workflow Definition Versioning
-- Run this after init_workflow_poc_db.sql to add version history support
--
-- psql -U postgres -d workflow_poc -f migrate_workflow_definitions_v2.sql

-- =============================================================================
-- STEP 1: Alter workflow_definitions table
-- Remove old columns and add new ones
-- =============================================================================

-- Add new columns to workflow_definitions
ALTER TABLE workflow_definitions
    ADD COLUMN IF NOT EXISTS process_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(255) DEFAULT 'system';

-- Remove the unique constraint on (name, version) if it exists
ALTER TABLE workflow_definitions DROP CONSTRAINT IF EXISTS workflow_definitions_name_version_key;

-- Add unique constraint on name only
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'workflow_definitions_name_key'
    ) THEN
        ALTER TABLE workflow_definitions ADD CONSTRAINT workflow_definitions_name_key UNIQUE (name);
    END IF;
END $$;

-- Set default process_id for existing rows
UPDATE workflow_definitions
SET process_id = 'VS4_DesignEntitlement_POC'
WHERE process_id IS NULL;

-- Make process_id NOT NULL after setting defaults
ALTER TABLE workflow_definitions
    ALTER COLUMN process_id SET NOT NULL;

-- =============================================================================
-- STEP 2: Create workflow_definition_versions table
-- =============================================================================
CREATE TABLE IF NOT EXISTS workflow_definition_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    bpmn_xml TEXT NOT NULL,
    change_notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_definition_version UNIQUE (definition_id, version)
);

-- Indexes for workflow_definition_versions
CREATE INDEX IF NOT EXISTS idx_wf_version_definition ON workflow_definition_versions(definition_id);
CREATE INDEX IF NOT EXISTS idx_wf_version_active ON workflow_definition_versions(definition_id, is_active);

-- Index for workflow_definitions
CREATE INDEX IF NOT EXISTS idx_workflow_def_status ON workflow_definitions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_def_process_id ON workflow_definitions(process_id);

-- =============================================================================
-- STEP 3: Migrate existing data
-- Move bpmn_xml from workflow_definitions to workflow_definition_versions
-- =============================================================================
DO $$
DECLARE
    def_record RECORD;
BEGIN
    -- For each existing workflow definition
    FOR def_record IN
        SELECT id, bpmn_xml, version, status
        FROM workflow_definitions
        WHERE bpmn_xml IS NOT NULL AND bpmn_xml != ''
    LOOP
        -- Check if version already exists
        IF NOT EXISTS (
            SELECT 1 FROM workflow_definition_versions
            WHERE definition_id = def_record.id AND version = COALESCE(def_record.version, 1)
        ) THEN
            -- Insert into versions table
            INSERT INTO workflow_definition_versions (
                definition_id,
                version,
                bpmn_xml,
                change_notes,
                is_active,
                created_by
            ) VALUES (
                def_record.id,
                COALESCE(def_record.version, 1),
                def_record.bpmn_xml,
                'Migrated from legacy schema',
                def_record.status = 'published',
                'system'
            );

            RAISE NOTICE 'Migrated definition % version %', def_record.id, COALESCE(def_record.version, 1);
        END IF;
    END LOOP;
END $$;

-- =============================================================================
-- STEP 4: Clean up old columns (optional - keep for now for safety)
-- Uncomment these lines after verifying migration success
-- =============================================================================
-- ALTER TABLE workflow_definitions DROP COLUMN IF EXISTS bpmn_xml;
-- ALTER TABLE workflow_definitions DROP COLUMN IF EXISTS version;

-- =============================================================================
-- STEP 5: Update the view
-- =============================================================================
CREATE OR REPLACE VIEW v_workflow_definition_summary AS
SELECT
    wd.id,
    wd.name,
    wd.description,
    wd.process_id,
    wd.status,
    wd.created_by,
    wd.created_at,
    wd.updated_at,
    COUNT(wdv.id) as version_count,
    MAX(CASE WHEN wdv.is_active THEN wdv.version END) as active_version
FROM workflow_definitions wd
LEFT JOIN workflow_definition_versions wdv ON wd.id = wdv.definition_id
GROUP BY wd.id, wd.name, wd.description, wd.process_id, wd.status,
         wd.created_by, wd.created_at, wd.updated_at;

-- =============================================================================
-- Success message
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'Migration complete!';
    RAISE NOTICE 'New table: workflow_definition_versions';
    RAISE NOTICE 'New view: v_workflow_definition_summary';
    RAISE NOTICE '=========================================';
END $$;
