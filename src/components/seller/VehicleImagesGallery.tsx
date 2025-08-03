'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface VehicleImage {
  id: number
  image_url: string
  is_primary: boolean | null
  display_order: number | null
  alt_text: string | null
}

interface VehicleImagesGalleryProps {
  images: VehicleImage[]
  vehicleName: string
}

export function VehicleImagesGallery({ images, vehicleName }: VehicleImagesGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Sort images by display_order, with primary image first
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    const aOrder = a.display_order ?? 0
    const bOrder = b.display_order ?? 0
    return aOrder - bOrder
  })

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === sortedImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? sortedImages.length - 1 : prev - 1
    )
  }

  if (sortedImages.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96 text-gray-500">
          No images available for this vehicle
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative">
          {/* Main Image */}
          <div className="relative h-96 w-full">
            <Image
              src={sortedImages[currentImageIndex].image_url}
              alt={sortedImages[currentImageIndex].alt_text || `${vehicleName} image ${currentImageIndex + 1}`}
              fill
              className="object-cover rounded-t-lg"
            />
            
            {/* Navigation Arrows */}
            {sortedImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {sortedImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {sortedImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {sortedImages.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 ${
                    index === currentImageIndex 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || `${vehicleName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
