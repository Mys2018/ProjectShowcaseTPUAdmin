import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { platformsRequests } from './platforms.requests';
import { platformsKeys } from '../config/cacheKeys';
import type { CreatePlatformRequest, UpdatePlatformRequest } from '@/types';

export const platformsQueries = {
  useList: () =>
    useQuery({
      queryKey: platformsKeys.list(),
      queryFn: () => platformsRequests.list(),
    }),

  useCreate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: CreatePlatformRequest) => platformsRequests.create(body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: platformsKeys.all }),
    });
  },

  useUpdate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body: UpdatePlatformRequest }) =>
        platformsRequests.update(id, body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: platformsKeys.all }),
    });
  },

  useRemove: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => platformsRequests.remove(id),
      onSuccess: () => void qc.invalidateQueries({ queryKey: platformsKeys.all }),
    });
  },
};
