# AliTrucks - Electric Truck Rental Platform

A modern, responsive electric truck rental platform built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Home Page**: Browse available electric trucks with search functionality
- **Truck Detail Pages**: Detailed information about each truck including specifications, features, and booking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface following design system principles
- **Component Library**: Built with shadcn/ui components for consistency

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible UI components
- **Lucide React**: Beautiful, customizable icons
- **date-fns**: Modern JavaScript date utility library

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/placeholder/           # API routes for placeholder images
│   ├── truck/[id]/               # Dynamic truck detail pages
│   ├── globals.css               # Global styles with design system colors
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
└── components/
    ├── ui/                       # shadcn/ui components
    ├── BookingCard.tsx           # Truck booking component
    ├── Navigation.tsx            # Main navigation
    ├── ReviewsSection.tsx        # Reviews and ratings
    ├── SearchBar.tsx             # Search functionality
    ├── TruckCard.tsx             # Truck listing cards
    ├── TruckDetailGallery.tsx    # Image gallery for truck details
    └── TruckDetails.tsx          # Truck specifications and info
```

## Design System

The application follows a comprehensive design system with:

- **Colors**: Brand colors (#FF385C primary, #222222 secondary)
- **Typography**: Modern, readable font stack
- **Spacing**: Consistent spacing scale
- **Radius**: Rounded corners for modern look
- **Shadows**: Subtle shadows for depth

## Features Overview

### Home Page
- Hero section with search functionality
- Grid layout of available trucks
- Filter and sort options
- Responsive design

### Truck Detail Page
- Image gallery with modal view
- Detailed specifications
- Booking calendar
- Reviews and ratings
- Host information

### Components
- **Navigation**: Responsive navigation with mobile menu
- **SearchBar**: Location, date, and capacity search
- **TruckCard**: Truck listings with key information
- **BookingCard**: Interactive booking with date selection
- **Reviews**: Customer feedback and ratings

## Dummy Data

The application includes realistic dummy data for:
- Electric trucks (Tesla Semi, Rivian, Ford E-Transit, Mercedes eSprinter)
- Pricing and availability
- Customer reviews
- Truck specifications
- Host information

## Build and Deploy

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## License

This project is created for demonstration purposes.
