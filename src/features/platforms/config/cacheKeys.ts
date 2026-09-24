export const platformsKeys = {
  all: ['platforms'] as const,
  list: () => [...platformsKeys.all, 'list'] as const,
};
