/**
 * Unit tests for SQS Service
 * Tests messaging operations with mocked AWS SDK
 */

import {
  sendMessage,
  receiveMessages,
  processQueue,
  getQueueUrl,
  batchSendToQueue,
  getQueueStats
} from '../../../src/services/sqs.service';
import { sqsClient } from '../../../src/config/aws';
import { mockClient } from 'aws-sdk-client-mock';
import {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueUrlCommand,
  SendMessageBatchCommand,
  GetQueueAttributesCommand
} from '@aws-sdk/client-sqs';

// Create SQS mock
const sqsMock = mockClient(sqsClient as any);

const MOCK_QUEUE_URL = 'http://localhost:4566/000000000000/test-queue';

describe('SQS Service Unit Tests', () => {

  beforeEach(() => {
    sqsMock.reset();
  });

  describe('sendMessage', () => {
    it('should send message to queue', async () => {
      sqsMock.on(SendMessageCommand).resolves({
        MessageId: 'mock-message-id-123'
      });

      const queueUrl = MOCK_QUEUE_URL;
      const messageBody = { action: 'test', data: 'Hello' };

      const result = await sendMessage(queueUrl, messageBody);

      expect(result.MessageId).toBe('mock-message-id-123');
      expect(sqsMock.calls()).toHaveLength(1);
    });

    it('should stringify object message bodies', async () => {
      let capturedBody: string | undefined;

      sqsMock.on(SendMessageCommand).callsFake((input) => {
        capturedBody = input.MessageBody;
        return { MessageId: 'mock-id' };
      });

      const messageBody = { id: 123, type: 'notification' };
      await sendMessage(MOCK_QUEUE_URL, messageBody);

      expect(capturedBody).toBe(JSON.stringify(messageBody));
    });

    it('should handle string message bodies', async () => {
      let capturedBody: string | undefined;

      sqsMock.on(SendMessageCommand).callsFake((input) => {
        capturedBody = input.MessageBody;
        return { MessageId: 'mock-id' };
      });

      await sendMessage(MOCK_QUEUE_URL, 'Simple string message');

      expect(capturedBody).toBe('Simple string message');
    });

    it('should support delay parameter', async () => {
      let capturedDelay: number | undefined;

      sqsMock.on(SendMessageCommand).callsFake((input) => {
        capturedDelay = input.DelaySeconds;
        return { MessageId: 'mock-id' };
      });

      const delaySeconds = 10;
      await sendMessage(MOCK_QUEUE_URL, { test: true }, delaySeconds);

      expect(capturedDelay).toBe(delaySeconds);
    });

    it('should use zero delay by default', async () => {
      let capturedDelay: number | undefined;

      sqsMock.on(SendMessageCommand).callsFake((input) => {
        capturedDelay = input.DelaySeconds;
        return { MessageId: 'mock-id' };
      });

      await sendMessage(MOCK_QUEUE_URL, { test: true });

      expect(capturedDelay).toBe(0);
    });

    it('should handle send errors', async () => {
      sqsMock.on(SendMessageCommand).rejects(new Error('Queue not found'));

      await expect(
        sendMessage(MOCK_QUEUE_URL, { test: true })
      ).rejects.toThrow('Queue not found');
    });

    it('should handle complex nested objects', async () => {
      sqsMock.on(SendMessageCommand).resolves({ MessageId: 'mock-id' });

      const complexMessage = {
        level1: {
          level2: {
            level3: {
              data: 'deeply nested'
            }
          }
        },
        array: [1, 2, { nested: true }]
      };

      const result = await sendMessage(MOCK_QUEUE_URL, complexMessage);

      expect(result.MessageId).toBeDefined();
    });
  });

  describe('receiveMessages', () => {
    it('should receive messages from queue', async () => {
      const mockMessages = [
        {
          MessageId: 'msg-1',
          Body: JSON.stringify({ id: 1 }),
          ReceiptHandle: 'receipt-1'
        },
        {
          MessageId: 'msg-2',
          Body: JSON.stringify({ id: 2 }),
          ReceiptHandle: 'receipt-2'
        }
      ];

      sqsMock.on(ReceiveMessageCommand).resolves({
        Messages: mockMessages
      });

      const result = await receiveMessages(MOCK_QUEUE_URL, 2);

      expect(result).toHaveLength(2);
      expect(result[0].MessageId).toBe('msg-1');
      expect(result[1].MessageId).toBe('msg-2');
    });

    it('should return empty array when no messages available', async () => {
      sqsMock.on(ReceiveMessageCommand).resolves({
        Messages: undefined
      });

      const result = await receiveMessages(MOCK_QUEUE_URL, 10);

      expect(result).toEqual([]);
    });

    it('should respect maxMessages parameter', async () => {
      let capturedMaxMessages: number | undefined;

      sqsMock.on(ReceiveMessageCommand).callsFake((input) => {
        capturedMaxMessages = input.MaxNumberOfMessages;
        return { Messages: [] };
      });

      await receiveMessages(MOCK_QUEUE_URL, 5);

      expect(capturedMaxMessages).toBe(5);
    });

    it('should respect visibility timeout parameter', async () => {
      let capturedVisibility: number | undefined;

      sqsMock.on(ReceiveMessageCommand).callsFake((input) => {
        capturedVisibility = input.VisibilityTimeout;
        return { Messages: [] };
      });

      await receiveMessages(MOCK_QUEUE_URL, 1, 30);

      expect(capturedVisibility).toBe(30);
    });

    it('should use default visibility timeout', async () => {
      let capturedVisibility: number | undefined;

      sqsMock.on(ReceiveMessageCommand).callsFake((input) => {
        capturedVisibility = input.VisibilityTimeout;
        return { Messages: [] };
      });

      await receiveMessages(MOCK_QUEUE_URL, 1);

      // Default should be 30 seconds
      expect(capturedVisibility).toBe(30);
    });

    it('should enable long polling with WaitTimeSeconds', async () => {
      let capturedWaitTime: number | undefined;

      sqsMock.on(ReceiveMessageCommand).callsFake((input) => {
        capturedWaitTime = input.WaitTimeSeconds;
        return { Messages: [] };
      });

      await receiveMessages(MOCK_QUEUE_URL, 1);

      expect(capturedWaitTime).toBeGreaterThan(0);
    });

    it('should handle receive errors', async () => {
      sqsMock.on(ReceiveMessageCommand).rejects(new Error('Access denied'));

      await expect(
        receiveMessages(MOCK_QUEUE_URL, 1)
      ).rejects.toThrow('Access denied');
    });
  });

  describe('processQueue', () => {
    it('should process messages with handler function', async () => {
      const mockMessages = [
        {
          MessageId: 'msg-1',
          Body: JSON.stringify({ id: 1, action: 'process' }),
          ReceiptHandle: 'receipt-1'
        }
      ];

      sqsMock.on(ReceiveMessageCommand).resolves({ Messages: mockMessages });
      sqsMock.on(DeleteMessageCommand).resolves({});

      const processedMessages: any[] = [];
      const handler = async (message: any) => {
        const body = JSON.parse(message.Body);
        processedMessages.push(body);
        return true;
      };

      await processQueue(MOCK_QUEUE_URL, handler, { maxMessages: 1, waitTimeSeconds: 1 });

      expect(processedMessages).toHaveLength(1);
      expect(processedMessages[0].id).toBe(1);
    });

    it('should delete messages after successful processing', async () => {
      const mockMessage = {
        MessageId: 'msg-1',
        Body: JSON.stringify({ test: true }),
        ReceiptHandle: 'receipt-1'
      };

      sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [mockMessage] });
      sqsMock.on(DeleteMessageCommand).resolves({});

      const handler = async () => true;

      await processQueue(MOCK_QUEUE_URL, handler, { maxMessages: 1, waitTimeSeconds: 1 });

      const deleteCalls = sqsMock.commandCalls(DeleteMessageCommand);
      expect(deleteCalls).toHaveLength(1);
      expect(deleteCalls[0].args[0].input.ReceiptHandle).toBe('receipt-1');
    });

    it('should not delete messages when handler returns false', async () => {
      const mockMessage = {
        MessageId: 'msg-1',
        Body: JSON.stringify({ test: true }),
        ReceiptHandle: 'receipt-1'
      };

      sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [mockMessage] });

      const handler = async () => false; // Failure

      await processQueue(MOCK_QUEUE_URL, handler, { maxMessages: 1, waitTimeSeconds: 1 });

      const deleteCalls = sqsMock.commandCalls(DeleteMessageCommand);
      expect(deleteCalls).toHaveLength(0);
    });

    it('should handle processing errors gracefully', async () => {
      const mockMessage = {
        MessageId: 'msg-1',
        Body: JSON.stringify({ test: true }),
        ReceiptHandle: 'receipt-1'
      };

      sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [mockMessage] });

      const handler = async () => {
        throw new Error('Processing failed');
      };

      // Should not throw, should handle error internally
      await expect(
        processQueue(MOCK_QUEUE_URL, handler, { maxMessages: 1, waitTimeSeconds: 1 })
      ).resolves.not.toThrow();

      // Message should not be deleted
      const deleteCalls = sqsMock.commandCalls(DeleteMessageCommand);
      expect(deleteCalls).toHaveLength(0);
    });

    it('should process multiple messages', async () => {
      const mockMessages = [
        { MessageId: 'msg-1', Body: JSON.stringify({ id: 1 }), ReceiptHandle: 'receipt-1' },
        { MessageId: 'msg-2', Body: JSON.stringify({ id: 2 }), ReceiptHandle: 'receipt-2' },
        { MessageId: 'msg-3', Body: JSON.stringify({ id: 3 }), ReceiptHandle: 'receipt-3' }
      ];

      sqsMock.on(ReceiveMessageCommand).resolves({ Messages: mockMessages });
      sqsMock.on(DeleteMessageCommand).resolves({});

      let processCount = 0;
      const handler = async () => {
        processCount++;
        return true;
      };

      await processQueue(MOCK_QUEUE_URL, handler, { maxMessages: 10, waitTimeSeconds: 1 });

      expect(processCount).toBe(3);
    });

    it('should handle empty queue', async () => {
      sqsMock.on(ReceiveMessageCommand).resolves({ Messages: undefined });

      const handler = jest.fn().mockResolvedValue(true);

      await processQueue(MOCK_QUEUE_URL, handler, { maxMessages: 1, waitTimeSeconds: 1 });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('getQueueUrl', () => {
    it('should retrieve queue URL by name', async () => {
      sqsMock.on(GetQueueUrlCommand).resolves({
        QueueUrl: MOCK_QUEUE_URL
      });

      const result = await getQueueUrl('test-queue');

      expect(result).toBe(MOCK_QUEUE_URL);
    });

    it('should throw error when queue not found', async () => {
      sqsMock.on(GetQueueUrlCommand).rejects({
        name: 'AWS.SimpleQueueService.NonExistentQueue',
        message: 'Queue does not exist'
      });

      await expect(
        getQueueUrl('non-existent-queue')
      ).rejects.toThrow();
    });

    it('should use correct queue name parameter', async () => {
      let capturedQueueName: string | undefined;

      sqsMock.on(GetQueueUrlCommand).callsFake((input) => {
        capturedQueueName = input.QueueName;
        return { QueueUrl: MOCK_QUEUE_URL };
      });

      await getQueueUrl('my-test-queue');

      expect(capturedQueueName).toBe('my-test-queue');
    });
  });

  describe('batchSendToQueue', () => {
    it('should send multiple messages in batch', async () => {
      sqsMock.on(SendMessageBatchCommand).resolves({
        Successful: [
          { Id: '0', MessageId: 'msg-1' },
          { Id: '1', MessageId: 'msg-2' },
          { Id: '2', MessageId: 'msg-3' }
        ],
        Failed: []
      });

      const messages = [
        { id: 1, content: 'Message 1' },
        { id: 2, content: 'Message 2' },
        { id: 3, content: 'Message 3' }
      ];

      const result = await batchSendToQueue(MOCK_QUEUE_URL, messages);

      expect(result.Successful).toHaveLength(3);
      expect(result.Failed).toHaveLength(0);
    });

    it('should handle batch with maximum 10 messages', async () => {
      sqsMock.on(SendMessageBatchCommand).resolves({
        Successful: Array.from({ length: 10 }, (_, i) => ({
          Id: String(i),
          MessageId: `msg-${i}`
        })),
        Failed: []
      });

      const messages = Array.from({ length: 10 }, (_, i) => ({ id: i }));

      const result = await batchSendToQueue(MOCK_QUEUE_URL, messages);

      expect(result.Successful).toHaveLength(10);
    });

    it('should reject batches larger than 10 messages', async () => {
      const messages = Array.from({ length: 11 }, (_, i) => ({ id: i }));

      await expect(
        batchSendToQueue(MOCK_QUEUE_URL, messages)
      ).rejects.toThrow();
    });

    it('should handle empty batch', async () => {
      sqsMock.on(SendMessageBatchCommand).resolves({
        Successful: [],
        Failed: []
      });

      const result = await batchSendToQueue(MOCK_QUEUE_URL, []);

      expect(result.Successful).toHaveLength(0);
    });

    it('should handle partial failures', async () => {
      sqsMock.on(SendMessageBatchCommand).resolves({
        Successful: [
          { Id: '0', MessageId: 'msg-1' },
          { Id: '2', MessageId: 'msg-3' }
        ],
        Failed: [
          {
            Id: '1',
            Code: 'InvalidMessageContents',
            Message: 'Message body is invalid',
            SenderFault: true
          }
        ]
      });

      const messages = [
        { id: 1 },
        { id: 2 }, // This one fails
        { id: 3 }
      ];

      const result = await batchSendToQueue(MOCK_QUEUE_URL, messages);

      expect(result.Successful).toHaveLength(2);
      expect(result.Failed).toHaveLength(1);
      expect(result.Failed![0].Code).toBe('InvalidMessageContents');
    });

    it('should stringify message bodies', async () => {
      let capturedEntries: any[] = [];

      sqsMock.on(SendMessageBatchCommand).callsFake((input) => {
        capturedEntries = input.Entries || [];
        return {
          Successful: capturedEntries.map((entry, i) => ({
            Id: entry.Id,
            MessageId: `msg-${i}`
          })),
          Failed: []
        };
      });

      const messages = [
        { type: 'object', data: { nested: true } },
        { type: 'array', data: [1, 2, 3] }
      ];

      await batchSendToQueue(MOCK_QUEUE_URL, messages);

      expect(capturedEntries).toHaveLength(2);
      expect(JSON.parse(capturedEntries[0].MessageBody)).toEqual(messages[0]);
      expect(JSON.parse(capturedEntries[1].MessageBody)).toEqual(messages[1]);
    });
  });

  describe('getQueueStats', () => {
    it('should retrieve queue statistics', async () => {
      sqsMock.on(GetQueueAttributesCommand).resolves({
        Attributes: {
          ApproximateNumberOfMessages: '5',
          ApproximateNumberOfMessagesNotVisible: '2',
          ApproximateNumberOfMessagesDelayed: '1'
        }
      });

      const result = await getQueueStats(MOCK_QUEUE_URL);

      expect(result.approximateNumberOfMessages).toBe(5);
      expect(result.approximateNumberOfMessagesNotVisible).toBe(2);
      expect(result.approximateNumberOfMessagesDelayed).toBe(1);
    });

    it('should handle empty queue stats', async () => {
      sqsMock.on(GetQueueAttributesCommand).resolves({
        Attributes: {
          ApproximateNumberOfMessages: '0',
          ApproximateNumberOfMessagesNotVisible: '0',
          ApproximateNumberOfMessagesDelayed: '0'
        }
      });

      const result = await getQueueStats(MOCK_QUEUE_URL);

      expect(result.approximateNumberOfMessages).toBe(0);
      expect(result.approximateNumberOfMessagesNotVisible).toBe(0);
      expect(result.approximateNumberOfMessagesDelayed).toBe(0);
    });

    it('should request correct attributes', async () => {
      let capturedAttributes: string[] | undefined;

      sqsMock.on(GetQueueAttributesCommand).callsFake((input) => {
        capturedAttributes = input.AttributeNames;
        return {
          Attributes: {
            ApproximateNumberOfMessages: '0',
            ApproximateNumberOfMessagesNotVisible: '0',
            ApproximateNumberOfMessagesDelayed: '0'
          }
        };
      });

      await getQueueStats(MOCK_QUEUE_URL);

      expect(capturedAttributes).toContain('ApproximateNumberOfMessages');
      expect(capturedAttributes).toContain('ApproximateNumberOfMessagesNotVisible');
      expect(capturedAttributes).toContain('ApproximateNumberOfMessagesDelayed');
    });

    it('should handle missing attributes gracefully', async () => {
      sqsMock.on(GetQueueAttributesCommand).resolves({
        Attributes: {} // No attributes returned
      });

      const result = await getQueueStats(MOCK_QUEUE_URL);

      expect(result.approximateNumberOfMessages).toBe(0);
      expect(result.approximateNumberOfMessagesNotVisible).toBe(0);
      expect(result.approximateNumberOfMessagesDelayed).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid queue URL', async () => {
      sqsMock.on(SendMessageCommand).rejects({
        name: 'InvalidAddress',
        message: 'The address is not valid for this endpoint'
      });

      await expect(
        sendMessage('invalid-url', { test: true })
      ).rejects.toThrow();
    });

    it('should handle service unavailable errors', async () => {
      sqsMock.on(ReceiveMessageCommand).rejects({
        name: 'ServiceUnavailable',
        message: 'Service temporarily unavailable'
      });

      await expect(
        receiveMessages(MOCK_QUEUE_URL, 1)
      ).rejects.toThrow();
    });

    it('should handle throttling errors', async () => {
      sqsMock.on(SendMessageCommand).rejects({
        name: 'RequestThrottled',
        message: 'Rate exceeded'
      });

      await expect(
        sendMessage(MOCK_QUEUE_URL, { test: true })
      ).rejects.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large message bodies (near 256KB limit)', async () => {
      sqsMock.on(SendMessageCommand).resolves({ MessageId: 'mock-id' });

      const largeMessage = {
        data: 'x'.repeat(200000) // ~200KB
      };

      const result = await sendMessage(MOCK_QUEUE_URL, largeMessage);

      expect(result.MessageId).toBeDefined();
    });

    it('should handle messages with special characters', async () => {
      sqsMock.on(SendMessageCommand).resolves({ MessageId: 'mock-id' });

      const message = {
        text: 'Special chars: <>&"\'\n\t\r',
        unicode: '你好世界 🚀'
      };

      const result = await sendMessage(MOCK_QUEUE_URL, message);

      expect(result.MessageId).toBeDefined();
    });

    it('should handle concurrent sends', async () => {
      sqsMock.on(SendMessageCommand).resolves({ MessageId: 'mock-id' });

      const promises = Array.from({ length: 20 }, (_, i) =>
        sendMessage(MOCK_QUEUE_URL, { index: i })
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(20);
      results.forEach(result => {
        expect(result.MessageId).toBeDefined();
      });
    });

    it('should handle zero delay', async () => {
      let capturedDelay: number | undefined;

      sqsMock.on(SendMessageCommand).callsFake((input) => {
        capturedDelay = input.DelaySeconds;
        return { MessageId: 'mock-id' };
      });

      await sendMessage(MOCK_QUEUE_URL, { test: true }, 0);

      expect(capturedDelay).toBe(0);
    });

    it('should handle maximum delay (900 seconds)', async () => {
      let capturedDelay: number | undefined;

      sqsMock.on(SendMessageCommand).callsFake((input) => {
        capturedDelay = input.DelaySeconds;
        return { MessageId: 'mock-id' };
      });

      await sendMessage(MOCK_QUEUE_URL, { test: true }, 900);

      expect(capturedDelay).toBe(900);
    });
  });
});
