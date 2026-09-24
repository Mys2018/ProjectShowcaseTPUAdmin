import type { Platform, PlatformDto } from '../model/types'

export const mapPlatformDto = (dto: PlatformDto): Platform => ({
  id: dto.platformId,
  name: dto.name,
  category: dto.category
})
