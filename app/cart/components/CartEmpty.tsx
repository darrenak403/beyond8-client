'use client'

import { ShoppingCart } from 'lucide-react'

export default function CartEmpty() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground text-sm">Chưa có khóa học được thêm vào</p>
      </div>
    </div>
  )
}
