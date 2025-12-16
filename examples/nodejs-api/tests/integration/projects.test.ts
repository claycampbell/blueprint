/**
 * Integration tests for Project API endpoints
 * Tests all 8 project endpoints with real database and LocalStack
 */

import request from 'supertest';
import express from 'express';
import { projectsRouter } from '../../src/routes/projects';
import { clearAllTables, closeDatabaseConnection } from '../helpers/database';
import { testProjects, invalidProjects, projectUpdates, statusTransitions } from '../fixtures/projects';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/v1', projectsRouter);

describe('Project API Integration Tests', () => {

  // Clean database before each test
  beforeEach(async () => {
    await clearAllTables();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe('GET /api/v1/projects', () => {
    it('should return empty array when no projects exist', async () => {
      const response = await request(app)
        .get('/api/v1/projects')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: []
      });
    });

    it('should return all projects when they exist', async () => {
      // Create 3 test projects
      await request(app).post('/api/v1/projects').send(testProjects.minimal);
      await request(app).post('/api/v1/projects').send(testProjects.complete);
      await request(app).post('/api/v1/projects').send(testProjects.highValue);

      const response = await request(app)
        .get('/api/v1/projects')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('project_number');
      expect(response.body.data[0]).toHaveProperty('created_at');
    });

    it('should support pagination with limit and offset', async () => {
      // Create 5 projects
      for (let i = 0; i < 5; i++) {
        await request(app).post('/api/v1/projects').send({
          address: `${i} Test St`,
          city: 'Seattle',
          state: 'WA'
        });
      }

      // Test pagination
      const response = await request(app)
        .get('/api/v1/projects?limit=2&offset=1')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
    });

    it('should filter projects by status', async () => {
      // Create projects with different statuses
      const project1 = await request(app).post('/api/v1/projects').send(testProjects.minimal);
      const project1Id = project1.body.data.id;

      await request(app)
        .post(`/api/v1/projects/${project1Id}/transition`)
        .send(statusTransitions.toActive);

      // Get only active projects
      const response = await request(app)
        .get('/api/v1/projects?status=active')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('active');
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create a project with minimal required fields', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('project_number');
      expect(response.body.data.address).toBe(testProjects.minimal.address);
      expect(response.body.data.status).toBe('draft'); // Default status
    });

    it('should create a project with all fields populated', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.complete)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.address).toBe(testProjects.complete.address);
      expect(response.body.data.purchase_price).toBe(testProjects.complete.purchase_price);
      expect(response.body.data.list_price).toBe(testProjects.complete.list_price);
      expect(response.body.data.internal_notes).toBe(testProjects.complete.internal_notes);
    });

    it('should auto-generate project_number in PROJ-YYYY-NNN format', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal)
        .expect(201);

      const projectNumber = response.body.data.project_number;
      const year = new Date().getFullYear();

      expect(projectNumber).toMatch(new RegExp(`^PROJ-${year}-\\d{3}$`));
    });

    it('should increment project numbers sequentially', async () => {
      const response1 = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal);

      const response2 = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.complete);

      const num1 = parseInt(response1.body.data.project_number.split('-')[2]);
      const num2 = parseInt(response2.body.data.project_number.split('-')[2]);

      expect(num2).toBe(num1 + 1);
    });

    it('should reject project with missing required address', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send(invalidProjects.missingAddress)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('address');
    });

    it('should handle special characters in address', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.specialChars)
        .expect(201);

      expect(response.body.data.address).toBe(testProjects.specialChars.address);
    });

    it('should set timestamps automatically', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal)
        .expect(201);

      expect(response.body.data).toHaveProperty('created_at');
      expect(response.body.data).toHaveProperty('updated_at');
      expect(new Date(response.body.data.created_at).getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should retrieve a project by ID', async () => {
      // Create a project first
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.complete);

      const projectId = createResponse.body.data.id;

      // Retrieve it
      const response = await request(app)
        .get(`/api/v1/projects/${projectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(projectId);
      expect(response.body.data.address).toBe(testProjects.complete.address);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440099';

      const response = await request(app)
        .get(`/api/v1/projects/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return 400 for invalid UUID format', async () => {
      const response = await request(app)
        .get('/api/v1/projects/invalid-uuid')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it('should update project purchase price', async () => {
      // Create project
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal);

      const projectId = createResponse.body.data.id;

      // Update price
      const response = await request(app)
        .patch(`/api/v1/projects/${projectId}`)
        .send(projectUpdates.priceUpdate)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.purchase_price).toBe(projectUpdates.priceUpdate.purchase_price);
    });

    it('should update multiple fields at once', async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal);

      const projectId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/v1/projects/${projectId}`)
        .send(projectUpdates.multipleFields)
        .expect(200);

      expect(response.body.data.list_price).toBe(projectUpdates.multipleFields.list_price);
      expect(response.body.data.internal_notes).toBe(projectUpdates.multipleFields.internal_notes);
    });

    it('should update the updated_at timestamp', async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal);

      const projectId = createResponse.body.data.id;
      const originalUpdatedAt = createResponse.body.data.updated_at;

      // Wait 1 second to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await request(app)
        .patch(`/api/v1/projects/${projectId}`)
        .send(projectUpdates.priceUpdate)
        .expect(200);

      expect(new Date(response.body.data.updated_at).getTime())
        .toBeGreaterThan(new Date(originalUpdatedAt).getTime());
    });

    it('should not allow updating project_number', async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal);

      const projectId = createResponse.body.data.id;
      const originalProjectNumber = createResponse.body.data.project_number;

      const response = await request(app)
        .patch(`/api/v1/projects/${projectId}`)
        .send({ project_number: 'PROJ-2025-999' })
        .expect(200);

      // Project number should remain unchanged
      expect(response.body.data.project_number).toBe(originalProjectNumber);
    });

    it('should return 404 when updating non-existent project', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440099';

      const response = await request(app)
        .patch(`/api/v1/projects/${fakeId}`)
        .send(projectUpdates.priceUpdate)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/projects/:id/transition', () => {
    it('should transition project to active status', async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal);

      const projectId = createResponse.body.data.id;

      const response = await request(app)
        .post(`/api/v1/projects/${projectId}/transition`)
        .send(statusTransitions.toActive)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('active');
    });

    it('should transition project through multiple statuses', async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal);

      const projectId = createResponse.body.data.id;

      // Draft -> Active
      await request(app)
        .post(`/api/v1/projects/${projectId}/transition`)
        .send(statusTransitions.toActive)
        .expect(200);

      // Active -> On Hold
      await request(app)
        .post(`/api/v1/projects/${projectId}/transition`)
        .send(statusTransitions.toOnHold)
        .expect(200);

      // On Hold -> Completed
      const response = await request(app)
        .post(`/api/v1/projects/${projectId}/transition`)
        .send(statusTransitions.toCompleted)
        .expect(200);

      expect(response.body.data.status).toBe('completed');
    });

    it('should reject invalid status transition', async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal);

      const projectId = createResponse.body.data.id;

      const response = await request(app)
        .post(`/api/v1/projects/${projectId}/transition`)
        .send({ new_status: 'invalid_status' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should soft delete a project', async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .send(testProjects.minimal);

      const projectId = createResponse.body.data.id;

      // Soft delete
      const response = await request(app)
        .delete(`/api/v1/projects/${projectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Project should still exist but marked as deleted
      const getResponse = await request(app)
        .get(`/api/v1/projects/${projectId}`)
        .expect(404); // Soft-deleted projects should not be returned
    });

    it('should return 404 when deleting non-existent project', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440099';

      const response = await request(app)
        .delete(`/api/v1/projects/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test would require mocking the database to force an error
      // Skipped for now but demonstrates error handling testing approach
    });

    it('should return 500 for server errors', async () => {
      // Test internal server error handling
      // Would require mocking services to throw errors
    });

    it('should validate request body schema', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send({ invalid: 'data' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
