// User Model
export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Product Model
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  rating?: number
  reviews?: number
  createdAt: string
  updatedAt: string
}

// Order Model
export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

