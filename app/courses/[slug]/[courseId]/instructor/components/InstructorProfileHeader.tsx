'use client'

import {
  Star,
  Users,
  PlayCircle,
  Globe,
  Linkedin,
  Facebook
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatNumber } from '@/lib/utils/formatCurrency'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { InstructorPublicProfile } from '@/lib/api/services/fetchProfile'
import SafeImage from '@/components/ui/SafeImage'
import { useIsMobile } from '@/hooks/useMobile'

interface InstructorProfileHeaderProps {
  instructor: InstructorPublicProfile
  courseCount: number
}

export default function InstructorProfileHeader({ instructor, courseCount }: InstructorProfileHeaderProps) {
  const isMobile = useIsMobile()

  return (
    <div className="overflow-hidden mx-auto max-w-7xl">
      {/* Banner */}
      <div
        className={`bg-gradient-to-r from-primary to-brand-purple relative rounded-2xl overflow-hidden ${
          isMobile ? "h-48" : "h-96"
        }`}
      >
        {/* Background image */}
        <SafeImage
          src="/bg-web.jpg"
          alt="Cover"
          width={1920}
          height={400}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div
        className={`${
          isMobile
            ? "flex flex-col items-center text-center px-4 pb-6"
            : "flex items-end justify-between px-8 pb-3"
        }`}
      >
        {/* Avatar & Name Section */}
        <div
          className={`${
            isMobile ? "flex flex-col items-center -mt-12" : "flex items-end gap-4 -mt-20"
          }`}
        >
          {/* Avatar with gradient border */}
          <div className="relative z-20">
            <div 
              className={`p-[4px] rounded-full ${isMobile ? "w-24 h-24" : "w-40 h-40"} flex items-center justify-center shadow-lg`}
              style={{ 
                background: 'conic-gradient(from 0deg, #a855f7 0% 50%, #ec4899 50% 100%)'
              }}
            >
              <Avatar className="w-full h-full border-4 border-white">
                <AvatarImage 
                  src={formatImageUrl(instructor.user.avatarUrl || '')} 
                  alt={instructor.user.fullName} 
                  className="object-cover" 
                />
                <AvatarFallback className="text-4xl bg-purple-100 text-purple-700 font-semibold">
                  {instructor.user.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Name & Email */}
          <div className={`${isMobile ? "mt-3 space-y-2 flex flex-col items-center" : "mb-4"}`}>
            <div className="flex items-center gap-2">
              <h2
                className={`font-bold ${
                  isMobile ? "text-xl" : "text-2xl"
                }`}
              >
                {instructor.user.fullName}
              </h2>
            </div>
            {instructor.headline && (
              <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? "text-sm" : "text-base"}`}>
                {instructor.headline}
              </p>
            )}
          </div>
        </div>

        {/* Social Links - Desktop only */}
        {!isMobile && (instructor.socialLinks?.website || instructor.socialLinks?.linkedIn || instructor.socialLinks?.facebook) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {instructor.socialLinks?.website && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl" 
                asChild
              >
                <a href={instructor.socialLinks.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" /> Website
                </a>
              </Button>
            )}
            {instructor.socialLinks?.linkedIn && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-[#0077b5] border-[#0077b5]/30 hover:bg-[#0077b5]/10 hover:text-[#0077b5] rounded-xl" 
                asChild
              >
                <a href={instructor.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                </a>
              </Button>
            )}
            {instructor.socialLinks?.facebook && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2]/10 hover:text-[#1877F2] rounded-xl" 
                asChild
              >
                <a href={instructor.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-4 h-4 mr-2" /> Facebook
                </a>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Social Links - Mobile */}
      {isMobile && (instructor.socialLinks?.website || instructor.socialLinks?.linkedIn || instructor.socialLinks?.facebook) && (
        <div className="px-4 pb-4 flex flex-wrap justify-center gap-2">
          {instructor.socialLinks?.website && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 rounded-xl" 
              asChild
            >
              <a href={instructor.socialLinks.website} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" /> Website
              </a>
            </Button>
          )}
          {instructor.socialLinks?.linkedIn && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-[#0077b5] border-[#0077b5]/30 hover:bg-[#0077b5]/10 hover:text-[#0077b5] rounded-xl" 
              asChild
            >
              <a href={instructor.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
              </a>
            </Button>
          )}
          {instructor.socialLinks?.facebook && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2]/10 hover:text-[#1877F2] rounded-xl" 
              asChild
            >
              <a href={instructor.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="w-4 h-4 mr-2" /> Facebook
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Stats Row */}
      <div className={`${isMobile ? "px-4" : "px-8"} pb-6`}>
        <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-8">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {instructor.avgRating || 5.0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Đánh giá</div>
            </div>
          </div>

          {/* Students */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(instructor.totalStudents || 0)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Học viên</div>
            </div>
          </div>

          {/* Courses */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <PlayCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {instructor.totalCourses || courseCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Khóa học</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
