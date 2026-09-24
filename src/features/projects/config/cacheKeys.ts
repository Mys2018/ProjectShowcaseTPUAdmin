export const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  list: (params: object) => [...projectsKeys.lists(), params] as const,
  details: () => [...projectsKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
  team: (id: string) => [...projectsKeys.all, 'team', id] as const,
  review: (id: string) => [...projectsKeys.all, 'review', id] as const,
};
