"use client"

import { useState, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Search, Filter, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { mockStores } from "@/lib/data/mock-data"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FloatingCart } from "@/components/floating-cart"

const MapboxMap = dynamic(() => import("@/components/mapbox-map"), {
  ssr: false,
})

export default function MapPage() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const router = useRouter()

  const filteredStores = mockStores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStoreClick = (storeId: string) => {
    setSelectedStore(storeId)
    setDrawerOpen(true)
  }

  const handleStoreSelect = (storeId: string) => {
    router.push(`/store/${storeId}`)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 md:left-auto md:right-4 md:w-96">
        <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск магазинов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map */}
      <MapboxMap
        stores={mockStores}
        selectedStore={selectedStore}
        onStoreClick={handleStoreClick}
      />

      {/* Store Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedStore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
              <div className="overflow-y-auto max-h-[calc(80vh-2rem)] px-4 pb-4">
                {filteredStores
                  .filter((s) => s.id === selectedStore)
                  .map((store) => (
                    <div key={store.id}>
                      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={store.coverImage}
                          alt={store.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h2 className="text-2xl font-bold mb-1">
                            {store.name}
                          </h2>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              ⭐ {store.rating} ({store.reviewCount}+)
                            </span>
                            <span>•</span>
                            <span>{store.deliveryTime}</span>
                            <span>•</span>
                            <span>{store.deliveryFee} ₸ доставка</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{store.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{store.address}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Время работы: {store.workingHours.open} -{" "}
                          {store.workingHours.close}
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => handleStoreSelect(store.id)}
                      >
                        Выбрать магазин
                      </Button>
                    </div>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Store List (when drawer closed) */}
      {!drawerOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl max-h-[40vh] overflow-hidden"
        >
          <div className="h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
          <div className="px-4 pb-4">
            <h3 className="font-semibold mb-3">Ближайшие магазины</h3>
            <div className="overflow-y-auto max-h-[calc(40vh-4rem)] space-y-3">
              {filteredStores.map((store) => (
                <Card
                  key={store.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleStoreClick(store.id)}
                >
                  <CardContent className="p-4 flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={store.image}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">{store.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <span>⭐ {store.rating}</span>
                        <span>•</span>
                        <span>{store.deliveryTime}</span>
                        <span>•</span>
                        <span>{store.deliveryFee} ₸</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {store.address}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <FloatingCart />
    </div>
  )
}
