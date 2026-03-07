"use client";

import { useSubscriptionPlans, useSubscription, useBuySubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { LoginDialog } from "@/components/widget/auth/LoginDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Crown, Gem, Zap, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { History } from "lucide-react";

interface UpgradeSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerOnOpen?: boolean;
}

export function UpgradeSubscriptionDialog({ open, onOpenChange }: UpgradeSubscriptionDialogProps) {
  const { plans, isLoading, error } = useSubscriptionPlans();
  const { subscription } = useSubscription();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showUpgradeConfirmDialog, setShowUpgradeConfirmDialog] = useState(false);
  const [showPendingPaymentDialog, setShowPendingPaymentDialog] = useState(false);
  const [pendingPaymentUrl, setPendingPaymentUrl] = useState<string | null>(null);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);

  // Check if user has active paid subscription (not free)
  const hasActivePaidSubscription = subscription?.subscriptionPlan?.code &&
    !["FREE", "BASIC", ""].includes(subscription.subscriptionPlan.code.toUpperCase());

  const { buySubscription, isPending } = useBuySubscription({
    onSuccess: (data) => {
      const paymentData = data as { isPending?: boolean; paymentUrl?: string };
      
      // Check if there's a pending payment
      if (paymentData.isPending) {
        setPendingPaymentUrl(paymentData.paymentUrl || null);
        setShowPendingPaymentDialog(true);
        return;
      }
      
      // Normal flow - redirect to payment
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      }
    },
  });

  const handlePlanSelect = (planCode: string) => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    const currentPlanCode = subscription?.subscriptionPlan?.code;
    const isRegistered = currentPlanCode === planCode;
    const hasPaid = hasActivePaidSubscription;
    
    if (isRegistered) {
      return; // Already registered
    }
    
    setSelectedPlanCode(planCode);
    
    if (hasPaid) {
      setShowUpgradeConfirmDialog(true);
    } else {
      buySubscription(planCode);
    }
  };

  if (isLoading) return <div className="text-center py-10">Đang tải gói dịch vụ...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Lỗi tải dữ liệu.</div>;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Nâng cấp gói dịch vụ
            </DialogTitle>
            <DialogDescription className="text-center">
              Chọn gói phù hợp với nhu cầu của bạn
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
            {plans?.map((plan, index) => {
              const isRegistered = subscription?.subscriptionPlan?.code === plan.code;
              const isPopular = plan.price > 0 && plan.price < 500000;
              const isTheBest = plan.price > 500000;
              const isFree = plan.price === 0;

              return (
                <motion.div
                  key={plan.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={cn(
                    "relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-300 group",
                    !isFree && "cursor-pointer",
                    isPopular
                      ? "bg-purple-50 border-purple-500 shadow-lg"
                      : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
                  )}
                  onClick={() => !isFree && handlePlanSelect(plan.code)}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Nên dùng
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={cn("text-lg font-bold", isPopular ? "text-purple-900" : "text-gray-900")}>
                        {plan.name}
                      </h3>
                      {(() => {
                        switch (plan.code?.toUpperCase()) {
                          case "ULTRA": return <Crown className="w-5 h-5 text-yellow-500" />;
                          case "PRO": return <Gem className="w-5 h-5 text-blue-500" />;
                          case "BASIC": return <Zap className="w-5 h-5 text-purple-500" />;
                          default: return <Shield className="w-5 h-5 text-gray-500" />;
                        }
                      })()}
                    </div>
                    <p className="text-xs text-gray-500">{plan.description}</p>
                  </div>

                  <div className="mb-4">
                    {plan.price === 0 ? (
                      <span className="text-2xl font-bold text-gray-900">Miễn phí</span>
                    ) : (
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(plan.price)}</span>
                        <span className="text-gray-500 text-sm mb-1">/{plan.durationDays} ngày</span>
                      </div>
                    )}
                  </div>

                  <div className="grow space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-xs text-gray-600">{plan.totalRequestsInPeriod} lượt dùng AI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-xs text-gray-600">Giới hạn {plan.maxRequestsPerWeek}/tuần</span>
                    </div>
                    {plan.includes?.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {!isFree && (
                    <Button
                      className={cn(
                        "w-full text-sm font-semibold rounded-xl transition-all",
                        isRegistered
                          ? "bg-gray-300 text-black cursor-not-allowed"
                          : isPopular
                            ? "bg-primary hover:bg-primary/90"
                            : isTheBest
                              ? "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                      disabled={isRegistered || isPending}
                    >
                      {isRegistered ? "Đã đăng ký" : "Chọn gói"}
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showUpgradeConfirmDialog} onOpenChange={setShowUpgradeConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              Xác nhận đổi gói
            </DialogTitle>
            <DialogDescription className="text-base">
              Bạn đang có gói <span className="font-semibold text-primary">{subscription?.subscriptionPlan?.name}</span>. Khi đổi sang gói mới:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm">Gói mới của bạn sẽ bắt đầu ngay lập tức</span>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <span className="text-sm">Mọi khoản chiết khấu cho gói hiện tại của bạn sẽ kết thúc khi bạn đổi gói</span>
            </div>
          </div>
          <DialogFooter className="sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeConfirmDialog(false)}
              className="w-full sm:w-auto rounded-2xl"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (selectedPlanCode) {
                  setShowUpgradeConfirmDialog(false);
                  buySubscription(selectedPlanCode);
                }
              }}
              disabled={isPending}
              className="w-full sm:w-auto rounded-2xl"
            >
              {isPending ? "Đang xử lý..." : "Tiếp tục đăng ký"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pending Payment Dialog */}
      <Dialog open={showPendingPaymentDialog} onOpenChange={setShowPendingPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Đơn hàng chưa thanh toán
            </DialogTitle>
            <DialogDescription className="text-base">
              Bạn đang có đơn hàng chưa thanh toán. Vui lòng thanh toán để tiếp tục mua hàng.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/mybeyond/payment-history")}
              className="w-full sm:w-auto rounded-2xl"
            >
              <History className="w-4 h-4 mr-2" />
              Xem lịch sử giao dịch
            </Button>
            <Button
              onClick={() => {
                setShowPendingPaymentDialog(false);
                if (pendingPaymentUrl) {
                  window.location.href = pendingPaymentUrl;
                }
              }}
              className="w-full sm:w-auto rounded-2xl"
            >
              Thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
