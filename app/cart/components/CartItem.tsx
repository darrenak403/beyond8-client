'use client'

import { Trash2, Tag, Ticket, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { useCartContext } from '../context/CartContext'
import { useState } from 'react'
import { useRemoveFromCart } from '@/hooks/useOrder'
import SafeImage from '@/components/ui/SafeImage'
import CouponDialog from '@/components/widget/CouponDialog'

interface CartItemProps {
  item: {
    id: string
    courseId: string
    courseTitle: string
    courseThumbnail: string | null
    instructorName: string
    originalPrice: number
    finalPrice: number
    hasDiscount: boolean
    discountPercent: number | null
  }
}

export default function CartItem({ item }: CartItemProps) {
  const { selectedItems, toggleItem, setInstructorCouponCode, getInstructorCouponCode } = useCartContext()
  const { removeFromCart, isPending: isRemoving } = useRemoveFromCart()
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState<string>(getInstructorCouponCode(item.courseId) || '')
  const [couponDialogOpen, setCouponDialogOpen] = useState(false)

  const isSelected = selectedItems.has(item.courseId)
  const isHovered = hoveredItemId === item.id
  const showCheckbox = isHovered || isSelected

  const handleRemoveItem = async (courseId: string) => {
    setRemovingItemId(courseId)
    try {
      await removeFromCart(courseId)
    } finally {
      setRemovingItemId(null)
    }
  }

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code)
    setInstructorCouponCode(item.courseId, code)
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setInstructorCouponCode(item.courseId, '')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 p-3 rounded-lg border transition-colors bg-white dark:bg-black/50 relative overflow-hidden ${
        isSelected
          ? 'border-brand-magenta bg-brand-magenta/5 dark:bg-brand-magenta/10'
          : 'border-border hover:border-brand-magenta/30'
      }`}
      onMouseEnter={() => setHoveredItemId(item.id)}
      onMouseLeave={() => setHoveredItemId(null)}
    >
      <AnimatePresence>
        {showCheckbox && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -10 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              duration: 0.2,
            }}
            className="absolute left-3 top-3 z-10"
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleItem(item.courseId)}
              className="bg-white shadow-md border-2"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content wrapper with slide animation */}
      <motion.div
        className="flex gap-3 flex-1"
        animate={{
          paddingLeft: showCheckbox ? '2.5rem' : '0',
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
            <SafeImage
              src={formatImageUrl(item.courseThumbnail) || '/bg-web.jpg'}
              alt={item.courseTitle}
              fill
              className="object-cover"
            />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm line-clamp-2 mb-1 text-foreground">
              {item.courseTitle}
            </h4>
            <p className="text-xs text-muted-foreground mb-2">{item.instructorName}</p>
            <div className="flex flex-col">
              <span className="font-bold text-brand-magenta">
                {formatCurrency(typeof item.finalPrice === 'number' ? item.finalPrice : item.originalPrice)}
              </span>
              {item.hasDiscount && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
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
          
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Coupon section */}
            {couponCode ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-brand-pink/30 bg-brand-pink/5 dark:bg-brand-purple/10 px-2 py-1">
                <Ticket className="h-3.5 w-3.5 text-brand-magenta" />
                <span className="text-xs font-medium text-brand-magenta">{couponCode}</span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="rounded-full p-0.5 text-brand-magenta/50 hover:bg-brand-pink/10 hover:text-brand-magenta transition-colors"
                  aria-label="Xóa mã giảm giá"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground"
                onClick={() => setCouponDialogOpen(true)}
              >
                <Tag className="h-3.5 w-3.5" />
                Mã giảm giá
              </Button>
            )}

            {/* Trash Button */}
            <button
              onClick={() => handleRemoveItem(item.courseId)}
              disabled={removingItemId === item.courseId || isRemoving}
              className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Coupon Dialog - filtered by courseId */}
      <CouponDialog
        open={couponDialogOpen}
        onOpenChange={setCouponDialogOpen}
        onApply={handleApplyCoupon}
        filterByCourseId={item.courseId}
        strictCourseFilter
      />
    </motion.div>
  )
}
