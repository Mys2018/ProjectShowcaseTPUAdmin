import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { usersRequests } from './users.requests';
import { usersKeys } from '../config/cacheKeys';
import type { PaginatedParams, PlatformRoleName } from '@/types';

export const usersQueries = {
  useList: (params: PaginatedParams) =>
    useQuery({
      queryKey: usersKeys.list(params),
      queryFn: () => usersRequests.list(params),
    }),

  useDetail: (id: number | string, enabled = true) =>
    useQuery({
      queryKey: usersKeys.detail(id),
      queryFn: () => usersRequests.getById(id),
      enabled: enabled && id !== '' && id !== undefined,
    }),

  useScores: (id: number | string, enabled = true) =>
    useQuery({
      queryKey: usersKeys.scores(id),
      queryFn: () => usersRequests.getScores(id),
      enabled,
    }),

  useAssignRole: (userId: number | string) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (roleName: PlatformRoleName) =>
        usersRequests.assignRole(userId, roleName),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: usersKeys.detail(userId) });
        void qc.invalidateQueries({ queryKey: usersKeys.lists() });
      },
    });
  },

  useRevokeRole: (userId: number | string) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (roleName: PlatformRoleName) =>
        usersRequests.revokeRole(userId, roleName),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: usersKeys.detail(userId) });
        void qc.invalidateQueries({ queryKey: usersKeys.lists() });
      },
    });
  },
};
