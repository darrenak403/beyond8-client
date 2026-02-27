'use client'

import { usePathname } from "next/navigation";
import { InstructorHeader } from "@/components/ui/instructor-header";
import { InstructorBottomNav } from "@/components/ui/instructor-bottom-nav";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActionPage = pathname === '/instructor/courses/create' || pathname?.startsWith('/instructor/courses/action');

  if (isActionPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen pb-16 lg:pb-0">
      <InstructorHeader />
      <main className="flex-1 w-full px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 mx-auto space-y-4 sm:space-y-6 md:space-y-8">{children}</main>
      <InstructorBottomNav />
    </div>
  )
}
