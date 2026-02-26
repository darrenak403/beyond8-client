import { ApiResponse } from "@/types/api";
import apiService from "../core";
import { Subscription, SubscriptionPlan } from "./fetchProfile";

export interface PaymentData {
  paymentId: string;
  paymentNumber: string;
  purpose: string;
  paymentUrl: string;
  expiredAt: string;
}
export interface PaymentResponse{
  isSuccess: boolean;
  message: string;
  data: PaymentData;
}

export interface BuySubscriptionRequest {
  planCode: string;
}

export const subscriptionService = {
  getMe: async (): Promise<ApiResponse<Subscription>> => {
    const response = await apiService.get<ApiResponse<Subscription>>("api/v1/subscriptions/me");
    return response.data;
  },

  getPlans: async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
    const response = await apiService.get<ApiResponse<SubscriptionPlan[]>>("api/v1/subscriptions/plans");
    return response.data;
  },

  buySubscription: async (planCode: string): Promise<PaymentResponse> => {
    const response = await apiService.post<PaymentResponse>("api/v1/orders/buy-subscription", { planCode });
    return response.data;
  },
};
