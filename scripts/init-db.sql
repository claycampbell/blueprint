-- ============================================
-- Connect 2.0 - Database Initialization Script
-- ============================================
-- This script runs automatically when PostgreSQL container starts
-- It creates the schema, tables, indexes, and seed data for local development

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";       -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- Fuzzy text search
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Query performance tracking

-- Create schemas
CREATE SCHEMA IF NOT EXISTS connect2;

-- Set search path
SET search_path TO connect2, public;

-- ============================================
-- Core Tables
-- ============================================

-- Users table (internal Blueprint staff and external users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,  -- ADMIN, ACQUISITIONS, DESIGN, ENTITLEMENT, SERVICING, AGENT, BUILDER, CONSULTANT
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contacts (agents, builders, consultants, borrowers, guarantors)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,  -- AGENT, BUILDER, CONSULTANT, BORROWER, GUARANTOR, SPONSOR
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects (leads, feasibility, entitlement)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_number VARCHAR(50) UNIQUE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    parcel_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'LEAD',  -- LEAD, FEASIBILITY, GO, PASS, CLOSED
    purchase_price DECIMAL(12, 2),
    list_price DECIMAL(12, 2),
    submitted_by UUID REFERENCES contacts(id),  -- Agent who submitted
    assigned_to UUID REFERENCES users(id),      -- Acquisitions specialist
    assigned_builder UUID REFERENCES contacts(id),
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feasibility records
CREATE TABLE IF NOT EXISTS feasibility (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    viability_score DECIMAL(5, 2),
    go_decision_date DATE,
    decision_notes TEXT,
    proforma JSONB,  -- Store proforma as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Consultant tasks (surveys, title reports, arborist reports, etc.)
CREATE TABLE IF NOT EXISTS consultant_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feasibility_id UUID NOT NULL REFERENCES feasibility(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES contacts(id),
    task_type VARCHAR(50) NOT NULL,  -- SURVEY, TITLE, ARBORIST, CIVIL, GEOTECHNICAL, etc.
    status VARCHAR(50) DEFAULT 'ORDERED',  -- ORDERED, IN_PROGRESS, DELIVERED, APPROVED, REJECTED
    ordered_date DATE,
    due_date DATE,
    delivered_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Entitlement records
CREATE TABLE IF NOT EXISTS entitlement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    selected_plan_id UUID,  -- Reference to plan library (future)
    permit_number VARCHAR(100),
    submitted_date DATE,
    approved_date DATE,
    status VARCHAR(50) DEFAULT 'PLANNING',  -- PLANNING, SUBMITTED, UNDER_REVIEW, CORRECTIONS, APPROVED, DENIED
    jurisdiction VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permit corrections/cycles
CREATE TABLE IF NOT EXISTS permit_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entitlement_id UUID NOT NULL REFERENCES entitlement(id) ON DELETE CASCADE,
    correction_number INTEGER NOT NULL,
    city_feedback TEXT,
    action_items JSONB,
    submitted_date DATE,
    resolved_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loans
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_number VARCHAR(50) UNIQUE NOT NULL,
    project_id UUID REFERENCES projects(id),
    borrower_id UUID REFERENCES contacts(id),
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, APPROVED, FUNDED, SERVICING, PAID_OFF, DEFAULT
    loan_amount DECIMAL(12, 2),
    interest_rate DECIMAL(5, 4),
    term_months INTEGER,
    closing_date DATE,
    maturity_date DATE,
    budget JSONB,
    assigned_to_bank VARCHAR(100),  -- e.g., "Columbia Bank"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan guarantors (many-to-many)
CREATE TABLE IF NOT EXISTS loan_guarantors (
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    PRIMARY KEY (loan_id, contact_id)
);

-- Draws
CREATE TABLE IF NOT EXISTS draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    draw_number INTEGER NOT NULL,
    requested_amount DECIMAL(12, 2),
    approved_amount DECIMAL(12, 2),
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, APPROVED, PAID, HELD
    inspection_id UUID,  -- Reference to inspection (future)
    conditions_met BOOLEAN DEFAULT false,
    notes TEXT,
    requested_date DATE,
    approved_date DATE,
    paid_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (loan_id, draw_number)
);

-- Documents (all project/loan documents)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    consultant_task_id UUID REFERENCES consultant_tasks(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,  -- SURVEY, TITLE, ARBORIST, PROFORMA, PLAN, PERMIT, INSPECTION, etc.
    filename VARCHAR(255) NOT NULL,
    storage_bucket VARCHAR(100),
    storage_key VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    extracted_data JSONB,  -- AI extracted fields
    summary TEXT,          -- AI generated summary
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks (workflow tasks for team members)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES users(id),
    assigned_contact UUID REFERENCES contacts(id),  -- For external consultants
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    priority VARCHAR(20) DEFAULT 'MEDIUM',  -- LOW, MEDIUM, HIGH, URGENT
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log (track all important changes)
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,  -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Contacts
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_name);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_city ON projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_submitted_by ON projects(submitted_by);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Feasibility
CREATE INDEX IF NOT EXISTS idx_feasibility_project_id ON feasibility(project_id);

-- Consultant Tasks
CREATE INDEX IF NOT EXISTS idx_consultant_tasks_feasibility ON consultant_tasks(feasibility_id);
CREATE INDEX IF NOT EXISTS idx_consultant_tasks_consultant ON consultant_tasks(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultant_tasks_status ON consultant_tasks(status);
CREATE INDEX IF NOT EXISTS idx_consultant_tasks_due_date ON consultant_tasks(due_date);

-- Entitlement
CREATE INDEX IF NOT EXISTS idx_entitlement_project_id ON entitlement(project_id);
CREATE INDEX IF NOT EXISTS idx_entitlement_status ON entitlement(status);

-- Loans
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_project_id ON loans(project_id);
CREATE INDEX IF NOT EXISTS idx_loans_borrower_id ON loans(borrower_id);
CREATE INDEX IF NOT EXISTS idx_loans_loan_number ON loans(loan_number);

-- Draws
CREATE INDEX IF NOT EXISTS idx_draws_loan_id ON draws(loan_id);
CREATE INDEX IF NOT EXISTS idx_draws_status ON draws(status);

-- Documents
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_loan_id ON documents(loan_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at DESC);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_loan_id ON tasks(loan_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Audit Log
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_projects_address_trgm ON projects USING gin(address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_contacts_name_trgm ON contacts USING gin(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') gin_trgm_ops);

-- ============================================
-- Seed Data for Local Development
-- ============================================

-- Insert admin user
INSERT INTO users (email, first_name, last_name, role, is_active) VALUES
    ('admin@connect2.local', 'Admin', 'User', 'ADMIN', true),
    ('acquisitions@connect2.local', 'John', 'Acquisitions', 'ACQUISITIONS', true),
    ('design@connect2.local', 'Sarah', 'Design', 'DESIGN', true),
    ('entitlement@connect2.local', 'Mike', 'Entitlement', 'ENTITLEMENT', true),
    ('servicing@connect2.local', 'Emily', 'Servicing', 'SERVICING', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts (type, first_name, last_name, email, phone, company_name) VALUES
    ('AGENT', 'Jane', 'Realtor', 'jane@realestate.com', '206-555-0101', 'Best Realty'),
    ('BUILDER', 'Bob', 'Builder', 'bob@buildco.com', '206-555-0102', 'BuildCo LLC'),
    ('CONSULTANT', 'Sam', 'Surveyor', 'sam@surveys.com', '206-555-0103', 'Precision Surveys'),
    ('CONSULTANT', 'Alex', 'Arborist', 'alex@trees.com', '206-555-0104', 'Tree Experts Inc')
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO projects (project_number, address, city, state, zip, status, purchase_price, list_price, submitted_by, assigned_to) VALUES
    ('PROJ-2025-001', '123 Main St', 'Seattle', 'WA', '98101', 'LEAD', 500000, 550000,
        (SELECT id FROM contacts WHERE email = 'jane@realestate.com' LIMIT 1),
        (SELECT id FROM users WHERE role = 'ACQUISITIONS' LIMIT 1)),
    ('PROJ-2025-002', '456 Oak Ave', 'Phoenix', 'AZ', '85001', 'FEASIBILITY', 750000, 800000,
        (SELECT id FROM contacts WHERE email = 'jane@realestate.com' LIMIT 1),
        (SELECT id FROM users WHERE role = 'ACQUISITIONS' LIMIT 1)),
    ('PROJ-2025-003', '789 Pine Rd', 'Seattle', 'WA', '98102', 'GO', 1200000, 1300000,
        (SELECT id FROM contacts WHERE email = 'jane@realestate.com' LIMIT 1),
        (SELECT id FROM users WHERE role = 'ACQUISITIONS' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert feasibility record for PROJ-2025-002
INSERT INTO feasibility (project_id, viability_score, proforma) VALUES
    ((SELECT id FROM projects WHERE project_number = 'PROJ-2025-002' LIMIT 1),
     85.5,
     '{"acquisition_cost": 750000, "construction_cost": 1500000, "expected_revenue": 3000000, "profit_margin": 25}'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert sample consultant tasks
INSERT INTO consultant_tasks (feasibility_id, consultant_id, task_type, status, ordered_date, due_date) VALUES
    ((SELECT id FROM feasibility WHERE project_id = (SELECT id FROM projects WHERE project_number = 'PROJ-2025-002' LIMIT 1) LIMIT 1),
     (SELECT id FROM contacts WHERE email = 'sam@surveys.com' LIMIT 1),
     'SURVEY', 'IN_PROGRESS', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days'),
    ((SELECT id FROM feasibility WHERE project_id = (SELECT id FROM projects WHERE project_number = 'PROJ-2025-002' LIMIT 1) LIMIT 1),
     (SELECT id FROM contacts WHERE email = 'alex@trees.com' LIMIT 1),
     'ARBORIST', 'ORDERED', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '12 days')
ON CONFLICT DO NOTHING;

-- Insert sample loan
INSERT INTO loans (loan_number, project_id, borrower_id, status, loan_amount, interest_rate, term_months, closing_date, maturity_date) VALUES
    ('LOAN-2025-001',
     (SELECT id FROM projects WHERE project_number = 'PROJ-2025-003' LIMIT 1),
     (SELECT id FROM contacts WHERE email = 'bob@buildco.com' LIMIT 1),
     'FUNDED', 2000000, 0.0950, 24, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '690 days')
ON CONFLICT DO NOTHING;

-- Insert sample draw
INSERT INTO draws (loan_id, draw_number, requested_amount, approved_amount, status, requested_date, approved_date) VALUES
    ((SELECT id FROM loans WHERE loan_number = 'LOAN-2025-001' LIMIT 1),
     1, 500000, 500000, 'PAID', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '20 days')
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (title, description, assigned_to, project_id, due_date, status, priority) VALUES
    ('Review feasibility report',
     'Review the feasibility report for PROJ-2025-002 and make GO/PASS decision',
     (SELECT id FROM users WHERE role = 'ACQUISITIONS' LIMIT 1),
     (SELECT id FROM projects WHERE project_number = 'PROJ-2025-002' LIMIT 1),
     CURRENT_DATE + INTERVAL '5 days', 'PENDING', 'HIGH'),
    ('Submit permit application',
     'Submit permit application to City of Seattle for PROJ-2025-003',
     (SELECT id FROM users WHERE role = 'ENTITLEMENT' LIMIT 1),
     (SELECT id FROM projects WHERE project_number = 'PROJ-2025-003' LIMIT 1),
     CURRENT_DATE + INTERVAL '15 days', 'IN_PROGRESS', 'MEDIUM')
ON CONFLICT DO NOTHING;

-- ============================================
-- Utility Functions
-- ============================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all main tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'connect2'
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN ('audit_log')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON connect2.%I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON connect2.%I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Grants and Permissions
-- ============================================

-- Create read-only user for reporting
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'connect_readonly') THEN
        CREATE USER connect_readonly WITH PASSWORD 'readonly_password';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE connect2_dev TO connect_readonly;
GRANT USAGE ON SCHEMA connect2 TO connect_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA connect2 TO connect_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA connect2 GRANT SELECT ON TABLES TO connect_readonly;

-- ============================================
-- Summary
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Database initialization complete!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Schema: connect2';
    RAISE NOTICE 'Tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'connect2');
    RAISE NOTICE 'Sample projects: %', (SELECT COUNT(*) FROM connect2.projects);
    RAISE NOTICE 'Sample users: %', (SELECT COUNT(*) FROM connect2.users);
    RAISE NOTICE 'Sample contacts: %', (SELECT COUNT(*) FROM connect2.contacts);
    RAISE NOTICE '============================================';
END
$$;

COMMIT;
