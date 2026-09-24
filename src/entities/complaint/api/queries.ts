import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { getComplaints } from './requests'

export const useComplaints = (params: { offset: number; limit: number }) =>
  useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => getComplaints(params),
    staleTime: 30 * 1000
  })
