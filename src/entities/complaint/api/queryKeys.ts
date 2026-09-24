const all = ['complaints'] as const

export const queryKeys = {
  all,
  lists: () => [...all, 'list'] as const,
  list: (params: object) => [...queryKeys.lists(), params] as const
}
