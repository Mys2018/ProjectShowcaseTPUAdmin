export const partnersKeys = {
  all: ['partners'] as const,
  list: (params: object) => [...partnersKeys.all, 'list', params] as const,
  detail: (id: string) => [...partnersKeys.all, 'detail', id] as const,
};
