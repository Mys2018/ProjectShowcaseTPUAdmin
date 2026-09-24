import { axiosInstance } from '@/api/instance';
import { ENDPOINTS } from '@/config/endpoints';
import { appendParams } from '@/utils/format';
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  ModeratorCommentResponse,
  ProjectListParams,
  ProjectResponse,
  ProjectSearchResponse,
  ProjectStatus,
  PromoteProjectRequest,
  UpdateProjectRequest,
  UpdateProjectStatusRequest,
  UserCard,
} from '@/types';

class ProjectsRequests {
  async list(params: ProjectListParams): Promise<ProjectSearchResponse> {
    const search = new URLSearchParams();
    appendParams(search, {
      offset: params.offset,
      limit: params.limit,
      q: params.q,
      sort: params.sort,
      projectType: params.projectType,
      status: params.status,
      tagId: params.tagId,
      roleTypeId: params.roleTypeId,
      userId: params.userId,
      managerId: params.managerId,
      onlyApplied: params.onlyApplied,
    });
    const { data } = await axiosInstance.get<ProjectSearchResponse>(
      `${ENDPOINTS.PROJECTS}?${search.toString()}`,
    );
    return data;
  }

  async getById(id: string): Promise<ProjectResponse> {
    const { data } = await axiosInstance.get<ProjectResponse>(
      ENDPOINTS.projectById(id),
    );
    return data;
  }

  async create(body: CreateProjectRequest): Promise<CreateProjectResponse> {
    const { data } = await axiosInstance.post<CreateProjectResponse>(
      ENDPOINTS.PROJECTS,
      body,
    );
    return data;
  }

  async update(id: string, body: UpdateProjectRequest): Promise<void> {
    await axiosInstance.patch(ENDPOINTS.projectById(id), body);
  }

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.projectById(id));
  }

  async getTeam(id: string): Promise<UserCard[]> {
    const { data } = await axiosInstance.get<UserCard[]>(ENDPOINTS.projectTeam(id));
    return data;
  }

  async removeTeamMember(projectId: string, userId: number | string): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.projectTeamMember(projectId, userId));
  }

  async updateStatus(
    projectId: string,
    status: ProjectStatus,
    body?: UpdateProjectStatusRequest,
  ): Promise<void> {
    await axiosInstance.post(ENDPOINTS.projectStatus(projectId, status), body ?? {});
  }

  async getReview(projectId: string): Promise<ModeratorCommentResponse> {
    const { data } = await axiosInstance.get<ModeratorCommentResponse>(
      ENDPOINTS.projectReview(projectId),
    );
    return data;
  }

  async setPromoted(projectId: string, body: PromoteProjectRequest): Promise<void> {
    await axiosInstance.patch(ENDPOINTS.projectPromoted(projectId), body);
  }

  async unblock(projectId: string): Promise<void> {
    await axiosInstance.post(ENDPOINTS.projectUnblock(projectId));
  }
}

export const projectsRequests = new ProjectsRequests();
