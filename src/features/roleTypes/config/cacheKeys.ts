export const roleTypesKeys = {
  all: ['role-types'] as const,
  list: () => [...roleTypesKeys.all, 'list'] as const,
};

export const skillsKeys = {
  all: ['skills'] as const,
  list: (params: object) => [...skillsKeys.all, 'list', params] as const,
};
