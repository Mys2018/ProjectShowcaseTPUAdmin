import type { Skill } from './catalog';

export type PlatformRoleName =
  | 'Admin'
  | 'Moderator'
  | 'Curator'
  | 'Mentor'
  | 'Teacher'
  | 'Roop'
  | 'Student'
  | 'Default';

export const ASSIGNABLE_ROLES: PlatformRoleName[] = [
  'Admin',
  'Moderator',
  'Curator',
  'Mentor',
  'Teacher',
  'Roop',
];

export const STAFF_ROLES: PlatformRoleName[] = [
  'Admin',
  'Moderator',
  'Curator',
  'Mentor',
  'Teacher',
  'Roop',
];

export interface UserMessengers {
  telegram?: string;
  vk?: string;
  element?: string;
}

export interface UserRoleTypeSkills {
  roleTypeId: string;
  roleTypeName: string;
  skills?: Skill[];
}

export interface UserMeta {
  firstName: string;
  lastName: string;
  patronym?: string;
  bio: string;
  skills?: UserRoleTypeSkills[];
  messengers: UserMessengers;
  portfolioLink?: string;
  interests?: string;
}

export interface UserCardResponseMeta {
  firstName: string;
  lastName: string;
}

export interface StudentMeta {
  group: string;
}

export interface StudentUseCase {
  course: string;
  school: string;
  meta: StudentMeta;
}

export type EmptyUseCase = Record<string, never>;

export type RoleUseCase =
  | StudentUseCase
  | EmptyUseCase
  | Record<string, unknown>;

export type UserRolesMap = Partial<Record<PlatformRoleName, RoleUseCase>> &
  Record<string, RoleUseCase | undefined>;

export interface UserResponse {
  userId: number;
  email: string;
  profilePicture?: string;
  capabilities?: string[];
  roles: UserRolesMap;
  meta: UserMeta;
}

/** Alias used across the app */
export type User = UserResponse;

export interface UserCard {
  userId: number;
  email: string;
  profilePicture?: string;
  roles?: string[];
  meta: UserCardResponseMeta;
}

export interface FindUserCardResponse {
  users?: UserCard[];
  total: number;
  offset: number;
  limit: number;
}

export interface StudentScoreResponse {
  userId: number;
  totalScore: number;
}
