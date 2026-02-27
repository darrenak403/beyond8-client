import apiService, { RequestParams } from "../core"
import { Metadata } from "./fetchUsers"

export interface Wallet {
    id: string
    instructorId: string
    pendingBalance: number
    nextAvailableAt: string | null
    availableBalance: number
    holdBalance: number
    currency: string
    totalEarnings: number
    totalWithdrawn: number
    lastPayoutAt: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string | null
}

export enum TransactionType {
    Sale = "Sale",
    Payout = "Payout",
    PlatformFee = "PlatformFee",
    Adjustment = "Adjustment",
    TopUp = "TopUp",
    CouponHold = "CouponHold",
    CouponRelease = "CouponRelease",
    CouponUsage = "CouponUsage",
    Settlement = "Settlement",
}

export interface WalletTransaction {
    id: string
    walletId: string
    type: TransactionType
    status: string
    amount: number
    currency: string
    balanceBefore: number
    balanceAfter: number
    referenceId: string
    referenceType: string
    description: string
    externalTransactionId: string
    createdAt: string
}

export interface WalletResponse {
    isSuccess: boolean
    message: string
    data: Wallet
    metadata: unknown
}

export interface ChargeWalletRequest {
    amount: number
}

export interface ChargeWalletResponse {
    isSuccess: boolean
    message: string
    data: {
        isPending: boolean
        status: string
        paymentId: string
        paymentNumber: string
        purpose: string
        expiredAt: string
        paymentUrl: string
    }
    metadata: Metadata
}

export interface TransactionsParams {
    pageNumber: number
    pageSize: number
    isDescending: boolean
}

export interface TransactionsResponse {
    isSuccess: boolean
    message: string
    data: WalletTransaction[]
    metadata: Metadata
}

export interface UpcomingSettlement {
    orderId: string
    orderNumber: string
    instructorAmount: number
    platformAmount: number
    availableAt: string | null
    currency: string
    status: string
    platformStatus: string
}

export interface MyUpcoming {
    transactionId: string
    walletId: string
    orderId: string
    amount: number
    currency: string
    availableAt: string | null
    createdAt: string
    status: string
}

export interface GetUpcomingSettlementsResponse {
    isSuccess: boolean
    message: string
    data: UpcomingSettlement[]
    metadata: Metadata
}

export interface GetMyUpcomingSettlementsResponse {
    isSuccess: boolean
    message: string
    data: MyUpcoming[]
    metadata: Metadata
}

export interface UpcomingParams {
    from: string
    to: string
    pageNumber: number
    pageSize: number
    isDescending: boolean
}

export interface MyUpcomingParams {
    pageNumber: number
    pageSize: number
    isDescending: boolean
}

const convertParamsToQuery = (params: TransactionsParams): RequestParams => {
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

const convertUpcomingParamsToQuery = (params: UpcomingParams): RequestParams => {
    if (!params) {
        return {};
    }
    const query: RequestParams = {}
    if (params.from) {
        query.from = params.from;
    }
    if (params.to) {
        query.to = params.to;
    }
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

const convertMyUpcomingParamsToQuery = (params: MyUpcomingParams): RequestParams => {
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

export const fetchWallet = {
    //Lấy thông tin ví của giảng viên hiện tại (Instructor)
    getMyWallet: async (): Promise<WalletResponse> => {
        const response = await apiService.get<WalletResponse>("api/v1/wallets/my-wallet");
        return response.data;
    },

    //Nạp tiền vào ví giảng viên qua VNPay — Purpose: WalletTopUp (Instructor)
    chargeWallet: async (request: ChargeWalletRequest): Promise<ChargeWalletResponse> => {
        const response = await apiService.post<ChargeWalletResponse>("api/v1/wallets/top-up", request);
        return response.data;
    },

    //Lấy lịch sử giao dịch ví của giảng viên hiện tại (Instructor, phân trang)
    getTransactions: async (params: TransactionsParams): Promise<TransactionsResponse> => {
        const response = await apiService.get<TransactionsResponse>("api/v1/wallets/my-wallet/transactions", convertParamsToQuery(params));
        return response.data;
    },

    //Lấy thông tin ví của một giảng viên cụ thể (Admin/Staff)
    getWalletByInstructorId: async (instructorId: string): Promise<WalletResponse> => {
        const response = await apiService.get<WalletResponse>(`api/v1/wallets/instructor/${instructorId}`);
        return response.data;
    },

    //Lấy lịch sử giao dịch ví của một giảng viên cụ thể (Admin/Staff, phân trang)
    getTransactionsByInstructorId: async (instructorId: string, params: TransactionsParams): Promise<TransactionsResponse> => {
        const response = await apiService.get<TransactionsResponse>(`api/v1/wallets/instructor/${instructorId}/transactions`, convertParamsToQuery(params));
        return response.data;
    },

    //Tạo ví cho một giảng viên (Admin/Staff - Internal use)
    createWalletForInstructor: async (instructorId: string): Promise<WalletResponse> => {
        const response = await apiService.post<WalletResponse>(`api/v1/wallets/create/${instructorId}`);
        return response.data;
    },

    //Lấy thông tin ví nền tảng (Admin only)
    getPlatformWallet: async (): Promise<WalletResponse> => {
        const response = await apiService.get<WalletResponse>("api/v1/platform-wallet");
        return response.data;
    },

    //Lấy lịch sử giao dịch ví nền tảng (Admin only, phân trang)
    getPlatformTransactions: async (params: TransactionsParams): Promise<TransactionsResponse> => {
        const response = await apiService.get<TransactionsResponse>("api/v1/platform-wallet/transactions", convertParamsToQuery(params));
        return response.data;
    },

    //Trigger settlement processing immediately (Admin only). Use for demo/maintenance only.
    triggerSettlement: async (): Promise<WalletResponse> => {
        const response = await apiService.post<WalletResponse>("api/v1/settlements/trigger");
        return response.data;
    },

    //Get upcoming settlements grouped by order (instructor + platform amounts)
    getUpcomingSettlements: async (params: UpcomingParams): Promise<GetUpcomingSettlementsResponse> => {
        const response = await apiService.get<GetUpcomingSettlementsResponse>("api/v1/settlements/upcoming", convertUpcomingParamsToQuery(params));
        return response.data;
    },

    //Get upcoming settlements for current instructor (their incoming releases)
    getMyUpcomingSettlements: async (params: MyUpcomingParams): Promise<GetMyUpcomingSettlementsResponse> => {
        const response = await apiService.get<GetMyUpcomingSettlementsResponse>("api/v1/settlements/my-upcoming", convertMyUpcomingParamsToQuery(params));
        return response.data;
    },
}