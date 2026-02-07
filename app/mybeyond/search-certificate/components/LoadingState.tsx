'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Award } from 'lucide-react'

export default function LoadingState() {
  return (
    <Card className='border-none'>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-purple" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Status Skeleton */}
        <Skeleton className="w-full h-20 rounded-lg" />
        
        {/* Certificate Details Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
