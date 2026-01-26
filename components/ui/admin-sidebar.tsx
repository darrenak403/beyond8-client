'use client';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/useMobile';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  MoreVertical,
  LogOut,
  User,
  FileCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLogout } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { cn } from '@/lib/utils';
import { formatImageUrl } from '@/lib/utils/formatImageUrl';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Quản lý người dùng', href: '/admin/user' },
  { icon: FileCheck, label: 'Duyệt giảng viên', href: '/admin/instructor-registration' },
  { icon: BookOpen, label: 'Khóa học', href: '/admin/course' },
  { icon: BarChart3, label: 'Báo cáo', href: '/admin/report' },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
}

export function AdminSidebar({ isCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const { userProfile } = useUserProfile();
  const { mutateLogout } = useLogout();
  const isMobile = useIsMobile();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const getAvatarFallback = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (userProfile?.email) return userProfile.email.charAt(0).toUpperCase();
    return 'A';
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 px-4 pb-safe">
        <nav className="flex items-center justify-between h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                  isActive ? 'text-purple-700' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col items-center justify-center p-2 cursor-pointer">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={formatImageUrl(userProfile?.avatarUrl)} alt={userProfile?.fullName} />
                  <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700">
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {userProfile?.fullName && (
                    <p className="font-medium">{userProfile.fullName}</p>
                  )}
                  {userProfile?.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {userProfile.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/admin-profile"
                  className="cursor-pointer flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Hồ sơ
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => mutateLogout()}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40',
        isCollapsed ? 'w-16' : 'w-56',
        'md:translate-x-0'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="px-3 py-1 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-end gap-2">
            <Image
              src="/icon-logo.png"
              alt="Beyond 8"
              width={20}
              height={20}
              className="h-8 w-8 flex-shrink-0"
            />
            <div className={cn(
              "transition-opacity duration-200",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
              <h2 className="font-bold text-base text-gray-900 whitespace-nowrap">Beyond8 Inc.</h2>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm',
                  isActive
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className={cn(
                  "whitespace-nowrap transition-opacity duration-200",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {isCollapsed ? (
              <TooltipProvider>
                <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                  <TooltipTrigger asChild>
                    <Avatar 
                      className="h-8 w-8 rounded-lg flex-shrink-0 cursor-pointer"
                      onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                    >
                      <AvatarImage src={formatImageUrl(userProfile?.avatarUrl)} alt={userProfile?.fullName} />
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold rounded-lg text-xs">
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="p-0 w-56">
                    <div className="flex flex-col">
                      {/* User Info */}
                      <div className="px-3 py-2 border-b">
                        <p className="font-medium text-sm">{userProfile?.fullName || 'Admin'}</p>
                        <p className="text-xs text-muted-foreground truncate">{userProfile?.email}</p>
                      </div>
                      {/* Action Buttons */}
                      <div className="p-1">
                        <Link
                          href="/admin/admin-profile"
                          className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-white cursor-pointer"
                          onClick={() => setIsTooltipOpen(false)}
                        >
                          <User className="h-3.5 w-3.5" />
                          Hồ sơ
                        </Link>
                        <button
                          onClick={() => {
                            setIsTooltipOpen(false)
                            mutateLogout()
                          }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-red-50 text-red-600 cursor-pointer"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
                <AvatarImage src={formatImageUrl(userProfile?.avatarUrl)} alt={userProfile?.fullName} />
                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold rounded-lg text-xs">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
            )}

            <div className={cn(
              "flex items-center gap-2 flex-1 min-w-0 transition-opacity duration-200",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {userProfile?.fullName || 'Admin'}
                </p>
                <p className="text-[10px] text-gray-500 truncate">{userProfile?.email}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer hover:bg-gray-100 hover:text-black-100"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/admin-profile"
                      className="cursor-pointer text-sm flex items-center"
                    >
                      <User className="h-3.5 w-3.5 mr-2" />
                      Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => mutateLogout()}
                    className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-100 focus:bg-red-50 text-sm"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
