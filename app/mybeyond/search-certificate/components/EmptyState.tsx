'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'

export default function EmptyState() {
  return (
    <Card className='border-none'>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Bắt đầu tìm kiếm</h3>
        <p className="text-muted-foreground">
          Nhập mã hash chứng chỉ vào ô tìm kiếm ở trên để xác thực
        </p>
      </CardContent>
    </Card>
  )
}
