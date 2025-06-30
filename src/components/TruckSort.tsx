'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowUpDown, Check } from 'lucide-react'

export type SortOption = 
  | 'price-low'
  | 'price-high'
  | 'rating-high'
  | 'rating-low'
  | 'distance-near'
  | 'distance-far'
  | 'reviews-most'
  | 'reviews-least'

interface TruckSortProps {
  onSortChange: (sort: SortOption) => void
  currentSort?: SortOption
}

export default function TruckSort({ onSortChange, currentSort }: TruckSortProps) {
  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating-high', label: 'Rating: High to Low' },
    { value: 'rating-low', label: 'Rating: Low to High' },
    { value: 'distance-near', label: 'Distance: Nearest First' },
    { value: 'distance-far', label: 'Distance: Farthest First' },
    { value: 'reviews-most', label: 'Most Reviewed' },
    { value: 'reviews-least', label: 'Least Reviewed' },
  ] as const

  const getCurrentSortLabel = () => {
    const current = sortOptions.find(option => option.value === currentSort)
    return current ? current.label : 'Sort by'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[140px] justify-between">
          <span className="truncate">{getCurrentSortLabel()}</span>
          <ArrowUpDown className="w-4 h-4 ml-2 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{option.label}</span>
            {currentSort === option.value && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
