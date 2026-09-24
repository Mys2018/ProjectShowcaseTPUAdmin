import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkpointsRequests } from './checkpoints.requests';
import { checkpointsKeys } from '../config/cacheKeys';
import type { CreateCheckpointPayload, UpdateCheckpointPayload } from '@/types';

export const checkpointsQueries = {
  useList: (params: { offset: number; limit: number }) =>
    useQuery({
      queryKey: checkpointsKeys.list(params),
      queryFn: () => checkpointsRequests.list(params),
    }),

  useCreate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: CreateCheckpointPayload) => checkpointsRequests.create(body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: checkpointsKeys.all }),
    });
  },

  useUpdate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body: UpdateCheckpointPayload }) =>
        checkpointsRequests.update(id, body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: checkpointsKeys.all }),
    });
  },

  useRemove: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => checkpointsRequests.remove(id),
      onSuccess: () => void qc.invalidateQueries({ queryKey: checkpointsKeys.all }),
    });
  },
};
