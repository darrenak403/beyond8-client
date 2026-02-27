import apiService, { RequestParams } from "../core";

export interface CartItem {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string | null;
  instructorId: string;
  instructorName: string;
  originalPrice: number;
  discountPercent: number | null;
  discountAmount: number | null;
  discountEndsAt: string | null;
  finalPrice: number;
  hasDiscount: boolean;
}

export interface CartData {
  id: string;
  userId: string;
  items: CartItem[];
  originalTotal: number;
  totalDiscount: number;
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

export interface BuyNowPreviewRequest {
  courseId: string;
  instructorCouponCode: string | null;
  couponCode: string | null;
}

export interface BuyNowPreviewItem {
  courseId: string;
  courseTitle: string;
  originalPrice: number;
  instructorDiscount: number;
  finalPrice: number;
  instructorCouponCode: string | null;
  instructorCouponApplied: boolean;
}

export interface BuyNowPreviewData {
  item: BuyNowPreviewItem;
  subTotal: number;
  subTotalAfterInstructorDiscount: number;
  instructorDiscountAmount: number;
  systemDiscountAmount: number;
  totalDiscountAmount: number;
  totalAmount: number;
  isFree: boolean;
}

export interface BuyNowPreviewResponse {
  isSuccess: boolean;
  message: string;
  data: BuyNowPreviewData;
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

export interface CheckoutPreviewItem {
  courseId: string;
  instructorCouponCode: string | null;
}

export interface CheckoutPreviewRequest {
  items: CheckoutPreviewItem[];
  couponCode: string | null;
}

export interface CheckoutPreviewItemData {
  courseId: string;
  courseTitle: string;
  originalPrice: number;
  instructorDiscount: number;
  finalPrice: number;
  instructorCouponCode: string | null;
  instructorCouponApplied: boolean;
}

export interface CheckoutPreviewData {
  items: CheckoutPreviewItemData[];
  subTotal: number;
  subTotalAfterInstructorDiscount: number;
  instructorDiscountAmount: number;
  systemDiscountAmount: number;
  totalDiscountAmount: number;
  totalAmount: number;
  isFree: boolean;
}

export interface CheckoutPreviewResponse {
  isSuccess: boolean;
  message: string;
  data: CheckoutPreviewData;
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
  subTotalAfterInstructorDiscount: number;
  instructorDiscountAmount: number;
  systemDiscountAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  platformFeeAmount: number;
  instructorEarnings: number;
  instructorCouponId: string | null;
  systemCouponId: string | null;
  paidAt: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  orderItems: OrderItem[];
  pendingPaymentInfo: PendingPaymentInfo | null;
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

export interface PaymentInfo {
  paymentId: string;
  paymentNumber: string;
  purpose: string;
  paymentUrl: string;
  expiredAt: string;
}

export interface PendingPaymentInfo {
  orderId: string;
  orderNumber: string;
  paymentInfo: PaymentInfo;
  message: string;
}

export interface PaymentItem {
  id: string;
  orderId: string | null;
  walletId: string | null;
  paymentNumber: string;
  purpose: string;
  status: string;
  amount: number;
  currency: string;
  provider: string;
  paymentMethod: string | null;
  externalTransactionId: string | null;
  paymentUrl: string | null;
  paidAt: string | null;
  expiredAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string | null;
  orderSummary: OrderSummary | null;
  metadata: string | null;
  pendingPaymentInfo: PendingPaymentInfo | null;
}

export interface PaginationMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetMyPaymentsResponse {
  isSuccess: boolean;
  message: string;
  data: PaymentItem[];
  metadata: PaginationMetadata | null;
}

export interface CheckCourseResponse {
  isSuccess: boolean;
  message: string;
  data: boolean;
  metadata: null;
}

export interface CancelOrderRequest {
  orderId: string;
}

export interface CancelOrderResponse {
  isSuccess: boolean;
  message: string;
  data: OrderData;
  metadata: null;
}

export enum OrderStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Cancelled = "Cancelled",
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpdateSettlementEligibleAtRequest {
  note: string | null
  settlementEligibleAt: string | null
}

export interface OrderItem {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  originalPrice: number;
  finalPrice: number;
  instructorName: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
}

export interface PaymentInfo {
  paymentId: string;
  paymentNumber: string;
  purpose: string;
  paymentUrl: string;
  expiredAt: string;
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

  // Preview mua ngay khóa học
  buyNowPreview: async (request: BuyNowPreviewRequest): Promise<BuyNowPreviewResponse> => {
    const response = await apiService.post<BuyNowPreviewResponse, BuyNowPreviewRequest>(
      "api/v1/orders/buy-now/preview",
      request
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

  // Preview thanh toán giỏ hàng
  checkoutPreview: async (request: CheckoutPreviewRequest): Promise<CheckoutPreviewResponse> => {
    const response = await apiService.post<CheckoutPreviewResponse, CheckoutPreviewRequest>(
      "api/v1/orders/preview",
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

  // Kiểm tra khóa học đã được mua hay chưa
  checkCourse: async (courseId: string): Promise<CheckCourseResponse> => {
    const response = await apiService.get<CheckCourseResponse>(
      `api/v1/orders/check-course/${courseId}`
    );
    return response.data;
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId: string): Promise<CancelOrderResponse> => {
    const response = await apiService.post<CancelOrderResponse, null>(
      `api/v1/orders/${orderId}/cancel`,
      null
    );
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng (Admin only)
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<OrderData> => {
    const response = await apiService.patch<OrderData, UpdateOrderStatusRequest>(
      `api/v1/orders/${orderId}/status`,
      { status }
    );
    return response.data;
  },

  //Cập nhật SettlementEligibleAt cho đơn hàng (Admin only)
  updateSettlementEligibleAt: async (orderId: string, request: UpdateSettlementEligibleAtRequest): Promise<OrderData> => {
    const response = await apiService.patch<OrderData, UpdateSettlementEligibleAtRequest>(
      `api/v1/orders/${orderId}/settlement`,
      request
    );
    return response.data;
  },


};
