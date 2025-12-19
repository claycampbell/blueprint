import { Router } from 'express';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/v1/projects
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/projects
router.post('/', async (req, res) => {
  try {
    const { name, address, city, state, zip, builder_id, project_type } = req.body;
    const result = await pool.query(
      `INSERT INTO projects (name, address, city, state, zip, builder_id, project_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, address, city, state, zip, builder_id, project_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/v1/projects/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status, stage } = req.body;
    const result = await pool.query(
      'UPDATE projects SET status = $1, stage = $2 WHERE id = $3 RETURNING *',
      [status, stage, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;