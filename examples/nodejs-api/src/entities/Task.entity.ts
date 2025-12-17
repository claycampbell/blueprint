import 'reflect-metadata';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IsNotEmpty, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { TaskStatus, TaskPriority } from '../types/enums';

/**
 * Task entity for workflow management.
 * 
 * Represents actionable items assigned to team members or external contacts
 * (e.g., consultants). Tasks can be associated with projects, loans, or
 * stand-alone workflow items.
 * 
 * Relationships:
 * - Can be assigned to a User (internal team member, optional)
 * - Can be assigned to a Contact (external consultant, optional)
 * - Can be linked to a Project (optional)
 * - Can be linked to a Loan (optional)
 * - Has a creator (User, optional)
 * 
 * Note: All foreign key relationships are nullable to support flexible
 * task creation workflows.
 */
@Entity('tasks')
export class Task extends BaseEntity {
  /**
   * Task title/summary.
   * Required field, max 255 characters.
   */
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Task title is required' })
  @IsString()
  title: string = '';

  /**
   * Detailed task description.
   * Optional, supports long-form text.
   */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Internal team member assigned to this task.
   * Nullable to support unassigned tasks or consultant-assigned tasks.
   */
  @ManyToOne('User', 'assigned_tasks', { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assigned_to?: any; // Will be typed as User once that entity is created

  @Column({ name: 'assigned_to', type: 'uuid', nullable: true })
  @Index('idx_tasks_assigned_to')
  assigned_to_id?: string;

  /**
   * External contact (consultant) assigned to this task.
   * Nullable to support internal-only tasks.
   * Used when tasks are delegated to external parties.
   */
  @ManyToOne('Contact', 'assigned_tasks', { nullable: true })
  @JoinColumn({ name: 'assigned_contact' })
  assigned_contact?: any; // Will be typed as Contact once that entity is created

  @Column({ name: 'assigned_contact', type: 'uuid', nullable: true })
  assigned_contact_id?: string;

  /**
   * Project this task is associated with.
   * Nullable to support loan-only or standalone tasks.
   */
  @ManyToOne('Project', 'tasks', { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project?: any; // Will be typed as Project once that entity is created

  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  @Index('idx_tasks_project_id')
  project_id?: string;

  /**
   * Loan this task is associated with.
   * Nullable to support project-only or standalone tasks.
   */
  @ManyToOne('Loan', 'tasks', { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loan_id' })
  loan?: any; // Will be typed as Loan once that entity is created

  @Column({ name: 'loan_id', type: 'uuid', nullable: true })
  @Index('idx_tasks_loan_id')
  loan_id?: string;

  /**
   * Task due date.
   * Optional, supports DATE type (no time component).
   */
  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDateString()
  @Index('idx_tasks_due_date')
  due_date?: Date;

  /**
   * Current task status.
   * Defaults to PENDING.
   */
  @Column({ type: 'varchar', length: 50, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus, { message: 'Invalid task status' })
  @Index('idx_tasks_status')
  status: TaskStatus = TaskStatus.PENDING;

  /**
   * Task priority level.
   * Defaults to MEDIUM.
   */
  @Column({ type: 'varchar', length: 20, default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority, { message: 'Invalid task priority' })
  priority: TaskPriority = TaskPriority.MEDIUM;

  /**
   * User who created this task.
   * Nullable to support system-generated tasks.
   */
  @ManyToOne('User', 'created_tasks', { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by?: any; // Will be typed as User once that entity is created

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  created_by_id?: string;
}
