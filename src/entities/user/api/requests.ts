import type { AuthStatusResponse, GetUsersResponse, OAuthExchangeParams } from './types'
import type {
  StudentScore,
  StudentScoreDto,
  User,
  UserBase,
  UserDto,
  UserRole
} from '../model/types'
import { mapStudentScoreDto, mapUserBaseDto, mapUserDto } from '../lib/mappers'
import { api, ENDPOINTS } from '@/shared'

export async function login(params: OAuthExchangeParams): Promise<void> {
  await api.post(ENDPOINTS.LOGIN, params)
}

export async function logout(): Promise<void> {
  await api.post(ENDPOINTS.LOGOUT)
}

export async function getAuthStatus(): Promise<AuthStatusResponse> {
  const { data } = await api.get<AuthStatusResponse>(ENDPOINTS.STATUS)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<UserDto>(ENDPOINTS.ME)
  return mapUserDto(data)
}

export async function getUserById(userId: string): Promise<User> {
  const { data } = await api.get<UserDto>(ENDPOINTS.USER_BY_ID(userId))
  return mapUserDto(data)
}

export async function getUsersByName(
  query: string,
  offset: number,
  limit: number
): Promise<{ users: UserBase[]; total: number }> {
  const params = { offset, limit, query }
  const { data } = await api.get<GetUsersResponse>(ENDPOINTS.USERS_BY_NAME, { params })
  return { users: data.users.map(mapUserBaseDto), total: data.total }
}

export async function putUserRole<T extends UserRole['type']>(
  userId: string,
  type: T,
  payload: Omit<Extract<UserRole, { type: T }>, 'type' | 'weight'>
): Promise<void> {
  await api.put(ENDPOINTS.USER_ROLES(userId, type), payload)
}

export async function deleteUserRole(userId: string, type: UserRole['type']): Promise<void> {
  await api.delete(ENDPOINTS.USER_ROLES(userId, type))
}

export async function getUserScores(userId: string): Promise<StudentScore> {
  const { data } = await api.get<StudentScoreDto>(ENDPOINTS.USER_SCORES(userId))
  return mapStudentScoreDto(data)
}
