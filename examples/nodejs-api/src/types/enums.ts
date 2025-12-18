/**
 * Centralized enumerations for Connect 2.0 Platform
 *
 * This file contains all domain-specific enums used across entity models.
 * Enums ensure type safety and consistency for categorical data.
 */

/**
 * User roles within the Connect 2.0 platform.
 *
 * Internal roles:
 * - ADMIN: System administrators with full access
 * - ACQUISITIONS: Lead intake and project evaluation specialists
 * - DESIGN: Design and entitlement team members
 * - ENTITLEMENT: Permit processing specialists
 * - SERVICING: Loan servicing team members
 *
 * External roles:
 * - AGENT: Real estate agents submitting leads
 * - BUILDER: Builders/developers as system users
 * - CONSULTANT: External consultants (surveyors, arborists, etc.)
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  ACQUISITIONS = 'ACQUISITIONS',
  DESIGN = 'DESIGN',
  ENTITLEMENT = 'ENTITLEMENT',
  SERVICING = 'SERVICING',
  AGENT = 'AGENT',
  BUILDER = 'BUILDER',
  CONSULTANT = 'CONSULTANT'
}

/**
 * Contact types for external parties.
 *
 * Contacts represent entities outside the Blueprint team:
 * - AGENT: Real estate agents who submit leads
 * - BUILDER: Builders/developers on projects
 * - CONSULTANT: Third-party consultants (surveyors, arborists, civil engineers, etc.)
 * - BORROWER: Primary borrowers on loans
 * - GUARANTOR: Loan guarantors
 * - SPONSOR: Project sponsors/equity partners
 */
export enum ContactType {
  AGENT = 'AGENT',
  BUILDER = 'BUILDER',
  CONSULTANT = 'CONSULTANT',
  BORROWER = 'BORROWER',
  GUARANTOR = 'GUARANTOR',
  SPONSOR = 'SPONSOR'
}

/**
 * Loan status enumeration.
 *
 * Represents the lifecycle of a construction loan:
 * - PENDING: Loan application submitted, awaiting approval
 * - APPROVED: Loan approved but not yet funded
 * - FUNDED: Loan has been funded and construction can begin
 * - SERVICING: Loan is active and being serviced (draws being processed)
 * - PAID_OFF: Loan has been fully repaid
 * - DEFAULT: Loan is in default (payment issues)
 */
export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FUNDED = 'FUNDED',
  SERVICING = 'SERVICING',
  PAID_OFF = 'PAID_OFF',
  DEFAULT = 'DEFAULT'
}

/**
 * Draw status enumeration.
 *
 * Represents the lifecycle of a construction draw request:
 * - PENDING: Draw requested, awaiting review/approval
 * - APPROVED: Draw approved by lender, ready for payment
 * - PAID: Draw funds have been disbursed to borrower
 * - HELD: Draw is on hold pending resolution of conditions
 */
export enum DrawStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  HELD = 'HELD'
}

/**
 * Document type enumeration.
 *
 * Represents the various types of documents stored in the system:
 * - SURVEY: Property survey documents
 * - TITLE: Title reports and title insurance documents
 * - ARBORIST: Arborist reports for tree assessment
 * - PROFORMA: Financial proforma spreadsheets
 * - PLAN: Architectural plans and drawings
 * - PERMIT: Building permits and permit applications
 * - INSPECTION: Construction inspection reports
 */
export enum DocumentType {
  SURVEY = 'SURVEY',
  TITLE = 'TITLE',
  ARBORIST = 'ARBORIST',
  PROFORMA = 'PROFORMA',
  PLAN = 'PLAN',
  PERMIT = 'PERMIT',
  INSPECTION = 'INSPECTION'
}

/**
 * Task status enumeration.
 *
 * Represents the lifecycle of workflow tasks:
 * - PENDING: Task created, not yet started
 * - IN_PROGRESS: Task is currently being worked on
 * - COMPLETED: Task has been finished successfully
 * - CANCELLED: Task has been cancelled and will not be completed
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Task priority enumeration.
 *
 * Represents the urgency level of workflow tasks:
 * - LOW: Low priority, can be done when convenient
 * - MEDIUM: Normal priority (default)
 * - HIGH: High priority, should be addressed soon
 * - URGENT: Critical priority, requires immediate attention
 */
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

/**
 * Audit log action enumeration.
 *
 * Represents the type of change recorded in the audit log:
 * - INSERT: New record created
 * - UPDATE: Existing record modified
 * - DELETE: Record deleted
 */
export enum AuditAction {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}
