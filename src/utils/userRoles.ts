import type { PlatformRoleName, StudentUseCase, User, UserCard } from '@/types';
import { STAFF_ROLES } from '@/types';

export function getDisplayName(
  user: Pick<User, 'meta'> | Pick<UserCard, 'meta'>,
): string {
  const { firstName, lastName } = user.meta;
  const patronym = 'patronym' in user.meta ? user.meta.patronym : undefined;
  return [lastName, firstName, patronym].filter(Boolean).join(' ');
}

export function listRoleNames(user: User | UserCard): string[] {
  if ('roles' in user && Array.isArray(user.roles)) {
    return user.roles ?? [];
  }
  if ('roles' in user && user.roles && !Array.isArray(user.roles)) {
    return Object.keys(user.roles);
  }
  return [];
}

export function getStudentInfo(user: User): StudentUseCase | null {
  const student = user.roles?.Student;
  if (!student || typeof student !== 'object') return null;
  if (!('course' in student) || !('school' in student)) return null;
  return student as StudentUseCase;
}

export function hasCapability(user: User, capability: string): boolean {
  return Boolean(user.capabilities?.includes(capability));
}

export function isStaff(user: User): boolean {
  const roles = listRoleNames(user);
  return STAFF_ROLES.some((role) => roles.includes(role));
}

export function hasRole(user: User | UserCard, role: PlatformRoleName): boolean {
  return listRoleNames(user).includes(role);
}

export const ROLE_LABELS: Record<string, string> = {
  Admin: 'Админ',
  Moderator: 'Модератор',
  Curator: 'Куратор',
  Mentor: 'Ментор',
  Teacher: 'Преподаватель',
  Roop: 'РООП',
  Student: 'Студент',
  Default: 'Пользователь',
};
