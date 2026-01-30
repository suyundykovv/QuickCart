export interface Product {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  image: string
  category: string
  tags?: ('hit' | 'sale' | 'new')[]
  inStock: boolean
  storeId: string
}

export interface Store {
  id: string
  name: string
  description: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  freeDeliveryThreshold: number
  image: string
  coverImage: string
  workingHours: {
    open: string
    close: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  address: string
  categories: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  addresses: Address[]
}

export interface Address {
  id: string
  label: string
  street: string
  building: string
  apartment?: string
  coordinates: {
    lat: number
    lng: number
  }
  isDefault: boolean
}

export interface Order {
  id: string
  storeId: string
  storeName: string
  items: CartItem[]
  total: number
  deliveryFee: number
  subtotal: number
  address: Address
  deliveryTime: string
  status: 'pending' | 'confirmed' | 'preparing' | 'on_way' | 'delivered' | 'cancelled'
  createdAt: string
  estimatedDelivery: string
  courier?: {
    id: string
    name: string
    phone: string
    coordinates: {
      lat: number
      lng: number
    }
  }
}

export interface DeliverySlot {
  label: string
  value: string
  available: boolean
}
