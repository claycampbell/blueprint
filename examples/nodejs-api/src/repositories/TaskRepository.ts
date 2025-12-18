/**
 * TaskRepository - Production Implementation
 *
 * Manages all database operations for Task entities with features for
 * assignment management, overdue tracking, and progress monitoring.
 *
 * @example
 * import { taskRepository } from './repositories';
 *
 * // Find tasks assigned to a user
 * const myTasks = await taskRepository.findByAssignee(userId);
 *
 * // Find overdue tasks
 * const overdue = await taskRepository.findOverdueTasks();
 *
 * // Reassign a task
 * await taskRepository.reassignTask(taskId, newAssigneeId);
 *
 * // Update task progress
 * await taskRepository.updateProgress(taskId, 75);
 */

import { BaseRepository } from './BaseRepository';
import { Task, TaskStatus, TaskPriority } from '../types';
import { NotFoundException, ValidationException } from '../exceptions';

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super('tasks', 'connect2');
  }

  /**
   * Find all tasks assigned to a specific user
   *
   * @param assigneeId - The user ID
   * @returns Array of tasks assigned to the user
   *
   * @example
   * const myTasks = await repo.findByAssignee(userId)
   */
  async findByAssignee(assigneeId: string): Promise<Task[]> {
    return this.findByConditions({ assigned_to: assigneeId });
  }

  /**
   * Find all overdue tasks
   *
   * Returns tasks where:
   * - due_date is in the past
   * - status is not COMPLETED or CANCELLED
   *
   * Results ordered by due_date (most overdue first).
   *
   * @returns Array of overdue tasks
   *
   * @example
   * const overdue = await repo.findOverdueTasks()
   * for (const task of overdue) {
   *   console.log(`Task "${task.title}" is ${daysPastDue(task.due_date)} days overdue`)
   * }
   */
  async findOverdueTasks(): Promise<Task[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE due_date < CURRENT_DATE
        AND status NOT IN ($1, $2)
        AND deleted_at IS NULL
      ORDER BY due_date ASC, priority DESC
    `;
    const result = await this.executeQuery(sql, [TaskStatus.COMPLETED, TaskStatus.CANCELLED]);
    return result.rows as Task[];
  }

  /**
   * Reassign a task to a different user
   *
   * Updates the assigned_to field and sets status to IN_PROGRESS if currently PENDING.
   * Automatically updates the updated_at timestamp.
   *
   * @param taskId - The task ID
   * @param newAssigneeId - The new assignee user ID
   * @returns Updated task
   * @throws NotFoundException if task not found
   *
   * @example
   * const task = await repo.reassignTask('task-uuid', 'new-user-uuid')
   */
  async reassignTask(taskId: string, newAssigneeId: string): Promise<Task> {
    const task = await this.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task', taskId);
    }

    // If task is PENDING, move to IN_PROGRESS when assigned
    const updates: Partial<Task> = {
      assigned_to: newAssigneeId,
    };

    if (task.status === TaskStatus.PENDING) {
      updates.status = TaskStatus.IN_PROGRESS;
    }

    return this.update(taskId, updates);
  }

  /**
   * Find all tasks for a specific project
   *
   * @param projectId - The project ID
   * @returns Array of tasks associated with the project
   *
   * @example
   * const projectTasks = await repo.findByProject('project-uuid')
   */
  async findByProject(projectId: string): Promise<Task[]> {
    return this.findByConditions({ project_id: projectId });
  }

  /**
   * Update task progress/status
   *
   * Updates the task status based on business rules:
   * - Setting to COMPLETED requires current status to be IN_PROGRESS
   * - Cannot modify CANCELLED or COMPLETED tasks
   *
   * @param taskId - The task ID
   * @param newStatus - The new status
   * @returns Updated task
   * @throws NotFoundException if task not found
   * @throws ValidationException if status transition is invalid
   *
   * @example
   * const task = await repo.updateProgress('task-uuid', TaskStatus.COMPLETED)
   */
  async updateProgress(taskId: string, newStatus: TaskStatus): Promise<Task> {
    const task = await this.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task', taskId);
    }

    // Cannot modify completed or cancelled tasks
    if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED) {
      throw new ValidationException(
        `Cannot modify task with status ${task.status}`,
        {
          currentStatus: task.status,
          attemptedStatus: newStatus,
        }
      );
    }

    // Validate status transitions
    if (newStatus === TaskStatus.COMPLETED && task.status !== TaskStatus.IN_PROGRESS) {
      throw new ValidationException(
        'Can only complete tasks that are IN_PROGRESS',
        {
          currentStatus: task.status,
          attemptedStatus: newStatus,
        }
      );
    }

    return this.update(taskId, { status: newStatus });
  }

  /**
   * Find tasks by status
   *
   * @param status - The task status to filter by
   * @returns Array of tasks with the specified status
   *
   * @example
   * const inProgress = await repo.findByStatus(TaskStatus.IN_PROGRESS)
   */
  async findByStatus(status: TaskStatus): Promise<Task[]> {
    return this.findByConditions({ status });
  }

  /**
   * Find tasks by priority
   *
   * @param priority - The task priority level
   * @returns Array of tasks with the specified priority
   *
   * @example
   * const urgentTasks = await repo.findByPriority(TaskPriority.URGENT)
   */
  async findByPriority(priority: TaskPriority): Promise<Task[]> {
    return this.findByConditions({ priority });
  }

  /**
   * Find tasks due within a date range
   *
   * @param startDate - Start of date range (inclusive)
   * @param endDate - End of date range (inclusive)
   * @returns Array of tasks due within the range
   *
   * @example
   * // Find tasks due this week
   * const thisWeek = await repo.findDueInRange(
   *   new Date(),
   *   new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
   * )
   */
  async findDueInRange(startDate: Date, endDate: Date): Promise<Task[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE due_date BETWEEN $1 AND $2
        AND status NOT IN ($3, $4)
        AND deleted_at IS NULL
      ORDER BY due_date ASC, priority DESC
    `;
    const result = await this.executeQuery(sql, [
      startDate,
      endDate,
      TaskStatus.COMPLETED,
      TaskStatus.CANCELLED,
    ]);
    return result.rows as Task[];
  }

  /**
   * Find tasks assigned to a contact (external user)
   *
   * Used for tasks assigned to builders, consultants, or agents.
   *
   * @param contactId - The contact ID
   * @returns Array of tasks assigned to the contact
   *
   * @example
   * const builderTasks = await repo.findByContact('builder-contact-uuid')
   */
  async findByContact(contactId: string): Promise<Task[]> {
    return this.findByConditions({ assigned_contact: contactId });
  }
}

// Export singleton instance
export const taskRepository = new TaskRepository();
