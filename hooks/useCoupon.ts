import { useQuery } from "@tanstack/react-query";
import { fetchCoupon } from "@/lib/api/services/fetchCoupon";
import type { Coupon } from "@/lib/api/services/fetchCoupon";

interface UseActiveCouponsOptions {
	enabled?: boolean;
}

export function useActiveCoupons(options?: UseActiveCouponsOptions) {
	const { data, isLoading, error, isError, refetch } = useQuery({
		queryKey: ["coupons", "active"],
		queryFn: () => fetchCoupon.getActive(),
		enabled: options?.enabled ?? true,
	});

	return {
		coupons: (data?.data ?? []) as Coupon[],
		isLoading,
		error,
		isError,
		refetch,
	};
}
