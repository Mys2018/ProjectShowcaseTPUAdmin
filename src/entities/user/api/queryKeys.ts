const all = ['users'] as const;

export const queryKeys = {
  all,
  status: [...all, 'auth', 'status'] as const,
  me: () => [...all, 'auth', 'me'] as const,
  user: (id: string) => [...all, 'user', id] as const,
  scores: (id: string) => [...all, 'scores', id] as const,
  search: (query: string, offset: number, limit: number) =>
    [...all, 'search', { query, limit, offset }] as const
}