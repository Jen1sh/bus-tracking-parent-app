export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'DRIVER' | 'PARENT';

export type AccountStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
  schoolId: number | null;
  status: AccountStatus;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserSummary;
}
