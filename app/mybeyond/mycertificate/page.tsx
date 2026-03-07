"use client"

import { useGetMyCertificates } from '@/hooks/useCertificate'
import CertificateCard from './components/CertificateCard'
import CertificateGridSkeleton from './components/CertificateGridSkeleton'
import { Button } from '@/components/ui/button'
import { RefreshCw, Search } from 'lucide-react'
import Link from 'next/link'

export default function MyCertificatePage() {
  const { certificates, isLoading, isError, refetch } = useGetMyCertificates()

  return (
    <div className="container min-h-screen mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h1 className="text-3xl font-bold text-black">
            Chứng chỉ của tôi
          </h1>
          <Link href="/mybeyond/search-certificate">
            <Button variant="outline" className="flex items-center gap-2 rounded-full bg-brand-magenta text-white hover:bg-brand-magenta/80">
              <Search className="w-4 h-4" />
              Kiểm tra chứng chỉ
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground">
          Quản lý và xem các chứng chỉ hoàn thành khóa học của bạn
        </p>
      </div>

      {/* Loading State */}
      {isLoading && <CertificateGridSkeleton />}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2">Không thể tải chứng chỉ</h2>
          <p className="text-muted-foreground mb-4">
            Đã có lỗi xảy ra khi tải danh sách chứng chỉ
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && certificates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-2xl font-semibold mb-2">Chưa có chứng chỉ</h2>
          <p className="text-muted-foreground">
            Hoàn thành các khóa học để nhận chứng chỉ
          </p>
        </div>
      )}

      {/* Certificate List */}
      {!isLoading && !isError && certificates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
