import { useQuery } from "@tanstack/react-query";
import { fetchPaymentHistory } from "@/lib/api/services/fetchPaymentHistory";
import type {
  PaymentParams,
  PaymentItem,
  GetMyPaymentsResponse,
} from "@/lib/api/services/fetchOrder";

interface UsePaymentHistoryOptions {
  params?: PaymentParams;
  enabled?: boolean;
}

export function usePaymentHistory(options?: UsePaymentHistoryOptions) {
  const { data, isLoading, isError, refetch } = useQuery<GetMyPaymentsResponse, Error>({
    queryKey: ["payment-history", options?.params],
    queryFn: () => fetchPaymentHistory.getMyPayments(options?.params),
    enabled: options?.enabled ?? true,
  });

  return {
    payments: (data?.data ?? []) as PaymentItem[],
    metadata: data?.metadata,
    isLoading,
    isError,
    refetch,
  };
}

