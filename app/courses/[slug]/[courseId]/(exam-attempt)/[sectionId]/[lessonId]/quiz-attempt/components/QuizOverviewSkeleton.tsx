import { Skeleton } from '@/components/ui/skeleton'

export function QuizOverviewSkeleton() {
  return (
    <div className="container w-full mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <Skeleton className="h-12 w-12 rounded-lg mb-2" />
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white border border-gray-200">
                <Skeleton className="h-3 w-16 mx-auto mb-2" />
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            ))}
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
