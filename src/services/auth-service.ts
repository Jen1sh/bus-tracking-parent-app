import type { ApiResponse, AuthResponse, LoginRequest, RefreshRequest } from '@/interfaces/api';
import client from '@/lib/axios';
import { Urls } from '@/constants/urls';

export const authService = {
  login: (data: LoginRequest) =>
    client.post<ApiResponse<AuthResponse>>(Urls.login, data),

  refresh: (data: RefreshRequest) =>
    client.post<ApiResponse<AuthResponse>>(Urls.refresh, data),

  logout: () => client.post(Urls.logout),
};
