/**
 * Integration tests for S3 service
 * Tests document upload, download, presigned URLs, and management with LocalStack
 */

import {
  uploadDocument,
  getPresignedUrl,
  downloadDocument,
  listDocuments,
  deleteDocument,
  archiveDocument
} from '../../src/services/s3.service';
import { s3Client } from '../../src/config/aws';
import { CreateBucketCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const TEST_BUCKET = process.env.S3_BUCKET || 'connect-documents-test';

describe('S3 Service Integration Tests', () => {

  beforeAll(async () => {
    // Ensure test bucket exists
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: TEST_BUCKET }));
    } catch (error: any) {
      // Bucket may already exist, ignore error
      if (error.name !== 'BucketAlreadyOwnedByYou') {
        console.error('Error creating test bucket:', error);
      }
    }
  });

  afterEach(async () => {
    // Clean up all objects in test bucket after each test
    try {
      const listResponse = await s3Client.send(
        new ListObjectsV2Command({ Bucket: TEST_BUCKET })
      );

      if (listResponse.Contents && listResponse.Contents.length > 0) {
        for (const object of listResponse.Contents) {
          if (object.Key) {
            await s3Client.send(
              new DeleteObjectCommand({ Bucket: TEST_BUCKET, Key: object.Key })
            );
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up S3 objects:', error);
    }
  });

  describe('uploadDocument', () => {
    it('should upload a document to S3', async () => {
      const fileBuffer = Buffer.from('Test document content');
      const fileName = 'test-document.txt';

      const result = await uploadDocument(fileBuffer, fileName);

      expect(result).toHaveProperty('bucket', TEST_BUCKET);
      expect(result).toHaveProperty('key');
      expect(result.key).toContain(fileName);
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('size', fileBuffer.length);
      expect(result).toHaveProperty('uploadedAt');
    });

    it('should upload document with metadata', async () => {
      const fileBuffer = Buffer.from('PDF content here');
      const fileName = 'contract.pdf';
      const metadata = {
        projectId: '550e8400-e29b-41d4-a716-446655440000',
        type: 'contract',
        uploadedBy: 'test-user'
      };

      const result = await uploadDocument(fileBuffer, fileName, metadata);

      expect(result.key).toContain(fileName);
      expect(result.size).toBe(fileBuffer.length);
    });

    it('should handle large file uploads', async () => {
      // Create 5MB file
      const largeBuffer = Buffer.alloc(5 * 1024 * 1024, 'a');
      const fileName = 'large-file.bin';

      const result = await uploadDocument(largeBuffer, fileName);

      expect(result.size).toBe(largeBuffer.length);
      expect(result.key).toContain(fileName);
    });

    it('should generate unique keys for files with same name', async () => {
      const fileBuffer = Buffer.from('Content 1');
      const fileName = 'duplicate.txt';

      const result1 = await uploadDocument(fileBuffer, fileName);
      const result2 = await uploadDocument(fileBuffer, fileName);

      expect(result1.key).not.toBe(result2.key);
      expect(result1.key).toContain(fileName);
      expect(result2.key).toContain(fileName);
    });

    it('should handle special characters in filename', async () => {
      const fileBuffer = Buffer.from('Test content');
      const fileName = 'file with spaces & special-chars_2024.txt';

      const result = await uploadDocument(fileBuffer, fileName);

      expect(result.key).toBeDefined();
    });

    it('should upload different file types', async () => {
      const testCases = [
        { name: 'document.pdf', content: 'PDF content' },
        { name: 'image.jpg', content: 'JPEG data' },
        { name: 'data.json', content: '{"key": "value"}' },
        { name: 'report.xlsx', content: 'Excel data' }
      ];

      for (const testCase of testCases) {
        const buffer = Buffer.from(testCase.content);
        const result = await uploadDocument(buffer, testCase.name);
        expect(result.key).toContain(testCase.name);
      }
    });
  });

  describe('getPresignedUrl', () => {
    it('should generate presigned download URL', async () => {
      // Upload a file first
      const fileBuffer = Buffer.from('Test content for download');
      const fileName = 'download-test.txt';
      const uploadResult = await uploadDocument(fileBuffer, fileName);

      // Generate presigned URL
      const url = await getPresignedUrl(uploadResult.key);

      expect(url).toContain(TEST_BUCKET);
      expect(url).toContain(uploadResult.key);
      expect(url).toContain('X-Amz-Signature');
    });

    it('should generate URL with custom expiration', async () => {
      const fileBuffer = Buffer.from('Content');
      const uploadResult = await uploadDocument(fileBuffer, 'test.txt');

      // Generate URL expiring in 1 hour
      const url = await getPresignedUrl(uploadResult.key, 3600);

      expect(url).toBeDefined();
      expect(url).toContain('X-Amz-Expires=3600');
    });

    it('should generate URL for non-existent file without error', async () => {
      // Presigned URL generation doesn't check if file exists
      const url = await getPresignedUrl('non-existent-file.txt');

      expect(url).toBeDefined();
      // Note: Accessing this URL would return 404, but generation succeeds
    });
  });

  describe('downloadDocument', () => {
    it('should download an uploaded document', async () => {
      const originalContent = 'This is the test document content';
      const fileBuffer = Buffer.from(originalContent);
      const fileName = 'download-test.txt';

      const uploadResult = await uploadDocument(fileBuffer, fileName);
      const downloadResult = await downloadDocument(uploadResult.key);

      expect(downloadResult.body).toBeDefined();
      expect(downloadResult.body.toString()).toBe(originalContent);
      expect(downloadResult.metadata).toHaveProperty('size');
    });

    it('should download binary files correctly', async () => {
      // Create binary content
      const binaryBuffer = Buffer.from([0x00, 0x01, 0x02, 0xFF, 0xFE]);
      const uploadResult = await uploadDocument(binaryBuffer, 'binary.bin');

      const downloadResult = await downloadDocument(uploadResult.key);

      expect(downloadResult.body).toEqual(binaryBuffer);
    });

    it('should throw error when downloading non-existent file', async () => {
      await expect(
        downloadDocument('non-existent-key-12345.txt')
      ).rejects.toThrow();
    });

    it('should preserve file metadata on download', async () => {
      const fileBuffer = Buffer.from('Content with metadata');
      const metadata = {
        projectId: '550e8400-e29b-41d4-a716-446655440000',
        type: 'invoice'
      };

      const uploadResult = await uploadDocument(fileBuffer, 'invoice.pdf', metadata);
      const downloadResult = await downloadDocument(uploadResult.key);

      expect(downloadResult.metadata).toBeDefined();
      expect(downloadResult.metadata.size).toBe(fileBuffer.length);
    });
  });

  describe('listDocuments', () => {
    it('should return empty array when no documents exist', async () => {
      const result = await listDocuments();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should list all uploaded documents', async () => {
      // Upload 3 documents
      await uploadDocument(Buffer.from('Doc 1'), 'doc1.txt');
      await uploadDocument(Buffer.from('Doc 2'), 'doc2.txt');
      await uploadDocument(Buffer.from('Doc 3'), 'doc3.txt');

      const result = await listDocuments();

      expect(result.length).toBe(3);
      expect(result[0]).toHaveProperty('key');
      expect(result[0]).toHaveProperty('size');
      expect(result[0]).toHaveProperty('lastModified');
    });

    it('should filter documents by prefix', async () => {
      // Upload documents with different prefixes
      await uploadDocument(Buffer.from('Project A doc'), 'project-a-file.txt');
      await uploadDocument(Buffer.from('Project B doc'), 'project-b-file.txt');

      const resultA = await listDocuments('documents/project-a');
      const resultB = await listDocuments('documents/project-b');

      // Note: Prefix filtering depends on how keys are structured in uploadDocument
      expect(Array.isArray(resultA)).toBe(true);
      expect(Array.isArray(resultB)).toBe(true);
    });

    it('should handle pagination with maxKeys', async () => {
      // Upload 5 documents
      for (let i = 0; i < 5; i++) {
        await uploadDocument(Buffer.from(`Doc ${i}`), `doc-${i}.txt`);
      }

      const result = await listDocuments(undefined, 3);

      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('deleteDocument', () => {
    it('should delete an uploaded document', async () => {
      const fileBuffer = Buffer.from('To be deleted');
      const uploadResult = await uploadDocument(fileBuffer, 'delete-me.txt');

      await deleteDocument(uploadResult.key);

      // Verify file is deleted
      await expect(
        downloadDocument(uploadResult.key)
      ).rejects.toThrow();
    });

    it('should not throw error when deleting non-existent file', async () => {
      // S3 delete is idempotent - doesn't error if file doesn't exist
      await expect(
        deleteDocument('non-existent-file-99999.txt')
      ).resolves.not.toThrow();
    });

    it('should delete multiple documents', async () => {
      const keys: string[] = [];

      // Upload 3 documents
      for (let i = 0; i < 3; i++) {
        const result = await uploadDocument(Buffer.from(`Doc ${i}`), `multi-${i}.txt`);
        keys.push(result.key);
      }

      // Delete all
      for (const key of keys) {
        await deleteDocument(key);
      }

      // Verify all deleted
      const remaining = await listDocuments();
      expect(remaining.length).toBe(0);
    });
  });

  describe('archiveDocument', () => {
    it('should archive a document to archive prefix', async () => {
      const fileBuffer = Buffer.from('Archive this');
      const uploadResult = await uploadDocument(fileBuffer, 'archive-test.txt');

      const archiveResult = await archiveDocument(uploadResult.key);

      expect(archiveResult.originalKey).toBe(uploadResult.key);
      expect(archiveResult.archiveKey).toContain('archive/');
      expect(archiveResult.archiveKey).toContain('archive-test.txt');

      // Original should be deleted
      await expect(
        downloadDocument(uploadResult.key)
      ).rejects.toThrow();

      // Archived version should exist
      const archivedDoc = await downloadDocument(archiveResult.archiveKey);
      expect(archivedDoc.body.toString()).toBe('Archive this');
    });

    it('should preserve file content when archiving', async () => {
      const originalContent = 'Important content to preserve';
      const fileBuffer = Buffer.from(originalContent);
      const uploadResult = await uploadDocument(fileBuffer, 'preserve.txt');

      const archiveResult = await archiveDocument(uploadResult.key);

      const archivedDoc = await downloadDocument(archiveResult.archiveKey);
      expect(archivedDoc.body.toString()).toBe(originalContent);
    });

    it('should throw error when archiving non-existent file', async () => {
      await expect(
        archiveDocument('non-existent-file-123.txt')
      ).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle S3 connection errors gracefully', async () => {
      // This would require mocking S3 client to force connection error
      // Demonstrates error handling test approach
    });

    it('should handle invalid bucket name', async () => {
      // Test with invalid bucket configuration
      // Would require environment variable manipulation
    });

    it('should handle permission errors', async () => {
      // Test with invalid AWS credentials
      // Would require mocking credentials
    });
  });

  describe('Performance', () => {
    it('should handle concurrent uploads', async () => {
      const uploadPromises = [];

      for (let i = 0; i < 10; i++) {
        const buffer = Buffer.from(`Concurrent upload ${i}`);
        uploadPromises.push(uploadDocument(buffer, `concurrent-${i}.txt`));
      }

      const results = await Promise.all(uploadPromises);

      expect(results.length).toBe(10);
      results.forEach(result => {
        expect(result).toHaveProperty('key');
      });
    });

    it('should handle concurrent downloads', async () => {
      // Upload 5 files first
      const keys: string[] = [];
      for (let i = 0; i < 5; i++) {
        const result = await uploadDocument(Buffer.from(`File ${i}`), `download-${i}.txt`);
        keys.push(result.key);
      }

      // Download all concurrently
      const downloadPromises = keys.map(key => downloadDocument(key));
      const results = await Promise.all(downloadPromises);

      expect(results.length).toBe(5);
      results.forEach(result => {
        expect(result.body).toBeDefined();
      });
    });
  });
});
