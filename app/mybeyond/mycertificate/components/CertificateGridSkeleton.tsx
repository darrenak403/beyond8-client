import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CertificateGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="border-2 border-gray-200 bg-white/80">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="w-20 h-5 rounded-full" />
                </div>
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-3/4 h-6" />
              </div>
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Skeleton className="w-full h-16 rounded-lg" />
            <Skeleton className="w-2/3 h-4" />
            <Skeleton className="w-full h-10 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
