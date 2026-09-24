import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleTypesRequests, skillsRequests } from './roleTypes.requests';
import { roleTypesKeys, skillsKeys } from '../config/cacheKeys';
import type {
  CreateProjectRoleTypeRequest,
  CreateSkillPayload,
  UpdateProjectRoleTypeRequest,
  UpdateSkillPayload,
} from '@/types';

export const roleTypesQueries = {
  useList: () =>
    useQuery({
      queryKey: roleTypesKeys.list(),
      queryFn: () => roleTypesRequests.list(),
    }),

  useCreate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: CreateProjectRoleTypeRequest) => roleTypesRequests.create(body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: roleTypesKeys.all }),
    });
  },

  useUpdate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body: UpdateProjectRoleTypeRequest }) =>
        roleTypesRequests.update(id, body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: roleTypesKeys.all }),
    });
  },

  useRemove: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => roleTypesRequests.remove(id),
      onSuccess: () => void qc.invalidateQueries({ queryKey: roleTypesKeys.all }),
    });
  },
};

export const skillsQueries = {
  useList: (params: {
    offset: number;
    limit: number;
    query?: string;
    roleType?: string;
  }) =>
    useQuery({
      queryKey: skillsKeys.list(params),
      queryFn: () => skillsRequests.list(params),
    }),

  useCreate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: CreateSkillPayload) => skillsRequests.create(body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: skillsKeys.all }),
    });
  },

  useUpdate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body: UpdateSkillPayload }) =>
        skillsRequests.update(id, body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: skillsKeys.all }),
    });
  },

  useRemove: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => skillsRequests.remove(id),
      onSuccess: () => void qc.invalidateQueries({ queryKey: skillsKeys.all }),
    });
  },
};
