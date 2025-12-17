import 'reflect-metadata';
import { Entity, Column, Index } from 'typeorm';
import { IsEmail, IsEnum, IsOptional, IsBoolean, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './BaseEntity';
import { UserRole } from '../types/enums';

/**
 * User entity representing internal Blueprint staff and external users.
 *
 * Users have authenticated access to the Connect 2.0 platform.
 * Internal users (ADMIN, ACQUISITIONS, DESIGN, ENTITLEMENT, SERVICING) are Blueprint staff.
 * External users (AGENT, BUILDER, CONSULTANT) access specific features based on role.
 *
 * Database table: connect2.users
 * Schema reference: scripts/init-db.sql (lines 23-35)
 */
@Entity({ schema: 'connect2', name: 'users' })
@Index(['email'])
@Index(['role'])
@Index(['is_active'])
export class User extends BaseEntity {
  /**
   * User's email address (unique identifier for login).
   * Must be a valid email format.
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string = '';

  /**
   * Hashed password (bcrypt).
   * Excluded from JSON serialization for security.
   * Nullable for users with SSO-only authentication.
   */
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash' })
  @Exclude()
  @IsOptional()
  password_hash?: string;

  /**
   * User's first name.
   */
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'first_name' })
  @IsOptional()
  @Length(1, 100, { message: 'First name must be between 1 and 100 characters' })
  first_name?: string;

  /**
   * User's last name.
   */
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_name' })
  @IsOptional()
  @Length(1, 100, { message: 'Last name must be between 1 and 100 characters' })
  last_name?: string;

  /**
   * User's phone number.
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @Length(1, 20, { message: 'Phone number must be between 1 and 20 characters' })
  phone?: string;

  /**
   * User's role in the system.
   * Determines access permissions and available features.
   */
  @Column({ type: 'varchar', length: 50 })
  @IsEnum(UserRole, { message: 'Role must be a valid UserRole' })
  role: UserRole = UserRole.AGENT;

  /**
   * Whether the user account is active.
   * Inactive users cannot log in.
   */
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  @IsBoolean()
  is_active: boolean = true;

  /**
   * Timestamp of user's last login.
   * Used for security monitoring and session management.
   */
  @Column({ type: 'timestamp with time zone', nullable: true, name: 'last_login' })
  @IsOptional()
  last_login?: Date;

  /**
   * Get user's full name.
   * @returns Full name or email if name not set
   */
  getFullName(): string {
    if (this.first_name && this.last_name) {
      return `${this.first_name} ${this.last_name}`;
    }
    if (this.first_name) {
      return this.first_name;
    }
    if (this.last_name) {
      return this.last_name;
    }
    return this.email;
  }

  /**
   * Check if user is an internal Blueprint team member.
   * @returns true if user has an internal role
   */
  isInternalUser(): boolean {
    return [
      UserRole.ADMIN,
      UserRole.ACQUISITIONS,
      UserRole.DESIGN,
      UserRole.ENTITLEMENT,
      UserRole.SERVICING
    ].includes(this.role);
  }

  /**
   * Check if user is an external user.
   * @returns true if user has an external role
   */
  isExternalUser(): boolean {
    return [
      UserRole.AGENT,
      UserRole.BUILDER,
      UserRole.CONSULTANT
    ].includes(this.role);
  }
}
