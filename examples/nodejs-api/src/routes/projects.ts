/**
 * Project API Routes (TypeScript)
 * RESTful endpoints for project management with repository pattern and DTO validation
 *
 * Implements standard REST patterns with proper error handling and status codes.
 * Uses ProjectService for business logic and DTOs for validation.
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadDocument, getPresignedUrl } from '../services/s3.service';
import { sendMessage } from '../services/sqs.service';
import { query } from '../config/database';
import { projectService } from '../services/ProjectService';
import {
  validateBody,
  validateQuery,
} from '../middleware/validation.middleware';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  TransitionProjectDTO,
  UpdateProjectStatusDTO,
  ProjectQueryDTO,
} from '../dtos/project.dto';
import { NotFoundException, ValidationException } from '../exceptions/index';

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
router.get('/', validateQuery(ProjectQueryDTO), async (req: Request, res: Response) => {
  try {
    const queryParams = (req as any).dto as ProjectQueryDTO;

    const result = await projectService.listProjects(queryParams);

    res.json({
      success: true,
      data: result.items,
      pagination: result.meta,
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

    const project = await projectService.getProjectById(id);

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
    });
  }
});

/**
 * GET /api/v1/projects/:id/feasibility
 * Get project feasibility record
 */
router.get('/:id/feasibility', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const feasibility = await projectService.getProjectFeasibility(id);

    if (!feasibility) {
      return res.status(404).json({
        success: false,
        error: 'Feasibility record not found for this project',
      });
    }

    res.json({
      success: true,
      data: feasibility,
    });
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    console.error('Error fetching feasibility:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feasibility',
    });
  }
});

/**
 * GET /api/v1/projects/:id/entitlements
 * Get project entitlements (permit documents)
 */
router.get('/:id/entitlements', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const entitlements = await projectService.getProjectEntitlements(id);

    res.json({
      success: true,
      data: {
        entitlements,
        count: entitlements.length,
      },
    });
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    console.error('Error fetching entitlements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch entitlements',
    });
  }
});

/**
 * POST /api/v1/projects
 * Create a new project
 */
router.post('/', validateBody(CreateProjectDTO), async (req: Request, res: Response) => {
  try {
    const createDTO = (req as any).dto as CreateProjectDTO;

    const project = await projectService.createProject(createDTO);

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
router.patch('/:id', validateBody(UpdateProjectDTO), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateDTO = (req as any).dto as UpdateProjectDTO;

    const project = await projectService.updateProject(id, updateDTO);

    console.log('✅ Project updated:', id);

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

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
router.post(
  '/:id/transition',
  validateBody(TransitionProjectDTO),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const transitionDTO = (req as any).dto as TransitionProjectDTO;

      const project = await projectService.transitionStatus(id, transitionDTO);

      console.log(`✅ Project ${id} transitioned to: ${transitionDTO.status}`);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error instanceof ValidationException) {
        return res.status(400).json({
          success: false,
          error: error.message,
          details: (error as any).details,
        });
      }

      console.error('Error transitioning project:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to transition project',
      });
    }
  }
);

/**
 * PATCH /api/v1/projects/:id/status
 * Update project status (admin override - no validation)
 */
router.patch(
  '/:id/status',
  validateBody(UpdateProjectStatusDTO),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const statusDTO = (req as any).dto as UpdateProjectStatusDTO;

      const project = await projectService.updateStatus(id, statusDTO.status);

      console.log(`✅ Project ${id} status updated to: ${statusDTO.status}`);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      console.error('Error updating project status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update project status',
      });
    }
  }
);

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

    // Verify project exists using service
    await projectService.getProjectById(projectId);

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
    const queueUrl = process.env.DOCUMENT_PROCESSING_QUEUE_URL || '';
    await sendMessage(queueUrl, {
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
    if (error instanceof NotFoundException) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

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

    // Verify project exists
    await projectService.getProjectById(projectId);

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
    if (error instanceof NotFoundException) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

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

    // Verify project exists
    await projectService.getProjectById(projectId);

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
    const downloadUrl = await getPresignedUrl(document.storage_key, 3600);

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
    if (error instanceof NotFoundException) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    console.error('Error generating download URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate download URL',
    });
  }
});

export default router;
