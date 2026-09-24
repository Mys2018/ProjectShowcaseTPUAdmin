export { ProjectSlot } from './ui/project-slot/ProjectSlot.tsx'
export type { Project, ProjectStatus, ProjectType } from './model/types.ts'
export {
  useProjects as useProjectsByName,
  useUserProjects,
  useProjectById,
  useProjectTeam,
  useProjectReview,
  useProjectsStatusCounts,
  useProjectsReportSnapshot
} from './api/queries.ts'
export {
  updateProjectStatus,
  setProjectPromoted,
  removeProjectTeamMember,
  unblockProject
} from './api/requests.ts'
export { queryKeys as projectQueryKeys } from './api/queryKeys.ts'
export {
  getStatusTranslation,
  ALL_PROJECT_STATUSES,
  statusNeedsComment,
  toApiStatus
} from './lib/getStatusTranslation.ts'
export { getTypeTranslation } from './lib/getTypeTranslation.ts'
export {
  getProjectTeamStats,
  getReadinessLabel,
  type TeamReadiness,
  type ProjectTeamStats
} from './lib/teamStats.ts'
