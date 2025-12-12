# Connect 2.0 API - Sample Implementation

This is a **sample Node.js API** demonstrating LocalStack integration for the Connect 2.0 platform.

## Features Demonstrated

✅ **AWS S3 Integration** - Document upload/download with LocalStack
✅ **SQS Queue Processing** - Async message handling
✅ **PostgreSQL Database** - Complete CRUD operations
✅ **RESTful API Design** - Project and document management
✅ **File Upload** - Multer + S3 storage
✅ **Pre-signed URLs** - Secure document access

## Quick Start

### 1. Install Dependencies

```bash
cd examples/nodejs-api
npm install
```

### 2. Start Infrastructure

From the project root:
```bash
docker-compose up -d
```

### 3. Configure Environment

Create `.env` file:
```bash
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://connect_user:connect_dev_password@localhost:5432/connect2_dev

# AWS LocalStack
AWS_ENDPOINT_URL=http://localhost:4566
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_BUCKET_NAME=connect2-documents-dev
DOCUMENT_QUEUE_URL=http://localhost:4566/000000000000/connect2-document-processing
```

### 4. Run the API

```bash
npm run dev
```

API will start on http://localhost:3000

## API Endpoints

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/projects` | List all projects |
| `GET` | `/api/v1/projects/:id` | Get project by ID |
| `POST` | `/api/v1/projects` | Create new project |
| `PATCH` | `/api/v1/projects/:id` | Update project |
| `POST` | `/api/v1/projects/:id/transition` | Change project status |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/projects/:id/documents` | Upload document (multipart/form-data) |
| `GET` | `/api/v1/projects/:id/documents` | List project documents |
| `GET` | `/api/v1/projects/:id/documents/:docId/download` | Get download URL |

## Usage Examples

### Create a Project

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "address": "456 Test Ave",
    "city": "Seattle",
    "state": "WA",
    "zip": "98103",
    "purchasePrice": 600000,
    "listPrice": 650000
  }'
```

### Upload a Document

```bash
curl -X POST http://localhost:3000/api/v1/projects/<PROJECT_ID>/documents \
  -F "file=@/path/to/document.pdf" \
  -F "type=SURVEY" \
  -F "description=Property survey"
```

### List Projects

```bash
curl http://localhost:3000/api/v1/projects
```

### Transition Project Status

```bash
curl -X POST http://localhost:3000/api/v1/projects/<PROJECT_ID>/transition \
  -H "Content-Type: application/json" \
  -d '{
    "status": "FEASIBILITY",
    "notes": "Moving to feasibility based on initial review"
  }'
```

## Testing LocalStack Integration

### Verify S3 Upload

After uploading a document via API:

```bash
# List S3 buckets
awslocal s3 ls

# List files in documents bucket
awslocal s3 ls s3://connect2-documents-dev/documents/

# Download a file
awslocal s3 cp s3://connect2-documents-dev/documents/<key> ./downloaded-file.pdf
```

### Check Queue Messages

```bash
# Get queue stats
awslocal sqs get-queue-attributes \
  --queue-url http://localhost:4566/000000000000/connect2-document-processing \
  --attribute-names ApproximateNumberOfMessages

# Receive messages
awslocal sqs receive-message \
  --queue-url http://localhost:4566/000000000000/connect2-document-processing
```

## Project Structure

```
examples/nodejs-api/
├── src/
│   ├── config/
│   │   ├── aws.js              # AWS SDK configuration
│   │   └── database.js         # PostgreSQL connection
│   ├── services/
│   │   ├── s3Service.js        # S3 document operations
│   │   └── queueService.js     # SQS message handling
│   ├── routes/
│   │   └── projectRoutes.js    # Project API endpoints
│   └── index.js                # Express app entry point
├── package.json
└── README.md
```

## Key Code Highlights

### AWS SDK Configuration

See `src/config/aws.js` - automatically detects LocalStack vs real AWS:

```javascript
const isLocal = !!process.env.AWS_ENDPOINT_URL;

if (isLocal) {
  config.endpoint = process.env.AWS_ENDPOINT_URL;
  config.forcePathStyle = true; // Required for LocalStack S3
}
```

### S3 Document Upload

See `src/services/s3Service.js`:

```javascript
export async function uploadDocument(fileBuffer, fileName, metadata) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    Metadata: metadata,
  });

  await s3Client.send(command);
}
```

### Queue Processing

See `src/services/queueService.js`:

```javascript
export async function processQueue(handler) {
  // Long polling for messages
  const command = new ReceiveMessageCommand({
    QueueUrl: QUEUE_URL,
    WaitTimeSeconds: 20,
  });

  // Process and delete on success
}
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | API server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `AWS_ENDPOINT_URL` | LocalStack endpoint (local only) | `http://localhost:4566` |
| `AWS_REGION` | AWS region | `us-west-2` |
| `AWS_ACCESS_KEY_ID` | AWS credentials (use "test" for LocalStack) | `test` |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials (use "test" for LocalStack) | `test` |
| `S3_BUCKET_NAME` | S3 bucket for documents | `connect2-documents-dev` |
| `DOCUMENT_QUEUE_URL` | SQS queue URL | `http://localhost:4566/000000000000/connect2-document-processing` |

## Production Deployment

To deploy to real AWS, simply remove the LocalStack-specific environment variables:

```bash
# Remove these for production:
# AWS_ENDPOINT_URL=...

# Use real AWS credentials:
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_REGION=us-west-2

# Use real S3 bucket:
S3_BUCKET_NAME=connect2-documents-prod

# Use real SQS queue URL:
DOCUMENT_QUEUE_URL=https://sqs.us-west-2.amazonaws.com/...
```

The code works identically with zero changes!

## Next Steps

1. **Add Authentication** - Implement JWT auth middleware
2. **Add Validation** - Use Joi for request validation
3. **Add Tests** - Write unit and integration tests
4. **Add More Endpoints** - Loans, draws, tasks, etc.
5. **Add Worker Process** - Separate worker for queue processing
6. **Add Error Handling** - Centralized error middleware

## Resources

- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js PostgreSQL Tutorial](https://node-postgres.com/)

---

**This is example code for demonstration purposes. Production code should include:**
- Comprehensive error handling
- Input validation
- Authentication & authorization
- Rate limiting
- Logging & monitoring
- Security best practices
