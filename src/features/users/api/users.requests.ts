import { axiosInstance } from '@/api/instance';
import { ENDPOINTS } from '@/config/endpoints';
import type {
  FindUserCardResponse,
  PaginatedParams,
  PlatformRoleName,
  StudentScoreResponse,
  User,
} from '@/types';

class UsersRequests {
  async list(params: PaginatedParams): Promise<FindUserCardResponse> {
    const { data } = await axiosInstance.get<FindUserCardResponse>(ENDPOINTS.USERS, {
      params: {
        offset: params.offset,
        limit: params.limit,
        query: params.query || undefined,
      },
    });
    return data;
  }

  async getById(id: number | string): Promise<User> {
    const { data } = await axiosInstance.get<User>(ENDPOINTS.userById(id));
    return data;
  }

  async assignRole(id: number | string, roleName: PlatformRoleName): Promise<void> {
    await axiosInstance.put(ENDPOINTS.userRoles(id, roleName), {});
  }

  async revokeRole(id: number | string, roleName: PlatformRoleName): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.userRoles(id, roleName));
  }

  async getScores(id: number | string): Promise<StudentScoreResponse> {
    const { data } = await axiosInstance.get<StudentScoreResponse>(
      ENDPOINTS.userScores(id),
    );
    return data;
  }
}

export const usersRequests = new UsersRequests();
