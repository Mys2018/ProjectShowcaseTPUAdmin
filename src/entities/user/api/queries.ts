import type { AxiosError } from 'axios'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { User } from '../model/types'
import type { AuthStatusResponse } from './types'
import { queryKeys } from './queryKeys'
import { getAuthStatus, getMe, getUsersByName } from './requests'
import { getUserById } from './requests'

export const useAuthStatus = (enabled = true): UseQueryResult<AuthStatusResponse, AxiosError> => {
  return useQuery({
    queryKey: queryKeys.status,
    queryFn: getAuthStatus,
    retry: false,
    enabled,
    staleTime: Infinity
  })
}

export const useMe = (enabled = true): UseQueryResult<User, AxiosError> => {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: getMe,
    retry: false,
    enabled,
    staleTime: Infinity
  })
}

export const useUserById = (userId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.user(userId ?? ''),
    queryFn: () => getUserById(userId!),
    retry: false,
    enabled: !!userId,
    staleTime: Infinity
  })
}

export const useUsersByName = (query: string, offset: number, limit: number, enabled: boolean = true) => {
  const trimmedQuery = query.trim()
  return useQuery({
    queryKey: queryKeys.search(trimmedQuery, offset, limit),
    queryFn: () => getUsersByName(trimmedQuery, offset, limit),
    enabled: enabled,
    staleTime: 60 * 1000 // 1 min, может вынести в queryClient?
  })
}
