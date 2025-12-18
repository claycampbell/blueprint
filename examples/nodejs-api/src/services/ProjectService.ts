/**
 * ProjectService - Business Logic Layer for Projects
 *
 * Handles project-related business logic, validation, and orchestration.
 * Uses ProjectRepository for all data access operations.
 *
 * @example
 * import { projectService } from './services';
 *
 * const projects = await projectService.listProjects({ status: 'LEAD' });
 * const project = await projectService.createProject(createDTO);
 * await projectService.transitionStatus(id, ProjectStatus.GO);
 */

import { projectRepository } from '../repositories';
import { documentRepository } from '../repositories';
import {
  Project,
  ProjectStatus,
  CreateProjectDTO,
  UpdateProjectDTO,
  TransitionProjectDTO,
  ProjectQueryParams,
  Feasibility,
  Document,
  PaginatedResponse,
} from '../types';
import { PaginatedResult } from '../types/repository.types';
import { NotFoundException, ValidationException } from '../exceptions';

export class ProjectService {
  /**
   * List all projects with filtering and pagination
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated project results
   *
   * @example
   * const result = await projectService.listProjects({
   *   status: ProjectStatus.FEASIBILITY,
   *   city: 'Seattle',
   *   page: 1,
   *   limit: 20
   * })
   */
  async listProjects(params: ProjectQueryParams = {}): Promise<PaginatedResult<Project>> {
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

    // Build filter conditions
    const conditions: Record<string, any> = {};
    if (status) conditions.status = status;
    if (assigned_to) conditions.assigned_to = assigned_to;
    if (submitted_by) conditions.submitted_by = submitted_by;

    // For city/state, we need custom queries (ILIKE for city)
    if (city || state) {
      // Use repository's findByCity or custom query
      const projects = city
        ? await projectRepository.findByCity(city)
        : await projectRepository.findByConditions(conditions);

      // Filter by state if needed
      const filtered = state ? projects.filter((p) => p.state === state) : projects;

      // Manual pagination
      const offset = (page - 1) * limit;
      const paginatedItems = filtered.slice(offset, offset + limit);

      return {
        items: paginatedItems,
        meta: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
          hasNextPage: page * limit < filtered.length,
          hasPreviousPage: page > 1,
        },
      };
    }

    // Use repository pagination for standard queries
    return projectRepository.findAll(
      {
        page,
        limit,
        sortBy: sort,
        sortOrder: order.toUpperCase() as 'ASC' | 'DESC',
      },
      conditions
    );
  }

  /**
   * Get a single project by ID
   *
   * @param id - Project UUID
   * @returns Project entity
   * @throws NotFoundException if project not found
   *
   * @example
   * const project = await projectService.getProjectById(id)
   */
  async getProjectById(id: string): Promise<Project> {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException('Project', id);
    }
    return project;
  }

  /**
   * Get project with all related entities (feasibility, loans, documents)
   *
   * @param id - Project UUID
   * @returns Project with relations
   * @throws NotFoundException if project not found
   *
   * @example
   * const project = await projectService.getProjectWithRelations(id)
   * console.log(project.feasibility)
   * console.log(project.loans)
   */
  async getProjectWithRelations(id: string): Promise<Project & {
    feasibility?: Feasibility;
    loans?: any[];
    documents?: Document[];
  }> {
    const project = await projectRepository.findWithRelations(id);
    if (!project) {
      throw new NotFoundException('Project', id);
    }
    return project;
  }

  /**
   * Create a new project
   *
   * Generates a unique project number (PROJ-YYYY-NNN format).
   * Sets initial status to LEAD.
   *
   * @param data - Project creation data
   * @returns Created project
   *
   * @example
   * const project = await projectService.createProject({
   *   address: '123 Main St',
   *   city: 'Seattle',
   *   state: 'WA',
   *   purchase_price: 500000
   * })
   */
  async createProject(data: CreateProjectDTO): Promise<Project> {
    // Generate project number
    const projectNumber = await this.generateProjectNumber();

    // Create project with default status LEAD
    const project = await projectRepository.create({
      project_number: projectNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      parcel_number: data.parcel_number,
      purchase_price: data.purchase_price,
      list_price: data.list_price,
      submitted_by: data.submitted_by,
      assigned_to: data.assigned_to,
      assigned_builder: data.assigned_builder,
      internal_notes: data.internal_notes,
      status: ProjectStatus.LEAD,
    });

    return project;
  }

  /**
   * Update an existing project
   *
   * Only updates fields provided in the DTO (partial update).
   *
   * @param id - Project UUID
   * @param data - Updated project data
   * @returns Updated project
   * @throws NotFoundException if project not found
   *
   * @example
   * const updated = await projectService.updateProject(id, {
   *   assigned_to: userId,
   *   internal_notes: 'Updated notes'
   * })
   */
  async updateProject(id: string, data: UpdateProjectDTO): Promise<Project> {
    // Repository.update throws NotFoundException if not found
    return projectRepository.update(id, data);
  }

  /**
   * Transition project status with validation
   *
   * Enforces valid status transitions:
   * - LEAD → FEASIBILITY or PASS
   * - FEASIBILITY → GO or PASS
   * - GO → CLOSED
   * - PASS/CLOSED cannot transition
   *
   * @param id - Project UUID
   * @param data - Transition data (status + optional notes)
   * @returns Updated project
   * @throws NotFoundException if project not found
   * @throws ValidationException if transition is invalid
   *
   * @example
   * const project = await projectService.transitionStatus(id, {
   *   status: ProjectStatus.GO,
   *   notes: 'Approved for construction'
   * })
   */
  async transitionStatus(id: string, data: TransitionProjectDTO): Promise<Project> {
    // Repository.updateStatus handles validation and throws exceptions
    const project = await projectRepository.updateStatus(id, data.status);

    // Append notes if provided
    if (data.notes) {
      const timestamp = new Date().toISOString();
      const notesEntry = `\n[${timestamp}] ${data.notes}`;
      const currentNotes = project.internal_notes || '';

      await projectRepository.update(id, {
        internal_notes: currentNotes + notesEntry,
      });

      // Reload project with updated notes
      return this.getProjectById(id);
    }

    return project;
  }

  /**
   * Update project status (simpler than transition)
   *
   * Does NOT validate status transitions - use transitionStatus() for that.
   * Useful for admin overrides or corrections.
   *
   * @param id - Project UUID
   * @param status - New status
   * @returns Updated project
   * @throws NotFoundException if project not found
   */
  async updateStatus(id: string, status: ProjectStatus): Promise<Project> {
    return projectRepository.update(id, { status });
  }

  /**
   * Get project feasibility record
   *
   * @param id - Project UUID
   * @returns Feasibility record or null if none exists
   * @throws NotFoundException if project not found
   *
   * @example
   * const feasibility = await projectService.getProjectFeasibility(id)
   */
  async getProjectFeasibility(id: string): Promise<Feasibility | null> {
    // Verify project exists
    await this.getProjectById(id);

    // Get project with relations
    const project = await projectRepository.findWithRelations(id);
    return project?.feasibility || null;
  }

  /**
   * Get project entitlements (documents of type PERMIT)
   *
   * @param id - Project UUID
   * @returns Array of permit/entitlement documents
   * @throws NotFoundException if project not found
   *
   * @example
   * const entitlements = await projectService.getProjectEntitlements(id)
   */
  async getProjectEntitlements(id: string): Promise<Document[]> {
    // Verify project exists
    await this.getProjectById(id);

    // Get all documents for project filtered by PERMIT type
    const allDocs = await documentRepository.findByConditions({ project_id: id });
    return allDocs.filter((doc) => doc.type === 'PERMIT');
  }

  /**
   * Search projects by address
   *
   * @param query - Search query string
   * @returns Matching projects (max 50)
   *
   * @example
   * const results = await projectService.searchByAddress('main street')
   */
  async searchByAddress(query: string): Promise<Project[]> {
    if (!query || query.trim().length < 3) {
      throw new ValidationException('Search query must be at least 3 characters');
    }

    return projectRepository.searchByAddress(query.trim());
  }

  /**
   * Get active projects (not PASS or CLOSED)
   *
   * @returns Array of active projects
   *
   * @example
   * const activeProjects = await projectService.getActiveProjects()
   */
  async getActiveProjects(): Promise<Project[]> {
    return projectRepository.findActiveProjects();
  }

  /**
   * Soft delete a project
   *
   * Sets deleted_at timestamp. Project can be restored later.
   *
   * @param id - Project UUID
   * @throws NotFoundException if project not found
   *
   * @example
   * await projectService.deleteProject(id)
   */
  async deleteProject(id: string): Promise<void> {
    await projectRepository.softDelete(id);
  }

  /**
   * Restore a soft-deleted project
   *
   * @param id - Project UUID
   * @returns Restored project
   * @throws NotFoundException if project not found or not deleted
   *
   * @example
   * const restored = await projectService.restoreProject(id)
   */
  async restoreProject(id: string): Promise<Project> {
    return projectRepository.restore(id);
  }

  /**
   * Generate unique project number
   *
   * Format: PROJ-YYYY-NNN (e.g., PROJ-2025-001)
   *
   * @private
   * @returns Unique project number
   */
  private async generateProjectNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PROJ-${year}-`;

    // Count existing projects for this year
    const existingCount = await projectRepository.count({
      where: {},
    });

    // Use count + 1 for next number (could be improved with sequence)
    const nextNumber = String(existingCount + 1).padStart(3, '0');
    return `${prefix}${nextNumber}`;
  }
}

// Export singleton instance
export const projectService = new ProjectService();
