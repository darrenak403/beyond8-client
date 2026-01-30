"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Star, DollarSign } from "lucide-react";
import { InstructorStats } from "@/lib/api/services/fetchDashboard";

interface StatsCardsProps {
  stats: InstructorStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      title: "Tổng số học sinh",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      subValue: `+${stats.studentsThisMonth} tháng này`,
      isPositive: true,
    },
    {
      title: "Khóa học đã xuất bản",
      value: stats.publishedCourses.toLocaleString(),
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subValue: `+${stats.coursesThisMonth} tháng này`,
      isPositive: true,
    },
    {
      title: "Đánh giá trung bình",
      value: `${stats.averageRating.toFixed(1)}/5`,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      subValue: `${stats.totalReviews} đánh giá`,
      isPositive: true,
    },
    {
      title: "Tổng doanh thu",
      value: `${stats.totalRevenue.toLocaleString()} VNĐ`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      subValue: `+${stats.revenueThisMonth.toLocaleString()} VNĐ tháng này`,
      isPositive: true,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-0">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs mt-1 text-muted-foreground">
                <span className="font-medium text-green-600">{stat.subValue}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
