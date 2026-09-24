export const complaintsKeys = {
  all: ['complaints'] as const,
  list: (params: object) => [...complaintsKeys.all, 'list', params] as const,
};
