/**
 * AWS SDK Configuration for LocalStack
 * This file configures AWS SDK clients to work with both LocalStack (local dev) and real AWS (production)
 */

import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import { SNSClient, SNSClientConfig } from '@aws-sdk/client-sns';
import { SecretsManagerClient, SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager';

// Determine if we're using LocalStack
const isLocal = !!process.env.AWS_ENDPOINT_URL;

// AWS configuration type
interface AWSConfig {
  region: string;
  endpoint?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  forcePathStyle?: boolean;
}

// Environment configuration type
interface AWSEnvironment {
  isLocal: boolean;
  s3BucketName: string;
  s3ArchiveBucket: string;
  s3TempBucket: string;
  documentQueueUrl: string;
  notificationQueueUrl: string;
  projectTopicArn: string;
}

/**
 * Get AWS configuration based on environment
 * @returns AWS SDK configuration object
 */
const getAwsConfig = (): AWSConfig => {
  const config: AWSConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
  };

  // LocalStack-specific configuration
  if (isLocal) {
    console.log('🔧 Using LocalStack endpoint:', process.env.AWS_ENDPOINT_URL);
    config.endpoint = process.env.AWS_ENDPOINT_URL;
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    };
    // Required for LocalStack S3 compatibility
    config.forcePathStyle = true;
  }

  return config;
};

// Initialize AWS clients
const awsConfig = getAwsConfig();

// S3 Client for document storage
export const s3Client = new S3Client(awsConfig as S3ClientConfig);

// SQS Client for message queues
export const sqsClient = new SQSClient(awsConfig as SQSClientConfig);

// SNS Client for notifications
export const snsClient = new SNSClient(awsConfig as SNSClientConfig);

// Secrets Manager Client for secure credentials
export const secretsClient = new SecretsManagerClient(awsConfig as SecretsManagerClientConfig);

// Environment-specific configuration
export const awsEnv: AWSEnvironment = {
  isLocal,
  s3BucketName: process.env.S3_BUCKET_NAME || 'connect2-documents-dev',
  s3ArchiveBucket: process.env.S3_ARCHIVE_BUCKET || 'connect2-documents-archive',
  s3TempBucket: process.env.S3_TEMP_BUCKET || 'connect2-temp',
  documentQueueUrl: process.env.DOCUMENT_QUEUE_URL ||
    'http://localhost:4566/000000000000/connect2-document-processing',
  notificationQueueUrl: process.env.NOTIFICATION_QUEUE_URL ||
    'http://localhost:4566/000000000000/connect2-notifications',
  projectTopicArn: process.env.PROJECT_TOPIC_ARN ||
    'arn:aws:sns:us-east-1:000000000000:connect2-project-events',
};

console.log('✅ AWS SDK configured:', {
  mode: isLocal ? 'LocalStack (local)' : 'AWS (production)',
  region: awsConfig.region,
  bucket: awsEnv.s3BucketName,
  archiveBucket: awsEnv.s3ArchiveBucket,
  tempBucket: awsEnv.s3TempBucket,
});

export default {
  s3Client,
  sqsClient,
  snsClient,
  secretsClient,
  awsEnv,
};
