import type {
  ProjectCheckpoint,
  ProjectCheckpoints,
  ProjectTag,
} from './project';

export type { ProjectTag, ProjectCheckpoint, ProjectCheckpoints };

export interface ProjectRoleType {
  id: string;
  name: string;
}

export interface CreateProjectRoleTypeRequest {
  name: string;
}

export interface UpdateProjectRoleTypeRequest {
  id: string;
  name: string;
}

export interface CreateProjectRoleTypeResponse {
  roleTypeId: string;
}

export interface Skill {
  skillId: string;
  skillName: string;
  roleTypeId: string;
}

export interface CreateSkillPayload {
  skillName: string;
  roleTypeId: string;
}

export interface UpdateSkillPayload {
  skillId: string;
  skillName: string;
  roleTypeId: string;
}

export interface CreateSkillOutputPayload {
  skillId: string;
}

export interface PartnerResponse {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface PartnerListResponse {
  partners?: PartnerResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface CreatePartnerRequest {
  name: string;
  profilePicture?: string;
}

export interface CreatePartnerResponse {
  partnerId: string;
}

export interface TagGroup {
  groupId: string;
  groupName: string;
}

export interface TagGroupWithTagsResponse {
  groupId: string;
  groupName: string;
  tags?: ProjectTag[];
}

export interface CreateTagRequest {
  tagName: string;
  groupId: string;
}

export interface CreateTagResponse {
  tagId: string;
}

export interface UpdateTagRequest {
  tagId: string;
  tagName: string;
  groupId: string;
}

export interface CreateTagGroupRequest {
  groupName: string;
}

export interface CreateTagGroupResponse {
  groupId: string;
}

export interface UpdateTagGroupRequest {
  groupId: string;
  groupName: string;
}

export type PlatformCategory = 'Repository' | 'TaskTracker' | 'OtherPlatforms';

export interface Platform {
  platformId: string;
  name: string;
  category: PlatformCategory;
}

export interface PlatformCategoryWithPlatformsResponse {
  category: PlatformCategory;
  platforms?: Platform[];
}

export interface CreatePlatformRequest {
  name: string;
  category: PlatformCategory;
}

export interface CreatePlatformResponse {
  platformId: string;
}

export interface UpdatePlatformRequest {
  platformId?: string;
  name: string;
  category: PlatformCategory;
}

export interface CheckpointListResponse {
  checkpoints?: ProjectCheckpoints[];
  total: number;
  offset: number;
  limit: number;
}

export interface CreateCheckpointPayload {
  checkpoints?: ProjectCheckpoint[];
}

export interface CreateCheckpointResponse {
  checkpointId: string;
}

export interface UpdateCheckpointPayload {
  checkpoints?: ProjectCheckpoint[];
}
