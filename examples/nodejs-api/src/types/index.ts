/**
 * TypeScript Type Definitions for Connect 2.0 API
 * Matches database schema from connect2 schema
 */

// ============================================
// Enums for Status Values
// ============================================

export enum ProjectStatus {
  LEAD = 'LEAD',
  FEASIBILITY = 'FEASIBILITY',
  GO = 'GO',
  PASS = 'PASS',
  CLOSED = 'CLOSED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  ACQUISITIONS = 'ACQUISITIONS',
  DESIGN = 'DESIGN',
  ENTITLEMENT = 'ENTITLEMENT',
  SERVICING = 'SERVICING',
  AGENT = 'AGENT',
  BUILDER = 'BUILDER',
  CONSULTANT = 'CONSULTANT',
}

export enum ContactType {
  AGENT = 'AGENT',
  BUILDER = 'BUILDER',
  CONSULTANT = 'CONSULTANT',
  BORROWER = 'BORROWER',
  GUARANTOR = 'GUARANTOR',
  SPONSOR = 'SPONSOR',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ConsultantTaskType {
  SURVEY = 'SURVEY',
  TITLE = 'TITLE',
  ARBORIST = 'ARBORIST',
  CIVIL = 'CIVIL',
  GEOTECHNICAL = 'GEOTECHNICAL',
}

export enum ConsultantTaskStatus {
  ORDERED = 'ORDERED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FUNDED = 'FUNDED',
  SERVICING = 'SERVICING',
  PAID_OFF = 'PAID_OFF',
  DEFAULT = 'DEFAULT',
}

export enum DrawStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  HELD = 'HELD',
}

export enum EntitlementStatus {
  PLANNING = 'PLANNING',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  CORRECTIONS = 'CORRECTIONS',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export enum DocumentType {
  SURVEY = 'SURVEY',
  TITLE = 'TITLE',
  ARBORIST = 'ARBORIST',
  PROFORMA = 'PROFORMA',
  PLAN = 'PLAN',
  PERMIT = 'PERMIT',
  INSPECTION = 'INSPECTION',
}

// ============================================
// Core Entity Interfaces
// ============================================

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Contact {
  id: string;
  type: ContactType;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: string;
  project_number?: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  parcel_number?: string;
  status: ProjectStatus;
  purchase_price?: number;
  list_price?: number;
  submitted_by?: string;
  assigned_to?: string;
  assigned_builder?: string;
  internal_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Feasibility {
  id: string;
  project_id: string;
  viability_score?: number;
  go_decision_date?: Date;
  decision_notes?: string;
  proforma?: object;
  created_at: Date;
  updated_at: Date;
}

export interface ConsultantTask {
  id: string;
  feasibility_id: string;
  consultant_id?: string;
  task_type: ConsultantTaskType;
  status: ConsultantTaskStatus;
  ordered_date?: Date;
  due_date?: Date;
  delivered_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Loan {
  id: string;
  loan_number: string;
  project_id?: string;
  borrower_id?: string;
  status: LoanStatus;
  loan_amount?: number;
  interest_rate?: number;
  term_months?: number;
  closing_date?: Date;
  maturity_date?: Date;
  budget?: object;
  assigned_to_bank?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Draw {
  id: string;
  loan_id: string;
  draw_number: number;
  requested_amount?: number;
  approved_amount?: number;
  status: DrawStatus;
  inspection_id?: string;
  conditions_met: boolean;
  notes?: string;
  requested_date?: Date;
  approved_date?: Date;
  paid_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Document {
  id: string;
  project_id?: string;
  loan_id?: string;
  consultant_task_id?: string;
  type: DocumentType;
  filename: string;
  storage_bucket?: string;
  storage_key?: string;
  file_size?: number;
  mime_type?: string;
  extracted_data?: object;
  summary?: string;
  uploaded_by?: string;
  uploaded_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  assigned_contact?: string;
  project_id?: string;
  loan_id?: string;
  due_date?: Date;
  status: TaskStatus;
  priority: TaskPriority;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// Data Transfer Objects (DTOs)
// ============================================

export interface CreateProjectDTO {
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  parcel_number?: string;
  purchase_price?: number;
  list_price?: number;
  submitted_by?: string;
  assigned_to?: string;
  assigned_builder?: string;
  internal_notes?: string;
}

export interface UpdateProjectDTO {
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  parcel_number?: string;
  status?: ProjectStatus;
  purchase_price?: number;
  list_price?: number;
  submitted_by?: string;
  assigned_to?: string;
  assigned_builder?: string;
  internal_notes?: string;
}

export interface TransitionProjectDTO {
  status: ProjectStatus;
  notes?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  assigned_to?: string;
  assigned_contact?: string;
  project_id?: string;
  loan_id?: string;
  due_date?: Date;
  priority?: TaskPriority;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  assigned_to?: string;
  assigned_contact?: string;
  due_date?: Date;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface CreateDocumentDTO {
  project_id?: string;
  loan_id?: string;
  consultant_task_id?: string;
  type: DocumentType;
  filename: string;
  storage_bucket?: string;
  storage_key?: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by?: string;
}

// ============================================
// Extended Types with Joins
// ============================================

export interface ProjectWithRelations extends Project {
  submitted_by_contact?: Contact;
  assigned_to_user?: User;
  assigned_builder_contact?: Contact;
  feasibility?: Feasibility;
  documents?: Document[];
  tasks?: Task[];
}

export interface TaskWithRelations extends Task {
  assigned_to_user?: User;
  assigned_contact_info?: Contact;
  project?: Project;
  loan?: Loan;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  statusCode?: number;
}

// ============================================
// Query Parameters
// ============================================

export interface ProjectQueryParams {
  status?: ProjectStatus;
  city?: string;
  state?: string;
  assigned_to?: string;
  submitted_by?: string;
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'updated_at' | 'project_number';
  order?: 'asc' | 'desc';
}

export interface TaskQueryParams {
  status?: TaskStatus;
  assigned_to?: string;
  project_id?: string;
  loan_id?: string;
  priority?: TaskPriority;
  overdue?: boolean;
  page?: number;
  limit?: number;
}
