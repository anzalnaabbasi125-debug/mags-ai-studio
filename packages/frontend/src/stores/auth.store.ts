import { create } from 'zustand';
import { authApi } from '@/lib/auth-api';
import { tokenManager } from '@/lib/token-manager';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  roles: string[];
  permissions: string[];
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  setError: (error: string | null) => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false,
  error: null,

  setAuth: (accessToken, refreshToken, user) => {
    set({ accessToken, refreshToken, user, error: null });
    tokenManager.setTokens(accessToken, refreshToken);
  },

  clearAuth: () => {
    set({ accessToken: null, refreshToken: null, user: null, error: null });
    tokenManager.clearTokens();
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ email, password });
      get().setAuth(response.accessToken, response.refreshToken, response.user);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, username, password, confirmPassword, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register({
        email,
        username,
        password,
        confirmPassword,
        firstName,
        lastName,
      });
      get().setAuth(response.accessToken, response.refreshToken, response.user);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
      get().clearAuth();
    } catch (error) {
      console.error('Logout error:', error);
      get().clearAuth();
    } finally {
      set({ isLoading: false });
    }
  },

  refreshTokens: async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      get().clearAuth();
      return;
    }

    try {
      const response = await authApi.refresh({ refreshToken });
      get().setAuth(response.accessToken, response.refreshToken, response.user);
    } catch (error) {
      console.error('Token refresh failed:', error);
      get().clearAuth();
    }
  },

  getCurrentUser: async () => {
    const accessToken = tokenManager.getAccessToken();
    if (!accessToken) {
      get().clearAuth();
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser();
      set({ user });
    } catch (error) {
      console.error('Failed to get current user:', error);
      get().clearAuth();
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error) => {
    set({ error });
  },

  hasRole: (role) => {
    const { user } = get();
    return user?.roles.includes(role) || false;
  },

  hasPermission: (permission) => {
    const { user } = get();
    return user?.permissions.includes(permission) || false;
  },

  isAuthenticated: () => {
    return !!get().accessToken && !!get().user;
  },
}));
