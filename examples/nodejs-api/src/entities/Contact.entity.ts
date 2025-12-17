import 'reflect-metadata';
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { IsEmail, IsEnum, IsOptional, Length, Matches } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { ContactType } from '../types/enums';
import { User } from './User.entity';

/**
 * Contact entity representing external parties in the Connect 2.0 platform.
 *
 * Contacts include:
 * - Real estate agents who submit leads
 * - Builders/developers on projects
 * - Consultants (surveyors, arborists, civil engineers, etc.)
 * - Borrowers and guarantors on loans
 * - Project sponsors/equity partners
 *
 * Database table: connect2.contacts
 * Schema reference: scripts/init-db.sql (lines 38-55)
 */
@Entity({ schema: 'connect2', name: 'contacts' })
@Index(['type'])
@Index(['created_by'])
@Index(['email'])
@Index(['company_name'])
export class Contact extends BaseEntity {
  /**
   * Type of contact (categorization).
   * Determines role and relationship to projects/loans.
   */
  @Column({ type: 'varchar', length: 50 })
  @IsEnum(ContactType, { message: 'Type must be a valid ContactType' })
  type: ContactType = ContactType.AGENT;

  /**
   * Contact's first name.
   */
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'first_name' })
  @IsOptional()
  @Length(1, 100, { message: 'First name must be between 1 and 100 characters' })
  first_name?: string;

  /**
   * Contact's last name.
   */
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_name' })
  @IsOptional()
  @Length(1, 100, { message: 'Last name must be between 1 and 100 characters' })
  last_name?: string;

  /**
   * Company or business name.
   * Used for builders, consultants, and real estate firms.
   */
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'company_name' })
  @IsOptional()
  @Length(1, 255, { message: 'Company name must be between 1 and 255 characters' })
  company_name?: string;

  /**
   * Contact's email address.
   * Must be a valid email format if provided.
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  /**
   * Contact's phone number.
   * Supports various formats (e.g., 206-555-0101, (206) 555-0101, etc.).
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @Matches(/^[\d\s\-\(\)\+\.]+$/, { message: 'Phone number contains invalid characters' })
  @Length(1, 20, { message: 'Phone number must be between 1 and 20 characters' })
  phone?: string;

  /**
   * Street address line 1.
   */
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'address_line1' })
  @IsOptional()
  @Length(1, 255, { message: 'Address line 1 must be between 1 and 255 characters' })
  address_line1?: string;

  /**
   * Street address line 2 (suite, unit, etc.).
   */
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'address_line2' })
  @IsOptional()
  @Length(1, 255, { message: 'Address line 2 must be between 1 and 255 characters' })
  address_line2?: string;

  /**
   * City.
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @Length(1, 100, { message: 'City must be between 1 and 100 characters' })
  city?: string;

  /**
   * State (2-letter code).
   * Examples: WA, AZ, CA
   */
  @Column({ type: 'varchar', length: 2, nullable: true })
  @IsOptional()
  @Matches(/^[A-Z]{2}$/, { message: 'State must be a 2-letter uppercase code' })
  state?: string;

  /**
   * ZIP or postal code.
   * Supports 5-digit and 9-digit formats (e.g., 98101, 98101-1234).
   */
  @Column({ type: 'varchar', length: 10, nullable: true })
  @IsOptional()
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'ZIP code must be in format 12345 or 12345-6789' })
  zip?: string;

  /**
   * Internal notes about the contact.
   * Used for relationship management, preferences, history, etc.
   */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes?: string;

  /**
   * User who created this contact record.
   * Tracks accountability and data provenance.
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  @IsOptional()
  created_by?: User;

  /**
   * Get contact's full name.
   * @returns Full name, company name, or email if name not set
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
    if (this.company_name) {
      return this.company_name;
    }
    return this.email || 'Unknown Contact';
  }

  /**
   * Get display name with company if available.
   * @returns Name with company in format "John Doe (Acme Corp)"
   */
  getDisplayName(): string {
    const name = this.getFullName();
    if (this.company_name && (this.first_name || this.last_name)) {
      return `${name} (${this.company_name})`;
    }
    return name;
  }

  /**
   * Get formatted address as single string.
   * @returns Full address or null if no address components set
   */
  getFormattedAddress(): string | null {
    const parts: string[] = [];

    if (this.address_line1) parts.push(this.address_line1);
    if (this.address_line2) parts.push(this.address_line2);

    const cityStateZip: string[] = [];
    if (this.city) cityStateZip.push(this.city);
    if (this.state) cityStateZip.push(this.state);
    if (this.zip) cityStateZip.push(this.zip);

    if (cityStateZip.length > 0) {
      parts.push(cityStateZip.join(', '));
    }

    return parts.length > 0 ? parts.join('\n') : null;
  }

  /**
   * Check if contact is a consultant.
   * @returns true if type is CONSULTANT
   */
  isConsultant(): boolean {
    return this.type === ContactType.CONSULTANT;
  }

  /**
   * Check if contact is a builder.
   * @returns true if type is BUILDER
   */
  isBuilder(): boolean {
    return this.type === ContactType.BUILDER;
  }

  /**
   * Check if contact is an agent.
   * @returns true if type is AGENT
   */
  isAgent(): boolean {
    return this.type === ContactType.AGENT;
  }

  /**
   * Check if contact can be a loan party (borrower/guarantor/sponsor).
   * @returns true if type is BORROWER, GUARANTOR, or SPONSOR
   */
  canBeLoanParty(): boolean {
    return [
      ContactType.BORROWER,
      ContactType.GUARANTOR,
      ContactType.SPONSOR
    ].includes(this.type);
  }
}
