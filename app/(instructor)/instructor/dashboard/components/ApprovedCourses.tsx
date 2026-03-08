"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetCourseByInstructor, usePublishCourse, usePublishCourses } from "@/hooks/useCourse";
import { CourseStatus, CourseLevel } from "@/lib/api/services/fetchCourse";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Globe, CheckCircle2 } from "lucide-react";

export function ApprovedCourses() {
    const { courses, isLoading } = useGetCourseByInstructor({
        status: CourseStatus.Approved,
        level: CourseLevel.All,
        pageSize: 50, // fetching a good number of approved courses
    });

    const { publishCourse, isPending: isPublishingSingle } = usePublishCourse();
    const { publishCourses, isPending: isPublishingBulk } = usePublishCourses();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleToggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(courses.map((c) => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handlePublishSingle = async (id: string) => {
        try {
            await publishCourse({ id });
            setSelectedIds((prev) => prev.filter((item) => item !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handlePublishBulk = async () => {
        if (selectedIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất một khóa học để công khai");
            return;
        }
        try {
            await publishCourses({ ids: selectedIds });
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
        }
    };

    const isPending = isPublishingSingle || isPublishingBulk;

    return (
        <Card className="flex flex-col border-2 shadow-sm h-full max-h-[400px]">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                        Khóa học đã được duyệt
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Danh sách các khóa học đã được admin phê duyệt và sẵn sàng công khai
                    </CardDescription>
                </div>
                <Button
                    variant="default"
                    size="sm"
                    disabled={selectedIds.length === 0 || isPending}
                    onClick={handlePublishBulk}
                    className="shrink-0"
                >
                    <Globe className="mr-2 h-4 w-4" />
                    Công khai đã chọn ({selectedIds.length})
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pb-3">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
                        <CheckCircle2 className="h-8 w-8 mb-2 text-muted-foreground/50" />
                        <p className="text-sm">Hiện không có khóa học nào đang chờ công khai.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 pb-2 border-b">
                            <Checkbox
                                id="select-all"
                                checked={selectedIds.length === courses.length && courses.length > 0}
                                onCheckedChange={handleSelectAll}
                            />
                            <label
                                htmlFor="select-all"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Chọn tất cả ({courses.length})
                            </label>
                        </div>
                        <div className="space-y-3">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <Checkbox
                                            id={`course-${course.id}`}
                                            checked={selectedIds.includes(course.id)}
                                            onCheckedChange={() => handleToggleSelect(course.id)}
                                        />
                                        <div className="flex flex-col overflow-hidden">
                                            <label
                                                htmlFor={`course-${course.id}`}
                                                className="text-sm font-medium leading-none truncate cursor-pointer"
                                                title={course.title}
                                            >
                                                {course.title}
                                            </label>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                Giá: {course.price > 0 ? `${course.price.toLocaleString()} VNĐ` : "Miễn phí"}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePublishSingle(course.id)}
                                        disabled={isPending}
                                        className="shrink-0 ml-2"
                                    >
                                        Công khai
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
