import apiService from "../core";
import { ApiResponse } from "@/types/api";

export interface InstructorStats {
  totalCourses: number;
  draftCourses: number;
  pendingApprovalCourses: number;
  publishedCourses: number;
  rejectedCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  coursesThisMonth: number;
  studentsThisMonth: number;
  revenueThisMonth: number;
}

export const dashboardService = {
  getInstructorStats: async (): Promise<ApiResponse<InstructorStats>> => {
    const response = await apiService.get<ApiResponse<InstructorStats>>("/api/v1/courses/instructor/stats");
    return response.data;
  },
};
