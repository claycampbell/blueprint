/**
 * Unit tests for Project Service
 * Tests business logic with mocked database
 */

import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  searchProjectsByAddress
} from '../../../src/services/project.service';
import * as db from '../../../src/config/database';
import { testProjects, projectUpdates } from '../../fixtures/projects';

// Mock the database module
jest.mock('../../../src/config/database');

const mockQuery = db.query as jest.MockedFunction<typeof db.query>;

describe('Project Service Unit Tests', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllProjects', () => {
    it('should return all projects from database', async () => {
      const mockProjects = [
        { id: '1', address: '123 Main St', status: 'active' },
        { id: '2', address: '456 Oak Ave', status: 'draft' }
      ];

      mockQuery.mockResolvedValueOnce({
        rows: mockProjects,
        rowCount: 2
      } as any);

      const result = await getAllProjects();

      expect(result).toEqual(mockProjects);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM connect2.projects'),
        expect.any(Array)
      );
    });

    it('should apply limit and offset parameters', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      await getAllProjects(10, 20);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT'),
        expect.arrayContaining([10, 20])
      );
    });

    it('should filter by status when provided', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      await getAllProjects(undefined, undefined, 'active');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE status ='),
        expect.arrayContaining(['active'])
      );
    });

    it('should handle database errors', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(getAllProjects()).rejects.toThrow('Database connection failed');
    });

    it('should return empty array when no projects exist', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      const result = await getAllProjects();

      expect(result).toEqual([]);
    });
  });

  describe('getProjectById', () => {
    it('should retrieve project by UUID', async () => {
      const mockProject = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        address: '123 Main St',
        status: 'active'
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockProject],
        rowCount: 1
      } as any);

      const result = await getProjectById(mockProject.id);

      expect(result).toEqual(mockProject);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE id ='),
        [mockProject.id]
      );
    });

    it('should return null when project not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      const result = await getProjectById('550e8400-e29b-41d4-a716-446655440099');

      expect(result).toBeNull();
    });

    it('should throw error for invalid UUID format', async () => {
      await expect(
        getProjectById('invalid-uuid')
      ).rejects.toThrow();
    });

    it('should exclude soft-deleted projects', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      await getProjectById('550e8400-e29b-41d4-a716-446655440000');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        expect.any(Array)
      );
    });
  });

  describe('createProject', () => {
    it('should create project with minimal fields', async () => {
      const mockCreatedProject = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        project_number: 'PROJ-2025-001',
        ...testProjects.minimal,
        status: 'draft',
        created_at: new Date(),
        updated_at: new Date()
      };

      // Mock the count query for project number generation
      mockQuery.mockResolvedValueOnce({ rows: [{ count: '0' }], rowCount: 1 } as any);

      // Mock the insert query
      mockQuery.mockResolvedValueOnce({
        rows: [mockCreatedProject],
        rowCount: 1
      } as any);

      const result = await createProject(testProjects.minimal);

      expect(result).toEqual(mockCreatedProject);
      expect(mockQuery).toHaveBeenCalledTimes(2); // Count + Insert
    });

    it('should auto-generate project_number in PROJ-YYYY-NNN format', async () => {
      const year = new Date().getFullYear();

      mockQuery.mockResolvedValueOnce({ rows: [{ count: '5' }], rowCount: 1 } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{ project_number: `PROJ-${year}-006` }],
        rowCount: 1
      } as any);

      const result = await createProject(testProjects.minimal);

      expect(result.project_number).toMatch(new RegExp(`^PROJ-${year}-\\d{3}$`));
    });

    it('should increment project numbers sequentially', async () => {
      // First project (count = 0)
      mockQuery.mockResolvedValueOnce({ rows: [{ count: '0' }], rowCount: 1 } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{ project_number: 'PROJ-2025-001' }],
        rowCount: 1
      } as any);

      await createProject(testProjects.minimal);

      // Second project (count = 1)
      mockQuery.mockResolvedValueOnce({ rows: [{ count: '1' }], rowCount: 1 } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{ project_number: 'PROJ-2025-002' }],
        rowCount: 1
      } as any);

      const result2 = await createProject(testProjects.minimal);

      expect(mockQuery).toHaveBeenCalledTimes(4);
    });

    it('should set default status to draft', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ count: '0' }], rowCount: 1 } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{ ...testProjects.minimal, status: 'draft' }],
        rowCount: 1
      } as any);

      const result = await createProject(testProjects.minimal);

      expect(result.status).toBe('draft');
    });

    it('should validate required address field', async () => {
      await expect(
        createProject({ city: 'Seattle' } as any)
      ).rejects.toThrow();
    });

    it('should handle database constraint violations', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ count: '0' }], rowCount: 1 } as any);
      mockQuery.mockRejectedValueOnce(new Error('Duplicate key violation'));

      await expect(
        createProject(testProjects.complete)
      ).rejects.toThrow('Duplicate key violation');
    });

    it('should create project with all optional fields', async () => {
      const completeProject = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        project_number: 'PROJ-2025-001',
        ...testProjects.complete,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockQuery.mockResolvedValueOnce({ rows: [{ count: '0' }], rowCount: 1 } as any);
      mockQuery.mockResolvedValueOnce({ rows: [completeProject], rowCount: 1 } as any);

      const result = await createProject(testProjects.complete);

      expect(result.purchase_price).toBe(testProjects.complete.purchase_price);
      expect(result.list_price).toBe(testProjects.complete.list_price);
      expect(result.internal_notes).toBe(testProjects.complete.internal_notes);
    });
  });

  describe('updateProject', () => {
    it('should update project fields', async () => {
      const projectId = '550e8400-e29b-41d4-a716-446655440000';
      const updatedProject = {
        id: projectId,
        ...testProjects.minimal,
        purchase_price: 600000,
        updated_at: new Date()
      };

      mockQuery.mockResolvedValueOnce({
        rows: [updatedProject],
        rowCount: 1
      } as any);

      const result = await updateProject(projectId, projectUpdates.priceUpdate);

      expect(result).toEqual(updatedProject);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE connect2.projects'),
        expect.any(Array)
      );
    });

    it('should update multiple fields at once', async () => {
      const projectId = '550e8400-e29b-41d4-a716-446655440000';

      mockQuery.mockResolvedValueOnce({
        rows: [{ ...testProjects.minimal, ...projectUpdates.multipleFields }],
        rowCount: 1
      } as any);

      const result = await updateProject(projectId, projectUpdates.multipleFields);

      expect(result.list_price).toBe(projectUpdates.multipleFields.list_price);
      expect(result.internal_notes).toBe(projectUpdates.multipleFields.internal_notes);
    });

    it('should automatically update updated_at timestamp', async () => {
      const projectId = '550e8400-e29b-41d4-a716-446655440000';

      mockQuery.mockResolvedValueOnce({
        rows: [{ updated_at: new Date() }],
        rowCount: 1
      } as any);

      await updateProject(projectId, projectUpdates.priceUpdate);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('updated_at = NOW()'),
        expect.any(Array)
      );
    });

    it('should return null when project not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      const result = await updateProject(
        '550e8400-e29b-41d4-a716-446655440099',
        projectUpdates.priceUpdate
      );

      expect(result).toBeNull();
    });

    it('should not allow updating immutable fields', async () => {
      const projectId = '550e8400-e29b-41d4-a716-446655440000';

      mockQuery.mockResolvedValueOnce({
        rows: [{ project_number: 'PROJ-2025-001' }],
        rowCount: 1
      } as any);

      await updateProject(projectId, { project_number: 'PROJ-2025-999' } as any);

      // Verify project_number was not in the UPDATE statement
      expect(mockQuery).toHaveBeenCalledWith(
        expect.not.stringContaining('project_number'),
        expect.any(Array)
      );
    });

    it('should handle empty update object', async () => {
      const projectId = '550e8400-e29b-41d4-a716-446655440000';

      await expect(
        updateProject(projectId, {})
      ).rejects.toThrow();
    });
  });

  describe('deleteProject', () => {
    it('should soft delete a project', async () => {
      const projectId = '550e8400-e29b-41d4-a716-446655440000';

      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 } as any);

      await deleteProject(projectId);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE connect2.projects'),
        expect.arrayContaining([projectId])
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at = NOW()'),
        expect.any(Array)
      );
    });

    it('should return false when project not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      const result = await deleteProject('550e8400-e29b-41d4-a716-446655440099');

      expect(result).toBe(false);
    });

    it('should not hard delete the project', async () => {
      const projectId = '550e8400-e29b-41d4-a716-446655440000';

      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 } as any);

      await deleteProject(projectId);

      expect(mockQuery).not.toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM'),
        expect.any(Array)
      );
    });
  });

  describe('getProjectStats', () => {
    it('should return project statistics', async () => {
      const mockStats = {
        total: 100,
        active: 60,
        draft: 25,
        completed: 15
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockStats], rowCount: 1 } as any);

      const result = await getProjectStats();

      expect(result).toEqual(mockStats);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*)'),
        expect.any(Array)
      );
    });

    it('should handle zero projects', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ total: 0, active: 0, draft: 0, completed: 0 }],
        rowCount: 1
      } as any);

      const result = await getProjectStats();

      expect(result.total).toBe(0);
    });
  });

  describe('searchProjectsByAddress', () => {
    it('should search projects by address', async () => {
      const mockResults = [
        { id: '1', address: '123 Main St' },
        { id: '2', address: '123 Main Ave' }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockResults, rowCount: 2 } as any);

      const result = await searchProjectsByAddress('123 Main');

      expect(result).toEqual(mockResults);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.arrayContaining(['%123 Main%'])
      );
    });

    it('should handle no matches', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      const result = await searchProjectsByAddress('nonexistent address');

      expect(result).toEqual([]);
    });

    it('should be case insensitive', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      await searchProjectsByAddress('MAIN STREET');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.any(Array)
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values in optional fields', async () => {
      const projectWithNulls = {
        address: '123 Main St',
        city: null,
        state: null,
        purchase_price: null
      };

      mockQuery.mockResolvedValueOnce({ rows: [{ count: '0' }], rowCount: 1 } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{ ...projectWithNulls, id: '1' }],
        rowCount: 1
      } as any);

      const result = await createProject(projectWithNulls as any);

      expect(result).toHaveProperty('address');
    });

    it('should handle very long address strings', async () => {
      const longAddress = 'A'.repeat(500);

      mockQuery.mockResolvedValueOnce({ rows: [{ count: '0' }], rowCount: 1 } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{ address: longAddress }],
        rowCount: 1
      } as any);

      const result = await createProject({ address: longAddress } as any);

      expect(result.address).toBe(longAddress);
    });

    it('should handle concurrent creates with same data', async () => {
      // Both requests check count at same time
      mockQuery.mockResolvedValue({ rows: [{ count: '0' }], rowCount: 1 } as any);
      mockQuery.mockResolvedValue({
        rows: [{ project_number: 'PROJ-2025-001' }],
        rowCount: 1
      } as any);

      const promises = [
        createProject(testProjects.minimal),
        createProject(testProjects.minimal)
      ];

      await Promise.all(promises);

      // Both should succeed (database handles uniqueness)
      expect(mockQuery).toHaveBeenCalled();
    });
  });
});
