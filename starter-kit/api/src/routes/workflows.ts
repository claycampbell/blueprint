import { Router } from 'express';
import { windmillService } from '../services/windmill.service';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Run a workflow immediately
 */
router.post('/run', async (req, res) => {
  try {
    const { workflow_name, inputs, entity_type, entity_id } = req.body;

    // Start the Windmill job
    const jobId = await windmillService.runFlow(workflow_name, inputs);

    // Record execution in our database
    const result = await pool.query(
      `INSERT INTO workflow_executions
       (windmill_job_id, workflow_name, entity_type, entity_id, status, input_data)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [jobId, workflow_name, entity_type, entity_id, 'RUNNING', inputs]
    );

    res.json({
      execution_id: result.rows[0].id,
      windmill_job_id: jobId,
      status: 'RUNNING',
    });
  } catch (error: any) {
    console.error('Error running workflow:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get workflow execution status
 */
router.get('/executions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get execution from database
    const execResult = await pool.query(
      'SELECT * FROM workflow_executions WHERE id = $1',
      [id]
    );

    if (execResult.rows.length === 0) {
      return res.status(404).json({ error: 'Execution not found' });
    }

    const execution = execResult.rows[0];

    // If still running, check Windmill for updates
    if (execution.status === 'RUNNING' && execution.windmill_job_id) {
      const job = await windmillService.getJob(execution.windmill_job_id);

      if (job.success !== undefined) {
        // Job completed, update our database
        const newStatus = job.success ? 'COMPLETED' : 'FAILED';
        await pool.query(
          `UPDATE workflow_executions
           SET status = $1, completed_at = $2, output_data = $3, error_message = $4
           WHERE id = $5`,
          [newStatus, new Date(), job.result, job.error, id]
        );

        execution.status = newStatus;
        execution.output_data = job.result;
        execution.error_message = job.error;
      }
    }

    res.json(execution);
  } catch (error: any) {
    console.error('Error getting execution:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * List available workflows
 */
router.get('/available', async (req, res) => {
  try {
    const flows = await windmillService.listFlows();
    res.json(flows);
  } catch (error: any) {
    console.error('Error listing workflows:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Trigger workflow based on business event
 */
router.post('/trigger', async (req, res) => {
  try {
    const { event_type, entity_type, entity_id, data } = req.body;

    // Find matching automation rules
    const rulesResult = await pool.query(
      `SELECT * FROM automation_rules
       WHERE trigger_type = $1 AND is_active = true`,
      [event_type]
    );

    const triggeredJobs = [];

    for (const rule of rulesResult.rows) {
      // Check if rule conditions match
      const triggerConfig = rule.trigger_config as any;

      // Simple condition matching (can be expanded)
      if (triggerConfig.entity_type && triggerConfig.entity_type !== entity_type) {
        continue;
      }

      // Trigger the workflow
      const jobId = await windmillService.runFlow(rule.windmill_path, {
        ...data,
        entity_type,
        entity_id,
        triggered_by_rule: rule.id,
      });

      // Record execution
      await pool.query(
        `INSERT INTO workflow_executions
         (windmill_job_id, workflow_name, entity_type, entity_id, status, input_data)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [jobId, rule.windmill_path, entity_type, entity_id, 'RUNNING', data]
      );

      triggeredJobs.push({
        rule_name: rule.name,
        job_id: jobId,
      });
    }

    res.json({
      event_type,
      triggered_count: triggeredJobs.length,
      jobs: triggeredJobs,
    });
  } catch (error: any) {
    console.error('Error triggering workflows:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;