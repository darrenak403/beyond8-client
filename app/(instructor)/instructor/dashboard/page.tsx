"use client";

import { StatsCards } from "./components/StatsCards";
import { ChartBarHorizontal } from "./components/ChartBarHorizontal";
import { ChartRadialSimple } from "./components/ChartRadialSimple";
import { ChartLineInteractive } from "./components/ChartLineInteractive";
import { useIsMobile } from "@/hooks/useMobile";

export default function InstructorDashboard() {
  const isMobile = useIsMobile();

  // Mock data - replace with actual API calls
  const stats = {
    totalStudents: 1250,
    totalCoursesSold: 45,
    mostPopularCourse: "React Advanced",
    totalRevenue: 125000000,
  };

  return (
    <div className="space-y-6 sm:space-y-8 mx-auto max-w-[1650px] flex flex-col gap-3">
      <div className="flex flex-col gap-2 m-0">
        <h1 className="text-2xl font-bold">Chào mừng đến với trang quản lý của bạn</h1>
        <p className="text-muted-foreground">Dưới đây là tổng quan về các khóa học của bạn</p>
      </div>
      {/* Stats Cards */}
      <StatsCards
        totalStudents={stats.totalStudents}
        totalCoursesSold={stats.totalCoursesSold}
        mostPopularCourse={stats.mostPopularCourse}
        totalRevenue={stats.totalRevenue}
      />

      {/* Charts Grid - All in one row on desktop */}
      <div className={`grid gap-4 m-0 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
        <ChartRadialSimple />
        <ChartBarHorizontal />
      </div>

      {/* Bottom Chart */}
      <div className="w-full">
        <ChartLineInteractive />

      </div>
    </div>
  );
}
