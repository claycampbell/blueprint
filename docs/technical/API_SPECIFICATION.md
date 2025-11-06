# Connect 2.0 API Specification

**Version:** 1.0.0
**Last Updated:** November 5, 2025
**Status:** Draft

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Patterns](#common-patterns)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Webhooks](#webhooks)

---

## Overview

### Base URL
```
Production: https://api.connect.datapage.com/v1
Staging:    https://api-staging.connect.datapage.com/v1
Development: http://localhost:3000/api/v1
```

### API Design Principles
- **RESTful**: Resources are nouns, actions are HTTP verbs
- **Versioned**: API version in URL path (`/v1/`)
- **Stateless**: No server-side session state
- **JSON**: Request and response bodies in JSON format
- **Consistent**: Predictable patterns across all endpoints

### Content Type
```
Content-Type: application/json
Accept: application/json
```

---

## Authentication

### OAuth 2.0 Bearer Token

All API requests require authentication using Bearer tokens.

**Request Header:**
```http
Authorization: Bearer {access_token}
```

**Token Endpoint:**
```http
POST /auth/token
Content-Type: application/json

{
  "grant_type": "password",
  "username": "user@example.com",
  "password": "password123",
  "scope": "read write"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def502...",
  "scope": "read write"
}
```

### Token Refresh
```http
POST /auth/token
Content-Type: application/json

{
  "grant_type": "refresh_token",
  "refresh_token": "def502..."
}
```

### Role-Based Access Control (RBAC)

**Roles:**
- `admin` - Full system access
- `acquisitions` - Lead intake, feasibility, project management
- `design` - Design and plan library access
- `entitlement` - Permit tracking, consultant coordination
- `servicing` - Loan management, draws, servicing
- `agent` - External agent (read-only on their deals)
- `builder` - External builder (read-only on their projects)
- `consultant` - External consultant (task-specific access)

---

## Common Patterns

### Pagination

**Query Parameters:**
```
?limit=50&offset=0
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "total": 250,
    "limit": 50,
    "offset": 0,
    "has_next": true,
    "has_previous": false
  }
}
```

**Alternative: Cursor-Based Pagination**
```
?limit=50&cursor=eyJpZCI6MTIzfQ==
```

```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTczfQ==",
    "has_next": true
  }
}
```

### Filtering

```
?status=feasibility&city=Seattle
?created_after=2025-01-01&created_before=2025-12-31
?assigned_to=user_123
```

**Supported Operators:**
- Equals: `?field=value`
- In: `?status=lead,feasibility,go`
- Greater than: `?price_gt=500000`
- Less than: `?price_lt=2000000`
- Date range: `?created_after=2025-01-01&created_before=2025-12-31`

### Sorting

```
?sort=created_at:desc
?sort=price:asc,created_at:desc
```

### Field Selection (Sparse Fieldsets)

```
?fields=id,address,status,price
```

### Expansion (Include Related Resources)

```
?expand=borrower,guarantors,property
```

---

## API Endpoints

### Projects

#### List Projects
```http
GET /projects
```

**Query Parameters:**
- `status` (string): Filter by status (lead, feasibility, go, pass, closed)
- `city` (string): Filter by city
- `assigned_to` (string): Filter by user ID
- `created_after` (date): Created after date (ISO 8601)
- `created_before` (date): Created before date (ISO 8601)
- `limit` (integer): Results per page (default: 50, max: 100)
- `offset` (integer): Pagination offset (default: 0)
- `sort` (string): Sort order (default: created_at:desc)

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "proj_a1b2c3d4",
      "address": "1234 Main St",
      "city": "Seattle",
      "state": "WA",
      "zip": "98101",
      "parcel_number": "1234567890",
      "status": "feasibility",
      "purchase_price": 850000,
      "list_price": 875000,
      "submitted_by": {
        "id": "contact_xyz",
        "name": "John Agent",
        "type": "agent"
      },
      "assigned_to": {
        "id": "user_abc",
        "name": "Jane Acquisitions",
        "role": "acquisitions"
      },
      "created_at": "2025-10-15T14:32:00Z",
      "updated_at": "2025-10-20T09:15:00Z"
    }
  ],
  "pagination": {
    "total": 127,
    "limit": 50,
    "offset": 0,
    "has_next": true,
    "has_previous": false
  }
}
```

#### Create Project
```http
POST /projects
```

**Request Body:**
```json
{
  "address": "1234 Main St",
  "city": "Seattle",
  "state": "WA",
  "zip": "98101",
  "parcel_number": "1234567890",
  "purchase_price": 850000,
  "list_price": 875000,
  "submitted_by": "contact_xyz",
  "notes": "Potential teardown, R-5 zoning"
}
```

**Response: 201 Created**
```json
{
  "id": "proj_a1b2c3d4",
  "address": "1234 Main St",
  "city": "Seattle",
  "state": "WA",
  "zip": "98101",
  "parcel_number": "1234567890",
  "status": "lead",
  "purchase_price": 850000,
  "list_price": 875000,
  "submitted_by": {
    "id": "contact_xyz",
    "name": "John Agent",
    "type": "agent"
  },
  "assigned_to": null,
  "created_at": "2025-11-05T10:30:00Z",
  "updated_at": "2025-11-05T10:30:00Z",
  "metadata": {}
}
```

#### Get Project
```http
GET /projects/{id}
```

**Query Parameters:**
- `expand` (string): Comma-separated list of relations to expand (feasibility, entitlement, documents)

**Response: 200 OK**
```json
{
  "id": "proj_a1b2c3d4",
  "address": "1234 Main St",
  "city": "Seattle",
  "state": "WA",
  "zip": "98101",
  "parcel_number": "1234567890",
  "status": "feasibility",
  "purchase_price": 850000,
  "list_price": 875000,
  "submitted_by": {
    "id": "contact_xyz",
    "name": "John Agent",
    "type": "agent",
    "email": "john@realestate.com",
    "phone": "+1-206-555-0100"
  },
  "assigned_to": {
    "id": "user_abc",
    "name": "Jane Acquisitions",
    "role": "acquisitions",
    "email": "jane@blueprint.com"
  },
  "assigned_builder": null,
  "feasibility": {
    "id": "feas_xyz",
    "proforma": {
      "land_cost": 850000,
      "construction_cost": 450000,
      "soft_costs": 75000,
      "total_cost": 1375000,
      "arv": 1650000,
      "roi": 0.20
    },
    "viability_score": 85,
    "go_decision_date": null,
    "decision_notes": null,
    "tasks": [
      {
        "id": "task_123",
        "type": "survey",
        "consultant": {
          "id": "contact_survey1",
          "name": "ABC Surveyors"
        },
        "status": "delivered",
        "due_date": "2025-10-20",
        "delivered_date": "2025-10-19"
      }
    ]
  },
  "created_at": "2025-10-15T14:32:00Z",
  "updated_at": "2025-10-20T09:15:00Z",
  "metadata": {
    "source": "agent_referral",
    "priority": "high"
  }
}
```

#### Update Project
```http
PATCH /projects/{id}
```

**Request Body:**
```json
{
  "status": "feasibility",
  "assigned_to": "user_abc",
  "metadata": {
    "priority": "high"
  }
}
```

**Response: 200 OK**
```json
{
  "id": "proj_a1b2c3d4",
  "address": "1234 Main St",
  ...
  "status": "feasibility",
  "assigned_to": {
    "id": "user_abc",
    "name": "Jane Acquisitions"
  },
  "updated_at": "2025-11-05T11:00:00Z"
}
```

#### Delete Project (Archive)
```http
DELETE /projects/{id}
```

**Response: 204 No Content**

Note: Deletes are soft deletes (status set to "archived"). Use `?hard=true` for permanent deletion (admin only).

#### Transition Project Status
```http
POST /projects/{id}/transition
```

**Request Body:**
```json
{
  "to_status": "go",
  "notes": "All reports clear, strong proforma, builder assigned"
}
```

**Response: 200 OK**
```json
{
  "id": "proj_a1b2c3d4",
  "status": "go",
  "status_history": [
    {
      "from_status": "feasibility",
      "to_status": "go",
      "changed_by": "user_abc",
      "changed_at": "2025-11-05T11:30:00Z",
      "notes": "All reports clear, strong proforma, builder assigned"
    }
  ]
}
```

### Feasibility

#### Create Feasibility Record
```http
POST /projects/{project_id}/feasibility
```

**Request Body:**
```json
{
  "proforma": {
    "land_cost": 850000,
    "construction_cost": 450000,
    "soft_costs": 75000
  }
}
```

**Response: 201 Created**

#### Order Consultant Reports
```http
POST /projects/{project_id}/feasibility/order-reports
```

**Request Body:**
```json
{
  "reports": [
    {
      "type": "survey",
      "consultant_id": "contact_survey1",
      "due_date": "2025-11-15"
    },
    {
      "type": "title",
      "consultant_id": "contact_title1",
      "due_date": "2025-11-12"
    },
    {
      "type": "arborist",
      "consultant_id": "contact_arb1",
      "due_date": "2025-11-18"
    }
  ]
}
```

**Response: 201 Created**
```json
{
  "tasks_created": [
    {
      "id": "task_456",
      "type": "survey",
      "consultant": {
        "id": "contact_survey1",
        "name": "ABC Surveyors"
      },
      "status": "ordered",
      "due_date": "2025-11-15"
    }
  ],
  "notifications_sent": 3
}
```

### Loans

#### List Loans
```http
GET /loans
```

**Query Parameters:**
- `status` (string): pending, approved, funded, servicing, paid_off, default
- `borrower_id` (string): Filter by borrower contact ID
- `assigned_builder` (string): Filter by builder contact ID
- `closing_date_after` (date)
- `closing_date_before` (date)
- `limit`, `offset`, `sort`

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "loan_123abc",
      "loan_number": "BPC-2025-001234",
      "project_id": "proj_a1b2c3d4",
      "status": "servicing",
      "borrower": {
        "id": "contact_borrower1",
        "name": "Smith Development LLC",
        "email": "info@smithdev.com"
      },
      "property_address": "1234 Main St, Seattle, WA 98101",
      "loan_amount": 1200000,
      "interest_rate": 0.085,
      "term_months": 18,
      "closing_date": "2025-06-15",
      "maturity_date": "2026-12-15",
      "current_balance": 980000,
      "created_at": "2025-05-20T10:00:00Z",
      "updated_at": "2025-10-01T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 47,
    "limit": 50,
    "offset": 0,
    "has_next": false
  }
}
```

#### Create Loan
```http
POST /loans
```

**Request Body:**
```json
{
  "project_id": "proj_a1b2c3d4",
  "borrower_id": "contact_borrower1",
  "guarantor_ids": ["contact_guar1", "contact_guar2"],
  "loan_amount": 1200000,
  "interest_rate": 0.085,
  "term_months": 18,
  "budget": {
    "land": 850000,
    "hard_costs": 450000,
    "soft_costs": 75000,
    "contingency": 50000,
    "total": 1425000
  }
}
```

**Response: 201 Created**

#### Get Loan
```http
GET /loans/{id}
```

**Query Parameters:**
- `expand`: borrower,guarantors,draws,statements

**Response: 200 OK**
```json
{
  "id": "loan_123abc",
  "loan_number": "BPC-2025-001234",
  "project_id": "proj_a1b2c3d4",
  "status": "servicing",
  "borrower": {
    "id": "contact_borrower1",
    "name": "Smith Development LLC",
    "email": "info@smithdev.com",
    "phone": "+1-206-555-0200"
  },
  "guarantors": [
    {
      "id": "contact_guar1",
      "name": "John Smith",
      "email": "john@smithdev.com"
    }
  ],
  "property_address": "1234 Main St, Seattle, WA 98101",
  "loan_amount": 1200000,
  "interest_rate": 0.085,
  "term_months": 18,
  "closing_date": "2025-06-15",
  "maturity_date": "2026-12-15",
  "budget": {
    "land": 850000,
    "hard_costs": 450000,
    "soft_costs": 75000,
    "contingency": 50000,
    "total": 1425000
  },
  "current_balance": 980000,
  "draws": [
    {
      "id": "draw_001",
      "draw_number": 1,
      "requested_amount": 200000,
      "approved_amount": 200000,
      "status": "paid",
      "approved_at": "2025-07-10T10:00:00Z"
    }
  ],
  "assigned_to_bank": {
    "id": "bank_columbia",
    "name": "Columbia Bank"
  },
  "created_at": "2025-05-20T10:00:00Z",
  "updated_at": "2025-10-01T14:30:00Z"
}
```

#### Fund Loan
```http
POST /loans/{id}/fund
```

**Request Body:**
```json
{
  "closing_date": "2025-11-15",
  "assign_to_bank": "bank_columbia",
  "notes": "All conditions met, ready to fund"
}
```

**Response: 200 OK**

### Draws

#### List Draws for Loan
```http
GET /loans/{loan_id}/draws
```

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "draw_001",
      "loan_id": "loan_123abc",
      "draw_number": 1,
      "requested_amount": 200000,
      "approved_amount": 200000,
      "status": "paid",
      "inspection": {
        "id": "inspect_001",
        "inspector": "user_inspector1",
        "completed_at": "2025-07-08T14:00:00Z",
        "percent_complete": 0.25,
        "photos": 12
      },
      "conditions_met": true,
      "notes": "Foundation complete, framing started",
      "requested_at": "2025-07-05T10:00:00Z",
      "approved_at": "2025-07-10T10:00:00Z",
      "paid_at": "2025-07-12T09:00:00Z"
    }
  ]
}
```

#### Create Draw Request
```http
POST /loans/{loan_id}/draws
```

**Request Body:**
```json
{
  "requested_amount": 150000,
  "notes": "Framing and rough-in complete"
}
```

**Response: 201 Created**

#### Approve Draw
```http
POST /draws/{id}/approve
```

**Request Body:**
```json
{
  "approved_amount": 145000,
  "notes": "Minor deduction for incomplete HVAC rough-in",
  "conditions": [
    {
      "type": "lien_waiver",
      "met": true
    },
    {
      "type": "insurance_current",
      "met": true
    }
  ]
}
```

**Response: 200 OK**

### Contacts

#### List Contacts
```http
GET /contacts
```

**Query Parameters:**
- `type` (string): agent, builder, consultant, borrower, guarantor
- `search` (string): Search by name, email, company
- `limit`, `offset`

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "contact_xyz",
      "type": "agent",
      "first_name": "John",
      "last_name": "Agent",
      "company_name": "Premier Realty",
      "email": "john@premierrealty.com",
      "phone": "+1-206-555-0100",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### Create Contact
```http
POST /contacts
```

**Request Body:**
```json
{
  "type": "builder",
  "first_name": "Sarah",
  "last_name": "Builder",
  "company_name": "Quality Homes LLC",
  "email": "sarah@qualityhomes.com",
  "phone": "+1-206-555-0300",
  "address": {
    "street": "789 Construction Ave",
    "city": "Seattle",
    "state": "WA",
    "zip": "98102"
  }
}
```

**Response: 201 Created**

#### Get Contact
```http
GET /contacts/{id}
```

**Query Parameters:**
- `expand`: projects,loans,tasks

**Response: 200 OK**

### Documents

#### Upload Document
```http
POST /documents
```

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` (file): Document file
- `project_id` (string, optional): Associated project
- `loan_id` (string, optional): Associated loan
- `type` (string): survey, title, arborist, proforma, plan, permit, inspection
- `description` (string, optional)

**Response: 201 Created**
```json
{
  "id": "doc_abc123",
  "filename": "survey_report.pdf",
  "type": "survey",
  "size_bytes": 2457600,
  "mime_type": "application/pdf",
  "storage_url": "https://storage.connect.com/docs/...",
  "project_id": "proj_a1b2c3d4",
  "uploaded_by": "user_abc",
  "uploaded_at": "2025-11-05T12:00:00Z",
  "extracted_data": null,
  "summary": null
}
```

#### Get Document
```http
GET /documents/{id}
```

**Response: 200 OK**
```json
{
  "id": "doc_abc123",
  "filename": "survey_report.pdf",
  "type": "survey",
  "size_bytes": 2457600,
  "mime_type": "application/pdf",
  "storage_url": "https://storage.connect.com/docs/...",
  "download_url": "https://storage.connect.com/docs/.../download?token=...",
  "project_id": "proj_a1b2c3d4",
  "uploaded_by": {
    "id": "user_abc",
    "name": "Jane Acquisitions"
  },
  "uploaded_at": "2025-11-05T12:00:00Z",
  "extracted_data": {
    "lot_size_sqft": 7500,
    "easements": ["10ft utility easement on south side"],
    "setbacks": {
      "front": 20,
      "rear": 15,
      "side": 5
    }
  },
  "summary": "7,500 sq ft lot with 10ft utility easement. Standard setbacks apply."
}
```

#### Download Document
```http
GET /documents/{id}/download
```

**Response: 302 Redirect** to signed storage URL

### Tasks

#### List Tasks
```http
GET /tasks
```

**Query Parameters:**
- `assigned_to` (string): User or contact ID
- `project_id` (string)
- `loan_id` (string)
- `status` (string): pending, in_progress, completed, cancelled
- `due_before` (date)

**Response: 200 OK**

#### Create Task
```http
POST /tasks
```

**Request Body:**
```json
{
  "title": "Review arborist report",
  "description": "Review and summarize findings from ABC Arborist report",
  "assigned_to": "user_abc",
  "project_id": "proj_a1b2c3d4",
  "due_date": "2025-11-10",
  "priority": "high"
}
```

**Response: 201 Created**

### Analytics

#### Get Dashboard Metrics
```http
GET /analytics/dashboard
```

**Query Parameters:**
- `date_from` (date)
- `date_to` (date)
- `metrics` (string): Comma-separated list (deals_in_pipeline, conversion_rate, cycle_times, revenue)

**Response: 200 OK**
```json
{
  "period": {
    "from": "2025-10-01",
    "to": "2025-10-31"
  },
  "metrics": {
    "deals_in_pipeline": {
      "lead": 45,
      "feasibility": 23,
      "go": 12,
      "funded": 8
    },
    "conversion_rates": {
      "lead_to_feasibility": 0.51,
      "feasibility_to_go": 0.52,
      "go_to_funded": 0.67
    },
    "average_cycle_times": {
      "lead_to_feasibility_days": 4.2,
      "feasibility_to_go_days": 18.5,
      "go_to_funded_days": 12.3
    },
    "revenue": {
      "loans_funded": 8,
      "total_loan_volume": 9600000,
      "avg_loan_size": 1200000
    }
  }
}
```

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "request_id": "req_abc123",
    "timestamp": "2025-11-05T12:30:00Z"
  }
}
```

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PATCH, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists or state conflict |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 502 | Bad Gateway | Upstream service error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `AUTHENTICATION_REQUIRED` | 401 | No authentication provided |
| `INVALID_TOKEN` | 401 | Token is invalid or expired |
| `PERMISSION_DENIED` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Resource does not exist |
| `DUPLICATE_RESOURCE` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily down |

---

## Rate Limiting

### Limits by Role

| Role | Requests per Minute | Burst |
|------|---------------------|-------|
| Admin | 1000 | 100 |
| Internal Users | 300 | 50 |
| External Users (Agent, Builder) | 100 | 20 |
| Consultant | 60 | 10 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 275
X-RateLimit-Reset: 1699200000
```

### Rate Limit Exceeded Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 30 seconds.",
    "retry_after": 30
  }
}
```

---

## Webhooks

### Webhook Events

Connect 2.0 can send webhooks for the following events:

| Event | Description |
|-------|-------------|
| `project.created` | New project created |
| `project.status_changed` | Project status transitioned |
| `loan.funded` | Loan successfully funded |
| `draw.requested` | New draw request submitted |
| `draw.approved` | Draw approved for payment |
| `document.uploaded` | New document uploaded |
| `task.completed` | Task marked as completed |

### Webhook Payload

```json
{
  "id": "evt_abc123",
  "type": "project.status_changed",
  "created": "2025-11-05T12:30:00Z",
  "data": {
    "object": {
      "id": "proj_a1b2c3d4",
      "from_status": "feasibility",
      "to_status": "go",
      "changed_by": "user_abc"
    }
  }
}
```

### Webhook Signature Verification

Webhooks are signed using HMAC SHA-256.

**Header:**
```
X-Connect-Signature: sha256=5d41402abc4b2a76b9719d911017c592
```

**Verification (Node.js):**
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

### Webhook Configuration

```http
POST /webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks",
  "events": ["project.status_changed", "loan.funded"],
  "active": true
}
```

---

## Appendix

### Date/Time Format

All dates and times use ISO 8601 format with UTC timezone:

```
2025-11-05T12:30:00Z
```

### Currency

All monetary values are in USD cents (integers) or decimals:

```json
{
  "loan_amount": 1200000,  // $1,200,000
  "interest_rate": 0.085   // 8.5%
}
```

### Idempotency

For POST requests that modify state, include an idempotency key:

```http
POST /loans
Idempotency-Key: unique-key-12345
```

If the same request is made again with the same key, the original response is returned (prevents duplicate creation).
