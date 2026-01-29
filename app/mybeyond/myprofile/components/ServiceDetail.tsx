"use client";

import React from "react";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Zap,
  CheckCircle,
  AlertCircle,
  BarChart,
  Shield,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceDetail = () => {
  const { subscription, isLoading, error } = useSubscription();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-row items-center justify-between gap-4">
           <div className="space-y-2">
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-64" />
           </div>
           <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        
        <Skeleton className="h-[300px] w-full rounded-2xl" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[250px] rounded-2xl" />
          <Skeleton className="h-[250px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-xl border border-red-100">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700">Không thể tải thông tin dịch vụ</h3>
        <p className="text-red-500 mb-4">Vui lòng thử lại sau.</p>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
          Tải lại
        </Button>
      </div>
    );
  }

  const { subscriptionPlan, remainingRequests, isRequestLimitedReached, requestLimitedEndsAt } = subscription;
  const { name, totalRequestsInPeriod, maxRequestsPerWeek, durationDays, description } = subscriptionPlan;
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Plan Card */}
      <Card className="overflow-hidden border-2 rounded-2xl">        
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold uppercase tracking-wider ">
                Gói hiện tại
              </div>
              {subscriptionPlan.price == 0 ? (
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
                  Miễn phí
                </h1>
              ) : (
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
                  {name}
                </h1>
              )}
              <p className="text-lg text-muted-foreground max-w-md">
                {description || "Gói dịch vụ cao cấp giúp bạn mở khóa toàn bộ tiềm năng sáng tạo."}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-foreground/80 mt-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>Thời hạn: <span className="font-semibold">{durationDays} ngày</span></span>
              </div>
            </div>

            <div className="flex flex-col justify-center items-start md:items-end gap-3 min-w-[200px]">
               <Card className="w-full border-2 rounded-2xl">
                 <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hạn mức tuần</p>
                      <p className="text-xl font-bold">{maxRequestsPerWeek} <span className="text-xs font-normal text-muted-foreground">req</span></p>
                    </div>
                 </CardContent>
               </Card>

               <Card className="w-full border-2 rounded-2xl">
                 <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                      <BarChart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng kỳ này</p>
                      <p className="text-xl font-bold">{totalRequestsInPeriod} <span className="text-xs font-normal text-muted-foreground">req</span></p>
                    </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats / Usage Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 rounded-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-amber-500" />
              Sử dụng AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Số request còn lại</span>
                 <span className="font-bold text-foreground">{(maxRequestsPerWeek - remainingRequests) / maxRequestsPerWeek} /{remainingRequests} request</span>
               </div>
               <Progress value={((maxRequestsPerWeek - remainingRequests) / maxRequestsPerWeek) * 100} className="h-2 bg-muted transition-all" />
               <p className="text-xs text-muted-foreground">
                 {isRequestLimitedReached ? (
                    <span className="text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Đã đạt giới hạn. Mở lại vào: {requestLimitedEndsAt ? new Date(requestLimitedEndsAt).toLocaleString('vi-VN') : 'N/A'}
                    </span>
                 ) : (
                    "Bạn vẫn có thể tiếp tục sử dụng các tính năng AI."
                 )}
               </p>
             </div>
          </CardContent>
        </Card>

        <Card className="border-2 rounded-2xl transition-all duration-300">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-green-500" />
              Quyền lợi gói
             </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {subscriptionPlan.includes && subscriptionPlan.includes.length > 0 ? (
                subscriptionPlan.includes.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground italic">
                  Chưa có thông tin quyền lợi.
                </li>
              )}
            </ul>
            <div className="mt-6">
              <Button className="w-full bg-primary/80 text-primary-foreground hover:bg-primary rounded-2xl" variant="default">
                Nâng cấp gói
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceDetail;