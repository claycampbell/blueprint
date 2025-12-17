import 'reflect-metadata';
import { Entity, Column, ManyToOne, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User.entity';
import { Contact } from './Contact.entity';
import { Feasibility } from './Feasibility.entity';
import { Entitlement } from './Entitlement.entity';
import { Loan } from './Loan.entity';
import { ProjectStatus } from '../types';

/**
 * Project entity representing leads, feasibility assessments, and entitlement tracking.
 * Core entity for tracking all project opportunities from lead intake through approval.
 *
 * Lifecycle: LEAD → FEASIBILITY → GO/PASS → CLOSED
 *
 * Key relationships:
 * - submitted_by: Agent who submitted the lead (Contact)
 * - assigned_to: Acquisitions specialist managing the project (User)
 * - assigned_builder: Builder assigned to the project (Contact)
 * - feasibility: One-to-one feasibility assessment (cascade delete)
 * - entitlement: One-to-one entitlement tracking (cascade delete)
 */
@Entity({ schema: 'connect2', name: 'projects' })
@Index('idx_projects_status', ['status'])
@Index('idx_projects_city', ['city'])
@Index('idx_projects_assigned_to', ['assigned_to'])
@Index('idx_projects_submitted_by', ['submitted_by'])
@Index('idx_projects_created_at', ['created_at'])
export class Project extends BaseEntity {
  /**
   * Unique project identifier (e.g., "PROJ-2025-001").
   * Auto-generated on creation.
   */
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  project_number: string | null = null;

  /**
   * Property street address (required).
   */
  @Column({ type: 'varchar', length: 255 })
  address: string = '';

  /**
   * City where the property is located.
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null = null;

  /**
   * Two-letter state code (e.g., "WA", "AZ").
   */
  @Column({ type: 'varchar', length: 2, nullable: true })
  state: string | null = null;

  /**
   * ZIP/postal code.
   */
  @Column({ type: 'varchar', length: 10, nullable: true })
  zip: string | null = null;

  /**
   * County assessor's parcel number (APN).
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  parcel_number: string | null = null;

  /**
   * Current project status in the lifecycle.
   * Default: LEAD
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: ProjectStatus.LEAD,
  })
  status: ProjectStatus = ProjectStatus.LEAD;

  /**
   * Seller's asking price (purchase price).
   */
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  purchase_price: number | null = null;

  /**
   * Listed market price.
   */
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  list_price: number | null = null;

  /**
   * Foreign key: Contact ID of the agent who submitted this project.
   */
  @Column({ type: 'uuid', nullable: true })
  submitted_by: string | null = null;

  /**
   * Foreign key: User ID of the acquisitions specialist assigned to manage this project.
   */
  @Column({ type: 'uuid', nullable: true })
  assigned_to: string | null = null;

  /**
   * Foreign key: Contact ID of the builder assigned to this project.
   */
  @Column({ type: 'uuid', nullable: true })
  assigned_builder: string | null = null;

  /**
   * Internal notes visible only to Blueprint staff.
   */
  @Column({ type: 'text', nullable: true })
  internal_notes: string | null = null;

  // ============================================
  // Relationships
  // ============================================

  /**
   * Agent (Contact) who submitted this project lead.
   */
  @ManyToOne(() => Contact, { nullable: true })
  @JoinColumn({ name: 'submitted_by' })
  submittedByContact?: Contact;

  /**
   * User (internal staff) assigned to manage this project.
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedToUser?: User;

  /**
   * Builder (Contact) assigned to this project.
   */
  @ManyToOne(() => Contact, { nullable: true })
  @JoinColumn({ name: 'assigned_builder' })
  assignedBuilderContact?: Contact;

  /**
   * One-to-one feasibility assessment for this project.
   * Cascade delete: deleting the project deletes the feasibility record.
   */
  @OneToOne(() => Feasibility, (feasibility) => feasibility.project, {
    cascade: true,
    nullable: true,
  })
  feasibility?: Feasibility;

  /**
   * One-to-one entitlement tracking for this project.
   * Cascade delete: deleting the project deletes the entitlement record.
   */
  @OneToOne(() => Entitlement, (entitlement) => entitlement.project, {
    cascade: true,
    nullable: true,
  })
  entitlement?: Entitlement;

  /**
   * Loans associated with this project.
   * A project can have multiple loans over its lifecycle.
   * Note: Loans are optional - deleting a project does NOT cascade delete loans.
   */
  @OneToMany(() => Loan, (loan) => loan.project)
  loans?: Loan[];
}
