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
  message?: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface GoogleOAuthRequest {
  idToken: string;
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
   amount: string | number; // Backend returns as string, but can be number for compatibility
  category: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  status?: 'completed' | 'processing';
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
  totalIncome: string;
  totalExpenses: string;
  netBalance: string;
  transactionCount: number;
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
  categoryId?: string;
  categoryName?: string;
  totalAmount: string; // Backend returns as string
  transactionCount: number;
  averageAmount?: string;
}

// Dashboard types
export interface DashboardData {
  totalIncome: string;
  totalExpenses: string;
  balance: string;
  recentTransactions: Transaction[];
  categoryBreakdown: CategoryStats[];
  topCategories?: { name: string; amount: number }[];

  // NEW FIELDS for trends
  balanceTrend?: number[];
  balanceChangePercentage?: number;
  incomeTrend?: number[];
  incomeChangePercentage?: number;
  expenseTrend?: number[];
  expenseChangePercentage?: number;
  savingsTrend?: number[];
  savingsChangePercentage?: number;

   challenge?: {
    title: string;
    description: string;
    target: number;
    current: number;
  };
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
  error?: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  errors?: Record<string, string[]>;
}

// Card types
export interface Card {
  id: string | number;
  type: string;
  holder: string;
  number: string;
  balance: string | number;
  expiry: string;
  status?: "Active" | "Inactive";
  bank: string;
  gradient?: string;
  border?: string;
  masked?: string;
  default?: boolean;
  
}

export interface CardPayload {
  type: string;
  holder: string;
  number: string;
  balance: number;
  expiry: string;
  bank: string;
  status?: string;
}

export interface UpdateCardPayload {
  type?: string;
  holder?: string;
  number?: string;
  balance?: number;
  expiry?: string;
  bank?: string;
  status?: "Active" | "Inactive";
}