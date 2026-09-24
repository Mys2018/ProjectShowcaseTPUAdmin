import type { ProjectStatus } from '../model/types'
import { assertNever } from '@/shared'

export const getStatusTranslation = (status: ProjectStatus) => {
  switch (status) {
    case 'completed':
      return 'Завершён'
    case 'inprogress':
      return 'В работе'
    case 'needsrework':
      return 'На доработке'
    case 'notimplemented':
      return 'Не реализован'
    case 'pending':
      return 'На модерации'
    case 'recruiting':
      return 'Набор'
    case 'recruitmentcompleted':
      return 'Набор завершён'
    case 'rejected':
      return 'Отклонён'
    case 'active':
      return 'Активен'
    case 'approved':
      return 'Одобрен'
    case 'archived':
      return 'В архиве'
    default:
      return assertNever(status)
  }
}

export const ALL_PROJECT_STATUSES: ProjectStatus[] = [
  'pending',
  'needsrework',
  'recruiting',
  'recruitmentcompleted',
  'inprogress',
  'completed',
  'notimplemented',
  'rejected'
]

export const statusNeedsComment = (status: ProjectStatus) =>
  status === 'needsrework' || status === 'rejected'

/** API path segment (PascalCase) */
export const toApiStatus = (status: ProjectStatus): string => {
  const map: Record<ProjectStatus, string> = {
    completed: 'Completed',
    inprogress: 'InProgress',
    needsrework: 'NeedsRework',
    notimplemented: 'NotImplemented',
    pending: 'Pending',
    recruiting: 'Recruiting',
    recruitmentcompleted: 'RecruitmentCompleted',
    rejected: 'Rejected',
    active: 'InProgress',
    approved: 'Recruiting',
    archived: 'Completed'
  }
  return map[status]
}
