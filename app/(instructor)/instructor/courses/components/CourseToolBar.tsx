'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  Plus,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface CourseToolBarProps {
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  isMobile: boolean
}

const categories = [
  { id: 'all', label: 'Tất cả', value: '' },
  { id: 'technology', label: 'Lập trình', value: 'Technology' },
  { id: 'design', label: 'Thiết kế', value: 'Design' },
  { id: 'marketing', label: 'Marketing', value: 'Marketing' },
  { id: 'language', label: 'Ngoại ngữ', value: 'Language' },
  { id: 'business', label: 'Kinh doanh', value: 'Business' },
  { id: 'photography', label: 'Nhiếp ảnh', value: 'Photography' },
  { id: 'music', label: 'Âm nhạc', value: 'Music' },
  { id: 'data-science', label: 'Khoa học dữ liệu', value: 'Data Science' },
  { id: 'health', label: 'Sức khỏe', value: 'Health' },
]

const getPlaceholderByCategory = (category: string) => {
  const placeholders: Record<string, string> = {
    '': 'Tìm kiếm khóa học...',
    'Technology': 'Tìm khóa học lập trình...',
    'Design': 'Tìm khóa học thiết kế...',
    'Marketing': 'Tìm khóa học marketing...',
    'Language': 'Tìm khóa học ngoại ngữ...',
    'Business': 'Tìm khóa học kinh doanh...',
    'Photography': 'Tìm khóa học nhiếp ảnh...',
    'Music': 'Tìm khóa học âm nhạc...',
    'Data Science': 'Tìm khóa học khoa học dữ liệu...',
    'Health': 'Tìm khóa học sức khỏe...',
  }
  return placeholders[category] || 'Tìm kiếm khóa học...'
}

export default function CourseToolBar({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  isMobile,
}: CourseToolBarProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get('category') || ''

  const handleCategoryChange = (categoryValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryValue) {
      params.set('category', categoryValue)
    } else {
      params.delete('category')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className={`flex flex-row items-center ${isMobile ? '' : 'justify-between'} `}>
      {/* Category Tabs */}
      <div className="w-[500px] mx-10 relative">
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 4,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {categories.map((category) => {
              const isActive = currentCategory === category.value
              return (
                <CarouselItem key={category.id} className="basis-1/4 pl-1">
                  <button
                    onClick={() => handleCategoryChange(category.value)}
                    className={`
                      relative w-full px-2 py-2 text-md font-medium whitespace-nowrap transition-colors cursor-pointer text-center
                      ${isActive
                        ? 'text-brand-magenta'
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <span className="relative z-10 inline-block">
                      {category.label}
                      {isActive && (
                        <motion.div
                          layoutId="category-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-magenta"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </span>
                  </button>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-9 h-8 w-8" />
          <CarouselNext className="hidden md:flex -right-9 h-8 w-8" />
        </Carousel>
      </div>
      {/* Search and Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className={`relative ${isMobile ? 'w-80' : 'w-100'}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={getPlaceholderByCategory(currentCategory)}
            className="pl-10 h-10 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* View Toggle */}
        {!isMobile && (
          <div className="flex items-center bg-white rounded-2xl border border-border h-10 gap-1 p-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`relative p-2 rounded-2xl transition-colors duration-200 ${viewMode === 'grid'
                ? 'text-white'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {viewMode === 'grid' && (
                <motion.div
                  layoutId="viewMode-active"
                  className="absolute inset-0 bg-brand-magenta rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                <LayoutGrid className="w-4 h-4" />
              </span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`relative p-2 rounded-2xl transition-colors duration-200 ${viewMode === 'list'
                ? 'text-white'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {viewMode === 'list' && (
                <motion.div
                  layoutId="viewMode-active"
                  className="absolute inset-0 bg-brand-magenta rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                <ListIcon className="w-4 h-4" />
              </span>
            </button>
          </div>
        )}

        {/* Filter Button */}
        <Button
          variant="outline"
          className="h-10 px-4 gap-2 border-border bg-white hover:bg-muted rounded-2xl hover:text-black"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {!isMobile && 'Bộ lọc'}
        </Button>
        <Link href="/instructor/courses/create">
          <Button
            variant="outline"
            className="h-10 px-4 gap-2 border-border bg-gray-100 hover:bg-gray-200 rounded-2xl hover:text-black"
          >
            <Plus className="w-4 h-4" />
            {!isMobile && 'Thêm khóa học'}
          </Button>
        </Link>
      </div>
    </div>
  )
}
