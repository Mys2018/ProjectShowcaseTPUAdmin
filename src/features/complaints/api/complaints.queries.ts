import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { complaintsRequests } from './complaints.requests';
import { complaintsKeys } from '../config/cacheKeys';
import type { ResolveComplaintRequest } from '@/types';

export const complaintsQueries = {
  useList: (params: { offset: number; limit: number }) =>
    useQuery({
      queryKey: complaintsKeys.list(params),
      queryFn: () => complaintsRequests.list(params),
    }),

  useResolve: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body: ResolveComplaintRequest }) =>
        complaintsRequests.resolve(id, body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: complaintsKeys.all }),
    });
  },
};
