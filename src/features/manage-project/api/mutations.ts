import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  projectQueryKeys,
  removeProjectTeamMember,
  setProjectPromoted,
  unblockProject,
  updateProjectStatus,
  type ProjectStatus
} from '@/entities/project'
import { useToastsStore } from '@/entities/toast'
import type { BackendError } from '@/shared'

export const useUpdateProjectStatus = (projectId: string) => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()

  return useMutation({
    mutationFn: (payload: { status: ProjectStatus; comment?: string }) =>
      updateProjectStatus(projectId, payload.status, payload.comment),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.detail(projectId) })
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.review(projectId) })
      show({ status: 'success', title: 'Успех', description: 'Статус проекта обновлён' })
    },
    onError: error => {
      const isBackendError = axios.isAxiosError<BackendError>(error) && error.response
      const message = isBackendError ? error.response?.data.msg : error.message
      show({ status: 'error', title: 'Ошибка', description: `Не удалось обновить статус: ${message}` })
    }
  })
}

export const useSetProjectPromoted = (projectId: string) => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()

  return useMutation({
    mutationFn: (isPromoted: boolean) => setProjectPromoted(projectId, isPromoted),
    onSuccess: (_, isPromoted) => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.detail(projectId) })
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() })
      show({
        status: 'success',
        title: 'Успех',
        description: isPromoted ? 'Проект продвинут' : 'Продвижение снято'
      })
    },
    onError: error => {
      const isBackendError = axios.isAxiosError<BackendError>(error) && error.response
      const message = isBackendError ? error.response?.data.msg : error.message
      show({ status: 'error', title: 'Ошибка', description: `Не удалось изменить promo: ${message}` })
    }
  })
}

export const useRemoveProjectTeamMember = (projectId: string) => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()

  return useMutation({
    mutationFn: (userId: string) => removeProjectTeamMember(projectId, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.team(projectId) })
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.detail(projectId) })
      show({ status: 'success', title: 'Успех', description: 'Участник удалён из команды' })
    },
    onError: error => {
      const isBackendError = axios.isAxiosError<BackendError>(error) && error.response
      const message = isBackendError ? error.response?.data.msg : error.message
      show({ status: 'error', title: 'Ошибка', description: `Не удалось удалить участника: ${message}` })
    }
  })
}

export const useUnblockProject = (projectId: string) => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()

  return useMutation({
    mutationFn: () => unblockProject(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.detail(projectId) })
      show({ status: 'success', title: 'Успех', description: 'Timesheet разблокирован' })
    },
    onError: error => {
      const isBackendError = axios.isAxiosError<BackendError>(error) && error.response
      const message = isBackendError ? error.response?.data.msg : error.message
      show({ status: 'error', title: 'Ошибка', description: `Не удалось разблокировать: ${message}` })
    }
  })
}
