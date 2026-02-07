'use client'

import React from 'react'
import { useGetCertificateById } from '@/hooks/useCertificate'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CertificateHeader from './components/CertificateHeader'
import CertificateDisplay from './components/CertificateDisplay'
import CertificateActions from './components/CertificateActions'
import CertificateInfo from './components/CertificateInfo'

interface CertificateDetailPageProps {
  params: Promise<{
    certificateId: string
  }>
}

export default function CertificateDetailPage({ params }: CertificateDetailPageProps) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = React.useState<{ certificateId: string } | null>(null)

  React.useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  const { certificate, isLoading, isError } = useGetCertificateById(resolvedParams?.certificateId)

  if (!resolvedParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Skeleton className="w-full max-w-6xl h-[800px] rounded-xl" />
      </div>
    )
  }

  if (isError || !certificate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold mb-2">Không tìm thấy chứng chỉ</h2>
        <p className="text-muted-foreground mb-4">Chứng chỉ không tồn tại hoặc đã bị xóa</p>
        <Button onClick={() => router.push('/mybeyond/mycertificate')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className="container min-h-screen mx-auto px-4 py-8">
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
      <CertificateHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CertificateDisplay certificate={certificate} />

          {/* Right: Action Buttons & Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <CertificateActions certificate={certificate} />
              <CertificateInfo certificate={certificate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
