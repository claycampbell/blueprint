export interface Project {
  id: string
  name: string
  address: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}

export type ProjectStatus =
  | 'lead'
  | 'feasibility'
  | 'entitlement'
  | 'construction'
  | 'completed'
  | 'cancelled'

export interface CreateProjectInput {
  name: string
  address: string
}

export interface UpdateProjectInput {
  name?: string
  address?: string
  status?: ProjectStatus
}
