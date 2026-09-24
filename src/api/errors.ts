import axios from 'axios';
import type { ErrorPayload } from '@/types';

const CODE_MESSAGES: Record<string, string> = {
  ADMIN_SUICIDE: 'Нельзя снять с себя роль администратора',
  AUTO_MANAGED: 'Эта роль управляется автоматически',
  UNKNOWN_ROLE: 'Неизвестная роль',
  INSUFFICIENT_PERMISSIONS: 'Недостаточно прав',
  CHECKPOINT_OVERLAP: 'Диапазоны дат чекпоинтов не должны пересекаться',
  SESSION_NOT_FOUND: 'Сессия не найдена или истекла',
  INVALID_COOKIE: 'Сессия недействительна',
  AUTHORIZATION_FAILED: 'Требуется авторизация',
};

export function getApiError(err: unknown): ErrorPayload | null {
  if (!axios.isAxiosError(err)) return null;
  const data = err.response?.data;
  if (
    data &&
    typeof data === 'object' &&
    'code' in data &&
    'msg' in data &&
    typeof (data as ErrorPayload).code === 'string' &&
    typeof (data as ErrorPayload).msg === 'string'
  ) {
    return data as ErrorPayload;
  }
  return null;
}

export function getErrorMessage(
  err: unknown,
  fallback = 'Что-то пошло не так',
): string {
  const api = getApiError(err);
  if (api) {
    return CODE_MESSAGES[api.code] || api.msg || fallback;
  }
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 403) return 'Недостаточно прав';
    if (err.response?.status === 404) return 'Не найдено';
    if (err.message === 'Network Error') return 'Нет связи с сервером';
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function isSessionError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;
  const status = err.response?.status;
  if (status === 401) return true;
  const api = getApiError(err);
  if (!api) return status === 403;
  return (
    status === 403 &&
    ['INVALID_COOKIE', 'SESSION_NOT_FOUND', 'AUTHORIZATION_FAILED'].includes(
      api.code,
    )
  );
}
