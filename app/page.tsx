"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuthModal } from "@/components/auth-modal"
import { useRouter } from "next/navigation"
import { ShoppingBag, Clock, MapPin, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-primary-600">QuickCart</span>
        </div>
        <Button onClick={() => setShowAuth(true)} variant="outline">
          Войти
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Доставка продуктов
            <br />
            <span className="text-primary-600">за 5-10 минут</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Гиперлокальная доставка свежих продуктов прямо к вашей двери в
            Астане
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => router.push("/map")}
            >
              Начать покупки
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => setShowAuth(true)}
            >
              Войти
            </Button>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Как это работает
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: MapPin,
              title: "Выберите магазин",
              description: "Найдите ближайший магазин на карте",
            },
            {
              icon: ShoppingBag,
              title: "Добавьте товары",
              description: "Выберите продукты из каталога",
            },
            {
              icon: Clock,
              title: "Получите заказ",
              description: "Доставка за 5-10 минут",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Почему QuickCart?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Молниеносная доставка за 5-10 минут",
              "Свежие продукты каждый день",
              "Бесплатная доставка от 5000 ₸",
              "Удобная оплата картой",
              "Отслеживание заказа в реальном времени",
              "Круглосуточная поддержка",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
                <span className="text-lg">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Готовы начать покупки?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к тысячам довольных клиентов
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
            onClick={() => router.push("/map")}
          >
            Перейти к карте
          </Button>
        </motion.div>
      </section>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
    </div>
  )
}
