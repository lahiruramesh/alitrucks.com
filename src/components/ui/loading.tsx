'use client'

import { Truck } from 'lucide-react'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="relative">
        {/* Animated truck */}
        <div className="animate-bounce">
          <Truck className={`${sizeClasses[size]} text-green-600`} />
        </div>
        
        {/* Loading dots */}
        <div className="flex space-x-1 mt-4 justify-center">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm animate-pulse">{message}</p>
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4">
        <Loading message="Loading page..." size="lg" />
      </div>
    </div>
  )
}

export function ComponentLoading({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center">
        <Truck className="w-8 h-8 text-gray-400 animate-bounce" />
      </div>
    </div>
  )
}
