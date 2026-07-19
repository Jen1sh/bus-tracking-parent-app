import { StorageKeys } from '@/constants/storage-keys';
import { SecureStore } from '@/lib/secure-store';
import { setOnForceLogout } from '@/lib/axios';
import { authService } from '@/services/auth-service';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useGlobalStore } from '../store';
import type { UserSummary } from '@/interfaces/api';

interface AuthContextType {
  token: string | null | undefined;
  refreshToken: string | null | undefined;
  user: UserSummary | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  refreshToken: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => Promise.resolve(),
  logOut: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const { resetStore } = useGlobalStore();
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | null | undefined>(undefined);
  const [user, setUser] = useState<UserSummary | null | undefined>(undefined);

  useEffect(() => {
    const storedToken = SecureStore.getItem(StorageKeys.TOKEN);
    const storedRefreshToken = SecureStore.getItem(StorageKeys.REFRESH_TOKEN);
    const storedUser = SecureStore.getItem(StorageKeys.USER);

    setToken(storedToken ?? null);
    setRefreshToken(storedRefreshToken ?? null);
    setUser(storedUser ? (JSON.parse(storedUser) as UserSummary) : null);
  }, []);

  useEffect(() => {
    setOnForceLogout(() => {
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    });

    return () => setOnForceLogout(() => {});
  }, []);

  const storeAuth = (tokenVal: string, refreshTokenVal: string, userVal: UserSummary) => {
    setToken(tokenVal);
    setRefreshToken(refreshTokenVal);
    setUser(userVal);
    SecureStore.setItem(StorageKeys.TOKEN, tokenVal);
    SecureStore.setItem(StorageKeys.REFRESH_TOKEN, refreshTokenVal);
    SecureStore.setItem(StorageKeys.USER, JSON.stringify(userVal));
  };

  const clearAuth = async () => {
    resetStore();
    queryClient.clear();
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(StorageKeys.TOKEN);
    await SecureStore.deleteItemAsync(StorageKeys.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(StorageKeys.USER);
  };

  const login = async (email: string, password: string) => {
    const { data } = await authService.login({ email, password });

    if (!data.success || !data.data) {
      throw new Error(data.message ?? data.error ?? 'Login failed');
    }

    storeAuth(data.data.accessToken, data.data.refreshToken, data.data.user);
  };

  const logOut = async () => {
    try {
      await authService.logout();
    } finally {
      await clearAuth();
    }
  };

  const isAuthenticated = !!token;
  const isLoading = token === undefined;

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        isLoading,
        isAuthenticated,
        login,
        logOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
