export const checkpointsKeys = {
  all: ['checkpoints'] as const,
  list: (params: object) => [...checkpointsKeys.all, 'list', params] as const,
};
