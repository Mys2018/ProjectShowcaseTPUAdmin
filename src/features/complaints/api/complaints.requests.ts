import { axiosInstance } from '@/api/instance';
import { ENDPOINTS } from '@/config/endpoints';
import type {
  ComplaintSearchResponse,
  ResolveComplaintRequest,
} from '@/types';

class ComplaintsRequests {
  async list(params: { offset: number; limit: number }): Promise<ComplaintSearchResponse> {
    const { data } = await axiosInstance.get<ComplaintSearchResponse>(
      ENDPOINTS.MODERATION_COMPLAINTS,
      { params },
    );
    return data;
  }

  async resolve(id: string, body: ResolveComplaintRequest): Promise<void> {
    await axiosInstance.put(ENDPOINTS.moderationComplaintById(id), body);
  }
}

export const complaintsRequests = new ComplaintsRequests();
