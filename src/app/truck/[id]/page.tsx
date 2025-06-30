import Navigation from '@/components/Navigation'
import TruckDetailGallery from '@/components/TruckDetailGallery'
import TruckDetails from '@/components/TruckDetails'
import BookingCard from '@/components/BookingCard'
import ReviewsSection from '@/components/ReviewsSection'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Zap, Shield, Award } from 'lucide-react'

// This would normally come from a database or API
const getTruckData = (id: string) => {
  const trucks = {
    '1': {
      id: 1,
      name: "Tesla Semi Electric Truck",
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/750/500",
        "/api/placeholder/700/550",
        "/api/placeholder/820/580",
        "/api/placeholder/780/520"
      ],
      price: 249,
      rating: 4.9,
      reviews: 128,
      location: "San Francisco, CA",
      distance: "2.3 miles away",
      features: ["Autopilot", "500 mile range", "Fast charging", "Enhanced Safety", "Megacharger compatible"],
      description: "Experience the future of freight transportation with the Tesla Semi. This revolutionary electric truck combines zero emissions with incredible performance, featuring Tesla's latest Autopilot technology and industry-leading safety features.",
      specifications: {
        range: "500 miles",
        acceleration: "0-60 mph in 20 seconds (fully loaded)",
        charging: "70% charge in 30 minutes",
        payload: "82,000 lbs GVWR",
        efficiency: "Less than 2 kWh per mile"
      },
      amenities: [
        "Climate control",
        "Advanced display system",
        "Comfortable seating",
        "Enhanced Autopilot",
        "Supercharger network access",
        "Real-time diagnostics"
      ],
      host: {
        name: "Tesla Fleet Services",
        rating: 4.9,
        responseTime: "within an hour",
        joinedDate: "2019"
      }
    },
    '2': {
      id: 2,
      name: "Rivian Electric Delivery Van",
      images: [
        "/api/placeholder/750/550",
        "/api/placeholder/680/480",
        "/api/placeholder/720/520",
        "/api/placeholder/760/540"
      ],
      price: 189,
      rating: 4.8,
      reviews: 95,
      location: "Oakland, CA",
      distance: "5.1 miles away",
      features: ["All-wheel drive", "400 mile range", "Cargo space", "Tank turn", "Air suspension"],
      description: "The Rivian Electric Delivery Van is perfect for urban logistics and last-mile delivery. With its spacious cargo area and advanced electric drivetrain, it offers the perfect balance of efficiency and functionality.",
      specifications: {
        range: "400 miles",
        cargo: "700 cubic feet",
        payload: "7,000 lbs",
        charging: "10-80% in 40 minutes",
        turning: "Tank turn capability"
      },
      amenities: [
        "Digital cockpit",
        "All-weather capability",
        "Advanced safety systems",
        "Fleet management integration",
        "Quiet operation",
        "Spacious cargo area"
      ],
      host: {
        name: "Rivian Commercial",
        rating: 4.8,
        responseTime: "within 2 hours",
        joinedDate: "2020"
      }
    }
  }
  
  return trucks[id as keyof typeof trucks] || trucks['1']
}

export default async function TruckDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const truck = getTruckData(id)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{truck.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium ml-1">{truck.rating}</span>
                <span className="text-gray-500 ml-1">({truck.reviews} reviews)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {truck.location}
              </div>
              <Badge className="bg-green-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Electric
              </Badge>
              <Badge variant="secondary">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <TruckDetailGallery images={truck.images} />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <TruckDetails truck={truck} />
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingCard truck={truck} />
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <ReviewsSection rating={truck.rating} reviews={truck.reviews} />
          </div>
        </div>
      </div>
    </div>
  )
}
