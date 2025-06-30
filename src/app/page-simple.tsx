import Navigation from '@/components/Navigation'

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
        </div>
      </div>

      {/* Simple Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Welcome to AliTrucks
        </h2>
        <p className="text-gray-600">
          Authentication system is working! Please sign in to access all features.
        </p>
      </div>
    </div>
  )
}
