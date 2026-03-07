'use client'

import { createContext, useContext, useState, useMemo, useEffect, useRef, ReactNode } from 'react'
import { useGetCart } from '@/hooks/useOrder'

interface CartContextType {
  selectedItems: Set<string>
  setSelectedItems: (items: Set<string> | ((prev: Set<string>) => Set<string>)) => void
  toggleItem: (courseId: string) => void
  selectAll: () => void
  clearSelection: () => void
  isAllSelected: boolean
  selectedTotal: number
  instructorCouponCodes: Map<string, string>
  setInstructorCouponCode: (courseId: string, couponCode: string) => void
  getInstructorCouponCode: (courseId: string) => string | null
  systemCouponCode: string
  setSystemCouponCode: (couponCode: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function initializeSelectedItems(cart: { items: { courseId: string }[] } | null | undefined): Set<string> {
  if (!cart || cart.items.length === 0) {
    return new Set()
  }

  const saved = typeof window !== 'undefined' ? localStorage.getItem('cartSelectedItems') : null
  const savedArray = saved ? (JSON.parse(saved) as string[]) : []
  const cartCourseIds = new Set(cart.items.map(item => item.courseId))

  if (savedArray.length > 0) {
    const filtered = new Set<string>(
      savedArray.filter(id => typeof id === 'string' && cartCourseIds.has(id))
    )
    return filtered.size > 0 ? filtered : new Set(cartCourseIds)
  }

  return new Set(cartCourseIds)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { cart } = useGetCart({ enabled: true })
  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => initializeSelectedItems(cart))
  const [instructorCouponCodes, setInstructorCouponCodes] = useState<Map<string, string>>(new Map())
  const [systemCouponCode, setSystemCouponCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cartSystemCoupon') || ''
    }
    return ''
  })
  const prevCartItemsRef = useRef<string>('')

  // Sync selectedItems to localStorage
  useEffect(() => {
    if (selectedItems.size > 0) {
      localStorage.setItem('cartSelectedItems', JSON.stringify(Array.from(selectedItems)))
    } else {
      localStorage.removeItem('cartSelectedItems')
    }
  }, [selectedItems])

  // Sync systemCouponCode to localStorage
  useEffect(() => {
    if (systemCouponCode) {
      localStorage.setItem('cartSystemCoupon', systemCouponCode)
    } else {
      localStorage.removeItem('cartSystemCoupon')
    }
  }, [systemCouponCode])

  const cartItemsString = cart?.items.map(item => item.courseId).sort().join(',') || ''
  
  useEffect(() => {
    if (!cart) return

    const currentCartItems = cartItemsString
    
    if (prevCartItemsRef.current === currentCartItems) {
      return
    }

    prevCartItemsRef.current = currentCartItems

    const timeoutId = setTimeout(() => {
      if (cart.items.length > 0) {
        const cartCourseIds = new Set(cart.items.map(item => item.courseId))
        
        setSelectedItems(prev => {
          const hasInvalidItems = Array.from(prev).some(id => !cartCourseIds.has(id))
          const hasNewItems = cart.items.some(item => !prev.has(item.courseId))
          
          if (!hasInvalidItems && !hasNewItems) {
            return prev 
          }

          const saved = localStorage.getItem('cartSelectedItems')
          const savedArray = saved ? (JSON.parse(saved) as string[]) : []
          
          if (savedArray.length > 0) {
            const filtered = new Set<string>(
              savedArray.filter(id => typeof id === 'string' && cartCourseIds.has(id))
            )
            if (filtered.size > 0) {
              return filtered
            }
          }

          // Auto-select all new items
          const newSet = new Set(prev)
          cartCourseIds.forEach(courseId => {
            if (!prev.has(courseId)) {
              newSet.add(courseId)
            }
          })
          newSet.forEach(courseId => {
            if (!cartCourseIds.has(courseId)) {
              newSet.delete(courseId)
            }
          })
          return newSet
        })
      } else {
        setSelectedItems(new Set())
        localStorage.removeItem('cartSelectedItems')
      }
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [cart, cartItemsString])

  const toggleItem = (courseId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(courseId)) {
        newSet.delete(courseId)
      } else {
        newSet.add(courseId)
      }
      return newSet
    })
  }

  const selectAll = () => {
    if (!cart) return
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(cart.items.map(item => item.courseId)))
    }
  }

  const clearSelection = () => {
    setSelectedItems(new Set())
  }

  const isAllSelected = cart ? cart.items.length > 0 && selectedItems.size === cart.items.length : false

  const selectedTotal = useMemo(() => {
    if (!cart) return 0
    return cart.items
      .filter(item => selectedItems.has(item.courseId))
      .reduce((sum, item) => {
        const price = typeof item.finalPrice === 'number' ? item.finalPrice : item.originalPrice
        return sum + price
      }, 0)
  }, [cart, selectedItems])

  const setInstructorCouponCode = (courseId: string, couponCode: string) => {
    setInstructorCouponCodes(prev => {
      const newMap = new Map(prev)
      if (couponCode.trim() === '') {
        newMap.delete(courseId)
      } else {
        newMap.set(courseId, couponCode.trim())
      }
      return newMap
    })
  }

  const getInstructorCouponCode = (courseId: string): string | null => {
    return instructorCouponCodes.get(courseId) || null
  }

  return (
    <CartContext.Provider
      value={{
        selectedItems,
        setSelectedItems,
        toggleItem,
        selectAll,
        clearSelection,
        isAllSelected,
        selectedTotal,
        instructorCouponCodes,
        setInstructorCouponCode,
        getInstructorCouponCode,
        systemCouponCode,
        setSystemCouponCode,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}
