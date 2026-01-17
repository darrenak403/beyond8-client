export default function CoursesPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-lg p-6 hover:shadow-lg transition">
            <div className="h-40 bg-gray-200 rounded mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Course Title {i}</h3>
            <p className="text-gray-600 mb-4">Learn amazing things in this course</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">$99</span>
              <button className="px-4 py-2 bg-primary text-white rounded">
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
