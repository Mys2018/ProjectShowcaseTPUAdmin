import type { GetProjectsResponse } from './types'
import { mapProjectDto } from '../lib/mappers'
import { toApiStatus } from '../lib/getStatusTranslation'
import type { Project, ProjectDto, ProjectStatus } from '../model/types'
import { api, ENDPOINTS } from '@/shared'

export type ProjectTeamMember = {
  id: string
  email: string
  name: string
}

export type ProjectListFilters = {
  query?: string
  offset: number
  limit: number
  status?: string | string[]
  projectType?: string | string[]
  userId?: string | string[]
  managerId?: string | string[]
  tagId?: string | string[]
  sort?: string
}

type TeamMemberDto = {
  userId: number
  email: string
  meta: {
    firstName: string
    lastName: string
  }
  profilePicture?: string
  roles?: string[]
}

function asArray<T>(value?: T | T[]): T[] | undefined {
  if (value === undefined || value === null || value === '') return undefined
  return Array.isArray(value) ? value : [value]
}

/** Один элемент — скаляр, несколько — массив (paramsSerializer: indexes null). */
function oneOrMany(values: Array<string | number>): string | number | Array<string | number> {
  const first = values[0]
  if (values.length === 1 && first !== undefined) {
    return first
  }
  return values
}

function toApiStatusParam(raw: string): string {
  if (/^[a-z]+$/.test(raw)) {
    return toApiStatus(raw as ProjectStatus)
  }
  return raw
}

function buildProjectParams(filters: ProjectListFilters) {
  const {
    query: q = '',
    offset,
    limit,
    status,
    projectType,
    userId,
    managerId,
    tagId,
    sort
  } = filters

  const params: Record<string, unknown> = {
    q: q || undefined,
    offset,
    limit
  }

  const statuses = asArray(status)
    ?.map(s => String(s).trim())
    .filter(Boolean)
    .map(toApiStatusParam)
  if (statuses?.length) params.status = oneOrMany(statuses)

  const types = asArray(projectType)
    ?.map(s => String(s).trim())
    .filter(Boolean)
  if (types?.length) params.projectType = oneOrMany(types)

  const users = asArray(userId)
    ?.map(id => Number(id))
    .filter(n => Number.isFinite(n))
  if (users?.length) params.userId = oneOrMany(users)

  const managers = asArray(managerId)
    ?.map(id => Number(id))
    .filter(n => Number.isFinite(n))
  if (managers?.length) params.managerId = oneOrMany(managers)

  const tags = asArray(tagId)
    ?.map(s => String(s).trim())
    .filter(Boolean)
  if (tags?.length) params.tagId = oneOrMany(tags)

  if (sort) params.sort = sort

  return params
}

export async function getProjects(
  filters: ProjectListFilters
): Promise<{ projects: Project[]; total: number }> {
  const { data } = await api.get<GetProjectsResponse>(ENDPOINTS.PROJECTS, {
    params: buildProjectParams(filters)
  })
  return { projects: (data.hits ?? []).map(mapProjectDto), total: data.total ?? 0 }
}

export async function getUserProjects(
  userId: string,
  filters: { query?: string; offset: number; limit: number }
): Promise<{ projects: Project[]; total: number }> {
  const numericId = Number(userId)
  if (!Number.isFinite(numericId)) {
    return { projects: [], total: 0 }
  }

  const id = String(numericId)
  const base = {
    query: filters.query ?? '',
    offset: 0,
    limit: 100
  }

  // userId — участник роли; managerId — менеджер проекта.
  // ownerId в query API нет: owner-проекты дополнительно оставляем по ownerId.
  const [asMember, asManager] = await Promise.all([
    getProjects({ ...base, userId: id }),
    getProjects({ ...base, managerId: id })
  ])

  const memberIds = new Set(asMember.projects.map(p => p.id))
  const map = new Map<string, Project>()

  for (const p of asMember.projects) {
    map.set(p.id, p)
  }

  // managerId-ответ: берём только то, где user реально owner ИЛИ id уже в member-наборе.
  // Если API проигнорирует managerId, client-filter по ownerId отсечёт «все проекты».
  for (const p of asManager.projects) {
    if (p.ownerId === id || memberIds.has(p.id)) {
      map.set(p.id, p)
    }
  }

  let projects = Array.from(map.values())
  const q = (filters.query ?? '').trim().toLowerCase()
  if (q) {
    projects = projects.filter(
      p =>
        p.meta.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.primaryTag.name.toLowerCase().includes(q)
    )
  }

  const total = projects.length
  const slice = projects.slice(filters.offset, filters.offset + filters.limit)
  return { projects: slice, total }
}

export async function getProjectById(projectId: string): Promise<Project> {
  const { data } = await api.get<ProjectDto>(ENDPOINTS.PROJECT_BY_ID(projectId))
  return mapProjectDto(data)
}

export async function getProjectTeam(projectId: string): Promise<ProjectTeamMember[]> {
  const { data } = await api.get<TeamMemberDto[]>(ENDPOINTS.PROJECT_TEAM(projectId))
  return data.map(member => ({
    id: String(member.userId),
    email: member.email,
    name: `${member.meta.lastName} ${member.meta.firstName}`
  }))
}

export async function removeProjectTeamMember(projectId: string, userId: string): Promise<void> {
  await api.delete(ENDPOINTS.PROJECT_TEAM_MEMBER(projectId, userId))
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
  comment?: string
): Promise<void> {
  await api.post(
    ENDPOINTS.PROJECT_STATUS(projectId, toApiStatus(status)),
    comment ? { comment } : {}
  )
}

export async function getProjectReview(projectId: string): Promise<{ comment?: string }> {
  const { data } = await api.get<{ comment?: string }>(ENDPOINTS.PROJECT_REVIEW(projectId))
  return data
}

export async function setProjectPromoted(projectId: string, isPromoted: boolean): Promise<void> {
  await api.patch(ENDPOINTS.PROJECT_PROMOTED(projectId), { isPromoted })
}

export async function unblockProject(projectId: string): Promise<void> {
  await api.post(ENDPOINTS.PROJECT_UNBLOCK(projectId))
}
