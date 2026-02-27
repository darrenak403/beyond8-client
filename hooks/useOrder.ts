import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrder,
  CartResponse,
  CartData,
  AddToCartRequest,
  ClearCartResponse,
  BuyNowRequest,
  BuyNowResponse,
  BuyNowPreviewRequest,
  BuyNowPreviewResponse,
  CheckoutRequest,
  CheckoutResponse,
  CheckoutPreviewRequest,
  CheckoutPreviewResponse,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  PaymentParams,
  GetMyPaymentsResponse,
  CheckCourseResponse,
  CancelOrderResponse,
  OrderStatus,
  OrderData,
  UpdateSettlementEligibleAtRequest,
} from "@/lib/api/services/fetchOrder";
import { toast } from "sonner";

interface UseGetCartOptions {
  enabled?: boolean;
}

interface UseGetMyPaymentsOptions {
  params?: PaymentParams;
  enabled?: boolean;
}

// Hook lấy thông tin giỏ hàng của user hiện tại
export function useGetCart(options?: UseGetCartOptions) {
  const { data, isLoading, isError, refetch } = useQuery<
    CartResponse,
    Error,
    CartData
  >({
    queryKey: ["cart"],
    queryFn: () => fetchOrder.getCart(),
    enabled: options?.enabled ?? true,
    select: (res) => res.data,
  });

  return {
    cart: data,
    isLoading,
    isError,
    refetch,
  };
}

// Hook thêm khóa học vào giỏ hàng
export function useAddToCart() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    CartResponse,
    Error,
    AddToCartRequest
  >({
    mutationFn: (request: AddToCartRequest) => fetchOrder.addToCart(request),
    onSuccess: (data) => {
      // Cập nhật lại thông tin giỏ hàng sau khi thêm thành công
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      if (data.isSuccess) {
        toast.success(data.message || "Thêm khóa học vào giỏ hàng thành công!");
      } else {
        toast.error(data.message || "Không thể thêm khóa học vào giỏ hàng!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể thêm khóa học vào giỏ hàng!");
    },
  });

  return {
    addToCart: mutateAsync,
    isPending,
  };
}

// Hook xóa khóa học khỏi giỏ hàng
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    CartResponse,
    Error,
    string
  >({
    mutationFn: (courseId: string) => fetchOrder.removeFromCart(courseId),
    onSuccess: (data) => {
      // Cập nhật lại thông tin giỏ hàng sau khi xóa thành công
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      if (data.isSuccess) {
        toast.success(data.message || "Đã xóa khóa học khỏi giỏ hàng!");
      } else {
        toast.error(data.message || "Không thể xóa khóa học khỏi giỏ hàng!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể xóa khóa học khỏi giỏ hàng!");
    },
  });

  return {
    removeFromCart: mutateAsync,
    isPending,
  };
}

// Hook xóa toàn bộ giỏ hàng
export function useClearCart() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    ClearCartResponse,
    Error,
    void
  >({
    mutationFn: () => fetchOrder.clearCart(),
    onSuccess: (data) => {
      // Cập nhật lại thông tin giỏ hàng sau khi xóa thành công
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      if (data.isSuccess) {
        toast.success(data.message || "Đã xóa toàn bộ giỏ hàng!");
      } else {
        toast.error(data.message || "Không thể xóa giỏ hàng!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể xóa giỏ hàng!");
    },
  });

  return {
    clearCart: mutateAsync,
    isPending,
  };
}

// Hook preview mua ngay khóa học
export function useBuyNowPreview() {
  const { mutateAsync, isPending, data } = useMutation<
    BuyNowPreviewResponse,
    Error,
    BuyNowPreviewRequest
  >({
    mutationFn: (request: BuyNowPreviewRequest) => fetchOrder.buyNowPreview(request),
    onError: (error) => {
      toast.error(error.message || "Không thể tải thông tin đơn hàng!");
    },
  });

  return {
    previewBuyNow: mutateAsync,
    isPending,
    previewData: data?.data,
  };
}

// Hook mua ngay khóa học
export function useBuyNow(options?: { onPendingPayment?: (paymentUrl: string, orderNumber: string) => void }) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    BuyNowResponse,
    Error,
    BuyNowRequest
  >({
    mutationFn: (request: BuyNowRequest) => fetchOrder.buyNow(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      if (data.isSuccess && data.data?.pendingPaymentInfo) {
        const paymentInfo = data.data.pendingPaymentInfo;
        options?.onPendingPayment?.(
          paymentInfo.paymentInfo.paymentUrl,
          paymentInfo.orderNumber
        );
      } else {
        toast.success(data.message || "Mua khóa học thành công!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể mua khóa học!");
    },
  });

  return {
    buyNow: mutateAsync,
    isPending,
  };
}

// Hook preview thanh toán giỏ hàng
export function useCheckoutPreview() {
  const { mutateAsync, isPending, data } = useMutation<
    CheckoutPreviewResponse,
    Error,
    CheckoutPreviewRequest
  >({
    mutationFn: (request: CheckoutPreviewRequest) => fetchOrder.checkoutPreview(request),
    onError: (error) => {
      toast.error(error.message || "Không thể tải thông tin đơn hàng!");
    },
  });

  return {
    previewCheckout: mutateAsync,
    isPending,
    previewData: data?.data,
  };
}

// Hook thanh toán giỏ hàng
export function useCheckout(options?: { onPendingPayment?: (paymentUrl: string, orderNumber: string) => void }) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    CheckoutResponse,
    Error,
    CheckoutRequest
  >({
    mutationFn: (request: CheckoutRequest) => fetchOrder.checkout(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      if (data.isSuccess && data.data?.pendingPaymentInfo && data.data?.status === "PENDING") {
        const paymentInfo = data.data.pendingPaymentInfo;
        options?.onPendingPayment?.(
          paymentInfo.paymentInfo.paymentUrl,
          paymentInfo.orderNumber
        );
      } else {
        toast.success(data.message || "Thanh toán thành công!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể thanh toán!");
    },
  });

  return {
    checkout: mutateAsync,
    isPending,
  };
}

// Hook xử lý thanh toán
export function useProcessPayment() {
  const { mutateAsync, isPending } = useMutation<
    ProcessPaymentResponse,
    Error,
    ProcessPaymentRequest
  >({
    mutationFn: (request: ProcessPaymentRequest) => fetchOrder.processPayment(request),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message || "Tạo link thanh toán thành công!");
      } else {
        toast.error(data.message || "Không thể tạo link thanh toán!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể tạo link thanh toán!");
    },
  });

  return {
    processPayment: mutateAsync,
    isPending,
  };
}

// Hook lấy danh sách thanh toán của user
export function useGetMyPayments(options?: UseGetMyPaymentsOptions) {
  const { data, isLoading, isError, refetch } = useQuery<
    GetMyPaymentsResponse,
    Error
  >({
    queryKey: ["my-payments", options?.params],
    queryFn: () => fetchOrder.getMyPayments(options?.params),
    enabled: options?.enabled ?? true,
  });

  return {
    payments: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    isError,
    refetch,
  };
}

// Hook kiểm tra khóa học đã được mua hay chưa
export function useCheckCourse(courseId: string, options?: { enabled?: boolean }) {
  const { data, isLoading, isError, refetch } = useQuery<
    CheckCourseResponse,
    Error,
    boolean
  >({
    queryKey: ["check-course", courseId],
    queryFn: () => fetchOrder.checkCourse(courseId),
    enabled: options?.enabled ?? true,
    select: (res) => res.data,
  });

  return {
    isPurchased: data,
    isLoading,
    isError,
    refetch,
  };
}

// Hook hủy đơn hàng
export function useCancelOrder() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    CancelOrderResponse,
    Error,
    string
  >({
    mutationFn: (orderId: string) => fetchOrder.cancelOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["my-payments"],
      });

      if (data.isSuccess) {
        toast.success(data.message || "Hủy đơn hàng thành công!");
      } else {
        toast.error(data.message || "Không thể hủy đơn hàng!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể hủy đơn hàng!");
    },
  });

  return {
    cancelOrder: mutateAsync,
    isPending,
  };
}

// Hook cập nhật trạng thái đơn hàng (Admin only)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    OrderData,
    Error,
    { orderId: string; status: OrderStatus }
  >({
    mutationFn: ({ orderId, status }) => fetchOrder.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Không thể cập nhật trạng thái đơn hàng!");
    },
  });

  return {
    updateOrderStatus: mutateAsync,
    isPending,
  };
}

// Hook cập nhật ngày đủ điều kiện đối soát (Admin only)
export function useUpdateSettlementEligibleAt() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    OrderData,
    Error,
    { orderId: string; request: UpdateSettlementEligibleAtRequest }
  >({
    mutationFn: ({ orderId, request }) => fetchOrder.updateSettlementEligibleAt(orderId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["wallet", "settlements", "upcoming"],
      });
      toast.success("Cập nhật thông tin giao dịch thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Không thể cập nhật thông tin giao dịch!");
    },
  });

  return {
    updateSettlementEligibleAt: mutateAsync,
    isPending,
  };
}
