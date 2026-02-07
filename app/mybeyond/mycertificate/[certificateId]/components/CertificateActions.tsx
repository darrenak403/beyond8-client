'use client'

import { Button } from '@/components/ui/button'
import { Download, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { CertificateDetail } from '@/lib/api/services/fetchCertificate'

interface CertificateActionsProps {
  certificate: CertificateDetail
}

export default function CertificateActions({ certificate }: CertificateActionsProps) {
  const handleCopyVerificationLink = () => {
    if (certificate?.verificationHash) {
      const verificationUrl = `${window.location.origin}/verify/${certificate.verificationHash}`
      navigator.clipboard.writeText(verificationUrl)
      toast.success('Đã sao chép link xác thực!')
    }
  }

  return (
    <div className="bg-white mx-auto max-w-md">
      
      <div className="space-y-3">
        <Button
          className="w-full bg-gradient-to-r from-brand-magenta/80 to-brand-purple/80 hover:from-brand-magenta hover:to-brand-purple text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Tải xuống PDF
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyVerificationLink}
          className="w-full"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Chia sẻ chứng chỉ
        </Button>
      </div>
    </div>
  )
}
