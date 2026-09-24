import { axiosInstance } from '@/api/instance';
import { ENDPOINTS } from '@/config/endpoints';
import type {
  CreatePartnerRequest,
  CreatePartnerResponse,
  PartnerListResponse,
  PartnerResponse,
  PaginatedParams,
} from '@/types';

class PartnersRequests {
  async list(params: PaginatedParams): Promise<PartnerListResponse> {
    const { data } = await axiosInstance.get<PartnerListResponse>(ENDPOINTS.PARTNERS, {
      params: {
        offset: params.offset,
        limit: params.limit,
        query: params.query || undefined,
      },
    });
    return data;
  }

  async getById(id: string): Promise<PartnerResponse> {
    const { data } = await axiosInstance.get<PartnerResponse>(ENDPOINTS.partnerById(id));
    return data;
  }

  async create(body: CreatePartnerRequest): Promise<CreatePartnerResponse> {
    const { data } = await axiosInstance.post<CreatePartnerResponse>(
      ENDPOINTS.PARTNERS,
      body,
    );
    return data;
  }
}

export const partnersRequests = new PartnersRequests();
