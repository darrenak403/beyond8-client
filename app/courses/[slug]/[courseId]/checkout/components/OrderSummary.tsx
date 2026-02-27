"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SafeImage from "@/components/ui/SafeImage";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { ShieldCheck, Lock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderSummaryProps {
  course: {
    title: string;
    thumbnailUrl: string;
    price: number;
    rating? : number;
  };
  slug: string;
  courseId: string;
}

export default function OrderSummary({ course, slug, courseId }: OrderSummaryProps) {
  const originalPrice = course.price * 1.5;
  const discount = originalPrice - course.price;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-brand-magenta/20 shadow-xl shadow-brand-magenta/5 backdrop-blur-xl bg-white/80 dark:bg-black/80">
        <div className="h-1.5 bg-gradient-to-r from-brand-magenta via-pink-500 to-orange-500" />
        <CardHeader className="pb-4">
           <div className="flex justify-between items-center">
             <CardTitle className="text-xl font-bold text-gray-900">Đơn hàng</CardTitle>
             <Badge variant="secondary" className="bg-brand-magenta/5 text-brand-magenta border-brand-magenta/10 hover:bg-brand-magenta/10">
                Course
             </Badge>
           </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Info */}
          <div className="group">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md mb-4 group-hover:shadow-lg transition-all duration-300">
              <SafeImage
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
               <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {course.rating || 5.0}
               </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base line-clamp-2 text-gray-900 leading-snug group-hover:text-brand-magenta transition-colors">
                {course.title}
              </h3>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 my-2" />

          {/* Pricing Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Giá gốc</span>
              <span className="line-through decoration-gray-400">{formatCurrency(originalPrice)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium bg-green-50 p-2 rounded-lg">
              <span>Giảm giá (33%)</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
            
            <div className="flex justify-between items-end pt-2">
              <span className="font-bold text-gray-900 text-lg">Tổng thanh toán</span>
              <div className="text-right">
                 <span className="block font-bold text-2xl bg-gradient-to-r from-brand-magenta to-pink-600 bg-clip-text text-transparent">
                   {formatCurrency(course.price)}
                 </span>
                 <span className="text-xs text-muted-foreground">(Đã bao gồm VAT)</span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-brand-magenta/5 rounded-xl p-4 space-y-3 border border-brand-magenta/10 shadow-inner">
             <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
                <div className="p-1.5 bg-white/50 rounded-full text-brand-magenta">
                   <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Hoàn tiền trong 30 ngày đảm bảo</span>
             </div>
             <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
                <div className="p-1.5 bg-white/50 rounded-full text-brand-magenta">
                   <Lock className="w-3.5 h-3.5" />
                </div>
                <span>Thanh toán an toàn & mã hóa SSL</span>
             </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Support Info */}
      <div className="text-center text-xs text-gray-400">
         Cần hỗ trợ? <a href="#" className="underline hover:text-purple-500">Liên hệ CSKH</a>
      </div>
    </div>
  );
}
