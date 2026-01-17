export default function InstructorLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <h2 className="text-xl font-bold">Instructor Panel</h2>
      </header>
      <main>{children}</main>
    </div>
  )
}
