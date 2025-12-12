# Integration Specifications

**Version:** 1.0
**Last Updated:** November 5, 2025
**Status:** Draft - Ready for Technical Review
**Related Documents:** [API_SPECIFICATION.md](API_SPECIFICATION.md), [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [BPO Legacy System Integration](#2-bpo-legacy-system-integration)
3. [iPad Inspection App Integration](#3-ipad-inspection-app-integration)
4. [E-Signature Integration (DocuSign/Authentisign)](#4-e-signature-integration-docusignauthentisign)
5. [Azure Document Intelligence Integration](#5-azure-document-intelligence-integration)
6. [Email Service Integration](#6-email-service-integration)
7. [SMS Service Integration](#7-sms-service-integration)
8. [Accounting System Integration](#8-accounting-system-integration)
9. [Common Integration Patterns](#9-common-integration-patterns)
10. [Error Handling and Resilience](#10-error-handling-and-resilience)
11. [Security and Authentication](#11-security-and-authentication)
12. [Monitoring and Observability](#12-monitoring-and-observability)

---

## 1. Overview

### 1.1 Integration Strategy

Connect 2.0 follows an **API-first, loosely-coupled integration approach**:

- **RESTful APIs** for real-time synchronous operations
- **Webhooks** for event-driven asynchronous notifications
- **Batch Export/Import** for legacy system compatibility
- **Message Queues** for reliable async processing
- **Event Bus** for internal cross-module communication

### 1.2 Integration Lifecycle Phases

**Phase 1 (Days 1-90): Design & Entitlement Pilot**
- BPO integration via temporary REST API
- DocuSign/Authentisign for e-signatures
- AWS Textract for document extraction
- AWS SES / Twilio for notifications

**Phase 2 (Days 91-180): Full Platform Rebuild**
- BPO functionality absorbed into Connect 2.0 (integration deprecated)
- iPad inspection app bi-directional sync
- Accounting system integration activated
- All Phase 1 integrations continue

**Phase 3 (Days 180-360): Multi-Tenancy & Scaling**
- Tenant-specific integration configurations
- Marketplace for third-party integrations
- Enhanced API capabilities for partner ecosystem

### 1.3 Integration Principles

1. **Idempotency**: All write operations must be idempotent
2. **Retry Logic**: Exponential backoff with jitter for transient failures
3. **Circuit Breakers**: Prevent cascade failures
4. **Logging**: Structured logs with correlation IDs for all integration calls
5. **Monitoring**: Track success rates, latency, and error patterns
6. **Security**: OAuth 2.0, API keys, or mutual TLS based on integration type
7. **Rate Limiting**: Respect partner API limits, implement our own limits
8. **Versioning**: Support multiple API versions during transitions

---

## 2. BPO Legacy System Integration

### 2.1 Overview

**Purpose:** Enable Connect 2.0 to read/write lead and project data from BPO during Days 1-90 pilot phase
**Timeline:** Days 1-90 (temporary integration, deprecated in Phase 2)
**Pattern:** REST API (if available) or Batch Export/Import
**Direction:** Bi-directional (Connect 2.0 ↔ BPO)

### 2.2 Integration Pattern

**Assumption 1: BPO has REST API capabilities**

```
┌─────────────┐                ┌─────────────┐
│ Connect 2.0 │───── REST ────→│     BPO     │
│             │←──── JSON ─────│  (Firebase) │
└─────────────┘                └─────────────┘
```

**Assumption 2: BPO does not have API (fallback to batch)**

```
┌─────────────┐                ┌─────────────┐
│ Connect 2.0 │                │     BPO     │
│             │←── CSV/JSON ───│  (Firebase) │
│  Nightly    │                │   Export    │
│  Import Job │                │             │
└─────────────┘                └─────────────┘
```

### 2.3 Data Synchronization

**Entities to Sync:**
- **Projects** (lead intake through feasibility)
- **Contacts** (builders, brokers, landowners)
- **Entities** (corporate entities associated with projects)
- **Documents** (uploaded files associated with projects)

**Sync Strategy:**
- **Real-time writes**: When users create/update data in Connect 2.0, immediately sync to BPO
- **Nightly reads**: Import new leads from BPO into Connect 2.0 (overnight batch)
- **Conflict resolution**: BPO is source of truth for leads; Connect 2.0 is source of truth for projects in feasibility/entitlement

### 2.4 API Endpoints (If BPO Has API)

#### 2.4.1 Get Projects from BPO

```http
GET https://bpo.blueprint.com/api/v1/projects
Authorization: Bearer {bpo_api_key}
```

**Query Parameters:**
```
?updated_since=2025-11-04T00:00:00Z
&status=LEAD,FEASIBILITY
&limit=100
&offset=0
```

**Response:**
```json
{
  "data": [
    {
      "id": "bpo_proj_123",
      "address": "123 Main St",
      "city": "Seattle",
      "state": "WA",
      "zip": "98101",
      "status": "LEAD",
      "submitted_by": {
        "email": "builder@example.com",
        "name": "John Builder"
      },
      "submitted_at": "2025-11-01T14:30:00Z",
      "purchase_price": 500000,
      "list_price": 750000,
      "notes": "Interested in ADU development"
    }
  ],
  "pagination": {
    "total": 250,
    "limit": 100,
    "offset": 0,
    "has_more": true
  }
}
```

#### 2.4.2 Create/Update Project in BPO

```http
POST https://bpo.blueprint.com/api/v1/projects
Authorization: Bearer {bpo_api_key}
Content-Type: application/json
```

**Request:**
```json
{
  "external_id": "c20_proj_456",
  "address": "456 Elm St",
  "city": "Phoenix",
  "state": "AZ",
  "zip": "85001",
  "status": "FEASIBILITY",
  "assigned_to": "acquisitions@blueprint.com",
  "purchase_price": 400000,
  "metadata": {
    "source": "connect_2.0",
    "sync_timestamp": "2025-11-05T10:00:00Z"
  }
}
```

**Response:**
```json
{
  "id": "bpo_proj_789",
  "external_id": "c20_proj_456",
  "created_at": "2025-11-05T10:00:01Z",
  "updated_at": "2025-11-05T10:00:01Z"
}
```

### 2.5 Batch Export/Import (Fallback)

**Export from BPO (Manual or Scheduled):**
- Format: CSV or JSON
- Frequency: Nightly at 2:00 AM PST
- Delivery: SFTP, S3 bucket, or email attachment
- File naming: `bpo_export_{YYYY-MM-DD}.csv`

**Import to Connect 2.0:**
```typescript
// Pseudocode: Nightly import job
async function importBPOLeads() {
  const exportFile = await fetchLatestBPOExport(); // From S3/SFTP
  const records = await parseCSV(exportFile);

  for (const record of records) {
    const existingProject = await db.projects.findByExternalId(record.bpo_id);

    if (existingProject) {
      // Update if BPO data is newer
      if (record.updated_at > existingProject.updated_at) {
        await db.projects.update(existingProject.id, {
          ...mapBPOFields(record),
          external_id: record.bpo_id,
          external_source: 'BPO'
        });
      }
    } else {
      // Create new project
      await db.projects.create({
        ...mapBPOFields(record),
        external_id: record.bpo_id,
        external_source: 'BPO',
        status: 'LEAD'
      });
    }
  }

  await logSyncResults(records.length, successCount, errorCount);
}
```

### 2.6 Deprecation Plan (Day 90+)

**Steps:**
1. **Day 85**: Freeze BPO lead intake, redirect all new leads to Connect 2.0
2. **Day 90**: Run final sync to ensure data parity
3. **Day 91**: Disable BPO write sync (read-only for historical reference)
4. **Day 120**: Archive BPO data to Connect 2.0, decommission integration
5. **Day 180**: BPO fully replaced by Connect 2.0 lead intake module

---

## 3. iPad Inspection App Integration

### 3.1 Overview

**Purpose:** Sync construction draw inspection data between field inspectors' iPads and Connect 2.0
**Timeline:** Days 91-180 (loan servicing phase)
**Pattern:** Bi-directional REST API with offline-first mobile app
**Direction:** Bi-directional (Connect 2.0 ↔ iPad App)

### 3.2 Integration Architecture

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  iPad App    │        │ Connect 2.0  │        │  PostgreSQL  │
│  (Offline)   │        │   REST API   │        │   Database   │
│              │        │              │        │              │
│  - Capture   │───1───→│  POST /sync  │───2───→│   Inspections│
│  - Photos    │        │              │        │   Documents  │
│  - Notes     │        │              │        │              │
│              │←──3────│  GET /draws  │←──4────│              │
│  Local DB    │        │  GET /loans  │        │              │
└──────────────┘        └──────────────┘        └──────────────┘

Flow:
1. Inspector completes inspection offline, app queues sync
2. When online, app pushes inspection data + photos to Connect 2.0
3. Connect 2.0 validates and stores data
4. App pulls updated loan/draw statuses for offline reference
```

### 3.3 API Endpoints

#### 3.3.1 Sync Inspection Data (iPad → Connect 2.0)

```http
POST /api/v1/inspections/sync
Authorization: Bearer {inspector_access_token}
Content-Type: multipart/form-data
```

**Request (Multipart Form Data):**
```json
// Part 1: JSON payload
{
  "draw_id": "drw_789",
  "inspector_id": "usr_inspector_01",
  "inspection_date": "2025-11-05T14:30:00Z",
  "status": "APPROVED",
  "percentage_complete": 75,
  "notes": "Framing complete, electrical in progress",
  "checklist_items": [
    {
      "item": "Foundation",
      "status": "COMPLETE",
      "notes": "Passed inspection"
    },
    {
      "item": "Framing",
      "status": "COMPLETE",
      "notes": "All structural work done"
    },
    {
      "item": "Electrical",
      "status": "IN_PROGRESS",
      "notes": "Rough-in started"
    }
  ],
  "offline_captured": true,
  "device_id": "ipad_012345",
  "app_version": "2.1.0"
}

// Part 2: Photo attachments
// photo_1.jpg (foundation inspection)
// photo_2.jpg (framing inspection)
// photo_3.jpg (electrical progress)
```

**Response:**
```json
{
  "inspection_id": "insp_456",
  "draw_id": "drw_789",
  "status": "SYNCED",
  "photos_uploaded": 3,
  "synced_at": "2025-11-05T14:35:00Z",
  "next_sync_recommended": "2025-11-05T20:00:00Z"
}
```

#### 3.3.2 Get Draw Assignments (Connect 2.0 → iPad)

```http
GET /api/v1/inspections/assignments
Authorization: Bearer {inspector_access_token}
```

**Query Parameters:**
```
?inspector_id=usr_inspector_01
&status=PENDING,IN_PROGRESS
&updated_since=2025-11-04T00:00:00Z
```

**Response:**
```json
{
  "assignments": [
    {
      "draw_id": "drw_789",
      "loan_id": "ln_123",
      "property_address": "123 Main St, Seattle, WA 98101",
      "builder_name": "Acme Construction",
      "draw_number": 3,
      "requested_amount": 150000,
      "inspection_deadline": "2025-11-07T17:00:00Z",
      "status": "PENDING_INSPECTION",
      "previous_inspection": {
        "date": "2025-10-20T14:00:00Z",
        "percentage_complete": 60
      }
    }
  ],
  "sync_metadata": {
    "total_assignments": 1,
    "last_sync": "2025-11-05T14:35:00Z"
  }
}
```

### 3.4 Offline Sync Strategy

**Offline-First Approach:**
1. Inspector downloads assignments before going to job site
2. Inspections captured locally on iPad (photos, notes, checklist)
3. Data queued in local SQLite database
4. When internet connection available, background sync uploads data
5. Conflict resolution: Latest timestamp wins (inspections are append-only)

**Sync Frequency:**
- **Download assignments**: Every morning before fieldwork
- **Upload inspections**: Immediately when online (background queue)
- **Fallback sync**: Nightly at 8:00 PM if inspector hasn't manually synced

### 3.5 Photo Handling

**Upload Specifications:**
- **Max file size**: 10 MB per photo
- **Supported formats**: JPG, PNG, HEIC
- **Compression**: Client-side compression to reduce bandwidth
- **Storage**: Azure Blob Storage or AWS S3
- **Metadata**: EXIF data preserved (GPS coordinates, timestamp)

**Photo Processing Pipeline:**
```typescript
async function processInspectionPhoto(photo: File, inspectionId: string) {
  // 1. Compress image
  const compressed = await compressImage(photo, { quality: 0.8, maxWidth: 2048 });

  // 2. Upload to object storage
  const photoUrl = await storage.upload(`inspections/${inspectionId}/${photo.name}`, compressed);

  // 3. Extract EXIF metadata
  const metadata = await extractEXIF(compressed);

  // 4. Store in database
  await db.documents.create({
    inspection_id: inspectionId,
    type: 'INSPECTION_PHOTO',
    storage_url: photoUrl,
    file_size: compressed.size,
    metadata: {
      gps_coordinates: metadata.gps,
      captured_at: metadata.timestamp,
      device: metadata.device
    }
  });

  return photoUrl;
}
```

### 3.6 Error Handling

**Common Errors:**

| Error Code | Description | Client Action |
|------------|-------------|---------------|
| `DRAW_NOT_FOUND` | Draw ID doesn't exist | Display error, refresh assignments |
| `UNAUTHORIZED_INSPECTOR` | Inspector not assigned to this draw | Display error, contact office |
| `PHOTO_TOO_LARGE` | Photo exceeds 10 MB | Compress and retry |
| `SYNC_CONFLICT` | Another inspection already submitted | Show conflict UI, ask inspector to review |
| `NETWORK_TIMEOUT` | Upload timed out | Retry with exponential backoff |

**Retry Logic:**
```typescript
async function syncWithRetry(inspectionData: Inspection, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const result = await api.post('/inspections/sync', inspectionData);
      return result;
    } catch (error) {
      attempt++;

      if (error.status === 409) { // Conflict
        throw error; // Don't retry conflicts
      }

      if (attempt >= maxRetries) {
        await queueForLaterSync(inspectionData);
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}
```

---

## 4. E-Signature Integration (DocuSign/Authentisign)

### 4.1 Overview

**Purpose:** Send loan documents for electronic signature and track signing status
**Timeline:** Days 1-180 (all phases)
**Pattern:** Outbound API + Webhook callbacks
**Direction:** Connect 2.0 → DocuSign/Authentisign → Connect 2.0 (webhook)

### 4.2 Integration Architecture

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ Connect 2.0  │         │  DocuSign/   │         │   Borrower   │
│              │         │ Authentisign │         │   (Email)    │
│              │         │              │         │              │
│ 1. Create    │────────→│ 2. Host      │────────→│ 3. Sign      │
│    Envelope  │         │    Envelope  │         │    Documents │
│              │         │              │         │              │
│ 5. Update    │←────────│ 4. Webhook   │         │              │
│    Status    │         │    Callback  │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
```

### 4.3 DocuSign API Integration

#### 4.3.1 Create Signing Envelope

```http
POST https://api.docusign.com/v2.1/accounts/{account_id}/envelopes
Authorization: Bearer {docusign_access_token}
Content-Type: application/json
```

**Request:**
```json
{
  "emailSubject": "Blueprint Loan Agreement - Please Sign",
  "status": "sent",
  "documents": [
    {
      "documentId": "1",
      "name": "Loan Agreement",
      "documentBase64": "{base64_encoded_pdf}"
    },
    {
      "documentId": "2",
      "name": "Promissory Note",
      "documentBase64": "{base64_encoded_pdf}"
    }
  ],
  "recipients": {
    "signers": [
      {
        "email": "borrower@example.com",
        "name": "John Borrower",
        "recipientId": "1",
        "routingOrder": "1",
        "tabs": {
          "signHereTabs": [
            {
              "documentId": "1",
              "pageNumber": "5",
              "xPosition": "100",
              "yPosition": "200"
            }
          ],
          "dateSignedTabs": [
            {
              "documentId": "1",
              "pageNumber": "5",
              "xPosition": "300",
              "yPosition": "200"
            }
          ]
        }
      },
      {
        "email": "guarantor@example.com",
        "name": "Jane Guarantor",
        "recipientId": "2",
        "routingOrder": "2"
      }
    ]
  },
  "eventNotification": {
    "url": "https://connect2.blueprint.com/api/v1/webhooks/docusign",
    "loggingEnabled": true,
    "requireAcknowledgment": true,
    "envelopeEvents": [
      {
        "envelopeEventStatusCode": "completed"
      },
      {
        "envelopeEventStatusCode": "declined"
      },
      {
        "envelopeEventStatusCode": "voided"
      }
    ]
  }
}
```

**Response:**
```json
{
  "envelopeId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
  "status": "sent",
  "statusDateTime": "2025-11-05T10:00:00Z",
  "uri": "/envelopes/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
}
```

#### 4.3.2 Webhook Callback Handler

```http
POST /api/v1/webhooks/docusign
Content-Type: application/xml
X-DocuSign-Signature: {hmac_signature}
```

**Payload (XML):**
```xml
<DocuSignEnvelopeInformation>
  <EnvelopeStatus>
    <EnvelopeID>a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6</EnvelopeID>
    <Status>Completed</Status>
    <Completed>2025-11-05T14:30:00Z</Completed>
    <RecipientStatuses>
      <RecipientStatus>
        <Email>borrower@example.com</Email>
        <Status>Completed</Status>
        <Signed>2025-11-05T14:25:00Z</Signed>
      </RecipientStatus>
      <RecipientStatus>
        <Email>guarantor@example.com</Email>
        <Status>Completed</Status>
        <Signed>2025-11-05T14:30:00Z</Signed>
      </RecipientStatus>
    </RecipientStatuses>
  </EnvelopeStatus>
</DocuSignEnvelopeInformation>
```

**Handler Implementation:**
```typescript
async function handleDocuSignWebhook(req: Request, res: Response) {
  // 1. Verify HMAC signature
  const isValid = verifyDocuSignSignature(
    req.headers['x-docusign-signature'],
    req.body,
    process.env.DOCUSIGN_WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. Parse XML payload
  const envelope = await parseXML(req.body);

  // 3. Find associated loan
  const loan = await db.loans.findByDocusignEnvelopeId(envelope.envelopeId);

  if (!loan) {
    logger.warn('Received webhook for unknown envelope', { envelopeId: envelope.envelopeId });
    return res.status(404).json({ error: 'Loan not found' });
  }

  // 4. Update loan status
  if (envelope.status === 'Completed') {
    await db.loans.update(loan.id, {
      status: 'SIGNED',
      signed_at: envelope.completed,
      docusign_envelope_id: envelope.envelopeId
    });

    // 5. Download signed documents
    const signedDocs = await docusign.getEnvelopeDocuments(envelope.envelopeId);
    for (const doc of signedDocs) {
      await storage.upload(`loans/${loan.id}/signed/${doc.name}`, doc.content);
      await db.documents.create({
        loan_id: loan.id,
        type: 'SIGNED_AGREEMENT',
        storage_url: doc.url,
        signed_at: envelope.completed
      });
    }

    // 6. Trigger next workflow step
    await eventBus.publish('loan.documents_signed', { loanId: loan.id });
  } else if (envelope.status === 'Declined') {
    await db.loans.update(loan.id, { status: 'SIGNATURE_DECLINED' });
    await notifyLoanOfficer(loan.id, 'Documents declined by signer');
  }

  // 7. Acknowledge receipt
  return res.status(200).json({ message: 'Webhook processed' });
}
```

### 4.4 Authentisign Integration

**Similar pattern to DocuSign, adjusted for Authentisign API:**
- Endpoint: `POST https://api.authentisign.com/v1/transactions`
- Webhook URL: `https://connect2.blueprint.com/api/v1/webhooks/authentisign`
- JSON-based API (not XML)
- Response format aligned with their schema

### 4.5 Document Preparation

**Pre-Signing Workflow:**
```typescript
async function prepareLoanDocumentsForSigning(loanId: string) {
  // 1. Generate documents from templates
  const loan = await db.loans.findById(loanId);
  const documents = await generateLoanDocuments(loan, [
    'LOAN_AGREEMENT',
    'PROMISSORY_NOTE',
    'SECURITY_AGREEMENT',
    'PERSONAL_GUARANTEE'
  ]);

  // 2. Merge data into PDF templates
  const mergedDocs = await Promise.all(
    documents.map(doc => mergePDFTemplate(doc.template, loan))
  );

  // 3. Create envelope in DocuSign/Authentisign
  const envelope = await docusign.createEnvelope({
    emailSubject: `Blueprint Loan #${loan.loan_number} - Please Sign`,
    documents: mergedDocs.map((doc, idx) => ({
      documentId: String(idx + 1),
      name: doc.name,
      documentBase64: doc.base64Content
    })),
    signers: [
      {
        email: loan.borrower_email,
        name: loan.borrower_name,
        recipientId: '1',
        routingOrder: '1'
      },
      ...loan.guarantors.map((g, idx) => ({
        email: g.email,
        name: g.name,
        recipientId: String(idx + 2),
        routingOrder: String(idx + 2)
      }))
    ]
  });

  // 4. Store envelope ID
  await db.loans.update(loanId, {
    docusign_envelope_id: envelope.envelopeId,
    status: 'PENDING_SIGNATURE',
    signature_sent_at: new Date()
  });

  return envelope;
}
```

### 4.6 Error Handling

**Common Errors:**

| Error Code | Description | Retry Strategy |
|------------|-------------|----------------|
| `INVALID_EMAIL` | Recipient email invalid | Don't retry, notify user to fix |
| `DOCUMENT_TOO_LARGE` | PDF exceeds size limit | Compress PDF and retry |
| `QUOTA_EXCEEDED` | Monthly envelope limit reached | Queue for next month, alert admin |
| `WEBHOOK_FAILED` | Webhook delivery failed | DocuSign auto-retries, we log |
| `SIGNER_LOCKED_OUT` | Too many failed auth attempts | Wait 1 hour, resend link |

---

## 5. AWS Textract Integration

### 5.1 Overview

**Purpose:** Extract structured data from uploaded documents (surveys, title reports, arborist reports, permits)
**Timeline:** Days 1-180 (all phases)
**Pattern:** Asynchronous job submission + polling or SNS notification
**Direction:** Connect 2.0 → AWS Textract → Connect 2.0
**AWS Region:** us-west-2 (primary)

### 5.2 Integration Architecture

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  User        │         │ Connect 2.0  │         │    AWS       │
│  Uploads     │         │              │         │   Textract   │
│  Document    │         │              │         │              │
│              │         │              │         │              │
│ 1. Upload    │────────→│ 2. Store     │────────→│ 3. Analyze   │
│    Survey    │         │    in S3     │         │    Document  │
│              │         │              │         │              │
│              │         │ 5. Display   │←────────│ 4. Extract   │
│              │         │    Extracted │  (SNS)  │    Data      │
│              │         │    Fields    │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
```

### 5.3 Supported Document Types

| Document Type | Use Case | Key Fields Extracted | Textract Feature |
|---------------|----------|---------------------|------------------|
| **Survey** | Property boundaries, easements | Lot size, setbacks, easements, flood zone | AnalyzeDocument + Queries |
| **Title Report** | Ownership verification | Owner name, liens, encumbrances, legal description | AnalyzeDocument + Tables |
| **Arborist Report** | Tree preservation requirements | Tree count, protected species, removal permits needed | AnalyzeDocument + Queries |
| **Permit Application** | Entitlement tracking | Permit type, application date, jurisdiction, fees | AnalyzeDocument + Forms |
| **Inspection Report** | Draw verification | Completion percentage, deficiencies, approvals | AnalyzeDocument + Tables |

### 5.4 AWS Textract API Integration

#### 5.4.1 Start Async Document Analysis

```http
POST https://textract.us-west-2.amazonaws.com/
Content-Type: application/x-amz-json-1.1
X-Amz-Target: Textract.StartDocumentAnalysis
Authorization: AWS4-HMAC-SHA256 ...
```

**Request:**
```json
{
  "DocumentLocation": {
    "S3Object": {
      "Bucket": "blueprint-documents",
      "Name": "projects/proj_123/survey_123.pdf"
    }
  },
  "FeatureTypes": ["TABLES", "FORMS", "QUERIES"],
  "QueriesConfig": {
    "Queries": [
      { "Text": "What is the parcel number?" },
      { "Text": "What is the lot size in square feet?" },
      { "Text": "What is the flood zone designation?" },
      { "Text": "What are the setback requirements?" },
      { "Text": "What easements exist on the property?" }
    ]
  },
  "NotificationChannel": {
    "SNSTopicArn": "arn:aws:sns:us-west-2:123456789012:textract-results",
    "RoleArn": "arn:aws:iam::123456789012:role/TextractServiceRole"
  },
  "OutputConfig": {
    "S3Bucket": "blueprint-textract-results",
    "S3Prefix": "results/"
  }
}
```

**Response (Job Started):**
```json
{
  "JobId": "abc123def456"
}
```

#### 5.4.2 Get Document Analysis Results

```http
POST https://textract.us-west-2.amazonaws.com/
Content-Type: application/x-amz-json-1.1
X-Amz-Target: Textract.GetDocumentAnalysis
Authorization: AWS4-HMAC-SHA256 ...
```

**Request:**
```json
{
  "JobId": "abc123def456",
  "MaxResults": 1000
}
```

**Response (Completed):**
```json
{
  "JobStatus": "SUCCEEDED",
  "Blocks": [
    {
      "BlockType": "QUERY_RESULT",
      "Query": {
        "Text": "What is the parcel number?"
      },
      "Text": "1234567890",
      "Confidence": 98.5
    },
    {
      "BlockType": "QUERY_RESULT",
      "Query": {
        "Text": "What is the lot size in square feet?"
      },
      "Text": "7,500 sq ft",
      "Confidence": 95.2
    },
    {
      "BlockType": "QUERY_RESULT",
      "Query": {
        "Text": "What is the flood zone designation?"
      },
      "Text": "Zone X (Minimal Flood Hazard)",
      "Confidence": 92.1
    },
    {
      "BlockType": "TABLE",
      "Relationships": [...],
      "Cells": [...]
    }
  ],
  "DocumentMetadata": {
    "Pages": 3
  }
}
```

### 5.5 Implementation

```typescript
import { TextractClient, StartDocumentAnalysisCommand, GetDocumentAnalysisCommand } from '@aws-sdk/client-textract';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Service class for AWS Textract
class TextractService {
  private textract: TextractClient;
  private s3: S3Client;

  constructor() {
    this.textract = new TextractClient({
      region: process.env.AWS_REGION || 'us-west-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-west-2'
    });
  }

  async analyzeDocument(s3Bucket: string, s3Key: string, documentType: string): Promise<ExtractedData> {
    // 1. Get queries for this document type
    const queries = this.getQueriesForDocumentType(documentType);

    // 2. Start async analysis job
    const startCommand = new StartDocumentAnalysisCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: s3Bucket,
          Name: s3Key
        }
      },
      FeatureTypes: ['TABLES', 'FORMS', 'QUERIES'],
      QueriesConfig: {
        Queries: queries.map(q => ({ Text: q }))
      },
      NotificationChannel: {
        SNSTopicArn: process.env.TEXTRACT_SNS_TOPIC_ARN,
        RoleArn: process.env.TEXTRACT_SERVICE_ROLE_ARN
      }
    });

    const startResponse = await this.textract.send(startCommand);
    const jobId = startResponse.JobId;

    // 3. Poll for completion (or use SNS notification)
    const result = await this.waitForJobCompletion(jobId);

    // 4. Extract fields from result
    const extractedData = this.mapTextractResultToSchema(result, documentType);

    return extractedData;
  }

  private async waitForJobCompletion(jobId: string, maxAttempts = 30): Promise<any> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const getCommand = new GetDocumentAnalysisCommand({
        JobId: jobId,
        MaxResults: 1000
      });

      const response = await this.textract.send(getCommand);

      if (response.JobStatus === 'SUCCEEDED') {
        return response;
      } else if (response.JobStatus === 'FAILED') {
        throw new Error(`Textract job failed: ${response.StatusMessage}`);
      }

      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    throw new Error('Textract job timed out');
  }

  private getQueriesForDocumentType(type: string): string[] {
    const queryMap: Record<string, string[]> = {
      'SURVEY': [
        'What is the parcel number?',
        'What is the lot size in square feet?',
        'What is the flood zone designation?',
        'What are the front setback requirements?',
        'What are the side setback requirements?',
        'What easements exist on the property?'
      ],
      'TITLE_REPORT': [
        'Who is the current owner?',
        'What is the legal description?',
        'What liens exist on the property?',
        'What are the title exceptions?',
        'What is the vesting date?'
      ],
      'ARBORIST_REPORT': [
        'How many trees are on the property?',
        'Are there any protected species?',
        'What trees require removal permits?',
        'What is the tree preservation requirement?'
      ],
      'PERMIT_APPLICATION': [
        'What is the permit type?',
        'What is the application date?',
        'What jurisdiction is this for?',
        'What are the permit fees?'
      ],
      'INSPECTION_REPORT': [
        'What is the completion percentage?',
        'What deficiencies were noted?',
        'Was the inspection approved?'
      ]
    };

    return queryMap[type] || [];
  }

  private mapTextractResultToSchema(result: any, documentType: string): any {
    const queryResults: Record<string, { value: string; confidence: number }> = {};

    // Extract query results
    for (const block of result.Blocks || []) {
      if (block.BlockType === 'QUERY_RESULT' && block.Query?.Text) {
        queryResults[block.Query.Text] = {
          value: block.Text || '',
          confidence: block.Confidence || 0
        };
      }
    }

    if (documentType === 'SURVEY') {
      return {
        parcel_number: queryResults['What is the parcel number?']?.value,
        lot_size_sqft: this.parseNumber(queryResults['What is the lot size in square feet?']?.value),
        flood_zone: queryResults['What is the flood zone designation?']?.value,
        setbacks: {
          front: this.parseNumber(queryResults['What are the front setback requirements?']?.value),
          side: this.parseNumber(queryResults['What are the side setback requirements?']?.value)
        },
        easements: this.parseEasements(queryResults['What easements exist on the property?']?.value),
        confidence: this.calculateAverageConfidence(queryResults)
      };
    }

    // Similar mappings for other document types...
    return queryResults;
  }

  private parseNumber(value: string | undefined): number | null {
    if (!value) return null;
    const match = value.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, ''), 10) : null;
  }

  private parseEasements(value: string | undefined): string[] {
    if (!value) return [];
    return value.split(/[;,]/).map(e => e.trim()).filter(e => e.length > 0);
  }

  private calculateAverageConfidence(results: Record<string, { confidence: number }>): number {
    const confidences = Object.values(results).map(r => r.confidence);
    if (confidences.length === 0) return 0;
    return confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
  }
}
```

### 5.6 Async Processing Workflow with SQS

**Queue-Based Processing:**
```typescript
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

// When user uploads document
async function handleDocumentUpload(file: File, projectId: string, documentType: string) {
  // 1. Upload to S3
  const s3Key = `projects/${projectId}/${file.name}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_DOCUMENTS_BUCKET,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype
  }));

  // 2. Create document record
  const document = await db.documents.create({
    project_id: projectId,
    type: documentType,
    s3_bucket: process.env.S3_DOCUMENTS_BUCKET,
    s3_key: s3Key,
    extraction_status: 'PENDING'
  });

  // 3. Queue for extraction via SQS
  const sqs = new SQSClient({ region: process.env.AWS_REGION });
  await sqs.send(new SendMessageCommand({
    QueueUrl: process.env.TEXTRACT_QUEUE_URL,
    MessageBody: JSON.stringify({
      document_id: document.id,
      s3_bucket: process.env.S3_DOCUMENTS_BUCKET,
      s3_key: s3Key,
      document_type: documentType
    })
  }));

  return document;
}

// Lambda handler for SNS notification when Textract completes
export async function handleTextractComplete(event: SNSEvent) {
  for (const record of event.Records) {
    const message = JSON.parse(record.Sns.Message);

    if (message.Status === 'SUCCEEDED') {
      const jobId = message.JobId;

      // Fetch results
      const textractService = new TextractService();
      const result = await textractService.getJobResults(jobId);

      // Find document by job ID (stored when job started)
      const document = await db.documents.findByTextractJobId(jobId);

      // Update document with extracted data
      await db.documents.update(document.id, {
        extraction_status: 'COMPLETED',
        extracted_data: result,
        extraction_confidence: result.confidence
      });

      // Notify user via WebSocket
      await websocket.emit(`document.${document.id}.extracted`, result);
    } else if (message.Status === 'FAILED') {
      // Handle failure
      const document = await db.documents.findByTextractJobId(message.JobId);
      await db.documents.update(document.id, {
        extraction_status: 'FAILED',
        extraction_error: message.StatusMessage
      });
    }
  }
}
```

### 5.7 Textract Custom Queries and Adapters

**Query Optimization:**
- Use specific, targeted queries for better accuracy
- Test queries against sample documents before production
- Monitor confidence scores and adjust queries as needed

**Custom Adapter Training (for complex documents):**
1. Upload 20+ sample documents to S3
2. Use Amazon Textract Console to create a Custom Adapter
3. Label key fields in training documents
4. Train adapter (typically 1-2 hours)
5. Evaluate accuracy on held-out test set (target: >90%)
6. Deploy adapter to production

**Cost Optimization:**
- Use AnalyzeDocument for single-page documents (synchronous, lower cost)
- Use StartDocumentAnalysis for multi-page documents (async, batched)
- Cache extraction results to avoid re-processing
- Use S3 Intelligent Tiering for document storage

---

## 6. Email Service Integration

### 6.1 Overview

**Purpose:** Send transactional emails (notifications, alerts, reports)
**Timeline:** Days 1-180 (all phases)
**Pattern:** SMTP or API-based email delivery
**Providers:** SendGrid, AWS SES, or Mailgun

### 6.2 Email Categories

| Category | Examples | Frequency |
|----------|----------|-----------|
| **Transactional** | Password reset, account verification | On-demand |
| **Notifications** | Task assignments, status changes, approvals | Real-time |
| **Alerts** | Draw deadlines, compliance issues | Triggered |
| **Reports** | Weekly portfolio summaries, monthly financials | Scheduled |

### 6.3 SendGrid API Integration

#### 6.3.1 Send Transactional Email

```http
POST https://api.sendgrid.com/v3/mail/send
Authorization: Bearer {sendgrid_api_key}
Content-Type: application/json
```

**Request:**
```json
{
  "personalizations": [
    {
      "to": [
        {
          "email": "borrower@example.com",
          "name": "John Borrower"
        }
      ],
      "dynamic_template_data": {
        "borrower_name": "John",
        "loan_number": "LN-2025-1234",
        "draw_amount": "$150,000",
        "inspection_date": "November 7, 2025",
        "portal_url": "https://portal.blueprint.com/loans/ln_123"
      }
    }
  ],
  "from": {
    "email": "noreply@blueprint.com",
    "name": "Blueprint Capital"
  },
  "reply_to": {
    "email": "support@blueprint.com",
    "name": "Blueprint Support"
  },
  "template_id": "d-abc123def456",
  "tracking_settings": {
    "click_tracking": {
      "enable": true
    },
    "open_tracking": {
      "enable": true
    }
  }
}
```

**Response:**
```json
{
  "message_id": "msg_abc123"
}
```

### 6.4 Email Templates

**Template Structure (Handlebars):**
```handlebars
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Responsive email styles */
  </style>
</head>
<body>
  <div class="container">
    <h1>Draw Request Approved</h1>
    <p>Hi {{borrower_name}},</p>
    <p>
      Great news! Your draw request for <strong>{{draw_amount}}</strong>
      on loan <strong>{{loan_number}}</strong> has been approved.
    </p>
    <p>
      The inspection is scheduled for <strong>{{inspection_date}}</strong>.
      Please ensure the property is accessible.
    </p>
    <a href="{{portal_url}}" class="button">View Draw Details</a>
    <p>
      Questions? Reply to this email or call (206) 555-0100.
    </p>
  </div>
</body>
</html>
```

### 6.5 Implementation

```typescript
class EmailService {
  private sendgrid: SendGridClient;

  constructor() {
    this.sendgrid = new SendGridClient(process.env.SENDGRID_API_KEY);
  }

  async sendDrawApprovalNotification(draw: Draw) {
    const loan = await db.loans.findById(draw.loan_id);
    const borrower = await db.contacts.findById(loan.borrower_id);

    await this.sendgrid.send({
      to: borrower.email,
      from: 'noreply@blueprint.com',
      templateId: process.env.SENDGRID_TEMPLATE_DRAW_APPROVED,
      dynamicTemplateData: {
        borrower_name: borrower.first_name,
        loan_number: loan.loan_number,
        draw_amount: formatCurrency(draw.amount),
        inspection_date: formatDate(draw.inspection_scheduled_at),
        portal_url: `${process.env.PORTAL_URL}/loans/${loan.id}`
      }
    });

    // Log email sent
    await db.activity_log.create({
      entity_type: 'DRAW',
      entity_id: draw.id,
      action: 'EMAIL_SENT',
      details: {
        template: 'draw_approved',
        recipient: borrower.email
      }
    });
  }

  async sendBatchReport(recipients: string[], reportData: any) {
    // Send to multiple recipients
    await this.sendgrid.sendMultiple({
      to: recipients,
      from: 'reports@blueprint.com',
      subject: `Weekly Portfolio Summary - ${formatDate(new Date())}`,
      html: await renderTemplate('weekly_report', reportData),
      attachments: [
        {
          filename: 'portfolio_summary.pdf',
          content: reportData.pdfBase64,
          type: 'application/pdf'
        }
      ]
    });
  }
}
```

### 6.6 Webhook Handling (SendGrid Events)

```typescript
// Webhook endpoint for email events
app.post('/api/v1/webhooks/sendgrid', async (req, res) => {
  const events = req.body; // Array of events

  for (const event of events) {
    switch (event.event) {
      case 'delivered':
        await db.activity_log.update(
          { email_message_id: event.sg_message_id },
          { status: 'DELIVERED', delivered_at: new Date(event.timestamp * 1000) }
        );
        break;

      case 'bounce':
        await db.contacts.update(
          { email: event.email },
          { email_bounced: true, email_bounce_reason: event.reason }
        );
        await notifyAdmin(`Email bounced for ${event.email}: ${event.reason}`);
        break;

      case 'open':
        await db.activity_log.update(
          { email_message_id: event.sg_message_id },
          { opened_at: new Date(event.timestamp * 1000) }
        );
        break;
    }
  }

  res.status(200).send('OK');
});
```

---

## 7. SMS Service Integration

### 7.1 Overview

**Purpose:** Send time-sensitive notifications via SMS
**Timeline:** Days 1-180 (all phases)
**Pattern:** REST API
**Provider:** Twilio

### 7.2 Twilio API Integration

#### 7.2.1 Send SMS

```http
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json
Authorization: Basic {base64(AccountSid:AuthToken)}
Content-Type: application/x-www-form-urlencoded
```

**Request:**
```
To=+12065551234
From=+12065550100
Body=Blueprint: Your draw inspection is scheduled for Nov 7 at 2pm. Reply CONFIRM to acknowledge.
StatusCallback=https://connect2.blueprint.com/api/v1/webhooks/twilio
```

**Response:**
```json
{
  "sid": "SM1234567890abcdef1234567890abcdef",
  "date_created": "2025-11-05T10:00:00Z",
  "status": "queued",
  "to": "+12065551234",
  "from": "+12065550100",
  "body": "Blueprint: Your draw inspection is scheduled..."
}
```

### 7.3 Implementation

```typescript
class SMSService {
  private twilio: TwilioClient;

  constructor() {
    this.twilio = new TwilioClient(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendInspectionReminder(draw: Draw) {
    const loan = await db.loans.findById(draw.loan_id);
    const borrower = await db.contacts.findById(loan.borrower_id);

    if (!borrower.phone || !borrower.sms_opt_in) {
      return; // Don't send if no phone or not opted in
    }

    const message = await this.twilio.messages.create({
      to: borrower.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `Blueprint: Your draw inspection is scheduled for ${formatDate(draw.inspection_scheduled_at)} at ${formatTime(draw.inspection_scheduled_at)}. Reply CONFIRM to acknowledge.`,
      statusCallback: `${process.env.API_URL}/webhooks/twilio`
    });

    await db.activity_log.create({
      entity_type: 'DRAW',
      entity_id: draw.id,
      action: 'SMS_SENT',
      details: {
        twilio_sid: message.sid,
        recipient: borrower.phone
      }
    });
  }
}
```

### 7.4 Inbound SMS Handling

```typescript
app.post('/api/v1/webhooks/twilio/inbound', async (req, res) => {
  const { From, Body, MessageSid } = req.body;

  // Parse message
  const normalizedBody = Body.trim().toUpperCase();

  if (normalizedBody === 'CONFIRM') {
    // Find pending inspection for this phone number
    const borrower = await db.contacts.findByPhone(From);
    const pendingDraw = await db.draws.findPendingInspection(borrower.id);

    if (pendingDraw) {
      await db.draws.update(pendingDraw.id, {
        inspection_confirmed: true,
        inspection_confirmed_at: new Date()
      });

      // Send confirmation
      await twilioClient.messages.create({
        to: From,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: 'Thank you! Your inspection is confirmed.'
      });
    }
  } else if (normalizedBody === 'STOP') {
    // Handle opt-out
    await db.contacts.update({ phone: From }, { sms_opt_in: false });
  }

  res.status(200).send('<Response></Response>'); // TwiML response
});
```

---

## 8. Accounting System Integration

### 8.1 Overview

**Purpose:** Sync financial data (loans, draws, payments, reconveyances) with accounting system
**Timeline:** Days 91-180 (loan servicing phase)
**Pattern:** TBD (depends on accounting platform selected)
**Candidates:** QuickBooks Online, Xero, NetSuite

### 8.2 QuickBooks Online Integration (Example)

#### 8.2.1 OAuth 2.0 Authentication

```http
GET https://appcenter.intuit.com/connect/oauth2?
  client_id={client_id}
  &redirect_uri={redirect_uri}
  &response_type=code
  &scope=com.intuit.quickbooks.accounting
  &state={csrf_token}
```

#### 8.2.2 Create Invoice (Draw Disbursement)

```http
POST https://quickbooks.api.intuit.com/v3/company/{realmId}/invoice
Authorization: Bearer {access_token}
Accept: application/json
Content-Type: application/json
```

**Request:**
```json
{
  "Line": [
    {
      "Amount": 150000.00,
      "DetailType": "SalesItemLineDetail",
      "SalesItemLineDetail": {
        "ItemRef": {
          "value": "1",
          "name": "Construction Draw"
        }
      },
      "Description": "Draw #3 - Framing Complete"
    }
  ],
  "CustomerRef": {
    "value": "123",
    "name": "Acme Construction LLC"
  },
  "DueDate": "2025-11-15",
  "TxnDate": "2025-11-05",
  "DocNumber": "INV-2025-1234"
}
```

### 8.3 Data Sync Strategy

**Real-Time Sync Events:**
- **Loan Funded**: Create customer (if new), create loan account
- **Draw Disbursed**: Create invoice/bill
- **Payment Received**: Record payment against loan
- **Loan Paid Off**: Close loan account, record reconveyance

**Nightly Reconciliation:**
- Compare Connect 2.0 loan balances with accounting system
- Flag discrepancies for manual review
- Generate reconciliation report

---

## 9. Common Integration Patterns

### 9.1 Retry Logic with Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
        await sleep(delay + jitter);
      }
    }
  }

  throw lastError;
}
```

### 9.2 Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: Date | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime.getTime() > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

### 9.3 Idempotency Key Pattern

```typescript
async function handleIdempotentRequest(
  req: Request,
  handler: () => Promise<any>
) {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    throw new Error('Idempotency-Key header required');
  }

  // Check if we've already processed this request
  const cached = await redis.get(`idempotency:${idempotencyKey}`);
  if (cached) {
    return JSON.parse(cached);
  }

  // Process request
  const result = await handler();

  // Cache result for 24 hours
  await redis.setex(
    `idempotency:${idempotencyKey}`,
    86400,
    JSON.stringify(result)
  );

  return result;
}
```

---

## 10. Error Handling and Resilience

### 10.1 Error Classification

| Error Type | HTTP Status | Retry? | Action |
|------------|-------------|--------|--------|
| **Network Timeout** | 408, 504 | Yes | Retry with backoff |
| **Rate Limit** | 429 | Yes | Retry after delay (use Retry-After header) |
| **Server Error** | 500, 502, 503 | Yes | Retry with backoff |
| **Authentication** | 401 | No | Refresh token, then retry once |
| **Authorization** | 403 | No | Log error, notify admin |
| **Not Found** | 404 | No | Check data consistency |
| **Validation** | 400, 422 | No | Fix input, don't retry |

### 10.2 Dead Letter Queue

```typescript
async function processWithDLQ(message: Message) {
  try {
    await processMessage(message);
  } catch (error) {
    if (message.retryCount >= 3) {
      // Move to dead letter queue
      await dlq.publish('failed_messages', {
        original_message: message,
        error: error.message,
        failed_at: new Date(),
        retry_count: message.retryCount
      });

      // Alert operations team
      await notifyOps(`Message moved to DLQ: ${message.id}`);
    } else {
      // Re-queue with incremented retry count
      await queue.publish(message.queueName, {
        ...message,
        retryCount: message.retryCount + 1
      });
    }
  }
}
```

### 10.3 Graceful Degradation

```typescript
async function getProjectData(projectId: string) {
  let bpoData = null;

  try {
    // Try to fetch from BPO
    bpoData = await bpoClient.getProject(projectId);
  } catch (error) {
    logger.warn('BPO integration unavailable, using cached data', { error });

    // Fallback to cached data
    bpoData = await cache.get(`bpo:project:${projectId}`);

    if (!bpoData) {
      // If no cache, proceed without BPO data
      logger.error('No cached BPO data available', { projectId });
    }
  }

  // Merge Connect 2.0 data with BPO data (if available)
  const connect2Data = await db.projects.findById(projectId);
  return {
    ...connect2Data,
    bpo_metadata: bpoData || { status: 'unavailable' }
  };
}
```

---

## 11. Security and Authentication

### 11.1 API Key Management

**Storage:**
- Store API keys in AWS Secrets Manager
- Enable automatic rotation (every 90 days)
- Use separate keys for dev/staging/production
- Use IAM roles for service-to-service authentication where possible

**Access Pattern:**
```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

class AWSSecretsManager {
  private client: SecretsManagerClient;
  private cache = new Map<string, { value: string; expires: Date }>();

  constructor() {
    this.client = new SecretsManagerClient({
      region: process.env.AWS_REGION || 'us-west-2'
    });
  }

  async getSecret(secretName: string): Promise<string> {
    const cached = this.cache.get(secretName);

    if (cached && cached.expires > new Date()) {
      return cached.value;
    }

    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await this.client.send(command);
    const secret = response.SecretString || '';

    // Cache for 5 minutes
    this.cache.set(secretName, {
      value: secret,
      expires: new Date(Date.now() + 5 * 60 * 1000)
    });

    return secret;
  }
}
```

### 11.2 Webhook Signature Verification

```typescript
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## 12. Monitoring and Observability

### 12.1 Key Metrics to Track

| Metric | Threshold | Alert |
|--------|-----------|-------|
| **Integration Success Rate** | < 95% | Critical |
| **Average Response Time** | > 5s | Warning |
| **Error Rate** | > 5% | Critical |
| **Webhook Delivery Rate** | < 98% | Warning |
| **Circuit Breaker Opens** | > 0 | Critical |

### 12.2 Logging Structure

```typescript
logger.info('Integration request', {
  integration: 'docusign',
  operation: 'create_envelope',
  request_id: 'req_abc123',
  envelope_id: 'env_456',
  duration_ms: 1234,
  status: 'success'
});

logger.error('Integration failed', {
  integration: 'bpo',
  operation: 'sync_project',
  request_id: 'req_def456',
  error_code: 'TIMEOUT',
  error_message: 'Request timed out after 30s',
  retry_count: 2,
  will_retry: true
});
```

### 12.3 Distributed Tracing

```typescript
import { trace } from '@opentelemetry/api';

async function syncProjectToBPO(projectId: string) {
  const tracer = trace.getTracer('connect-2.0');

  return tracer.startActiveSpan('sync_project_to_bpo', async (span) => {
    span.setAttribute('project_id', projectId);
    span.setAttribute('integration', 'bpo');

    try {
      const project = await db.projects.findById(projectId);
      span.addEvent('project_loaded');

      const result = await bpoClient.updateProject(project);
      span.addEvent('bpo_updated');
      span.setStatus({ code: SpanStatusCode.OK });

      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

---

## Appendix A: Integration Checklist

**Before Going Live with Any Integration:**

- [ ] API credentials stored securely (Key Vault/Secrets Manager)
- [ ] Error handling implemented (retry, circuit breaker, DLQ)
- [ ] Idempotency keys implemented for write operations
- [ ] Webhook signature verification implemented
- [ ] Rate limiting respected (check partner API limits)
- [ ] Logging structured with correlation IDs
- [ ] Monitoring dashboards created
- [ ] Alerts configured for critical failures
- [ ] Integration tested in staging environment
- [ ] Fallback/degradation strategy documented
- [ ] Runbook created for common issues
- [ ] On-call team trained on troubleshooting

---

## Appendix B: Open Questions

**Resolved:**
- ✅ **Document Intelligence**: AWS Textract selected (December 2025) with custom queries

**To be resolved during implementation:**

1. **BPO API Capabilities**: Does BPO have a REST API, or do we need batch export/import?
2. **iPad App API Documentation**: Is API documentation available for the existing inspection app?
3. **Accounting Platform**: Which accounting system will be used (QuickBooks, Xero, NetSuite)?
4. **E-Signature Provider**: DocuSign or Authentisign (or both)?
5. **AWS Textract Adapters**: Do custom adapters need to be trained, or can we use prebuilt queries?

---

**End of Integration Specifications**
