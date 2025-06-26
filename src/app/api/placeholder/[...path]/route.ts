import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const [widthStr, heightStr] = path
  const width = parseInt(widthStr || '300')
  const height = parseInt(heightStr || '200')
  
  // List of truck-related image URLs from Unsplash (free to use)
  const truckImages = [
    'https://unsplash.com/photos/a-blue-truck-parked-in-front-of-a-building-tfUYtn_8EaU', // Tesla Semi truck
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=300&fit=crop&auto=format&q=80', // Electric delivery van
    'https://images.unsplash.com/photo-1586941962766-3a7c0cc3e8e3?w=400&h=300&fit=crop&auto=format&q=80', // White delivery truck
    'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&h=300&fit=crop&auto=format&q=80', // Truck on highway
    'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop&auto=format&q=80', // Large commercial truck
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop&auto=format&q=80', // Electric cargo van
    'https://images.unsplash.com/photo-1566473395171-4e65e8b2e5f9?w=400&h=300&fit=crop&auto=format&q=80', // Modern truck front view
    'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop&auto=format&q=80', // Electric vehicle charging
    'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&h=300&fit=crop&auto=format&q=80', // Delivery van side view
    'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=400&h=300&fit=crop&auto=format&q=80', // Truck with cargo
    'https://images.unsplash.com/photo-1583473848882-f9a25d86ea8e?w=400&h=300&fit=crop&auto=format&q=80', // Commercial vehicle
    'https://images.unsplash.com/photo-1572312284222-ecf6d70f1907?w=400&h=300&fit=crop&auto=format&q=80', // Electric truck concept
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=80', // Blue truck
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format&q=80', // Semi truck side
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop&auto=format&q=80', // Logistics truck
    'https://images.unsplash.com/photo-1597149488851-60c8a99e8e6e?w=400&h=300&fit=crop&auto=format&q=80', // Electric commercial vehicle
  ]
  
  try {
    // Use a different image based on the dimensions to create variety
    const imageIndex = (width + height) % truckImages.length
    const imageUrl = truckImages[imageIndex].replace('w=400&h=300', `w=${width}&h=${height}`)
    
    // Fetch the image from Unsplash
    const response = await fetch(imageUrl)
    
    if (response.ok) {
      const imageBuffer = await response.arrayBuffer()
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }
  } catch (error) {
    console.log('Unsplash failed, trying Picsum')
  }
  
  // Fallback to Picsum Photos with truck-related seed
  try {
    const seeds = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010]
    const seed = seeds[(width + height) % seeds.length]
    const picsum = await fetch(`https://picsum.photos/seed/truck${seed}/${width}/${height}`)
    
    if (picsum.ok) {
      const imageBuffer = await picsum.arrayBuffer()
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }
  } catch (error) {
    console.log('Picsum failed, trying LoremFlickr')
  }

  // Fallback to LoremFlickr with truck tags
  try {
    const loremFlickr = await fetch(`https://loremflickr.com/${width}/${height}/truck,vehicle,transport`)
    
    if (loremFlickr.ok) {
      const imageBuffer = await loremFlickr.arrayBuffer()
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }
  } catch (error) {
    console.log('LoremFlickr failed, using final fallback')
  }
  
  // Final fallback: Generate a truck-themed placeholder image
  const svgImage = generateTruckSVG(width, height)
  
  return new NextResponse(svgImage, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}

function generateTruckSVG(width: number, height: number): string {
  const truckColors = ['#FF385C', '#2563EB', '#059669', '#DC2626', '#7C3AED', '#EA580C']
  const colorIndex = (width + height) % truckColors.length
  const color = truckColors[colorIndex]
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8fafc"/>
          <stop offset="100%" style="stop-color:#e2e8f0"/>
        </linearGradient>
        <linearGradient id="truck" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color}"/>
          <stop offset="100%" style="stop-color:${color}CC"/>
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg)"/>
      
      <!-- Truck body -->
      <rect x="${width * 0.15}" y="${height * 0.3}" width="${width * 0.7}" height="${height * 0.4}" rx="8" fill="url(#truck)"/>
      
      <!-- Truck cab -->
      <rect x="${width * 0.1}" y="${height * 0.25}" width="${width * 0.25}" height="${height * 0.45}" rx="6" fill="url(#truck)"/>
      
      <!-- Windows -->
      <rect x="${width * 0.12}" y="${height * 0.28}" width="${width * 0.08}" height="${height * 0.15}" rx="2" fill="#87CEEB" opacity="0.8"/>
      <rect x="${width * 0.22}" y="${height * 0.28}" width="${width * 0.08}" height="${height * 0.15}" rx="2" fill="#87CEEB" opacity="0.8"/>
      
      <!-- Wheels -->
      <circle cx="${width * 0.2}" cy="${height * 0.75}" r="${height * 0.08}" fill="#374151"/>
      <circle cx="${width * 0.2}" cy="${height * 0.75}" r="${height * 0.05}" fill="#6B7280"/>
      <circle cx="${width * 0.75}" cy="${height * 0.75}" r="${height * 0.08}" fill="#374151"/>
      <circle cx="${width * 0.75}" cy="${height * 0.75}" r="${height * 0.05}" fill="#6B7280"/>
      
      <!-- Electric symbol -->
      <text x="${width * 0.5}" y="${height * 0.9}" text-anchor="middle" fill="#10B981" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.08}" font-weight="bold">⚡ ELECTRIC</text>
      
      <!-- Size indicator -->
      <text x="${width * 0.5}" y="${height * 0.15}" text-anchor="middle" fill="#64748B" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.06}">${width}×${height}</text>
    </svg>
  `
}

function generateGradientImage(width: number, height: number): Buffer {
  // Create a simple gradient image data
  const colors = [
    { r: 100, g: 149, b: 237 }, // Blue
    { r: 50, g: 205, b: 50 },   // Green  
    { r: 255, g: 69, b: 0 },    // Red
    { r: 138, g: 43, b: 226 },  // Purple
    { r: 255, g: 140, b: 0 },   // Orange
  ]
  
  const colorIndex = (width + height) % colors.length
  const color = colors[colorIndex]
  
  // Create minimal BMP-like structure
  const pixelData = new Uint8Array(width * height * 3) // RGB
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 3
      
      // Create a gradient effect
      const gradientFactor = (x + y) / (width + height)
      
      pixelData[index] = Math.floor(color.r * (0.7 + gradientFactor * 0.3))     // R
      pixelData[index + 1] = Math.floor(color.g * (0.7 + gradientFactor * 0.3)) // G
      pixelData[index + 2] = Math.floor(color.b * (0.7 + gradientFactor * 0.3)) // B
    }
  }
  
  return Buffer.from(pixelData)
}
