'use client'

import {Header} from '@/components/layout/Header'
import HeroSection from './components/HeroSection'
import CoursesSection from './components/courses/CoursesSection'
import {Footer} from '@/components/layout/Footer'
import { PricingSection } from './components/PricingSection'

export default function LandingPage() {
  return (
    <div className="bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />


      {/* Courses Section */}
      <CoursesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
