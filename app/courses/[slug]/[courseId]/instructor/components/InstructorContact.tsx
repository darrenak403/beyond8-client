'use client'

import { useState } from 'react'
import { Mail, Calendar, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InstructorPublicProfile } from '@/lib/api/services/fetchProfile'

interface InstructorContactProps {
  instructor?: InstructorPublicProfile
}

export default function InstructorContact({ instructor }: InstructorContactProps) {
  const [copiedEmail, setCopiedEmail] = useState(false)

  if (!instructor) return null

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(instructor.user.email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <div className="space-y-6 lg:sticky lg:top-40">
      {/* Video & Contact Info Combined */}
      <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl overflow-hidden">
        {/* Video Section */}
        {instructor.introVideoUrl && (
          <div className="relative">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800">
              <iframe
                src={instructor.introVideoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Contact Info Section */}
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-lg font-bold text-gray-900">Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Email with Copy Button */}
          <div className="p-3 rounded-xl bg-purple-50 border-2 border-purple-100">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-sm text-gray-700 font-medium truncate">
                  {instructor.user.email}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyEmail}
                className="h-8 w-8 p-0 hover:bg-purple-100 shrink-0"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-purple-600" />
                )}
              </Button>
            </div>
          </div>

          {/* Date of Birth */}
          {instructor.user.dateOfBirth && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gray-50 border-2 border-gray-100">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-medium">
                Sinh ngày: {new Date(instructor.user.dateOfBirth).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}

          {/* Last Updated */}
          {instructor.updatedAt && (
            <div className="flex items-center gap-2 text-sm pt-3 border-t-2 border-purple-100 p-3 rounded-xl">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-medium">
                Cập nhật lần cuối: {new Date(instructor.updatedAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
