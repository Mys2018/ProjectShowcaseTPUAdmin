import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tagsRequests } from './tags.requests';
import { tagsKeys } from '../config/cacheKeys';
import type {
  CreateTagGroupRequest,
  CreateTagRequest,
  UpdateTagGroupRequest,
  UpdateTagRequest,
} from '@/types';

export const tagsQueries = {
  useGrouped: () =>
    useQuery({
      queryKey: tagsKeys.grouped(),
      queryFn: () => tagsRequests.listGrouped(),
    }),

  useGroups: () =>
    useQuery({
      queryKey: tagsKeys.groups(),
      queryFn: () => tagsRequests.listGroups(),
    }),

  useCreateTag: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: CreateTagRequest) => tagsRequests.createTag(body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: tagsKeys.all }),
    });
  },

  useUpdateTag: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body: UpdateTagRequest }) =>
        tagsRequests.updateTag(id, body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: tagsKeys.all }),
    });
  },

  useDeleteTag: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => tagsRequests.deleteTag(id),
      onSuccess: () => void qc.invalidateQueries({ queryKey: tagsKeys.all }),
    });
  },

  useCreateGroup: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: CreateTagGroupRequest) => tagsRequests.createGroup(body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: tagsKeys.all }),
    });
  },

  useUpdateGroup: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body: UpdateTagGroupRequest }) =>
        tagsRequests.updateGroup(id, body),
      onSuccess: () => void qc.invalidateQueries({ queryKey: tagsKeys.all }),
    });
  },

  useDeleteGroup: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => tagsRequests.deleteGroup(id),
      onSuccess: () => void qc.invalidateQueries({ queryKey: tagsKeys.all }),
    });
  },
};
