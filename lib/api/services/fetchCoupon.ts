import apiService, { RequestParams } from "../core";

export interface CouponResponse {
	isSuccess: boolean;
	message: string;
	data: Coupon;
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

export enum CouponType {
	Percentage = 'Percentage',
	FixedAmount = 'FixedAmount',
}

export interface CreateCouponRequest {
	code: string;
	description: string | null;
	isActive: boolean;
	maxDiscountAmount: number | null;
	minOrderAmount: number | null;
	type: CouponType;
	usageLimit: number | null;
	usagePerUser: number | null;
	validFrom: string;
	validTo: string;
	value: number;
}

export interface CreateCouponInstructorRequest {
	instructorId: string;
	applicableCourseId: string;
	code: string;
	description: string | null;
	isActive: boolean;
	maxDiscountAmount: number | null;
	minOrderAmount: number | null;
	type: CouponType;
	usageLimit: number | null;
	usagePerUser: number | null;
	validFrom: string;
	validTo: string;
	value: number;
}

export interface UpdateCouponRequest {
	code: string;
	description: string | null;
	isActive: boolean;
	maxDiscountAmount: number | null;
	minOrderAmount: number | null;
	type: CouponType;
	usageLimit: number | null;
	usagePerUser: number | null;
	validFrom: string;
	validTo: string;
	value: number;
}

export interface CouponParams {
	pageNumber: number;
	pageSize: number;
	isDescending: boolean;
}

export interface GetAllCouponResponse {
	isSuccess: boolean;
	message: string;
	data: Coupon[];
	metadata: Metadata;
}

export interface Metadata {
	pageNumber: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

const convertParamsToQuery = (params: CouponParams): RequestParams => {
	if (!params) {
		return {};
	}
	const query: RequestParams = {}
	if (params.pageNumber) {
		query.pageNumber = params.pageNumber;
	}
	if (params.pageSize) {
		query.pageSize = params.pageSize;
	}
	if (params.isDescending) {
		query.isDescending = params.isDescending;
	}
	return query;
}

export const fetchCoupon = {
	getActive: async (): Promise<GetAllCouponResponse> => {
		const response = await apiService.get<GetAllCouponResponse>("api/v1/coupons/active");
		return response.data;
	},

	//Tạo coupon cho toàn bộ khóa học (Admin only)
	create: async (request: CreateCouponRequest): Promise<CouponResponse> => {
		const response = await apiService.post<CouponResponse>("api/v1/coupons/admin", request);
		return response.data;
	},

	//Cập nhật thông tin coupon (Admin or Instructor - owner only)
	update: async (couponId: string, request: UpdateCouponRequest): Promise<CouponResponse> => {
		const response = await apiService.put<CouponResponse>(`api/v1/coupons/${couponId}`, request);
		return response.data;
	},

	//Xóa coupon (Admin or Instructor - owner only)
	delete: async (couponId: string): Promise<CouponResponse> => {
		const response = await apiService.delete<CouponResponse>(`api/v1/coupons/${couponId}`);
		return response.data;
	},

	//Lấy thông tin coupon theo mã (Public)
	getByCode: async (code: string): Promise<CouponResponse> => {
		const response = await apiService.get<CouponResponse>(`api/v1/coupons/code/${code}`);
		return response.data;
	},

	//Lấy danh sách tất cả coupon (Admin only, paginated)
	getAllForAdmin: async (params: CouponParams): Promise<GetAllCouponResponse> => {
		const response = await apiService.get<GetAllCouponResponse>("api/v1/coupons/admin", convertParamsToQuery(params));
		return response.data;
	},

	//Lấy danh sách tất cả coupon (Admin only, paginated)
	getAllForInstructor: async (): Promise<GetAllCouponResponse> => {
		const response = await apiService.get<GetAllCouponResponse>("api/v1/coupons/instructor");
		return response.data;
	},

	//Tạo coupon cho khóa học cụ thể (Instructor only)
	createForCourse: async (request: CreateCouponInstructorRequest): Promise<CouponResponse> => {
		const response = await apiService.post<CouponResponse>(`api/v1/coupons/instructor`, request);
		return response.data;
	},

	//Bật/tắt trạng thái coupon (Admin only)
	toggleActive: async (couponId: string): Promise<CouponResponse> => {
		const response = await apiService.patch<CouponResponse>(`api/v1/coupons/admin/${couponId}/toggle-status`);
		return response.data;
	},

	//Bật/tắt trạng thái coupon (Instructor only)
	toggleActiveForInstructor: async (couponId: string): Promise<CouponResponse> => {
		const response = await apiService.patch<CouponResponse>(`api/v1/coupons/instructor/${couponId}/toggle-status`);
		return response.data;
	},
};
