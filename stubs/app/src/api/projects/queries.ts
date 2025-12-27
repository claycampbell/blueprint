import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { projectKeys } from './keys'
import type { Project } from './types'

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async (): Promise<Project[]> => {
      const response = await apiClient.get('/api/v1/projects')
      return response.data.data
    },
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async (): Promise<Project> => {
      const response = await apiClient.get(`/api/v1/projects/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}
