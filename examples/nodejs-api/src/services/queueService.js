/**
 * SQS Queue Service
 * Handles asynchronous message processing using AWS SQS (or LocalStack)
 */

import {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueAttributesCommand,
} from '@aws-sdk/client-sqs';
import { sqsClient, awsEnv } from '../config/aws.js';

const QUEUE_URL = awsEnv.documentQueueUrl;

/**
 * Send a message to the queue
 * @param {Object} messageBody - Message payload
 * @param {Object} options - Optional parameters (delaySeconds, messageGroupId)
 * @returns {Promise<string>} - Message ID
 */
export async function sendToQueue(messageBody, options = {}) {
  try {
    const command = new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(messageBody),
      DelaySeconds: options.delaySeconds || 0,
      MessageAttributes: options.attributes || {},
    });

    const response = await sqsClient.send(command);

    console.log('✅ Message sent to queue:', response.MessageId);

    return response.MessageId;
  } catch (error) {
    console.error('❌ SQS send error:', error);
    throw new Error(`Failed to send message to queue: ${error.message}`);
  }
}

/**
 * Process messages from the queue (long polling)
 * @param {Function} handler - Message handler function (async)
 * @param {Object} options - Processing options
 */
export async function processQueue(handler, options = {}) {
  const {
    maxMessages = 10,
    waitTimeSeconds = 20,
    visibilityTimeout = 300,
    stopOnError = false,
  } = options;

  console.log('🔄 Starting queue processor...');

  let isRunning = true;

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('⚠️  SIGTERM received, stopping queue processor...');
    isRunning = false;
  });

  while (isRunning) {
    try {
      // Receive messages (long polling)
      const command = new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
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
          const body = JSON.parse(message.Body);

          console.log('⚙️  Processing message:', message.MessageId);

          // Execute handler
          await handler(body, message);

          // Delete message after successful processing
          await deleteMessage(message.ReceiptHandle);

          console.log('✅ Message processed:', message.MessageId);
        } catch (error) {
          console.error('❌ Message processing error:', error);
          console.error('Message ID:', message.MessageId);
          console.error('Message body:', message.Body);

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

  console.log('🛑 Queue processor stopped');
}

/**
 * Delete a message from the queue
 * @param {string} receiptHandle - Message receipt handle
 * @returns {Promise<void>}
 */
export async function deleteMessage(receiptHandle) {
  try {
    const command = new DeleteMessageCommand({
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle,
    });

    await sqsClient.send(command);
  } catch (error) {
    console.error('❌ SQS delete error:', error);
    throw new Error(`Failed to delete message: ${error.message}`);
  }
}

/**
 * Get queue statistics
 * @returns {Promise<Object>} - Queue metrics
 */
export async function getQueueStats() {
  try {
    const command = new GetQueueAttributesCommand({
      QueueUrl: QUEUE_URL,
      AttributeNames: [
        'ApproximateNumberOfMessages',
        'ApproximateNumberOfMessagesNotVisible',
        'ApproximateNumberOfMessagesDelayed',
      ],
    });

    const response = await sqsClient.send(command);

    const stats = {
      messagesAvailable: parseInt(response.Attributes.ApproximateNumberOfMessages, 10),
      messagesInFlight: parseInt(response.Attributes.ApproximateNumberOfMessagesNotVisible, 10),
      messagesDelayed: parseInt(response.Attributes.ApproximateNumberOfMessagesDelayed, 10),
    };

    console.log('📊 Queue stats:', stats);

    return stats;
  } catch (error) {
    console.error('❌ SQS stats error:', error);
    throw new Error(`Failed to get queue stats: ${error.message}`);
  }
}

/**
 * Batch send messages (up to 10 at a time)
 * @param {Array<Object>} messages - Array of message bodies
 * @returns {Promise<Array<string>>} - Array of message IDs
 */
export async function batchSendToQueue(messages) {
  try {
    if (messages.length > 10) {
      throw new Error('Batch size cannot exceed 10 messages');
    }

    // Note: Batch operations require different SQS command
    // For simplicity, sending individually here
    const messageIds = [];
    for (const message of messages) {
      const id = await sendToQueue(message);
      messageIds.push(id);
    }

    console.log(`✅ Batch sent ${messageIds.length} messages`);

    return messageIds;
  } catch (error) {
    console.error('❌ Batch send error:', error);
    throw new Error(`Failed to batch send messages: ${error.message}`);
  }
}

// Example: Document processing message handler
export async function handleDocumentProcessing(messageBody, rawMessage) {
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
