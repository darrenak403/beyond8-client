"use client";

import { useSubscriptionPlans, useSubscription, useBuySubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { LoginDialog } from "@/components/widget/auth/LoginDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Crown, Gem, Zap, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export function SubscriptionPricingCard() {
  const { plans, isLoading, error } = useSubscriptionPlans();
  const { subscription } = useSubscription();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);

  // Check if user has active paid subscription (not free)
  const hasActivePaidSubscription = subscription?.subscriptionPlan?.code &&
    !["FREE", "BASIC", ""].includes(subscription.subscriptionPlan.code.toUpperCase());

  const { buySubscription, isPending } = useBuySubscription({
    onSuccess: (data) => {
      const paymentUrl = (data as { paymentUrl?: string })?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    },
  });

  if (isLoading) return <div className="text-center text-white py-20">Đang tải gói dịch vụ...</div>;
  if (error) return <div className="text-center text-red-400 py-20">Lỗi tải dữ liệu.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4 max-w-7xl mb-20">
      {plans?.map((plan, index) => {
        const isRegistered = subscription?.subscriptionPlan?.code === plan.code;
        const isPopular = plan.price > 0 && plan.price < 500000;
        const isTheBest = plan.price > 500000;

        return (
          <motion.div
            key={plan.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={cn(
              "relative flex flex-col p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 group",
              isPopular
                ? "bg-white border-[3px] border-purple-500 shadow-2xl shadow-purple-500/20 scale-105 z-10"
                : "bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1"
            )}
          >
            {isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Khuyến dùng
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className={cn("text-xl font-bold", isPopular ? "text-purple-900" : "text-gray-900")}>
                  {plan.name}
                </h3>
                {(() => {
                  switch (plan.code?.toUpperCase()) {
                    case "ULTRA": return <Crown className="w-6 h-6 text-yellow-500" />;
                    case "PRO": return <Gem className="w-6 h-6 text-blue-500" />;
                    case "BASIC": return <Zap className="w-6 h-6 text-purple-500" />;
                    default: return <Shield className="w-6 h-6 text-gray-500" />;
                  }
                })()}
              </div>
              <p className="text-sm text-gray-500 min-h-[40px]">{plan.description || "Mô tả gói dịch vụ"}</p>
            </div>

            <div className="mb-8">
              {plan.price === 0 ? (
                <span className="text-4xl font-bold text-gray-900">Miễn phí</span>
              ) : (
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">{formatCurrency(plan.price)}</span>
                  <span className="text-gray-500 text-sm mb-1">/{plan.durationDays} ngày</span>
                </div>
              )}
            </div>

            <div className="grow space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm text-gray-600">{plan.totalRequestsInPeriod} lượt dùng AI</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm text-gray-600">Giới hạn {plan.maxRequestsPerWeek}/tuần</span>
              </div>
              {plan.includes?.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            {plan.price !== 0 && (
              <Button
                className={cn(
                  "w-full h-12 text-base font-semibold rounded-xl transition-all",
                  isRegistered
                    ? "bg-gray-300 border-2 text-black cursor-not-allowed"
                    : isPopular
                      ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                      : isTheBest
                        ? "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-200"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
                disabled={isRegistered || isPending}
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowLoginDialog(true);
                  } else if (!isRegistered && plan.price !== 0) {
                    if (hasActivePaidSubscription) {
                      setSelectedPlanCode(plan.code);
                      setShowUpgradeDialog(true);
                    } else {
                      buySubscription(plan.code);
                    }
                  }
                }}
              >
                {isRegistered
                  ? "Đã đăng ký"
                  : "Đăng ký ngay"}
              </Button>
            )}
          </motion.div>
        );
      })}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
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
              onClick={() => setShowUpgradeDialog(false)}
              className="w-full sm:w-auto rounded-2xl"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (selectedPlanCode) {
                  setShowUpgradeDialog(false);
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
    </div>
  );
}
