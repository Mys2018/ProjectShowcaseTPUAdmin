import { ENDPOINTS } from '@/config/endpoints';
import { emitSessionExpired } from '@/api/sessionEvents';
import { getApiError } from '@/api/errors';
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

function shouldTryRefresh(error: AxiosError, originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }) {
  if (originalRequest._retry) return false;
  const status = error.response?.status;
  if (status === 401) return true;
  if (status !== 403) return false;
  const api = getApiError(error);
  if (!api) return false;
  return ['INVALID_COOKIE', 'SESSION_NOT_FOUND', 'AUTHORIZATION_FAILED'].includes(
    api.code,
  );
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest || !shouldTryRefresh(error, originalRequest)) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosInstance(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axiosInstance.post(ENDPOINTS.REFRESH, {});
      processQueue(null);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      emitSessionExpired();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
