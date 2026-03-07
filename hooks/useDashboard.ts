import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/api/services/fetchDashboard";

export function useInstructorStats() {
  return useQuery({
    queryKey: ["instructor-stats"],
    queryFn: async () => {
      const response = await dashboardService.getInstructorStats();
      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch instructor stats");
      }
      return response.data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
