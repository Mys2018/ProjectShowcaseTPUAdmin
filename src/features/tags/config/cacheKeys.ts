export const tagsKeys = {
  all: ['tags'] as const,
  grouped: () => [...tagsKeys.all, 'grouped'] as const,
  groups: () => [...tagsKeys.all, 'groups'] as const,
};
