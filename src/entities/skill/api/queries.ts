import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { getSkills } from './requests'

export const useSkills = (params: {
  offset?: number
  limit?: number
  query?: string
  roleType?: string
}) =>
  useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => getSkills(params),
    staleTime: 60 * 1000
  })
