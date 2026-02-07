'use client'

import { CertificateSummary } from '@/lib/api/services/fetchCertificate'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Eye, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

interface CertificateCardProps {
  certificate: CertificateSummary
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const formattedDate = format(new Date(certificate.issuedDate), 'dd/MM/yyyy', { locale: vi })

  const handleViewDetails = () => {
    router.push(`/mybeyond/mycertificate/${certificate.id}`)
  }

  const handleCopyHash = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(certificate.verificationHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-4 rounded-lg border border-gray-200",
        "bg-white hover:bg-purple-50 hover:border-purple-300",
        "transition-all duration-200 cursor-pointer"
        
      )}
      onClick={handleViewDetails}
    >
      {/* Left: Certificate Image */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-purple-200 bg-purple-50">
          {imageLoading && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <Image
            src="/ceritificate-loading.png"
            alt="Certificate"
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              imageLoading ? "opacity-0" : "opacity-100",
              "group-hover:scale-105 group-hover:rotate-2 transition-all duration-300",
              "p-2"
            )}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </div>
      </div>

      {/* Center: Main Content */}
      <div className="flex-1 min-w-0">
        {/* Course Title */}
        <h3 className="text-base font-semibold text-brand-purple line-clamp-1 mb-1">
          {certificate.courseTitle}
        </h3>

        {/* Certificate Info */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          {/* Certificate Number with Copy */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs">
              {certificate.verificationHash}
            </span>
            <button
              onClick={handleCopyHash}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Copy hash"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-gray-500" />
              )}
            </button>
          </div>

          {/* Divider */}
          <span className="text-gray-300">•</span>

          {/* Issued Date */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Right: Action Button */}
      <div className="flex-shrink-0">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            handleViewDetails()
          }}
          variant="ghost"
          size="sm"
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        >
          <Eye className="w-4 h-4 mr-1.5" />
          <span className="hidden sm:inline">Xem</span>
        </Button>
      </div>
    </div>
  )
}
