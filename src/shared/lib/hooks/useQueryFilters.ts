import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

interface Filters {
  query?: string
  page?: number
  limit?: number
  status?: string
  projectType?: string
}

export const useQueryFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('query') || ''
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const status = searchParams.get('status') || ''
  const projectType = searchParams.get('projectType') || ''

  const updateFilters = useCallback(
    (fields: Filters) => {
      setSearchParams(prevParams => {
        const newParams = new URLSearchParams(prevParams)
        Object.entries(fields).forEach(([key, value]) => {
          if (value === undefined || value === '') {
            newParams.delete(key)
          } else {
            newParams.set(key, String(value))
          }
        })
        return newParams
      })
    },
    [setSearchParams]
  )

  const setQuery = useCallback(
    (value: string) => updateFilters({ query: value, page: 1 }),
    [updateFilters]
  )
  const setPage = useCallback((page: number) => updateFilters({ page }), [updateFilters])
  const setLimit = useCallback(
    (limit: number) => updateFilters({ limit, page: 1 }),
    [updateFilters]
  )
  const setStatus = useCallback(
    (value: string) => updateFilters({ status: value, page: 1 }),
    [updateFilters]
  )
  const setProjectType = useCallback(
    (value: string) => updateFilters({ projectType: value, page: 1 }),
    [updateFilters]
  )

  return {
    query,
    limit,
    page,
    offset: (page - 1) * limit,
    status,
    projectType,
    setQuery,
    setPage,
    setLimit,
    setStatus,
    setProjectType
  }
}
