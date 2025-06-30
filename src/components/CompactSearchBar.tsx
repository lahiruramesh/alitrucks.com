'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import CustomDialog from '@/components/CustomDialog'
import { MapPin, Calendar as CalendarIcon, Users, Search, Minus, Plus } from 'lucide-react'

interface CompactSearchBarProps {
  onSearch?: (searchData: any) => void
}

export default function CompactSearchBar({ onSearch }: CompactSearchBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [capacity, setCapacity] = useState(1)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)
  const [isCapacityOpen, setIsCapacityOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show compact search bar when user scrolls past the hero section
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Dates'
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleSearch = () => {
    const searchData = { location, checkIn, checkOut, capacity }
    onSearch?.(searchData)
    console.log('Search:', searchData)
  }

  const suggestedLocations = [
    'San Francisco, CA',
    'Los Angeles, CA',
    'Oakland, CA',
    'San Jose, CA',
    'Sacramento, CA',
    'Fresno, CA'
  ]

  const handleDateSelect = (date: Date, type: 'checkin' | 'checkout') => {
    if (type === 'checkin') {
      setCheckIn(date)
      setIsCheckInOpen(false)
    } else {
      setCheckOut(date)
      setIsCheckOutOpen(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className={`fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-full shadow-lg p-2">
          <div className="flex flex-col sm:flex-row sm:items-center">
            
            {/* Location - Compact */}
            <div className="flex-1 p-2 sm:p-3">
              <CustomDialog
                open={isLocationOpen}
                onOpenChange={setIsLocationOpen}
                className="w-96 p-6"
                trigger={
                  <div className="cursor-pointer hover:bg-gray-50 rounded-full p-2 -m-2 transition-colors">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                          WHERE
                        </div>
                        <div className="text-sm text-gray-500 truncate">
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

            {/* Dates - Compact */}
            <div className="flex-1 p-2 sm:p-3">
              <CustomDialog
                open={isCheckInOpen}
                onOpenChange={setIsCheckInOpen}
                className="w-80 p-6"
                trigger={
                  <div className="cursor-pointer hover:bg-gray-50 rounded-full p-2 -m-2 transition-colors">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                          DATES
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {checkIn && checkOut 
                            ? `${formatDate(checkIn)} - ${formatDate(checkOut)}`
                            : 'Add dates'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select dates</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => handleDateSelect(new Date(e.target.value), 'checkin')}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                      <Input
                        type="date"
                        min={checkIn ? checkIn.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        onChange={(e) => handleDateSelect(new Date(e.target.value), 'checkout')}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CustomDialog>
            </div>

            {/* Capacity - Compact */}
            <div className="flex-1 p-2 sm:p-3">
              <CustomDialog
                open={isCapacityOpen}
                onOpenChange={setIsCapacityOpen}
                className="w-80 p-6"
                trigger={
                  <div className="cursor-pointer hover:bg-gray-50 rounded-full p-2 -m-2 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                          WHO
                        </div>
                        <div className="text-sm text-gray-500 truncate">
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

            {/* Search Button - Compact */}
            <div className="p-2">
              <Button
                onClick={handleSearch}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
