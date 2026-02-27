"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, CreditCard, CalendarClock, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DepositDialog } from "@/components/widget/wallet/DepositDialog";

interface WithdrawalSectionProps {
  lastPayoutAt?: string | null;
  currentBalance: number;
  isLoading?: boolean;
}

export function WithdrawalSection({ lastPayoutAt, currentBalance, isLoading }: WithdrawalSectionProps) {
  return (
    <div className="space-y-6">
      {/* Available Balance Card */}
      <Card className="border-violet-200 bg-brand-purple from-violet-600 to-violet-800 text-white dark:from-violet-700 dark:to-violet-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-violet-200">Số dư khả dụng</CardTitle>
          <div className="p-2 rounded-lg bg-white/20">
            <Wallet className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-36 mb-1 bg-white/20" />
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold [font-variant-numeric:tabular-nums] text-white">
                {new Intl.NumberFormat('vi-VN').format(currentBalance)}
              </span>
              <span className="text-sm font-medium text-violet-200">VNĐ</span>
            </div>
          )}
          <p className="text-xs text-violet-200 mt-1">Có thể rút ngay</p>
        </CardContent>
      </Card>

      <DepositDialog triggerClassName="w-full rounded-xl" />

      <Card>
        <CardHeader>
          <CardTitle>Rút tiền</CardTitle>
          <CardDescription>
            Rút tiền về tài khoản ngân hàng liên kết
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Vietcombank</p>
                <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
              </div>
            </div>
          </div>
          <Button className="rounded-full w-full bg-brand-magenta hover:bg-brand-magenta/90">
            Yêu cầu rút tiền
          </Button>
          {lastPayoutAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center pt-2">
              <CalendarClock className="h-4 w-4" />
              <span>Lần rút gần nhất: {new Intl.DateTimeFormat('vi-VN').format(new Date(lastPayoutAt))}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="rounded-full w-full gap-2">
            <CreditCard className="h-4 w-4" />
            Quản lý tài khoản
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
