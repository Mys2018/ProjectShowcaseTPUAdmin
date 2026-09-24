import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { getPlatforms } from './requests'

export const usePlatforms = () =>
  useQuery({
    queryKey: queryKeys.list,
    queryFn: getPlatforms,
    staleTime: 60 * 1000
  })
