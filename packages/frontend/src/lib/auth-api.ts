import { apiClient } from './api-client';

export const authApi = {
  register: async (data: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  refresh: async (data: { refreshToken: string }) => {
    const response = await apiClient.post('/auth/refresh', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },
};
