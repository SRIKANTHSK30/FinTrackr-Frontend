import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const response = await api.auth.register(registerData);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { error?: string; message?: string; details?: Array<{ field: string; message: string }> } } };
      
      // Handle validation errors
      if (axiosErr?.response?.status === 400) {
        const details = axiosErr.response.data?.details;
        if (details && details.length > 0) {
          // Format validation errors from details array
          const errorMessages = details
            .map((detail) => `${detail.field}: ${detail.message}`)
            .join('\n');
          setError(errorMessages || axiosErr.response.data?.error || axiosErr.response.data?.message || 'Validation failed. Please check your input.');
        } else {
          setError(axiosErr.response.data?.error || axiosErr.response.data?.message || 'Registration failed. Please check your input.');
        }
      } else if (axiosErr?.response?.status === 404) {
        setError('Backend endpoint not found. Please check your backend configuration.');
      } else if (axiosErr?.response?.status === 409) {
        setError(axiosErr.response.data?.error || axiosErr.response.data?.message || 'User already exists. Please login instead.');
      } else {
        const errorMessage = 
          axiosErr?.response?.data?.error ||
          axiosErr?.response?.data?.message ||
          (err instanceof Error ? err.message : 'Registration failed. Please try again.');
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Registration Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FinTrack</h1>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started Now</h2>
          <p className="text-gray-600 mb-8">Please fill the details and create account</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Social Sign Up Buttons */}
          <div className="mb-6 space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 border-2 gap-3"
              type="button"
              onClick={() => api.auth.googleOAuthRedirect()}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? 'Redirecting...' : 'Sign up with Google'}
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 border-2 gap-3"
              type="button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.95-3.03 0l-4.7-4.54a8.8 8.8 0 01-2.93-6.63c0-5.33 钰.3-9.7 9.64-9.7a9.68 9.68 0 016.99 2.9 9.76 9.76 0 012.87 6.95c0 2.6-1.07 4.86-2.93 6.63l-4.71 4.54zm2.96-16.95c-.85-.82-2.05-1.28-3.44-1.28-3.1 0-5.64 2.56-5.64 5.7 0 1.62.66 3.04 1.73 4.07l4.7 切口.54c.4.38.88.38 1.28 0l4.71-4.55c1.07-1.02 1.74-2.45 1.74-4.07 0-1.4-.47-2.6-1.28-3.41z"/>
              </svg>
              Sign up with Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="h-12"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-12"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="h-12 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="h-12"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms & Privacy */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms & Privacy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-8">
            2025 Fintrack, All Rights Reserved
          </p>
        </div>
      </div>

      {/* Right Panel - Promotional Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <h3 className="text-3xl font-bold mb-4">
            Track your expenses, plan your budget, and grow your savings — all in one dashboard.
          </h3>
          <p className="text-blue-100 text-lg mb-8">
            Plan. Track. Grow. Your financial journey starts here.
          </p>
          
          {/* Dashboard Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="bg-white rounded-lg p-4 text-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Dashboard</h4>
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Balance:</span>
                  <span className="font-semibold">$4,523.98</span>
                </div>
                <div className="flex justify-between">
                  <span>Payable Accounts:</span>
                  <span className="font-semibold">$3,689.00</span>
                </div>
                <div className="h-20 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400">📊 Chart</span>
                </div>
                <div className="flex justify-between">
                  <span>Savings:</span>
                  <span className="font-semibold text-green-600">$834.98</span>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Salary</span>
                    <span className="text-green-600">+$5000</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Coffee</span>
                    <span className="text-red-600">-$5.50</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Groceries</span>
                    <span className="text-red-600">-$89.32</span>
                  </div>
                </div>
                <div className="h-16 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Pie Chart</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-blue-100 mt-8 text-sm">
            Join thousands managing their money smarter with FinTrack.
          </p>
        </div>
      </div>
    </div>
  );
}
