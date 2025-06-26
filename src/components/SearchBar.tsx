'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CustomDialog from '@/components/CustomDialog'
import { MapPin, Calendar as CalendarIcon, Users, Search, Minus, Plus } from 'lucide-react'

export default function SearchBar() {
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [capacity, setCapacity] = useState(1)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)
  const [isCapacityOpen, setIsCapacityOpen] = useState(false)

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Add dates'
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleSearch = () => {
    console.log('Search:', { location, checkIn, checkOut, capacity })
    // Add search logic here
  }

  const handleDateSelect = (date: Date, type: 'checkin' | 'checkout') => {
    if (type === 'checkin') {
      setCheckIn(date)
      setIsCheckInOpen(false)
    } else {
      setCheckOut(date)
      setIsCheckOutOpen(false)
    }
  }

  const suggestedLocations = [
    'San Francisco, CA',
    'Los Angeles, CA',
    'Oakland, CA',
    'San Jose, CA',
    'Sacramento, CA',
    'Fresno, CA'
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow duration-200">
        <div className="flex flex-col md:flex-row md:items-center md:divide-x md:divide-gray-300">
          
          {/* Location */}
          <div className="flex-1 p-4 md:p-6">
            <CustomDialog
              open={isLocationOpen}
              onOpenChange={setIsLocationOpen}
              className="w-96 p-6"
              trigger={
                <div className="cursor-pointer hover:bg-gray-50 rounded-full p-2 -m-2 transition-colors">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                        WHERE
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {location || 'Search destinations'}
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Where to?</h3>
                  <Input
                    placeholder="Search destinations"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested destinations</h4>
                  <div className="space-y-2">
                    {suggestedLocations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setLocation(loc)
                          setIsLocationOpen(false)
                        }}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CustomDialog>
          </div>

          {/* Check-in */}
          <div className="flex-1 p-4 md:p-6">
            <CustomDialog
              open={isCheckInOpen}
              onOpenChange={setIsCheckInOpen}
              className="w-80 p-6"
              trigger={
                <div className="cursor-pointer hover:bg-gray-50 rounded-full p-2 -m-2 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                        CHECK-IN
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(checkIn)}
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <div>
                <h3 className="text-lg font-semibold mb-4">Select check-in date</h3>
                <div className="space-y-2">
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateSelect(new Date(e.target.value), 'checkin')}
                    className="w-full"
                  />
                </div>
              </div>
            </CustomDialog>
          </div>

          {/* Check-out */}
          <div className="flex-1 p-4 md:p-6">
            <CustomDialog
              open={isCheckOutOpen}
              onOpenChange={setIsCheckOutOpen}
              className="w-80 p-6"
              trigger={
                <div className="cursor-pointer hover:bg-gray-50 rounded-full p-2 -m-2 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                        CHECK-OUT
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(checkOut)}
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <div>
                <h3 className="text-lg font-semibold mb-4">Select check-out date</h3>
                <div className="space-y-2">
                  <Input
                    type="date"
                    min={checkIn ? checkIn.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateSelect(new Date(e.target.value), 'checkout')}
                    className="w-full"
                  />
                </div>
              </div>
            </CustomDialog>
          </div>

          {/* Capacity */}
          <div className="flex-1 p-4 md:p-6">
            <CustomDialog
              open={isCapacityOpen}
              onOpenChange={setIsCapacityOpen}
              className="w-80 p-6"
              trigger={
                <div className="cursor-pointer hover:bg-gray-50 rounded-full p-2 -m-2 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                        WHO
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {capacity === 1 ? '1 person' : `${capacity} people`}
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">How many people?</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Passengers</div>
                    <div className="text-sm text-gray-500">Age 13 or above</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 rounded-full p-0"
                      onClick={() => setCapacity(Math.max(1, capacity - 1))}
                      disabled={capacity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{capacity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 rounded-full p-0"
                      onClick={() => setCapacity(capacity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CustomDialog>
          </div>

          {/* Search Button */}
          <div className="p-2">
            <Button
              onClick={handleSearch}
              className="bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-full px-8 py-4 md:px-6 md:py-3 flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
