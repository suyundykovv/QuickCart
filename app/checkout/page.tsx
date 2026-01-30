"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/stores/cart-store"
import { useUserStore } from "@/lib/stores/user-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check, MapPin, Clock, CreditCard } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { defaultAddresses } from "@/lib/data/mock-data"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51H..."
)

type Step = "address" | "delivery" | "payment" | "confirmation"

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("address")
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { toast } = useToast()

  const total = getTotal()
  const deliveryFee = 199
  const finalTotal = total + deliveryFee

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Оформление заказа</h1>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { id: "address", label: "Адрес", icon: MapPin },
                { id: "delivery", label: "Доставка", icon: Clock },
                { id: "payment", label: "Оплата", icon: CreditCard },
              ].map((s, index) => {
                const stepIndex = ["address", "delivery", "payment"].indexOf(
                  step
                )
                const isActive = stepIndex >= index
                const isCurrent = step === s.id

                return (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isActive
                            ? "bg-primary-600 border-primary-600 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        {isActive && !isCurrent ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <s.icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-sm ${
                          isActive ? "text-primary-600 font-semibold" : "text-gray-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          stepIndex > index ? "bg-primary-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2">
              <AnimatePresence mode="wait">
                {step === "address" && (
                  <AddressStep
                    key="address"
                    onNext={() => setStep("delivery")}
                  />
                )}
                {step === "delivery" && (
                  <DeliveryStep
                    key="delivery"
                    onNext={() => setStep("payment")}
                    onBack={() => setStep("address")}
                  />
                )}
                {step === "payment" && (
                  <PaymentStep
                    key="payment"
                    onNext={() => {
                      setStep("confirmation")
                      clearCart()
                      toast({
                        title: "Заказ оформлен!",
                        description: "Ваш заказ принят в обработку",
                      })
                    }}
                    onBack={() => setStep("delivery")}
                  />
                )}
                {step === "confirmation" && (
                  <ConfirmationStep key="confirmation" />
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Ваш заказ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span>{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Товары</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Доставка</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Итого</span>
                      <span className="text-primary-600">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  )
}

function AddressStep({ onNext }: { onNext: () => void }) {
  const { user, getDefaultAddress } = useUserStore()
  const [selectedAddress, setSelectedAddress] = useState(
    getDefaultAddress()?.id || ""
  )
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    street: "",
    building: "",
    apartment: "",
  })

  const addresses = user?.addresses.length
    ? user.addresses
    : defaultAddresses

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAddress || showNewAddress) {
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Адрес доставки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedAddress === addr.id
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  setSelectedAddress(addr.id)
                  setShowNewAddress(false)
                }}
              >
                <div className="font-semibold mb-1">{addr.label}</div>
                <div className="text-sm text-gray-600">
                  {addr.street}, {addr.building}
                  {addr.apartment && `, кв. ${addr.apartment}`}
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => {
              setShowNewAddress(true)
              setSelectedAddress("")
            }}
          >
            + Добавить новый адрес
          </Button>

          {showNewAddress && (
            <form
              onSubmit={handleSubmit}
              className="space-y-3 p-4 border rounded-lg"
            >
              <Input
                placeholder="Улица"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                required
              />
              <Input
                placeholder="Дом"
                value={newAddress.building}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, building: e.target.value })
                }
                required
              />
              <Input
                placeholder="Квартира (необязательно)"
                value={newAddress.apartment}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, apartment: e.target.value })
                }
              />
            </form>
          )}

          <Button
            className="w-full mt-4"
            onClick={handleSubmit}
            disabled={!selectedAddress && !showNewAddress}
          >
            Продолжить
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DeliveryStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const [deliveryTime, setDeliveryTime] = useState("now")
  const [contactPhone, setContactPhone] = useState("")

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Время доставки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Когда доставить?
              </label>
              <div className="space-y-2">
                {[
                  { value: "now", label: "Как можно скорее (5-10 мин)" },
                  { value: "30", label: "Через 30 минут" },
                  { value: "60", label: "Через 1 час" },
                  { value: "120", label: "Через 2 часа" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      deliveryTime === option.value
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setDeliveryTime(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Контактный телефон
              </label>
              <Input
                type="tel"
                placeholder="+7 700 123 4567"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onBack}>
                Назад
              </Button>
              <Button className="flex-1" onClick={onNext}>
                Продолжить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function PaymentStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)

    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setProcessing(false)
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Способ оплаты</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border rounded-lg">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onBack}
              >
                Назад
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!stripe || processing}
              >
                {processing ? "Обработка..." : "Оплатить"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ConfirmationStep() {
  const router = useRouter()
  const orderId = `ORD-${Date.now()}`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="h-10 w-10 text-primary-600" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Заказ оформлен!</h2>
      <p className="text-gray-600 mb-2">Номер заказа: {orderId}</p>
      <p className="text-gray-600 mb-8">
        Мы отправили подтверждение на ваш email
      </p>
      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => router.push("/map")}
        >
          Вернуться к магазинам
        </Button>
        <Button onClick={() => router.push(`/tracking/${orderId}`)}>
          Отследить заказ
        </Button>
      </div>
    </motion.div>
  )
}
