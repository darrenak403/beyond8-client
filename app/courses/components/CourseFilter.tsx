'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebounce } from '@/hooks/useDebounce'
import { CourseFilterSheet } from '@/components/widget/CourseFilterSheet'
import { useIsMobile } from '@/hooks/useMobile'
import { useCategory } from '@/hooks/useCategory'
import { Category } from '@/lib/api/services/fetchCategory'

export default function CourseFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get('category') || ''
  const isMobile = useIsMobile()
  const { categories, isLoading: isLoadingCategories } = useCategory()

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(searchValue, 500)

  // Transform categories from API to the format expected by the component
  const categoriesList = useMemo(() => {
    const allOption = { id: 'all', label: 'Tất cả', value: '' }
    
    if (!categories?.data) {
      return [allOption]
    }

    const mappedCategories = categories.data.map((category: Category) => ({
      id: category.id,
      label: category.name,
      value: category.name,
    }))

    return [allOption, ...mappedCategories]
  }, [categories])

  // Sort State
  const sortBy = searchParams.get('sortBy') || 'createdDate'
  const isDescending = searchParams.get('isDescending') !== 'false'

  const currentSortValue = useMemo(() => {
    if (sortBy === 'price') {
      return isDescending ? 'price_desc' : 'price_asc'
    }
    return isDescending ? 'createdDate_desc' : 'createdDate_asc'
  }, [sortBy, isDescending])

  // Count active filters (excluding sort, pagination, search, and category)
  const activeFilterCount = useMemo(() => {
    let count = 0
    const level = searchParams.get('level')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minRating = searchParams.get('minRating')
    const language = searchParams.get('language')

    if (level && level !== 'all' && level !== 'All') count++
    if (minPrice && parseInt(minPrice) > 0) count++
    if (maxPrice && parseInt(maxPrice) < 5000000) count++
    if (minRating && minRating !== 'all') count++
    if (language && language !== '') count++

    return count
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    params.set('pageNumber', '1')

    // Only push if changed to avoid redundant navigation
    if (params.toString() !== searchParams.toString()) {
      router.push(`?${params.toString()}`)
    }
  }, [debouncedSearch, router, searchParams])

  // Sync internal state if URL changes externally (e.g. back button)
  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    if (currentSearch !== searchValue && currentSearch !== debouncedSearch) {
      setSearchValue(currentSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleCategoryChange = (categoryValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryValue) {
      params.set('category', categoryValue)
    } else {
      params.delete('category')
    }
    params.set('pageNumber', '1')
    router.push(`?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    switch (value) {
      case 'createdDate_desc': // Mới nhất
        params.set('sortBy', 'createdDate')
        params.set('isDescending', 'true')
        break
      case 'createdDate_asc': // Cũ nhất
        params.set('sortBy', 'createdDate')
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
        params.set('sortBy', 'createdDate')
        params.set('isDescending', 'true')
    }

    router.push(`?${params.toString()}`)
  }

  const getPlaceholder = (categoryValue: string) => {
    if (isMobile) return 'Tìm khóa học...'
    
    const selected = categoriesList.find((c) => c.value === categoryValue)
    return selected && selected.value !== ''
      ? `Tìm khóa học ${selected.label.toLowerCase()}...`
      : 'Tìm kiếm khóa học...'
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0 lg:justify-between w-full">
      {/* Category Tabs */}
      <div className="w-full lg:w-[500px] lg:mx-10 relative order-2 lg:order-1">
        <Carousel
          opts={{
            align: 'start',
            slidesToScroll: isMobile ? 2 : 4,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {isLoadingCategories ? (
              <CarouselItem className="basis-1/3 sm:basis-1/4 pl-1">
                <div className="w-full px-2 py-2 text-md text-muted-foreground text-center">
                  Đang tải...
                </div>
              </CarouselItem>
            ) : (
              categoriesList.map((category) => {
                const isActive = currentCategory === category.value
                return (
                  <CarouselItem key={category.id} className="basis-1/3 sm:basis-1/4 pl-1">
                    <button
                      onClick={() => handleCategoryChange(category.value)}
                      className={`
                        relative w-full px-2 py-2 text-md font-medium whitespace-nowrap transition-colors cursor-pointer text-center
                        ${
                          isActive
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
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </span>
                    </button>
                  </CarouselItem>
                )
              })
            )}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-9 h-8 w-8" />
          <CarouselNext className="hidden md:flex -right-9 h-8 w-8" />
        </Carousel>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto order-1 lg:order-2">
        {/* Search */}
        {/* Search */}
        {isMobile && (
          <div className="relative w-full sm:w-80 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={getPlaceholder(currentCategory)}
              className="pl-10 h-10 bg-white rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        )}

        {/* Sort & Filter Container */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Sort Select */}
          <div className="flex-1 sm:w-[180px]">
            <Select value={currentSortValue} onValueChange={handleSortChange}>
              <SelectTrigger className="h-10 rounded-2xl border-purple-200 bg-white focus:ring-purple-500 w-full">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdDate_desc">
                  <div className="flex items-center gap-2">
                    <ArrowDownWideNarrow className="w-4 h-4" />
                    <span>Mới nhất</span>
                  </div>
                </SelectItem>
                <SelectItem value="createdDate_asc">
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
        </div>
      </div>
    </div>
  )
}

