import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWallet } from "@/lib/api/services/fetchWallet";
import type {
    ChargeWalletRequest,
    TransactionsParams,
    TransactionsResponse,
    Wallet,
    WalletTransaction,
    UpcomingParams,
    GetUpcomingSettlementsResponse,
    UpcomingSettlement,
    MyUpcomingParams,
    GetMyUpcomingSettlementsResponse,
    MyUpcoming,
    PlatformWallet
} from "@/lib/api/services/fetchWallet";
import { ApiError } from "@/types/api";
import { toast } from "sonner";

export function useGetMyWallet() {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: ["wallet", "my-wallet"],
        queryFn: () => fetchWallet.getMyWallet(),
    });

    return {
        wallet: (data?.data ?? null) as Wallet | null,
        isLoading,
        error,
        isError,
        refetch,
    };
}

export function useGetMyTransactions(params: TransactionsParams) {
    const { data, isLoading, error, isError, refetch, isFetching } = useQuery({
        queryKey: ["wallet", "transactions", params],
        queryFn: () => fetchWallet.getTransactions(params),
        select: (data: TransactionsResponse) => ({
            data: data.data as WalletTransaction[],
            count: data.metadata?.totalItems || 0,
            pageNumber: data.metadata?.pageNumber || params.pageNumber,
            pageSize: data.metadata?.pageSize || params.pageSize,
            totalPages: data.metadata?.totalPages || 0,
            hasNextPage: data.metadata?.hasNextPage || false,
            hasPreviousPage: data.metadata?.hasPreviousPage || false
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

export function useChargeWallet() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (request: ChargeWalletRequest) => fetchWallet.chargeWallet(request),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["wallet", "my-wallet"],
            });
            queryClient.invalidateQueries({
                queryKey: ["wallet", "transactions"],
            });
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Nạp tiền thất bại!");
        },
    });

    return {
        chargeWallet: mutateAsync,
        isPending,
    };
}

export function useGetWalletByInstructorId(instructorId: string) {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: ["wallet", "instructor", instructorId],
        queryFn: () => fetchWallet.getWalletByInstructorId(instructorId),
        enabled: !!instructorId,
    });

    return {
        wallet: (data?.data ?? null) as Wallet | null,
        isLoading,
        error,
        isError,
        refetch,
    };
}

export function useGetTransactionsByInstructorId(instructorId: string, params: TransactionsParams) {
    const { data, isLoading, error, isError, refetch, isFetching } = useQuery({
        queryKey: ["wallet", "transactions", "instructor", instructorId, params],
        queryFn: () => fetchWallet.getTransactionsByInstructorId(instructorId, params),
        select: (data: TransactionsResponse) => ({
            data: data.data as WalletTransaction[],
            count: data.metadata?.totalItems || 0,
            pageNumber: data.metadata?.pageNumber || params.pageNumber,
            pageSize: data.metadata?.pageSize || params.pageSize,
            totalPages: data.metadata?.totalPages || 0,
            hasNextPage: data.metadata?.hasNextPage || false,
            hasPreviousPage: data.metadata?.hasPreviousPage || false
        }),
        placeholderData: (previousData) => previousData,
        enabled: !!instructorId,
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

export function useGetPlatformWallet() {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: ["wallet", "platform"],
        queryFn: () => fetchWallet.getPlatformWallet(),
    });

    return {
        wallet: (data?.data ?? null) as PlatformWallet | null,
        isLoading,
        error,
        isError,
        refetch,
    };
}

export function useGetPlatformTransactions(params: TransactionsParams) {
    const { data, isLoading, error, isError, refetch, isFetching } = useQuery({
        queryKey: ["wallet", "transactions", "platform", params],
        queryFn: () => fetchWallet.getPlatformTransactions(params),
        select: (data: TransactionsResponse) => ({
            data: data.data as WalletTransaction[],
            count: data.metadata?.totalItems || 0,
            pageNumber: data.metadata?.pageNumber || params.pageNumber,
            pageSize: data.metadata?.pageSize || params.pageSize,
            totalPages: data.metadata?.totalPages || 0,
            hasNextPage: data.metadata?.hasNextPage || false,
            hasPreviousPage: data.metadata?.hasPreviousPage || false
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

export function useTriggerSettlement() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => fetchWallet.triggerSettlement(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["wallet"],
            });
            toast.success("Thực hiện xử lý các giao dịch thành công!");
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Thực hiện xử lý các giao dịch thất bại!");
        },
    });

    return {
        triggerSettlement: mutateAsync,
        isPending,
    };
}

export function useGetUpcomingSettlements(params: UpcomingParams) {
    const { data, isLoading, error, isError, refetch, isFetching } = useQuery({
        queryKey: ["wallet", "settlements", "upcoming", params],
        queryFn: () => fetchWallet.getUpcomingSettlements(params),
        select: (data: GetUpcomingSettlementsResponse) => ({
            data: data.data as UpcomingSettlement[],
            count: data.metadata?.totalItems || 0,
            pageNumber: data.metadata?.pageNumber || params.pageNumber,
            pageSize: data.metadata?.pageSize || params.pageSize,
            totalPages: data.metadata?.totalPages || 0,
            hasNextPage: data.metadata?.hasNextPage || false,
            hasPreviousPage: data.metadata?.hasPreviousPage || false
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

export function useGetMyUpcomingSettlements(params: MyUpcomingParams) {
    const { data, isLoading, error, isError, refetch, isFetching } = useQuery({
        queryKey: ["wallet", "settlements", "my-upcoming", params],
        queryFn: () => fetchWallet.getMyUpcomingSettlements(params),
        select: (data: GetMyUpcomingSettlementsResponse) => ({
            data: data.data as MyUpcoming[],
            count: data.metadata?.totalItems || 0,
            pageNumber: data.metadata?.pageNumber || params.pageNumber,
            pageSize: data.metadata?.pageSize || params.pageSize,
            totalPages: data.metadata?.totalPages || 0,
            hasNextPage: data.metadata?.hasNextPage || false,
            hasPreviousPage: data.metadata?.hasPreviousPage || false
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
