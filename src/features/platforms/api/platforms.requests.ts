import { axiosInstance } from '@/api/instance';
import { ENDPOINTS } from '@/config/endpoints';
import type {
  CreatePlatformRequest,
  CreatePlatformResponse,
  Platform,
  PlatformCategoryWithPlatformsResponse,
  UpdatePlatformRequest,
} from '@/types';

class PlatformsRequests {
  async list(): Promise<PlatformCategoryWithPlatformsResponse[]> {
    const { data } = await axiosInstance.get<PlatformCategoryWithPlatformsResponse[]>(
      ENDPOINTS.PLATFORMS,
    );
    return data;
  }

  async create(body: CreatePlatformRequest): Promise<CreatePlatformResponse> {
    const { data } = await axiosInstance.post<CreatePlatformResponse>(
      ENDPOINTS.PLATFORMS,
      body,
    );
    return data;
  }

  async update(id: string, body: UpdatePlatformRequest): Promise<void> {
    await axiosInstance.put(ENDPOINTS.platformById(id), body);
  }

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.platformById(id));
  }
}

export const platformsRequests = new PlatformsRequests();

export type { Platform };
