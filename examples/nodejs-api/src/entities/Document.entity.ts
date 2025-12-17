import 'reflect-metadata';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IsNotEmpty, IsEnum, IsOptional, IsString, IsNumber, IsObject } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { DocumentType } from '../types/enums';
// Use string-based relations to avoid circular dependency issues at runtime
// TypeScript types are imported separately for type checking only
import type { Project } from './Project.entity';
import type { Loan } from './Loan.entity';
import type { ConsultantTask } from './ConsultantTask.entity';
import type { User } from './User.entity';

/**
 * Document entity for all project and loan documents.
 * 
 * Stores metadata about uploaded files (surveys, title reports, plans, etc.)
 * with S3 storage references and optional AI-extracted data.
 * 
 * Relationships:
 * - Can be linked to a Project (optional)
 * - Can be linked to a Loan (optional)
 * - Can be linked to a ConsultantTask (optional)
 * - Has an uploader (User, optional)
 * 
 * Note: All foreign key relationships are nullable to support documents
 * that may be created before being associated with specific entities.
 */
@Entity('documents')
export class Document extends BaseEntity {
  /**
   * Optional project this document belongs to.
   * Nullable to support documents uploaded before project assignment.
   */
  @ManyToOne('Project', 'documents', { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  @Index('idx_documents_project_id')
  project_id?: string;

  /**
   * Optional loan this document belongs to.
   * Nullable to support documents uploaded before loan creation.
   */
  @ManyToOne('Loan', { nullable: true })
  @JoinColumn({ name: 'loan_id' })
  loan?: Loan;

  @Column({ name: 'loan_id', type: 'uuid', nullable: true })
  @Index('idx_documents_loan_id')
  loan_id?: string;

  /**
   * Optional consultant task this document was delivered for.
   * Used when consultants upload deliverables (surveys, arborist reports, etc.)
   */
  @ManyToOne('ConsultantTask', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'consultant_task_id' })
  consultant_task?: ConsultantTask;

  @Column({ name: 'consultant_task_id', type: 'uuid', nullable: true })
  consultant_task_id?: string;

  /**
   * Document type classification.
   * Required field using the DocumentType enum.
   */
  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty({ message: 'Document type is required' })
  @IsEnum(DocumentType, { message: 'Invalid document type' })
  @Index('idx_documents_type')
  type: DocumentType = DocumentType.SURVEY;

  /**
   * Original filename as uploaded by the user.
   */
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Filename is required' })
  @IsString()
  filename: string = '';

  /**
   * S3 bucket name where the file is stored.
   * Example: "connect2-documents-prod"
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  storage_bucket?: string;

  /**
   * S3 object key (path within the bucket).
   * Example: "projects/123e4567-e89b-12d3-a456-426614174000/survey.pdf"
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  storage_key?: string;

  /**
   * File size in bytes.
   */
  @Column({ type: 'bigint', nullable: true })
  @IsOptional()
  @IsNumber()
  file_size?: number;

  /**
   * MIME type of the file.
   * Example: "application/pdf", "image/png"
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  mime_type?: string;

  /**
   * AI-extracted data from the document (JSONB).
   * Structure varies by document type.
   * 
   * Example for survey:
   * {
   *   "lot_size": 5000,
   *   "setbacks": { "front": 25, "rear": 20, "side": 10 },
   *   "easements": ["utility", "drainage"]
   * }
   */
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsObject()
  extracted_data?: Record<string, any>;

  /**
   * AI-generated summary of the document content.
   * Plain text summary for quick review.
   */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  summary?: string;

  /**
   * User who uploaded the document.
   */
  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploaded_by?: User;

  @Column({ name: 'uploaded_by', type: 'uuid', nullable: true })
  uploaded_by_id?: string;

  /**
   * Timestamp when the document was uploaded.
   * Separate from created_at to distinguish upload time from record creation.
   */
  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  @Index('idx_documents_uploaded_at')
  uploaded_at: Date = new Date();
}
