import { ApiResponse } from "@/types/api";
import apiService from "../core";
import { Subscription, SubscriptionPlan } from "./fetchProfile";

export const subscriptionService = {
  getMe: async (): Promise<ApiResponse<Subscription>> => {
    const response = await apiService.get<ApiResponse<Subscription>>("api/v1/subscriptions/me");
    return response.data;
  },

  getPlans: async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
    const response = await apiService.get<ApiResponse<SubscriptionPlan[]>>("api/v1/subscriptions/plans");
    return response.data;
  },
};
