/**
 * Project API Routes (TypeScript)
 * RESTful endpoints for project management with S3 document integration
 *
 * Implements standard REST patterns with proper error handling and status codes
 */

import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadDocument, getDocumentSignedUrl } from '../services/s3Service.js';
import { sendToQueue } from '../services/queueService.js';
import { query } from '../config/database.js';

const router = express.Router();

// Configure multer for file uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept PDFs, images, and Office documents
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and Office docs allowed.'));
    }
  },
});

/**
 * GET /api/v1/projects
 * List all projects with pagination and filtering
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      status,
      city,
      limit = '50',
      offset = '0',
    } = req.query;

    let queryText = 'SELECT * FROM connect2.projects WHERE 1=1';
    const params: any[] = [];

    if (status && typeof status === 'string') {
      params.push(status);
      queryText += ` AND status = $${params.length}`;
    }

    if (city && typeof city === 'string') {
      params.push(city);
      queryText += ` AND city = $${params.length}`;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string, 10), parseInt(offset as string, 10));

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: {
        projects: result.rows,
        count: result.rows.length,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
      },
    });
  } catch (error) {
    console.error('Error listing projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list projects',
    });
  }
});

/**
 * GET /api/v1/projects/:id
 * Get project details by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM connect2.projects WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
    });
  }
});

/**
 * POST /api/v1/projects
 * Create a new project
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      address,
      city,
      state,
      zip,
      purchasePrice,
      listPrice,
      submittedBy,
      assignedTo,
    } = req.body;

    // Validate required fields
    if (!address || !city || !state) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: address, city, state',
      });
    }

    // Generate project number
    const projectNumber = `PROJ-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const result = await query(
      `INSERT INTO connect2.projects
       (project_number, address, city, state, zip, purchase_price, list_price, submitted_by, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [projectNumber, address, city, state, zip, purchasePrice, listPrice, submittedBy, assignedTo]
    );

    const project = result.rows[0];

    console.log('✅ Project created:', project.id);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
    });
  }
});

/**
 * PATCH /api/v1/projects/:id
 * Update project details
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic UPDATE query
    const allowedFields = ['status', 'purchase_price', 'list_price', 'assigned_to', 'assigned_builder', 'internal_notes'];
    const setClause: string[] = [];
    const params: any[] = [];

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        params.push(updates[key]);
        setClause.push(`${key} = $${params.length}`);
      }
    });

    if (setClause.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      });
    }

    params.push(id);
    const queryText = `
      UPDATE connect2.projects
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${params.length}
      RETURNING *
    `;

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    console.log('✅ Project updated:', id);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
    });
  }
});

/**
 * POST /api/v1/projects/:id/transition
 * Transition project status (LEAD → FEASIBILITY → GO, etc.)
 */
router.post('/:id/transition', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['LEAD', 'FEASIBILITY', 'GO', 'PASS', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const result = await query(
      `UPDATE connect2.projects
       SET status = $1, internal_notes = COALESCE(internal_notes, '') || $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, notes ? `\n[${new Date().toISOString()}] ${notes}` : '', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    const project = result.rows[0];

    console.log(`✅ Project ${id} transitioned to: ${status}`);

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error transitioning project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transition project',
    });
  }
});

/**
 * POST /api/v1/projects/:id/documents
 * Upload a document for a project (stores in S3 + database)
 */
router.post('/:id/documents', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { type, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
      });
    }

    // Verify project exists
    const projectResult = await query(
      'SELECT id FROM connect2.projects WHERE id = $1',
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    // Upload to S3
    const s3Result = await uploadDocument(file.buffer, file.originalname, {
      projectId,
      type: type || 'general',
      contentType: file.mimetype,
      uploadedBy: (req as any).user?.id || 'system', // Assumes auth middleware sets req.user
    });

    // Save document record in database
    const docResult = await query(
      `INSERT INTO connect2.documents
       (project_id, type, filename, storage_bucket, storage_key, file_size, mime_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        projectId,
        type || 'general',
        file.originalname,
        s3Result.bucket,
        s3Result.key,
        file.size,
        file.mimetype,
        (req as any).user?.id || null,
      ]
    );

    const document = docResult.rows[0];

    // Queue document for processing (AI extraction, etc.)
    await sendToQueue({
      action: 'extract',
      documentId: document.id,
      s3Key: s3Result.key,
      documentType: type,
    });

    console.log('✅ Document uploaded:', document.id);

    res.status(201).json({
      success: true,
      data: {
        ...document,
        storageUrl: s3Result.url,
      },
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload document',
    });
  }
});

/**
 * GET /api/v1/projects/:id/documents
 * List all documents for a project
 */
router.get('/:id/documents', async (req: Request, res: Response) => {
  try {
    const { id: projectId } = req.params;

    const result = await query(
      `SELECT * FROM connect2.documents
       WHERE project_id = $1
       ORDER BY uploaded_at DESC`,
      [projectId]
    );

    res.json({
      success: true,
      data: {
        documents: result.rows,
        count: result.rows.length,
      },
    });
  } catch (error) {
    console.error('Error listing documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list documents',
    });
  }
});

/**
 * GET /api/v1/projects/:id/documents/:docId/download
 * Generate pre-signed URL for document download
 */
router.get('/:id/documents/:docId/download', async (req: Request, res: Response) => {
  try {
    const { id: projectId, docId } = req.params;

    const result = await query(
      `SELECT * FROM connect2.documents
       WHERE id = $1 AND project_id = $2`,
      [docId, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
      });
    }

    const document = result.rows[0];

    // Generate pre-signed URL (valid for 1 hour)
    const downloadUrl = await getDocumentSignedUrl(document.storage_key, 3600);

    res.json({
      success: true,
      data: {
        documentId: document.id,
        filename: document.filename,
        downloadUrl,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate download URL',
    });
  }
});

export default router;
