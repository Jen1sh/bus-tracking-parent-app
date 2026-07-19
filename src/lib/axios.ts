import { StorageKeys } from '@/constants/storage-keys';
import { Urls } from '@/constants/urls';
import type { ApiResponse, AuthResponse } from '@/interfaces/api';
import { SecureStore } from '@/lib/secure-store';
import axios, { isAxiosError } from 'axios';

export { isAxiosError };

const client = axios.create({
  baseURL: 'http://10.0.2.2:8080/api/',
});

type QueueEntry = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(entry => {
    if (error) {
      entry.reject(error);
    } else {
      entry.resolve(token);
    }
  });
  failedQueue = [];
};

let onForceLogout: (() => void) | null = null;

export const setOnForceLogout = (cb: () => void) => {
  onForceLogout = cb;
};

client.interceptors.request.use(
  async config => {
    if (config.url === Urls.refresh) {
      return config;
    }

    const token = SecureStore.getItem(StorageKeys.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

client.interceptors.response.use(
  response => response,
  async error => {
    if (!isAxiosError(error) || !error.config || !error.response) {
      return Promise.reject(error);
    }

    const { config, response } = error;

    if (response.status !== 401) {
      return Promise.reject(error);
    }

    if (config.url === Urls.login || config.url === Urls.refresh) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: unknown) => {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(client(config));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    const storedRefreshToken = SecureStore.getItem(StorageKeys.REFRESH_TOKEN);

    if (!storedRefreshToken) {
      isRefreshing = false;
      SecureStore.deleteItemAsync(StorageKeys.TOKEN);
      onForceLogout?.();
      return Promise.reject(error);
    }

    try {
      const { data } = await client.post<ApiResponse<AuthResponse>>(Urls.refresh, {
        refreshToken: storedRefreshToken,
      });

      if (data.success && data.data) {
        SecureStore.setItem(StorageKeys.TOKEN, data.data.accessToken);
        SecureStore.setItem(StorageKeys.REFRESH_TOKEN, data.data.refreshToken);

        config.headers.Authorization = `Bearer ${data.data.accessToken}`;

        processQueue(null, data.data.accessToken);

        return client(config);
      }

      isRefreshing = false;
      return Promise.reject(error);
    } catch (refreshError) {
      processQueue(refreshError, null);
      SecureStore.deleteItemAsync(StorageKeys.TOKEN);
      SecureStore.deleteItemAsync(StorageKeys.REFRESH_TOKEN);
      onForceLogout?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default client;
