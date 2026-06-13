'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth.store';
import { LoginForm } from '@/components/auth/LoginForm';
import { ErrorAlert } from '@/components/common/ErrorAlert';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isLoading, error } = useAuthStore();
  const [formError, setFormError] = useState<string | null>(null);

  const handleLoginSuccess = (data: any) => {
    setAuth(data.accessToken, data.refreshToken, data.user);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl font-bold text-white mb-3"
          >
            MAGS AI Studio
          </motion.h1>
          <p className="text-gray-400 text-sm">
            AI-Powered Development Platform
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl"
        >
          {/* Error Alert */}
          {(formError || error) && (
            <ErrorAlert message={formError || error} onClose={() => setFormError(null)} />
          )}

          {/* Login Form */}
          <LoginForm onSuccess={handleLoginSuccess} setError={setFormError} />

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-gray-500">Or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-400 font-semibold transition"
            >
              Create one
            </Link>
          </p>

          {/* Forgot Password Link */}
          <p className="text-center text-gray-400 text-sm mt-4">
            <Link
              href="/forgot-password"
              className="text-gray-500 hover:text-gray-400 transition"
            >
              Forgot password?
            </Link>
          </p>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-xs text-gray-500 space-y-1"
        >
          <p>By logging in, you agree to our Terms of Service</p>
          <p>Built with Next.js, NestJS, and PostgreSQL</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
