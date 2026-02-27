'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CertificateHeader() {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-10 bg-white">
      <div className="container mx-auto px-4 py-3">
        <Button
          variant="ghost"
          onClick={() => router.push('/mybeyond/mycertificate')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
    </div>
  )
}
