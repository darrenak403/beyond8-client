'use client';

import { usePathname } from 'next/navigation';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/user': 'Quản lý người dùng',
  '/admin/course': 'Khóa học',
  '/admin/report': 'Báo cáo',
  '/admin/admin-profile': 'Hồ sơ',
};

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Admin Dashboard';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-1">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8 hover:bg-gray-100 hover:text-black-100"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
    </header>
  );
}
