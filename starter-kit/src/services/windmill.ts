/**
 * Windmill API Integration Service
 *
 * Provides a TypeScript interface for calling Windmill scripts and flows
 * from custom React components. Handles job submission, polling, and result retrieval.
 *
 * @see https://www.windmill.dev/docs/core_concepts/jobs
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface WindmillJobSubmitResponse {
  uuid: string;
  path: string;
  job_kind: 'script' | 'flow' | 'preview';
  workspace_id: string;
}

export interface WindmillJobStatusResponse {
  id: string;
  workspace_id: string;
  type: 'CompletedJob' | 'QueuedJob' | 'RunningJob';
  created_by: string;
  created_at: string;
  started_at?: string;
  duration_ms?: number;
  success?: boolean;
  result?: any;
  logs?: string;
  canceled?: boolean;
  canceled_by?: string;
  canceled_reason?: string;
  job_kind: 'script' | 'flow' | 'preview';
  schedule_path?: string;
  permissioned_as: string;
  flow_status?: any;
  raw_flow?: any;
  is_flow_step?: boolean;
  language?: 'python3' | 'deno' | 'go' | 'bash';
  is_skipped?: boolean;
  email?: string;
  visible_to_owner?: boolean;
  mem_peak?: number;
  tag?: string;
}

export interface WindmillScriptArgs {
  [key: string]: any;
}

export interface WindmillFlowArgs {
  [key: string]: any;
}

export interface WindmillServiceConfig {
  baseUrl?: string;
  workspace?: string;
  pollIntervalMs?: number;
  maxPollAttempts?: number;
  timeoutMs?: number;
}

export class WindmillError extends Error {
  constructor(
    message: string,
    public jobId?: string,
    public logs?: string
  ) {
    super(message);
    this.name = 'WindmillError';
  }
}

// ============================================================================
// WindmillService Class
// ============================================================================

export class WindmillService {
  private baseUrl: string;
  private workspace: string;
  private pollIntervalMs: number;
  private maxPollAttempts: number;
  private timeoutMs: number;

  constructor(config: WindmillServiceConfig = {}) {
    this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_WINDMILL_URL || 'http://localhost:8000';
    this.workspace = config.workspace || process.env.NEXT_PUBLIC_WINDMILL_WORKSPACE || 'admins';
    this.pollIntervalMs = config.pollIntervalMs || 500; // Poll every 500ms
    this.maxPollAttempts = config.maxPollAttempts || 120; // 60 seconds max (120 * 500ms)
    this.timeoutMs = config.timeoutMs || 60000; // 60 second default timeout
  }

  /**
   * Run a Windmill script and wait for the result
   *
   * @param path - Script path (e.g., "u/clay/loan_calculator_demo")
   * @param args - Script arguments matching the script's parameter schema
   * @returns Script execution result
   *
   * @example
   * ```typescript
   * const result = await windmill.runScript('u/clay/loan_calculator_demo', {
   *   loan_amount: 250000,
   *   annual_interest_rate: 6.5,
   *   term_months: 360
   * });
   * ```
   */
  async runScript(path: string, args: WindmillScriptArgs = {}): Promise<any> {
    // Use Next.js API route proxy to avoid CORS and hide API token
    const response = await fetch('/api/windmill/run-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, args }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new WindmillError(error.error || 'Failed to run script');
    }

    return response.json();
  }

  /**
   * Run a Windmill flow and wait for the result
   *
   * @param path - Flow path (e.g., "u/clay/loan_approval_demo")
   * @param args - Flow input arguments
   * @returns Flow execution result
   *
   * @example
   * ```typescript
   * const result = await windmill.runFlow('u/clay/loan_approval_demo', {
   *   loan_amount: 250000,
   *   borrower_name: "John Doe",
   *   credit_score: 750,
   *   property_value: 500000
   * });
   * ```
   */
  async runFlow(path: string, args: WindmillFlowArgs = {}): Promise<any> {
    // Use Next.js API route proxy to avoid CORS and hide API token
    const response = await fetch('/api/windmill/run-flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, args }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new WindmillError(error.error || 'Failed to run flow');
    }

    return response.json();
  }

  /**
   * Submit a script job without waiting for result
   *
   * @param path - Script path
   * @param args - Script arguments
   * @returns Job submission response with job UUID
   */
  async submitScript(path: string, args: WindmillScriptArgs = {}): Promise<WindmillJobSubmitResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/w/${this.workspace}/jobs/run/p/${path}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(args),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new WindmillError(
          `Failed to submit script: ${response.status} ${response.statusText}\n${errorText}`
        );
      }

      const job: WindmillJobSubmitResponse = await response.json();
      return job;
    } catch (error) {
      if (error instanceof WindmillError) {
        throw error;
      }
      throw new WindmillError(`Failed to submit script: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Submit a flow job without waiting for result
   *
   * @param path - Flow path
   * @param args - Flow arguments
   * @returns Job submission response with job UUID
   */
  async submitFlow(path: string, args: WindmillFlowArgs = {}): Promise<WindmillJobSubmitResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/w/${this.workspace}/jobs/run/f/${path}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(args),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new WindmillError(
          `Failed to submit flow: ${response.status} ${response.statusText}\n${errorText}`
        );
      }

      const job: WindmillJobSubmitResponse = await response.json();
      return job;
    } catch (error) {
      if (error instanceof WindmillError) {
        throw error;
      }
      throw new WindmillError(`Failed to submit flow: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get the current status of a job
   *
   * @param jobId - Job UUID
   * @returns Job status response
   */
  async getJobStatus(jobId: string): Promise<WindmillJobStatusResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/w/${this.workspace}/jobs/completed/get/${jobId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new WindmillError(
          `Failed to get job status: ${response.status} ${response.statusText}`,
          jobId
        );
      }

      const status: WindmillJobStatusResponse = await response.json();
      return status;
    } catch (error) {
      if (error instanceof WindmillError) {
        throw error;
      }
      throw new WindmillError(
        `Failed to get job status: ${error instanceof Error ? error.message : String(error)}`,
        jobId
      );
    }
  }

  /**
   * Wait for a job to complete by polling its status
   *
   * @param jobId - Job UUID
   * @returns Job result
   * @throws WindmillError if job fails or times out
   */
  async waitForJob(jobId: string): Promise<any> {
    const startTime = Date.now();
    let attempts = 0;

    while (attempts < this.maxPollAttempts) {
      // Check timeout
      if (Date.now() - startTime > this.timeoutMs) {
        throw new WindmillError(
          `Job timed out after ${this.timeoutMs}ms`,
          jobId
        );
      }

      try {
        const status = await this.getJobStatus(jobId);

        // Job completed successfully
        if (status.type === 'CompletedJob' && status.success) {
          return status.result;
        }

        // Job failed
        if (status.type === 'CompletedJob' && !status.success) {
          throw new WindmillError(
            `Job failed: ${status.result?.error || 'Unknown error'}`,
            jobId,
            status.logs
          );
        }

        // Job was canceled
        if (status.canceled) {
          throw new WindmillError(
            `Job was canceled: ${status.canceled_reason || 'No reason provided'}`,
            jobId,
            status.logs
          );
        }

        // Job still running or queued - wait and retry
        await this.sleep(this.pollIntervalMs);
        attempts++;
      } catch (error) {
        // If job not found yet (404), it might still be initializing
        if (error instanceof WindmillError && error.message.includes('404')) {
          await this.sleep(this.pollIntervalMs);
          attempts++;
          continue;
        }
        throw error;
      }
    }

    throw new WindmillError(
      `Job polling exceeded max attempts (${this.maxPollAttempts})`,
      jobId
    );
  }

  /**
   * Helper function to sleep for a specified number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test connection to Windmill server
   *
   * @returns True if connection successful
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// Default Export
// ============================================================================

// Create a default singleton instance
const windmill = new WindmillService();

export default windmill;
