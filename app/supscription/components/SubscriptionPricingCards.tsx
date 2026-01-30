"use client";

import { useSubscriptionPlans, useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { LoginDialog } from "@/components/widget/auth/LoginDialog";
import { Check, Crown, Gem, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

export function SubscriptionPricingCard() {
  const { plans, isLoading, error } = useSubscriptionPlans();
  const { subscription } = useSubscription();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  if (isLoading) return <div className="text-center text-white py-20">Đang tải gói dịch vụ...</div>;
  if (error) return <div className="text-center text-red-400 py-20">Lỗi tải dữ liệu.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4 max-w-7xl mb-20">
      {plans?.map((plan, index) => {
        const isRegistered = subscription?.subscriptionPlan?.code === plan.code;
        const isPopular = plan.price > 0 && plan.price < 500000; // Mock logic for popular

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
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
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
                  <span className="text-4xl font-bold text-gray-900">{plan.price}K</span>
                  <span className="text-gray-500 text-sm mb-1">/{plan.durationDays} ngày</span>
                </div>
              )}
            </div>

            <div className="flex-grow space-y-4 mb-8">
              <div className="flex items-center gap-3">
                 <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span className="text-sm text-gray-600">{plan.totalRequestsInPeriod} lượt dùng AI</span>
              </div>
              <div className="flex items-center gap-3">
                 <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span className="text-sm text-gray-600">Giới hạn {plan.maxRequestsPerWeek}/tuần</span>
              </div>
              {plan.includes?.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <Button
                className={cn(
                "w-full h-12 rounded-xl font-semibold transition-all",
                isRegistered
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    : isPopular
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-200"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                )}
                disabled={isRegistered}
                onClick={() => !isAuthenticated && setShowLoginDialog(true)}
            >
                {isRegistered ? "Đã đăng ký" : (plan.price === 0 ? "Bắt đầu ngay" : "Nâng cấp ngay")}
            </Button>
          </motion.div>
        );
      })}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}
