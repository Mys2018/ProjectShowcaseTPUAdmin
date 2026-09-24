import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createPlatform,
  editPlatform,
  platformQueryKeys,
  removePlatform,
  type Platform
} from '@/entities/platform'
import { useToastsStore } from '@/entities/toast'
import type { BackendError } from '@/shared'

export const useCreatePlatform = () => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()
  return useMutation({
    mutationFn: (payload: Omit<Platform, 'id'>) => createPlatform(payload),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
      show({ status: 'success', title: 'Успех', description: `Платформа «${vars.name}» создана` })
    },
    onError: (error, vars) => {
      const isBackendError = axios.isAxiosError<BackendError>(error) && error.response
      const message = isBackendError ? error.response?.data.msg : error.message
      show({
        status: 'error',
        title: 'Ошибка',
        description: `Не удалось создать «${vars.name}»: ${message}`
      })
    }
  })
}

export const useEditPlatform = () => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()
  return useMutation({
    mutationFn: (payload: Platform) => editPlatform(payload.id, payload),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
      show({ status: 'success', title: 'Успех', description: `Платформа «${vars.name}» обновлена` })
    },
    onError: (error, vars) => {
      const isBackendError = axios.isAxiosError<BackendError>(error) && error.response
      const message = isBackendError ? error.response?.data.msg : error.message
      show({
        status: 'error',
        title: 'Ошибка',
        description: `Не удалось обновить «${vars.name}»: ${message}`
      })
    }
  })
}

export const useRemovePlatform = () => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()
  return useMutation({
    mutationFn: (id: string) => removePlatform(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
      show({ status: 'success', title: 'Успех', description: 'Платформа удалена' })
    },
    onError: error => {
      const isBackendError = axios.isAxiosError<BackendError>(error) && error.response
      const message = isBackendError ? error.response?.data.msg : error.message
      show({
        status: 'error',
        title: 'Ошибка',
        description: `Не удалось удалить платформу: ${message}`
      })
    }
  })
}
