"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveCoupons } from "@/hooks/useCoupon";
import { CouponType } from "@/lib/api/services/fetchCoupon";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { differenceInSeconds } from "date-fns";
import gsap from "gsap";
import { Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";



export function CouponFloatingPanel() {
  const { coupons, isLoading, isError } = useActiveCoupons();
  const [now, setNow] = useState(() => new Date());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const totalWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const loopCoupons = useMemo(() => {
    if (!coupons.length) return [];
    return [...coupons, ...coupons];
  }, [coupons]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || coupons.length < 2) {
      tweenRef.current?.kill();
      tweenRef.current = null;
      totalWidthRef.current = 0;
      return;
    }

    const totalWidth = track.scrollWidth / 2;
    if (!totalWidth) return;

    totalWidthRef.current = totalWidth;

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: Math.max(totalWidth / 40, 12),
      ease: "none",
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [coupons]);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || !totalWidthRef.current) return;
    containerRef.current?.setPointerCapture(event.pointerId);
    isDraggingRef.current = true;
    startXRef.current = event.clientX;
    startOffsetRef.current = Number(gsap.getProperty(trackRef.current, "x")) || 0;
    tweenRef.current?.pause();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    event.preventDefault();
    const delta = event.clientX - startXRef.current;
    const totalWidth = totalWidthRef.current;
    let nextX = startOffsetRef.current + delta;

    if (totalWidth) {
      if (nextX <= -totalWidth) nextX += totalWidth;
      if (nextX > 0) nextX -= totalWidth;
    }

    gsap.set(trackRef.current, { x: nextX });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || !totalWidthRef.current) return;
    containerRef.current?.releasePointerCapture(event.pointerId);
    isDraggingRef.current = false;

    const currentX = Number(gsap.getProperty(trackRef.current, "x")) || 0;
    const progress = Math.min(
      Math.max(-currentX / totalWidthRef.current, 0),
      1
    );
    tweenRef.current?.progress(progress).play();
  };

  const getCountdown = (value?: string | null) => {
    if (!value) return null;
    const endDate = new Date(value);
    if (Number.isNaN(endDate.getTime())) return null;
    const secondsLeft = differenceInSeconds(endDate, now);
    if (secondsLeft <= 0) return { label: "Đã hết hạn", urgent: true };

    const days = Math.floor(secondsLeft / 86400);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    const padded = (n: number) => String(n).padStart(2, "0");
    return {
      label: `Còn ${days} ngày : ${padded(minutes)} phút : ${padded(seconds)} giây`,
      urgent: secondsLeft <= 3 * 24 * 3600,
    };
  };

  const handleSaveCoupon = async (code?: string | null) => {
    const safeCode = typeof code === "string" ? code.trim() : "";
    if (!safeCode) {
      toast.error("Không tìm thấy mã coupon để lưu.");
      return;
    }
    try {
      await navigator.clipboard.writeText(safeCode)
      toast.success(`Đã lưu mã ${safeCode} vào bộ nhớ tạm.`);
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(safeCode).catch(() => {
          toast.info("Không thể sao chép tự động, hãy sao chép thủ công.");
        });
      }
    } catch {
      toast.error("Không thể lưu mã vào bộ nhớ tạm.");
    }
  };

  return (
    <section >
      <div className="flex items-center">     
        <h3 className="text-3xl font-bold text-black">
            Các ưu đãi hấp dẫn
        </h3>     
      </div>

      {isLoading && (
        <div className="mt-4 overflow-hidden">
          <div className="flex w-max items-stretch gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="min-w-[280px] w-[280px] rounded-2xl border border-purple-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="mt-3 text-sm text-red-600">Không thể tải coupon.</div>
      )}

      {!isLoading && !isError && coupons.length === 0 && (
        <div className="mt-3 text-sm text-gray-500">Chưa có coupon.</div>
      )}

      {!isLoading && !isError && coupons.length > 0 && (
        <div
          ref={containerRef}
          className="relative mt-4 overflow-hidden select-none cursor-grab active:cursor-grabbing"
          onMouseEnter={() => tweenRef.current?.pause()}
          onMouseLeave={() => tweenRef.current?.play()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            ref={trackRef}
            className="flex w-max items-stretch gap-4"
          >
            {loopCoupons.map((coupon, index) => (
              <div
                key={`${coupon.id}-${index}`}
                className="relative min-w-[500px] w-[280px] rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 shadow-sm"
                onMouseEnter={() => setHoveredId(coupon.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-gradient-to-b from-purple-600 via-fuchsia-500 to-pink-500" />

                <AnimatePresence>
                  {hoveredId === coupon.id && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0.6 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0.6 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="absolute right-13 top-4 bottom-4 w-px bg-purple-200"
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {hoveredId === coupon.id && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.5, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.5, x: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-purple-600 text-white shadow cursor-pointer"
                      aria-label="Lưu mã coupon"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSaveCoupon(coupon.code);
                      }}
                      onPointerDown={(event) => event.stopPropagation()}
                    >
                      <Copy className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <motion.div
                  className="relative flex items-start justify-between gap-3 pl-2"
                  animate={{ paddingRight: hoveredId === coupon.id ? "2.5rem" : "0" }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {!coupon.isActive && (
                        <Badge className="bg-purple-600 text-white hover:bg-purple-600 text-[10px]">
                          Tạm dừng
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">
                      {coupon.code}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 line-clamp-2">
                      {coupon.description ?? "--"}
                    </div>
                  </div>
                    <div className="mr-2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 py-1 text-sm font-semibold text-white shadow">
                      {coupon.type === CouponType.Percentage ? `${coupon.value}%` : formatCurrency(coupon.value)}
                    </div>
                  </motion.div>

                <motion.div
                  className="relative mt-3 flex flex-col gap-1 text-xs text-slate-600 pl-2"
                  animate={{ paddingRight: hoveredId === coupon.id ? "2.5rem" : "0" }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-900">Tối thiểu:</span>{" "}
                      {formatCurrency(coupon.minOrderAmount || 0)}
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">Giảm tối đa:</span>{" "}
                      {coupon.maxDiscountAmount ? formatCurrency(coupon.maxDiscountAmount) : "Không giới hạn"}
                    </div>
                  </div>
                  <div>
                    {(() => {
                      const countdown = getCountdown(coupon.validTo);
                      if (!countdown) return null;
                      const badgeClass = countdown.urgent
                        ? "bg-red-50 text-red-700"
                        : "bg-purple-50 text-purple-700";
                      return (
                        <span
                          className={`inline-flex items-center rounded-full py-0.5 text-xs font-medium ${badgeClass}`}
                        >
                          {countdown.label}
                        </span>
                      );
                    })()}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
