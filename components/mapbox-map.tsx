"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { motion } from "framer-motion"
import type { Store } from "@/lib/types"

interface MapboxMapProps {
  stores: Store[]
  selectedStore: string | null
  onStoreClick: (storeId: string) => void
}

export default function MapboxMap({
  stores,
  selectedStore,
  onStoreClick,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Initialize map
    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
      "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [71.4491, 51.1694], // Astana coordinates
      zoom: 13,
      pitch: 45,
      bearing: -17.6,
    })

    map.current.on("load", () => {
      setMapLoaded(true)

      // Add 3D buildings layer
      if (map.current) {
        map.current.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 14,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              14,
              0,
              15,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              14,
              0,
              15,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        })
      }
    })
  }, [])

  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add markers for each store
    stores.forEach((store) => {
      const el = document.createElement("div")
      el.className = "custom-marker"
      el.innerHTML = `
        <div class="marker-container ${selectedStore === store.id ? "selected" : ""}">
          <div class="marker-pulse"></div>
          <div class="marker-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="white"/>
              <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" fill="#10b981"/>
            </svg>
          </div>
        </div>
      `

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([store.coordinates.lng, store.coordinates.lat])
        .addTo(map.current!)

      el.addEventListener("click", () => {
        onStoreClick(store.id)
      })

      markersRef.current.push(marker)
    })
  }, [stores, mapLoaded, selectedStore, onStoreClick])

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      <style jsx global>{`
        .custom-marker {
          position: relative;
          cursor: pointer;
        }

        .marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-container.selected .marker-icon {
          transform: scale(1.2);
        }

        .marker-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.3);
          animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .marker-icon {
          position: relative;
          z-index: 1;
          transition: transform 0.2s;
        }

        .marker-container:hover .marker-icon {
          transform: scale(1.1);
        }
      `}</style>
    </>
  )
}
