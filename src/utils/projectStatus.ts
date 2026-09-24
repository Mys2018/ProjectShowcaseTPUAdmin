import type { ProjectResponse, ProjectStatus, ProjectType } from '@/types';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  Pending: 'На модерации',
  NeedsRework: 'На доработке',
  Recruiting: 'Набор',
  RecruitmentCompleted: 'Набор завершён',
  InProgress: 'В работе',
  Completed: 'Завершён',
  NotImplemented: 'Не реализован',
  Rejected: 'Отклонён',
};

export const PROJECT_STATUS_TONES: Record<
  ProjectStatus,
  'neutral' | 'success' | 'warning' | 'danger' | 'info'
> = {
  Pending: 'warning',
  NeedsRework: 'warning',
  Recruiting: 'info',
  RecruitmentCompleted: 'info',
  InProgress: 'info',
  Completed: 'success',
  NotImplemented: 'neutral',
  Rejected: 'danger',
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  Study: 'Учебный',
  Case: 'Кейс',
  Real: 'Реальный',
};

export const ALL_PROJECT_STATUSES = Object.keys(
  PROJECT_STATUS_LABELS,
) as ProjectStatus[];

export function getProjectType(project: ProjectResponse): ProjectType {
  const prd = project.prdMeta as unknown as Record<string, unknown>;
  if (prd && 'productVision' in prd) return 'Real';
  if (prd && 'problemStatement' in prd) return 'Case';
  return 'Study';
}

export function statusNeedsComment(status: ProjectStatus): boolean {
  return status === 'NeedsRework' || status === 'Rejected';
}
