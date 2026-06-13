'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/stores/auth.store';

interface RegisterFormProps {
  onSuccess: (data: any) => void;
  setError: (error: string | null) => void;
}

export function RegisterForm({ onSuccess, setError }: RegisterFormProps) {
  const { isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError(null);

    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await authApi.register(formData);
      onSuccess(response);
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else {
        setError(errorData?.message || 'Registration failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
            errors.email ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </motion.div>

      {/* Username */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
            errors.username ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="john_doe"
        />
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
      </motion.div>

      {/* First Name & Last Name */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="John"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="Doe"
          />
        </motion.div>
      </div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
            errors.password ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="••••••••"
        />
        <p className="text-gray-400 text-xs mt-1">Min 8 chars, uppercase, lowercase, number & special char</p>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </motion.div>

      {/* Confirm Password */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
            errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="••••••••"
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </motion.button>
    </form>
  );
}
