"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

import { UpcomingSettlement } from "@/lib/api/services/fetchWallet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarClock, Clock } from "lucide-react";
import { useUpdateSettlementEligibleAt } from "@/hooks/useOrder";
import { useState } from "react";

interface PlatformUpcomingSettlementsTableProps {
  settlements: UpcomingSettlement[];
  isLoading?: boolean;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
  pageCount: number;
}

export function PlatformUpcomingSettlementsTable({
  settlements,
  isLoading,
  pagination,
  setPagination,
  pageCount,
}: PlatformUpcomingSettlementsTableProps) {
  const { updateSettlementEligibleAt, isPending: isUpdatingSettlement } =
    useUpdateSettlementEligibleAt();

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [settlementDate, setSettlementDate] = useState("");

  const handleSubmitSettlement = async (orderId: string) => {
    await updateSettlementEligibleAt({
      orderId,
      request: {
        note: null,
        settlementEligibleAt: settlementDate
          ? new Date(settlementDate).toISOString()
          : new Date().toISOString(),
      },
    });
    setOpenPopoverId(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Ngày dự kiến</TableHead>
              <TableHead>Trạng thái nền tảng</TableHead>
              <TableHead className="text-right">Số tiền giảng viên</TableHead>
              <TableHead className="text-right">Số tiền nền tảng</TableHead>
              <TableHead className="text-center">Cập nhật ngày xử lý</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[100px] ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : settlements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Không có khoản đang xử lý nào.
                </TableCell>
              </TableRow>
            ) : (
              settlements.map((item) => (
                <TableRow key={item.orderId}>
                  <TableCell className="font-medium">{item.orderNumber}</TableCell>
                  <TableCell>
                    {item.availableAt
                      ? format(
                        new Date(
                          item.availableAt.endsWith("Z")
                            ? item.availableAt
                            : `${item.availableAt}Z`
                        ),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                        ${item.platformStatus === "Pending" ? "text-orange-600 border-orange-200 bg-orange-50" : ""}
                        ${item.platformStatus === "Completed" ? "text-green-600 border-green-200 bg-green-50" : ""}
                      `}
                    >
                      {item.platformStatus === "Pending" ? "Chờ xử lý" : "Đã xử lý"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right align-middle">
                    <div className="flex flex-col items-end justify-center">
                      <span
                        className={`font-medium [font-variant-numeric:tabular-nums] ${item.platformStatus === "Completed" ? "text-green-600" : "text-orange-600"}`}
                      >
                        +{item.platformAmount.toLocaleString()} VNĐ
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                        Doanh thu giảng viên
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right align-middle">
                    <div className="flex flex-col items-end justify-center">
                      <span
                        className={`font-medium [font-variant-numeric:tabular-nums] ${item.platformStatus === "Completed" ? "text-green-600" : "text-orange-600"}`}
                      >
                        +{item.platformAmount.toLocaleString()} VNĐ
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                        {item.platformStatus === "Completed"
                          ? "Cộng vào số dư nền tảng"
                          : "Chờ xử lý từ đơn hàng"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover
                      open={openPopoverId === item.orderId}
                      onOpenChange={(open) => {
                        if (open) {
                          setOpenPopoverId(item.orderId);
                          setSettlementDate(new Date().toISOString());
                        } else {
                          setOpenPopoverId(null);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-blue-200"
                          title="Thực hiện đối soát"
                          disabled={isUpdatingSettlement || item.platformStatus === "Completed"}
                        >
                          <CalendarClock className="h-4 w-4 text-blue-600" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="end">
                        <Calendar
                          mode="single"
                          selected={settlementDate ? new Date(settlementDate) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const existing = settlementDate
                                ? new Date(settlementDate)
                                : new Date();
                              date.setHours(existing.getHours(), existing.getMinutes());
                              setSettlementDate(date.toISOString());
                            } else {
                              setSettlementDate("");
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border mt-3">
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="time"
                              value={
                                settlementDate ? format(new Date(settlementDate), "HH:mm") : "00:00"
                              }
                              onChange={(e) => {
                                if (settlementDate && e.target.value) {
                                  const [hours, minutes] = e.target.value.split(":");
                                  const newDate = new Date(settlementDate);
                                  newDate.setHours(parseInt(hours, 10));
                                  newDate.setMinutes(parseInt(minutes, 10));
                                  setSettlementDate(newDate.toISOString());
                                }
                              }}
                              className="h-9 w-full"
                            />
                          </div>
                          <Button
                            className="w-full"
                            disabled={isUpdatingSettlement || !settlementDate}
                            onClick={() => handleSubmitSettlement(item.orderId)}
                          >
                            {isUpdatingSettlement ? "Đang xử lý..." : "Xác nhận"}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && pageCount > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Trang {pagination.pageIndex + 1} / {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
              disabled={pagination.pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))}
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
