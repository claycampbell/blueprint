/**
 * ContactRepository - Production Implementation
 *
 * Manages all database operations for Contact entities with advanced
 * features including fuzzy search, duplicate detection, and contact merging.
 *
 * @example
 * import { contactRepository } from './repositories';
 *
 * // Fuzzy search for contacts
 * const contacts = await contactRepository.search('john doe');
 *
 * // Find duplicates by email
 * const duplicates = await contactRepository.findDuplicates('john@example.com');
 *
 * // Merge duplicate contacts
 * await contactRepository.mergeContacts(sourceId, targetId);
 */

import { BaseRepository } from './BaseRepository';
import { Contact, ContactType } from '../types';
import { NotFoundException, ValidationException } from '../exceptions';

export class ContactRepository extends BaseRepository<Contact> {
  constructor() {
    super('contacts', 'connect2');
  }

  /**
   * Fuzzy search for contacts
   *
   * Searches across first_name, last_name, company_name, email using
   * PostgreSQL's pg_trgm extension for trigram similarity matching.
   *
   * Results are ordered by similarity score (best matches first).
   *
   * @param query - The search query
   * @returns Array of matching contacts
   *
   * @example
   * const contacts = await repo.search('john doe')
   * // Finds: "John Doe", "Jon Dougherty", "Johnny Doane", etc.
   */
  async search(query: string): Promise<Contact[]> {
    // Note: Requires pg_trgm extension to be enabled in database
    // CREATE EXTENSION IF NOT EXISTS pg_trgm;
    const sql = `
      SELECT *,
        GREATEST(
          SIMILARITY(COALESCE(first_name, ''), $1),
          SIMILARITY(COALESCE(last_name, ''), $1),
          SIMILARITY(COALESCE(company_name, ''), $1),
          SIMILARITY(COALESCE(email, ''), $1)
        ) as similarity_score
      FROM ${this.fullTableName}
      WHERE (
        first_name ILIKE $2 OR
        last_name ILIKE $2 OR
        company_name ILIKE $2 OR
        email ILIKE $2
      )
      AND deleted_at IS NULL
      ORDER BY similarity_score DESC, last_name ASC, first_name ASC
      LIMIT 50
    `;
    const result = await this.executeQuery(sql, [query, `%${query}%`]);
    return result.rows as Contact[];
  }

  /**
   * Find contacts by type
   *
   * @param type - The contact type to filter by
   * @returns Array of contacts with the specified type
   *
   * @example
   * const builders = await repo.findByType(ContactType.BUILDER)
   */
  async findByType(type: ContactType): Promise<Contact[]> {
    return this.findByConditions({ type });
  }

  /**
   * Find potential duplicate contacts
   *
   * Searches for contacts with matching email or phone number.
   * Used to prevent duplicate contact creation and identify contacts to merge.
   *
   * @param email - Optional email to match
   * @param phone - Optional phone to match
   * @returns Array of potential duplicates
   *
   * @example
   * // Find by email
   * const emailDupes = await repo.findDuplicates('john@example.com')
   *
   * // Find by phone
   * const phoneDupes = await repo.findDuplicates(undefined, '206-555-1234')
   *
   * // Find by either
   * const dupes = await repo.findDuplicates('john@example.com', '206-555-1234')
   */
  async findDuplicates(email?: string, phone?: string): Promise<Contact[]> {
    if (!email && !phone) {
      throw new ValidationException('Must provide either email or phone to search for duplicates');
    }

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (email) {
      conditions.push(`LOWER(email) = LOWER($${paramIndex++})`);
      params.push(email);
    }

    if (phone) {
      // Strip non-numeric characters for phone comparison
      conditions.push(`REGEXP_REPLACE(phone, '[^0-9]', '', 'g') = REGEXP_REPLACE($${paramIndex++}, '[^0-9]', '', 'g')`);
      params.push(phone);
    }

    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE (${conditions.join(' OR ')})
        AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await this.executeQuery(sql, params);
    return result.rows as Contact[];
  }

  /**
   * Merge two contact records
   *
   * Merges sourceId contact into targetId contact, then soft-deletes the source.
   * This operation:
   * 1. Updates all foreign key references from source to target
   * 2. Merges notes from source into target
   * 3. Soft-deletes the source contact
   *
   * All operations occur in a transaction to ensure data integrity.
   *
   * @param sourceId - The contact to merge from (will be deleted)
   * @param targetId - The contact to merge into (will be kept)
   * @returns The updated target contact
   * @throws NotFoundException if either contact not found
   * @throws ValidationException if trying to merge contact with itself
   *
   * @example
   * const merged = await repo.mergeContacts('duplicate-uuid', 'primary-uuid')
   */
  async mergeContacts(sourceId: string, targetId: string): Promise<Contact> {
    if (sourceId === targetId) {
      throw new ValidationException('Cannot merge a contact with itself', {
        sourceId,
        targetId,
      });
    }

    const source = await this.findById(sourceId);
    const target = await this.findById(targetId);

    if (!source) {
      throw new NotFoundException('Source Contact', sourceId);
    }
    if (!target) {
      throw new NotFoundException('Target Contact', targetId);
    }

    return this.transaction(async (client) => {
      // Update all foreign key references from source to target
      const updateTables = [
        { table: 'projects', column: 'submitted_by' },
        { table: 'projects', column: 'assigned_builder' },
        { table: 'tasks', column: 'assigned_contact' },
        { table: 'loans', column: 'borrower_id' },
        { table: 'loan_guarantors', column: 'guarantor_id' },
        { table: 'consultant_tasks', column: 'consultant_id' },
      ];

      for (const { table, column } of updateTables) {
        await client.query(
          `UPDATE connect2.${table} SET ${column} = $1 WHERE ${column} = $2`,
          [targetId, sourceId]
        );
      }

      // Merge notes if source has notes
      if (source.notes) {
        const mergedNotes = target.notes
          ? `${target.notes}\n\n--- Merged from contact ${sourceId} ---\n${source.notes}`
          : source.notes;

        await client.query(
          `UPDATE ${this.fullTableName} SET notes = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
          [mergedNotes, targetId]
        );
      }

      // Soft-delete source contact
      await client.query(
        `UPDATE ${this.fullTableName} SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [sourceId]
      );

      // Fetch and return updated target
      const result = await client.query(
        `SELECT * FROM ${this.fullTableName} WHERE id = $1`,
        [targetId]
      );

      return result.rows[0] as Contact;
    });
  }

  /**
   * Find contacts by company
   *
   * Case-insensitive company name search.
   *
   * @param companyName - The company name to search for
   * @returns Array of contacts from the specified company
   *
   * @example
   * const acmeContacts = await repo.findByCompany('ACME Corp')
   */
  async findByCompany(companyName: string): Promise<Contact[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE LOWER(company_name) = LOWER($1)
        AND deleted_at IS NULL
      ORDER BY last_name ASC, first_name ASC
    `;
    const result = await this.executeQuery(sql, [companyName]);
    return result.rows as Contact[];
  }

  /**
   * Find contact by email
   *
   * Case-insensitive exact email match.
   *
   * @param email - The email address
   * @returns Contact or null if not found
   *
   * @example
   * const contact = await repo.findByEmail('john@example.com')
   */
  async findByEmail(email: string): Promise<Contact | null> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE LOWER(email) = LOWER($1)
        AND deleted_at IS NULL
      LIMIT 1
    `;
    const result = await this.executeQuery(sql, [email]);
    return result.rows.length > 0 ? (result.rows[0] as Contact) : null;
  }
}

// Export singleton instance
export const contactRepository = new ContactRepository();
