# Mock Notification Services Implementation Guide

**Sprint 2 Context**: AWS SES and Twilio production access will NOT be available during Sprint 2. This guide documents the mock service implementation strategy.

---

## Overview

Mock services enable full notification system development and testing without external service dependencies. The implementation must be production-ready - switching to real services should require only configuration changes.

---

## Mock Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Notification Queue                       │
│                    (DP01-278: SQS)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐      ┌──────────────────┐
│  Email Service  │      │   SMS Service    │
│   (DP01-274)    │      │   (DP01-275)     │
│                 │      │                  │
│  USE_MOCK_SES   │      │ USE_MOCK_TWILIO  │
│                 │      │                  │
│ ┌─────────────┐ │      │ ┌──────────────┐ │
│ │ LocalStack  │ │      │ │   Console    │ │
│ │  SES Mock   │ │      │ │   + DB Log   │ │
│ └─────────────┘ │      │ └──────────────┘ │
└─────────────────┘      └──────────────────┘
         │                         │
         └────────────┬────────────┘
                      ▼
         ┌────────────────────────┐
         │    Database Logging    │
         │  EmailLog / SmsLog     │
         └────────────────────────┘
```

---

## 1. Mock Email Service (DP01-274)

### LocalStack SES Configuration

**docker-compose.yml**:
```yaml
services:
  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
    environment:
      - SERVICES=ses,sqs,s3
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - ./localstack-data:/tmp/localstack
      - /var/run/docker.sock:/var/run/docker.sock
```

### Environment Variables

**.env**:
```bash
# Email Service Configuration
USE_MOCK_SES=true
AWS_REGION=us-east-1
AWS_ENDPOINT_URL=http://localhost:4566  # LocalStack endpoint

# Production (future - disabled for Sprint 2)
# USE_MOCK_SES=false
# AWS_REGION=us-west-2
# SES_VERIFIED_DOMAIN=vividcg.com
```

### Implementation

**services/email.service.js**:
```javascript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { db } from '../config/database.js';

class EmailService {
  constructor() {
    const useMock = process.env.USE_MOCK_SES === 'true';

    this.client = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      ...(useMock && {
        endpoint: process.env.AWS_ENDPOINT_URL || 'http://localhost:4566',
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test'
        }
      })
    });

    this.useMock = useMock;
  }

  async sendEmail({ to, subject, bodyHtml, bodyText, templateId = null }) {
    const emailLog = await db.emailLog.create({
      recipient: to,
      subject: subject,
      body_html: bodyHtml,
      body_text: bodyText,
      template_id: templateId,
      status: 'Queued',
      created_at: new Date()
    });

    try {
      const command = new SendEmailCommand({
        Source: 'noreply@connect.datapage.io',
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: bodyHtml },
            Text: { Data: bodyText }
          }
        }
      });

      const result = await this.client.send(command);

      await db.emailLog.update(emailLog.id, {
        status: 'Sent',
        ses_message_id: result.MessageId,
        sent_at: new Date()
      });

      if (this.useMock) {
        console.log(`[MOCK EMAIL SENT]`);
        console.log(`  To: ${to}`);
        console.log(`  Subject: ${subject}`);
        console.log(`  MessageId: ${result.MessageId}`);
        console.log(`  Body (first 100 chars): ${bodyText.substring(0, 100)}...`);

        // Simulate delivery after 2 seconds
        setTimeout(async () => {
          await db.emailLog.update(emailLog.id, {
            status: 'Delivered',
            delivered_at: new Date()
          });
          console.log(`[MOCK EMAIL DELIVERED] ${to} - ${subject}`);
        }, 2000);
      }

      return { success: true, messageId: result.MessageId };
    } catch (error) {
      await db.emailLog.update(emailLog.id, {
        status: 'Failed',
        error_message: error.message
      });

      console.error('[EMAIL SERVICE ERROR]', error);
      throw error;
    }
  }

  // Bounce/complaint webhook handler (works with LocalStack)
  async handleSesWebhook(event) {
    const { eventType, mail, bounce, complaint } = event;

    if (eventType === 'Bounce') {
      await db.emailLog.updateByMessageId(mail.messageId, {
        status: 'Bounced',
        error_message: bounce.bouncedRecipients[0]?.diagnosticCode
      });
    }

    if (eventType === 'Complaint') {
      await db.emailLog.updateByMessageId(mail.messageId, {
        status: 'Complained'
      });
    }
  }
}

export default new EmailService();
```

### Admin UI - Email Viewer

**routes/admin/emails.js**:
```javascript
router.get('/admin/emails', async (req, res) => {
  const emails = await db.emailLog.findAll({
    order: [['created_at', 'DESC']],
    limit: 100
  });

  res.render('admin/emails', { emails });
});

router.get('/admin/emails/:id', async (req, res) => {
  const email = await db.emailLog.findById(req.params.id);
  res.render('admin/email-detail', { email });
});
```

**views/admin/emails.ejs**:
```html
<h1>Mock Email Inbox (Development Only)</h1>

<table>
  <thead>
    <tr>
      <th>Timestamp</th>
      <th>Recipient</th>
      <th>Subject</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <% emails.forEach(email => { %>
      <tr>
        <td><%= email.created_at.toLocaleString() %></td>
        <td><%= email.recipient %></td>
        <td><%= email.subject %></td>
        <td>
          <span class="badge badge-<%= email.status.toLowerCase() %>">
            <%= email.status %>
          </span>
        </td>
        <td>
          <a href="/admin/emails/<%= email.id %>">View</a>
        </td>
      </tr>
    <% }); %>
  </tbody>
</table>
```

---

## 2. Mock SMS Service (DP01-275)

### Environment Variables

**.env**:
```bash
# SMS Service Configuration
USE_MOCK_TWILIO=true

# Production (future - disabled for Sprint 2)
# USE_MOCK_TWILIO=false
# TWILIO_ACCOUNT_SID=ACxxxxxxxxx
# TWILIO_AUTH_TOKEN=xxxxxxxxx
# TWILIO_PHONE_NUMBER=+12065551234
```

### Implementation

**services/sms.service.js**:
```javascript
import twilio from 'twilio';
import { db } from '../config/database.js';

class SmsService {
  constructor() {
    const useMock = process.env.USE_MOCK_TWILIO === 'true';

    if (!useMock) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }

    this.useMock = useMock;
  }

  async sendSms({ to, message }) {
    // Character limit validation
    if (message.length > 160) {
      throw new Error('SMS message exceeds 160 character limit');
    }

    // Rate limiting check (10 SMS/day/user)
    const todayCount = await this.checkRateLimit(to);
    if (todayCount >= 10) {
      throw new Error('Daily SMS limit exceeded (10 messages/day)');
    }

    const smsLog = await db.smsLog.create({
      recipient: to,
      message: message,
      status: 'Queued',
      created_at: new Date()
    });

    try {
      if (this.useMock) {
        // Mock implementation
        console.log(`[MOCK SMS SENT]`);
        console.log(`  To: ${to}`);
        console.log(`  Message: ${message}`);
        console.log(`  Length: ${message.length}/160 chars`);

        await db.smsLog.update(smsLog.id, {
          status: 'Sent',
          mock_delivery_receipt_id: `mock_${Date.now()}`,
          sent_at: new Date()
        });

        // Simulate delivery after 1 second
        setTimeout(async () => {
          await db.smsLog.update(smsLog.id, {
            status: 'Delivered',
            delivered_at: new Date()
          });
          console.log(`[MOCK SMS DELIVERED] ${to}`);
        }, 1000);

        return {
          success: true,
          messageId: `mock_${Date.now()}`
        };
      } else {
        // Real Twilio implementation
        const result = await this.client.messages.create({
          to: to,
          from: process.env.TWILIO_PHONE_NUMBER,
          body: message
        });

        await db.smsLog.update(smsLog.id, {
          status: 'Sent',
          twilio_message_sid: result.sid,
          sent_at: new Date()
        });

        return {
          success: true,
          messageId: result.sid
        };
      }
    } catch (error) {
      await db.smsLog.update(smsLog.id, {
        status: 'Failed',
        error_message: error.message
      });

      console.error('[SMS SERVICE ERROR]', error);
      throw error;
    }
  }

  async checkRateLimit(phoneNumber) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await db.smsLog.count({
      where: {
        recipient: phoneNumber,
        created_at: { gte: today }
      }
    });
  }

  // Twilio delivery status webhook handler
  async handleTwilioWebhook(status, messageSid) {
    await db.smsLog.updateByMessageSid(messageSid, {
      status: status === 'delivered' ? 'Delivered' : 'Failed',
      delivered_at: status === 'delivered' ? new Date() : null
    });
  }
}

export default new SmsService();
```

### Admin UI - SMS Viewer

**routes/admin/sms.js**:
```javascript
router.get('/admin/sms', async (req, res) => {
  const messages = await db.smsLog.findAll({
    order: [['created_at', 'DESC']],
    limit: 100
  });

  res.render('admin/sms', { messages });
});
```

---

## 3. Database Migrations

### Email Log Table

**migrations/YYYYMMDD_create_email_log.sql**:
```sql
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body_html TEXT,
  body_text TEXT,
  template_id UUID REFERENCES email_template(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Queued',
  ses_message_id VARCHAR(255),
  error_message TEXT,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_recipient (recipient),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

### SMS Log Table

**migrations/YYYYMMDD_create_sms_log.sql**:
```sql
CREATE TABLE sms_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient VARCHAR(20) NOT NULL,
  message VARCHAR(160) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Queued',
  twilio_message_sid VARCHAR(255),
  mock_delivery_receipt_id VARCHAR(255),
  error_message TEXT,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_recipient (recipient),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

---

## 4. Testing Mock Services

### Unit Tests

**tests/services/email.service.test.js**:
```javascript
import { describe, it, expect, beforeAll } from '@jest/globals';
import emailService from '../../services/email.service.js';

describe('Email Service (Mock)', () => {
  beforeAll(() => {
    process.env.USE_MOCK_SES = 'true';
  });

  it('should send email and log to database', async () => {
    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      bodyHtml: '<p>Test</p>',
      bodyText: 'Test'
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();

    // Verify database log
    const log = await db.emailLog.findByMessageId(result.messageId);
    expect(log.status).toBe('Sent');
    expect(log.recipient).toBe('test@example.com');
  });

  it('should simulate delivery after delay', async (done) => {
    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Delivery Test',
      bodyHtml: '<p>Test</p>',
      bodyText: 'Test'
    });

    // Wait 3 seconds for mock delivery
    setTimeout(async () => {
      const log = await db.emailLog.findByMessageId(result.messageId);
      expect(log.status).toBe('Delivered');
      done();
    }, 3000);
  });
});
```

**tests/services/sms.service.test.js**:
```javascript
import { describe, it, expect, beforeAll } from '@jest/globals';
import smsService from '../../services/sms.service.js';

describe('SMS Service (Mock)', () => {
  beforeAll(() => {
    process.env.USE_MOCK_TWILIO = 'true';
  });

  it('should send SMS and log to database', async () => {
    const result = await smsService.sendSms({
      to: '+12065551234',
      message: 'Test SMS'
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toMatch(/^mock_/);
  });

  it('should enforce 160 character limit', async () => {
    const longMessage = 'a'.repeat(161);

    await expect(
      smsService.sendSms({
        to: '+12065551234',
        message: longMessage
      })
    ).rejects.toThrow('exceeds 160 character limit');
  });

  it('should enforce rate limit (10/day)', async () => {
    // Send 10 SMS
    for (let i = 0; i < 10; i++) {
      await smsService.sendSms({
        to: '+12065551234',
        message: `Test ${i}`
      });
    }

    // 11th should fail
    await expect(
      smsService.sendSms({
        to: '+12065551234',
        message: 'Test 11'
      })
    ).rejects.toThrow('Daily SMS limit exceeded');
  });
});
```

---

## 5. Production Migration Strategy

### Configuration Changes Only

When AWS SES and Twilio accounts are ready:

**Step 1: Update .env**:
```bash
# Email
USE_MOCK_SES=false
AWS_REGION=us-west-2
SES_VERIFIED_DOMAIN=vividcg.com

# SMS
USE_MOCK_TWILIO=false
TWILIO_ACCOUNT_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxx
TWILIO_PHONE_NUMBER=+12065551234
```

**Step 2: AWS SES Setup** (outside code):
- Verify domain (vividcg.com)
- Configure DKIM, SPF, DMARC
- Request production access (exit sandbox)
- Configure SNS topic for bounce/complaint webhooks

**Step 3: Twilio Setup** (outside code):
- Create account and purchase phone number
- Configure messaging service
- Set webhook URL for delivery receipts

**Step 4: Deploy** - Code requires no changes, just restart services

---

## 6. Sprint 2 Acceptance Criteria

### DP01-274 (Email Service)
- ✅ LocalStack SES configured and running
- ✅ Emails "sent" via LocalStack endpoint
- ✅ All emails logged to database (EmailLog table)
- ✅ Mock delivery simulation (2 second delay)
- ✅ Admin UI displays all sent emails with status
- ✅ Console logs show email details for debugging
- ✅ Code is production-ready (flag-based switching)

### DP01-275 (SMS Service)
- ✅ Mock SMS service logs all messages to database
- ✅ Console logging shows SMS details
- ✅ 160 character limit enforced
- ✅ Rate limiting works (10 SMS/day/user)
- ✅ Mock delivery simulation (1 second delay)
- ✅ Admin UI displays all sent SMS
- ✅ Code is production-ready (flag-based switching)

---

## 7. Developer Experience

### Viewing Sent Emails (Development)

```bash
# Option 1: Admin UI
open http://localhost:3000/admin/emails

# Option 2: Database query
psql -d connect -c "SELECT * FROM email_log ORDER BY created_at DESC LIMIT 10;"

# Option 3: Console logs
docker-compose logs -f api | grep "MOCK EMAIL"
```

### Viewing Sent SMS (Development)

```bash
# Option 1: Admin UI
open http://localhost:3000/admin/sms

# Option 2: Database query
psql -d connect -c "SELECT * FROM sms_log ORDER BY created_at DESC LIMIT 10;"

# Option 3: Console logs
docker-compose logs -f api | grep "MOCK SMS"
```

---

## Summary

Mock services enable:
- ✅ Full notification system development without external dependencies
- ✅ Complete end-to-end testing in Sprint 2
- ✅ Production-ready code (flag-based switching)
- ✅ Zero blocking on AWS SES approval or Twilio account setup
- ✅ Developer-friendly debugging (console logs + admin UI)

**Future production migration = configuration change only.**

---

**Document Version**: 1.0
**Last Updated**: December 30, 2024
**Author**: Clay Campbell
**Related Tasks**: DP01-274, DP01-275, DP01-278
