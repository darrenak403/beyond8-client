import Link from 'next/link'

export default function QuizAttemptFooter() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mx-auto text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Beyond 8. Bảo lưu mọi quyền.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-foreground transition-colors">
              Trợ giúp
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Điều khoản
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
