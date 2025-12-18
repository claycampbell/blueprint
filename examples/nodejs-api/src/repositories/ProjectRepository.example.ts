/**
 * ProjectRepository - Example Implementation
 *
 * This is an EXAMPLE showing how to extend BaseRepository to create
 * entity-specific repositories with custom query methods.
 *
 * This file demonstrates patterns for Phase B implementation but is not
 * yet integrated into the application. Use this as a reference when
 * implementing the actual ProjectRepository in DP01-162.
 *
 * @example
 * import { projectRepository } from './repositories';
 *
 * // Use inherited methods
 * const projects = await projectRepository.findAll({ page: 1, limit: 20 });
 *
 * // Use custom methods
 * const activeProjects = await projectRepository.findByStatus(ProjectStatus.FEASIBILITY);
 */

import { BaseRepository } from './BaseRepository';
import { Project, ProjectStatus } from '../types';
import { NotFoundException, ValidationException } from '../exceptions';

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    // Table name and schema for projects
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
   * Find all projects in a specific city
   *
   * @param city - The city to filter by
   * @returns Array of matching projects
   *
   * @example
   * const seattleProjects = await repo.findByCity('Seattle')
   */
  async findByCity(city: string): Promise<Project[]> {
    return this.findByConditions({ city });
  }

  /**
   * Find all projects assigned to a specific user
   *
   * @param userId - The user ID
   * @returns Array of matching projects
   *
   * @example
   * const myProjects = await repo.findAssignedTo(currentUser.id)
   */
  async findAssignedTo(userId: string): Promise<Project[]> {
    return this.findByConditions({ assigned_to: userId });
  }

  /**
   * Transition a project to a new status
   *
   * This method includes business logic validation for status transitions.
   * In a real implementation, this would enforce valid status workflows.
   *
   * @param id - The project ID
   * @param newStatus - The new status to transition to
   * @returns Updated project
   * @throws NotFoundException if project not found
   * @throws ValidationException if transition is invalid
   *
   * @example
   * const project = await repo.transitionStatus(
   *   'project-id',
   *   ProjectStatus.GO
   * )
   */
  async transitionStatus(id: string, newStatus: ProjectStatus): Promise<Project> {
    const project = await this.findById(id);
    if (!project) {
      throw new NotFoundException('Project', id);
    }

    // Example validation: Can't transition from CLOSED
    if (project.status === ProjectStatus.CLOSED) {
      throw new ValidationException(
        'Cannot transition from CLOSED status',
        {
          currentStatus: project.status,
          attemptedStatus: newStatus,
        }
      );
    }

    // Example validation: LEAD must go to FEASIBILITY next
    if (
      project.status === ProjectStatus.LEAD &&
      newStatus !== ProjectStatus.FEASIBILITY &&
      newStatus !== ProjectStatus.PASS
    ) {
      throw new ValidationException(
        'LEAD projects must transition to FEASIBILITY or PASS',
        {
          currentStatus: project.status,
          attemptedStatus: newStatus,
          allowedStatuses: [ProjectStatus.FEASIBILITY, ProjectStatus.PASS],
        }
      );
    }

    return this.update(id, { status: newStatus });
  }

  /**
   * Search projects by address using case-insensitive partial matching
   *
   * This demonstrates using custom SQL queries for complex searches.
   *
   * @param query - The search query
   * @returns Array of matching projects
   *
   * @example
   * const results = await repo.searchByName('main street')
   * // Finds: "123 Main Street", "456 Main St", etc.
   */
  async searchByName(query: string): Promise<Project[]> {
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

  /**
   * Get project summary statistics by status
   *
   * This demonstrates aggregation queries.
   *
   * @returns Object with count per status
   *
   * @example
   * const stats = await repo.getStatusSummary()
   * // { LEAD: 15, FEASIBILITY: 8, GO: 12, ... }
   */
  async getStatusSummary(): Promise<Record<ProjectStatus, number>> {
    const sql = `
      SELECT status, COUNT(*) as count
      FROM ${this.fullTableName}
      WHERE deleted_at IS NULL
      GROUP BY status
    `;
    const result = await this.executeQuery(sql);

    const summary: Record<string, number> = {};
    for (const row of result.rows) {
      summary[row.status] = parseInt(row.count, 10);
    }

    return summary as Record<ProjectStatus, number>;
  }

  /**
   * Find projects with recent activity (updated in last N days)
   *
   * @param days - Number of days to look back
   * @returns Array of recently updated projects
   *
   * @example
   * const recentProjects = await repo.findRecentlyUpdated(7) // Last 7 days
   */
  async findRecentlyUpdated(days: number = 7): Promise<Project[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE updated_at >= NOW() - INTERVAL '${days} days'
        AND deleted_at IS NULL
      ORDER BY updated_at DESC
    `;
    const result = await this.executeQuery(sql);
    return result.rows as Project[];
  }

  /**
   * Create a project with feasibility record in a transaction
   *
   * This demonstrates using transactions for multi-step operations.
   *
   * @param projectData - The project data
   * @returns Created project
   *
   * @example
   * const project = await repo.createWithFeasibility({
   *   address: '123 Main St',
   *   city: 'Seattle',
   *   status: ProjectStatus.FEASIBILITY
   * })
   */
  async createWithFeasibility(
    projectData: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Project> {
    return this.transaction(async (client) => {
      // Create project
      const projectResult = await client.query(
        `
        INSERT INTO ${this.fullTableName}
          (address, city, state, zip, status, parcel_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
        [
          projectData.address,
          projectData.city,
          projectData.state,
          projectData.zip,
          projectData.status || ProjectStatus.FEASIBILITY,
          projectData.parcel_number,
        ]
      );

      const project = projectResult.rows[0];

      // Create feasibility record
      await client.query(
        `
        INSERT INTO connect2.feasibility (project_id)
        VALUES ($1)
      `,
        [project.id]
      );

      return project as Project;
    });
  }
}

// Export singleton instance (optional pattern)
// Alternatively, use dependency injection in your services
export const projectRepository = new ProjectRepository();
