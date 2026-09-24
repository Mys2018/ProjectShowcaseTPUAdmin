const SETTINGS_BASE = '/settings'

export const ROUTES = {
  MAIN: '/',
  LOGIN: '/login',
  PROJECTS: '/projects',
  PROJECT: '/projects/:id',
  USERS: '/users',
  ROLES: '/roles',
  REPORTS: '/reports',
  SETTINGS: {
    BASE: SETTINGS_BASE,
    TAGS: `${SETTINGS_BASE}/tags`,
    PARTNERS: `${SETTINGS_BASE}/partners`,
    CHECKPOINTS: `${SETTINGS_BASE}/checkpoints`,
    PLATFORMS: `${SETTINGS_BASE}/platforms`,
    COMPLAINTS: `${SETTINGS_BASE}/complaints`
  },
  USER: '/user/:id'
} as const

export const projectPath = (id: string) => `/projects/${id}`
export const userPath = (id: string) => `/user/${id}`
