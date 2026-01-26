import { Skeleton } from "@/components/ui/skeleton"

export default function CourseListItemSkeleton() {
  return (
    <div className="flex bg-white rounded-xl overflow-hidden border border-border/40 p-3 gap-4">
      {/* Image Skeleton */}
      <div className="relative w-72 shrink-0 aspect-[16/9]">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-full">
            <div className="flex gap-3">
              <Skeleton className="h-7 w-1/4" /> {/* Price */}
              <Skeleton className="h-6 w-16" /> {/* Duration */}
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" /> {/* Category */}
              <Skeleton className="h-5 w-16" /> {/* Level */}
            </div>

            <div className="space-y-1 pt-1">
              <Skeleton className="h-6 w-3/4" /> {/* Title */}
              <Skeleton className="h-4 w-1/2" /> {/* Instructor */}
            </div>
          </div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="flex gap-6 mt-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>

      {/* Action Skeleton */}
      <div className="flex flex-col justify-center gap-2 shrink-0 w-auto pl-4 border-l border-border/50 my-1">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}
