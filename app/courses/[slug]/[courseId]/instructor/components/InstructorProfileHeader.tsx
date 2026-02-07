'use client'

import {
  Star,
  Users,
  PlayCircle,
  Globe,
  Linkedin,
  Facebook,
  Crown,
  Gem,
  Zap
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

  const getGradientStyle = (code?: string) => {
    switch (code?.toUpperCase()) {
      case "ULTRA": 
        return "conic-gradient(from 0deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)";
      case "PRO": 
        return "conic-gradient(from 0deg, #EA4335 0% 25%, #4285F4 25% 50%, #34A853 50% 75%, #FBBC05 75% 100%)";
      case "STANDARD":
      case "PLUS": 
        return "conic-gradient(from 0deg, #2563eb 0% 50%, #06b6d4 50% 100%)";
      default: 
        return "conic-gradient(from 0deg, #a855f7 0% 50%, #ec4899 50% 100%)";
    }
  };

  const getPlanIcon = (code?: string) => {
    switch (code?.toUpperCase()) {
      case "ULTRA":
        return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
      case "PRO":
        return <Gem className="w-5 h-5 text-blue-500 fill-blue-500" />;
      case "BASIC":
      case "PLUS":
        return <Zap className="w-5 h-5 text-purple-500 fill-purple-500" />;
      default:
        return null;
    }
  };

  const getPlanColor = (code?: string) => {
    switch (code?.toUpperCase()) {
      case "ULTRA":
        return {
          text: "text-yellow-600 dark:text-yellow-400",
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-300 dark:border-yellow-700",
        };
      case "PRO":
        return {
          text: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-300 dark:border-blue-700",
        };
      case "BASIC":
      case "PLUS":
      case "STANDARD":
        return {
          text: "text-purple-600 dark:text-purple-400",
          bg: "bg-purple-50 dark:bg-purple-900/20",
          border: "border-purple-300 dark:border-purple-700",
        };
      default:
        return {
          text: "text-gray-500 dark:text-gray-400",
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-gray-300 dark:border-gray-700",
        };
    }
  };

  const subscriptionCode = instructor.instructorSubscriptionPlan?.code
  const gradientStyle = getGradientStyle(subscriptionCode)
  const planIcon = getPlanIcon(subscriptionCode)
  const planColor = getPlanColor(subscriptionCode)

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
              className={`p-[4px] rounded-full ${isMobile ? "w-24 h-24" : "w-40 h-40"} flex items-center justify-center shadow-lg relative`}
              style={{ 
                background: gradientStyle
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
              {/* Plan Icon Badge */}
              {planIcon && (
                <div className="absolute top-1 -right-0 bg-white rounded-full p-1.5 shadow-md border-2 border-white">
                  {planIcon}
                </div>
              )}
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
                {subscriptionCode && (
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${planColor.text} ${planColor.bg} ${planColor.border}`}>
                    {subscriptionCode}
                  </div>
                )}
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
