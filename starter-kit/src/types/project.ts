/**
 * Core Project entity for Connect 2.0 platform
 * Represents a construction/development project throughout its lifecycle
 */

export type ProjectStatus =
  | 'Active'
  | 'Feasibility'
  | 'Entitlement'
  | 'Construction'
  | 'Complete'
  | 'On Hold';

export interface Project {
  /**
   * Unique identifier for the project
   */
  id: string;

  /**
   * Project name (e.g., "Maple Ridge Townhomes")
   */
  name: string;

  /**
   * Current status in the development lifecycle
   */
  status: ProjectStatus;

  /**
   * Property address
   */
  address: string;

  /**
   * Date project was created in the system
   */
  createdAt: Date;

  /**
   * Optional: Brief project description
   */
  description?: string;

  /**
   * Optional: Number of units (for multi-family projects)
   */
  units?: number;
}

/**
 * Search query parameters for filtering projects
 */
export interface ProjectSearchParams {
  /**
   * Search term to match against project name and address
   */
  query?: string;

  /**
   * Filter by project status
   */
  status?: ProjectStatus;

  /**
   * Maximum number of results to return
   */
  limit?: number;
}

/**
 * API response wrapper for project search results
 */
export interface ProjectSearchResponse {
  /**
   * Array of matching projects
   */
  projects: Project[];

  /**
   * Total number of projects matching the query (before pagination)
   */
  total: number;

  /**
   * Search query that was executed
   */
  query?: string;
}
