/**
 * Unit tests for S3 Service
 * Tests S3 operations with mocked AWS SDK
 */

import {
  uploadDocument,
  getPresignedUrl,
  downloadDocument,
  listDocuments,
  deleteDocument,
  archiveDocument
} from '../../../src/services/s3.service';
import { s3Client } from '../../../src/config/aws';
import { mockClient } from 'aws-sdk-client-mock';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand
} from '@aws-sdk/client-s3';

// Create S3 mock
const s3Mock = mockClient(s3Client as any);

describe('S3 Service Unit Tests', () => {

  beforeEach(() => {
    // Reset mocks before each test
    s3Mock.reset();
  });

  describe('uploadDocument', () => {
    it('should upload document to S3', async () => {
      s3Mock.on(PutObjectCommand).resolves({
        ETag: '"mock-etag"',
        VersionId: 'mock-version'
      });

      const buffer = Buffer.from('Test content');
      const fileName = 'test.txt';

      const result = await uploadDocument(buffer, fileName);

      expect(result).toHaveProperty('bucket');
      expect(result).toHaveProperty('key');
      expect(result.key).toContain(fileName);
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('size', buffer.length);
      expect(result).toHaveProperty('uploadedAt');
    });

    it('should generate unique keys for same filename', async () => {
      s3Mock.on(PutObjectCommand).resolves({ ETag: '"mock"' });

      const buffer = Buffer.from('Content');
      const result1 = await uploadDocument(buffer, 'duplicate.txt');
      const result2 = await uploadDocument(buffer, 'duplicate.txt');

      expect(result1.key).not.toBe(result2.key);
      expect(result1.key).toContain('duplicate.txt');
      expect(result2.key).toContain('duplicate.txt');
    });

    it('should include metadata when provided', async () => {
      let capturedMetadata: any;

      s3Mock.on(PutObjectCommand).callsFake((input) => {
        capturedMetadata = input.Metadata;
        return { ETag: '"mock"' };
      });

      const buffer = Buffer.from('Content');
      const metadata = {
        projectId: '123',
        type: 'contract'
      };

      await uploadDocument(buffer, 'contract.pdf', metadata);

      expect(capturedMetadata).toBeDefined();
      expect(capturedMetadata).toMatchObject(metadata);
    });

    it('should handle upload errors', async () => {
      s3Mock.on(PutObjectCommand).rejects(new Error('Upload failed'));

      const buffer = Buffer.from('Content');

      await expect(
        uploadDocument(buffer, 'fail.txt')
      ).rejects.toThrow('Upload failed');
    });

    it('should calculate correct file size', async () => {
      s3Mock.on(PutObjectCommand).resolves({ ETag: '"mock"' });

      const sizes = [100, 1000, 100000];

      for (const size of sizes) {
        const buffer = Buffer.alloc(size);
        const result = await uploadDocument(buffer, `file-${size}.bin`);
        expect(result.size).toBe(size);
      }
    });

    it('should handle empty files', async () => {
      s3Mock.on(PutObjectCommand).resolves({ ETag: '"mock"' });

      const emptyBuffer = Buffer.alloc(0);
      const result = await uploadDocument(emptyBuffer, 'empty.txt');

      expect(result.size).toBe(0);
    });

    it('should sanitize special characters in filename', async () => {
      s3Mock.on(PutObjectCommand).resolves({ ETag: '"mock"' });

      const buffer = Buffer.from('Content');
      const result = await uploadDocument(buffer, 'file with spaces & chars!.txt');

      expect(result.key).toBeDefined();
    });
  });

  describe('getPresignedUrl', () => {
    it('should generate presigned URL for download', async () => {
      const key = 'documents/test.txt';

      const url = await getPresignedUrl(key);

      expect(url).toBeDefined();
      expect(typeof url).toBe('string');
      expect(url.length).toBeGreaterThan(0);
    });

    it('should include expiration in URL', async () => {
      const key = 'documents/test.txt';
      const expiresIn = 3600; // 1 hour

      const url = await getPresignedUrl(key, expiresIn);

      expect(url).toContain('X-Amz-Expires');
    });

    it('should use default expiration when not specified', async () => {
      const key = 'documents/test.txt';

      const url = await getPresignedUrl(key);

      // Default should be 3600 seconds (1 hour)
      expect(url).toContain('X-Amz-Expires');
    });

    it('should handle different key formats', async () => {
      const keys = [
        'simple.txt',
        'path/to/file.txt',
        'deep/nested/path/file.pdf'
      ];

      for (const key of keys) {
        const url = await getPresignedUrl(key);
        expect(url).toBeDefined();
      }
    });

    it('should not throw for non-existent keys', async () => {
      // Presigned URL generation doesn't verify file exists
      const url = await getPresignedUrl('non-existent-file.txt');

      expect(url).toBeDefined();
    });
  });

  describe('downloadDocument', () => {
    it('should download document from S3', async () => {
      const mockContent = 'File content';
      const mockBody = {
        transformToByteArray: jest.fn().resolves(Buffer.from(mockContent))
      };

      s3Mock.on(GetObjectCommand).resolves({
        Body: mockBody as any,
        ContentLength: mockContent.length,
        LastModified: new Date()
      });

      const key = 'documents/test.txt';
      const result = await downloadDocument(key);

      expect(result.body.toString()).toBe(mockContent);
      expect(result.metadata).toHaveProperty('size');
    });

    it('should handle binary content', async () => {
      const binaryData = Buffer.from([0x00, 0x01, 0xFF, 0xFE]);
      const mockBody = {
        transformToByteArray: jest.fn().resolves(binaryData)
      };

      s3Mock.on(GetObjectCommand).resolves({
        Body: mockBody as any,
        ContentLength: binaryData.length
      });

      const result = await downloadDocument('binary.bin');

      expect(result.body).toEqual(binaryData);
    });

    it('should throw error when file not found', async () => {
      s3Mock.on(GetObjectCommand).rejects({
        name: 'NoSuchKey',
        message: 'The specified key does not exist'
      });

      await expect(
        downloadDocument('non-existent.txt')
      ).rejects.toThrow();
    });

    it('should include file metadata in response', async () => {
      const mockBody = {
        transformToByteArray: jest.fn().resolves(Buffer.from('Content'))
      };

      s3Mock.on(GetObjectCommand).resolves({
        Body: mockBody as any,
        ContentLength: 100,
        ContentType: 'text/plain',
        LastModified: new Date(),
        Metadata: { projectId: '123' }
      });

      const result = await downloadDocument('test.txt');

      expect(result.metadata.size).toBe(100);
      expect(result.metadata.contentType).toBe('text/plain');
    });

    it('should handle large files', async () => {
      const largeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB
      const mockBody = {
        transformToByteArray: jest.fn().resolves(largeBuffer)
      };

      s3Mock.on(GetObjectCommand).resolves({
        Body: mockBody as any,
        ContentLength: largeBuffer.length
      });

      const result = await downloadDocument('large.bin');

      expect(result.body.length).toBe(largeBuffer.length);
    });
  });

  describe('listDocuments', () => {
    it('should list all documents', async () => {
      s3Mock.on(ListObjectsV2Command).resolves({
        Contents: [
          { Key: 'file1.txt', Size: 100, LastModified: new Date() },
          { Key: 'file2.txt', Size: 200, LastModified: new Date() }
        ]
      });

      const result = await listDocuments();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', 'file1.txt');
      expect(result[1]).toHaveProperty('key', 'file2.txt');
    });

    it('should return empty array when no documents exist', async () => {
      s3Mock.on(ListObjectsV2Command).resolves({ Contents: [] });

      const result = await listDocuments();

      expect(result).toEqual([]);
    });

    it('should filter by prefix', async () => {
      let capturedPrefix: string | undefined;

      s3Mock.on(ListObjectsV2Command).callsFake((input) => {
        capturedPrefix = input.Prefix;
        return { Contents: [] };
      });

      await listDocuments('documents/project-123/');

      expect(capturedPrefix).toBe('documents/project-123/');
    });

    it('should respect maxKeys parameter', async () => {
      let capturedMaxKeys: number | undefined;

      s3Mock.on(ListObjectsV2Command).callsFake((input) => {
        capturedMaxKeys = input.MaxKeys;
        return { Contents: [] };
      });

      await listDocuments(undefined, 50);

      expect(capturedMaxKeys).toBe(50);
    });

    it('should handle pagination', async () => {
      s3Mock.on(ListObjectsV2Command).resolves({
        Contents: [
          { Key: 'file1.txt', Size: 100, LastModified: new Date() }
        ],
        IsTruncated: true,
        NextContinuationToken: 'token123'
      });

      const result = await listDocuments();

      expect(result).toHaveLength(1);
    });

    it('should handle missing optional fields', async () => {
      s3Mock.on(ListObjectsV2Command).resolves({
        Contents: [
          { Key: 'file.txt' } // Missing Size and LastModified
        ]
      });

      const result = await listDocuments();

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('file.txt');
    });
  });

  describe('deleteDocument', () => {
    it('should delete document from S3', async () => {
      s3Mock.on(DeleteObjectCommand).resolves({});

      await deleteDocument('documents/test.txt');

      expect(s3Mock.calls()).toHaveLength(1);
    });

    it('should not throw when deleting non-existent file', async () => {
      s3Mock.on(DeleteObjectCommand).resolves({});

      await expect(
        deleteDocument('non-existent.txt')
      ).resolves.not.toThrow();
    });

    it('should handle delete errors', async () => {
      s3Mock.on(DeleteObjectCommand).rejects(new Error('Permission denied'));

      await expect(
        deleteDocument('protected.txt')
      ).rejects.toThrow('Permission denied');
    });

    it('should delete with correct bucket and key', async () => {
      let capturedInput: any;

      s3Mock.on(DeleteObjectCommand).callsFake((input) => {
        capturedInput = input;
        return {};
      });

      const key = 'documents/important.pdf';
      await deleteDocument(key);

      expect(capturedInput.Key).toBe(key);
      expect(capturedInput.Bucket).toBeDefined();
    });
  });

  describe('archiveDocument', () => {
    it('should copy document to archive and delete original', async () => {
      const originalKey = 'documents/test.txt';
      const mockBody = {
        transformToByteArray: jest.fn().resolves(Buffer.from('Content'))
      };

      // Mock download
      s3Mock.on(GetObjectCommand).resolves({
        Body: mockBody as any,
        ContentLength: 7
      });

      // Mock upload to archive
      s3Mock.on(PutObjectCommand).resolves({ ETag: '"mock"' });

      // Mock delete original
      s3Mock.on(DeleteObjectCommand).resolves({});

      const result = await archiveDocument(originalKey);

      expect(result.originalKey).toBe(originalKey);
      expect(result.archiveKey).toContain('archive/');
      expect(result.archiveKey).toContain('test.txt');
    });

    it('should preserve file content when archiving', async () => {
      const content = 'Important data';
      const mockBody = {
        transformToByteArray: jest.fn().resolves(Buffer.from(content))
      };

      let uploadedContent: Buffer | undefined;

      s3Mock.on(GetObjectCommand).resolves({
        Body: mockBody as any,
        ContentLength: content.length
      });

      s3Mock.on(PutObjectCommand).callsFake((input) => {
        uploadedContent = input.Body as Buffer;
        return { ETag: '"mock"' };
      });

      s3Mock.on(DeleteObjectCommand).resolves({});

      await archiveDocument('documents/preserve.txt');

      expect(uploadedContent?.toString()).toBe(content);
    });

    it('should throw error when archiving non-existent file', async () => {
      s3Mock.on(GetObjectCommand).rejects({
        name: 'NoSuchKey',
        message: 'File not found'
      });

      await expect(
        archiveDocument('non-existent.txt')
      ).rejects.toThrow();
    });

    it('should handle archive path construction', async () => {
      const mockBody = {
        transformToByteArray: jest.fn().resolves(Buffer.from('Content'))
      };

      s3Mock.on(GetObjectCommand).resolves({
        Body: mockBody as any,
        ContentLength: 7
      });

      s3Mock.on(PutObjectCommand).resolves({ ETag: '"mock"' });
      s3Mock.on(DeleteObjectCommand).resolves({});

      const testCases = [
        { input: 'file.txt', expected: 'archive/' },
        { input: 'path/file.txt', expected: 'archive/' },
        { input: 'deep/nested/file.txt', expected: 'archive/' }
      ];

      for (const testCase of testCases) {
        const result = await archiveDocument(testCase.input);
        expect(result.archiveKey).toContain(testCase.expected);
      }
    });

    it('should rollback if archive upload fails', async () => {
      const mockBody = {
        transformToByteArray: jest.fn().resolves(Buffer.from('Content'))
      };

      s3Mock.on(GetObjectCommand).resolves({
        Body: mockBody as any,
        ContentLength: 7
      });

      s3Mock.on(PutObjectCommand).rejects(new Error('Upload failed'));

      await expect(
        archiveDocument('documents/fail.txt')
      ).rejects.toThrow('Upload failed');

      // Original should NOT be deleted
      const deleteCalls = s3Mock.commandCalls(DeleteObjectCommand);
      expect(deleteCalls).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      s3Mock.on(PutObjectCommand).rejects(new Error('Network timeout'));

      await expect(
        uploadDocument(Buffer.from('test'), 'test.txt')
      ).rejects.toThrow('Network timeout');
    });

    it('should handle permission errors', async () => {
      s3Mock.on(GetObjectCommand).rejects({
        name: 'AccessDenied',
        message: 'Access Denied'
      });

      await expect(
        downloadDocument('protected.txt')
      ).rejects.toThrow();
    });

    it('should handle invalid bucket configuration', async () => {
      s3Mock.on(PutObjectCommand).rejects({
        name: 'NoSuchBucket',
        message: 'The specified bucket does not exist'
      });

      await expect(
        uploadDocument(Buffer.from('test'), 'test.txt')
      ).rejects.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long filenames', async () => {
      s3Mock.on(PutObjectCommand).resolves({ ETag: '"mock"' });

      const longName = 'a'.repeat(200) + '.txt';
      const buffer = Buffer.from('Content');

      const result = await uploadDocument(buffer, longName);

      expect(result.key).toBeDefined();
    });

    it('should handle filenames with unicode characters', async () => {
      s3Mock.on(PutObjectCommand).resolves({ ETag: '"mock"' });

      const unicodeName = '文件名.txt';
      const buffer = Buffer.from('Content');

      const result = await uploadDocument(buffer, unicodeName);

      expect(result.key).toBeDefined();
    });

    it('should handle concurrent operations', async () => {
      s3Mock.on(PutObjectCommand).resolves({ ETag: '"mock"' });

      const promises = Array.from({ length: 10 }, (_, i) =>
        uploadDocument(Buffer.from(`Content ${i}`), `file-${i}.txt`)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach((result, i) => {
        expect(result.key).toContain(`file-${i}.txt`);
      });
    });
  });
});
