import 'reflect-metadata';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Loan } from './Loan.entity';
import { Contact } from './Contact.entity';

/**
 * LoanGuarantor entity - join table for many-to-many relationship between Loans and Guarantors.
 *
 * This entity represents the loan_guarantors table, which tracks which contacts
 * are guarantors for which loans. A loan can have multiple guarantors, and a contact
 * can be a guarantor for multiple loans.
 *
 * Business rules:
 * - Composite primary key: [loan_id, contact_id]
 * - Both loan and contact are required (cannot be null)
 * - Cascade delete: deleting a loan removes all guarantor associations
 * - Cascade delete: deleting a contact removes all their guarantor associations
 * - No created_at/updated_at timestamps (simple join table)
 *
 * Note: This is a join table entity that TypeORM needs for explicit many-to-many
 * relationship management. The @JoinTable decorator in Loan.entity.ts references
 * this table, but this entity provides additional control over the relationship.
 *
 * Example usage:
 * ```typescript
 * // Option 1: Using the Loan entity's guarantors array (recommended)
 * const loan = await loanRepo.findOne({ where: { id: loanId } });
 * loan.guarantors.push(guarantorContact);
 * await loanRepo.save(loan);
 *
 * // Option 2: Direct join table manipulation (less common)
 * const loanGuarantor = new LoanGuarantor();
 * loanGuarantor.loan_id = loanId;
 * loanGuarantor.contact_id = contactId;
 * await loanGuarantorRepo.save(loanGuarantor);
 * ```
 */
@Entity('loan_guarantors', { schema: 'connect2' })
export class LoanGuarantor {
  /**
   * Loan UUID (part of composite primary key).
   * References the loans table.
   */
  @PrimaryColumn({ type: 'uuid' })
  loan_id: string = '';

  /**
   * Contact UUID (part of composite primary key).
   * References the contacts table.
   */
  @PrimaryColumn({ type: 'uuid' })
  contact_id: string = '';

  /**
   * Many-to-one relationship with Loan.
   * Deleting a loan cascades to delete all guarantor associations.
   */
  @ManyToOne(() => Loan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loan_id' })
  loan?: Loan;

  /**
   * Many-to-one relationship with Contact.
   * Deleting a contact cascades to delete all their guarantor associations.
   */
  @ManyToOne(() => Contact, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contact_id' })
  contact?: Contact;
}
