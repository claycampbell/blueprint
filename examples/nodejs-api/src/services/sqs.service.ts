/**
 * SQS Queue Service
 * Handles asynchronous message processing using AWS SQS (or LocalStack)
 */

import {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueAttributesCommand,
  GetQueueUrlCommand,
  Message,
  MessageAttributeValue,
} from '@aws-sdk/client-sqs';
import { sqsClient, awsEnv } from '../config/aws';

const DEFAULT_QUEUE_URL = awsEnv.documentQueueUrl;

// Type definitions
interface MessageOptions {
  delaySeconds?: number;
  attributes?: Record<string, MessageAttributeValue>;
  queueUrl?: string;
}

interface QueueProcessorOptions {
  maxMessages?: number;
  waitTimeSeconds?: number;
  visibilityTimeout?: number;
  stopOnError?: boolean;
  queueUrl?: string;
}

interface QueueStats {
  messagesAvailable: number;
  messagesInFlight: number;
  messagesDelayed: number;
}

type MessageHandler = (messageBody: any, rawMessage: Message) => Promise<void>;

/**
 * Get queue URL by queue name
 * @param queueName - Name of the SQS queue
 * @returns Queue URL
 */
export async function getQueueUrl(queueName: string): Promise<string> {
  try {
    const command = new GetQueueUrlCommand({
      QueueName: queueName,
    });

    const response = await sqsClient.send(command);

    if (!response.QueueUrl) {
      throw new Error(`Queue URL not found for queue: ${queueName}`);
    }

    console.log('✅ Retrieved queue URL:', response.QueueUrl);

    return response.QueueUrl;
  } catch (error) {
    console.error('❌ Get queue URL error:', error);
    throw new Error(`Failed to get queue URL: ${(error as Error).message}`);
  }
}

/**
 * Send a message to the queue
 * @param queueUrl - SQS queue URL (or use default)
 * @param messageBody - Message payload
 * @param options - Optional parameters (delaySeconds, attributes)
 * @returns Message ID
 */
export async function sendMessage(
  queueUrl: string | null,
  messageBody: any,
  options: MessageOptions = {}
): Promise<string> {
  try {
    const targetQueue = queueUrl || options.queueUrl || DEFAULT_QUEUE_URL;

    const command = new SendMessageCommand({
      QueueUrl: targetQueue,
      MessageBody: JSON.stringify(messageBody),
      DelaySeconds: options.delaySeconds || 0,
      MessageAttributes: options.attributes || {},
    });

    const response = await sqsClient.send(command);

    if (!response.MessageId) {
      throw new Error('No message ID returned from SQS');
    }

    console.log('✅ Message sent to queue:', response.MessageId);

    return response.MessageId;
  } catch (error) {
    console.error('❌ SQS send error:', error);
    throw new Error(`Failed to send message to queue: ${(error as Error).message}`);
  }
}

/**
 * Process messages from the queue (long polling)
 * @param handler - Message handler function (async)
 * @param options - Processing options
 */
export async function processQueue(
  handler: MessageHandler,
  options: QueueProcessorOptions = {}
): Promise<void> {
  const {
    maxMessages = 10,
    waitTimeSeconds = 20,
    visibilityTimeout = 300,
    stopOnError = false,
    queueUrl = DEFAULT_QUEUE_URL,
  } = options;

  console.log('🔄 Starting queue processor...');
  console.log('   Queue URL:', queueUrl);
  console.log('   Max messages:', maxMessages);
  console.log('   Wait time:', waitTimeSeconds, 'seconds');

  let isRunning = true;

  // Graceful shutdown
  const shutdown = () => {
    console.log('⚠️  Shutdown signal received, stopping queue processor...');
    isRunning = false;
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  while (isRunning) {
    try {
      // Receive messages (long polling)
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: waitTimeSeconds,
        VisibilityTimeout: visibilityTimeout,
        AttributeNames: ['All'],
        MessageAttributeNames: ['All'],
      });

      const response = await sqsClient.send(command);

      if (!response.Messages || response.Messages.length === 0) {
        // No messages, continue polling
        continue;
      }

      console.log(`📬 Received ${response.Messages.length} messages`);

      // Process each message
      for (const message of response.Messages) {
        try {
          if (!message.Body) {
            console.warn('⚠️  Message has no body, skipping');
            continue;
          }

          const body = JSON.parse(message.Body);

          console.log('⚙️  Processing message:', message.MessageId);

          // Execute handler
          await handler(body, message);

          // Delete message after successful processing
          if (message.ReceiptHandle) {
            await deleteMessage(message.ReceiptHandle, queueUrl);
            console.log('✅ Message processed:', message.MessageId);
          }
        } catch (error) {
          console.error('❌ Message processing error:', error);
          console.error('   Message ID:', message.MessageId);
          console.error('   Message body:', message.Body);

          if (stopOnError) {
            throw error;
          }
          // Message will be redelivered after visibility timeout
        }
      }
    } catch (error) {
      console.error('❌ Queue polling error:', error);
      if (stopOnError) {
        throw error;
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Remove listeners
  process.off('SIGTERM', shutdown);
  process.off('SIGINT', shutdown);

  console.log('🛑 Queue processor stopped');
}

/**
 * Delete a message from the queue
 * @param receiptHandle - Message receipt handle
 * @param queueUrl - Queue URL (optional, uses default if not provided)
 */
export async function deleteMessage(
  receiptHandle: string,
  queueUrl: string = DEFAULT_QUEUE_URL
): Promise<void> {
  try {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });

    await sqsClient.send(command);
  } catch (error) {
    console.error('❌ SQS delete error:', error);
    throw new Error(`Failed to delete message: ${(error as Error).message}`);
  }
}

/**
 * Get queue statistics
 * @param queueUrl - Queue URL (optional, uses default if not provided)
 * @returns Queue metrics
 */
export async function getQueueStats(queueUrl: string = DEFAULT_QUEUE_URL): Promise<QueueStats> {
  try {
    const command = new GetQueueAttributesCommand({
      QueueUrl: queueUrl,
      AttributeNames: [
        'ApproximateNumberOfMessages',
        'ApproximateNumberOfMessagesNotVisible',
        'ApproximateNumberOfMessagesDelayed',
      ],
    });

    const response = await sqsClient.send(command);

    if (!response.Attributes) {
      throw new Error('No queue attributes returned');
    }

    const stats: QueueStats = {
      messagesAvailable: parseInt(response.Attributes.ApproximateNumberOfMessages || '0', 10),
      messagesInFlight: parseInt(response.Attributes.ApproximateNumberOfMessagesNotVisible || '0', 10),
      messagesDelayed: parseInt(response.Attributes.ApproximateNumberOfMessagesDelayed || '0', 10),
    };

    console.log('📊 Queue stats:', stats);

    return stats;
  } catch (error) {
    console.error('❌ SQS stats error:', error);
    throw new Error(`Failed to get queue stats: ${(error as Error).message}`);
  }
}

/**
 * Batch send messages (up to 10 at a time)
 * @param messages - Array of message bodies
 * @param queueUrl - Queue URL (optional, uses default if not provided)
 * @returns Array of message IDs
 */
export async function batchSendToQueue(
  messages: any[],
  queueUrl: string = DEFAULT_QUEUE_URL
): Promise<string[]> {
  try {
    if (messages.length > 10) {
      throw new Error('Batch size cannot exceed 10 messages');
    }

    // Note: For production, use SendMessageBatchCommand
    // For simplicity, sending individually here
    const messageIds: string[] = [];
    for (const message of messages) {
      const id = await sendMessage(queueUrl, message);
      messageIds.push(id);
    }

    console.log(`✅ Batch sent ${messageIds.length} messages`);

    return messageIds;
  } catch (error) {
    console.error('❌ Batch send error:', error);
    throw new Error(`Failed to batch send messages: ${(error as Error).message}`);
  }
}

// Predefined queue URLs for common queues
export const QUEUE_URLS = {
  documentProcessing: awsEnv.documentQueueUrl,
  notifications: awsEnv.notificationQueueUrl,
};

/**
 * Example: Document processing message handler
 * @param messageBody - Message payload
 * @param rawMessage - Raw SQS message
 */
export async function handleDocumentProcessing(messageBody: any, rawMessage: Message): Promise<void> {
  const { documentId, action, metadata } = messageBody;

  console.log(`Processing document ${documentId} with action: ${action}`);

  switch (action) {
    case 'extract':
      // Call Textract or AI service to extract data
      console.log('Extracting data from document...');
      break;

    case 'summarize':
      // Call GPT/LLM to summarize document
      console.log('Summarizing document...');
      break;

    case 'archive':
      // Move to archive storage
      console.log('Archiving document...');
      break;

    default:
      console.warn('Unknown action:', action);
  }
}

export default {
  getQueueUrl,
  sendMessage,
  processQueue,
  deleteMessage,
  getQueueStats,
  batchSendToQueue,
  handleDocumentProcessing,
  QUEUE_URLS,
};
