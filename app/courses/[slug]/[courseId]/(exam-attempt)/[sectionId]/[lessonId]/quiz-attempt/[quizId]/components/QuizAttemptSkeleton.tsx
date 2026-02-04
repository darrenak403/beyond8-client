import { Skeleton } from '@/components/ui/skeleton'

export function QuizAttemptSkeleton() {
  return (
    <div className="flex-1 flex relative">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="container px-4 py-8 w-full">
          {/* Progress Bar Skeleton */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Question Card Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>

            {/* Options */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Skeleton */}
          <div className="flex items-center justify-between mt-6">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="w-80 border-l bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Questions Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <Skeleton className="h-5 w-24 mb-3" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
