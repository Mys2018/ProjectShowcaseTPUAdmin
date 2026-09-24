export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  AUTH_STATUS: '/auth/status',
  ME: '/users/me',

  USERS: '/users',
  userById: (id: number | string) => `/users/${id}`,
  userRoles: (id: number | string, roleName: string) =>
    `/users/${id}/roles/${encodeURIComponent(roleName)}`,
  userScores: (id: number | string) => `/users/${id}/scores`,

  PROJECTS: '/projects',
  projectById: (id: string) => `/projects/${id}`,
  projectStatus: (id: string, status: string) =>
    `/projects/${id}/status/${encodeURIComponent(status)}`,
  projectReview: (id: string) => `/projects/${id}/review`,
  projectPromoted: (id: string) => `/projects/${id}/promoted`,
  projectTeam: (id: string) => `/projects/${id}/team`,
  projectTeamMember: (id: string, userId: number | string) =>
    `/projects/${id}/team/${userId}`,
  projectUnblock: (id: string) => `/admin/projects/${id}/unblock`,

  ROLE_TYPES: '/role-types',
  roleTypeById: (id: string) => `/role-types/${id}`,
  SKILLS: '/skills',
  skillById: (id: string) => `/skills/${id}`,
  PARTNERS: '/partners',
  partnerById: (id: string) => `/partners/${id}`,
  TAGS: '/tags',
  tagById: (id: string) => `/tags/${id}`,
  TAG_GROUPS: '/tag-groups',
  tagGroupById: (id: string) => `/tag-groups/${id}`,
  PLATFORMS: '/platforms',
  platformById: (id: string) => `/platforms/${id}`,
  CHECKPOINTS: '/projects/checkpoints',
  checkpointCurrent: '/projects/checkpoints/current',
  checkpointById: (id: string) => `/projects/checkpoints/${id}`,

  MODERATION_COMPLAINTS: '/moderation/complaints',
  moderationComplaintById: (id: string) => `/moderation/complaints/${id}`,
  FILES_UPLOAD: '/files/upload',
} as const;
