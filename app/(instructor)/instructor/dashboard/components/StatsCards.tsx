"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Star, DollarSign } from "lucide-react";
import { useInstructorAnalytics } from "@/hooks/useAnalystic";
import { formatCurrency } from "@/lib/utils/formatCurrency";
export function StatsCards() {
  const { data: stats, isLoading } = useInstructorAnalytics();

  if (isLoading || !stats) return null;

  const totalStudents = stats.students.total ?? 0;
  const publishedCourses = stats.courses.published ?? 0;
  const avgCourseRating = stats.rating.average ?? 0;
  const totalReviews = stats.rating.totalReviews ?? 0;
  const availableBalance = stats.revenue.availableBalance ?? 0;

  const statItems = [
    {
      title: "Tổng số học sinh",
      value: totalStudents.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      subValue: `${Math.abs(stats.students.growthAbsolute)} so với tháng trước`,
      isPositive: stats.students.growthAbsolute >= 0,
      showTrend: true,
    },
    {
      title: "Khóa học đã xuất bản",
      value: publishedCourses.toLocaleString(),
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subValue: `${Math.abs(stats.courses.publishedGrowthAbsolute)} so với tháng trước`,
      isPositive: stats.courses.publishedGrowthAbsolute >= 0,
      showTrend: true,
    },
    {
      title: "Đánh giá trung bình",
      value: `${avgCourseRating.toFixed(1)}/5`,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      subValue: `${totalReviews} đánh giá tất cả`,
      isPositive: true,
      showTrend: false,
    },
    {
      title: "Tổng số tiền nhận được",
      value: formatCurrency(availableBalance),
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      subValue: `${formatCurrency(Math.abs(stats.revenue.growthAbsolute))} so với tháng trước`,
      isPositive: stats.revenue.growthAbsolute >= 0,
      showTrend: true,
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
                {stat.showTrend && (
                  <span
                    className={`font-medium flex items-center gap-0.5 ${
                      stat.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.isPositive ? "↑" : "↓"}
                  </span>
                )}
                <span
                  className={
                    stat.showTrend
                      ? stat.isPositive
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {stat.subValue}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
