'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/stores/auth.store';

interface LoginFormProps {
  onSuccess: (data: any) => void;
  setError: (error: string | null) => void;
}

export function LoginForm({ onSuccess, setError }: LoginFormProps) {
  const { isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError(null);

    try {
      const response = await authApi.login({ email, password });
      onSuccess(response);
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else {
        setError(errorData?.message || 'Login failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
            errors.email ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="you@example.com"
          required
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </motion.div>

      {/* Password Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
            errors.password ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="••••••••"
          required
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Logging in...
          </>
        ) : (
          'Sign In'
        )}
      </motion.button>
    </form>
  );
}
