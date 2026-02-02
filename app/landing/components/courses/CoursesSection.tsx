'use client'

import {useState, useEffect, useMemo} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import CourseCard from './CourseCard'
import { useCategory } from '@/hooks/useCategory'
import { useGetCourses } from '@/hooks/useCourse'
import { Skeleton } from '@/components/ui/skeleton'
import type { Course } from '@/lib/api/services/fetchCourse'
import type { Category } from '@/lib/api/services/fetchCategory'

export default function CoursesSection() {
  const { categories, isLoading: isLoadingCategories } = useCategory()

  // Get courses by category
  const categoryCourses = useMemo(() => {
    const categoriesList = categories?.data || []
    if (!categoriesList || categoriesList.length === 0) return []
    
    return categoriesList
      .filter((cat: Category) => cat.isRoot && cat.type)
      .slice(0, 5) // Limit to 5 categories
      .map((category: Category) => ({
        category,
        key: category.id
      }))
  }, [categories])

  return (
    <div className="py-16 bg-background">
      <div className="px-12 sm:px-16 lg:px-20 space-y-16">
        {/* Courses by Category */}
        {isLoadingCategories ? (
          <CourseCarouselSkeleton title="Các khóa học theo danh mục" />
        ) : (
          categoryCourses.map(({ category, key }) => (
            <CategoryCarousel key={key} category={category} />
          ))
        )}
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

  if (courses.length === 0) return null

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

function CategoryCarousel({ category }: { category: Category }) {
  const { courses, isLoading } = useGetCourses({
    categoryName: category.name,
    pageSize: 10,
    pageNumber: 1,
  })

  if (isLoading) {
    return <CourseCarouselSkeleton title={`Các khóa học về ${category.name}`} />
  }

  if (courses.length === 0) return null

  return <CourseCarousel title={`Các khóa học về ${category.name}`} courses={courses} />
}

function CourseCarouselSkeleton({ title }: { title: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      <div className="flex gap-6 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
            <Skeleton className="aspect-square rounded-2xl mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
          </div>
        ))}
      </div>
    </div>
  )
}
