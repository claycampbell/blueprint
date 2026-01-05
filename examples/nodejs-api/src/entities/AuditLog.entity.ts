import 'reflect-metadata';
import { Entity, Column, ManyToOne, JoinColumn, Index, BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';
import { IsNotEmpty, IsEnum, IsOptional, IsString, IsUUID, IsObject, IsIP } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { AuditAction } from '../types/enums';

/**
 * AuditLog entity for tracking all important data changes.
 * 
 * Records create, update, and delete operations across all entities
 * with before/after snapshots, user attribution, and request metadata.
 * 
 * This provides a complete audit trail for compliance, debugging,
 * and data recovery purposes.
 * 
 * Relationships:
 * - Links to the User who performed the action (optional)
 * 
 * Note: Uses JSONB for storing old/new values to support flexible
 * schema evolution. The record_id is stored as UUID but references
 * different tables depending on table_name.
 */
@Entity('audit_log')
export class AuditLog extends BaseEntity {
  /**
   * Name of the table that was modified.
   * Examples: "users", "projects", "loans", "documents"
   */
  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'Table name is required' })
  @IsString()
  @Index('idx_audit_log_table_record')
  table_name: string = '';

  /**
   * UUID of the record that was modified.
   * This is a foreign key reference that varies by table_name.
   */
  @Column({ type: 'uuid' })
  @IsNotEmpty({ message: 'Record ID is required' })
  @IsUUID('4', { message: 'Record ID must be a valid UUID' })
  @Index('idx_audit_log_table_record')
  record_id: string = '';

  /**
   * Type of action performed.
   * One of: INSERT, UPDATE, DELETE
   */
  @Column({ type: 'varchar', length: 20 })
  @IsNotEmpty({ message: 'Action is required' })
  @IsEnum(AuditAction, { message: 'Invalid audit action' })
  action: AuditAction = AuditAction.INSERT;

  /**
   * Snapshot of field values BEFORE the change (JSONB).
   * Null for INSERT operations.
   * 
   * Example:
   * {
   *   "status": "PENDING",
   *   "amount": 500000,
   *   "updated_at": "2025-01-15T10:30:00Z"
   * }
   */
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsObject()
  old_values?: Record<string, any>;

  /**
   * Snapshot of field values AFTER the change (JSONB).
   * Null for DELETE operations.
   * 
   * Example:
   * {
   *   "status": "APPROVED",
   *   "amount": 500000,
   *   "updated_at": "2025-01-15T11:45:00Z"
   * }
   */
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsObject()
  new_values?: Record<string, any>;

  /**
   * User who performed the action.
   * Nullable for system-generated changes or unauthenticated operations.
   */
  @ManyToOne('User', 'audit_logs', { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: any; // Will be typed as User once that entity is created

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  @Index('idx_audit_log_user_id')
  user_id?: string;

  /**
   * IP address of the client that made the request.
   * Uses PostgreSQL INET type for proper IP address storage.
   * Supports both IPv4 and IPv6.
   */
  @Column({ type: 'inet', nullable: true })
  @IsOptional()
  @IsIP(undefined, { message: 'Invalid IP address' })
  ip_address?: string;

  /**
   * User-Agent header from the HTTP request.
   * Useful for identifying client applications and browsers.
   */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  user_agent?: string;

  /**
   * Override created_at to add index for chronological queries.
   * Audit logs are frequently queried by time range.
   */
  @Index('idx_audit_log_created_at')
  declare created_at: Date;

  /**
   * Prevent updates to audit log entries.
   * Audit logs are immutable by design - they provide a tamper-proof record.
   */
  @BeforeUpdate()
  preventUpdates() {
    throw new Error('Audit logs are immutable and cannot be updated');
  }

  /**
   * Prevent deletion of audit logs before retention period expires.
   * Retention period: 7 years (2555 days) for compliance.
   */
  @BeforeRemove()
  preventDeletion() {
    const retentionDays = 2555; // 7 years
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - retentionDays);

    if (this.created_at > retentionDate) {
      throw new Error('Audit logs cannot be deleted before retention period expires (7 years)');
    }
  }

  /**
   * Validate consistency between action type and old/new values.
   * - INSERT: old_values must be null
   * - DELETE: new_values must be null
   * - UPDATE: both old_values and new_values must be present
   */
  @BeforeInsert()
  validateActionValues() {
    if (this.action === AuditAction.INSERT && this.old_values !== null && this.old_values !== undefined) {
      throw new Error('INSERT action should have null old_values');
    }
    if (this.action === AuditAction.DELETE && this.new_values !== null && this.new_values !== undefined) {
      throw new Error('DELETE action should have null new_values');
    }
    if (this.action === AuditAction.UPDATE) {
      if (!this.old_values || !this.new_values) {
        throw new Error('UPDATE action requires both old_values and new_values');
      }
    }
  }
}
