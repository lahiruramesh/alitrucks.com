import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, User } from 'lucide-react'

interface ReviewsSectionProps {
  rating: number
  reviews: number
}

// Mock review data
const mockReviews = [
  {
    id: 1,
    user: 'Sarah M.',
    date: 'March 2024',
    rating: 5,
    comment: 'Excellent electric truck! Very reliable for our delivery routes. The range was exactly as advertised and the charging was super convenient.',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 2,
    user: 'Mike R.',
    date: 'February 2024',
    rating: 5,
    comment: 'Outstanding service and the truck was in perfect condition. The owner was very responsive and helpful throughout the rental period.',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 3,
    user: 'Jennifer L.',
    date: 'February 2024',
    rating: 4,
    comment: 'Great truck for our business needs. Only minor issue was with the charging setup initially, but the owner helped resolve it quickly.',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 4,
    user: 'David K.',
    date: 'January 2024',
    rating: 5,
    comment: 'Perfect for our logistics company. The autopilot features made long hauls much safer and more efficient. Highly recommend!',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 5,
    user: 'Lisa T.',
    date: 'January 2024',
    rating: 5,
    comment: 'Amazing experience! The truck exceeded our expectations. Clean, efficient, and the owner provided excellent support.',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 6,
    user: 'Carlos S.',
    date: 'December 2023',
    rating: 4,
    comment: 'Very satisfied with the rental. The electric drivetrain saved us a lot on fuel costs. Will definitely rent again.',
    avatar: '/api/placeholder/40/40'
  }
]

export default function ReviewsSection({ rating, reviews }: ReviewsSectionProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center gap-2">
        <Star className="w-6 h-6 text-yellow-400 fill-current" />
        <h2 className="text-2xl font-bold">
          {rating} · {reviews} reviews
        </h2>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockReviews.slice(0, 6).map((review) => (
          <Card key={review.id} className="border-none shadow-none">
            <CardContent className="p-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF385C] to-[#E02748] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{review.user}</h4>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show All Reviews Button */}
      <div className="text-center pt-4">
        <Button variant="outline" size="lg">
          Show all {reviews} reviews
        </Button>
      </div>
    </div>
  )
}
