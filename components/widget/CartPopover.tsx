'use client'

import { X, ShoppingCart, Trash2, Trash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetCart, useRemoveFromCart, useClearCart } from '@/hooks/useOrder'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useState, useMemo } from 'react'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import SafeImage from '../ui/SafeImage'

interface CartPopoverProps {
  isOpen: boolean
  onClose: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function CartPopover({ isOpen, onClose, onMouseEnter, onMouseLeave }: CartPopoverProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { cart, isLoading } = useGetCart({ enabled: isAuthenticated && isOpen })
  const { removeFromCart, isPending: isRemoving } = useRemoveFromCart()
  const { clearCart, isPending: isClearing } = useClearCart()
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)

  const handleRemoveItem = async (courseId: string) => {
    setRemovingItemId(courseId)
    try {
      await removeFromCart(courseId)
    } finally {
      setRemovingItemId(null)
    }
  }

  const handleClearCart = async () => {
    await clearCart()
  }

  const handleViewCart = () => {
    onClose()
    router.push('/cart')
  }

  const total = useMemo(() => {
    if (!cart) return 0
    if (typeof cart.subTotal === 'number') {
      return cart.subTotal
    }
    return cart.items.reduce((sum, item) => {
      const price = typeof item.finalPrice === 'number' ? item.finalPrice : item.originalPrice
      return sum + price
    }, 0)
  }, [cart])

  const originalTotal = cart
    ? (typeof cart.originalTotal === 'number'
        ? cart.originalTotal
        : cart.items.reduce((sum, item) => sum + item.originalPrice, 0))
    : 0

  const totalDiscount = cart
    ? (typeof cart.totalDiscount === 'number'
        ? cart.totalDiscount
        : Math.max(originalTotal - total, 0))
    : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute right-0 top-full mt-2 z-50 flex h-[600px] w-[420px] flex-col overflow-hidden rounded-2xl border-none bg-white shadow-2xl shadow-brand-magenta/20 backdrop-blur-xl dark:bg-black/95 origin-top-right"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Header */}
          <div className="relative flex-shrink-0 overflow-hidden border-b border-border bg-white p-4">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShoppingCart className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Giỏ hàng</h3>
                  <p className="text-xs text-muted-foreground">
                    {isAuthenticated && cart
                      ? `${cart.totalItems} khóa học`
                      : 'Chưa có khóa học'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Clear All Button */}
                {isAuthenticated && cart && cart.items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-auto py-1.5 px-2"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Xóa tất cả
                  </Button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {!isAuthenticated ? (
              // Not authenticated state
              <div className="flex flex-1 items-center justify-center p-8">
                <div className="text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">
                    Chưa có khóa học được thêm vào
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-2">
                    Vui lòng đăng nhập để xem giỏ hàng
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              // Loading state
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg border border-border">
                    <Skeleton className="h-20 w-32 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !cart || cart.items.length === 0 ? (
              // Empty cart state
              <div className="flex flex-1 items-center justify-center p-8">
                <div className="text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">
                    Chưa có khóa học được thêm vào
                  </p>
                </div>
              </div>
            ) : (
              // Cart items
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="relative flex p-3 rounded-lg border transition-colors bg-white dark:bg-black/50 border-border hover:border-brand-magenta/30"
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                    >
                      {/* Hover delete button on the left */}
                      <AnimatePresence>
                        {hoveredItemId === item.id && (
                          <motion.button
                            type="button"
                            initial={{ opacity: 0, scale: 0.5, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5, x: -10 }}
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 20,
                              duration: 0.2,
                            }}
                            onClick={() => handleRemoveItem(item.courseId)}
                            disabled={removingItemId === item.courseId || isRemoving}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 bg-white/80 dark:bg-black/80 shadow-sm cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {/* Content wrapper with slide animation when showing delete button */}
                      <motion.div
                        className="flex gap-3 flex-1"
                        animate={{
                          paddingLeft: hoveredItemId === item.id ? '2.5rem' : '0',
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 25,
                          duration: 0.2,
                        }}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-20 w-32 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          {item.courseThumbnail ? (
                            <SafeImage
                              src={formatImageUrl(item.courseThumbnail) || '/bg-web.jpg'}
                              alt={item.courseTitle}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-magenta/20 to-brand-purple/20">
                              <ShoppingCart className="h-8 w-8 text-brand-magenta/50" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-1 mb-1 text-foreground">
                            {item.courseTitle}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.instructorName}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-bold text-brand-magenta">
                                {formatCurrency(typeof item.finalPrice === 'number' ? item.finalPrice : item.originalPrice)}
                              </span>
                              {item.hasDiscount && (
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                                  <span className="line-through">
                                    {formatCurrency(item.originalPrice)}
                                  </span>
                                  {item.discountPercent !== null && item.discountPercent !== undefined && item.discountPercent > 0 && (
                                    <span className="text-red-500 font-semibold">
                                      -{item.discountPercent}%
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Footer */}
            {isAuthenticated && cart && cart.items.length > 0 && (
              <div className="border-t border-brand-magenta/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-4 space-y-3">
                {/* Totals */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(originalTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-red-500">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(totalDiscount)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-medium text-foreground">
                      Tổng cộng ({cart.items.length} khóa học):
                    </span>
                    <span className="text-lg font-bold text-brand-magenta">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  size="sm"
                  onClick={handleViewCart}
                  className="w-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white hover:opacity-90"
                >
                  Xem giỏ hàng
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
