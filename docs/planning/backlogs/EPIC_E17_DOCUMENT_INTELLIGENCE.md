# Epic E17: Document Intelligence Base Layer - Detailed Backlog

**Epic Owner:** Backend / AI Team
**Target Phase:** Days 30-90 (Foundation + Early Features)
**Created:** December 1, 2025
**Status:** Ready for Sprint Planning

---

## Epic Overview

**Full Scope:** 89 points
**MVP Core (P0/P1):** 58 points
**Original Gap:** E7 (Documents) covers storage; this covers processing

The Document Intelligence Base Layer provides the foundational infrastructure for ingesting, processing, extracting data from, and analyzing documents across Connect 2.0. This enables Feasibility, Entitlement, and Lending workflows to automatically extract key information from surveys, title reports, arborist reports, and other critical documents.

**Business Value:**
- Eliminate 30-60 minutes of manual document review per feasibility project
- Reduce data entry errors from manual transcription
- Enable AI-powered document summaries for faster decision-making
- Create searchable, structured data from unstructured PDFs

**Why This Epic is Critical:**
- E5 (Feasibility) depends on extracting data from surveys, title, arborist reports
- E6 (Entitlement) needs permit document processing
- Without this layer, AI features (PRD Section 10) have no foundation
- Manual document summarization is a major time sink identified in PRD

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCUMENT UPLOAD                               │
│  (E7 Documents - Upload UI, Storage)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               DOCUMENT INTELLIGENCE LAYER (E17)                  │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Ingestion   │  │ Processing  │  │ Extraction  │             │
│  │ Pipeline    │──▶│ Queue       │──▶│ Engine     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                                   │                    │
│         │         ┌─────────────┐          │                    │
│         │         │ Document    │          │                    │
│         └────────▶│ Type        │◀─────────┘                    │
│                   │ Registry    │                               │
│                   └─────────────┘                               │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ OCR         │  │ Metadata    │  │ AI          │             │
│  │ Service     │  │ Extractor   │  │ Summarizer  │             │
│  │ (Textract)  │  │             │  │ (Bedrock)   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTRACTED DATA STORAGE                        │
│  documents.extracted_data (JSONB)                               │
│  documents.summary (TEXT)                                       │
│  documents.processing_status (ENUM)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Document Types & Extraction Schemas

### Supported Document Types (MVP)

| Document Type | Source | Key Fields to Extract | Priority |
|--------------|--------|----------------------|----------|
| **Survey** | Surveyor | Lot dimensions, easements, setbacks, encroachments, total acreage | P0 |
| **Title Report** | Title company | Legal description, liens, exceptions, ownership chain | P0 |
| **Arborist Report** | Arborist | Tree count, protected species, removal restrictions, mitigation required | P0 |
| **Proforma** | Internal | Purchase price, construction costs, projected ROI, unit count | P1 |
| **Permit Application** | City | Permit number, submission date, project type, fees | P1 |
| **Inspection Report** | Inspector | Inspection date, completion %, issues found, photos | P2 |

### Extraction Schema Examples

**Survey Extraction Schema:**
```json
{
  "document_type": "SURVEY",
  "version": "1.0",
  "fields": {
    "lot_dimensions": { "type": "object", "properties": { "width": "number", "depth": "number", "unit": "string" }},
    "total_acreage": { "type": "number" },
    "easements": { "type": "array", "items": { "type": "string", "width": "number", "location": "string" }},
    "setbacks": { "type": "object", "properties": { "front": "number", "rear": "number", "left": "number", "right": "number" }},
    "encroachments": { "type": "array", "items": { "type": "string", "description": "string" }},
    "flood_zone": { "type": "string" },
    "zoning": { "type": "string" }
  }
}
```

**Title Report Extraction Schema:**
```json
{
  "document_type": "TITLE_REPORT",
  "version": "1.0",
  "fields": {
    "legal_description": { "type": "string" },
    "parcel_number": { "type": "string" },
    "current_owner": { "type": "string" },
    "liens": { "type": "array", "items": { "holder": "string", "amount": "number", "recorded_date": "date" }},
    "exceptions": { "type": "array", "items": { "type": "string", "description": "string" }},
    "encumbrances": { "type": "array", "items": { "type": "string" }},
    "effective_date": { "type": "date" }
  }
}
```

**Arborist Report Extraction Schema:**
```json
{
  "document_type": "ARBORIST_REPORT",
  "version": "1.0",
  "fields": {
    "total_tree_count": { "type": "number" },
    "protected_trees": { "type": "number" },
    "trees_to_remove": { "type": "number" },
    "protected_species": { "type": "array", "items": { "species": "string", "count": "number", "dbh": "number" }},
    "removal_restrictions": { "type": "array", "items": { "type": "string" }},
    "mitigation_required": { "type": "boolean" },
    "mitigation_details": { "type": "string" },
    "estimated_cost": { "type": "number" }
  }
}
```

---

## Feature 1: Document Ingestion Pipeline (PRIORITY: P0)

### User Story E17-US1
**As a** system, **I need to** automatically queue uploaded documents for processing, **so that** extraction happens without manual intervention.

**Acceptance Criteria:**
- [ ] Documents queued for processing on upload
- [ ] Queue handles high volume (100+ docs/day)
- [ ] Failed processing retries with exponential backoff
- [ ] Processing status visible in UI (Pending, Processing, Completed, Failed)
- [ ] Webhook notification when processing completes

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E17-T1 | Design document processing queue schema | 2 | P0 | E2, E7 |
| E17-T2 | Create document_processing_jobs table | 2 | P0 | E17-T1 |
| E17-T3 | Implement DocumentQueueService | 3 | P0 | E17-T2 |
| E17-T4 | Create queue worker process | 3 | P0 | E17-T3 |
| E17-T5 | Implement retry logic with exponential backoff | 2 | P0 | E17-T4 |
| E17-T6 | Add processing status to documents table | 1 | P0 | E7, E17-T2 |
| E17-T7 | Trigger queue on document upload (E7 integration) | 2 | P0 | E17-T3, E7 |
| E17-T8 | Unit tests for queue service | 2 | P0 | E17-T3 |

**Subtotal:** 17 points

---

## Feature 2: OCR & Text Extraction (PRIORITY: P0)

### User Story E17-US2
**As a** system, **I need to** extract text from PDF documents, **so that** I can analyze their content.

**Acceptance Criteria:**
- [ ] Extract text from PDF documents (including scanned PDFs)
- [ ] Preserve document structure (headings, tables, lists)
- [ ] Handle multi-page documents
- [ ] Support common formats: PDF, PNG, JPG, TIFF
- [ ] Store raw extracted text for search indexing

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E17-T9 | Set up AWS Textract service | 3 | P0 | AWS account |
| E17-T10 | Implement OCR service wrapper | 3 | P0 | E17-T9 |
| E17-T11 | Handle multi-page document processing | 2 | P0 | E17-T10 |
| E17-T12 | Extract and preserve document structure | 3 | P1 | E17-T10 |
| E17-T13 | Store raw text in documents table | 2 | P0 | E17-T10, E7 |
| E17-T14 | Add full-text search index on extracted text | 2 | P1 | E17-T13 |
| E17-T15 | Unit tests for OCR service | 2 | P0 | E17-T10 |

**Subtotal:** 17 points

---

## Feature 3: Document Type Registry (PRIORITY: P0)

### User Story E17-US3
**As a** platform, **I need to** maintain a registry of document types and their extraction schemas, **so that** extraction logic is configurable per document type.

**Acceptance Criteria:**
- [ ] Document types defined with extraction schemas
- [ ] Schema versioning for backward compatibility
- [ ] Admin UI to manage document type definitions
- [ ] Automatic document type detection (optional, P2)

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E17-T16 | Create document_types table | 2 | P0 | E2 |
| E17-T17 | Define MVP document type schemas (Survey, Title, Arborist) | 3 | P0 | E17-T16 |
| E17-T18 | Implement DocumentTypeService | 2 | P0 | E17-T16 |
| E17-T19 | Add schema validation for extracted data | 2 | P1 | E17-T17 |
| E17-T20 | Build Document Type admin UI | 5 | P2 | E17-T18 |
| E17-T21 | Implement automatic document type detection | 5 | P2 | E17-T10, ML model |

**Subtotal:** 19 points

---

## Feature 4: Metadata Extraction Engine (PRIORITY: P0)

### User Story E17-US4
**As an** acquisitions specialist, **I need** key data points automatically extracted from documents, **so that** I don't have to manually read and transcribe information.

**Acceptance Criteria:**
- [ ] Extract structured data based on document type schema
- [ ] AWS Textract for form/table extraction
- [ ] AWS Bedrock (Claude) for unstructured text extraction
- [ ] Confidence scores for extracted values
- [ ] Manual correction UI for low-confidence extractions

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E17-T22 | Implement extraction orchestrator | 3 | P0 | E17-T10, E17-T18 |
| E17-T23 | AWS Textract AnalyzeDocument integration | 3 | P0 | E17-T9 |
| E17-T24 | AWS Bedrock extraction prompts for unstructured text | 3 | P1 | AWS Bedrock |
| E17-T25 | Implement confidence scoring | 2 | P1 | E17-T22 |
| E17-T26 | Store extracted data in documents.extracted_data | 2 | P0 | E17-T22, E7 |
| E17-T27 | Build extraction review UI | 5 | P1 | E17-T26 |
| E17-T28 | Manual correction workflow | 3 | P1 | E17-T27 |
| E17-T29 | Unit tests for extraction engine | 2 | P0 | E17-T22 |

**Subtotal:** 23 points

---

## Feature 5: AI Document Summarization (PRIORITY: P1)

### User Story E17-US5
**As an** acquisitions specialist, **I need** AI-generated summaries of documents, **so that** I can quickly understand key points without reading entire reports.

**Acceptance Criteria:**
- [ ] Generate 3-5 bullet point summaries
- [ ] Highlight key risks or issues
- [ ] Summary appears in document viewer
- [ ] Configurable summary length
- [ ] Human can edit/approve summaries

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E17-T30 | Implement summarization service (AWS Bedrock) | 3 | P1 | E17-T13, AWS Bedrock |
| E17-T31 | Create document-type specific prompts | 2 | P1 | E17-T17, E17-T30 |
| E17-T32 | Store summaries in documents table | 1 | P1 | E17-T30, E7 |
| E17-T33 | Display summary in document viewer | 3 | P1 | E17-T32, E7 UI |
| E17-T34 | Summary edit/approval workflow | 2 | P2 | E17-T33 |
| E17-T35 | Unit tests for summarization | 2 | P1 | E17-T30 |

**Subtotal:** 13 points

---

## Deferred Features (Phase 2: Days 91-180)

### Feature 6: Document Comparison (18 points)
- E17-T36 to E17-T42
- Compare versions of same document
- Highlight changes between title reports
- Track document evolution

### Feature 7: Batch Processing (12 points)
- E17-T43 to E17-T47
- Process multiple documents simultaneously
- Bulk extraction for migration
- Performance optimization

---

## Epic Summary

| Feature | Full Points | MVP Points | Phase |
|---------|-------------|------------|-------|
| Document Ingestion Pipeline | 17 | 17 | Phase 1 (Days 30-45) |
| OCR & Text Extraction | 17 | 15 | Phase 1 (Days 30-60) |
| Document Type Registry | 19 | 9 | Phase 1 (Days 45-60) |
| Metadata Extraction Engine | 23 | 18 | Phase 1 (Days 45-75) |
| AI Summarization | 13 | 11 | Phase 1 (Days 60-90) |
| Document Comparison | 18 | — | Phase 2 |
| Batch Processing | 12 | — | Phase 2 |
| **TOTAL** | **119** | **70** | — |

---

## Dependencies

**Blocks:**
- E5 (Feasibility) - Automatic extraction of survey, title, arborist data
- E6 (Entitlement) - Permit document processing
- E9 (Lending) - Loan document processing
- E14 (Analytics) - Document-based insights

**Blocked By:**
- E2 (Core Data Model) - Database schema required
- E7 (Documents) - Document upload and storage
- E3 (Auth) - API authentication
- AWS Account - Textract service
- AWS Bedrock - Claude access for extraction/summarization

**Integration Points:**
- **E7 (Documents):** Trigger E17 processing on document upload
- **E5 (Feasibility):** Display extracted data in feasibility views
- **E16 (Audit):** Log all extraction operations

---

## Database Schema Additions

### Additions to documents table (E7)

```sql
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_status VARCHAR(20)
    DEFAULT 'PENDING'
    CHECK (processing_status IN ('PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'));

ALTER TABLE documents ADD COLUMN IF NOT EXISTS extracted_text TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS extracted_data JSONB;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS extraction_confidence DECIMAL(3,2);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_error TEXT;

-- Full-text search index on extracted text
CREATE INDEX idx_documents_extracted_text ON documents USING GIN (to_tsvector('english', extracted_text));
```

### document_processing_jobs

```sql
CREATE TABLE document_processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Document reference
    document_id UUID NOT NULL REFERENCES documents(id),

    -- Job details
    job_type VARCHAR(50) NOT NULL,  -- OCR, EXTRACTION, SUMMARIZATION
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    priority INT NOT NULL DEFAULT 5,  -- 1=highest, 10=lowest

    -- Processing details
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    next_retry_at TIMESTAMPTZ,

    -- Results
    result JSONB,
    error_message TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_processing_jobs_status ON document_processing_jobs (status, priority, created_at);
CREATE INDEX idx_processing_jobs_document ON document_processing_jobs (document_id);
CREATE INDEX idx_processing_jobs_next_retry ON document_processing_jobs (next_retry_at) WHERE status = 'FAILED';
```

### document_types

```sql
CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Type identification
    type_code VARCHAR(50) NOT NULL UNIQUE,  -- SURVEY, TITLE_REPORT, ARBORIST_REPORT
    display_name VARCHAR(100) NOT NULL,
    description TEXT,

    -- Extraction configuration
    extraction_schema JSONB NOT NULL,  -- JSON Schema for extracted fields
    extraction_prompts JSONB,  -- GPT prompts for extraction
    summarization_prompt TEXT,  -- GPT prompt for summary

    -- Versioning
    schema_version VARCHAR(10) NOT NULL DEFAULT '1.0',

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert MVP document types
INSERT INTO document_types (type_code, display_name, extraction_schema) VALUES
('SURVEY', 'Survey Report', '{"fields": {...}}'),
('TITLE_REPORT', 'Title Report', '{"fields": {...}}'),
('ARBORIST_REPORT', 'Arborist Report', '{"fields": {...}}');
```

---

## API Endpoints

### POST /api/v1/documents/{id}/process

Trigger processing for a specific document.

**Request:**
```json
{
  "job_types": ["OCR", "EXTRACTION", "SUMMARIZATION"],
  "priority": 1
}
```

**Response:**
```json
{
  "job_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "status": "QUEUED"
}
```

### GET /api/v1/documents/{id}/extracted-data

Get extracted data for a document.

**Response:**
```json
{
  "document_id": "uuid",
  "document_type": "SURVEY",
  "processing_status": "COMPLETED",
  "extraction_confidence": 0.92,
  "extracted_data": {
    "lot_dimensions": { "width": 50, "depth": 120, "unit": "ft" },
    "total_acreage": 0.14,
    "easements": [
      { "type": "utility", "width": 10, "location": "rear" }
    ],
    "setbacks": { "front": 20, "rear": 5, "left": 5, "right": 5 },
    "flood_zone": "X",
    "zoning": "SF-5000"
  },
  "summary": "Standard 50x120 lot in SF-5000 zone. 10ft utility easement at rear. No flood risk (Zone X). Standard setbacks apply.",
  "processed_at": "2025-12-01T10:30:00Z"
}
```

### PATCH /api/v1/documents/{id}/extracted-data

Update extracted data (manual corrections).

**Request:**
```json
{
  "extracted_data": {
    "lot_dimensions": { "width": 52, "depth": 120, "unit": "ft" }
  },
  "correction_note": "Width corrected from survey scale"
}
```

### GET /api/v1/document-types

List available document types.

**Response:**
```json
{
  "data": [
    {
      "type_code": "SURVEY",
      "display_name": "Survey Report",
      "extraction_schema": { "fields": {...} }
    },
    ...
  ]
}
```

---

## AWS Document Intelligence Configuration

### Services Used

| Service | Purpose | Pricing Tier |
|---------|---------|--------------|
| **AWS Textract** | OCR + form field extraction | Pay-per-page |
| **AWS Textract AnalyzeDocument** | Layout analysis, table extraction | Pay-per-page |
| **AWS Textract Queries** | Custom field extraction with natural language queries | Pay-per-query |
| **AWS Bedrock (Claude)** | AI extraction/summarization | Pay-per-token |

### Custom Model Training

For MVP, we'll use:
1. **Textract pre-built models** for general document layout
2. **Textract Queries API** for domain-specific field extraction
3. **AWS Bedrock (Claude)** prompts for unstructured text extraction
4. **Custom Textract Adapters** (Phase 2) once we have sufficient training data

### Cost Estimates

| Operation | Cost per Document | Monthly Volume | Monthly Cost |
|-----------|-------------------|----------------|--------------|
| Textract DetectText | $0.0015/page | 3,000 pages | $4.50 |
| Textract AnalyzeDocument | $0.015/page | 500 forms | $7.50 |
| Textract Queries | $0.005/query | 2,500 queries | $12.50 |
| Bedrock Claude Extraction | $0.02/doc | 500 docs | $10 |
| Bedrock Claude Summary | $0.015/doc | 500 docs | $7.50 |
| **Total** | | | **~$42/month** |

---

## Error Handling & Retry Logic

### Retry Strategy

```
Attempt 1: Immediate
Attempt 2: 30 seconds delay
Attempt 3: 5 minutes delay
Attempt 4: 30 minutes delay (final)
```

### Error Categories

| Error Type | Retry? | Action |
|------------|--------|--------|
| Network timeout | Yes | Exponential backoff |
| AWS rate limit | Yes | Respect Retry-After header |
| Invalid document format | No | Mark failed, notify user |
| Extraction low confidence | No | Mark for manual review |
| AWS service outage | Yes | Extended backoff (1 hour) |

---

## Rollout Plan

**Sprint 3 (Days 29-42):**
- E17-T1 to E17-T8: Ingestion pipeline
- E17-T9, E17-T10: AWS Textract setup, OCR wrapper

**Sprint 4 (Days 43-56):**
- E17-T11 to E17-T15: OCR completion
- E17-T16 to E17-T19: Document type registry
- E17-T22, E17-T23: Extraction orchestrator

**Sprint 5 (Days 57-70):**
- E17-T24 to E17-T29: Full extraction engine
- E17-T30 to E17-T32: Summarization

**Sprint 6 (Days 71-84):**
- E17-T33, E17-T34: UI integration
- E17-T35: Testing and refinement
- Integration with E5 (Feasibility)

---

## Success Metrics (Day 90)

| Metric | Target |
|--------|--------|
| Documents processed automatically | ≥90% |
| Extraction accuracy (key fields) | ≥85% |
| Processing time (per document) | < 60 seconds |
| User time saved per document | 30-60 minutes |
| Manual corrections required | < 15% of extractions |

---

## File References

- [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) - Section 10 AI & Automation
- [DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md) - Document tables
- [EPIC_E7_DOCUMENTS.md](EPIC_E7_DOCUMENTS.md) - Document storage (pending creation)
- [EPIC_E5_FEASIBILITY_MODULE.md](EPIC_E5_FEASIBILITY_MODULE.md) - Feasibility workflow
- [INTEGRATION_SPECIFICATIONS.md](../technical/INTEGRATION_SPECIFICATIONS.md) - AWS integration

---

**Status:** Ready for Sprint Planning
**Priority:** HIGH - Enables E5 Feasibility automation
**Next Steps:** Set up AWS account, create GitHub issues, assign to Sprint 3-5
