'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { CertificateDetail } from '@/lib/api/services/fetchCertificate'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'

interface CertificateActionsProps {
  certificate: CertificateDetail
}

export default function CertificateActions({ certificate }: CertificateActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    const element = document.getElementById('certificate-download-area')
    if (!element) {
      toast.error('Không tìm thấy chứng chỉ để tải xuống')
      return
    }

    try {
      setIsDownloading(true)
      // Sử dụng html-to-image thay vì html2canvas để tránh lỗi parse css color (đặc biệt lab(), oklch() trong Tailwind v4)
      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipFonts: false, // Ensure fonts load
        cacheBust: true,  // Important for Next.js image loading
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      })

      // Giữ nguyên aspect ratio = 1.414 / 1
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      // Khung hình chứng chỉ aspect ratio 1.414
      const pdfHeight = pdfWidth / 1.414

      // Canh giữa y nếu cần hoặc dính thẳng top (0, 0) vì canvas đã bao quanh vùng div
      // Lưu ý toPng trả về base64 dạng image/png thẳng luôn chuẩn luôn, không cần cast lại.
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Chung_chi_${certificate.studentName?.replace(/\s+/g, '_') || 'Beyond8'}.pdf`)
      toast.success('Đã tải chứng chỉ thành công!')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Có lỗi xảy ra khi tải chứng chỉ')
    } finally {
      setIsDownloading(false)
    }
  }

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
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="w-full bg-gradient-to-r from-brand-magenta/80 to-brand-purple/80 hover:from-brand-magenta hover:to-brand-purple text-white relative"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isDownloading ? 'Đang tải...' : 'Tải xuống PDF'}
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
