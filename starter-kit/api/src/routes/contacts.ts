import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET /api/v1/contacts
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM contacts WHERE is_active = true';
    const params: any[] = [];

    if (type) {
      query += ' AND type = $1';
      params.push(type);
    }

    query += ' ORDER BY last_name, first_name';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/contacts/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/contacts
router.post('/', async (req, res) => {
  try {
    const { type, first_name, last_name, email, phone, company, role } = req.body;
    const result = await pool.query(
      `INSERT INTO contacts (type, first_name, last_name, email, phone, company, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [type, first_name, last_name, email, phone, company, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;