import { Skeleton } from "@/components/ui/skeleton"

export default function CourseGridItemSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/40">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-[4/3]">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-7 w-1/2" /> {/* Price */}
            <Skeleton className="h-6 w-16" /> {/* Duration */}
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-1/3" /> {/* Level */}
            <Skeleton className="h-6 w-full" /> {/* Title Line 1 */}
            <Skeleton className="h-6 w-2/3" /> {/* Title Line 2 */}
          </div>
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto pt-2 flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
