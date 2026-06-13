'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function ProtectedLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      getCurrentUser().catch(() => {
        router.push('/login');
      });
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated()) {
    return null;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
}
