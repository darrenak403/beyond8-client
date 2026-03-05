import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FolderOpen, CheckCircle2, Clock, Loader2, Eye, User, BookOpen, Calendar } from "lucide-react";
import { Course, CourseStatus } from "@/lib/api/services/fetchCourse";
import SafeImage from "@/components/ui/SafeImage";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { useApproveCourse, useRejectCourse } from "@/hooks/useCourse";

interface CourseListItemProps {
  course: Course & { rating?: number; studentCount?: number };
  onPreview?: () => void;
}

export default function CourseListItem({ course, onPreview }: CourseListItemProps) {
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

  const getStatusBadge = (status: CourseStatus) => {
    const statusConfig = {
      [CourseStatus.PendingApproval]: { bg: "bg-amber-100", text: "text-amber-700", label: "Chờ duyệt" },
      [CourseStatus.Published]: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Hoạt động" },
      [CourseStatus.Draft]: { bg: "bg-slate-100", text: "text-slate-700", label: "Nháp" },
      [CourseStatus.Rejected]: { bg: "bg-rose-100", text: "text-rose-700", label: "Từ chối" },
      [CourseStatus.Approved]: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Đã duyệt" },
      [CourseStatus.Archived]: { bg: "bg-slate-100", text: "text-slate-700", label: "Đã khóa" },
      [CourseStatus.Suspended]: { bg: "bg-amber-100", text: "text-amber-700", label: "Tạm ngưng" },
    };

    const config = statusConfig[status] || { bg: "bg-slate-100", text: "text-slate-700", label: status };

    return (
      <Badge variant="secondary" className={`${config.bg} ${config.text} border-0 font-medium px-2 py-0.5 pointer-events-none shadow-none hover:${config.bg}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div
      className="group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer p-4 gap-6"
      onClick={onPreview}
    >
      {/* Thumbnail Section */}
      <div className="relative w-full md:w-64 lg:w-72 shrink-0 aspect-video md:aspect-4/3 rounded-xl overflow-hidden bg-slate-100">
        <SafeImage
          src={formatImageUrl(course.thumbnailUrl) || ""}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

        <div className="absolute top-2 left-2 flex gap-2">{getStatusBadge(course.status)}</div>

        <div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <Badge variant="secondary" className="bg-black/60 text-white border-0 font-medium px-1.5 py-0.5 backdrop-blur-sm shadow-none text-[10px] flex gap-1 items-center">
            <BookOpen className="w-3 h-3" />
            {course.level === "Beginner" ? "Cơ bản" : course.level === "Intermediate" ? "Trung bình" : course.level === "Advanced" ? "Nâng cao" : course.level}
          </Badge>
          <Badge variant="secondary" className="bg-black/60 text-white border-0 font-medium px-1.5 py-0.5 backdrop-blur-sm shadow-none text-[10px] flex gap-1 items-center">
            <Clock className="w-3 h-3" />
            {course.totalDurationMinutes} phút
          </Badge>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview?.();
          }}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-primary z-10"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 py-1 gap-3 min-w-0">
        <h3 className="font-semibold text-xl text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors pr-4">
          {course.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-center flex-wrap gap-3 mt-1">
          <span className="font-bold text-2xl text-slate-900 leading-none">
            {course.finalPrice === 0 ? "Miễn phí" : formattedFinalPrice}
          </span>
          {isDiscounted && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 line-through font-medium">
                {formattedPrice}
              </span>
              <Badge variant="secondary" className="bg-rose-100 text-rose-700 border-0 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight">
                {discountDisplay}
              </Badge>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-auto flex items-center flex-wrap gap-4 text-sm text-slate-500 pt-3 border-t border-slate-100/70">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            <User className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-700">{course.instructorName}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4 text-slate-400" />
            {course.categoryName}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(course.createdAt).toLocaleDateString("vi-VN")}
          </div>
        </div>

        {/* Action Section or Stats (Bottom Right) */}
        {course.status === CourseStatus.PendingApproval ? (
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-9 text-slate-700 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-none"
              onClick={handleReject}
              disabled={isApproving || isRejecting}
            >
              {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Trash2 className="w-4 h-4 mr-1.5" />}
              Từ chối
            </Button>
            <Button
              className="w-full sm:w-auto h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-none transition-colors"
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
            >
              {isApproving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
              Phê duyệt
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-6 mt-4 pt-4 border-t border-slate-100 pointer-events-none">
            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <span className="font-semibold">{Number(course.rating || 5.0).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <User className="w-4 h-4" />
              <span>{course.studentCount || 0} học viên</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
