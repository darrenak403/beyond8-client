import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  LayoutGrid,
  LayoutList,
  Plus,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  TrendingUp,
  TrendingDown,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebounce } from '@/hooks/useDebounce'
import { useCategory } from '@/hooks/useCategory'
import { Skeleton } from '@/components/ui/skeleton'
import { CourseFilterSheet } from '@/components/widget/CourseFilterSheet'

interface CourseToolBarProps {
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
}



export default function CourseToolBar({
  viewMode,
  setViewMode,
}: CourseToolBarProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get('categoryName') || ''

  const [searchValue, setSearchValue] = useState(searchParams.get('keyword') || '')
  const debouncedSearch = useDebounce(searchValue, 500)

  // Sort State
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const isDescending = searchParams.get('isDescending') !== 'false'

  const currentSortValue = useMemo(() => {
    if (sortBy === 'price') {
      return isDescending ? 'price_desc' : 'price_asc'
    }
    return isDescending ? 'createdAt_desc' : 'createdAt_asc'
  }, [sortBy, isDescending])

  const { categories: categoryData, isLoading: isLoadingCategories } = useCategory()

  // Count active filters (excluding sort, pagination, keyword, and category)
  const activeFilterCount = useMemo(() => {
    let count = 0
    const level = searchParams.get('level')
    const status = searchParams.get('status')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minRating = searchParams.get('minRating')
    const language = searchParams.get('language')

    if (level && level !== 'All') count++
    if (status && status !== 'All') count++
    if (minPrice && parseInt(minPrice) > 0) count++
    if (maxPrice && parseInt(maxPrice) < 5000000) count++
    if (minRating && minRating !== 'all') count++
    if (language && language !== '') count++

    return count
  }, [searchParams])

  const categories = useMemo(() => {
    const apiCategories = categoryData?.data?.filter(c => c.isRoot).map(c => ({
      id: c.id,
      label: c.name,
      value: c.name // Using name as the value for filtering
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
      params.set('categoryName', categoryValue)
    } else {
      params.delete('categoryName')
    }
    router.push(`?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    switch (value) {
      case 'createdAt_desc': // Mới nhất
        params.set('sortBy', 'createdAt')
        params.set('isDescending', 'true')
        break
      case 'createdAt_asc': // Cũ nhất
        params.set('sortBy', 'createdAt')
        params.set('isDescending', 'false')
        break
      case 'price_desc': // Giá cao nhất
        params.set('sortBy', 'price')
        params.set('isDescending', 'true')
        break
      case 'price_asc': // Giá thấp nhất
        params.set('sortBy', 'price')
        params.set('isDescending', 'false')
        break
      default:
        params.set('sortBy', 'createdAt')
        params.set('isDescending', 'true')
    }

    router.push(`?${params.toString()}`)
  }

  const getPlaceholder = (categoryId: string) => {
    const selected = categories.find(c => c.value === categoryId)
    return selected && selected.value !== '' ? `Tìm khóa học ${selected.label.toLowerCase()}...` : 'Tìm kiếm khóa học...'
  }

  return (
    <div className={`flex flex-col lg:flex-row items-center gap-4 lg:gap-0 lg:justify-between w-full`}>
      {/* Category Tabs */}
      <div className="w-full lg:w-[500px] lg:mx-10 relative order-2 lg:order-1">
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
                  <CarouselItem key={category.id} className="basis-1/3 sm:basis-1/4 pl-1">
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
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto order-1 lg:order-2">
        {/* Search */}
        <div className={`relative w-full sm:w-80 lg:w-96`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={getPlaceholder(currentCategory)}
            className="pl-10 h-10 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* Sort & Filter Container */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Sort Select */}
          <div className="flex-1 sm:w-[180px]">
            <Select value={currentSortValue} onValueChange={handleSortChange}>
              <SelectTrigger className="h-10 rounded-2xl border-purple-200 bg-white focus:ring-purple-500 w-full">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">
                  <div className="flex items-center gap-2">
                    <ArrowDownWideNarrow className="w-4 h-4" />
                    <span>Mới nhất</span>
                  </div>
                </SelectItem>
                <SelectItem value="createdAt_asc">
                  <div className="flex items-center gap-2">
                    <ArrowUpWideNarrow className="w-4 h-4" />
                    <span>Cũ nhất</span>
                  </div>
                </SelectItem>
                <SelectItem value="price_desc">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    <span>Giá cao nhất</span>
                  </div>
                </SelectItem>
                <SelectItem value="price_asc">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Giá thấp nhất</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Sheet */}
          <CourseFilterSheet activeFilterCount={activeFilterCount} />

          {/* View Toggle (Hidden on Mobile/Tablet usually handled by parent but keeping as is for desktop) */}
          <div className="hidden lg:block">
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
          </div>

          <Link href="/instructor/courses/action" className="sm:ml-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className="bg-gray-100 hover:bg-gray-200 rounded-full px-3"
              >
                <Plus className="w-5 h-5 text-gray-700" /> <span className="hidden sm:inline ml-1">Thêm khóa học</span>
                <span className="sm:hidden">Thêm</span>
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}
