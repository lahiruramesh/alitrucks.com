'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Grid3X3, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface TruckDetailGalleryProps {
  images: string[]
}

export default function TruckDetailGallery({ images }: TruckDetailGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-96 rounded-xl overflow-hidden">
        {/* Main Image */}
        <div className="col-span-2 row-span-2 relative">
          <Image
            src={images[0]}
            alt="Main truck image"
            fill
            className="object-cover cursor-pointer hover:brightness-110 transition-all"
            onClick={() => setShowGallery(true)}
          />
        </div>

        {/* Smaller Images */}
        {images.slice(1, 5).map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image}
              alt={`Truck image ${index + 2}`}
              fill
              className="object-cover cursor-pointer hover:brightness-110 transition-all"
              onClick={() => setShowGallery(true)}
            />
            {index === 3 && images.length > 5 && (
              <div 
                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                onClick={() => setShowGallery(true)}
              >
                <div className="text-white text-center">
                  <Grid3X3 className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">+{images.length - 5} more</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Show all photos button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGallery(true)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm"
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          Show all photos
        </Button>
      </div>

      {/* Gallery Modal */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-black border-0">
          <div className="relative h-full bg-black rounded-lg overflow-hidden">
            <Image
              src={images[currentImageIndex]}
              alt={`Truck image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
            
            {/* Navigation */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-12 relative rounded overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
