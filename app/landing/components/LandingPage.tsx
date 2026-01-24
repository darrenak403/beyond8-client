'use client'

import {Header} from '@/components/layout/Header'
import HeroSection from './HeroSection'
import RecommendedCoursesSection from './RecommendedCoursesSection'
import CoursesSection from './courses/CoursesSection'
import {Footer} from '@/components/layout/Footer'

export default function LandingPage() {
  return (
    <div className="bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Recommended Courses Section */}
      <RecommendedCoursesSection />

      {/* Courses Section */}
      <CoursesSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
