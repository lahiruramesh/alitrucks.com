'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Star, MapPin, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Truck {
  id: number
  name: string
  image: string
  price: number
  rating: number
  reviews: number
  location: string
  distance: string
  features: string[]
}

interface TruckCardProps {
  truck: Truck
}

export default function TruckCard({ truck }: TruckCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link href={`/truck/${truck.id}`}>
        <div className="relative">
          <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
            <Image
              src={truck.image}
              alt={truck.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-500 text-white hover:bg-green-600 shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                Electric
              </Badge>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsLiked(!isLiked)
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-lg"
            >
              <Heart 
                className={`w-4 h-4 transition-all duration-200 ${
                  isLiked ? 'fill-green-500 text-green-500 scale-110' : 'text-gray-600'
                }`} 
              />
            </button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/truck/${truck.id}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-green-500 transition-colors truncate">
                {truck.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{truck.location}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {truck.distance}
              </div>
            </div>
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 ml-1">
                {truck.rating}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({truck.reviews})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {truck.features.slice(0, 2).map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {truck.features.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{truck.features.length - 2} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">
                ${truck.price}
              </span>
              <span className="text-sm text-gray-500"> /day</span>
            </div>
            <Button 
              size="sm" 
              className="bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Book Now
            </Button>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
