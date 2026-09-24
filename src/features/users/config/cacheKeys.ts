export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params: object) => [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...usersKeys.details(), String(id)] as const,
  scores: (id: number | string) => [...usersKeys.all, 'scores', String(id)] as const,
};
