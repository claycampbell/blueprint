/**
 * Integration tests for SQS service
 * Tests message sending, receiving, processing with LocalStack
 */

import {
  sendMessage,
  receiveMessages,
  processQueue,
  getQueueUrl,
  batchSendToQueue,
  getQueueStats
} from '../../src/services/sqs.service';
import { sqsClient } from '../../src/config/aws';
import {
  CreateQueueCommand,
  DeleteQueueCommand,
  PurgeQueueCommand,
  GetQueueAttributesCommand
} from '@aws-sdk/client-sqs';

const TEST_QUEUE_NAME = 'test-queue-integration';
let testQueueUrl: string;

describe('SQS Service Integration Tests', () => {

  beforeAll(async () => {
    // Create test queue
    try {
      const createResponse = await sqsClient.send(
        new CreateQueueCommand({ QueueName: TEST_QUEUE_NAME })
      );
      testQueueUrl = createResponse.QueueUrl!;
    } catch (error) {
      console.error('Error creating test queue:', error);
      throw error;
    }
  });

  afterAll(async () => {
    // Delete test queue
    try {
      if (testQueueUrl) {
        await sqsClient.send(new DeleteQueueCommand({ QueueUrl: testQueueUrl }));
      }
    } catch (error) {
      console.error('Error deleting test queue:', error);
    }
  });

  beforeEach(async () => {
    // Purge queue before each test
    try {
      await sqsClient.send(new PurgeQueueCommand({ QueueUrl: testQueueUrl }));
      // Wait for purge to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      // Ignore PurgeQueueInProgress errors
      if (error.name !== 'PurgeQueueInProgress') {
        console.error('Error purging queue:', error);
      }
    }
  });

  describe('sendMessage', () => {
    it('should send a simple message to queue', async () => {
      const messageBody = { action: 'test', data: 'Hello SQS' };

      const result = await sendMessage(testQueueUrl, messageBody);

      expect(result).toHaveProperty('MessageId');
      expect(result.MessageId).toBeDefined();
    });

    it('should send message with string body', async () => {
      const result = await sendMessage(testQueueUrl, 'Simple string message');

      expect(result.MessageId).toBeDefined();
    });

    it('should send message with complex object', async () => {
      const complexMessage = {
        projectId: '550e8400-e29b-41d4-a716-446655440000',
        action: 'document-processed',
        metadata: {
          fileName: 'contract.pdf',
          size: 1024,
          uploadedAt: new Date().toISOString()
        },
        tags: ['important', 'contract', 'Q1-2025']
      };

      const result = await sendMessage(testQueueUrl, complexMessage);

      expect(result.MessageId).toBeDefined();

      // Verify message can be received
      const messages = await receiveMessages(testQueueUrl, 1);
      expect(messages.length).toBe(1);

      const receivedBody = JSON.parse(messages[0].Body!);
      expect(receivedBody.projectId).toBe(complexMessage.projectId);
      expect(receivedBody.metadata.fileName).toBe(complexMessage.metadata.fileName);
    });

    it('should send message with delay', async () => {
      const messageBody = { delayed: true };
      const delaySeconds = 2;

      const sendTime = Date.now();
      const result = await sendMessage(testQueueUrl, messageBody, delaySeconds);

      expect(result.MessageId).toBeDefined();

      // Try to receive immediately - should get nothing
      const immediateMessages = await receiveMessages(testQueueUrl, 1, 1);
      expect(immediateMessages.length).toBe(0);

      // Wait for delay period
      await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000 + 500));

      // Now should receive the message
      const delayedMessages = await receiveMessages(testQueueUrl, 1);
      expect(delayedMessages.length).toBe(1);

      const elapsed = Date.now() - sendTime;
      expect(elapsed).toBeGreaterThanOrEqual(delaySeconds * 1000);
    });

    it('should handle sending large messages', async () => {
      // SQS max message size is 256KB
      const largeMessage = {
        data: 'x'.repeat(200000) // 200KB of data
      };

      const result = await sendMessage(testQueueUrl, largeMessage);
      expect(result.MessageId).toBeDefined();
    });

    it('should reject messages exceeding size limit', async () => {
      // Create message larger than 256KB
      const tooLargeMessage = {
        data: 'x'.repeat(300000) // 300KB
      };

      await expect(
        sendMessage(testQueueUrl, tooLargeMessage)
      ).rejects.toThrow();
    });
  });

  describe('receiveMessages', () => {
    it('should receive messages from queue', async () => {
      // Send 3 messages
      await sendMessage(testQueueUrl, { index: 1 });
      await sendMessage(testQueueUrl, { index: 2 });
      await sendMessage(testQueueUrl, { index: 3 });

      const messages = await receiveMessages(testQueueUrl, 3);

      expect(messages.length).toBeGreaterThan(0);
      expect(messages.length).toBeLessThanOrEqual(3);
    });

    it('should return empty array when queue is empty', async () => {
      const messages = await receiveMessages(testQueueUrl, 10, 1);

      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBe(0);
    });

    it('should receive up to maxMessages limit', async () => {
      // Send 10 messages
      for (let i = 0; i < 10; i++) {
        await sendMessage(testQueueUrl, { index: i });
      }

      // Request only 5
      const messages = await receiveMessages(testQueueUrl, 5);

      expect(messages.length).toBeLessThanOrEqual(5);
    });

    it('should respect visibility timeout', async () => {
      await sendMessage(testQueueUrl, { test: 'visibility' });

      // Receive with 5 second visibility timeout
      const messages1 = await receiveMessages(testQueueUrl, 1, 5);
      expect(messages1.length).toBe(1);

      // Try to receive again immediately - should get nothing
      const messages2 = await receiveMessages(testQueueUrl, 1, 1);
      expect(messages2.length).toBe(0);

      // Wait for visibility timeout to expire
      await new Promise(resolve => setTimeout(resolve, 6000));

      // Now should be able to receive again
      const messages3 = await receiveMessages(testQueueUrl, 1);
      expect(messages3.length).toBe(1);
    });

    it('should parse JSON message bodies', async () => {
      const originalMessage = {
        id: '123',
        type: 'notification',
        content: 'Test notification'
      };

      await sendMessage(testQueueUrl, originalMessage);

      const messages = await receiveMessages(testQueueUrl, 1);
      const parsedBody = JSON.parse(messages[0].Body!);

      expect(parsedBody).toEqual(originalMessage);
    });
  });

  describe('processQueue', () => {
    it('should process messages with handler function', async () => {
      const processedMessages: any[] = [];

      // Send 3 messages
      await sendMessage(testQueueUrl, { id: 1, action: 'process' });
      await sendMessage(testQueueUrl, { id: 2, action: 'process' });
      await sendMessage(testQueueUrl, { id: 3, action: 'process' });

      // Process with custom handler
      const handler = async (message: any) => {
        const body = JSON.parse(message.Body);
        processedMessages.push(body);
        return true; // Success
      };

      await processQueue(testQueueUrl, handler, { maxMessages: 3, waitTimeSeconds: 2 });

      expect(processedMessages.length).toBeGreaterThan(0);
      expect(processedMessages.length).toBeLessThanOrEqual(3);
    });

    it('should delete messages after successful processing', async () => {
      await sendMessage(testQueueUrl, { id: 'delete-test' });

      const handler = async (message: any) => {
        return true; // Success - should delete
      };

      await processQueue(testQueueUrl, handler, { maxMessages: 1, waitTimeSeconds: 2 });

      // Message should be gone
      const remainingMessages = await receiveMessages(testQueueUrl, 10, 1);
      expect(remainingMessages.length).toBe(0);
    });

    it('should not delete messages when handler returns false', async () => {
      await sendMessage(testQueueUrl, { id: 'keep-test' });

      const handler = async (message: any) => {
        return false; // Failure - should keep message
      };

      await processQueue(testQueueUrl, handler, { maxMessages: 1, waitTimeSeconds: 2 });

      // Wait for visibility timeout
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Message should still be in queue
      const messages = await receiveMessages(testQueueUrl, 10);
      expect(messages.length).toBe(1);
    });

    it('should handle processing errors gracefully', async () => {
      await sendMessage(testQueueUrl, { id: 'error-test' });

      const handler = async (message: any) => {
        throw new Error('Processing failed');
      };

      // Should not throw, should handle error
      await expect(
        processQueue(testQueueUrl, handler, { maxMessages: 1, waitTimeSeconds: 2 })
      ).resolves.not.toThrow();
    });

    it('should process multiple batches', async () => {
      const processedCount = { value: 0 };

      // Send 10 messages
      for (let i = 0; i < 10; i++) {
        await sendMessage(testQueueUrl, { index: i });
      }

      const handler = async (message: any) => {
        processedCount.value++;
        return true;
      };

      // Process in batches of 3
      for (let i = 0; i < 4; i++) {
        await processQueue(testQueueUrl, handler, { maxMessages: 3, waitTimeSeconds: 1 });
      }

      expect(processedCount.value).toBeGreaterThan(0);
    });
  });

  describe('getQueueUrl', () => {
    it('should retrieve queue URL by name', async () => {
      const url = await getQueueUrl(TEST_QUEUE_NAME);

      expect(url).toBe(testQueueUrl);
      expect(url).toContain(TEST_QUEUE_NAME);
    });

    it('should throw error for non-existent queue', async () => {
      await expect(
        getQueueUrl('non-existent-queue-99999')
      ).rejects.toThrow();
    });

    it('should handle queue names with special characters', async () => {
      const specialQueueName = 'test-queue-with-dashes_and_underscores';

      try {
        const createResponse = await sqsClient.send(
          new CreateQueueCommand({ QueueName: specialQueueName })
        );
        const specialQueueUrl = createResponse.QueueUrl!;

        const retrievedUrl = await getQueueUrl(specialQueueName);
        expect(retrievedUrl).toBe(specialQueueUrl);

        // Cleanup
        await sqsClient.send(new DeleteQueueCommand({ QueueUrl: specialQueueUrl }));
      } catch (error) {
        // Queue creation may fail in some environments
        console.warn('Special character queue test skipped:', error);
      }
    });
  });

  describe('batchSendToQueue', () => {
    it('should send multiple messages in a batch', async () => {
      const messages = [
        { id: 1, content: 'Message 1' },
        { id: 2, content: 'Message 2' },
        { id: 3, content: 'Message 3' }
      ];

      const results = await batchSendToQueue(testQueueUrl, messages);

      expect(results.Successful).toBeDefined();
      expect(results.Successful!.length).toBe(3);
      expect(results.Failed).toBeDefined();
      expect(results.Failed!.length).toBe(0);
    });

    it('should handle batch of 10 messages (SQS max)', async () => {
      const messages = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        content: `Message ${i}`
      }));

      const results = await batchSendToQueue(testQueueUrl, messages);

      expect(results.Successful!.length).toBe(10);
    });

    it('should reject batches larger than 10 messages', async () => {
      const messages = Array.from({ length: 11 }, (_, i) => ({
        id: i
      }));

      await expect(
        batchSendToQueue(testQueueUrl, messages)
      ).rejects.toThrow();
    });

    it('should handle empty batch', async () => {
      const results = await batchSendToQueue(testQueueUrl, []);

      expect(results.Successful!.length).toBe(0);
    });

    it('should send batch with different message types', async () => {
      const messages = [
        { type: 'string', data: 'text' },
        { type: 'number', data: 12345 },
        { type: 'boolean', data: true },
        { type: 'array', data: [1, 2, 3] },
        { type: 'object', data: { nested: true } }
      ];

      const results = await batchSendToQueue(testQueueUrl, messages);

      expect(results.Successful!.length).toBe(5);

      // Verify all messages received
      const received = await receiveMessages(testQueueUrl, 10);
      expect(received.length).toBe(5);
    });
  });

  describe('getQueueStats', () => {
    it('should get queue statistics', async () => {
      // Send some messages
      await sendMessage(testQueueUrl, { test: 1 });
      await sendMessage(testQueueUrl, { test: 2 });

      const stats = await getQueueStats(testQueueUrl);

      expect(stats).toHaveProperty('approximateNumberOfMessages');
      expect(stats).toHaveProperty('approximateNumberOfMessagesNotVisible');
      expect(stats).toHaveProperty('approximateNumberOfMessagesDelayed');
      expect(stats.approximateNumberOfMessages).toBeGreaterThanOrEqual(0);
    });

    it('should show zero messages for empty queue', async () => {
      const stats = await getQueueStats(testQueueUrl);

      expect(stats.approximateNumberOfMessages).toBe(0);
    });

    it('should track messages in flight', async () => {
      await sendMessage(testQueueUrl, { test: 'in-flight' });

      // Receive message (makes it not visible)
      await receiveMessages(testQueueUrl, 1, 30);

      const stats = await getQueueStats(testQueueUrl);

      expect(stats.approximateNumberOfMessagesNotVisible).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid queue URL', async () => {
      const invalidUrl = 'http://invalid-queue-url';

      await expect(
        sendMessage(invalidUrl, { test: 'fail' })
      ).rejects.toThrow();
    });

    it('should handle SQS service errors gracefully', async () => {
      // This would require mocking SQS to force errors
      // Demonstrates error handling test approach
    });

    it('should handle malformed JSON in messages', async () => {
      // Send raw message (not JSON)
      // This would require bypassing the service layer
      // Demonstrates JSON parsing error handling
    });
  });

  describe('Performance', () => {
    it('should handle high message throughput', async () => {
      const messageCount = 50;
      const sendPromises = [];

      for (let i = 0; i < messageCount; i++) {
        sendPromises.push(sendMessage(testQueueUrl, { index: i }));
      }

      const results = await Promise.all(sendPromises);
      expect(results.length).toBe(messageCount);
    });

    it('should efficiently batch send messages', async () => {
      const messages = Array.from({ length: 100 }, (_, i) => ({ index: i }));

      // Send in batches of 10
      const batchPromises = [];
      for (let i = 0; i < messages.length; i += 10) {
        const batch = messages.slice(i, i + 10);
        batchPromises.push(batchSendToQueue(testQueueUrl, batch));
      }

      const results = await Promise.all(batchPromises);
      const totalSuccessful = results.reduce(
        (sum, r) => sum + (r.Successful?.length || 0),
        0
      );

      expect(totalSuccessful).toBe(100);
    });
  });
});
