import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/lib/providers'
import { Toaster } from '@/components/ui/sonner'
import { Open_Sans, Quicksand } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-open-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const quicksand = Quicksand({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-quicksand',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Beyond8 - Nền Tảng Học Tập Trực Tuyến Với AI',
  description:
    'Beyond8 là nền tảng học tập trực tuyến ứng dụng AI, giúp học viên và giảng viên kết nối, quản lý khóa học, và cá nhân hóa trải nghiệm học tập một cách hiệu quả.',
  keywords: ['học trực tuyến', 'AI learning', 'khóa học online', 'Beyond8', 'học tập thông minh', 'giáo dục AI'],
  authors: [{ name: 'Beyond8 Team' }],
  creator: 'Beyond8',
  publisher: 'Beyond8',


  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://beyond8.io.vn',
    title: 'Beyond8 - Nền Tảng Học Tập Trực Tuyến Với AI',
    description:
      'Beyond8 là nền tảng học tập trực tuyến ứng dụng AI, giúp học viên và giảng viên kết nối, quản lý khóa học hiệu quả.',
    siteName: 'Beyond8',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Beyond8 - Nền Tảng Học Tập Trực Tuyến Với AI',
    description:
      'Beyond8 là nền tảng học tập trực tuyến ứng dụng AI, giúp học viên và giảng viên kết nối, quản lý khóa học hiệu quả.',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${openSans.variable} ${quicksand.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster position="bottom-center" expand={true} closeButton={true} />
      </body>
    </html>
  )
}
