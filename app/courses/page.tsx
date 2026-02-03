import type { Metadata } from 'next'
import CoursesPageClient from './CoursesPageClient'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { search?: string; category?: string }
}): Promise<Metadata> {
  const keyword = searchParams.search
  const category = searchParams.category

  const baseTitle = 'Khóa học online - Beyond8'

  const title = keyword
    ? `Khóa học về "${keyword}" - Beyond8`
    : category && category !== 'all'
      ? `Khóa học ${category} - Beyond8`
      : baseTitle

  return {
    title,
    description:
      'Khám phá các khóa học trực tuyến chất lượng cao trên Beyond8, ứng dụng AI để tối ưu trải nghiệm học tập.',
  }
}

export default function Page() {
  return <CoursesPageClient />
}

