import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { authRequests } from './auth.requests';
import { authKeys } from '../config/cacheKeys';
import { pkceService } from '../utils/pkce';
import type { OAuthExchangeParams } from '../types';
import type { User } from '@/types';
import type { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const authQueries = {
  useMe: (enabled = true): UseQueryResult<User, AxiosError> => {
    return useQuery({
      queryKey: authKeys.me(),
      queryFn: authRequests.getMe,
      retry: false,
      enabled,
      staleTime: Infinity,
    });
  },

  useLogin: (): UseMutationResult<User, AxiosError, OAuthExchangeParams> => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (params) => {
        await authRequests.login(params);
        return authRequests.getMe();
      },
      onSuccess: (user) => {
        useAuthStore.getState().setLoggedOut(false);
        queryClient.setQueryData(authKeys.me(), user);
        pkceService.clear();
      },
    });
  },

  useLogout: (): UseMutationResult<void, AxiosError, void> => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: authRequests.logout,
      onSettled: () => {
        useAuthStore.getState().setLoggedOut(true);
        queryClient.clear();
      },
    });
  },
};
