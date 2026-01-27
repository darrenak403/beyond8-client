'use client';

import { usePathname } from 'next/navigation';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StaffHeaderProps {
    onToggleSidebar: () => void;
}

const pageTitles: Record<string, string> = {
    '/staff/dashboard': 'Dashboard',
    '/staff/course': 'Khóa học',
    '/staff/instructor-registration': 'Duyệt giảng viên',
    '/staff/report': 'Báo cáo',
    '/staff/staff-profile': 'Hồ sơ',
};

export function StaffHeader({ onToggleSidebar }: StaffHeaderProps) {
    const pathname = usePathname();
    const title = pageTitles[pathname] || 'Staff Dashboard';

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
