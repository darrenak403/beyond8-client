import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FolderOpen, CheckCircle2, Clock, Loader2, Eye } from "lucide-react";
import { Course, CourseStatus } from "@/lib/api/services/fetchCourse";
import SafeImage from "@/components/ui/SafeImage";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { useApproveCourse, useRejectCourse } from "@/hooks/useCourse";

interface CourseListItemProps {
  course: Course;
  onPreview?: () => void;
}

export default function CourseListItem({ course, onPreview }: CourseListItemProps) {
  // Format currency
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(course.price);

  const formattedFinalPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(course.finalPrice);

  const isDiscounted = course.price > course.finalPrice;
  const discountDisplay = course.discountPercent
    ? `-${course.discountPercent}%`
    : course.discountAmount
      ? `-${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(course.discountAmount)}`
      : "";

  // Format duration from minutes to hours
  const formattedDuration = `${Math.floor(course.totalDurationMinutes / 60)} giờ`;

  const { approveCourse, isPending: isApproving } = useApproveCourse();
  const { rejectCourse, isPending: isRejecting } = useRejectCourse();

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await approveCourse({
      id: course.id,
      notes: null,
    });
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await rejectCourse({
      id: course.id,
      reason: "",
    });
  };

  // Status Badge Logic
  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.PendingApproval:
        return (
          <Badge className="bg-yellow-500/90 hover:bg-yellow-500 text-white border-0 backdrop-blur-sm text-xs h-5 px-1.5">
            Chờ duyệt
          </Badge>
        );
      case CourseStatus.Published:
        return (
          <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm text-xs h-5 px-1.5">
            Đang hoạt động
          </Badge>
        );
      case CourseStatus.Draft:
        return (
          <Badge className="bg-slate-500/90 hover:bg-slate-500 text-white border-0 backdrop-blur-sm text-xs h-5 px-1.5">
            Nháp
          </Badge>
        );
      case CourseStatus.Rejected:
        return (
          <Badge className="bg-red-500/90 hover:bg-red-500 text-white border-0 backdrop-blur-sm text-xs h-5 px-1.5">
            Đã từ chối
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs h-5 px-1.5">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div
      className="group flex bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 p-4 gap-5 cursor-pointer hover:-translate-y-0.5"
      onClick={onPreview}
    >
      {/* Image Section */}
      <div className="relative w-80 shrink-0 aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 shadow-md">
        <SafeImage
          src={formatImageUrl(course.thumbnailUrl) || ""}
          alt={course.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Overlay Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-2">{getStatusBadge(course.status)}</div>

        {/* Date/Time overlay */}
        <div className="absolute bottom-2.5 right-2.5">
          <Badge
            variant="secondary"
            className="backdrop-blur-lg bg-black/70 text-white border-0 text-xs h-6 px-2.5 font-medium shadow-lg"
          >
            {new Date(course.createdAt).toLocaleDateString("vi-VN")}
          </Badge>
        </div>

        {/* Preview Button - Bottom Left */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview?.();
          }}
          className="absolute bottom-2.5 left-2.5 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div className="space-y-2.5">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h3 className="font-bold text-2xl bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent leading-none">
                  {course.finalPrice === 0 ? "Miễn phí" : formattedFinalPrice}
                </h3>
                {isDiscounted && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {formattedPrice}
                    </span>
                    <span className="text-xs font-bold text-red-500">{discountDisplay}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 bg-gradient-to-br from-slate-100 to-slate-50 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200/50">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold">{formattedDuration}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className="text-xs font-medium text-slate-600 border-slate-300 bg-white shadow-sm"
              >
                <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
                {course.categoryName}
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/50 shadow-sm"
              >
                {course.level}
              </Badge>
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="font-semibold text-lg text-slate-800 group-hover:text-primary transition-colors leading-snug">
                {course.title}
              </h3>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                Người dạy:{" "}
                <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                  {course.instructorName}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
          {/* Stats removed */}
        </div>
      </div>

      {/* Action Section (Right) */}
      <div className="flex flex-col justify-center gap-2.5 shrink-0 w-auto pl-5 border-l border-slate-200/70 my-1">
        {course.status === CourseStatus.PendingApproval && (
          <>
            <Button
              variant="secondary"
              className="h-9 text-sm px-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 hover:text-black border border-emerald-200 shadow-sm hover:shadow-md transition-all"
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
            >
              {isApproving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Duyệt
            </Button>
            <Button
              variant="destructive"
              className="h-9 text-sm px-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 text-red-700 hover:from-red-100 hover:to-rose-100 hover:text-black border border-red-200 shadow-sm hover:shadow-md transition-all"
              onClick={handleReject}
              disabled={isApproving || isRejecting}
            >
              {isRejecting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Từ chối
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          className="h-9 text-sm px-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-primary border border-transparent hover:border-slate-200 transition-all shadow-sm"
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}
