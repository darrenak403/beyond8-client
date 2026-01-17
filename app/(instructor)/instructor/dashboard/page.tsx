'use client'

export default function InstructorDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">My Courses</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold">456</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold">$12,345</p>
        </div>
      </div>
    </div>
  )
}
