import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold">Không tìm thấy khóa học</h1>
          <p className="text-muted-foreground">
            Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <div className="pt-4 space-y-2">
            <Button asChild className="w-full">
              <Link href="/courses">Xem tất cả khóa học</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
