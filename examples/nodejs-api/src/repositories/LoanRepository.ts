/**
 * LoanRepository - Production Implementation
 *
 * Manages all database operations for Loan entities with support for
 * borrower relationships, guarantors, loan balances, and transaction handling.
 *
 * @example
 * import { loanRepository } from './repositories';
 *
 * // Find loans by borrower
 * const borrowerLoans = await loanRepository.findByBorrower(borrowerId);
 *
 * // Create loan with guarantors in transaction
 * const loan = await loanRepository.createWithGuarantors(loanData, guarantorIds);
 *
 * // Calculate current loan balance
 * const balance = await loanRepository.calculateBalance(loanId);
 */

import { BaseRepository } from './BaseRepository';
import { Loan, LoanStatus, DrawStatus } from '../types';
import { NotFoundException, ValidationException } from '../exceptions';

export class LoanRepository extends BaseRepository<Loan> {
  constructor() {
    super('loans', 'connect2');
  }

  /**
   * Find all loans for a specific borrower
   *
   * @param borrowerId - The borrower contact ID
   * @returns Array of loans for the borrower
   *
   * @example
   * const loans = await repo.findByBorrower('borrower-uuid')
   */
  async findByBorrower(borrowerId: string): Promise<Loan[]> {
    return this.findByConditions({ borrower_id: borrowerId });
  }

  /**
   * Find all loans for a specific project
   *
   * @param projectId - The project ID
   * @returns Array of loans associated with the project
   *
   * @example
   * const projectLoans = await repo.findByProject('project-uuid')
   */
  async findByProject(projectId: string): Promise<Loan[]> {
    return this.findByConditions({ project_id: projectId });
  }

  /**
   * Create a loan with guarantors in a transaction
   *
   * This ensures atomicity - either the loan and all guarantor relationships
   * are created, or none are (rollback on failure).
   *
   * @param loanData - The loan data to create
   * @param guarantorIds - Array of guarantor contact IDs
   * @returns Created loan
   *
   * @example
   * const loan = await repo.createWithGuarantors(
   *   {
   *     loan_number: 'L-2025-001',
   *     borrower_id: 'borrower-uuid',
   *     loan_amount: 500000,
   *     interest_rate: 8.5,
   *     term_months: 24
   *   },
   *   ['guarantor1-uuid', 'guarantor2-uuid']
   * )
   */
  async createWithGuarantors(
    loanData: Partial<Omit<Loan, 'id' | 'created_at' | 'updated_at'>>,
    guarantorIds: string[] = []
  ): Promise<Loan> {
    return this.transaction(async (client) => {
      // Create loan
      const loanColumns = Object.keys(loanData);
      const loanValues = Object.values(loanData);
      const placeholders = loanColumns.map((_, i) => `$${i + 1}`).join(', ');

      const loanQuery = `
        INSERT INTO ${this.fullTableName} (${loanColumns.join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `;
      const loanResult = await client.query(loanQuery, loanValues);
      const loan = loanResult.rows[0] as Loan;

      // Create guarantor relationships
      if (guarantorIds.length > 0) {
        const guarantorValues = guarantorIds.map((gid) => `('${loan.id}', '${gid}')`).join(', ');
        const guarantorQuery = `
          INSERT INTO connect2.loan_guarantors (loan_id, guarantor_id)
          VALUES ${guarantorValues}
        `;
        await client.query(guarantorQuery);
      }

      return loan;
    });
  }

  /**
   * Calculate current loan balance
   *
   * Calculates balance as: loan_amount - sum(approved draws) - sum(paid draws)
   * Returns the remaining principal balance.
   *
   * @param loanId - The loan ID
   * @returns Current loan balance
   * @throws NotFoundException if loan not found
   *
   * @example
   * const balance = await repo.calculateBalance('loan-uuid')
   * console.log(`Remaining balance: $${balance}`)
   */
  async calculateBalance(loanId: string): Promise<number> {
    const loan = await this.findById(loanId);
    if (!loan) {
      throw new NotFoundException('Loan', loanId);
    }

    const sql = `
      SELECT
        COALESCE(l.loan_amount, 0) as loan_amount,
        COALESCE(SUM(d.approved_amount), 0) as total_drawn
      FROM connect2.loans l
      LEFT JOIN connect2.draws d ON d.loan_id = l.id
        AND d.status IN ($2, $3)
        AND d.deleted_at IS NULL
      WHERE l.id = $1
        AND l.deleted_at IS NULL
      GROUP BY l.id, l.loan_amount
    `;

    const result = await this.executeQuery(sql, [loanId, DrawStatus.APPROVED, DrawStatus.PAID]);

    if (result.rows.length === 0) {
      return 0;
    }

    const { loan_amount, total_drawn } = result.rows[0];
    return parseFloat(loan_amount) - parseFloat(total_drawn);
  }

  /**
   * Find overdue loans
   *
   * Finds loans where maturity_date has passed and status is still SERVICING.
   *
   * @returns Array of overdue loans
   *
   * @example
   * const overdueLoans = await repo.findOverdueLoans()
   * for (const loan of overdueLoans) {
   *   console.log(`Loan ${loan.loan_number} is overdue`)
   * }
   */
  async findOverdueLoans(): Promise<Loan[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE maturity_date < CURRENT_DATE
        AND status = $1
        AND deleted_at IS NULL
      ORDER BY maturity_date ASC
    `;
    const result = await this.executeQuery(sql, [LoanStatus.SERVICING]);
    return result.rows as Loan[];
  }

  /**
   * Find loans by status
   *
   * @param status - The loan status to filter by
   * @returns Array of matching loans
   *
   * @example
   * const activeLoans = await repo.findByStatus(LoanStatus.SERVICING)
   */
  async findByStatus(status: LoanStatus): Promise<Loan[]> {
    return this.findByConditions({ status });
  }

  /**
   * Update loan status
   *
   * Updates the loan status with basic validation to prevent invalid transitions.
   *
   * @param id - The loan ID
   * @param newStatus - The new status
   * @returns Updated loan
   * @throws NotFoundException if loan not found
   * @throws ValidationException if transition is invalid
   *
   * @example
   * const loan = await repo.updateStatus('loan-uuid', LoanStatus.FUNDED)
   */
  async updateStatus(id: string, newStatus: LoanStatus): Promise<Loan> {
    const loan = await this.findById(id);
    if (!loan) {
      throw new NotFoundException('Loan', id);
    }

    // Cannot transition from terminal statuses
    if (loan.status === LoanStatus.PAID_OFF || loan.status === LoanStatus.DEFAULT) {
      throw new ValidationException(
        `Cannot transition from ${loan.status} status`,
        {
          currentStatus: loan.status,
          attemptedStatus: newStatus,
        }
      );
    }

    return this.update(id, { status: newStatus });
  }
}

// Export singleton instance
export const loanRepository = new LoanRepository();
