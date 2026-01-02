# Connect 2.0 API Specification

**Version:** 2.0
**Last Updated:** January 2026
**Status:** Active
**Framework:** FastAPI (Python 3.12+)
**Related Documents:** [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md), [TECH_STACK_DECISIONS.md](../../docs/architecture/TECH_STACK_DECISIONS.md)

---

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
Production:   https://api.connect2.com/v1
Staging:      https://api-staging.connect2.com/v1
Development:  http://localhost:8000/api/v1
```

### API Design Principles

- **RESTful**: Resources are nouns, actions are HTTP verbs
- **Versioned**: API version in URL path (`/v1/`)
- **Stateless**: No server-side session state
- **JSON**: Request and response bodies in JSON format
- **Consistent**: Predictable patterns across all endpoints
- **OpenAPI**: Auto-generated documentation from FastAPI

### Content Type

```
Content-Type: application/json
Accept: application/json
```

### Interactive Documentation

FastAPI provides interactive API documentation:

- **Swagger UI**: `/docs` - Interactive API explorer
- **ReDoc**: `/redoc` - Alternative documentation view
- **OpenAPI Schema**: `/openapi.json` - Raw OpenAPI spec

---

## Authentication

### OAuth 2.0 Bearer Token (JWT)

All API requests require authentication using JWT Bearer tokens.

**Request Header:**
```http
Authorization: Bearer {access_token}
```

**Token Endpoint:**
```http
POST /api/v1/auth/token
Content-Type: application/x-www-form-urlencoded

username=user@blueprint.com&password=password123
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### JWT Payload Structure

```json
{
  "sub": "user_uuid",
  "email": "user@blueprint.com",
  "roles": ["DESIGN_MANAGER"],
  "permissions": ["read:properties", "write:documents"],
  "iat": 1699200000,
  "exp": 1699203600
}
```

### FastAPI Dependency Pattern

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401)
        return await get_user(user_id)
    except JWTError:
        raise HTTPException(status_code=401)
```

### Role-Based Access Control (RBAC)

**User Roles:**
- `ADMIN` - Full system access
- `ACQ_MANAGER` / `ACQ_ANALYST` - Acquisitions team
- `DESIGN_MANAGER` / `DESIGN_COORD` - Design team
- `ENTITLE_MANAGER` / `ENTITLE_COORD` - Entitlement team
- `SERVICING_MANAGER` / `LOAN_OFFICER` - Servicing team

**External Roles:**
- `AGENT` - External agent (read-only on their deals)
- `BUILDER` - External builder (read-only on their projects)
- `CONSULTANT` - External consultant (task-specific access)

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

**Pydantic Schema:**
```python
from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar("T")

class PaginationMeta(BaseModel):
    total: int
    limit: int
    offset: int
    has_next: bool
    has_previous: bool

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    pagination: PaginationMeta
```

### Filtering

```
?status=active&jurisdiction=Seattle
?created_after=2025-01-01&created_before=2025-12-31
?assigned_to=user_123
```

**Supported Operators:**
- Equals: `?field=value`
- In: `?status=active,complete`
- Greater than: `?progress_gt=50`
- Less than: `?progress_lt=100`
- Date range: `?created_after=2025-01-01&created_before=2025-12-31`

### Sorting

```
?sort=created_at:desc
?sort=address:asc,created_at:desc
```

### Field Selection

```
?fields=id,address,status
```

### Expansion

```
?expand=value_stream_status,documents
```

---

## API Endpoints

### Properties

Properties are the central entity in Connect 2.0.

#### List Properties

```http
GET /api/v1/properties
```

**Query Parameters:**
- `value_stream` (string): Filter by active value stream (VS1, VS2, etc.)
- `status` (string): Filter by VS status (locked, active, complete)
- `jurisdiction` (string): Filter by jurisdiction
- `assigned_to` (string): Filter by user ID
- `limit` (integer): Results per page (default: 50, max: 100)
- `offset` (integer): Pagination offset (default: 0)
- `sort` (string): Sort order (default: created_at:desc)

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "prop_a1b2c3d4",
      "address": "1234 Main St",
      "city": "Seattle",
      "state": "WA",
      "zip": "98101",
      "jurisdiction": "City of Seattle",
      "parcel_number": "1234567890",
      "value_stream_status": [
        {"value_stream": "VS1", "status": "complete", "progress_pct": 100},
        {"value_stream": "VS2", "status": "complete", "progress_pct": 100},
        {"value_stream": "VS3", "status": "active", "progress_pct": 60}
      ],
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

#### Create Property

```http
POST /api/v1/properties
```

**Request Body:**
```json
{
  "address": "1234 Main St",
  "city": "Seattle",
  "state": "WA",
  "zip": "98101",
  "jurisdiction": "City of Seattle",
  "parcel_number": "1234567890",
  "external_id": "BPO-12345",
  "metadata": {
    "source": "agent_referral"
  }
}
```

**Response: 201 Created**
```json
{
  "id": "prop_a1b2c3d4",
  "address": "1234 Main St",
  "city": "Seattle",
  "state": "WA",
  "zip": "98101",
  "jurisdiction": "City of Seattle",
  "value_stream_status": [
    {"value_stream": "VS1", "status": "active", "progress_pct": 0}
  ],
  "created_at": "2025-11-05T10:30:00Z"
}
```

#### Get Property

```http
GET /api/v1/properties/{id}
```

**Query Parameters:**
- `expand` (string): Comma-separated (value_stream_status, documents, notes, assignments, checklist)

**Response: 200 OK**
```json
{
  "id": "prop_a1b2c3d4",
  "address": "1234 Main St",
  "city": "Seattle",
  "state": "WA",
  "zip": "98101",
  "jurisdiction": "City of Seattle",
  "parcel_number": "1234567890",
  "value_stream_status": [
    {
      "value_stream": "VS1",
      "name": "Lead Intake",
      "status": "complete",
      "progress_pct": 100,
      "completed_at": "2025-10-16T10:00:00Z"
    },
    {
      "value_stream": "VS2",
      "name": "Feasibility",
      "status": "complete",
      "progress_pct": 100,
      "completed_at": "2025-10-25T14:00:00Z"
    },
    {
      "value_stream": "VS3",
      "name": "Acquisition",
      "status": "active",
      "progress_pct": 60,
      "started_at": "2025-10-25T14:00:00Z"
    },
    {
      "value_stream": "VS4",
      "name": "Design",
      "status": "locked",
      "progress_pct": 0
    }
  ],
  "documents": [...],
  "notes": [...],
  "created_at": "2025-10-15T14:32:00Z",
  "updated_at": "2025-10-20T09:15:00Z"
}
```

#### Update Property

```http
PATCH /api/v1/properties/{id}
```

**Request Body:**
```json
{
  "jurisdiction": "City of Seattle - West Side",
  "metadata": {
    "priority": "high"
  }
}
```

**Response: 200 OK**

#### Transition Value Stream Status

```http
POST /api/v1/properties/{id}/value-streams/{vs_key}/transition
```

**Request Body:**
```json
{
  "to_status": "complete",
  "notes": "All checklist items completed, ready for next stage"
}
```

**Response: 200 OK**
```json
{
  "property_id": "prop_a1b2c3d4",
  "value_stream": "VS3",
  "from_status": "active",
  "to_status": "complete",
  "changed_by": "user_abc",
  "changed_at": "2025-11-05T11:30:00Z",
  "unlocked_streams": ["VS4"]
}
```

### Documents

Documents belong to properties, tagged with value stream.

#### List Documents for Property

```http
GET /api/v1/properties/{property_id}/documents
```

**Query Parameters:**
- `value_stream` (string): Filter by VS (VS1, VS2, etc.)
- `category` (string): Filter by category (SURVEY, CIVIL, FLOOR_PLAN, etc.)
- `status` (string): uploaded, pending_review, approved, needs_revision

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "doc_abc123",
      "filename": "survey_report.pdf",
      "category": "SURVEY",
      "value_stream": "VS2",
      "status": "approved",
      "version": 2,
      "is_current": true,
      "size_bytes": 2457600,
      "mime_type": "application/pdf",
      "uploaded_by": {
        "id": "user_abc",
        "name": "Jane Analyst"
      },
      "uploaded_at": "2025-11-05T12:00:00Z",
      "reviews": [
        {
          "reviewer": "user_xyz",
          "decision": "approved",
          "reviewed_at": "2025-11-06T10:00:00Z"
        }
      ]
    }
  ]
}
```

#### Upload Document

```http
POST /api/v1/properties/{property_id}/documents
```

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` (file): Document file
- `value_stream` (string): VS key (VS1, VS2, etc.)
- `category` (string): Category key (SURVEY, CIVIL, etc.)
- `description` (string, optional)

**Response: 201 Created**
```json
{
  "id": "doc_abc123",
  "filename": "survey_report.pdf",
  "category": "SURVEY",
  "value_stream": "VS2",
  "status": "uploaded",
  "version": 1,
  "storage_url": "s3://connect2-docs/...",
  "uploaded_at": "2025-11-05T12:00:00Z"
}
```

#### Review Document

```http
POST /api/v1/documents/{id}/review
```

**Request Body:**
```json
{
  "decision": "approved",
  "comments": "Survey meets all requirements, setbacks verified"
}
```

**Response: 200 OK**

#### Get Document Download URL

```http
GET /api/v1/documents/{id}/download
```

**Response: 200 OK**
```json
{
  "download_url": "https://s3.amazonaws.com/...",
  "expires_at": "2025-11-05T13:00:00Z"
}
```

### Checklist

Checklist items track progress per value stream.

#### Get Property Checklist Status

```http
GET /api/v1/properties/{property_id}/checklist
```

**Query Parameters:**
- `value_stream` (string): Filter by VS (optional, all if not specified)

**Response: 200 OK**
```json
{
  "property_id": "prop_a1b2c3d4",
  "checklist": [
    {
      "value_stream": "VS2",
      "name": "Feasibility",
      "items": [
        {
          "id": "item_123",
          "key": "SURVEY_RECEIVED",
          "name": "Survey Report Received",
          "is_complete": true,
          "completed_at": "2025-10-20T10:00:00Z",
          "completed_by": "user_abc"
        },
        {
          "id": "item_124",
          "key": "TITLE_REVIEWED",
          "name": "Title Report Reviewed",
          "is_complete": true,
          "completed_at": "2025-10-22T14:00:00Z",
          "completed_by": "user_abc"
        }
      ],
      "progress_pct": 100
    },
    {
      "value_stream": "VS3",
      "name": "Acquisition",
      "items": [
        {
          "id": "item_130",
          "key": "CONTRACT_SIGNED",
          "name": "Purchase Contract Signed",
          "is_complete": true
        },
        {
          "id": "item_131",
          "key": "EARNEST_DEPOSITED",
          "name": "Earnest Money Deposited",
          "is_complete": false
        }
      ],
      "progress_pct": 60
    }
  ]
}
```

#### Update Checklist Item

```http
PATCH /api/v1/properties/{property_id}/checklist/{item_id}
```

**Request Body:**
```json
{
  "is_complete": true,
  "notes": "Earnest money deposited to escrow"
}
```

**Response: 200 OK**

### Users

#### List Users

```http
GET /api/v1/users
```

**Query Parameters:**
- `role` (string): Filter by role key
- `department` (string): Filter by department
- `is_active` (boolean): Filter by active status

**Response: 200 OK**

#### Get Current User

```http
GET /api/v1/users/me
```

**Response: 200 OK**
```json
{
  "id": "user_abc",
  "email": "jane@blueprint.com",
  "first_name": "Jane",
  "last_name": "Analyst",
  "roles": [
    {
      "key": "DESIGN_MANAGER",
      "name": "Design Manager",
      "department": "DESIGN",
      "level": 2
    }
  ],
  "value_stream_access": [
    {"value_stream": "VS3", "access_level": "read"},
    {"value_stream": "VS4", "access_level": "manage"},
    {"value_stream": "VS5", "access_level": "read"}
  ],
  "last_login": "2025-11-05T09:00:00Z"
}
```

### Property Assignments

#### Assign User to Property

```http
POST /api/v1/properties/{property_id}/assignments
```

**Request Body:**
```json
{
  "user_id": "user_xyz",
  "value_stream": "VS4"
}
```

**Response: 201 Created**

#### List Assignments for Property

```http
GET /api/v1/properties/{property_id}/assignments
```

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "assign_123",
      "user": {
        "id": "user_xyz",
        "name": "Mike Designer"
      },
      "value_stream": "VS4",
      "assigned_by": "user_abc",
      "assigned_at": "2025-11-01T10:00:00Z",
      "is_active": true
    }
  ]
}
```

### Property Notes

#### Add Note to Property

```http
POST /api/v1/properties/{property_id}/notes
```

**Request Body:**
```json
{
  "content": "Builder prefers modern aesthetic, see reference images",
  "value_stream": "VS4",
  "is_pinned": true
}
```

**Response: 201 Created**

#### List Notes for Property

```http
GET /api/v1/properties/{property_id}/notes
```

**Query Parameters:**
- `value_stream` (string): Filter by VS
- `is_pinned` (boolean): Filter pinned notes

**Response: 200 OK**

### Analytics

#### Get Dashboard Metrics

```http
GET /api/v1/analytics/dashboard
```

**Query Parameters:**
- `date_from` (date)
- `date_to` (date)

**Response: 200 OK**
```json
{
  "period": {
    "from": "2025-10-01",
    "to": "2025-10-31"
  },
  "metrics": {
    "properties_by_value_stream": {
      "VS1": {"active": 12, "complete": 45},
      "VS2": {"active": 23, "complete": 38},
      "VS3": {"active": 15, "complete": 22},
      "VS4": {"active": 18, "complete": 10},
      "VS5": {"active": 8, "complete": 5},
      "VS6": {"active": 3, "complete": 2}
    },
    "average_cycle_times_days": {
      "VS1": 2.5,
      "VS2": 15.3,
      "VS3": 8.2,
      "VS4": 25.1,
      "VS5": 12.4
    },
    "documents_pending_review": 15,
    "checklist_completion_rate": 0.78
  }
}
```

### Health Check

#### System Health

```http
GET /api/v1/health
```

**Response: 200 OK**
```json
{
  "status": "healthy",
  "version": "2.0.1",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2025-11-05T12:00:00Z"
}
```

---

## Error Handling

### Error Response Format

All errors follow this structure (RFC 7807 Problem Details):

```json
{
  "detail": "Invalid request parameters",
  "type": "validation_error",
  "status": 422,
  "errors": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ],
  "request_id": "req_abc123"
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
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource state conflict |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### FastAPI Exception Handling

```python
from fastapi import HTTPException
from fastapi.responses import JSONResponse

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "type": "http_error",
            "status": exc.status_code,
            "request_id": request.state.request_id
        }
    )
```

---

## Rate Limiting

### Limits by Role

| Role | Requests per Minute | Burst |
|------|---------------------|-------|
| Admin | 1000 | 100 |
| Internal Users | 300 | 50 |
| External Users | 100 | 20 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 275
X-RateLimit-Reset: 1699200000
```

---

## Webhooks

### Webhook Events

| Event | Description |
|-------|-------------|
| `property.created` | New property created |
| `property.vs_transitioned` | Value stream status changed |
| `document.uploaded` | New document uploaded |
| `document.approved` | Document approved |
| `checklist.item_completed` | Checklist item marked complete |

### Webhook Payload

```json
{
  "id": "evt_abc123",
  "type": "property.vs_transitioned",
  "created": "2025-11-05T12:30:00Z",
  "data": {
    "property_id": "prop_a1b2c3d4",
    "value_stream": "VS3",
    "from_status": "active",
    "to_status": "complete",
    "changed_by": "user_abc"
  }
}
```

### Webhook Signature Verification

```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

## Appendix

### Date/Time Format

All dates and times use ISO 8601 format with UTC timezone:

```
2025-11-05T12:30:00Z
```

### Idempotency

For POST requests that modify state, include an idempotency key:

```http
POST /api/v1/properties
Idempotency-Key: unique-key-12345
```

### OpenAPI Schema

The full OpenAPI schema is available at `/openapi.json` and can be used for:
- Client SDK generation
- API documentation
- Contract testing

---

## Change Log

| Date | Version | Change |
|------|---------|--------|
| January 2026 | 2.0 | Property-centric API with value stream model, FastAPI implementation |
| November 2025 | 1.0 | Initial API specification |
