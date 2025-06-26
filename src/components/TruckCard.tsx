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
    <Card className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/truck/${truck.id}`}>
        <div className="relative">
          <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
            <Image
              src={truck.image}
              alt={truck.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-[#FF385C] text-white hover:bg-[#E02748]">
                <Zap className="w-3 h-3 mr-1" />
                Electric
              </Badge>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsLiked(!isLiked)
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <Heart 
                className={`w-4 h-4 ${isLiked ? 'fill-[#FF385C] text-[#FF385C]' : 'text-gray-600'}`} 
              />
            </button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/truck/${truck.id}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-[#FF385C] transition-colors">
                {truck.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {truck.location}
              </div>
              <div className="text-xs text-gray-400">
                {truck.distance}
              </div>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 ml-1">
                {truck.rating}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                ({truck.reviews})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
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
              className="bg-[#FF385C] hover:bg-[#E02748] text-white"
            >
              Book Now
            </Button>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
