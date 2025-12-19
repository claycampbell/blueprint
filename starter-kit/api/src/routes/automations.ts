import { Router } from 'express';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/v1/automations/rules
router.get('/rules', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM automation_rules WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/automations/rules
router.post('/rules', async (req, res) => {
  try {
    const { name, description, trigger_type, trigger_config, windmill_path } = req.body;
    const result = await pool.query(
      `INSERT INTO automation_rules (name, description, trigger_type, trigger_config, windmill_path)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, trigger_type, trigger_config, windmill_path]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/v1/automations/rules/:id
router.patch('/rules/:id', async (req, res) => {
  try {
    const { is_active } = req.body;
    const result = await pool.query(
      'UPDATE automation_rules SET is_active = $1 WHERE id = $2 RETURNING *',
      [is_active, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/automations/history
router.get('/history', async (req, res) => {
  try {
    const { entity_type, entity_id, status } = req.query;
    let query = 'SELECT * FROM workflow_executions WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (entity_type) {
      query += ` AND entity_type = $${++paramCount}`;
      params.push(entity_type);
    }

    if (entity_id) {
      query += ` AND entity_id = $${++paramCount}`;
      params.push(entity_id);
    }

    if (status) {
      query += ` AND status = $${++paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY started_at DESC LIMIT 100';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;