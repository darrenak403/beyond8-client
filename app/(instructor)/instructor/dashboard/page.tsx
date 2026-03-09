"use client";

import { StatsCards } from "./components/StatsCards";
import { ChartRadialSimple } from "./components/ChartRadialSimple";
import { ApprovedCourses } from "./components/ApprovedCourses";
import { useIsMobile } from "@/hooks/useMobile";
import { useInstructorAnalytics } from "@/hooks/useAnalystic";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstructorDashboard() {
  const isMobile = useIsMobile();
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useInstructorAnalytics();

  if (analyticsLoading ) {
    return (
      <div className="space-y-6 sm:space-y-8 mx-auto max-w-[1650px] flex flex-col gap-3">
        <div className="flex flex-col gap-2 m-0">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-0">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="space-y-6 sm:space-y-8 mx-auto max-w-[1650px] flex flex-col gap-3">
        <div className="text-red-500">Failed to load dashboard data.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 mx-auto max-w-[1650px] flex flex-col gap-3 min-h-[calc(100vh-140px)]">
      <div className="flex flex-col gap-2 m-0">
        <h1 className="text-2xl font-bold">Chào mừng bạn quay trở lại</h1>
        <p className="text-muted-foreground">Dưới đây là tổng quan về các khóa học của bạn</p>
      </div>
      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Grid - All in one row on desktop */}
      <div className={`grid gap-4 m-0 flex-1 ${isMobile ? "grid-cols-1" : "lg:grid-cols-2"}`}>
        <ChartRadialSimple stats={analytics} />
        <ApprovedCourses />
      </div>

      {/* Bottom Chart */}
      {/* <div className="w-full">
        <ChartLineInteractive />
      </div> */}
    </div>
  );
}
