import {Header} from '@/components/layout/header'

export const metadata = {
  title: 'Beyond 8 Learning - AI-Powered Learning Platform',
  description:
    'Nền tảng học tập thông minh với AI, cung cấp khóa học chất lượng cao và trải nghiệm học tập được cá nhân hóa.',
}

export default function StudentLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
    </div>
  )
}
