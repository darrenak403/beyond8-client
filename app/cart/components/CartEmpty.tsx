'use client'

import { ShoppingCart, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartContext } from '../context/CartContext'
import { useGetCart, useClearCart } from '@/hooks/useOrder'
import { useAuth } from '@/hooks/useAuth'

export default function CartHeader() {
  const { isAuthenticated } = useAuth()
  const { cart } = useGetCart({ enabled: isAuthenticated })
  const { isAllSelected, selectAll } = useCartContext()
  const { clearCart, isPending: isClearing } = useClearCart()

  const handleClearCart = async () => {
    await clearCart()
  }

  return (
    <div className="relative flex-shrink-0 overflow-hidden border-b border-border bg-white p-4">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Giỏ hàng</h3>
            <p className="text-sm text-muted-foreground">
              {isAuthenticated && cart
                ? `${cart.totalItems} khóa học`
                : 'Chưa có khóa học'}
            </p>
          </div>
        </div>
      </div>
      {/* Select All and Clear All Buttons */}
      {isAuthenticated && cart && cart.items.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <label className="flex items-center gap-2 text-foreground hover:text-foreground transition-colors text-sm cursor-pointer">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={selectAll}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span>Chọn tất cả</span>
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            disabled={isClearing}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-auto py-1 px-2"
          >
            <Trash className="h-4 w-4 mr-1" />
            Xóa tất cả
          </Button>
        </div>
      )}
    </div>
  )
}
