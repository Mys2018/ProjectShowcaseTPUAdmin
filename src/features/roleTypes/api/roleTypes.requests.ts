import { axiosInstance } from '@/api/instance';
import { ENDPOINTS } from '@/config/endpoints';
import type {
  CreateProjectRoleTypeRequest,
  CreateProjectRoleTypeResponse,
  CreateSkillOutputPayload,
  CreateSkillPayload,
  ProjectRoleType,
  Skill,
  UpdateProjectRoleTypeRequest,
  UpdateSkillPayload,
} from '@/types';

class RoleTypesRequests {
  async list(): Promise<ProjectRoleType[]> {
    const { data } = await axiosInstance.get<ProjectRoleType[]>(ENDPOINTS.ROLE_TYPES);
    return data;
  }

  async create(body: CreateProjectRoleTypeRequest): Promise<CreateProjectRoleTypeResponse> {
    const { data } = await axiosInstance.post<CreateProjectRoleTypeResponse>(
      ENDPOINTS.ROLE_TYPES,
      body,
    );
    return data;
  }

  async update(id: string, body: UpdateProjectRoleTypeRequest): Promise<void> {
    await axiosInstance.put(ENDPOINTS.roleTypeById(id), body);
  }

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.roleTypeById(id));
  }
}

class SkillsRequests {
  async list(params: {
    offset: number;
    limit: number;
    query?: string;
    roleType?: string;
  }): Promise<Skill[]> {
    const { data } = await axiosInstance.get<Skill[] | { skills?: Skill[] }>(
      ENDPOINTS.SKILLS,
      { params },
    );
    if (Array.isArray(data)) return data;
    return data.skills ?? [];
  }

  async create(body: CreateSkillPayload): Promise<CreateSkillOutputPayload> {
    const { data } = await axiosInstance.post<CreateSkillOutputPayload>(
      ENDPOINTS.SKILLS,
      body,
    );
    return data;
  }

  async update(id: string, body: UpdateSkillPayload): Promise<void> {
    await axiosInstance.put(ENDPOINTS.skillById(id), body);
  }

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.skillById(id));
  }
}

export const roleTypesRequests = new RoleTypesRequests();
export const skillsRequests = new SkillsRequests();
