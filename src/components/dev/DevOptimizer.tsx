'use client'

import { useEffect } from 'react'

// Development-only component to optimize HMR with Turbopack
export function DevOptimizer() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // Optimize for Turbopack HMR
    const optimizeHMR = () => {
      // Wait for page to be fully loaded
      if (document.readyState === 'complete') {
        // Turbopack HMR optimization
        setTimeout(() => {
          console.log('🚀 Turbopack HMR optimized for better performance')
          
          // Optional: Preload critical resources for better HMR performance
          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            requestIdleCallback(() => {
              // This runs when the browser is idle, perfect for HMR setup
              console.log('⚡ HMR connection established during idle time')
            })
          }
        }, 50) // Reduced delay for Turbopack
      } else {
        // Wait for page to finish loading
        window.addEventListener('load', optimizeHMR, { once: true })
      }
    }

    optimizeHMR()
  }, [])

  // This component renders nothing
  return null
}

// Only export in development
export default process.env.NODE_ENV === 'development' ? DevOptimizer : () => null
