/**
 * Project Data Transfer Objects (DTOs)
 *
 * DTOs for Project API endpoints with class-validator decorators
 * for automatic request validation.
 *
 * @example
 * // In route handler:
 * const dto = plainToInstance(CreateProjectDTO, req.body)
 * const errors = await validate(dto)
 * if (errors.length > 0) { ... }
 */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ProjectStatus } from '../types';

/**
 * DTO for creating a new project
 *
 * Required fields: address, city, state
 * Optional fields: everything else
 */
export class CreateProjectDTO {
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  @MinLength(5, { message: 'Address must be at least 5 characters' })
  @MaxLength(255, { message: 'Address must not exceed 255 characters' })
  address!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]{2}$/, { message: 'State must be a 2-letter code (e.g., WA, AZ)' })
  state?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'ZIP code must be valid (e.g., 98101 or 98101-1234)' })
  zip?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  parcel_number?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Purchase price must be a positive number' })
  purchase_price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'List price must be a positive number' })
  list_price?: number;

  @IsUUID('4', { message: 'Submitted by must be a valid UUID' })
  @IsOptional()
  submitted_by?: string;

  @IsUUID('4', { message: 'Assigned to must be a valid UUID' })
  @IsOptional()
  assigned_to?: string;

  @IsUUID('4', { message: 'Assigned builder must be a valid UUID' })
  @IsOptional()
  assigned_builder?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  internal_notes?: string;
}

/**
 * DTO for updating an existing project
 *
 * All fields are optional - only provided fields will be updated.
 */
export class UpdateProjectDTO {
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(255)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]{2}$/, { message: 'State must be a 2-letter code (e.g., WA, AZ)' })
  state?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'ZIP code must be valid (e.g., 98101 or 98101-1234)' })
  zip?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  parcel_number?: string;

  @IsEnum(ProjectStatus, { message: 'Status must be a valid ProjectStatus value' })
  @IsOptional()
  status?: ProjectStatus;

  @IsNumber()
  @IsOptional()
  @Min(0)
  purchase_price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  list_price?: number;

  @IsUUID('4')
  @IsOptional()
  submitted_by?: string;

  @IsUUID('4')
  @IsOptional()
  assigned_to?: string;

  @IsUUID('4')
  @IsOptional()
  assigned_builder?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  internal_notes?: string;
}

/**
 * DTO for transitioning project status
 *
 * Used for POST /api/v1/projects/:id/transition endpoint.
 */
export class TransitionProjectDTO {
  @IsEnum(ProjectStatus, { message: 'Status must be a valid ProjectStatus value' })
  @IsNotEmpty({ message: 'Status is required' })
  status!: ProjectStatus;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}

/**
 * DTO for updating project status (PATCH /api/v1/projects/:id/status)
 *
 * Similar to TransitionProjectDTO but without notes.
 */
export class UpdateProjectStatusDTO {
  @IsEnum(ProjectStatus, { message: 'Status must be a valid ProjectStatus value' })
  @IsNotEmpty({ message: 'Status is required' })
  status!: ProjectStatus;
}

/**
 * Response DTO for Project entities
 *
 * Transforms database Project entity to API response format.
 * Can include related entities when using JOIN queries.
 */
export class ProjectResponseDTO {
  id!: string;
  project_number?: string;
  address!: string;
  city?: string;
  state?: string;
  zip?: string;
  parcel_number?: string;
  status!: ProjectStatus;
  purchase_price?: number;
  list_price?: number;
  submitted_by?: string;
  assigned_to?: string;
  assigned_builder?: string;
  internal_notes?: string;
  created_at!: Date;
  updated_at!: Date;

  // Optional related entities (populated via JOINs or separate queries)
  feasibility?: any;
  loans?: any[];
  documents?: any[];
  tasks?: any[];
}

/**
 * Query parameters DTO for listing projects
 *
 * Used for GET /api/v1/projects with filtering and pagination.
 */
export class ProjectQueryDTO {
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]{2}$/)
  state?: string;

  @IsUUID('4')
  @IsOptional()
  assigned_to?: string;

  @IsUUID('4')
  @IsOptional()
  submitted_by?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Min(1)
  limit?: number;

  @IsString()
  @IsOptional()
  @IsEnum(['created_at', 'updated_at', 'project_number'])
  sort?: 'created_at' | 'updated_at' | 'project_number';

  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
