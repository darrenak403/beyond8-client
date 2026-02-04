import type { Metadata } from 'next'
import LandingPage from './landing/LandingPage'

export const metadata: Metadata = {
  title: 'Beyond8 - Nền tảng học tập trực tuyến với AI',
  description:
    'Trang chủ Beyond8: khám phá khóa học, giảng viên và trải nghiệm học tập cá nhân hóa với AI.',
}

export default function Home() {
  return <LandingPage />
}
