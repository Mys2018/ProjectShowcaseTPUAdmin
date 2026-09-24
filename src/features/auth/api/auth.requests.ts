import { axiosInstance } from '@/api/instance';
import type { OAuthExchangeParams } from '../types';
import type { User } from '@/types';
import { ENDPOINTS } from '@/config/endpoints';

class AuthRequests {
  public async login(params: OAuthExchangeParams): Promise<void> {
    await axiosInstance.post(ENDPOINTS.LOGIN, params);
  }

  public async getMe(): Promise<User> {
    const { data } = await axiosInstance.get<User>(ENDPOINTS.ME);
    return data;
  }

  public async logout(): Promise<void> {
    await axiosInstance.post(ENDPOINTS.LOGOUT);
  }
}

export const authRequests = new AuthRequests();
