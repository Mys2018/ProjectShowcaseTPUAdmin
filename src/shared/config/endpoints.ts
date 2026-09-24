export const ENDPOINTS = {
  LOGIN: import.meta.env.VITE_REF_POST_LOGIN,
  STATUS: import.meta.env.VITE_REF_GET_AUTH_STATUS,
  ME: import.meta.env.VITE_REF_GET_ME_DATA,
  REFRESH: import.meta.env.VITE_REF_POST_RELOGIN,
  LOGOUT: import.meta.env.VITE_REF_POST_LOGOUT,
  USER_BY_ID: (userId: string) => `${import.meta.env.VITE_REF_GET_USERS}/${userId}`,
  USERS_BY_NAME: import.meta.env.VITE_REF_GET_USERS,
  USER_SCORES: (userId: string) => `${import.meta.env.VITE_REF_GET_USERS}/${userId}/scores`,
  PROJECTS: import.meta.env.VITE_REF_GET_PROJECTS,
  PROJECT_BY_ID: (projectId: string) => `${import.meta.env.VITE_REF_GET_PROJECTS}/${projectId}`,
  PROJECT_STATUS: (projectId: string, status: string) =>
    `${import.meta.env.VITE_REF_GET_PROJECTS}/${projectId}/status/${status}`,
  PROJECT_REVIEW: (projectId: string) =>
    `${import.meta.env.VITE_REF_GET_PROJECTS}/${projectId}/review`,
  PROJECT_PROMOTED: (projectId: string) =>
    `${import.meta.env.VITE_REF_GET_PROJECTS}/${projectId}/promoted`,
  PROJECT_TEAM: (projectId: string) =>
    `${import.meta.env.VITE_REF_GET_PROJECTS}/${projectId}/team`,
  PROJECT_TEAM_MEMBER: (projectId: string, userId: string) =>
    `${import.meta.env.VITE_REF_GET_PROJECTS}/${projectId}/team/${userId}`,
  PROJECT_UNBLOCK: (projectId: string) => `/admin/projects/${projectId}/unblock`,
  USER_ROLES: (userId: string, roleName: string) =>
    `${import.meta.env.VITE_REF_GET_USERS}/${userId}${import.meta.env.VITE_REF_ROLES}/${roleName}`,
  TAGS: import.meta.env.VITE_API_TAGS_URL,
  TAG_BY_ID: (tagId: string) => `${import.meta.env.VITE_API_TAGS_URL}/${tagId}`,
  TAG_GROUPS: import.meta.env.VITE_API_TAG_GROUPS_URL,
  TAG_GROUP_BY_ID: (groupId: string) => `${import.meta.env.VITE_API_TAG_GROUPS_URL}/${groupId}`,
  PROJECT_ROLES: import.meta.env.VITE_API_PROJECT_ROLES_URL,
  PROJECT_ROLE_BY_ID: (roleId: string) =>
    `${import.meta.env.VITE_API_PROJECT_ROLES_URL}/${roleId}`,
  SKILLS: (import.meta.env.VITE_API_SKILLS_URL as string | undefined) || '/skills',
  SKILL_BY_ID: (skillId: string) =>
    `${(import.meta.env.VITE_API_SKILLS_URL as string | undefined) || '/skills'}/${skillId}`,
  PARTNERS: import.meta.env.VITE_API_PARTNERS_URL,
  PARTNER_BY_ID: (partnerId: string) => `${import.meta.env.VITE_API_PARTNERS_URL}/${partnerId}`,
  CHECKPOINTS: import.meta.env.VITE_API_CHECKPOINTS_URL,
  CHECKPOINT_BY_ID: (checkpointId: string) =>
    `${import.meta.env.VITE_API_CHECKPOINTS_URL}/${checkpointId}`,
  PLATFORMS: (import.meta.env.VITE_API_PLATFORMS_URL as string | undefined) || '/platforms',
  PLATFORM_BY_ID: (platformId: string) =>
    `${(import.meta.env.VITE_API_PLATFORMS_URL as string | undefined) || '/platforms'}/${platformId}`,
  MODERATION_COMPLAINTS:
    (import.meta.env.VITE_API_COMPLAINTS_URL as string | undefined) || '/moderation/complaints',
  MODERATION_COMPLAINT_BY_ID: (id: string) =>
    `${(import.meta.env.VITE_API_COMPLAINTS_URL as string | undefined) || '/moderation/complaints'}/${id}`,
  FILES_UPLOAD: (import.meta.env.VITE_API_FILES_URL as string | undefined) || '/files/upload'
}
