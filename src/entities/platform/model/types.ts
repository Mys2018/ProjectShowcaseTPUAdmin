export type PlatformCategory = 'Repository' | 'TaskTracker' | 'OtherPlatforms'

export type Platform = {
  id: string
  name: string
  category: PlatformCategory
}

export type PlatformDto = {
  platformId: string
  name: string
  category: PlatformCategory
}

export type PlatformCategoryGroupDto = {
  category: PlatformCategory
  platforms?: PlatformDto[]
}
