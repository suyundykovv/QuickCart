"use client"

import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"

export function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <ShoppingBag className="h-12 w-12 text-primary-600" />
        </motion.div>
        <p className="mt-4 text-gray-600">Загрузка...</p>
      </motion.div>
    </div>
  )
}
