import 'reflect-metadata';
import { Entity, Column, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Project } from './Project.entity';
import { ConsultantTask } from './ConsultantTask.entity';

/**
 * Feasibility entity representing the 3-30 day due diligence assessment period.
 *
 * During feasibility, Blueprint evaluates project viability through:
 * - Site surveys and inspections
 * - Title reports and arborist assessments
 * - Civil engineering and geotechnical analysis
 * - Financial proforma modeling
 * - Viability scoring and GO/PASS decision
 *
 * Key relationship:
 * - project_id: One-to-one with Project (cascade delete)
 * - consultant_tasks: Multiple consultant tasks ordered during feasibility
 */
@Entity({ schema: 'connect2', name: 'feasibility' })
@Index('idx_feasibility_project_id', ['project_id'])
export class Feasibility extends BaseEntity {
  /**
   * Foreign key: Project ID this feasibility assessment belongs to.
   * Unique constraint enforces one-to-one relationship.
   */
  @Column({ type: 'uuid', unique: true })
  project_id: string = '';

  /**
   * Viability score (0-100) calculated from feasibility analysis.
   * Higher scores indicate more viable projects.
   * Typically scores >= 70 result in GO decisions.
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  viability_score: number | null = null;

  /**
   * Date when the GO/PASS decision was made.
   * GO: Proceed to construction loan origination
   * PASS: Decline the project opportunity
   */
  @Column({ type: 'date', nullable: true })
  go_decision_date: Date | null = null;

  /**
   * Notes explaining the GO/PASS decision rationale.
   * Should document key factors influencing the decision.
   */
  @Column({ type: 'text', nullable: true })
  decision_notes: string | null = null;

  /**
   * Financial proforma stored as JSON.
   * Includes acquisition cost, construction budget, expected revenue, profit margins.
   *
   * Example structure:
   * {
   *   acquisition_cost: 750000,
   *   construction_cost: 1500000,
   *   expected_revenue: 3000000,
   *   profit_margin: 25
   * }
   */
  @Column({ type: 'jsonb', nullable: true })
  proforma: object | null = null;

  // ============================================
  // Relationships
  // ============================================

  /**
   * One-to-one relationship with the parent Project.
   * Cascade delete: deleting the project deletes this feasibility record.
   */
  @OneToOne(() => Project, (project) => project.feasibility, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  /**
   * One-to-many relationship with consultant tasks.
   * Tasks ordered during feasibility (surveys, title reports, arborist assessments, etc.).
   */
  @OneToMany(() => ConsultantTask, (task) => task.feasibility, {
    cascade: true,
  })
  consultant_tasks?: ConsultantTask[];
}
