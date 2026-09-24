import type { PlatformCategory, PlatformCategoryGroupDto, PlatformDto } from '../model/types'
import { mapPlatformDto } from '../lib/mappers'
import type { Platform } from '../model/types'
import { api, ENDPOINTS } from '@/shared'

export const getPlatforms = async (): Promise<Platform[]> => {
  const { data } = await api.get<PlatformCategoryGroupDto[]>(ENDPOINTS.PLATFORMS)
  return data.flatMap(group => (group.platforms ?? []).map(mapPlatformDto))
}

export const createPlatform = async (payload: Omit<Platform, 'id'>): Promise<string> => {
  const { data } = await api.post<{ platformId: string }>(ENDPOINTS.PLATFORMS, {
    name: payload.name,
    category: payload.category
  })
  return data.platformId
}

export const editPlatform = async (id: string, payload: Platform): Promise<void> => {
  const dto: PlatformDto = {
    platformId: payload.id,
    name: payload.name,
    category: payload.category
  }
  await api.put(ENDPOINTS.PLATFORM_BY_ID(id), dto)
}

export const removePlatform = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.PLATFORM_BY_ID(id))
}

export type { PlatformCategory }
