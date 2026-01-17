export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </header>
      <main>{children}</main>
    </div>
  )
}
