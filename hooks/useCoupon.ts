import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCoupon } from "@/lib/api/services/fetchCoupon";
import type { Coupon, CouponParams, CreateCouponInstructorRequest, CreateCouponRequest, UpdateCouponRequest } from "@/lib/api/services/fetchCoupon";
import { ApiError } from "@/types/api";
import { toast } from "sonner";

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

export function useCreateCoupon() {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: (coupon: CreateCouponRequest) => fetchCoupon.create(coupon),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["coupons", "active"],
			});
			queryClient.invalidateQueries({
				queryKey: ["coupons", "admin"],
			});
			queryClient.invalidateQueries({
				queryKey: ["coupons", "instructor"],
			});
			toast.success("Tạo mã khuyến mãi thành công!");
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Tạo mã khuyến mãi thất bại!");
		},
	});

	return {
		createCoupon: mutateAsync,
		isPending,
	};
}

export function useUpdateCoupon() {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: ({ id, coupon }: { id: string, coupon: UpdateCouponRequest }) => fetchCoupon.update(id, coupon),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["coupons", "active"],
			});
			queryClient.invalidateQueries({
				queryKey: ["coupons", "admin"],
			});
			queryClient.invalidateQueries({
				queryKey: ["coupons", "instructor"],
			});
			toast.success("Cập nhật mã khuyến mãi thành công!");
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Cập nhật mã khuyến mãi thất bại!");
		},
	});

	return {
		updateCoupon: mutateAsync,
		isPending,
	};
}

export function useDeleteCoupon() {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: (id: string) => fetchCoupon.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["coupons", "active"],
			});
			queryClient.invalidateQueries({
				queryKey: ["coupons", "admin"],
			});
			queryClient.invalidateQueries({
				queryKey: ["coupons", "instructor"],
			});
			toast.success("Xóa mã khuyến mãi thành công!");
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Xóa mã khuyến mãi thất bại!");
		},
	});

	return {
		deleteCoupon: mutateAsync,
		isPending,
	};
}

export function useToggleCoupon() {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: (id: string) => fetchCoupon.toggleActive(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["coupons", "active"],
			});
			queryClient.invalidateQueries({
				queryKey: ["coupons", "admin"],
			});
			queryClient.invalidateQueries({
				queryKey: ["coupons", "instructor"],
			});
			toast.success("Bật/tắt mã khuyến mãi thành công!");
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Bật/tắt mã khuyến mãi thất bại!");
		},
	});

	return {
		toggleCoupon: mutateAsync,
		isPending,
	};
}

export function useGetCouponByCode(code: string) {
	const { data, isLoading, error, isError, refetch } = useQuery({
		queryKey: ["coupons", "code", code],
		queryFn: () => fetchCoupon.getByCode(code),
	});

	return {
		coupon: (data?.data ?? null) as Coupon | null,
		isLoading,
		error,
		isError,
		refetch,
	};
}

export function useCreateCouponForCourse() {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: (coupon: CreateCouponInstructorRequest) => fetchCoupon.createForCourse(coupon),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["coupons", "active"],
			});
			queryClient.invalidateQueries({
				queryKey: ["coupons", "instructor"],
			});
			toast.success("Tạo mã khuyến mãi thành công!");
		},
		onError: (error: ApiError) => {
			const errorMessage = (error?.message || "").toLowerCase();
			const isInsufficientBalance = errorMessage.includes("số dư") || errorMessage.includes("xu") || errorMessage.includes("balance") || errorMessage.includes("không đủ");

			// If it's an insufficient balance error, let the component handle the custom toast + action
			if (!isInsufficientBalance) {
				toast.error(error?.message || "Tạo mã khuyến mãi thất bại!");
			}
		},
	});

	return {
		createCoupon: mutateAsync,
		isPending,
	};
}

export function useGetCouponForAdmin(filterParams: CouponParams) {
	const { data, isLoading, error, isError, refetch, isFetching } = useQuery({
		queryKey: ["coupons", "admin", filterParams],
		queryFn: () => fetchCoupon.getAllForAdmin(filterParams),
		select: (data) => ({
			data: data.data,
			count: data.metadata.totalItems,
			pageNumber: data.metadata.pageNumber,
			pageSize: data.metadata.pageSize,
			totalPages: data.metadata.totalPages,
			hasNextPage: data.metadata.hasNextPage,
			hasPreviousPage: data.metadata.hasPreviousPage
		}),
		placeholderData: (previousData) => previousData,
	});

	return {
		data,
		isLoading,
		error,
		isError,
		refetch,
		isFetching
	};
}

export function useGetCouponForInstructor() {
	const { data, isLoading, error, isError, refetch } = useQuery({
		queryKey: ["coupons", "instructor"],
		queryFn: () => fetchCoupon.getAllForInstructor(),
	});

	return {
		coupons: (data?.data ?? []) as Coupon[],
		isLoading,
		error,
		isError,
		refetch,
	};
}

