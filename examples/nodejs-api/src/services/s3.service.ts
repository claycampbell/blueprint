/**
 * S3 Document Storage Service
 * Handles document upload, download, and management using AWS S3 (or LocalStack)
 */

import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, awsEnv } from '../config/aws';
import crypto from 'crypto';
import { Readable } from 'stream';

const BUCKET_NAME = awsEnv.s3BucketName;

// Type definitions
interface DocumentMetadata {
  projectId?: string;
  loanId?: string;
  type?: string;
  uploadedBy?: string;
  contentType?: string;
  [key: string]: string | undefined;
}

interface UploadResult {
  bucket: string;
  key: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface DocumentInfo {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
}

interface DocumentMetadataInfo {
  contentType?: string;
  contentLength?: number;
  lastModified?: Date;
  metadata?: Record<string, string>;
  etag?: string;
}

/**
 * Upload a document to S3
 * @param buffer - File content as buffer
 * @param fileName - Original file name
 * @param metadata - Additional metadata (projectId, type, uploadedBy, etc.)
 * @returns S3 storage details
 */
export async function uploadDocument(
  buffer: Buffer,
  fileName: string,
  metadata: DocumentMetadata = {}
): Promise<UploadResult> {
  try {
    // Generate unique key with timestamp and random hash
    const timestamp = Date.now();
    const hash = crypto.randomBytes(8).toString('hex');
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `documents/${timestamp}-${hash}-${sanitizedFileName}`;

    const params: PutObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: metadata.contentType || 'application/octet-stream',
      Metadata: {
        projectId: metadata.projectId || '',
        loanId: metadata.loanId || '',
        documentType: metadata.type || '',
        uploadedBy: metadata.uploadedBy || '',
        originalFileName: fileName,
      },
      // Add tags for organization
      Tagging: `project=${metadata.projectId || 'unknown'}&type=${metadata.type || 'general'}`,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    console.log('✅ Document uploaded to S3:', key);

    return {
      bucket: BUCKET_NAME,
      key: key,
      url: `s3://${BUCKET_NAME}/${key}`,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ S3 upload error:', error);
    throw new Error(`Failed to upload document to S3: ${(error as Error).message}`);
  }
}

/**
 * Generate a pre-signed URL for secure document download
 * @param key - S3 object key
 * @param expiresIn - URL expiration in seconds (default: 1 hour)
 * @returns Pre-signed URL
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    console.log('✅ Generated signed URL for:', key);

    return signedUrl;
  } catch (error) {
    console.error('❌ S3 signed URL error:', error);
    throw new Error(`Failed to generate signed URL: ${(error as Error).message}`);
  }
}

/**
 * Download document from S3
 * @param key - S3 object key
 * @returns File content as buffer
 */
export async function downloadDocument(key: string): Promise<Buffer> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response: GetObjectCommandOutput = await s3Client.send(command);

    // Convert stream to buffer
    if (!response.Body) {
      throw new Error('No document body returned from S3');
    }

    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    console.log('✅ Document downloaded from S3:', key);

    return buffer;
  } catch (error) {
    console.error('❌ S3 download error:', error);
    throw new Error(`Failed to download document from S3: ${(error as Error).message}`);
  }
}

/**
 * Delete document from S3
 * @param key - S3 object key
 */
export async function deleteDocument(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    console.log('✅ Document deleted from S3:', key);
  } catch (error) {
    console.error('❌ S3 delete error:', error);
    throw new Error(`Failed to delete document from S3: ${(error as Error).message}`);
  }
}

/**
 * Get document metadata
 * @param key - S3 object key
 * @returns Document metadata
 */
export async function getDocumentMetadata(key: string): Promise<DocumentMetadataInfo> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
      etag: response.ETag,
    };
  } catch (error) {
    console.error('❌ S3 metadata error:', error);
    throw new Error(`Failed to get document metadata: ${(error as Error).message}`);
  }
}

/**
 * List documents by prefix (e.g., all documents for a project)
 * @param prefix - S3 key prefix (e.g., 'documents/project-123/')
 * @param bucket - Optional bucket name (defaults to main bucket)
 * @returns List of document keys
 */
export async function listDocuments(
  prefix: string = 'documents/',
  bucket: string = BUCKET_NAME
): Promise<DocumentInfo[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: 100,
    });

    const response = await s3Client.send(command);

    const documents: DocumentInfo[] = (response.Contents || []).map((item) => ({
      key: item.Key || '',
      size: item.Size || 0,
      lastModified: item.LastModified || new Date(),
      etag: item.ETag || '',
    }));

    console.log(`✅ Listed ${documents.length} documents with prefix: ${prefix}`);

    return documents;
  } catch (error) {
    console.error('❌ S3 list error:', error);
    throw new Error(`Failed to list documents: ${(error as Error).message}`);
  }
}

/**
 * Move document to archive bucket (lifecycle management)
 * @param key - S3 object key
 */
export async function archiveDocument(key: string): Promise<void> {
  try {
    const archiveBucket = awsEnv.s3ArchiveBucket;
    const archiveKey = `archive/${key}`;

    // Copy to archive bucket
    const copyCommand = new CopyObjectCommand({
      CopySource: `${BUCKET_NAME}/${key}`,
      Bucket: archiveBucket,
      Key: archiveKey,
    });

    await s3Client.send(copyCommand);

    // Delete from main bucket
    await deleteDocument(key);

    console.log('✅ Document archived:', key, '→', archiveKey);
  } catch (error) {
    console.error('❌ Archive error:', error);
    throw new Error(`Failed to archive document: ${(error as Error).message}`);
  }
}

/**
 * Copy document to temporary bucket for processing
 * @param key - S3 object key
 * @returns Temporary bucket key
 */
export async function copyToTempBucket(key: string): Promise<string> {
  try {
    const tempBucket = awsEnv.s3TempBucket;
    const tempKey = `temp/${Date.now()}-${key.split('/').pop()}`;

    const copyCommand = new CopyObjectCommand({
      CopySource: `${BUCKET_NAME}/${key}`,
      Bucket: tempBucket,
      Key: tempKey,
    });

    await s3Client.send(copyCommand);

    console.log('✅ Document copied to temp bucket:', tempKey);

    return tempKey;
  } catch (error) {
    console.error('❌ Copy to temp error:', error);
    throw new Error(`Failed to copy document to temp bucket: ${(error as Error).message}`);
  }
}

export default {
  uploadDocument,
  getPresignedUrl,
  downloadDocument,
  deleteDocument,
  getDocumentMetadata,
  listDocuments,
  archiveDocument,
  copyToTempBucket,
};
