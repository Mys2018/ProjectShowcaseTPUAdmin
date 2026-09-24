import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { partnersRequests } from './partners.requests';
import { partnersKeys } from '../config/cacheKeys';
import type { CreatePartnerRequest, PaginatedParams } from '@/types';

export const partnersQueries = {
  useList: (params: PaginatedParams) =>
    useQuery({
      queryKey: partnersKeys.list(params),
      queryFn: () => partnersRequests.list(params),
    }),

  useCreate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: CreatePartnerRequest) => partnersRequests.create(body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: partnersKeys.all }),
    });
  },
};
