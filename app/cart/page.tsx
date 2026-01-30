"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/stores/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { mockProducts } from "@/lib/data/mock-data"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } =
    useCartStore()
  const router = useRouter()
  const { toast } = useToast()
  const [promoCode, setPromoCode] = useState("")
  const [reservationTimer, setReservationTimer] = useState(600) // 10 minutes in seconds

  const total = getTotal()
  const deliveryFee = 199
  const finalTotal = total + deliveryFee

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setReservationTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePromoApply = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      toast({
        title: "Промокод применен!",
        description: "Скидка 10% применена к заказу",
      })
    } else {
      toast({
        title: "Неверный промокод",
        description: "Проверьте правильность ввода",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте товары в корзину",
        variant: "destructive",
      })
      return
    }
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Корзина пуста</h1>
          <p className="text-gray-600 mb-6">
            Добавьте товары из магазинов, чтобы продолжить
          </p>
          <Button onClick={() => router.push("/map")}>
            Перейти к магазинам
          </Button>
        </div>
      </div>
    )
  }

  // Cross-sell products (products that go well with items in cart)
  const crossSellProducts = mockProducts
    .filter((p) => !items.some((item) => item.product.id === p.id))
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Корзина</h1>

        {/* Timer */}
        {reservationTimer > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Товары зарезервированы</p>
                <p className="text-lg font-semibold text-primary-600">
                  До окончания резерва: {formatTimer(reservationTimer)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                } else {
                                  removeItem(item.product.id)
                                }
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.product.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Promo Code */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Промокод"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handlePromoApply} variant="outline">
                Применить
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cross-sell */}
        {crossSellProducts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">С этим покупают</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {crossSellProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <Card className="sticky bottom-4">
          <CardContent className="p-6">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Товары</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Доставка</span>
                <span className="font-semibold">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Итого</span>
                <span className="text-primary-600">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
            >
              Оформить заказ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
