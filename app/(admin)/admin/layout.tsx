'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/ui/admin-sidebar';
import { AdminHeader } from '@/components/ui/admin-header';
import { useIsMobile } from '@/hooks/useMobile';

import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar isCollapsed={isSidebarCollapsed} />
      <div className={`transition-all duration-300 ${isMobile ? 'ml-0 pb-16' : isSidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
        {!isMobile && (
          <AdminHeader
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}
        <main className={isMobile ? "p-0" : "py-1 px-4"}>{children}</main>
      </div>

      {/* Mobile overlay when sidebar is open */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}
