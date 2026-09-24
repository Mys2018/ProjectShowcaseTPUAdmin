import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import {
  getProjectById,
  getProjectReview,
  getProjectTeam,
  getProjects,
  getUserProjects,
  type ProjectListFilters
} from './requests'

function canonicalizeStatus(status: string): string {
  switch (status) {
    case 'active':
      return 'inprogress'
    case 'approved':
      return 'recruiting'
    case 'archived':
      return 'completed'
    default:
      return status
  }
}

export const useProjects = (filters: ProjectListFilters, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: () => getProjects(filters),
    staleTime: 60 * 1000,
    enabled
  })
}

export const useUserProjects = (
  userId: string,
  filters: { query?: string; offset: number; limit: number }
) => {
  return useQuery({
    queryKey: queryKeys.userList(userId, filters),
    queryFn: () => getUserProjects(userId, filters),
    staleTime: 60 * 1000,
    enabled: Boolean(userId)
  })
}

export const useProjectById = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.detail(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: enabled && Boolean(projectId),
    staleTime: 30 * 1000
  })
}

export const useProjectTeam = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.team(projectId),
    queryFn: () => getProjectTeam(projectId),
    enabled: enabled && Boolean(projectId)
  })
}

export const useProjectReview = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.review(projectId),
    queryFn: () => getProjectReview(projectId),
    enabled: enabled && Boolean(projectId)
  })
}

/**
 * Сводка по статусам.
 * - Если проектов ≤100: один список + client-side count (надёжно).
 * - Если больше: отдельный total на каждый статус (scalar status=PascalCase).
 */
export const useProjectsStatusCounts = (statuses: string[]) => {
  const wanted = statuses.map(canonicalizeStatus)

  return useQuery({
    queryKey: [...queryKeys.all, 'status-counts', [...wanted].sort()] as const,
    queryFn: async () => {
      const counts: Record<string, number> = {}
      for (const s of wanted) counts[s] = 0

      const page = await getProjects({
        offset: 0,
        limit: 100,
        sort: 'created_desc'
      })

      if (page.total <= page.projects.length) {
        for (const p of page.projects) {
          const key = canonicalizeStatus(p.status)
          if (key in counts) counts[key] += 1
        }
        return counts
      }

      const exact = await Promise.all(
        wanted.map(async status => {
          const data = await getProjects({ offset: 0, limit: 1, status })
          return [status, data.total] as const
        })
      )
      for (const [status, total] of exact) {
        counts[status] = total
      }
      return counts
    },
    staleTime: 60 * 1000
  })
}

/** Снимок проектов для отчётов (воронка + укомплектованность). */
export const useProjectsReportSnapshot = (limit = 100) => {
  return useQuery({
    queryKey: [...queryKeys.reportSnapshot(), { limit }] as const,
    queryFn: () =>
      getProjects({
        offset: 0,
        limit,
        sort: 'created_desc'
      }),
    staleTime: 60 * 1000
  })
}
