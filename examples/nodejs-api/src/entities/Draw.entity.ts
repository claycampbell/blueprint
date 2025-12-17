import 'reflect-metadata';
import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { DrawStatus } from '../types/enums';
import { Loan } from './Loan.entity';

/**
 * Draw entity - represents construction draw requests in the Connect 2.0 system.
 *
 * A draw is a disbursement request from a loan during the construction process.
 * Draws are numbered sequentially per loan (draw_number) and track the requested
 * vs. approved amounts, conditions, and payment status.
 *
 * Business rules:
 * - Each draw must be associated with a loan (required, cascade delete)
 * - draw_number is unique per loan (composite unique constraint: [loan_id, draw_number])
 * - Draw numbers typically start at 1 and increment sequentially
 * - requested_amount and approved_amount must be greater than 0 if provided
 * - conditions_met tracks whether all draw conditions are satisfied
 * - inspection_id will reference a future inspection entity
 *
 * Relationships:
 * - ManyToOne with Loan (required, cascade delete on loan deletion)
 *
 * Example usage:
 * ```typescript
 * const draw = new Draw();
 * draw.loan = existingLoan;
 * draw.draw_number = 1;
 * draw.requested_amount = 500000;
 * draw.status = DrawStatus.PENDING;
 * draw.conditions_met = false;
 * await draw.save();
 * ```
 */
@Entity('draws', { schema: 'connect2' })
@Index('idx_draws_loan_id', ['loan'])
@Index('idx_draws_status', ['status'])
@Unique(['loan', 'draw_number']) // Composite unique constraint
export class Draw extends BaseEntity {
  /**
   * Associated loan (required).
   * This draw belongs to a specific loan.
   * Cascade: deleting the loan deletes all its draws.
   */
  @ManyToOne(() => Loan, loan => loan.draws, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan = new Loan();

  /**
   * Sequential draw number within the loan.
   * Example: 1 for first draw, 2 for second draw, etc.
   * Must be unique per loan (enforced by composite unique constraint).
   */
  @Column({ type: 'integer', nullable: false })
  draw_number: number = 0;

  /**
   * Amount requested by borrower in dollars.
   * Stored as DECIMAL(12, 2) in database.
   */
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  requested_amount?: number;

  /**
   * Amount approved by lender in dollars.
   * May differ from requested_amount based on inspection results
   * or other conditions.
   * Stored as DECIMAL(12, 2) in database.
   */
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  approved_amount?: number;

  /**
   * Current status of the draw.
   * Tracks the draw through its lifecycle from pending to paid.
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: DrawStatus.PENDING
  })
  status: DrawStatus = DrawStatus.PENDING;

  /**
   * Reference to associated inspection (future implementation).
   * Will link to an inspection entity when that module is built.
   */
  @Column({ type: 'uuid', nullable: true })
  inspection_id?: string;

  /**
   * Whether all draw conditions have been met.
   * Conditions might include: inspection passed, lien waivers received, etc.
   */
  @Column({ type: 'boolean', default: false })
  conditions_met: boolean = false;

  /**
   * Internal notes about this draw.
   * Can include conditions, approver comments, or other context.
   */
  @Column({ type: 'text', nullable: true })
  notes?: string;

  /**
   * Date when the draw was requested.
   */
  @Column({ type: 'date', nullable: true })
  requested_date?: Date;

  /**
   * Date when the draw was approved.
   */
  @Column({ type: 'date', nullable: true })
  approved_date?: Date;

  /**
   * Date when the draw was paid out.
   */
  @Column({ type: 'date', nullable: true })
  paid_date?: Date;

  /**
   * Custom validation: Ensure requested amount is positive if provided.
   */
  validateRequestedAmount(): boolean {
    if (this.requested_amount !== undefined && this.requested_amount !== null) {
      return this.requested_amount > 0;
    }
    return true;
  }

  /**
   * Custom validation: Ensure approved amount is positive if provided.
   */
  validateApprovedAmount(): boolean {
    if (this.approved_amount !== undefined && this.approved_amount !== null) {
      return this.approved_amount > 0;
    }
    return true;
  }

  /**
   * Custom validation: Ensure approved amount doesn't exceed requested amount.
   */
  validateApprovedVsRequested(): boolean {
    if (this.approved_amount && this.requested_amount) {
      return this.approved_amount <= this.requested_amount;
    }
    return true;
  }

  /**
   * Check if the draw is fully approved and ready for payment.
   */
  isReadyForPayment(): boolean {
    return (
      this.status === DrawStatus.APPROVED &&
      this.conditions_met &&
      this.approved_amount !== undefined &&
      this.approved_amount > 0
    );
  }

  /**
   * Get the variance between requested and approved amounts.
   * Returns null if either amount is not set.
   */
  getVariance(): number | null {
    if (this.requested_amount && this.approved_amount) {
      return this.requested_amount - this.approved_amount;
    }
    return null;
  }
}
