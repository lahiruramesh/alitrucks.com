'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { CalendarIcon, Star, Users } from 'lucide-react'
import { format } from 'date-fns'

interface BookingCardProps {
  truck: {
    price: number
    rating: number
    reviews: number
  }
}

export default function BookingCard({ truck }: BookingCardProps) {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false)
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false)
  const [drivers, setDrivers] = useState('1')

  const calculateDays = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    return 0
  }

  const days = calculateDays()
  const subtotal = days * truck.price
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardContent className="p-6">
        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-2xl font-bold">${truck.price}</span>
            <span className="text-gray-500"> /day</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium ml-1">{truck.rating}</span>
            <span className="text-gray-500 ml-1">({truck.reviews})</span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-4 mb-6">
          {/* Date Inputs */}
          <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-lg">
            <div className="p-3 border-r border-gray-300">
              <div className="text-xs font-semibold text-gray-900 mb-1">CHECK-IN</div>
              <Dialog open={showCheckInCalendar} onOpenChange={setShowCheckInCalendar}>
                <DialogTrigger asChild>
                  <button className="flex items-center w-full text-left">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">
                      {checkIn ? format(checkIn, 'MM/dd/yyyy') : 'Add date'}
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="w-auto p-4">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={(date) => {
                      setCheckIn(date)
                      setShowCheckInCalendar(false)
                    }}
                    disabled={(date) => date < new Date()}
                    className="rounded-md"
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="p-3">
              <div className="text-xs font-semibold text-gray-900 mb-1">CHECK-OUT</div>
              <Dialog open={showCheckOutCalendar} onOpenChange={setShowCheckOutCalendar}>
                <DialogTrigger asChild>
                  <button className="flex items-center w-full text-left">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">
                      {checkOut ? format(checkOut, 'MM/dd/yyyy') : 'Add date'}
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="w-auto p-4">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={(date) => {
                      setCheckOut(date)
                      setShowCheckOutCalendar(false)
                    }}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today || (checkIn ? date <= checkIn : false)
                    }}
                    className="rounded-md"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Drivers */}
          <div className="border border-gray-300 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-900 mb-1">DRIVERS</div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-400 mr-2" />
              <Input
                type="number"
                min="1"
                value={drivers}
                onChange={(e) => setDrivers(e.target.value)}
                className="border-none p-0 text-sm focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Reserve Button */}
        <Button 
          className="w-full bg-green-500 hover:bg-green-600 text-white h-12 mb-4"
          disabled={!checkIn || !checkOut}
        >
          Reserve
        </Button>

        <p className="text-center text-sm text-gray-500 mb-4">
          You won't be charged yet
        </p>

        {/* Price Breakdown */}
        {days > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span>${truck.price} x {days} days</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between font-semibold pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
