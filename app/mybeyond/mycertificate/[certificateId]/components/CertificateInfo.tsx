'use client'

import { CertificateDetail } from '@/lib/api/services/fetchCertificate'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface CertificateInfoProps {
  certificate: CertificateDetail
}

export default function CertificateInfo({ certificate }: CertificateInfoProps) {
  const formattedIssueDate = certificate.issuedDate 
    ? format(new Date(certificate.issuedDate), 'dd/MM/yyyy', { locale: vi })
    : ''

  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Thông tin chứng chỉ</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-gray-500 mb-1">Người học</p>
          <p className="font-semibold">{certificate.studentName}</p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Khóa học</p>
          <p className="font-semibold">{certificate.courseTitle}</p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Giảng viên</p>
          <p className="font-semibold">{certificate.instructorName}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <p className="text-gray-500 mb-1">Hoàn thành</p>
            <p className="font-semibold text-xs">
              {certificate.completionDate 
                ? format(new Date(certificate.completionDate), 'dd/MM/yy', { locale: vi })
                : '-'
              }
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Cấp ngày</p>
            <p className="font-semibold text-xs">{formattedIssueDate}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
