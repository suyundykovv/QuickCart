"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Что-то пошло не так</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <Button onClick={reset}>Попробовать снова</Button>
      </div>
    </div>
  )
}
