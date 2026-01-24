"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Play,
  CheckCircle2,
} from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

const mockCourses = [
  {
    id: 1,
    title: "React & Next.js - Complete Guide",
    thumbnail: "/bg-web.jpg",
    progress: 65,
    status: "in-progress",
    instructor: "Nguyễn Văn A",
    totalLessons: 45,
    completedLessons: 29,
    duration: "12 giờ",
    rating: 4.8,
    students: 1234,
  },
  {
    id: 2,
    title: "Node.js Backend Development",
    thumbnail: "/bg-web.jpg",
    progress: 100,
    status: "completed",
    instructor: "Trần Thị B",
    totalLessons: 38,
    completedLessons: 38,
    duration: "10 giờ",
    rating: 4.9,
    students: 987,
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    thumbnail: "/bg-web.jpg",
    progress: 30,
    status: "in-progress",
    instructor: "Lê Văn C",
    totalLessons: 52,
    completedLessons: 16,
    duration: "15 giờ",
    rating: 4.7,
    students: 2341,
  },
];

export default function MyCoursePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "in-progress" && course.status === "in-progress") ||
      (activeTab === "completed" && course.status === "completed");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`font-bold mb-2 ${isMobile ? "text-xl" : "text-2xl"}`}>
          Khóa học của tôi
        </h2>
        <p className="text-gray-600">
          Quản lý và theo dõi tiến độ học tập của bạn
        </p>
      </div>

      {/* Search & Filter */}
      <div className={`flex gap-3 ${isMobile ? "flex-col" : "flex-row"}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Bộ lọc
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">
            Tất cả ({mockCourses.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Đang học ({mockCourses.filter((c) => c.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã hoàn thành ({mockCourses.filter((c) => c.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Course Grid */}
          <div
            className={`grid gap-6 ${
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className={`rounded-lg object-cover ${
                        isMobile ? "w-24 h-24" : "w-32 h-32"
                      }`}
                    />
                    {course.status === "completed" && (
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {course.title}
                      </h3>
                      <Badge
                        variant={
                          course.status === "completed" ? "default" : "secondary"
                        }
                        className="whitespace-nowrap"
                      >
                        {course.status === "completed"
                          ? "Hoàn thành"
                          : "Đang học"}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      Giảng viên: {course.instructor}
                    </p>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {course.completedLessons}/{course.totalLessons} bài học
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {course.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students.toLocaleString()}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full gap-2" size="sm">
                      <Play className="w-4 h-4" />
                      {course.status === "completed"
                        ? "Học lại"
                        : "Tiếp tục học"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không tìm thấy khóa học
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Thử tìm kiếm với từ khóa khác"
                  : "Bạn chưa đăng ký khóa học nào"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
