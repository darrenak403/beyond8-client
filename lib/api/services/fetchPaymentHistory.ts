import apiService, { RequestParams } from "../core";
import type {
  PaymentParams,
  GetMyPaymentsResponse,
} from "./fetchOrder";

const convertParamsToQuery = (params?: PaymentParams): RequestParams => {
  if (!params) return {};
  const query: RequestParams = {};
  if (params.pageNumber !== undefined) query.PageNumber = params.pageNumber;
  if (params.pageSize !== undefined) query.PageSize = params.pageSize;
  if (params.isDescending !== undefined) query.IsDescending = params.isDescending;
  return query;
};

export const fetchPaymentHistory = {
  // Lấy danh sách lịch sử thanh toán của user
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

