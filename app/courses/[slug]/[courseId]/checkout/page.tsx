"use client";

import { useParams, useRouter } from "next/navigation";
import OrderSummary from "./components/OrderSummary";
import CheckoutForm from "./components/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QrCode, ArrowLeft } from "lucide-react";
import { useGetCourseSummary, useGetCourseDetails } from "@/hooks/useCourse";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const slug = params?.slug as string;
  const { isAuthenticated } = useAuth();
  
  // Fetch course data from API (hooks must be called before early returns)
  const {
    courseSummary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetCourseSummary(courseId || "");

  const {
    courseDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useGetCourseDetails(courseId || "");

  // Check if params exist
  if (!courseId || !slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Khóa học không tồn tại</h1>
          <Button onClick={() => router.back()} className="mt-4">Quay lại</Button>
        </div>
      </div>
    );
  }

  const isLoading = isAuthenticated ? isLoadingDetails : isLoadingSummary;
  const isError = isAuthenticated ? isErrorDetails : isErrorSummary;
  const courseData = isAuthenticated ? courseDetails : courseSummary;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 w-full container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Khóa học không tồn tại</h1>
          <Button onClick={() => router.back()} className="mt-4">Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Form */}
            <div className="lg:col-span-8 space-y-8">
               <div className="p-6 md:p-8 rounded-lg border border-brand-magenta/20 shadow-xl shadow-brand-magenta/5 backdrop-blur-xl bg-white/80 dark:bg-black/80">
                  <div className="flex flex-row items-center justify-between gap-4 mb-4">
                     <Button
                        variant="ghost"
                        onClick={() => router.push(`/courses/${slug}/${courseId}`)}
                        className="flex items-center gap-2 text-brand-magenta hover:text-brand-magenta/80 hover:bg-transparent"
                     >
                        <ArrowLeft className="w-4 h-4 text-brand-magenta" />
                        <span>Quay lại</span>
                     </Button>
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-magenta/5 text-brand-magenta font-semibold text-sm border border-brand-magenta/10">
                        <QrCode className="w-4 h-4" />
                        <span>Cổng thanh toán VNPay</span>
                     </div>
                  </div>                  
                  <CheckoutForm slug={slug} courseId={courseId} />
               </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
               <OrderSummary course={{
                  title: courseData.title,
                  thumbnailUrl: courseData.thumbnailUrl || "",
                  price: courseData.price || 0,
                  rating: courseData.avgRating ? parseFloat(courseData.avgRating) : undefined
               } as { title: string; thumbnailUrl: string; price: number; rating?: number }} slug={slug} courseId={courseId} />
            </div>
         </div>
      </main>

      <Footer />
    </div>
  );
}
