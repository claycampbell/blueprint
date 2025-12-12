/**
 * AWS SDK Configuration for LocalStack
 * This file configures AWS SDK clients to work with both LocalStack (local dev) and real AWS (production)
 */

import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SNSClient } from '@aws-sdk/client-sns';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

// Determine if we're using LocalStack
const isLocal = !!process.env.AWS_ENDPOINT_URL;

// Base AWS configuration
const getAwsConfig = () => {
  const config = {
    region: process.env.AWS_REGION || 'us-west-2',
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

export const s3Client = new S3Client(awsConfig);
export const sqsClient = new SQSClient(awsConfig);
export const snsClient = new SNSClient(awsConfig);
export const secretsClient = new SecretsManagerClient(awsConfig);

// Environment-specific configuration
export const awsEnv = {
  isLocal,
  s3BucketName: process.env.S3_BUCKET_NAME || 'connect2-documents-dev',
  documentQueueUrl: process.env.DOCUMENT_QUEUE_URL ||
    'http://localhost:4566/000000000000/connect2-document-processing',
  projectTopicArn: process.env.PROJECT_TOPIC_ARN ||
    'arn:aws:sns:us-west-2:000000000000:connect2-project-events',
};

console.log('✅ AWS SDK configured:', {
  mode: isLocal ? 'LocalStack (local)' : 'AWS (production)',
  region: awsConfig.region,
  bucket: awsEnv.s3BucketName,
});
