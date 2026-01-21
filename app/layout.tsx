import type {Metadata} from 'next'
import './globals.css'
import {Providers} from '@/lib/providers'
import {Toaster} from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Beyond8 - Learning AI Platform',
  description:
    'Beyond8 là nền tảng học tập trực tuyến ứng dụng AI, giúp học viên và giảng viên kết nối, quản lý khóa học, và cá nhân hóa trải nghiệm học tập.',
  icons: {
    icon: '/icon-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
        <Toaster position="bottom-center" expand={true} closeButton={true} />
      </body>
    </html>
  )
}
