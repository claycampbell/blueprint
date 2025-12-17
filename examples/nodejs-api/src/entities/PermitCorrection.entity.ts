import 'reflect-metadata';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Entitlement } from './Entitlement.entity';

/**
 * PermitCorrection entity representing municipal review feedback and correction cycles.
 *
 * During the entitlement process, municipalities often request corrections or additional
 * information before approving permits. Each correction cycle is tracked here with:
 * - City feedback and requested changes
 * - Action items to address the feedback
 * - Submission and resolution dates
 *
 * Correction cycles are numbered sequentially (1, 2, 3, etc.) for each entitlement.
 */
@Entity({ schema: 'connect2', name: 'permit_corrections' })
export class PermitCorrection extends BaseEntity {
  /**
   * Foreign key: Entitlement ID this correction belongs to.
   */
  @Column({ type: 'uuid' })
  entitlement_id: string = '';

  /**
   * Sequential correction cycle number.
   * First round of corrections is 1, second is 2, etc.
   */
  @Column({ type: 'integer' })
  correction_number: number = 1;

  /**
   * Feedback and comments from the municipality explaining required corrections.
   * May include references to code sections, plan deficiencies, or additional info needed.
   */
  @Column({ type: 'text', nullable: true })
  city_feedback: string | null = null;

  /**
   * Action items to address the city's feedback, stored as JSON.
   *
   * Example structure:
   * [
   *   {
   *     "item": "Update setback dimensions on Sheet A-1",
   *     "status": "completed",
   *     "assigned_to": "John Smith"
   *   },
   *   {
   *     "item": "Provide arborist report for protected tree",
   *     "status": "in_progress",
   *     "assigned_to": "Sarah Jones"
   *   }
   * ]
   */
  @Column({ type: 'jsonb', nullable: true })
  action_items: object | null = null;

  /**
   * Date when the corrected permit application was resubmitted to the municipality.
   */
  @Column({ type: 'date', nullable: true })
  submitted_date: Date | null = null;

  /**
   * Date when all corrections were resolved and accepted by the municipality.
   */
  @Column({ type: 'date', nullable: true })
  resolved_date: Date | null = null;

  // ============================================
  // Relationships
  // ============================================

  /**
   * Many-to-one relationship with Entitlement.
   * Multiple correction cycles can belong to one entitlement.
   */
  @ManyToOne(() => Entitlement, (entitlement) => entitlement.permit_corrections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entitlement_id' })
  entitlement?: Entitlement;
}
