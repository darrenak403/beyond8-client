import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
    onRetry: () => void
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-red-50/50 rounded-xl border border-red-100">
            <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-800">Đã xảy ra lỗi</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Không thể tải danh sách khóa học ngay lúc này. Vui lòng thử lại sau.
                </p>
            </div>
            <Button
                onClick={onRetry}
                variant="outline"
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
                <RotateCcw className="w-4 h-4" />
                Thử lại
            </Button>
        </div>
    )
}
