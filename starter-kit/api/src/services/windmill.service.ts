import axios, { AxiosInstance } from 'axios';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'windmill' },
});

interface WindmillJob {
  id: string;
  created_at: string;
  started_at?: string;
  success?: boolean;
  result?: any;
  error?: string;
  flow_status?: any;
}

interface WindmillFlow {
  path: string;
  summary: string;
  description?: string;
  schema?: any;
}

interface WorkflowTrigger {
  type: 'webhook' | 'schedule' | 'manual';
  path: string;
  inputs: Record<string, any>;
}

class WindmillService {
  private client: AxiosInstance;
  private token: string;
  private workspace: string = 'starter'; // Default workspace

  constructor() {
    const baseURL = process.env.WINDMILL_URL || 'http://localhost:8000';
    this.token = process.env.WINDMILL_TOKEN || '';

    this.client = axios.create({
      baseURL: `${baseURL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth header if token is available
    if (this.token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }

    // Log all requests in development
    if (process.env.NODE_ENV === 'development') {
      this.client.interceptors.request.use((config) => {
        logger.debug('Windmill API Request:', {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      });
    }
  }

  /**
   * Initialize Windmill connection and get API token
   */
  async initialize(): Promise<void> {
    try {
      // In development, we can use the default admin credentials
      // In production, this should be configured via environment variables
      if (!this.token && process.env.NODE_ENV === 'development') {
        const response = await this.client.post('/auth/login', {
          email: 'admin@windmill.dev',
          password: 'changeme', // Default password, should be changed
        });
        this.token = response.data.token;
        this.client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        logger.info('Windmill service initialized with dev credentials');
      }
    } catch (error) {
      logger.error('Failed to initialize Windmill service:', error);
      throw error;
    }
  }

  /**
   * Run a Windmill flow
   */
  async runFlow(path: string, inputs: Record<string, any>): Promise<WindmillJob> {
    try {
      const response = await this.client.post(`/w/${this.workspace}/jobs/run/f/${path}`, inputs);
      logger.info(`Started Windmill flow: ${path}`, { jobId: response.data });
      return response.data;
    } catch (error) {
      logger.error(`Failed to run flow ${path}:`, error);
      throw error;
    }
  }

  /**
   * Run a Windmill script
   */
  async runScript(path: string, inputs: Record<string, any>): Promise<string> {
    try {
      const response = await this.client.post(`/w/${this.workspace}/jobs/run/p/${path}`, inputs);
      logger.info(`Started Windmill script: ${path}`, { jobId: response.data });
      return response.data; // Returns job ID
    } catch (error) {
      logger.error(`Failed to run script ${path}:`, error);
      throw error;
    }
  }

  /**
   * Get job status and result
   */
  async getJob(jobId: string): Promise<WindmillJob> {
    try {
      const response = await this.client.get(`/w/${this.workspace}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get job ${jobId}:`, error);
      throw error;
    }
  }

  /**
   * Wait for job completion
   */
  async waitForJob(jobId: string, timeoutMs: number = 30000): Promise<WindmillJob> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const job = await this.getJob(jobId);

      if (job.success !== undefined) {
        // Job completed
        return job;
      }

      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error(`Job ${jobId} timed out after ${timeoutMs}ms`);
  }

  /**
   * List available flows
   */
  async listFlows(): Promise<WindmillFlow[]> {
    try {
      const response = await this.client.get(`/w/${this.workspace}/flows/list`);
      return response.data;
    } catch (error) {
      logger.error('Failed to list flows:', error);
      throw error;
    }
  }

  /**
   * Create a webhook endpoint for a flow
   */
  async createWebhook(flowPath: string): Promise<string> {
    const webhookUrl = `${process.env.WINDMILL_URL}/api/w/${this.workspace}/jobs/run/f/${flowPath}`;
    logger.info(`Created webhook for flow ${flowPath}: ${webhookUrl}`);
    return webhookUrl;
  }

  /**
   * Schedule a flow to run periodically
   */
  async scheduleFlow(
    flowPath: string,
    schedule: string, // Cron expression
    inputs: Record<string, any> = {}
  ): Promise<void> {
    try {
      await this.client.post(`/w/${this.workspace}/schedules`, {
        path: flowPath,
        schedule,
        args: inputs,
        enabled: true,
      });
      logger.info(`Scheduled flow ${flowPath} with schedule: ${schedule}`);
    } catch (error) {
      logger.error(`Failed to schedule flow ${flowPath}:`, error);
      throw error;
    }
  }

  /**
   * Trigger a workflow based on business events
   */
  async triggerWorkflow(trigger: WorkflowTrigger): Promise<string> {
    switch (trigger.type) {
      case 'manual':
        return this.runScript(trigger.path, trigger.inputs);
      case 'webhook':
        // Webhook triggers are handled by Windmill directly
        return this.createWebhook(trigger.path);
      case 'schedule':
        // For scheduled triggers, we'd set up a cron job
        throw new Error('Schedule triggers not implemented yet');
      default:
        throw new Error(`Unknown trigger type: ${trigger.type}`);
    }
  }
}

// Export singleton instance
export const windmillService = new WindmillService();
export default WindmillService;