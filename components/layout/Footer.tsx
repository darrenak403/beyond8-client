import Link from 'next/link'
import Image from 'next/image'
import {Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Phone} from 'lucide-react'

const footerLinks = {
  platform: {
    title: 'Nền tảng',
    links: [
      {label: 'Khóa học', href: '/courses'},
      {label: 'Trở thành giảng viên', href: '/instructor/register'},
      {label: 'Bảng giá', href: '/pricing'},
      {label: 'Doanh nghiệp', href: '/enterprise'},
    ],
  },
  resources: {
    title: 'Tài nguyên',
    links: [
      {label: 'Trung tâm hỗ trợ', href: '/help'},
      {label: 'Blog', href: '/blog'},
      {label: 'Cộng đồng', href: '/community'},
      {label: 'Webinar', href: '/webinars'},
    ],
  },
  company: {
    title: 'Công ty',
    links: [
      {label: 'Về chúng tôi', href: '/about'},
      {label: 'Tuyển dụng', href: '/careers'},
      {label: 'Báo chí', href: '/press'},
      {label: 'Liên hệ', href: '/contact'},
    ],
  },
  legal: {
    title: 'Pháp lý',
    links: [
      {label: 'Điều khoản dịch vụ', href: '/terms'},
      {label: 'Chính sách bảo mật', href: '/privacy'},
      {label: 'Chính sách Cookie', href: '/cookies'},
      {label: 'Chính sách hoàn tiền', href: '/refund'},
    ],
  },
}

const socialLinks = [
  {icon: Facebook, href: '#', label: 'Facebook'},
  {icon: Twitter, href: '#', label: 'Twitter'},
  {icon: Linkedin, href: '#', label: 'LinkedIn'},
  {icon: Instagram, href: '#', label: 'Instagram'},
  {icon: Youtube, href: '#', label: 'YouTube'},
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/black-text-logo.svg"
                alt="Beyond 8"
                width={100}
                height={100}
                className="h-25 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/60 mb-6 max-w-sm">
              Beyond 8 là nền tảng học tập trực tuyến được hỗ trợ bởi AI, mang đến trải nghiệm giáo dục thông minh với đánh giá và phản hồi cá nhân hóa.
            </p>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@beyond8.edu</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>San Francisco, CA 94102</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Beyond 8. Bảo lưu mọi quyền.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
