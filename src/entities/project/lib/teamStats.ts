import type { Project } from '../model/types'

export type TeamReadiness = 'not_ready' | 'core_only' | 'complete'

export type ProjectTeamStats = {
  readiness: TeamReadiness
  readinessLabel: string
  filled: number
  minRequired: number
  places: number
  applications: number
  rolesLabel: string
  rolesDetail: string
}

const READINESS_LABEL: Record<TeamReadiness, string> = {
  not_ready: 'Не готовы',
  core_only: 'Только основные роли',
  complete: 'Собраны'
}

export function getProjectTeamStats(project: Project): ProjectTeamStats {
  const roles = project.roles ?? []

  let filled = 0
  let minRequired = 0
  let places = 0
  let applications = 0
  let coreOk = true

  const roleParts: string[] = []

  for (const role of roles) {
    const taken = role.studentIds.length
    const min = role.minPlacesCount ?? 0
    const max = role.placesCount ?? 0
    const apps = role.applicationsCount ?? 0

    filled += taken
    minRequired += min
    places += max
    applications += apps

    if (taken < min) coreOk = false

    roleParts.push(`${role.roleType.name} ${taken}/${max}`)
  }

  let readiness: TeamReadiness
  if (roles.length === 0) {
    readiness = 'not_ready'
  } else if (!coreOk) {
    readiness = 'not_ready'
  } else if (places > 0 && filled >= places) {
    readiness = 'complete'
  } else {
    readiness = 'core_only'
  }

  return {
    readiness,
    readinessLabel: READINESS_LABEL[readiness],
    filled,
    minRequired,
    places,
    applications,
    rolesLabel: roleParts.length ? roleParts.join(' · ') : '—',
    rolesDetail: roleParts.length ? roleParts.join(', ') : 'Роли не заданы'
  }
}

export function getReadinessLabel(readiness: TeamReadiness): string {
  return READINESS_LABEL[readiness]
}
