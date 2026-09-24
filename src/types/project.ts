import type { ProjectRoleType, Skill } from './catalog';

export type ProjectStatus =
  | 'Completed'
  | 'InProgress'
  | 'NeedsRework'
  | 'NotImplemented'
  | 'Pending'
  | 'Recruiting'
  | 'RecruitmentCompleted'
  | 'Rejected';

export type ProjectType = 'Study' | 'Case' | 'Real';

export interface ProjectMeta {
  title: string;
  description: string;
}

export interface ProjectTag {
  tagId: string;
  tagName: string;
  groupId: string;
}

export interface ProjectPartner {
  projectPartnerId: string;
  name: string;
  profilePicture?: string;
}

export interface ProjectPlatformLink {
  platformId: string;
  name: string;
  url: string;
}

export interface ProjectCheckpoint {
  title: string;
  deadline: string;
}

export interface ProjectCheckpoints {
  id: string;
  checkpoints?: ProjectCheckpoint[];
}

export interface ProjectRoleView {
  roleId: string;
  roleType: ProjectRoleType;
  placesCount: number;
  minPlacesCount: number;
  places?: number[];
  skills?: Skill[];
  applicationsCount: number;
  isAppliedByMe?: boolean;
  relevance: number;
}

export interface StudyPrdMeta {
  prerequisites: string;
  projectGoal: string;
  keyFunctionality?: string[];
}

export interface CasePrdMeta {
  prerequisites: string;
  projectGoal: string;
  problemStatement: string;
  audience?: unknown[];
  functional?: string[];
}

export interface RealPrdMeta {
  productVision: string;
  projectGoal: string;
  businessGoal: string;
  audience?: unknown[];
  functional?: string[];
  nonFunctional?: string[];
  businessMetrics?: string[];
  projectPlan?: string[];
}

interface ProjectBase {
  id: string;
  ownerId: number;
  partner: ProjectPartner;
  status: ProjectStatus;
  meta: ProjectMeta;
  checkpoints: ProjectCheckpoints;
  customCheckpoints?: ProjectCheckpoint[];
  roles?: ProjectRoleView[];
  primaryTag: ProjectTag;
  tags?: ProjectTag[];
  repository?: ProjectPlatformLink[];
  taskTracker?: ProjectPlatformLink[];
  otherPlatforms?: ProjectPlatformLink[];
  isPromoted: boolean;
  isLikedByMe?: boolean;
}

export interface StudyProjectResponse extends ProjectBase {
  prdMeta: StudyPrdMeta;
}

export interface CaseProjectResponse extends ProjectBase {
  prdMeta: CasePrdMeta;
}

export interface RealProjectResponse extends ProjectBase {
  prdMeta: RealPrdMeta;
}

export type ProjectResponse =
  | StudyProjectResponse
  | CaseProjectResponse
  | RealProjectResponse;

export interface ProjectSearchResponse {
  hits?: ProjectResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface ModeratorCommentResponse {
  comment?: string;
}

export interface PromoteProjectRequest {
  isPromoted: boolean;
}

export interface UpdateProjectStatusRequest {
  comment?: string;
}

export interface ProjectListParams {
  offset: number;
  limit: number;
  q?: string;
  projectType?: ProjectType | ProjectType[];
  status?: ProjectStatus | ProjectStatus[];
  tagId?: string | string[];
  sort?: 'relevance' | 'created_asc' | 'created_desc';
  roleTypeId?: string;
  userId?: number;
  managerId?: number;
  onlyApplied?: boolean;
}

export interface CreateProjectRolePayload {
  roleTypeId: string;
  placesCount: number;
  minPlacesCount: number;
  skillIds?: string[];
}

export interface RoleUpdateDto {
  roleId?: string;
  roleTypeId: string;
  placesCount: number;
  minPlacesCount: number;
}

interface CreateProjectBase {
  partnerId: string;
  meta: ProjectMeta;
  checkpoints: string;
  customCheckpoints?: ProjectCheckpoint[];
  roles?: CreateProjectRolePayload[];
  primaryTagId: string;
  tagIds?: string[];
  repository?: ProjectPlatformLink[];
  taskTracker?: ProjectPlatformLink[];
  otherPlatforms?: ProjectPlatformLink[];
}

export interface CreateStudyProjectRequest extends CreateProjectBase {
  type: 'Study';
  prdMeta: StudyPrdMeta;
}

export interface CreateCaseProjectRequest extends CreateProjectBase {
  type: 'Case';
  prdMeta: CasePrdMeta;
}

export interface CreateRealProjectRequest extends CreateProjectBase {
  type: 'Real';
  prdMeta: RealPrdMeta;
}

export type CreateProjectRequest =
  | CreateStudyProjectRequest
  | CreateCaseProjectRequest
  | CreateRealProjectRequest;

export interface CreateProjectResponse {
  projectId: string;
}

interface UpdateProjectBase {
  title?: string;
  description?: string;
  roles?: RoleUpdateDto[];
  roleIdsToDelete?: string[];
  primaryTagId?: string;
  tagIds?: string[];
  repository?: ProjectPlatformLink[];
  taskTracker?: ProjectPlatformLink[];
  otherPlatforms?: ProjectPlatformLink[];
  customCheckpoints?: ProjectCheckpoint[];
}

export interface UpdateStudyProjectRequest extends UpdateProjectBase {
  type: 'Study';
  prdMeta?: StudyPrdMeta;
}

export interface UpdateCaseProjectRequest extends UpdateProjectBase {
  type: 'Case';
  prdMeta?: CasePrdMeta;
}

export interface UpdateRealProjectRequest extends UpdateProjectBase {
  type: 'Real';
  prdMeta?: RealPrdMeta;
}

export type UpdateProjectRequest =
  | UpdateStudyProjectRequest
  | UpdateCaseProjectRequest
  | UpdateRealProjectRequest;
