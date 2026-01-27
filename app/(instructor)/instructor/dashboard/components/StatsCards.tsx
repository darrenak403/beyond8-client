"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, DollarSign, ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardsProps {
  totalStudents: number;
  totalCoursesSold: number;
  mostPopularCourse: string;
  totalRevenue: number;
}

export function StatsCards({
  totalStudents,
  totalCoursesSold,
  mostPopularCourse,
  totalRevenue,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Tổng số học sinh",
      value: totalStudents.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: 12.5,
      isPositive: true,
    },
    {
      title: "Khóa học đã bán",
      value: totalCoursesSold.toLocaleString(),
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: 8.2,
      isPositive: true,
    },
    {
      title: "Khóa học phổ biến nhất",
      value: mostPopularCourse,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: 5.1,
      isPositive: true,
    },
    {
      title: "Tổng doanh thu",
      value: `${totalRevenue.toLocaleString()} VNĐ`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: 15.3,
      isPositive: true,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-0">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.isPositive ? ArrowUp : ArrowDown;
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
              <div className={`flex items-center gap-1 text-xs mt-1 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <TrendIcon className="h-3 w-3" />
                <span className="font-medium">{stat.change}%</span>
                <span className="text-muted-foreground">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
