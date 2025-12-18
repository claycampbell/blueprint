import 'reflect-metadata';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Feasibility } from './Feasibility.entity';
import { Contact } from './Contact.entity';
import { ConsultantTaskType, ConsultantTaskStatus } from '../types';

/**
 * ConsultantTask entity representing work ordered from external consultants during feasibility.
 *
 * Common task types:
 * - SURVEY: Property boundary and topographic surveys
 * - TITLE: Title reports and ownership verification
 * - ARBORIST: Tree inventory and protected species assessment
 * - CIVIL: Civil engineering analysis
 * - GEOTECHNICAL: Soil and foundation studies
 *
 * Workflow: ORDERED → IN_PROGRESS → DELIVERED → APPROVED/REJECTED
 */
@Entity({ schema: 'connect2', name: 'consultant_tasks' })
@Index('idx_consultant_tasks_feasibility', ['feasibility_id'])
@Index('idx_consultant_tasks_consultant', ['consultant_id'])
@Index('idx_consultant_tasks_status', ['status'])
@Index('idx_consultant_tasks_due_date', ['due_date'])
export class ConsultantTask extends BaseEntity {
  /**
   * Foreign key: Feasibility ID this task belongs to.
   */
  @Column({ type: 'uuid' })
  feasibility_id: string = '';

  /**
   * Foreign key: Contact ID of the consultant assigned to this task.
   * References the contacts table (type: CONSULTANT).
   */
  @Column({ type: 'uuid', nullable: true })
  consultant_id: string | null = null;

  /**
   * Type of consultant work being requested.
   * Examples: SURVEY, TITLE, ARBORIST, CIVIL, GEOTECHNICAL
   */
  @Column({ type: 'varchar', length: 50 })
  task_type: ConsultantTaskType = ConsultantTaskType.SURVEY;

  /**
   * Current status of the consultant task.
   * Default: ORDERED
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: ConsultantTaskStatus.ORDERED,
  })
  status: ConsultantTaskStatus = ConsultantTaskStatus.ORDERED;

  /**
   * Date when the task was ordered from the consultant.
   */
  @Column({ type: 'date', nullable: true })
  ordered_date: Date | null = null;

  /**
   * Expected delivery date for the consultant's work.
   */
  @Column({ type: 'date', nullable: true })
  due_date: Date | null = null;

  /**
   * Actual date when the consultant delivered the completed work.
   */
  @Column({ type: 'date', nullable: true })
  delivered_date: Date | null = null;

  /**
   * Internal notes about the task, consultant communication, or deliverable quality.
   */
  @Column({ type: 'text', nullable: true })
  notes: string | null = null;

  // ============================================
  // Relationships
  // ============================================

  /**
   * Many-to-one relationship with Feasibility.
   * Multiple consultant tasks can belong to one feasibility assessment.
   */
  @ManyToOne(() => Feasibility, (feasibility) => feasibility.consultant_tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'feasibility_id' })
  feasibility?: Feasibility;

  /**
   * Many-to-one relationship with Contact (consultant).
   * References the external consultant who will complete this task.
   */
  @ManyToOne(() => Contact, { nullable: true })
  @JoinColumn({ name: 'consultant_id' })
  consultant?: Contact;
}
