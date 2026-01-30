"use client";

import { useState, useEffect, useMemo} from "react";
import { useSubscriptionPlans, useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useMobile";
import { LoginDialog } from "@/components/widget/auth/LoginDialog";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const { plans, isLoading, error } = useSubscriptionPlans();
  const { subscription } = useSubscription();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const [api, setApi] = useState<CarouselApi>();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const initialIndex = useMemo(() => (plans && plans.length > 0) ? Math.floor(plans.length / 2) : 0, [plans]);
  const [current, setCurrent] = useState(initialIndex);

  const carouselOpts = useMemo(() => ({
    align: "center" as const,
    loop: true,
    startIndex: initialIndex,
  }), [initialIndex]);

  useEffect(() => {
    if (plans && plans.length > 0) {
        // eslint-disable-next-line
       setCurrent(initialIndex);
    }
  }, [plans, initialIndex]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const timeoutId = setTimeout(() => {
      api.scrollTo(initialIndex, true);
      setCurrent(initialIndex); 
    }, 50);

    const onSelect = () => {
      const rootNode = api.rootNode();
      const viewportCenter = rootNode.getBoundingClientRect().left + rootNode.offsetWidth / 2;
      
      const slides = api.slideNodes();
      let closestIndex = 0;
      let minDistance = Infinity;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const distance = Math.abs(viewportCenter - slideCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      
      setCurrent(closestIndex);
    };

    api.on("select", onSelect);
    api.on("scroll", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("scroll", onSelect);
      api.off("reInit", onSelect);
      clearTimeout(timeoutId);
    };
  }, [api, initialIndex]);

  if (isLoading) {
    return (
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="flex justify-center gap-8 max-w-5xl mx-auto">
             {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[500px] w-full md:w-1/3 rounded-3xl" />
             ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-red-500">
        Fatal Error: Failed to load subscription plans.
      </div>
    );
  }

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden" id="pricing">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-50 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Mở khóa sức mạnh AI
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
                Nâng cấp trải nghiệm học tập và sáng tạo với các công cụ AI tiên tiến.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-12">
          <Carousel
            setApi={setApi}
            opts={carouselOpts}
            className="w-full"
          >
            <CarouselContent className="-ml-4 items-center py-10">
              {plans?.map((plan, index) => {
                const isSelected = index === current;
                const isPopular = plan.price > 0 && plan.price < 500000;  
                const isRegistered = subscription?.subscriptionPlan?.code === plan.code;
                
                return (
                  <CarouselItem
                    key={plan.code}
                    className="pl-4 md:basis-1/3 lg:basis-1/3"
                  >
                    <div
                      className={cn(
                        "transition-all duration-500 ease-in-out transform",
                        isSelected
                          ? cn("z-10 opacity-100", isMobile ? "scale-100" : "scale-110")
                          : "scale-90 opacity-60 hover:opacity-100 blur-[1px] hover:blur-none"
                      )}
                    >
                      <Card
                        className={cn(
                          "h-full flex flex-col relative overflow-hidden border-2 rounded-xl transition-all duration-300",
                          isSelected
                            ? "shadow-xl ring-2 ring-primary/20 border-primary"
                            : "border border-gray-300 bg-background/50",
                          isPopular && isSelected ? "bg-primary/5" : ""
                        )}
                      >
                        {isPopular && (
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider">
                            Khuyến dùng
                          </div>
                        )}

                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-2xl font-bold">
                              {plan.name}
                            </span>
                             {(() => {
                                switch (plan.code?.toUpperCase()) {
                                  case "ULTRA":
                                    return <Crown className="w-6 h-6 text-purple-600" />;
                                  case "PRO":
                                    return <Gem className="w-6 h-6 text-purple-600" />;
                                  case "BASIC":
                                  case "STANDARD":
                                    return <Zap className="w-6 h-6 text-purple-600" />;
                                  default:
                                     // Fallback for Free/Other
                                    return plan.price === 0 ? (
                                      <Shield className="w-6 h-6 text-muted-foreground" />
                                    ) : (
                                       <Zap
                                        className={cn(
                                          "w-6 h-6",
                                          isPopular
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                        )}
                                      />
                                    );
                                }
                             })()}
                          </CardTitle>
                          <CardDescription className="text-base mt-2 min-h-[40px]">
                            {plan.description || "Gói dịch vụ cơ bản"}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-grow space-y-6">
                          <div className="flex items-baseline gap-1">
                              {plan.price === 0 ? (
                                <span className="text-4xl font-extrabold"> Miễn phí </span>
                              ) : (
                                <>
                                <span className="text-4xl font-extrabold">
                                  {plan.price}K                           
                                </span>
                                <span className="text-muted-foreground">
                                  /{plan.durationDays} ngày
                                </span>
                                </>
                              )}
                            </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "p-1 rounded-full",
                                  isPopular
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="text-sm">
                                {plan.totalRequestsInPeriod} lượt dùng AI
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "p-1 rounded-full",
                                  isPopular
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="text-sm">
                                Giới hạn {plan.maxRequestsPerWeek} lượt/tuần
                              </span>
                            </div>

                            {plan.includes && plan.includes.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "p-1 rounded-full",
                                    isPopular
                                      ? "bg-primary/20 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <Check className="w-4 h-4" />
                                </div>
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter className="pt-6">
                          <Button
                            className={cn(
                              "w-full h-12 text-base font-semibold rounded-xl transition-all",
                              isRegistered
                                ? "bg-gray-300 border-2 text-black cursor-not-allowed"
                                : isPopular
                                ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                            disabled={isRegistered}
                            onClick={() => {
                                if (!isAuthenticated) {
                                    setShowLoginDialog(true);
                                }
                            }}
                          >
                           {isRegistered
                              ? "Đã đăng ký"
                              : (plan.price === 0 ? "Bắt đầu miễn phí" : "Đăng ký ngay")}
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {!isMobile && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
          <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
        </div>
      </div>
    </section>
  );
}
