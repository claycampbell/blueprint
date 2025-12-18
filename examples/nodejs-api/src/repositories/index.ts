/**
 * Repository Layer - Central Exports
 *
 * This file provides centralized exports for all repository classes
 * and their singleton instances.
 *
 * @example
 * // Import specific repository instances
 * import { projectRepository, loanRepository } from './repositories';
 *
 * // Import repository classes for dependency injection
 * import { ProjectRepository, LoanRepository } from './repositories';
 *
 * // Use singleton instances
 * const projects = await projectRepository.findAll();
 * const loans = await loanRepository.findByBorrower(borrowerId);
 */

// Base repository (for extending in custom repositories)
export { BaseRepository } from './BaseRepository';

// Entity-specific repositories (classes)
export { ProjectRepository } from './ProjectRepository';
export { LoanRepository } from './LoanRepository';
export { ContactRepository } from './ContactRepository';
export { TaskRepository } from './TaskRepository';
export { DocumentRepository } from './DocumentRepository';

// Singleton instances (recommended for most use cases)
export { projectRepository } from './ProjectRepository';
export { loanRepository } from './LoanRepository';
export { contactRepository } from './ContactRepository';
export { taskRepository } from './TaskRepository';
export { documentRepository } from './DocumentRepository';
