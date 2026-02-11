import apiService from "../core";

export interface CouponResponse {
	isSuccess: boolean;
	message: string;
	data: Coupon[];
	metadata: unknown;
}

export interface Coupon {
	id: string;
	code: string;
	description: string | null;
	type: string;
	value: number;
	minOrderAmount: number | null;
	maxDiscountAmount: number | null;
	usageLimit: number | null;
	usagePerUser: number | null;
	usedCount: number;
	applicableInstructorId: string | null;
	applicableCourseId: string | null;
	holdAmount: number;
	remainingHoldAmount: number;
	validFrom: string;
	validTo: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string | null;
}

export const fetchCoupon = {
	getActive: async (): Promise<CouponResponse> => {
		const response = await apiService.get<CouponResponse>("api/v1/coupons/active");
		return response.data;
	},
};
