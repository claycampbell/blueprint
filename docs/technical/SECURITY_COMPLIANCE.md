# Security and Compliance Documentation

**Version:** 1.0
**Last Updated:** November 5, 2025
**Status:** Draft - Ready for Security Review
**Related Documents:** [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md), [API_SPECIFICATION.md](API_SPECIFICATION.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Security Architecture](#2-security-architecture)
3. [Authentication and Authorization](#3-authentication-and-authorization)
4. [Data Protection](#4-data-protection)
5. [API Security](#5-api-security)
6. [Infrastructure Security](#6-infrastructure-security)
7. [Application Security](#7-application-security)
8. [Third-Party Integrations](#8-third-party-integrations)
9. [Incident Response](#9-incident-response)
10. [Compliance Framework](#10-compliance-framework)
11. [Security Monitoring](#11-security-monitoring)
12. [Security Checklist](#12-security-checklist)

---

## 1. Overview

### 1.1 Security Principles

Connect 2.0 follows these core security principles:

1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Users and systems have minimal necessary permissions
3. **Zero Trust**: Never trust, always verify
4. **Security by Design**: Security integrated from day one, not bolted on
5. **Data Minimization**: Collect and retain only necessary data
6. **Transparency**: Clear audit trails and logging

### 1.2 Regulatory Requirements

**Financial Data:**
- **GLBA** (Gramm-Leach-Bliley Act): Financial privacy requirements
- **SOX** (Sarbanes-Oxley): Financial reporting controls
- **ECOA** (Equal Credit Opportunity Act): Fair lending practices

**Data Privacy:**
- **CCPA** (California Consumer Privacy Act): California data privacy
- **GDPR** (EU): If serving EU customers (future)

**Industry Standards:**
- **PCI DSS**: If processing payments directly (future)
- **SOC 2 Type II**: Trust services criteria (target for Day 180+)

### 1.3 Threat Model

**Key Threats:**
- **Unauthorized Access**: Attackers gaining access to loan/borrower data
- **Data Breach**: Exfiltration of sensitive financial information
- **Ransomware**: Encryption of critical data
- **Insider Threats**: Malicious or negligent employees
- **Supply Chain Attacks**: Compromised dependencies or integrations
- **API Abuse**: Excessive requests, data scraping

---

## 2. Security Architecture

### 2.1 Security Layers

```
┌────────────────────────────────────────────────────┐
│ Layer 7: Application Security                     │
│ - Input validation                                 │
│ - Output encoding                                  │
│ - Business logic controls                          │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│ Layer 6: API Security                              │
│ - OAuth 2.0 + JWT                                  │
│ - Rate limiting                                    │
│ - API gateway                                      │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│ Layer 5: Data Protection                           │
│ - Encryption at rest (AES-256)                     │
│ - Encryption in transit (TLS 1.3)                  │
│ - Key management (Azure Key Vault / AWS KMS)       │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│ Layer 4: Network Security                          │
│ - VPC isolation                                    │
│ - Security groups / Firewall rules                 │
│ - DDoS protection (Cloudflare / AWS Shield)        │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│ Layer 3: Infrastructure Security                   │
│ - Container security (image scanning)              │
│ - Secrets management (never in code)               │
│ - Patch management (automated)                     │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│ Layer 2: Identity & Access Management              │
│ - SSO (Azure AD / Okta)                            │
│ - MFA (required for all users)                     │
│ - Role-based access control (RBAC)                 │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│ Layer 1: Physical Security                         │
│ - Cloud provider data centers                      │
│ - SOC 2 / ISO 27001 certified                      │
└────────────────────────────────────────────────────┘
```

### 2.2 Trust Boundaries

```
┌─────────────────────────────────────────────────┐
│ Internet (Untrusted)                            │
│ - Public users                                  │
│ - Bots / Attackers                              │
└─────────────────────────────────────────────────┘
                    │
                    ↓ HTTPS + WAF
┌─────────────────────────────────────────────────┐
│ DMZ (Semi-Trusted)                              │
│ - Load balancer                                 │
│ - API Gateway                                   │
│ - Rate limiting                                 │
└─────────────────────────────────────────────────┘
                    │
                    ↓ OAuth 2.0 + JWT
┌─────────────────────────────────────────────────┐
│ Application Layer (Trusted)                     │
│ - Backend API servers                           │
│ - Business logic                                │
└─────────────────────────────────────────────────┘
                    │
                    ↓ TLS + Credentials
┌─────────────────────────────────────────────────┐
│ Data Layer (Highly Trusted)                     │
│ - PostgreSQL (encrypted at rest)                │
│ - Redis (encrypted)                             │
│ - Object storage (encrypted)                    │
└─────────────────────────────────────────────────┘
```

---

## 3. Authentication and Authorization

### 3.1 Authentication Methods

**Primary: OAuth 2.0 + JWT**

```typescript
// Authentication flow
async function login(email: string, password: string) {
  // 1. Validate credentials
  const user = await db.users.findByEmail(email);
  if (!user) throw new AuthenticationError('Invalid credentials');

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) throw new AuthenticationError('Invalid credentials');

  // 2. Check account status
  if (user.locked) throw new AuthenticationError('Account locked');
  if (!user.email_verified) throw new AuthenticationError('Email not verified');

  // 3. Generate JWT tokens
  const accessToken = generateJWT({
    user_id: user.id,
    email: user.email,
    role: user.role
  }, {
    expiresIn: '15m' // Short-lived access token
  });

  const refreshToken = generateJWT({
    user_id: user.id,
    type: 'refresh'
  }, {
    expiresIn: '7d' // Longer-lived refresh token
  });

  // 4. Store refresh token (for revocation capability)
  await db.refresh_tokens.create({
    user_id: user.id,
    token_hash: hashToken(refreshToken),
    expires_at: addDays(new Date(), 7)
  });

  // 5. Log successful login
  await auditLog.create({
    user_id: user.id,
    action: 'LOGIN_SUCCESS',
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });

  return { accessToken, refreshToken };
}
```

**Multi-Factor Authentication (MFA):**

```typescript
// MFA enrollment
async function enrollMFA(userId: string, method: 'TOTP' | 'SMS') {
  if (method === 'TOTP') {
    const secret = speakeasy.generateSecret({ name: 'Blueprint Connect 2.0' });
    await db.users.update(userId, {
      mfa_secret: encryptSecret(secret.base32),
      mfa_enabled: false // Enabled after verification
    });
    return { qrCode: secret.otpauth_url };
  } else if (method === 'SMS') {
    const code = generateRandomCode(6);
    await twilioClient.messages.create({
      to: user.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `Your Blueprint verification code: ${code}`
    });
    await redis.setex(`mfa:${userId}`, 300, code); // Expires in 5 minutes
  }
}

// MFA verification
async function verifyMFA(userId: string, code: string) {
  const user = await db.users.findById(userId);

  if (user.mfa_method === 'TOTP') {
    const isValid = speakeasy.totp.verify({
      secret: decryptSecret(user.mfa_secret),
      encoding: 'base32',
      token: code,
      window: 2 // Allow 2 time steps (60 seconds)
    });

    if (!isValid) throw new AuthenticationError('Invalid MFA code');
  } else if (user.mfa_method === 'SMS') {
    const storedCode = await redis.get(`mfa:${userId}`);
    if (storedCode !== code) throw new AuthenticationError('Invalid MFA code');
  }

  await db.users.update(userId, { mfa_enabled: true });
}
```

### 3.2 Authorization (RBAC)

**Role Definitions:**

| Role | Permissions | Access Level |
|------|-------------|--------------|
| **ADMIN** | All operations | Full system access |
| **ACQUISITIONS** | Create/edit projects (LEAD status) | Acquisitions module |
| **ENTITLEMENT** | View/edit feasibility & entitlement | Design & Entitlement module |
| **LOAN_OFFICER** | Create/manage loans | Loan Origination module |
| **SERVICING** | Manage draws, inspections | Loan Servicing module |
| **ACCOUNTING** | View financials, reporting | Read-only financial data |
| **VIEWER** | Read-only access | View-only across modules |

**Permission Matrix:**

```typescript
// permissions.ts
export const PERMISSIONS = {
  // Projects
  'projects:create': ['ADMIN', 'ACQUISITIONS'],
  'projects:view': ['ADMIN', 'ACQUISITIONS', 'ENTITLEMENT', 'LOAN_OFFICER', 'VIEWER'],
  'projects:update': ['ADMIN', 'ACQUISITIONS', 'ENTITLEMENT'],
  'projects:delete': ['ADMIN'],

  // Loans
  'loans:create': ['ADMIN', 'LOAN_OFFICER'],
  'loans:view': ['ADMIN', 'LOAN_OFFICER', 'SERVICING', 'ACCOUNTING', 'VIEWER'],
  'loans:approve': ['ADMIN', 'LOAN_OFFICER'],
  'loans:fund': ['ADMIN', 'LOAN_OFFICER'],

  // Draws
  'draws:create': ['ADMIN', 'SERVICING'],
  'draws:approve': ['ADMIN', 'LOAN_OFFICER'],
  'draws:inspect': ['ADMIN', 'SERVICING'],

  // Users
  'users:create': ['ADMIN'],
  'users:view': ['ADMIN'],
  'users:update': ['ADMIN'],
  'users:delete': ['ADMIN'],
};

// Middleware
export function authorize(requiredPermission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Set by authenticate middleware

    const allowedRoles = PERMISSIONS[requiredPermission];
    if (!allowedRoles || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
}
```

**Row-Level Security:**

```typescript
// Ensure users can only access their own data
async function getProjects(userId: string, filters: any) {
  const user = await db.users.findById(userId);

  let query = db('projects');

  // Non-admin users can only see assigned projects
  if (user.role !== 'ADMIN') {
    query = query.where('assigned_to', userId)
      .orWhere('submitted_by', userId);
  }

  // Apply additional filters
  if (filters.status) {
    query = query.where('status', filters.status);
  }

  return query;
}
```

### 3.3 Session Management

**Token Expiration:**
- **Access Token**: 15 minutes (short-lived)
- **Refresh Token**: 7 days (revocable)
- **Remember Me**: 30 days (optional, explicit consent)

**Token Refresh:**
```typescript
async function refreshAccessToken(refreshToken: string) {
  // 1. Verify refresh token
  const payload = verifyJWT(refreshToken);
  if (payload.type !== 'refresh') throw new AuthenticationError('Invalid token type');

  // 2. Check if token is revoked
  const tokenHash = hashToken(refreshToken);
  const storedToken = await db.refresh_tokens.findByHash(tokenHash);
  if (!storedToken || storedToken.revoked) {
    throw new AuthenticationError('Token revoked');
  }

  // 3. Generate new access token
  const user = await db.users.findById(payload.user_id);
  const newAccessToken = generateJWT({
    user_id: user.id,
    email: user.email,
    role: user.role
  }, { expiresIn: '15m' });

  return { accessToken: newAccessToken };
}
```

**Session Termination:**
```typescript
async function logout(userId: string, refreshToken: string) {
  // Revoke refresh token
  const tokenHash = hashToken(refreshToken);
  await db.refresh_tokens.update(
    { user_id: userId, token_hash: tokenHash },
    { revoked: true, revoked_at: new Date() }
  );

  // Audit log
  await auditLog.create({
    user_id: userId,
    action: 'LOGOUT',
    timestamp: new Date()
  });
}

// Revoke all sessions (e.g., password change)
async function revokeAllSessions(userId: string) {
  await db.refresh_tokens.update(
    { user_id: userId },
    { revoked: true, revoked_at: new Date() }
  );
}
```

---

## 4. Data Protection

### 4.1 Encryption at Rest

**Database Encryption:**
- **PostgreSQL**: Transparent Data Encryption (TDE) enabled
- **Algorithm**: AES-256-GCM
- **Key Management**: Azure Key Vault or AWS KMS

**Object Storage Encryption:**
- **S3/Azure Blob**: Server-side encryption (SSE-KMS)
- **Documents**: Encrypted before upload (client-side encryption for extra sensitivity)

**Sensitive Field Encryption:**
```typescript
// Encrypt sensitive fields before storing
import { encrypt, decrypt } from './crypto-utils';

async function storeContact(contact: Contact) {
  const encrypted = {
    ...contact,
    ssn: encrypt(contact.ssn, process.env.DATA_ENCRYPTION_KEY),
    bank_account: encrypt(contact.bank_account, process.env.DATA_ENCRYPTION_KEY)
  };

  await db.contacts.create(encrypted);
}

async function retrieveContact(id: string) {
  const contact = await db.contacts.findById(id);

  return {
    ...contact,
    ssn: decrypt(contact.ssn, process.env.DATA_ENCRYPTION_KEY),
    bank_account: decrypt(contact.bank_account, process.env.DATA_ENCRYPTION_KEY)
  };
}
```

### 4.2 Encryption in Transit

**TLS Configuration:**
- **Minimum Version**: TLS 1.3
- **Cipher Suites**: Strong ciphers only (AES-GCM, ChaCha20-Poly1305)
- **HSTS**: Strict-Transport-Security header enabled
- **Certificate**: Valid SSL/TLS certificate (Let's Encrypt or commercial)

**HTTPS Enforcement:**
```typescript
// Express middleware
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Security headers
app.use(helmet({
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Remove unsafe-inline in production
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.API_URL]
    }
  }
}));
```

### 4.3 Key Management

**Key Rotation:**
- **Data Encryption Keys**: Rotate every 90 days
- **JWT Signing Keys**: Rotate every 180 days
- **API Keys**: Rotate every 90 days

**Key Storage:**
```typescript
// Never store keys in code or environment variables directly
// Use Azure Key Vault or AWS Secrets Manager

import { SecretClient } from '@azure/keyvault-secrets';

const client = new SecretClient(
  process.env.KEY_VAULT_URL,
  new DefaultAzureCredential()
);

async function getEncryptionKey() {
  const secret = await client.getSecret('data-encryption-key');
  return secret.value;
}
```

### 4.4 Data Retention and Deletion

**Retention Policies:**

| Data Type | Retention Period | Deletion Method |
|-----------|------------------|-----------------|
| **Loan Records** | 7 years (regulatory) | Soft delete, then purge |
| **Audit Logs** | 2 years | Archive to cold storage, then delete |
| **User Sessions** | 30 days | Automated cleanup |
| **Temporary Files** | 24 hours | Automated cleanup |
| **Backups** | 30 days (daily), 1 year (monthly) | Automated rotation |

**Hard Delete Implementation:**
```typescript
async function hardDeleteProject(projectId: string) {
  // 1. Verify soft-deleted and past retention period
  const project = await db.projects.findById(projectId, { includeSoftDeleted: true });
  if (!project.deleted_at) throw new Error('Project not soft-deleted');

  const retentionDays = 90;
  if (daysSince(project.deleted_at) < retentionDays) {
    throw new Error('Retention period not elapsed');
  }

  // 2. Delete related records (cascade)
  await db.transaction(async (trx) => {
    await trx('documents').where({ project_id: projectId }).del();
    await trx('tasks').where({ project_id: projectId }).del();
    await trx('activity_log').where({ entity_id: projectId }).del();
    await trx('projects').where({ id: projectId }).del();
  });

  // 3. Delete files from storage
  await storage.deleteFolder(`projects/${projectId}`);

  // 4. Audit log
  await auditLog.create({
    action: 'HARD_DELETE',
    entity_type: 'PROJECT',
    entity_id: projectId,
    timestamp: new Date()
  });
}
```

---

## 5. API Security

### 5.1 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later'
});

app.use('/api', globalLimiter);
app.use('/api/v1/auth/login', authLimiter);
```

### 5.2 Input Validation

```typescript
import Joi from 'joi';

// Schema validation
const createProjectSchema = Joi.object({
  address: Joi.string().required().max(255),
  city: Joi.string().required().max(100),
  state: Joi.string().required().length(2).uppercase(),
  zip: Joi.string().required().pattern(/^\d{5}(-\d{4})?$/),
  purchase_price: Joi.number().positive().max(100000000),
  list_price: Joi.number().positive().max(100000000)
});

// Validation middleware
function validate(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request parameters',
          details: error.details.map(d => ({
            field: d.path.join('.'),
            message: d.message
          }))
        }
      });
    }

    next();
  };
}

// Usage
app.post('/api/v1/projects', validate(createProjectSchema), createProject);
```

### 5.3 SQL Injection Prevention

```typescript
// NEVER do this (vulnerable to SQL injection)
const badQuery = `SELECT * FROM users WHERE email = '${email}'`;

// ALWAYS use parameterized queries
const safeQuery = await db('users').where({ email }).first();

// Or with raw queries, use placeholders
const safeRawQuery = await db.raw(
  'SELECT * FROM users WHERE email = ? AND status = ?',
  [email, 'ACTIVE']
);
```

### 5.4 XSS Prevention

```typescript
// Output encoding
import DOMPurify from 'isomorphic-dompurify';

function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href']
  });
}

// Content Security Policy (CSP)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
}));
```

### 5.5 CSRF Protection

```typescript
import csrf from 'csurf';

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Include CSRF token in forms
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// For API (use double-submit cookie pattern)
app.use((req, res, next) => {
  const token = req.headers['x-csrf-token'];
  const cookieToken = req.cookies['csrf-token'];

  if (token !== cookieToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
});
```

---

## 6. Infrastructure Security

### 6.1 Network Security

**VPC Configuration (AWS example):**
```yaml
VPC:
  CIDR: 10.0.0.0/16
  Subnets:
    Public:
      - 10.0.1.0/24 (Load Balancer)
      - 10.0.2.0/24 (NAT Gateway)
    Private:
      - 10.0.10.0/24 (Application Servers)
      - 10.0.11.0/24 (Application Servers)
    Database:
      - 10.0.20.0/24 (PostgreSQL)
      - 10.0.21.0/24 (Redis)

Security Groups:
  LoadBalancer:
    Inbound:
      - Port 443 from 0.0.0.0/0 (HTTPS)
      - Port 80 from 0.0.0.0/0 (redirect to HTTPS)
    Outbound:
      - All to ApplicationServers

  ApplicationServers:
    Inbound:
      - Port 3000 from LoadBalancer
    Outbound:
      - Port 5432 to Database (PostgreSQL)
      - Port 6379 to Database (Redis)
      - Port 443 to Internet (external APIs)

  Database:
    Inbound:
      - Port 5432 from ApplicationServers (PostgreSQL)
      - Port 6379 from ApplicationServers (Redis)
    Outbound:
      - None
```

### 6.2 Container Security

**Docker Security:**
```dockerfile
# Use official, minimal base images
FROM node:20-alpine

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Copy only necessary files
COPY --chown=nodejs:nodejs package*.json ./
RUN npm ci --only=production

COPY --chown=nodejs:nodejs . .

# Expose only necessary port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js

CMD ["node", "dist/server.js"]
```

**Image Scanning:**
```bash
# Scan Docker images for vulnerabilities
docker scan connect2-backend:latest

# Fail build on critical vulnerabilities
trivy image --severity CRITICAL,HIGH --exit-code 1 connect2-backend:latest
```

### 6.3 Secrets Management

**Never Store Secrets in Code:**
```typescript
// ❌ BAD: Secrets in code
const apiKey = 'sk_live_abc123def456';

// ❌ BAD: Secrets in environment variables (in repo)
// .env
API_KEY=sk_live_abc123def456

// ✅ GOOD: Secrets in secure vault
import { getSecret } from './secrets-manager';

const apiKey = await getSecret('sendgrid-api-key');
```

**Secrets Rotation:**
```typescript
async function rotateAPIKey(service: string) {
  // 1. Generate new key
  const newKey = await externalService.generateAPIKey();

  // 2. Store new key with version
  await secretsManager.setSecret(`${service}-api-key`, newKey, {
    version: Date.now()
  });

  // 3. Update application config (rolling deployment)
  await deployNewVersion();

  // 4. Wait for rollout completion (24 hours grace period)
  await sleep(24 * 60 * 60 * 1000);

  // 5. Revoke old key
  await externalService.revokeAPIKey(oldKey);
}
```

---

## 7. Application Security

### 7.1 Dependency Management

**Automated Vulnerability Scanning:**
```bash
# npm audit
npm audit --audit-level=high

# Dependabot (GitHub Actions)
# Automatically creates PRs for vulnerable dependencies
```

**.github/dependabot.yml:**
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
```

**Dependency Review:**
```typescript
// Only use well-maintained, trusted packages
// Check before adding:
// - Download count
// - Last publish date
// - Known vulnerabilities
// - License compatibility
```

### 7.2 Secure Coding Practices

**Password Hashing:**
```typescript
import bcrypt from 'bcrypt';

// Hash password before storing
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Increase for more security (slower)
  return bcrypt.hash(password, saltRounds);
}

// Verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Never log or return passwords
async function createUser(data: any) {
  const passwordHash = await hashPassword(data.password);

  const user = await db.users.create({
    email: data.email,
    password_hash: passwordHash
    // NEVER store password: data.password
  });

  // NEVER return password_hash
  return {
    id: user.id,
    email: user.email
    // password_hash: user.password_hash ❌
  };
}
```

**Preventing Timing Attacks:**
```typescript
import crypto from 'crypto';

// Use timing-safe comparison
function timingSafeCompare(a: string, b: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(a),
    Buffer.from(b)
  );
}
```

---

## 8. Third-Party Integrations

### 8.1 API Key Security

**Scoped API Keys:**
- Use separate API keys for each environment (dev, staging, production)
- Restrict API key permissions to minimum necessary
- Rotate keys every 90 days

**Webhook Signature Verification:**
```typescript
function verifyDocuSignWebhook(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.DOCUSIGN_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### 8.2 Data Sharing

**Principle of Least Data:**
- Only share data necessary for integration
- Anonymize data when possible
- Audit all data shared with third parties

**Data Processing Agreements (DPA):**
- Require DPAs with all vendors processing sensitive data
- Ensure vendors are SOC 2 / ISO 27001 certified
- Annual vendor security reviews

---

## 9. Incident Response

### 9.1 Incident Response Plan

**Phases:**
1. **Detection**: Identify security incident
2. **Containment**: Isolate affected systems
3. **Eradication**: Remove threat
4. **Recovery**: Restore normal operations
5. **Lessons Learned**: Post-incident review

**Incident Severity:**

| Severity | Definition | Response Time | Escalation |
|----------|------------|---------------|------------|
| **P0 - Critical** | Data breach, system compromise | Immediate | CEO, CTO, Legal |
| **P1 - High** | Unauthorized access attempt, DoS | < 1 hour | CTO, Security Lead |
| **P2 - Medium** | Suspicious activity, failed logins | < 4 hours | Security Lead |
| **P3 - Low** | Policy violation, minor issue | < 24 hours | Engineering Manager |

### 9.2 Incident Response Runbook

**Data Breach Response:**
```markdown
1. IMMEDIATE (0-30 minutes)
   - [ ] Isolate affected systems (disable network access)
   - [ ] Preserve evidence (snapshot VMs, copy logs)
   - [ ] Notify incident response team (CTO, Security Lead, Legal)

2. INVESTIGATION (30 minutes - 4 hours)
   - [ ] Determine scope (which data exposed, how many users)
   - [ ] Identify attack vector (how breach occurred)
   - [ ] Review audit logs for unauthorized access

3. CONTAINMENT (4-24 hours)
   - [ ] Revoke compromised credentials
   - [ ] Patch vulnerability
   - [ ] Deploy fixes to production

4. NOTIFICATION (24-72 hours)
   - [ ] Notify affected users (email + in-app notification)
   - [ ] Notify regulators if required (CCPA: 30 days, GDPR: 72 hours)
   - [ ] Prepare public statement if necessary

5. RECOVERY (72 hours - 1 week)
   - [ ] Restore services
   - [ ] Monitor for recurrence
   - [ ] Implement additional controls

6. POST-INCIDENT (1-2 weeks)
   - [ ] Conduct post-mortem
   - [ ] Update security controls
   - [ ] Train team on lessons learned
```

### 9.3 Communication Plan

**Internal Communication:**
- Slack channel: #incident-response
- Email: security@blueprint.com
- Phone tree for P0 incidents

**External Communication:**
- Users: Email + in-app notification
- Regulators: Via legal counsel
- Media: Coordinated response via PR team (if necessary)

---

## 10. Compliance Framework

### 10.1 GLBA Compliance

**Financial Privacy:**
- Privacy notices provided to all borrowers
- Opt-out mechanism for data sharing
- Safeguards to protect customer information

**Implementation:**
```typescript
async function providePrivacyNotice(loanId: string) {
  const loan = await db.loans.findById(loanId);
  const borrower = await db.contacts.findById(loan.borrower_id);

  // Send privacy notice
  await emailService.send({
    to: borrower.email,
    template: 'privacy_notice',
    data: { loan_number: loan.loan_number }
  });

  // Log disclosure
  await db.compliance_log.create({
    loan_id: loanId,
    action: 'PRIVACY_NOTICE_SENT',
    timestamp: new Date()
  });
}
```

### 10.2 ECOA Compliance

**Fair Lending:**
- No discrimination based on protected classes
- Adverse action notices for denied loans
- Record retention for 25 months

**Implementation:**
```typescript
async function denyLoan(loanId: string, reason: string) {
  await db.loans.update(loanId, {
    status: 'DENIED',
    denial_reason: reason,
    denied_at: new Date()
  });

  // Send adverse action notice
  const loan = await db.loans.findById(loanId);
  const borrower = await db.contacts.findById(loan.borrower_id);

  await emailService.send({
    to: borrower.email,
    template: 'adverse_action_notice',
    data: {
      loan_number: loan.loan_number,
      denial_reason: reason,
      // ECOA required: specific reasons, ECOA notice, contact info
    }
  });
}
```

### 10.3 SOC 2 Preparation

**Trust Service Criteria:**
- **Security**: Access controls, encryption, monitoring
- **Availability**: 99.5% uptime SLA
- **Processing Integrity**: Data accuracy and completeness
- **Confidentiality**: Protect confidential information
- **Privacy**: Notice, choice, access, retention

**SOC 2 Readiness Checklist:**
- [ ] Formalized security policies
- [ ] Access control policies (RBAC)
- [ ] Incident response plan
- [ ] Business continuity plan
- [ ] Vendor management process
- [ ] Annual security training
- [ ] Penetration testing (annual)
- [ ] Vulnerability scanning (continuous)

---

## 11. Security Monitoring

### 11.1 Logging Strategy

**Security Events to Log:**
- Authentication (login, logout, failed attempts)
- Authorization (access denied)
- Data access (view, create, update, delete)
- Configuration changes
- Security incidents
- API requests (rate limiting triggers)

**Log Format (Structured JSON):**
```json
{
  "timestamp": "2025-11-05T10:00:00Z",
  "level": "INFO",
  "event": "LOGIN_SUCCESS",
  "user_id": "usr_123",
  "email": "user@blueprint.com",
  "ip_address": "203.0.113.45",
  "user_agent": "Mozilla/5.0...",
  "session_id": "sess_abc123",
  "metadata": {
    "mfa_used": true,
    "login_method": "PASSWORD"
  }
}
```

### 11.2 Alerting

**Critical Alerts (Immediate):**
- Multiple failed login attempts (brute force)
- Privilege escalation attempts
- Database connection errors
- Unauthorized API access
- Unusual data access patterns

**Alert Destinations:**
- PagerDuty (P0 incidents)
- Slack #security-alerts
- Email to security team

**Example Alert:**
```typescript
async function detectBruteForce(email: string, ipAddress: string) {
  const failedAttempts = await redis.incr(`login_attempts:${ipAddress}`);
  await redis.expire(`login_attempts:${ipAddress}`, 900); // 15 minutes

  if (failedAttempts >= 5) {
    // Lock account
    await db.users.update({ email }, { locked: true, locked_at: new Date() });

    // Alert security team
    await alerting.send({
      severity: 'HIGH',
      title: 'Brute Force Attack Detected',
      description: `Multiple failed login attempts for ${email} from IP ${ipAddress}`,
      metadata: { email, ipAddress, attempts: failedAttempts }
    });
  }
}
```

### 11.3 Audit Trail

**Immutable Audit Log:**
```typescript
async function createAuditLog(event: AuditEvent) {
  // Store in append-only table
  await db('audit_log').insert({
    id: generateUUID(),
    timestamp: new Date(),
    user_id: event.user_id,
    action: event.action,
    entity_type: event.entity_type,
    entity_id: event.entity_id,
    changes: event.changes, // JSON diff of before/after
    ip_address: event.ip_address,
    user_agent: event.user_agent
  });

  // Also stream to SIEM (Splunk, Datadog, etc.)
  await siem.sendEvent(event);
}
```

---

## 12. Security Checklist

### 12.1 Pre-Deployment Checklist

**Code Security:**
- [ ] No hardcoded secrets
- [ ] All dependencies scanned for vulnerabilities
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevention (output encoding, CSP)
- [ ] CSRF protection enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info

**Infrastructure:**
- [ ] HTTPS enforced (TLS 1.3)
- [ ] Security groups configured (least privilege)
- [ ] Secrets stored in vault (not env vars)
- [ ] Database encrypted at rest
- [ ] Backups encrypted
- [ ] Network segmentation (VPC)
- [ ] DDoS protection enabled

**Authentication & Authorization:**
- [ ] MFA enabled for all users
- [ ] Password complexity requirements
- [ ] JWT expiration configured
- [ ] RBAC implemented
- [ ] Session timeout configured
- [ ] Failed login lockout

**Monitoring:**
- [ ] Security logging enabled
- [ ] Alerts configured
- [ ] Audit trail implemented
- [ ] SIEM integration
- [ ] Incident response plan documented

### 12.2 Ongoing Security Tasks

**Weekly:**
- [ ] Review security alerts
- [ ] Check for failed login attempts
- [ ] Review audit logs

**Monthly:**
- [ ] Dependency vulnerability scan
- [ ] Review access control lists
- [ ] Test backups

**Quarterly:**
- [ ] Rotate API keys
- [ ] Security training for team
- [ ] Review and update security policies
- [ ] Vendor security review

**Annually:**
- [ ] Penetration testing
- [ ] SOC 2 audit preparation
- [ ] Disaster recovery test
- [ ] Incident response drill

---

**End of Security and Compliance Documentation**
