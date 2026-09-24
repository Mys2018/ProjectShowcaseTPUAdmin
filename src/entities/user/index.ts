export { queryKeys as userKeys } from './api/queryKeys'
export { login, logout, putUserRole, deleteUserRole, getUserScores } from './api/requests'
export {
  useAuthStatus,
  useMe,
  useUsersByName,
  useUserById,
  useUserScores
} from './api/queries'
export { type AuthStatusResponse, type OAuthExchangeParams } from './api/types'
export { useAuthStore } from './model/store/useAuthStore'
export {
  type User,
  type UserBase,
  type UserBaseDto,
  type UserRole,
  type UserMessengers,
  type UserCompetency,
  type StudentScore
} from './model/types'
export { mapUserBaseDto, mapUserDto, mapStudentScoreDto } from './lib/mappers'
export * from './ui/UserSlot'
export * from './ui/UserInfo'
export { getHighestRole } from './lib/getHighestRole'
export { ROLES_TRANSLATIONS, ROLE_WEIGHTS } from './config/constants'
