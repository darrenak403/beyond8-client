import apiService, { RequestParams } from "../core";

export interface CartItem {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string | null;
  instructorId: string;
  instructorName: string;
  originalPrice: number;
}

export interface CartData {
  id: string;
  userId: string;
  items: CartItem[];
  subTotal: number;
  totalItems: number;
}

export interface CartResponse {
  isSuccess: boolean;
  message: string;
  data: CartData;
  metadata: null;
}

export interface AddToCartRequest {
  courseId: string;
}

export interface ClearCartResponse {
  isSuccess: boolean;
  message: string;
  data: boolean;
  metadata: null;
}

export interface BuyNowRequest {
  courseId: string;
  instructorCouponCode: string | null;
  couponCode: string | null;
  notes: string | null;
}

export interface BuyNowResponse {
  isSuccess: boolean;
  message: string;
  data: OrderData;
  metadata: null;
}

export interface CheckoutSelectedItem {
  courseId: string;
  instructorCouponCode: string | null;
}

export interface CheckoutRequest {
  selectedItems: CheckoutSelectedItem[];
  couponCode: string | null;
  notes: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string | null;
  instructorId: string;
  instructorName: string;
  originalPrice: number;
  unitPrice: number;
  discountPercent: number;
  [key: string]: unknown; // Additional properties
}

export interface OrderData {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  couponId: string | null;
  paidAt: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string | null;
}

export interface CheckoutResponse {
  isSuccess: boolean;
  message: string;
  data: OrderData;
  metadata: null;
}

export interface ProcessPaymentRequest {
  orderId: string;
}

export interface PaymentData {
  paymentId: string;
  paymentNumber: string;
  paymentUrl: string;
  expiredAt: string;
}

export interface ProcessPaymentResponse {
  isSuccess: boolean;
  message: string;
  data: PaymentData;
  metadata: null;
}

export interface PaymentParams {
  pageNumber?: number;
  pageSize?: number;
  isDescending?: boolean;
}

export interface PaymentItem {
  id: string;
  orderId: string;
  paymentNumber: string;
  status: string;
  amount: number;
  currency: string;
  provider: string;
  paymentMethod: string | null;
  externalTransactionId: string | null;
  paidAt: string | null;
  expiredAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetMyPaymentsResponse {
  isSuccess: boolean;
  message: string;
  data: PaymentItem[];
  metadata: null;
}

const convertParamsToQuery = (params?: PaymentParams): RequestParams => {
  if (!params) return {};
  const query: RequestParams = {};
  if (params.pageNumber !== undefined) query.PageNumber = params.pageNumber;
  if (params.pageSize !== undefined) query.PageSize = params.pageSize;
  if (params.isDescending !== undefined) query.IsDescending = params.isDescending;
  return query;
};

export const fetchOrder = {
  // Lấy thông tin giỏ hàng của user hiện tại
  getCart: async (): Promise<CartResponse> => {
    const response = await apiService.get<CartResponse>("api/v1/cart");
    return response.data;
  },

  // Thêm khóa học vào giỏ hàng
  addToCart: async (request: AddToCartRequest): Promise<CartResponse> => {
    const response = await apiService.post<CartResponse, AddToCartRequest>(
      "api/v1/cart/add",
      request
    );
    return response.data;
  },

  // Xóa khóa học khỏi giỏ hàng
  removeFromCart: async (courseId: string): Promise<CartResponse> => {
    const response = await apiService.delete<CartResponse>(
      `api/v1/cart/remove/${courseId}`
    );
    return response.data;
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<ClearCartResponse> => {
    const response = await apiService.delete<ClearCartResponse>(
      "api/v1/cart/clear"
    );
    return response.data;
  },

  // Mua ngay khóa học
  buyNow: async (request: BuyNowRequest): Promise<BuyNowResponse> => {
    const response = await apiService.post<BuyNowResponse, BuyNowRequest>(
      "api/v1/orders/buy-now",
      request
    );
    return response.data;
  },

  // Thanh toán giỏ hàng
  checkout: async (request: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await apiService.post<CheckoutResponse, CheckoutRequest>(
      "api/v1/cart/checkout",
      request
    );
    return response.data;
  },

  // Xử lý thanh toán
  processPayment: async (request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> => {
    const response = await apiService.post<ProcessPaymentResponse, ProcessPaymentRequest>(
      "api/v1/payments/process",
      request
    );
    return response.data;
  },

  // Lấy danh sách thanh toán của user
  getMyPayments: async (params?: PaymentParams): Promise<GetMyPaymentsResponse> => {
    const defaultParams: PaymentParams = {
      pageNumber: 1,
      pageSize: 10,
      isDescending: true,
    };
    const mergedParams = { ...defaultParams, ...params };
    const query = convertParamsToQuery(mergedParams);
    const response = await apiService.get<GetMyPaymentsResponse>(
      "api/v1/payments/my-payments",
      query
    );
    return response.data;
  },
};
