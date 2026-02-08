'use client'

import { CartProvider } from './context/CartContext'
import CartHeader from './components/CartHeader'
import CartItem from './components/CartItem'
import CartEmpty from './components/CartEmpty'
import CartSummary from './components/CartSummary'
import OtherCoursesSection from './components/OtherCoursesSection'
import { useGetCart } from '@/hooks/useOrder'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageContent />
    </CartProvider>
  )
}

function CartPageContent() {
  const { isAuthenticated } = useAuth()
  const { cart, isLoading } = useGetCart({ enabled: isAuthenticated })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black/50 rounded-2xl border border-border overflow-hidden">
              <CartHeader />

              {/* Content */}
              <div className="flex flex-1 flex-col overflow-hidden">
                {!isAuthenticated ? (
                  <CartEmpty />
                ) : isLoading ? (
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
                  <CartEmpty />
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <AnimatePresence>
                      {cart.items.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>

      {/* Other Courses Section */}
      <OtherCoursesSection />

      <Footer />
    </div>
  )
}
