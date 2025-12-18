/**
 * ProjectRepository - Production Implementation
 *
 * Manages all database operations for Project entities with custom
 * business logic for status transitions, relationship queries, and reporting.
 *
 * @example
 * import { projectRepository } from './repositories';
 *
 * // Find active projects
 * const activeProjects = await projectRepository.findActiveProjects();
 *
 * // Transition status with validation
 * await projectRepository.updateStatus(id, ProjectStatus.GO);
 *
 * // Load project with all related entities
 * const project = await projectRepository.findWithRelations(id);
 */

import { BaseRepository } from './BaseRepository';
import { Project, ProjectStatus, Feasibility, Loan, Document } from '../types';
import { NotFoundException, ValidationException } from '../exceptions';

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('projects', 'connect2');
  }

  /**
   * Find all projects with a specific status
   *
   * @param status - The project status to filter by
   * @returns Array of matching projects
   *
   * @example
   * const feasibilityProjects = await repo.findByStatus(ProjectStatus.FEASIBILITY)
   */
  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    return this.findByConditions({ status });
  }

  /**
   * Find all active projects (not PASS or CLOSED)
   *
   * Active projects include LEAD, FEASIBILITY, and GO statuses.
   *
   * @returns Array of active projects
   *
   * @example
   * const active = await repo.findActiveProjects()
   */
  async findActiveProjects(): Promise<Project[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE status IN ($1, $2, $3)
        AND deleted_at IS NULL
      ORDER BY updated_at DESC
    `;
    const result = await this.executeQuery(sql, [
      ProjectStatus.LEAD,
      ProjectStatus.FEASIBILITY,
      ProjectStatus.GO,
    ]);
    return result.rows as Project[];
  }

  /**
   * Update project status with validation
   *
   * Enforces valid status transition workflows:
   * - LEAD → FEASIBILITY or PASS
   * - FEASIBILITY → GO or PASS
   * - GO → CLOSED
   * - PASS cannot transition further
   * - CLOSED cannot transition
   *
   * @param id - The project ID
   * @param newStatus - The new status to transition to
   * @returns Updated project
   * @throws NotFoundException if project not found
   * @throws ValidationException if transition is invalid
   *
   * @example
   * const project = await repo.updateStatus(id, ProjectStatus.GO)
   */
  async updateStatus(id: string, newStatus: ProjectStatus): Promise<Project> {
    const project = await this.findById(id);
    if (!project) {
      throw new NotFoundException('Project', id);
    }

    // Validate status transition
    const currentStatus = project.status;

    // Cannot transition from terminal statuses
    if (currentStatus === ProjectStatus.PASS || currentStatus === ProjectStatus.CLOSED) {
      throw new ValidationException(
        `Cannot transition from ${currentStatus} status`,
        {
          currentStatus,
          attemptedStatus: newStatus,
        }
      );
    }

    // Validate allowed transitions
    const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
      [ProjectStatus.LEAD]: [ProjectStatus.FEASIBILITY, ProjectStatus.PASS],
      [ProjectStatus.FEASIBILITY]: [ProjectStatus.GO, ProjectStatus.PASS],
      [ProjectStatus.GO]: [ProjectStatus.CLOSED],
      [ProjectStatus.PASS]: [],
      [ProjectStatus.CLOSED]: [],
    };

    const allowed = validTransitions[currentStatus];
    if (!allowed.includes(newStatus)) {
      throw new ValidationException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        {
          currentStatus,
          attemptedStatus: newStatus,
          allowedStatuses: allowed,
        }
      );
    }

    return this.update(id, { status: newStatus });
  }

  /**
   * Find project with all related entities
   *
   * Loads project along with:
   * - Feasibility record (if exists)
   * - Loans associated with the project
   * - Documents associated with the project
   *
   * @param id - The project ID
   * @returns Project with relations or null if not found
   *
   * @example
   * const project = await repo.findWithRelations(id)
   * console.log(project.feasibility)
   * console.log(project.loans)
   * console.log(project.documents)
   */
  async findWithRelations(
    id: string
  ): Promise<(Project & { feasibility?: Feasibility; loans?: Loan[]; documents?: Document[] }) | null> {
    const project = await this.findById(id);
    if (!project) {
      return null;
    }

    // Load feasibility record
    const feasibilityQuery = `
      SELECT *
      FROM connect2.feasibility
      WHERE project_id = $1
        AND deleted_at IS NULL
      LIMIT 1
    `;
    const feasibilityResult = await this.executeQuery(feasibilityQuery, [id]);
    const feasibility = feasibilityResult.rows.length > 0 ? (feasibilityResult.rows[0] as Feasibility) : undefined;

    // Load loans
    const loansQuery = `
      SELECT *
      FROM connect2.loans
      WHERE project_id = $1
        AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const loansResult = await this.executeQuery(loansQuery, [id]);
    const loans = loansResult.rows as Loan[];

    // Load documents
    const documentsQuery = `
      SELECT *
      FROM connect2.documents
      WHERE project_id = $1
        AND deleted_at IS NULL
      ORDER BY uploaded_at DESC
    `;
    const documentsResult = await this.executeQuery(documentsQuery, [id]);
    const documents = documentsResult.rows as Document[];

    return {
      ...project,
      feasibility,
      loans,
      documents,
    };
  }

  /**
   * Find projects by city
   *
   * Case-insensitive city matching.
   *
   * @param city - The city name
   * @returns Array of projects in the specified city
   *
   * @example
   * const seattleProjects = await repo.findByCity('Seattle')
   */
  async findByCity(city: string): Promise<Project[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE LOWER(city) = LOWER($1)
        AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await this.executeQuery(sql, [city]);
    return result.rows as Project[];
  }

  /**
   * Search projects by address using fuzzy matching
   *
   * Uses ILIKE for case-insensitive partial matching on address field.
   *
   * @param query - The search query
   * @returns Array of matching projects (max 50)
   *
   * @example
   * const results = await repo.searchByAddress('main street')
   * // Finds: "123 Main Street", "456 Main St", etc.
   */
  async searchByAddress(query: string): Promise<Project[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE address ILIKE $1
        AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 50
    `;
    const result = await this.executeQuery(sql, [`%${query}%`]);
    return result.rows as Project[];
  }
}

// Export singleton instance
export const projectRepository = new ProjectRepository();
