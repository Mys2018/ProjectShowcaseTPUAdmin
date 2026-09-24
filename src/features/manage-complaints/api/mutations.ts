import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  complaintQueryKeys,
  resolveComplaint,
  type ComplaintStatus
} from '@/entities/complaint'
import { useToastsStore } from '@/entities/toast'
import type { BackendError } from '@/shared'

export const useResolveComplaint = () => {
  const queryClient = useQueryClient()
  const { show } = useToastsStore()

  return useMutation({
    mutationFn: (payload: { id: string; status: ComplaintStatus }) =>
      resolveComplaint(payload.id, payload.status),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({ queryKey: complaintQueryKeys.all })
      show({
        status: 'success',
        title: 'Успех',
        description:
          vars.status === 'Resolved' ? 'Жалоба принята' : 'Жалоба отклонена'
      })
    },
    onError: error => {
      const isBackendError = axios.isAxiosError<BackendError>(error) && error.response
      const message = isBackendError ? error.response?.data.msg : error.message
      show({
        status: 'error',
        title: 'Ошибка',
        description: `Не удалось обновить жалобу: ${message}`
      })
    }
  })
}
