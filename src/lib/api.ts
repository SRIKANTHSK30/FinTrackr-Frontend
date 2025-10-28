import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  User,
  UserProfile,
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionSummary,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryStats,
  DashboardData,
  PaginatedResponse,
} from '@/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle token refresh on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  auth = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await this.client.post('/auth/login', data);
      return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
      const response = await this.client.post('/auth/register', data);
      return response.data;
    },

    refresh: async (data: RefreshTokenRequest): Promise<{ accessToken: string; refreshToken: string }> => {
      const response = await this.client.post('/auth/refresh', data);
      return response.data;
    },

    logout: async (): Promise<void> => {
      await this.client.post('/auth/logout');
    },
  };

  // User endpoints
  user = {
    getProfile: async (): Promise<User> => {
      const response = await this.client.get('/users/profile');
      return response.data;
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<User> => {
      const response = await this.client.put('/users/profile', data);
      return response.data;
    },

    deleteAccount: async (): Promise<void> => {
      await this.client.delete('/users/account');
    },

    getDashboard: async (): Promise<DashboardData> => {
      const response = await this.client.get('/users/dashboard');
      return response.data;
    },
  };

  // Transaction endpoints
  transactions = {
    create: async (data: CreateTransactionRequest): Promise<Transaction> => {
      const response = await this.client.post('/transactions', data);
      return response.data;
    },

    getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Transaction>> => {
      const response = await this.client.get('/transactions', { params });
      return response.data;
    },

    getById: async (id: string): Promise<Transaction> => {
      const response = await this.client.get(`/transactions/${id}`);
      return response.data;
    },

    update: async (data: UpdateTransactionRequest): Promise<Transaction> => {
      const { id, ...updateData } = data;
      const response = await this.client.put(`/transactions/${id}`, updateData);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await this.client.delete(`/transactions/${id}`);
    },

    getSummary: async (): Promise<TransactionSummary> => {
      const response = await this.client.get('/transactions/summary');
      return response.data;
    },
  };

  // Category endpoints
  categories = {
    create: async (data: CreateCategoryRequest): Promise<Category> => {
      const response = await this.client.post('/categories', data);
      return response.data;
    },

    getAll: async (): Promise<Category[]> => {
      const response = await this.client.get('/categories');
      return response.data;
    },

    getById: async (id: string): Promise<Category> => {
      const response = await this.client.get(`/categories/${id}`);
      return response.data;
    },

    update: async (data: UpdateCategoryRequest): Promise<Category> => {
      const { id, ...updateData } = data;
      const response = await this.client.put(`/categories/${id}`, updateData);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await this.client.delete(`/categories/${id}`);
    },

    getStats: async (id: string): Promise<CategoryStats> => {
      const response = await this.client.get(`/categories/${id}/stats`);
      return response.data;
    },
  };
}

export const api = new ApiClient();

