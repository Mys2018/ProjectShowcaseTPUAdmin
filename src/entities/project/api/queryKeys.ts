export const queryKeys = {
  all: ['projects'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params: object) => [...queryKeys.lists(), params] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
  team: (id: string) => [...queryKeys.all, 'team', id] as const,
  review: (id: string) => [...queryKeys.all, 'review', id] as const,
  user: (userId: string) => [...queryKeys.all, 'user', userId] as const,
  userList: (userId: string, params: object) => [...queryKeys.user(userId), params] as const,
  reportSnapshot: () => [...queryKeys.all, 'report-snapshot'] as const
}
