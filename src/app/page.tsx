import SearchBar from '@/components/SearchBar'
import TruckCard from '@/components/TruckCard'
import Navigation from '@/components/Navigation'

// Dummy truck data
const trucks = [
  {
    id: 1,
    name: "Tesla Semi Electric Truck",
    image: "/api/placeholder/400/300",
    price: 249,
    rating: 4.9,
    reviews: 128,
    location: "San Francisco, CA",
    distance: "2.3 miles away",
    features: ["Autopilot", "500 mile range", "Fast charging"]
  },
  {
    id: 2,
    name: "Rivian Electric Delivery Van",
    image: "/api/placeholder/350/250",
    price: 189,
    rating: 4.8,
    reviews: 95,
    location: "Oakland, CA",
    distance: "5.1 miles away",
    features: ["All-wheel drive", "400 mile range", "Cargo space"]
  },
  {
    id: 3,
    name: "Ford E-Transit Electric Van",
    image: "/api/placeholder/320/240",
    price: 179,
    rating: 4.7,
    reviews: 67,
    location: "San Jose, CA",
    distance: "8.2 miles away",
    features: ["Pro Power Onboard", "126 mile range", "Fleet ready"]
  },
  {
    id: 4,
    name: "Mercedes eSprinter",
    image: "/api/placeholder/380/280",
    price: 219,
    rating: 4.8,
    reviews: 84,
    location: "Palo Alto, CA",
    distance: "4.7 miles away",
    features: ["MBUX system", "273 mile range", "Premium interior"]
  },
  {
    id: 5,
    name: "Volvo FE Electric",
    image: "/api/placeholder/360/270",
    price: 199,
    rating: 4.6,
    reviews: 76,
    location: "Berkeley, CA",
    distance: "6.8 miles away",
    features: ["Quiet operation", "200 mile range", "Safety systems"]
  },
  {
    id: 6,
    name: "BYD T3 Electric Truck",
    image: "/api/placeholder/340/260",
    price: 159,
    rating: 4.5,
    reviews: 52,
    location: "Fremont, CA",
    distance: "9.2 miles away",
    features: ["Iron phosphate battery", "150 mile range", "Compact design"]
  },
  {
    id: 7,
    name: "Isuzu NPR-EV Electric",
    image: "/api/placeholder/420/320",
    price: 169,
    rating: 4.4,
    reviews: 43,
    location: "San Mateo, CA",
    distance: "7.5 miles away",
    features: ["Class 4 truck", "120 mile range", "Low maintenance"]
  },
  {
    id: 8,
    name: "Peterbilt 579EV",
    image: "/api/placeholder/390/290",
    price: 299,
    rating: 4.9,
    reviews: 67,
    location: "Santa Clara, CA",
    distance: "5.4 miles away",
    features: ["Long haul capable", "400 mile range", "Advanced telematics"]
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Rent Electric Trucks
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect electric truck for your business needs. Sustainable, efficient, and reliable.
            </p>
          </div>
          
          {/* Search Bar */}
          <SearchBar />
        </div>
      </div>

      {/* Trucks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Electric Trucks
          </h2>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50">
              Filters
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50">
              Sort
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
        </div>
      </div>
    </div>
  )
}
