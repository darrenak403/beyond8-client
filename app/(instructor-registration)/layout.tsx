'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InstructorRegistrationGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isStudent } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Only students can register as instructor
    if (!isStudent) {
      router.push('/');
    }
  }, [isAuthenticated, isStudent, router]);

  if (!isAuthenticated || !isStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
