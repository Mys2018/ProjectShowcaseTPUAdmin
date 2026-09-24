import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createSkill,
  editSkill,
  removeSkill,
  skillQueryKeys,
  type Skill
} from '@/entities/skill'
import { useToastsStore } from '@/entities/toast'
import type { BackendError } from '@/shared'

export const useCreateSkill = () => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()
  return useMutation({
    mutationFn: (payload: Omit<Skill, 'id'>) => createSkill(payload),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({ queryKey: skillQueryKeys.all })
      show({ status: 'success', title: 'Успех', description: `Скилл «${vars.name}» создан` })
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

export const useEditSkill = () => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()
  return useMutation({
    mutationFn: (payload: Skill) => editSkill(payload.id, payload),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({ queryKey: skillQueryKeys.all })
      show({ status: 'success', title: 'Успех', description: `Скилл «${vars.name}» обновлён` })
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

export const useRemoveSkill = () => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()
  return useMutation({
    mutationFn: (id: string) => removeSkill(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: skillQueryKeys.all })
      show({ status: 'success', title: 'Успех', description: 'Скилл удалён' })
    },
    onError: error => {
      const isBackendError = axios.isAxiosError<BackendError>(error) && error.response
      const message = isBackendError ? error.response?.data.msg : error.message
      show({
        status: 'error',
        title: 'Ошибка',
        description: `Не удалось удалить скилл: ${message}`
      })
    }
  })
}
