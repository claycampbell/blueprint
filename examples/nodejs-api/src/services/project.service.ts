/**
 * Project Service - CRUD Operations for Projects
 * Handles all database operations for the projects table
 */

import { query, transaction } from '../config/database.js';
import {
  Project,
  ProjectWithRelations,
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectStatus,
  ProjectQueryParams,
} from '../types/index.js';

/**
 * Get all projects with optional filtering and pagination
 * @param {ProjectQueryParams} params - Query parameters for filtering and pagination
 * @returns {Promise<Project[]>} Array of projects
 */
export const getAllProjects = async (params: ProjectQueryParams = {}): Promise<Project[]> => {
  const {
    status,
    city,
    state,
    assigned_to,
    submitted_by,
    page = 1,
    limit = 50,
    sort = 'created_at',
    order = 'desc',
  } = params;

  // Build WHERE clause dynamically
  const conditions: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    values.push(status);
  }
  if (city) {
    conditions.push(`city ILIKE $${paramIndex++}`);
    values.push(`%${city}%`);
  }
  if (state) {
    conditions.push(`state = $${paramIndex++}`);
    values.push(state);
  }
  if (assigned_to) {
    conditions.push(`assigned_to = $${paramIndex++}`);
    values.push(assigned_to);
  }
  if (submitted_by) {
    conditions.push(`submitted_by = $${paramIndex++}`);
    values.push(submitted_by);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const queryText = `
    SELECT * FROM connect2.projects
    ${whereClause}
    ORDER BY ${sort} ${order.toUpperCase()}
    LIMIT $${paramIndex++} OFFSET $${paramIndex}
  `;
  values.push(limit, offset);

  const result = await query(queryText, values);
  return result.rows as Project[];
};

/**
 * Get a single project by ID with related data (JOINs)
 * @param {string} id - Project UUID
 * @returns {Promise<ProjectWithRelations | null>} Project with related entities or null
 */
export const getProjectById = async (id: string): Promise<ProjectWithRelations | null> => {
  const queryText = `
    SELECT
      p.*,
      -- Submitted by contact
      jsonb_build_object(
        'id', c1.id,
        'type', c1.type,
        'first_name', c1.first_name,
        'last_name', c1.last_name,
        'email', c1.email,
        'company_name', c1.company_name
      ) AS submitted_by_contact,
      -- Assigned to user
      jsonb_build_object(
        'id', u.id,
        'email', u.email,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'role', u.role
      ) AS assigned_to_user,
      -- Assigned builder contact
      jsonb_build_object(
        'id', c2.id,
        'type', c2.type,
        'first_name', c2.first_name,
        'last_name', c2.last_name,
        'email', c2.email,
        'company_name', c2.company_name
      ) AS assigned_builder_contact,
      -- Feasibility record
      jsonb_build_object(
        'id', f.id,
        'viability_score', f.viability_score,
        'go_decision_date', f.go_decision_date,
        'decision_notes', f.decision_notes,
        'proforma', f.proforma
      ) AS feasibility
    FROM connect2.projects p
    LEFT JOIN connect2.contacts c1 ON p.submitted_by = c1.id
    LEFT JOIN connect2.users u ON p.assigned_to = u.id
    LEFT JOIN connect2.contacts c2 ON p.assigned_builder = c2.id
    LEFT JOIN connect2.feasibility f ON p.id = f.project_id
    WHERE p.id = $1
  `;

  const result = await query(queryText, [id]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as ProjectWithRelations;
};

/**
 * Get a single project by project number
 * @param {string} projectNumber - Unique project number (e.g., "PROJ-2025-001")
 * @returns {Promise<Project | null>} Project or null
 */
export const getProjectByNumber = async (projectNumber: string): Promise<Project | null> => {
  const queryText = `
    SELECT * FROM connect2.projects
    WHERE project_number = $1
  `;

  const result = await query(queryText, [projectNumber]);
  return result.rows.length > 0 ? (result.rows[0] as Project) : null;
};

/**
 * Create a new project
 * @param {CreateProjectDTO} data - Project data
 * @returns {Promise<Project>} Created project
 */
export const createProject = async (data: CreateProjectDTO): Promise<Project> => {
  // Generate project number (format: PROJ-YYYY-NNN)
  const year = new Date().getFullYear();
  const countResult = await query(
    `SELECT COUNT(*) as count FROM connect2.projects WHERE project_number LIKE $1`,
    [`PROJ-${year}-%`]
  );
  const nextNumber = parseInt(String(countResult.rows[0].count)) + 1;
  const projectNumber = `PROJ-${year}-${String(nextNumber).padStart(3, '0')}`;

  const queryText = `
    INSERT INTO connect2.projects (
      project_number,
      address,
      city,
      state,
      zip,
      parcel_number,
      purchase_price,
      list_price,
      submitted_by,
      assigned_to,
      assigned_builder,
      internal_notes,
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;

  const values = [
    projectNumber,
    data.address,
    data.city || null,
    data.state || null,
    data.zip || null,
    data.parcel_number || null,
    data.purchase_price || null,
    data.list_price || null,
    data.submitted_by || null,
    data.assigned_to || null,
    data.assigned_builder || null,
    data.internal_notes || null,
    ProjectStatus.LEAD, // Default status
  ];

  const result = await query(queryText, values);
  return result.rows[0] as Project;
};

/**
 * Update an existing project
 * @param {string} id - Project UUID
 * @param {UpdateProjectDTO} data - Updated project data
 * @returns {Promise<Project | null>} Updated project or null if not found
 */
export const updateProject = async (id: string, data: UpdateProjectDTO): Promise<Project | null> => {
  // Build SET clause dynamically only for provided fields
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (data.address !== undefined) {
    fields.push(`address = $${paramIndex++}`);
    values.push(data.address);
  }
  if (data.city !== undefined) {
    fields.push(`city = $${paramIndex++}`);
    values.push(data.city);
  }
  if (data.state !== undefined) {
    fields.push(`state = $${paramIndex++}`);
    values.push(data.state);
  }
  if (data.zip !== undefined) {
    fields.push(`zip = $${paramIndex++}`);
    values.push(data.zip);
  }
  if (data.parcel_number !== undefined) {
    fields.push(`parcel_number = $${paramIndex++}`);
    values.push(data.parcel_number);
  }
  if (data.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    values.push(data.status);
  }
  if (data.purchase_price !== undefined) {
    fields.push(`purchase_price = $${paramIndex++}`);
    values.push(data.purchase_price);
  }
  if (data.list_price !== undefined) {
    fields.push(`list_price = $${paramIndex++}`);
    values.push(data.list_price);
  }
  if (data.submitted_by !== undefined) {
    fields.push(`submitted_by = $${paramIndex++}`);
    values.push(data.submitted_by);
  }
  if (data.assigned_to !== undefined) {
    fields.push(`assigned_to = $${paramIndex++}`);
    values.push(data.assigned_to);
  }
  if (data.assigned_builder !== undefined) {
    fields.push(`assigned_builder = $${paramIndex++}`);
    values.push(data.assigned_builder);
  }
  if (data.internal_notes !== undefined) {
    fields.push(`internal_notes = $${paramIndex++}`);
    values.push(data.internal_notes);
  }

  if (fields.length === 0) {
    // No fields to update
    return getProjectById(id);
  }

  values.push(id); // Add ID as last parameter

  const queryText = `
    UPDATE connect2.projects
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const result = await query(queryText, values);
  return result.rows.length > 0 ? (result.rows[0] as Project) : null;
};

/**
 * Transition a project to a new status
 * @param {string} id - Project UUID
 * @param {string} newStatus - New project status
 * @param {string} notes - Optional transition notes
 * @returns {Promise<Project | null>} Updated project or null if not found
 */
export const transitionProject = async (
  id: string,
  newStatus: ProjectStatus,
  notes?: string
): Promise<Project | null> => {
  return await transaction(async (client): Promise<Project> => {
    // Update the project status
    const updateQuery = `
      UPDATE connect2.projects
      SET status = $1, internal_notes = COALESCE($2, internal_notes)
      WHERE id = $3
      RETURNING *
    `;
    const result = await client.query(updateQuery, [newStatus, notes, id]);

    if (result.rows.length === 0) {
      throw new Error('Project not found');
    }

    // Log the transition in audit log
    const auditQuery = `
      INSERT INTO connect2.audit_log (
        table_name,
        record_id,
        action,
        new_values
      ) VALUES ($1, $2, $3, $4)
    `;
    await client.query(auditQuery, [
      'projects',
      id,
      'UPDATE',
      JSON.stringify({ status: newStatus, notes }),
    ]);

    return result.rows[0] as Project;
  });
};

/**
 * Delete a project (soft delete by setting status to CLOSED)
 * @param {string} id - Project UUID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export const deleteProject = async (id: string): Promise<boolean> => {
  const queryText = `
    UPDATE connect2.projects
    SET status = $1
    WHERE id = $2
  `;

  const result = await query(queryText, [ProjectStatus.CLOSED, id]);
  return (result.rowCount ?? 0) > 0;
};

/**
 * Hard delete a project (use with caution - cascades to related records)
 * @param {string} id - Project UUID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export const hardDeleteProject = async (id: string): Promise<boolean> => {
  const queryText = `
    DELETE FROM connect2.projects
    WHERE id = $1
  `;

  const result = await query(queryText, [id]);
  return (result.rowCount ?? 0) > 0;
};

/**
 * Get project statistics
 * @returns {Promise<object>} Project statistics by status
 */
export const getProjectStats = async (): Promise<object> => {
  const queryText = `
    SELECT
      status,
      COUNT(*) as count,
      AVG(purchase_price) as avg_purchase_price,
      SUM(purchase_price) as total_purchase_price
    FROM connect2.projects
    WHERE status != 'CLOSED'
    GROUP BY status
    ORDER BY status
  `;

  const result = await query(queryText, []);
  return result.rows;
};

/**
 * Search projects by address (fuzzy search)
 * @param {string} searchTerm - Search term for address
 * @returns {Promise<Project[]>} Matching projects
 */
export const searchProjectsByAddress = async (searchTerm: string): Promise<Project[]> => {
  const queryText = `
    SELECT *, similarity(address, $1) as similarity_score
    FROM connect2.projects
    WHERE address % $1
    ORDER BY similarity_score DESC
    LIMIT 10
  `;

  const result = await query(queryText, [searchTerm]);
  return result.rows as Project[];
};

export default {
  getAllProjects,
  getProjectById,
  getProjectByNumber,
  createProject,
  updateProject,
  transitionProject,
  deleteProject,
  hardDeleteProject,
  getProjectStats,
  searchProjectsByAddress,
};
