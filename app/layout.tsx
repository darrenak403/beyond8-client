import type {Metadata} from 'next'
import './globals.css'
import {Providers} from '@/lib/providers'
import {Toaster} from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Beyond 8 - Nền tảng khóa học trực tuyến',
  description: 'Modern ecommerce application with Next.js 16',
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
