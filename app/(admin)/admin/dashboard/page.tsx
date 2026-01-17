'use client'

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
          <p className="text-3xl font-bold">56</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Instructors</h3>
          <p className="text-3xl font-bold">23</p>
        </div>
      </div>
    </div>
  )
}
