"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/stores/cart-store"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function FloatingCart() {
  const { items, getTotal, getItemCount } = useCartStore()
  const router = useRouter()
  const total = getTotal()
  const itemCount = getItemCount()

  if (itemCount === 0) return null

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <ShoppingCart className="h-6 w-6 text-primary-600" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">Итого</p>
            <p className="text-lg font-bold text-primary-600">
              {formatPrice(total)}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push("/cart")} size="lg">
          Перейти в корзину
        </Button>
      </div>
    </motion.div>
  )
}
