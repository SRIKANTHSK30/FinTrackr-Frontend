// src/utils/api.ts
import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  GoogleOAuthRequest,
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
  UpdateCardPayload,
} from '@/types';

// --- Card types ---
export interface CardPayload {
  type: string;
  holder: string;
  number: string;
  expiry: string;
  balance: number;
  bank: string;
  gradient?: string;
  border?: string;
}

export interface Card extends CardPayload {
  id: string;
  status: string;
  created_at: string;
}

// --- API Base URL ---
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
            if (!refreshToken) throw new Error('No refresh token');

            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            useAuthStore.getState().logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // --- Auth endpoints ---
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

    googleOAuthRedirect: () => {
      window.location.href = `${API_BASE_URL}/auth/google`;
    },

    googleOAuth: async (data: GoogleOAuthRequest): Promise<AuthResponse> => {
      const response = await this.client.post('/auth/google', data);
      return response.data;
    },
  };

  // --- User endpoints ---
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

  // --- Transaction endpoints ---
  transactions = {
    create: async (data: CreateTransactionRequest): Promise<Transaction> => {
      const response = await this.client.post('/transactions', data);
      return (response.data as { transaction: Transaction }).transaction || response.data;
    },

    getAll: async (params?: { 
      page?: number; 
      limit?: number; 
      type?: string; 
      category?: string; 
      startDate?: string; 
      endDate?: string;
    }): Promise<{ transactions: Transaction[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> => {
      const response = await this.client.get('/transactions', { params });
      return response.data;
    },

    getById: async (id: string): Promise<Transaction> => {
      const response = await this.client.get(`/transactions/${id}`);
      return (response.data as { transaction: Transaction }).transaction || response.data;
    },

    update: async (data: UpdateTransactionRequest): Promise<Transaction> => {
      const { id, ...updateData } = data;
      const response = await this.client.put(`/transactions/${id}`, updateData);
      return (response.data as { transaction: Transaction }).transaction || response.data;
    },

    delete: async (id: string): Promise<void> => {
      await this.client.delete(`/transactions/${id}`);
    },

    getSummary: async (params?: { startDate?: string; endDate?: string }): Promise<TransactionSummary> => {
      const response = await this.client.get('/transactions/summary', { params });
      return response.data;
    },
  };

  // --- Category endpoints ---
  categories = {
    create: async (data: CreateCategoryRequest): Promise<Category> => {
      const response = await this.client.post('/categories', data);
      return response.data;
    },

    getAll: async (type?: string): Promise<{ categories: Category[] }> => {
      const params = type ? { type } : {};
      const response = await this.client.get('/categories', { params });
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

    getStats: async (id: string, params?: { startDate?: string; endDate?: string }): Promise<CategoryStats> => {
      const response = await this.client.get(`/categories/${id}/stats`, { params });
      return response.data;
    },
  };

  // --- Card endpoints ---
  cards = {
    getAll: async (): Promise<Card[]> => {
      const response = await this.client.get('/cards');
      return response.data;
    },

    getById: async (id: string): Promise<Card> => {
      const response = await this.client.get(`/cards/${id}`);
      return response.data;
    },

    create: async (data: CardPayload): Promise<Card> => {
      const response = await this.client.post('/cards', data);
      return response.data;
    },

    update: async (id: string, data: UpdateCardPayload): Promise<Card> => {
      const response = await this.client.put(`/cards/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await this.client.delete(`/cards/${id}`);
    },
  };
}

export const api = new ApiClient();
