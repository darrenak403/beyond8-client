'use client'

import {useState, useEffect} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import CourseCard from './CourseCard'
import {
  topRatedCourses,
  newCourses,
  languageCourses,
  technologyCourses,
  aiCourses,
  designCourses,
  marketingCourses,
  type Course,
} from '@/lib/data/mockCourses'

export default function CoursesSection() {
  return (
    <div className="py-16 bg-background">
      <div className="px-12 sm:px-16 lg:px-20 space-y-16">
        {/* Top Rated Courses */}
        <CourseCarousel title="Các khóa học được đánh giá cao" courses={topRatedCourses} />

        {/* New Courses */}
        <CourseCarousel title="Các khóa học mới ra mắt" courses={newCourses} />

        {/* Language Courses */}
        <CourseCarousel title="Các khóa học về ngôn ngữ" courses={languageCourses} />

        {/* Technology Courses */}
        <CourseCarousel title="Các khóa học về công nghệ" courses={technologyCourses} />

        {/* AI Courses */}
        <CourseCarousel title="Các khóa học về AI" courses={aiCourses} />

        {/* Design Courses */}
        <CourseCarousel title="Các khóa học về Design" courses={designCourses} />

        {/* Marketing Courses */}
        <CourseCarousel title="Các khóa học về Marketing" courses={marketingCourses} />
      </div>
    </div>
  )
}

function CourseCarousel({title, courses}: {title: string; courses: Course[]}) {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) return

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    updateScrollState()
    api.on('select', updateScrollState)
    api.on('reInit', updateScrollState)

    return () => {
      api.off('select', updateScrollState)
      api.off('reInit', updateScrollState)
    }
  }, [api])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            className="rounded-full cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            className="rounded-full cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-6">
          {courses.map((course) => (
            <CarouselItem
              key={course.id}
              className="pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <CourseCard course={course} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
