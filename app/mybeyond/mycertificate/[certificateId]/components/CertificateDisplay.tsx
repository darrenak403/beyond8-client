'use client'

import Image from 'next/image'
import { CertificateDetail } from '@/lib/api/services/fetchCertificate'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface CertificateDisplayProps {
  certificate: CertificateDetail
}

export default function CertificateDisplay({ certificate }: CertificateDisplayProps) {
  const formattedIssueDate = certificate.issuedDate
    ? format(new Date(certificate.issuedDate), 'dd/MM/yyyy', { locale: vi })
    : ''

  return (
    <div className="lg:col-span-2">
      <div id="certificate-download-area" className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg aspect-[1.414/1] select-none">
        {/* Background Certificate Image */}
        <Image
          src="/certificate.png"
          alt="Certificate Background"
          fill
          className="object-contain pointer-events-none"
          priority
        />

        {/* Overlay Data */}
        <div className="absolute inset-0 p-8 md:p-12 lg:p-16 select-none">
          {/* Top Section - Student Name */}
          <div className="absolute top-60 left-3/5 -translate-x-1/2 w-full text-center px-8 select-none">
            <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 select-none">
              {certificate.studentName}
            </h1>
            <p className="text-xs md:text-sm text-gray-600 select-none">
              đã hoàn thành xuất sắc khóa học
            </p>
          </div>

          {/* Center-Left Section - Course Title (Purple Area) */}
          <div className="absolute top-80 right-1/10 text-center select-none max-w-[60%]">
            <h2 className="text-xl md:text-1xl lg:text-2xl font-bold text-brand-purple leading-tight select-none wrap-break-word">
              {certificate.courseTitle}
            </h2>
          </div>

          {/* Bottom Section - Certificate Number & Date */}
          <div className="absolute bottom-[12%] left-[30%] grid grid-cols-2 gap-17 text-center justify-between select-none">
            {/* Certificate Number */}
            <div className="select-none">
              <p className="text-sm text-black font-bold mb-2 select-none">Mã chứng chỉ</p>
              <p className="text-[10px] font-mono text-gray-600 font-semibold select-none">
                {certificate.certificateNumber}
              </p>
            </div>

            {/* Issue Date */}
            <div className="select-none">
              <p className="text-xs text-black font-bold mb-2 select-none">Ngày cấp</p>
              <p className="text-[10px] font-mono font-semibold text-gray-900 select-none">
                {formattedIssueDate}
              </p>
            </div>
          </div>

          {/* Very Bottom - Instructor Name */}
          <div className="absolute bottom-[12%] right-1/10 -translate-x-1/2 text-center select-none">
            <p className="text-[10px] font-mono font-semibold text-gray-600 select-none">
              {certificate.instructorName}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
