import 'reflect-metadata';
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { LoanStatus } from '../types/enums';
import { Project } from './Project.entity';
import { Contact } from './Contact.entity';
import { Draw } from './Draw.entity';

/**
 * Loan entity - represents construction loans in the Connect 2.0 system.
 *
 * A loan is typically associated with a project (but can exist independently),
 * has a borrower (Contact), and can have multiple guarantors (Contacts).
 * Loans have multiple draws throughout the construction lifecycle.
 *
 * Business rules:
 * - loan_number must be unique across all loans
 * - loan_amount must be greater than 0
 * - interest_rate is stored as decimal (e.g., 0.0950 for 9.5%)
 * - term_months represents the loan duration
 * - budget is stored as JSONB for flexibility
 * - assigned_to_bank tracks which lender is handling the loan
 *
 * Relationships:
 * - ManyToOne with Project (optional/nullable - loan can exist without project)
 * - ManyToOne with Contact as borrower (required)
 * - OneToMany with Draw (cascade delete - deleting loan deletes all draws)
 * - ManyToMany with Contact as guarantors (via LoanGuarantor join table)
 *
 * Example usage:
 * ```typescript
 * const loan = new Loan();
 * loan.loan_number = 'LOAN-2025-001';
 * loan.borrower = borrowerContact;
 * loan.loan_amount = 2000000;
 * loan.interest_rate = 0.0950;
 * loan.term_months = 24;
 * loan.status = LoanStatus.PENDING;
 * await loan.save();
 * ```
 */
@Entity('loans', { schema: 'connect2' })
@Index('idx_loans_status', ['status'])
@Index('idx_loans_project_id', ['project'])
@Index('idx_loans_borrower_id', ['borrower'])
@Index('idx_loans_loan_number', ['loan_number'])
export class Loan extends BaseEntity {
  /**
   * Unique loan number (e.g., "LOAN-2025-001").
   * Auto-generated on creation, used for human-readable identification.
   */
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  loan_number: string = '';

  /**
   * Associated project (optional).
   * A loan may or may not be tied to a specific project.
   */
  @ManyToOne(() => Project, project => project.loans, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  /**
   * Borrower contact (required).
   * The primary borrower responsible for the loan.
   */
  @ManyToOne(() => Contact, { nullable: false })
  @JoinColumn({ name: 'borrower_id' })
  borrower: Contact = new Contact();

  /**
   * Current status of the loan.
   * Tracks the loan through its lifecycle from pending to paid off.
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: LoanStatus.PENDING
  })
  status: LoanStatus = LoanStatus.PENDING;

  /**
   * Total loan amount in dollars.
   * Stored as DECIMAL(12, 2) in database.
   * Must be greater than 0.
   */
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  loan_amount?: number;

  /**
   * Annual interest rate as a decimal.
   * Example: 0.0950 represents 9.5% APR.
   * Stored as DECIMAL(5, 4) in database.
   */
  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  interest_rate?: number;

  /**
   * Loan term in months.
   * Example: 24 for a 2-year loan.
   */
  @Column({ type: 'integer', nullable: true })
  term_months?: number;

  /**
   * Date when the loan closed/funded.
   */
  @Column({ type: 'date', nullable: true })
  closing_date?: Date;

  /**
   * Date when the loan matures (final payment due).
   */
  @Column({ type: 'date', nullable: true })
  maturity_date?: Date;

  /**
   * Construction budget breakdown.
   * Stored as JSONB for flexible structure.
   * Example: { "acquisition_cost": 750000, "construction_cost": 1500000, "contingency": 250000 }
   */
  @Column({ type: 'jsonb', nullable: true })
  budget?: Record<string, any>;

  /**
   * Which bank/lender is servicing this loan.
   * Example: "Columbia Bank"
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  assigned_to_bank?: string;

  /**
   * Collection of draws associated with this loan.
   * Cascade delete: deleting a loan deletes all its draws.
   */
  @OneToMany(() => Draw, draw => draw.loan, { cascade: true })
  draws: Draw[] = [];

  /**
   * Collection of guarantors for this loan.
   * Many-to-many relationship via LoanGuarantor join table.
   */
  @ManyToMany(() => Contact)
  @JoinTable({
    name: 'loan_guarantors',
    schema: 'connect2',
    joinColumn: { name: 'loan_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contact_id', referencedColumnName: 'id' }
  })
  guarantors: Contact[] = [];

  /**
   * Custom validation: Ensure loan amount is positive if provided.
   */
  validateLoanAmount(): boolean {
    if (this.loan_amount !== undefined && this.loan_amount !== null) {
      return this.loan_amount > 0;
    }
    return true;
  }

  /**
   * Custom validation: Ensure interest rate is valid if provided.
   */
  validateInterestRate(): boolean {
    if (this.interest_rate !== undefined && this.interest_rate !== null) {
      return this.interest_rate > 0 && this.interest_rate < 1;
    }
    return true;
  }

  /**
   * Calculate total drawn amount from all approved/paid draws.
   */
  getTotalDrawnAmount(): number {
    return this.draws
      .filter(draw => draw.status === 'APPROVED' || draw.status === 'PAID')
      .reduce((sum, draw) => sum + (draw.approved_amount || 0), 0);
  }

  /**
   * Calculate remaining loan balance.
   */
  getRemainingBalance(): number {
    if (!this.loan_amount) return 0;
    return this.loan_amount - this.getTotalDrawnAmount();
  }
}
