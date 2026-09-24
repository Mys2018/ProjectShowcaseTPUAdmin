import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsRequests } from './projects.requests';
import { projectsKeys } from '../config/cacheKeys';
import type {
  CreateProjectRequest,
  ProjectListParams,
  ProjectStatus,
  PromoteProjectRequest,
  UpdateProjectRequest,
  UpdateProjectStatusRequest,
} from '@/types';

export const projectsQueries = {
  useList: (params: ProjectListParams) =>
    useQuery({
      queryKey: projectsKeys.list(params),
      queryFn: () => projectsRequests.list(params),
    }),

  useDetail: (id: string, enabled = true) =>
    useQuery({
      queryKey: projectsKeys.detail(id),
      queryFn: () => projectsRequests.getById(id),
      enabled: enabled && Boolean(id),
    }),

  useTeam: (id: string, enabled = true) =>
    useQuery({
      queryKey: projectsKeys.team(id),
      queryFn: () => projectsRequests.getTeam(id),
      enabled: enabled && Boolean(id),
    }),

  useReview: (id: string, enabled = true) =>
    useQuery({
      queryKey: projectsKeys.review(id),
      queryFn: () => projectsRequests.getReview(id),
      enabled: enabled && Boolean(id),
    }),

  useCreate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: CreateProjectRequest) => projectsRequests.create(body),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: projectsKeys.lists() });
      },
    });
  },

  useUpdate: (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: UpdateProjectRequest) =>
        projectsRequests.update(projectId, body),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: projectsKeys.detail(projectId) });
        void qc.invalidateQueries({ queryKey: projectsKeys.lists() });
      },
    });
  },

  useRemove: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (projectId: string) => projectsRequests.remove(projectId),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: projectsKeys.lists() });
      },
    });
  },

  useUpdateStatus: (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (payload: {
        status: ProjectStatus;
        body?: UpdateProjectStatusRequest;
      }) => projectsRequests.updateStatus(projectId, payload.status, payload.body),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: projectsKeys.detail(projectId) });
        void qc.invalidateQueries({ queryKey: projectsKeys.lists() });
        void qc.invalidateQueries({ queryKey: projectsKeys.review(projectId) });
      },
    });
  },

  usePromote: (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: PromoteProjectRequest) =>
        projectsRequests.setPromoted(projectId, body),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: projectsKeys.detail(projectId) });
        void qc.invalidateQueries({ queryKey: projectsKeys.lists() });
      },
    });
  },

  useRemoveMember: (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (userId: number) =>
        projectsRequests.removeTeamMember(projectId, userId),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: projectsKeys.team(projectId) });
        void qc.invalidateQueries({ queryKey: projectsKeys.detail(projectId) });
      },
    });
  },

  useUnblock: (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: () => projectsRequests.unblock(projectId),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: projectsKeys.detail(projectId) });
      },
    });
  },
};
