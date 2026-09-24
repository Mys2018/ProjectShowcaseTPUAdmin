import type { Project, ProjectDto, ProjectStatus, ProjectType } from '../model/types'

function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return new Date(value)
  return new Date(year, month - 1, day)
}

function detectType(dto: ProjectDto): ProjectType {
  const prd = dto.prdMeta as Record<string, unknown>
  if (prd && 'productVision' in prd) return 'Real'
  if (prd && 'problemStatement' in prd) return 'Case'
  return 'Study'
}

function normalizeStatus(raw: string): ProjectStatus {
  const key = raw
    .replace(/([a-z])([A-Z])/g, '$1$2')
    .toLowerCase()
    .replace(/_/g, '')
  const map: Record<string, ProjectStatus> = {
    completed: 'completed',
    inprogress: 'inprogress',
    needsrework: 'needsrework',
    notimplemented: 'notimplemented',
    pending: 'pending',
    recruiting: 'recruiting',
    recruitmentcompleted: 'recruitmentcompleted',
    rejected: 'rejected',
    active: 'active',
    approved: 'approved',
    archived: 'archived'
  }
  return map[key] ?? (raw.toLowerCase() as ProjectStatus)
}

export const mapProjectDto = (dto: ProjectDto): Project => ({
  type: detectType(dto),
  id: dto.id,
  ownerId: dto.ownerId.toString(),
  partner: {
    id: dto.partner?.projectPartnerId ?? '',
    name: dto.partner?.name ?? '—',
    avatarUrl: dto.partner?.profilePicture
  },
  status: normalizeStatus(dto.status),
  meta: dto.meta,
  checkpointGroup: {
    id: dto.checkpoints?.id ?? '',
    title: dto.checkpoints?.name || dto.checkpoints?.id || '—',
    checkpoints: (dto.checkpoints?.checkpoints ?? []).map(c => ({
      title: c.title,
      deadline: parseDate(c.deadline)
    }))
  },
  customCheckpoints: dto.customCheckpoints?.map(c => ({
    title: c.title,
    deadline: parseDate(c.deadline)
  })),
  roles: dto.roles?.map(r => ({
    roleId: r.roleId,
    roleType: r.roleType,
    placesCount: r.placesCount,
    minPlacesCount: r.minPlacesCount,
    studentIds: (r.places ?? []).map(String),
    skills: (r.skills ?? []).map(s => ({
      skillId: s.skillId,
      skillName: s.skillName
    })),
    applicationsCount: r.applicationsCount
  })),
  primaryTag: {
    id: dto.primaryTag?.tagId ?? '',
    name: dto.primaryTag?.tagName ?? '—',
    groupId: dto.primaryTag?.groupId ?? ''
  },
  tags: dto.tags?.map(t => ({
    id: t.tagId,
    name: t.tagName,
    groupId: t.groupId
  })),
  prdMeta: dto.prdMeta,
  isPromoted: dto.isPromoted,
  isLikedByMe: dto.isLikedByMe
})
