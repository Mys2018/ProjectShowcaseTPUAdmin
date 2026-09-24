import { axiosInstance } from '@/api/instance';
import { ENDPOINTS } from '@/config/endpoints';
import type {
  CheckpointListResponse,
  CreateCheckpointPayload,
  CreateCheckpointResponse,
  ProjectCheckpoints,
  UpdateCheckpointPayload,
} from '@/types';

class CheckpointsRequests {
  async list(params: { offset: number; limit: number }): Promise<CheckpointListResponse> {
    const { data } = await axiosInstance.get<CheckpointListResponse>(
      ENDPOINTS.CHECKPOINTS,
      { params },
    );
    return data;
  }

  async getById(id: string): Promise<ProjectCheckpoints> {
    const { data } = await axiosInstance.get<ProjectCheckpoints>(
      ENDPOINTS.checkpointById(id),
    );
    return data;
  }

  async create(body: CreateCheckpointPayload): Promise<CreateCheckpointResponse> {
    const { data } = await axiosInstance.post<CreateCheckpointResponse>(
      ENDPOINTS.CHECKPOINTS,
      body,
    );
    return data;
  }

  async update(id: string, body: UpdateCheckpointPayload): Promise<void> {
    await axiosInstance.put(ENDPOINTS.checkpointById(id), body);
  }

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.checkpointById(id));
  }
}

export const checkpointsRequests = new CheckpointsRequests();
