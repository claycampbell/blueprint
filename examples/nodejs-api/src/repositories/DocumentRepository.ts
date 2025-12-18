/**
 * DocumentRepository - Production Implementation
 *
 * Manages all database operations for Document entities with features for
 * document organization, type filtering, AI extraction tracking, and retrieval.
 *
 * @example
 * import { documentRepository } from './repositories';
 *
 * // Find all documents for a project
 * const projectDocs = await documentRepository.findByProject(projectId);
 *
 * // Find documents by type
 * const surveys = await documentRepository.findByType(DocumentType.SURVEY);
 *
 * // Mark document as extracted
 * await documentRepository.markExtracted(docId, extractedData);
 *
 * // Get recent documents
 * const recent = await documentRepository.getRecentDocuments(20);
 */

import { BaseRepository } from './BaseRepository';
import { Document, DocumentType } from '../types';
import { NotFoundException } from '../exceptions';

export class DocumentRepository extends BaseRepository<Document> {
  constructor() {
    super('documents', 'connect2');
  }

  /**
   * Find all documents for a specific project
   *
   * @param projectId - The project ID
   * @returns Array of documents associated with the project
   *
   * @example
   * const projectDocs = await repo.findByProject('project-uuid')
   */
  async findByProject(projectId: string): Promise<Document[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE project_id = $1
        AND deleted_at IS NULL
      ORDER BY uploaded_at DESC
    `;
    const result = await this.executeQuery(sql, [projectId]);
    return result.rows as Document[];
  }

  /**
   * Find all documents for a specific loan
   *
   * @param loanId - The loan ID
   * @returns Array of documents associated with the loan
   *
   * @example
   * const loanDocs = await repo.findByLoan('loan-uuid')
   */
  async findByLoan(loanId: string): Promise<Document[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE loan_id = $1
        AND deleted_at IS NULL
      ORDER BY uploaded_at DESC
    `;
    const result = await this.executeQuery(sql, [loanId]);
    return result.rows as Document[];
  }

  /**
   * Find documents by type
   *
   * Useful for filtering specific document categories (surveys, titles, etc.)
   *
   * @param type - The document type to filter by
   * @returns Array of documents of the specified type
   *
   * @example
   * const surveys = await repo.findByType(DocumentType.SURVEY)
   * const titles = await repo.findByType(DocumentType.TITLE)
   */
  async findByType(type: DocumentType): Promise<Document[]> {
    return this.findByConditions({ type });
  }

  /**
   * Mark document as extracted with AI-extracted data
   *
   * Updates a document to store AI-extracted metadata and summary.
   * Used after Azure Document Intelligence or similar AI processing.
   *
   * @param documentId - The document ID
   * @param extractedData - JSON object with extracted fields
   * @param summary - Optional text summary of document
   * @returns Updated document
   * @throws NotFoundException if document not found
   *
   * @example
   * const doc = await repo.markExtracted(
   *   'doc-uuid',
   *   {
   *     parcel_number: '123456789',
   *     lot_size: 7500,
   *     zoning: 'R-5'
   *   },
   *   'Single family residential lot, 7500 sq ft, zoned R-5'
   * )
   */
  async markExtracted(
    documentId: string,
    extractedData: Record<string, any>,
    summary?: string
  ): Promise<Document> {
    const document = await this.findById(documentId);
    if (!document) {
      throw new NotFoundException('Document', documentId);
    }

    const updates: Partial<Document> = {
      extracted_data: extractedData,
    };

    if (summary) {
      updates.summary = summary;
    }

    return this.update(documentId, updates);
  }

  /**
   * Get recently uploaded documents
   *
   * Returns the most recently uploaded documents across all projects/loans.
   *
   * @param limit - Maximum number of documents to return (default 10)
   * @returns Array of recent documents
   *
   * @example
   * const recentDocs = await repo.getRecentDocuments(20)
   */
  async getRecentDocuments(limit: number = 10): Promise<Document[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE deleted_at IS NULL
      ORDER BY uploaded_at DESC
      LIMIT $1
    `;
    const result = await this.executeQuery(sql, [limit]);
    return result.rows as Document[];
  }

  /**
   * Find documents by consultant task
   *
   * Used to find documents delivered as part of consultant work (surveys, arborist reports, etc.)
   *
   * @param consultantTaskId - The consultant task ID
   * @returns Array of documents associated with the consultant task
   *
   * @example
   * const surveyDocs = await repo.findByConsultantTask('task-uuid')
   */
  async findByConsultantTask(consultantTaskId: string): Promise<Document[]> {
    return this.findByConditions({ consultant_task_id: consultantTaskId });
  }

  /**
   * Find unprocessed documents
   *
   * Returns documents that have not yet been processed by AI extraction
   * (extracted_data is NULL).
   *
   * Useful for background job queues that process uploaded documents.
   *
   * @returns Array of unprocessed documents
   *
   * @example
   * const unprocessed = await repo.findUnprocessed()
   * for (const doc of unprocessed) {
   *   await aiService.extractData(doc)
   * }
   */
  async findUnprocessed(): Promise<Document[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE extracted_data IS NULL
        AND deleted_at IS NULL
      ORDER BY uploaded_at ASC
    `;
    const result = await this.executeQuery(sql);
    return result.rows as Document[];
  }

  /**
   * Search documents by filename
   *
   * Case-insensitive partial filename search.
   *
   * @param query - The search query
   * @returns Array of matching documents
   *
   * @example
   * const docs = await repo.searchByFilename('survey')
   * // Finds: "survey_123.pdf", "preliminary_survey.pdf", etc.
   */
  async searchByFilename(query: string): Promise<Document[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE filename ILIKE $1
        AND deleted_at IS NULL
      ORDER BY uploaded_at DESC
      LIMIT 50
    `;
    const result = await this.executeQuery(sql, [`%${query}%`]);
    return result.rows as Document[];
  }

  /**
   * Get document storage statistics
   *
   * Returns aggregate statistics about document storage usage.
   *
   * @returns Statistics object with total count and size
   *
   * @example
   * const stats = await repo.getStorageStats()
   * console.log(`Total documents: ${stats.count}`)
   * console.log(`Total size: ${stats.totalSize} bytes`)
   */
  async getStorageStats(): Promise<{ count: number; totalSize: number; avgSize: number }> {
    const sql = `
      SELECT
        COUNT(*) as count,
        COALESCE(SUM(file_size), 0) as total_size,
        COALESCE(AVG(file_size), 0) as avg_size
      FROM ${this.fullTableName}
      WHERE deleted_at IS NULL
    `;
    const result = await this.executeQuery(sql);
    const row = result.rows[0];

    return {
      count: parseInt(row.count, 10),
      totalSize: parseFloat(row.total_size),
      avgSize: parseFloat(row.avg_size),
    };
  }
}

// Export singleton instance
export const documentRepository = new DocumentRepository();
