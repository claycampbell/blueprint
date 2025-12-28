-- SpiffWorkflow POC Database Setup
-- Creates the workflow_poc database and required tables

-- Run this as a PostgreSQL superuser:
-- psql -U postgres -f init_workflow_poc_db.sql

-- Create database (run separately if needed)
-- CREATE DATABASE workflow_poc;

-- Connect to the database
\c workflow_poc;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- WORKFLOW DEFINITIONS
-- Stores the BPMN XML for workflow templates
-- =============================================================================
CREATE TABLE IF NOT EXISTS workflow_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    bpmn_xml TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, published, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, version)
);

-- =============================================================================
-- PROJECTS
-- The main entity being worked on (a property in the real system)
-- =============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    -- Current workflow position (denormalized for quick queries)
    current_value_stream VARCHAR(50) DEFAULT 'VS4',
    current_workflow_group VARCHAR(50),
    current_workflow_item VARCHAR(50),
    -- Link to workflow engine
    workflow_instance_id VARCHAR(255),
    workflow_definition_id UUID REFERENCES workflow_definitions(id),
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- WORKFLOW INSTANCES
-- Stores SpiffWorkflow serialized state
-- =============================================================================
CREATE TABLE IF NOT EXISTS workflow_instances (
    id VARCHAR(255) PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    workflow_definition_id UUID REFERENCES workflow_definitions(id),
    -- SpiffWorkflow serialized state (JSON)
    serialized_state JSONB NOT NULL,
    -- Quick lookup fields
    current_task_id VARCHAR(255),
    current_task_name VARCHAR(255),
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'running', -- running, suspended, completed, errored
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- STEP COMMENTS
-- Comments added at each workflow step
-- =============================================================================
CREATE TABLE IF NOT EXISTS step_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    workflow_group VARCHAR(50) NOT NULL,
    workflow_item VARCHAR(50),
    -- Comment data
    user_id VARCHAR(255) NOT NULL DEFAULT 'poc_user', -- Simplified for POC
    user_name VARCHAR(255) NOT NULL DEFAULT 'POC User',
    content TEXT NOT NULL,
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- WORKFLOW HISTORY
-- Audit trail of workflow transitions
-- =============================================================================
CREATE TABLE IF NOT EXISTS workflow_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    -- Transition details
    from_workflow_group VARCHAR(50),
    to_workflow_group VARCHAR(50),
    action VARCHAR(50) NOT NULL, -- approve, send_back, skip_to
    reason TEXT,
    -- Who made the decision
    decision_maker_id VARCHAR(255) NOT NULL DEFAULT 'poc_user',
    decision_maker_name VARCHAR(255) NOT NULL DEFAULT 'POC User',
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_current_wfg ON projects(current_workflow_group);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_project ON workflow_instances(project_id);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_status ON workflow_instances(status);
CREATE INDEX IF NOT EXISTS idx_step_comments_project ON step_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_step_comments_wfg ON step_comments(workflow_group);
CREATE INDEX IF NOT EXISTS idx_workflow_history_project ON workflow_history(project_id);

-- =============================================================================
-- SEED DATA: Insert the POC workflow definition
-- =============================================================================
INSERT INTO workflow_definitions (id, name, description, bpmn_xml, version, status)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'VS4 Design & Entitlement POC',
    'Proof of concept workflow with 3 steps: Project Kickoff, Schematic Design, Construction Docs',
    '<!-- BPMN XML will be loaded from file -->',
    1,
    'published'
) ON CONFLICT (name, version) DO NOTHING;

-- =============================================================================
-- HELPFUL VIEWS
-- =============================================================================
CREATE OR REPLACE VIEW v_project_summary AS
SELECT
    p.id,
    p.name,
    p.current_workflow_group,
    p.status,
    p.created_at,
    COUNT(DISTINCT sc.id) as comment_count,
    COUNT(DISTINCT wh.id) as transition_count
FROM projects p
LEFT JOIN step_comments sc ON p.id = sc.project_id
LEFT JOIN workflow_history wh ON p.id = wh.project_id
GROUP BY p.id, p.name, p.current_workflow_group, p.status, p.created_at;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Workflow POC database setup complete!';
    RAISE NOTICE 'Tables created: workflow_definitions, projects, workflow_instances, step_comments, workflow_history';
END $$;
