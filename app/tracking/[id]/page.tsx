"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Phone, MessageCircle, Package, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatTime } from "@/lib/utils"

const MapboxMap = dynamic(() => import("@/components/mapbox-map"), {
  ssr: false,
})

const orderStatuses = [
  { id: "confirmed", label: "Подтвержден", icon: CheckCircle2 },
  { id: "preparing", label: "Готовится", icon: Package },
  { id: "on_way", label: "В пути", icon: Package },
  { id: "delivered", label: "Доставлен", icon: CheckCircle2 },
]

export default function TrackingPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [currentStatus, setCurrentStatus] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(8) // minutes
  const [courierPosition, setCourierPosition] = useState({
    lat: 51.1694,
    lng: 71.4491,
  })

  // Simulate order progress
  useEffect(() => {
    const interval = setInterval(() => {
      setEstimatedTime((prev) => {
        if (prev <= 1) {
          if (currentStatus < orderStatuses.length - 1) {
            setCurrentStatus((prev) => prev + 1)
            return 0
          }
          return 0
        }
        return prev - 1
      })
    }, 30000) // Update every 30 seconds

    // Simulate courier movement
    const courierInterval = setInterval(() => {
      setCourierPosition((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }))
    }, 5000)

    return () => {
      clearInterval(interval)
      clearInterval(courierInterval)
    }
  }, [currentStatus])

  const handleCallCourier = () => {
    window.location.href = "tel:+77001234567"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Отслеживание заказа</h1>
          <p className="text-sm text-gray-600">Заказ #{orderId}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Status Timeline */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {orderStatuses.map((status, index) => {
                const isActive = index <= currentStatus
                const isCurrent = index === currentStatus
                const Icon = status.icon

                return (
                  <div key={status.id} className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive
                          ? "bg-primary-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 pt-2">
                      <div
                        className={`font-semibold ${
                          isActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {status.label}
                      </div>
                      {isCurrent && (
                        <div className="text-sm text-gray-600 mt-1">
                          Ожидаемое время: {formatTime(estimatedTime)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="h-64 md:h-96 relative">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Карта с маршрутом курьера</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courier Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-1">Курьер: Иван</h3>
                <p className="text-sm text-gray-600">На автомобиле</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCallCourier}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-primary-700">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">
                  Доставка через {formatTime(estimatedTime)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat (Mock) */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Чат с курьером</h3>
            <div className="space-y-3 mb-4">
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">Здравствуйте! Я уже в пути к вам</p>
              </div>
              <div className="bg-primary-100 rounded-lg p-3 max-w-xs ml-auto">
                <p className="text-sm">Спасибо! Жду вас</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Написать сообщение..."
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <Button>Отправить</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
