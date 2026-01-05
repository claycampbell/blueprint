import 'reflect-metadata';
import { Entity, Column, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Project } from './Project.entity';
import { PermitCorrection } from './PermitCorrection.entity';
import { EntitlementStatus } from '../types';

/**
 * Entitlement entity representing the municipal permitting and approval process.
 *
 * Entitlement tracks the process of securing development approvals from local jurisdictions:
 * - Plan selection and submission preparation
 * - Municipal review and feedback cycles
 * - Permit corrections and resubmissions
 * - Final approval or denial
 *
 * Workflow: PLANNING → SUBMITTED → UNDER_REVIEW → CORRECTIONS → APPROVED/DENIED
 *
 * Key relationship:
 * - project_id: One-to-one with Project (cascade delete)
 * - permit_corrections: Multiple correction cycles during review process
 */
@Entity({ schema: 'connect2', name: 'entitlement' })
@Index('idx_entitlement_project_id', ['project_id'])
@Index('idx_entitlement_status', ['status'])
export class Entitlement extends BaseEntity {
  /**
   * Foreign key: Project ID this entitlement belongs to.
   * Unique constraint enforces one-to-one relationship.
   */
  @Column({ type: 'uuid', unique: true })
  project_id: string = '';

  /**
   * Foreign key: Reference to the selected plan from the plan library.
   * Future feature - currently nullable.
   */
  @Column({ type: 'uuid', nullable: true })
  selected_plan_id: string | null = null;

  /**
   * Municipal permit number assigned by the jurisdiction.
   * Populated once the permit application is submitted.
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  permit_number: string | null = null;

  /**
   * Date when the permit application was submitted to the municipality.
   */
  @Column({ type: 'date', nullable: true })
  submitted_date: Date | null = null;

  /**
   * Date when the permit was approved by the municipality.
   */
  @Column({ type: 'date', nullable: true })
  approved_date: Date | null = null;

  /**
   * Current status of the entitlement process.
   * Default: PLANNING
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: EntitlementStatus.PLANNING,
  })
  status: EntitlementStatus = EntitlementStatus.PLANNING;

  /**
   * Name of the jurisdiction/municipality reviewing the permit.
   * Examples: "City of Seattle", "King County", "City of Phoenix"
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  jurisdiction: string | null = null;

  // ============================================
  // Relationships
  // ============================================

  /**
   * One-to-one relationship with the parent Project.
   * Cascade delete: deleting the project deletes this entitlement record.
   */
  @OneToOne(() => Project, (project) => project.entitlement, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  /**
   * One-to-many relationship with permit corrections.
   * Tracks multiple correction/review cycles with the municipality.
   */
  @OneToMany(() => PermitCorrection, (correction) => correction.entitlement, {
    cascade: true,
  })
  permit_corrections?: PermitCorrection[];
}
