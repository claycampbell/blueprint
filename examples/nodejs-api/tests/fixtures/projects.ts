/**
 * Test fixtures for projects
 * Provides sample data for testing project-related functionality
 */

import { faker } from '@faker-js/faker';
import { CreateProjectDTO } from '../../src/types';

/**
 * Generate a valid CreateProjectDTO with random data
 */
export function generateProjectDTO(overrides?: Partial<CreateProjectDTO>): CreateProjectDTO {
  return {
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zip_code: faker.location.zipCode(),
    purchase_price: faker.number.int({ min: 100000, max: 2000000 }),
    list_price: faker.number.int({ min: 150000, max: 3000000 }),
    submitted_by: faker.string.uuid(),
    assigned_to: faker.string.uuid(),
    internal_notes: faker.lorem.paragraph(),
    ...overrides
  };
}

/**
 * Generate multiple project DTOs
 */
export function generateProjectDTOs(count: number): CreateProjectDTO[] {
  return Array.from({ length: count }, () => generateProjectDTO());
}

/**
 * Predefined test projects with specific characteristics
 */
export const testProjects = {
  /**
   * Minimal valid project (only required fields)
   */
  minimal: {
    address: '123 Main St',
    city: 'Seattle',
    state: 'WA'
  } as CreateProjectDTO,

  /**
   * Complete project with all fields populated
   */
  complete: {
    address: '456 Oak Avenue',
    city: 'Phoenix',
    state: 'AZ',
    zip_code: '85001',
    purchase_price: 500000,
    list_price: 750000,
    submitted_by: '550e8400-e29b-41d4-a716-446655440000',
    assigned_to: '550e8400-e29b-41d4-a716-446655440001',
    internal_notes: 'High priority project for Q1 2025'
  } as CreateProjectDTO,

  /**
   * Project with very high values (edge case testing)
   */
  highValue: {
    address: '789 Luxury Lane',
    city: 'Beverly Hills',
    state: 'CA',
    zip_code: '90210',
    purchase_price: 5000000,
    list_price: 8000000
  } as CreateProjectDTO,

  /**
   * Project with minimal values (edge case testing)
   */
  lowValue: {
    address: '100 Budget Blvd',
    city: 'Tucson',
    state: 'AZ',
    purchase_price: 50000,
    list_price: 75000
  } as CreateProjectDTO,

  /**
   * Project with special characters in address
   */
  specialChars: {
    address: '200 St. John\'s Way, Apt #5-B',
    city: 'O\'Fallon',
    state: 'IL'
  } as CreateProjectDTO
};

/**
 * Invalid project data for testing error handling
 */
export const invalidProjects = {
  /**
   * Missing required address field
   */
  missingAddress: {
    city: 'Seattle',
    state: 'WA'
  } as any,

  /**
   * Invalid state code (not 2 letters)
   */
  invalidState: {
    address: '123 Main St',
    city: 'Seattle',
    state: 'Washington' // Should be 'WA'
  } as any,

  /**
   * Negative price values
   */
  negativePrices: {
    address: '123 Main St',
    city: 'Seattle',
    state: 'WA',
    purchase_price: -100000,
    list_price: -200000
  } as any,

  /**
   * Invalid UUID format
   */
  invalidUUID: {
    address: '123 Main St',
    city: 'Seattle',
    state: 'WA',
    submitted_by: 'not-a-valid-uuid'
  } as any
};

/**
 * Project update fixtures
 */
export const projectUpdates = {
  /**
   * Update purchase price only
   */
  priceUpdate: {
    purchase_price: 600000
  },

  /**
   * Update assignment
   */
  assignmentUpdate: {
    assigned_to: '550e8400-e29b-41d4-a716-446655440002'
  },

  /**
   * Update notes
   */
  notesUpdate: {
    internal_notes: 'Updated project notes with new information'
  },

  /**
   * Update multiple fields
   */
  multipleFields: {
    list_price: 900000,
    internal_notes: 'Price adjusted based on market analysis',
    assigned_to: '550e8400-e29b-41d4-a716-446655440003'
  }
};

/**
 * Project status transition fixtures
 */
export const statusTransitions = {
  toActive: {
    new_status: 'active' as const,
    notes: 'Project approved and activated'
  },
  toOnHold: {
    new_status: 'on_hold' as const,
    notes: 'Waiting for additional documentation'
  },
  toCompleted: {
    new_status: 'completed' as const,
    notes: 'Project successfully completed'
  },
  toCancelled: {
    new_status: 'cancelled' as const,
    notes: 'Client decided not to proceed'
  }
};
