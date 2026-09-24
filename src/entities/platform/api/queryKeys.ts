const all = ['platforms'] as const

export const queryKeys = {
  all,
  list: [...all, 'list'] as const
}
