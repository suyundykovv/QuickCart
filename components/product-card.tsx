"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus } from "lucide-react"
import { useCartStore } from "@/lib/stores/cart-store"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem, removeItem, updateQuantity, getItem } = useCartStore()
  const cartItem = getItem(product.id)
  const quantity = cartItem?.quantity || 0
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAdd = () => {
    addItem(product, 1)
  }

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1)
    } else {
      removeItem(product.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.tags && product.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex gap-2">
              {product.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={tag === "hit" ? "hit" : tag === "sale" ? "sale" : "new"}
                  className="text-xs"
                >
                  {tag === "hit" ? "Хит" : tag === "sale" ? "Акция" : "Новинка"}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>
          {quantity === 0 ? (
            <Button
              onClick={handleAdd}
              className="w-full"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                className="h-9 w-9"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="flex-1 text-center font-semibold">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                className="h-9 w-9"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
