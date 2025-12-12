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
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, awsEnv } from '../config/aws.js';
import crypto from 'crypto';

const BUCKET_NAME = awsEnv.s3BucketName;

/**
 * Upload a document to S3
 * @param {Buffer} fileBuffer - File content as buffer
 * @param {string} fileName - Original file name
 * @param {Object} metadata - Additional metadata (projectId, type, uploadedBy, etc.)
 * @returns {Promise<Object>} - S3 storage details
 */
export async function uploadDocument(fileBuffer, fileName, metadata = {}) {
  try {
    // Generate unique key with timestamp and random hash
    const timestamp = Date.now();
    const hash = crypto.randomBytes(8).toString('hex');
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `documents/${timestamp}-${hash}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
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
    });

    await s3Client.send(command);

    console.log('✅ Document uploaded to S3:', key);

    return {
      bucket: BUCKET_NAME,
      key: key,
      url: `s3://${BUCKET_NAME}/${key}`,
      size: fileBuffer.length,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ S3 upload error:', error);
    throw new Error(`Failed to upload document to S3: ${error.message}`);
  }
}

/**
 * Generate a pre-signed URL for secure document download
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration in seconds (default: 1 hour)
 * @returns {Promise<string>} - Pre-signed URL
 */
export async function getDocumentSignedUrl(key, expiresIn = 3600) {
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
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}

/**
 * Download document from S3
 * @param {string} key - S3 object key
 * @returns {Promise<Buffer>} - File content as buffer
 */
export async function downloadDocument(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    console.log('✅ Document downloaded from S3:', key);

    return buffer;
  } catch (error) {
    console.error('❌ S3 download error:', error);
    throw new Error(`Failed to download document from S3: ${error.message}`);
  }
}

/**
 * Delete document from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
export async function deleteDocument(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    console.log('✅ Document deleted from S3:', key);
  } catch (error) {
    console.error('❌ S3 delete error:', error);
    throw new Error(`Failed to delete document from S3: ${error.message}`);
  }
}

/**
 * Get document metadata
 * @param {string} key - S3 object key
 * @returns {Promise<Object>} - Document metadata
 */
export async function getDocumentMetadata(key) {
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
    throw new Error(`Failed to get document metadata: ${error.message}`);
  }
}

/**
 * List documents by prefix (e.g., all documents for a project)
 * @param {string} prefix - S3 key prefix (e.g., 'documents/project-123/')
 * @returns {Promise<Array>} - List of document keys
 */
export async function listDocuments(prefix = 'documents/') {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 100,
    });

    const response = await s3Client.send(command);

    const documents = (response.Contents || []).map((item) => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      etag: item.ETag,
    }));

    console.log(`✅ Listed ${documents.length} documents with prefix: ${prefix}`);

    return documents;
  } catch (error) {
    console.error('❌ S3 list error:', error);
    throw new Error(`Failed to list documents: ${error.message}`);
  }
}

/**
 * Move document to archive bucket (lifecycle management)
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
export async function archiveDocument(key) {
  try {
    // Download from main bucket
    const buffer = await downloadDocument(key);

    // Upload to archive bucket
    const archiveBucket = 'connect2-documents-archive';
    const archiveKey = `archive/${key}`;

    const command = new PutObjectCommand({
      Bucket: archiveBucket,
      Key: archiveKey,
      Body: buffer,
    });

    await s3Client.send(command);

    // Delete from main bucket
    await deleteDocument(key);

    console.log('✅ Document archived:', key, '→', archiveKey);
  } catch (error) {
    console.error('❌ Archive error:', error);
    throw new Error(`Failed to archive document: ${error.message}`);
  }
}
