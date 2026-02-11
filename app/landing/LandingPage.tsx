'use client'

import {Header} from '@/components/layout/Header'
import HeroSection from './components/HeroSection'
import CoursesSection from './components/courses/CoursesSection'
import {Footer} from '@/components/layout/Footer'
import { PricingSection } from './components/PricingSection'
import FloatingActionButtons from './components/FloatingActionButtons'
import { CouponFloatingPanel } from '@/components/widget/coupon-floating'

export default function LandingPage() {
  return (
    <div className="bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />
      <div className='px-12 py-16 sm:px-16 lg:px-20 bg-muted/30'>
        {/* Coupon Floating Panel */}
        <CouponFloatingPanel />
      </div>
      
      {/* Courses Section */}
      <CoursesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons - Only on Landing Page */}
      <FloatingActionButtons />
    </div>
  )
}
