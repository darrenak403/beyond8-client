import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  LayoutGrid,
  LayoutList,
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
import { useDebounce } from '@/hooks/useDebounce'
import { useCategory } from '@/hooks/useCategory'
import { Skeleton } from '@/components/ui/skeleton'
import { CourseFilterSheet } from './CourseFilterSheet'

interface CourseToolBarProps {
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  isMobile: boolean
}



export default function CourseToolBar({
  viewMode,
  setViewMode,
  isMobile,
}: CourseToolBarProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get('categoryId') || ''

  const [searchValue, setSearchValue] = useState(searchParams.get('keyword') || '')
  const debouncedSearch = useDebounce(searchValue, 500)

  const { categories: categoryData, isLoading: isLoadingCategories } = useCategory()

  const categories = useMemo(() => {
    const apiCategories = categoryData?.data?.filter(c => c.isRoot).map(c => ({
      id: c.id,
      label: c.name,
      value: c.id // Using ID as the value for filtering
    })) || []

    return [
      { id: 'all', label: 'Tất cả', value: '' },
      ...apiCategories
    ]
  }, [categoryData])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) {
      params.set('keyword', debouncedSearch)
    } else {
      params.delete('keyword')
    }

    // Only push if changed to avoid redundant navigation
    if (params.toString() !== searchParams.toString()) {
      router.push(`?${params.toString()}`)
    }
  }, [debouncedSearch, router, searchParams])

  // Sync internal state if URL changes externally (e.g. back button)
  useEffect(() => {
    const currentKeyword = searchParams.get('keyword') || ''
    if (currentKeyword !== searchValue && currentKeyword !== debouncedSearch) {
      setSearchValue(currentKeyword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleCategoryChange = (categoryValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryValue) {
      params.set('categoryId', categoryValue)
    } else {
      params.delete('categoryId')
    }
    router.push(`?${params.toString()}`)
  }

  const getPlaceholder = (categoryId: string) => {
    const selected = categories.find(c => c.value === categoryId)
    return selected && selected.value !== '' ? `Tìm khóa học ${selected.label.toLowerCase()}...` : 'Tìm kiếm khóa học...'
  }

  return (
    <div className={`flex flex-row items-center ${isMobile ? '' : 'justify-between'} `}>
      {/* Category Tabs */}
      <div className="w-[500px] mx-10 relative">
        {isLoadingCategories ? (
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-10 w-24 rounded-md" />
            ))}
          </div>
        ) : (
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
        )}
      </div>
      {/* Search and Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className={`relative ${isMobile ? 'w-80' : 'w-100'}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={getPlaceholder(currentCategory)}
            className="pl-10 h-10 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* Filter Sheet */}
        <CourseFilterSheet />

        {/* View Toggle */}
        {!isMobile && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full p-0 flex items-center justify-center shrink-0"
            >
              {viewMode === 'list' ? (
                <LayoutGrid className="w-6 h-6 text-gray-700" />
              ) : (
                <LayoutList className="w-6 h-6 text-gray-700" />
              )}
            </Button>
          </motion.div>
        )}

        <Link href="/instructor/courses/create">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              className="bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              <Plus className="w-5 h-5 text-gray-700" /> Thêm khóa học
            </Button>
          </motion.div>
        </Link>
      </div>
    </div>
  )
}
