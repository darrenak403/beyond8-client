"use client";

import { useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { PaginationState } from "@tanstack/react-table";
import { useGetMyPayments } from "@/hooks/useOrder";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { CouponFloatingPanel } from "@/components/widget/coupon-floating";

export default function PaymentHistoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageIndex = parseInt(searchParams.get("pageNumber") || "1", 10) - 1;
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const isDescending = searchParams.get("isDescending") !== "false";

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const updateUrl = (newPagination: PaginationState) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNumber", (newPagination.pageIndex + 1).toString());
    params.set("pageSize", newPagination.pageSize.toString());
    params.set("isDescending", isDescending.toString());
    router.push(`/mybeyond/payment-history?${params.toString()}`);
  };

  const onPaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState)
  ) => {
    let newPagination: PaginationState;
    if (typeof updaterOrValue === "function") {
      newPagination = updaterOrValue(pagination);
    } else {
      newPagination = updaterOrValue;
    }
    updateUrl(newPagination);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;
    if (!params.has("pageNumber")) {
      params.set("pageNumber", "1");
      changed = true;
    }
    if (!params.has("pageSize")) {
      params.set("pageSize", "10");
      changed = true;
    }
    if (!params.has("isDescending")) {
      params.set("isDescending", "true");
      changed = true;
    }

    if (changed) {
      router.replace(`/mybeyond/payment-history?${params.toString()}`);
    }
  }, [searchParams, router]);

  const { payments, metadata, isLoading } = useGetMyPayments({
    params: {
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      isDescending,
    },
  });

  const pageCount = metadata?.totalPages ?? 1

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto min-h-screen">
      <CouponFloatingPanel />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black">
            Lịch sử giao dịch
          </h2>
          <p className="text-gray-500 font-medium">
            Theo dõi các giao dịch thanh toán khóa học của bạn.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <PaymentHistoryTable
          data={payments}
          isLoading={isLoading}
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      </div>
    </div>
  );
}

