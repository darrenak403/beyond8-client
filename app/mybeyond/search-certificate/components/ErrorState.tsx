'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { XCircle } from 'lucide-react'

interface ErrorStateProps {
  onReset: () => void
}

export default function ErrorState({ onReset }: ErrorStateProps) {
  return (
    <Card className='border-none'>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Không tìm thấy chứng chỉ</h3>
        <p className="text-muted-foreground mb-4">
          Mã hash không hợp lệ hoặc chứng chỉ không tồn tại
        </p>
        <Button variant="outline" onClick={onReset} className='border-none hover:bg-white hover:text-primary'>
          Thử lại
        </Button>
      </CardContent>
    </Card>
  )
}
