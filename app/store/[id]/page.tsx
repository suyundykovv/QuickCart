"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, Star, Clock, Truck, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockStores, mockProducts } from "@/lib/data/mock-data"
import { ProductCard } from "@/components/product-card"
import { FloatingCart } from "@/components/floating-cart"
import { Skeleton } from "@/components/ui/skeleton"
import { useCartStore } from "@/lib/stores/cart-store"
import { formatPrice } from "@/lib/utils"

export default function StorePage() {
  const params = useParams()
  const router = useRouter()
  const storeId = params.id as string
  const store = mockStores.find((s) => s.id === storeId)
  const [selectedCategory, setSelectedCategory] = useState("Все")
  const [sortBy, setSortBy] = useState<"popular" | "price" | "new">("popular")
  const [sticky, setSticky] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const storeProducts = mockProducts.filter((p) => p.storeId === storeId)
  const { getTotal } = useCartStore()
  const cartTotal = getTotal()

  const categories = store?.categories || []
  const filteredProducts =
    selectedCategory === "Все"
      ? storeProducts
      : storeProducts.filter((p) => p.category === selectedCategory)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price
    if (sortBy === "new") {
      const aIsNew = a.tags?.includes("new") ? 1 : 0
      const bIsNew = b.tags?.includes("new") ? 1 : 0
      return bIsNew - aIsNew
    }
    // popular
    const aIsHit = a.tags?.includes("hit") ? 1 : 0
    const bIsHit = b.tags?.includes("hit") ? 1 : 0
    return bIsHit - aIsHit
  })

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        setSticky(rect.top <= 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Магазин не найден</h1>
          <Button onClick={() => router.push("/map")}>Вернуться к карте</Button>
        </div>
      </div>
    )
  }

  const freeDeliveryThreshold = store.freeDeliveryThreshold
  const remaining = Math.max(0, freeDeliveryThreshold - cartTotal)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={store.coverImage}
          alt={store.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {store.rating} ({store.reviewCount.toLocaleString()}+)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {store.workingHours.open} - {store.workingHours.close}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Truck className="h-4 w-4" />
              {store.deliveryTime}
            </span>
            <span>•</span>
            <span>{formatPrice(store.deliveryFee)} доставка</span>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <div
        ref={headerRef}
        className={`sticky top-0 z-20 bg-white border-b transition-shadow ${
          sticky ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <div className="flex gap-2">
              {(["popular", "price", "new"] as const).map((sort) => (
                <Button
                  key={sort}
                  variant={sortBy === sort ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(sort)}
                  className="text-xs"
                >
                  {sort === "popular"
                    ? "Популярное"
                    : sort === "price"
                    ? "По цене"
                    : "Новинки"}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Free Delivery Progress */}
      {cartTotal > 0 && remaining > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-20 left-4 right-4 z-40 bg-white rounded-lg shadow-lg p-4 border"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              До бесплатной доставки осталось
            </span>
            <span className="text-sm font-bold text-primary-600">
              {formatPrice(remaining)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(cartTotal / freeDeliveryThreshold) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      <FloatingCart />
    </div>
  )
}
