'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Award, User, BookOpen } from 'lucide-react'
import { CertificateVerification } from '@/lib/api/services/fetchCertificate'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface CertificateVerificationCardProps {
  verification: CertificateVerification
}

export default function CertificateVerificationCard({
  verification,
}: CertificateVerificationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-purple" />
            Thông tin chứng chỉ
          </CardTitle>
          <Badge
            variant={verification.isValid ? "default" : "destructive"}
            className={verification.isValid ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
          >
            {verification.isValid ? "Hợp lệ" : "Không hợp lệ"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Status */}
        {!verification.isValid && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium mb-1">
              Chứng chỉ đã bị thu hồi
            </p>
            {verification.revocationReason && (
              <p className="text-xs text-red-600">
                Lý do: {verification.revocationReason}
              </p>
            )}
            {verification.revokedAt && (
              <p className="text-xs text-red-600 mt-1">
                Ngày thu hồi: {format(new Date(verification.revokedAt), 'dd/MM/yyyy', { locale: vi })}
              </p>
            )}
          </div>
        )}

        {/* Certificate Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Người học</span>
            </div>
            <p className="font-semibold text-base">{verification.studentName}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>Khóa học</span>
            </div>
            <p className="font-semibold text-base">{verification.courseTitle}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>Mã chứng chỉ</span>
            </div>
            <p className="font-mono font-semibold text-sm">{verification.certificateNumber}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Giảng viên</span>
            </div>
            <p className="font-semibold text-base">{verification.instructorName}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Ngày hoàn thành</span>
            </div>
            <p className="font-semibold text-sm">
              {verification.completionDate
                ? format(new Date(verification.completionDate), 'dd/MM/yyyy', { locale: vi })
                : '-'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Ngày cấp</span>
            </div>
            <p className="font-semibold text-sm">
              {verification.issuedDate
                ? format(new Date(verification.issuedDate), 'dd/MM/yyyy', { locale: vi })
                : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
