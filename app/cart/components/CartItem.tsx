'use client'

import { Trash2, Tag, Ticket, Edit }from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Checkbox }from '@/components/ui/checkbox'
import { Button }from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatImageUrl }from '@/lib/utils/formatImageUrl'
import { useCartContext } from '../context/CartContext'
import { useState }from 'react'
import { useRemoveFromCart, useCheckoutPreview }from '@/hooks/useOrder'
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
  const { previewCheckout}= useCheckoutPreview()
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState<string>(getInstructorCouponCode(item.courseId) || '')
  const [couponDialogOpen, setCouponDialogOpen] = useState(false)
  const [originalPrice, setOriginalPrice] = useState<number>(item.originalPrice)
  const [instructorDiscount, setInstructorDiscount] = useState<number>(0)
  const [finalPrice, setFinalPrice] = useState<number>(item.finalPrice)

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

  const handleApplyCoupon = async (code: string | null): Promise<boolean> => {
    try {
      if (code) {
        const response = await previewCheckout({
          items: [{
            courseId: item.courseId,
            instructorCouponCode: code,
          }],
          couponCode: null,
        })
        
        if (response?.data?.items?.[0]) {
          const itemData = response.data.items[0]
          setOriginalPrice(itemData.originalPrice)
          setInstructorDiscount(itemData.instructorDiscount)
          setFinalPrice(itemData.finalPrice)
        }
      } else {
        setOriginalPrice(item.originalPrice)
        setInstructorDiscount(0)
        setFinalPrice(item.finalPrice)
      }
      
      setCouponCode(code || '')
      setInstructorCouponCode(item.courseId, code || '')
      return true
    } catch (error) {
      console.error('Coupon validation error:', error)
      return false
    }
  }

  const displayPrice = finalPrice
  const originalDisplayPrice = instructorDiscount

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 p-3 rounded-lg border transition-colors bg-white relative overflow-hidden ${
        isSelected
          ? 'border-brand-magenta bg-brand-magenta/5'
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
            <h4 className="font-semibold text-base line-clamp-2 mb-1 text-foreground">
              {item.courseTitle}
            </h4>
            <p className="text-sm text-muted-foreground mb-2">{item.instructorName}</p>
            <div className="flex flex-row gap-3">
              <span className="font-bold text-lg text-brand-magenta">
                {formatCurrency(displayPrice)}
              </span>
              { instructorDiscount > 0 && (
                <span className="line-through text-sm text-muted-foreground">
                  {formatCurrency(originalDisplayPrice)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Coupon section */}
            {couponCode ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-brand-pink/30 bg-brand-pink/5 px-2 py-1">
                <Ticket className="h-3.5 w-3.5 text-brand-magenta" />
                <span className="text-sm font-medium text-brand-magenta">{couponCode}</span>
                <button
                  type="button"
                  onClick={() => setCouponDialogOpen(true)}
                  className="rounded-full p-0.5 text-brand-magenta/50 hover:bg-brand-pink/10 hover:text-brand-magenta transition-colors"
                  aria-label="Sửa mã giảm giá"
                >
                  <Edit className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-sm text-muted-foreground"
                onClick={() => setCouponDialogOpen(true)}
                disabled={!isSelected}
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
        currentCouponCode={couponCode}
      />
    </motion.div>
  )
}
