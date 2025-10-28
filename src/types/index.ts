// User types
export interface User {
  id: string;
  email: string;
  name: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  email: string;
  name: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Transaction types
export const TransactionType = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  id: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: Transaction[];
}

// Category types
export const CategoryType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type CategoryType = typeof CategoryType[keyof typeof CategoryType];

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
  color: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
}

// Dashboard types
export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactions: Transaction[];
  categoryBreakdown: CategoryStats[];
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

