'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'
import { Menu, X, Truck, User, Search, Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, profile, isAdmin, isSeller, isBuyer } = useAuth()
  const { logout } = useLogout()
  const pathname = usePathname()

  // Don't show header on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Truck className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">AliTrucks</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/search" 
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search Trucks</span>
            </Link>
            
            {user ? (
              <>
                {isBuyer && (
                  <Link 
                    href="/buyer/dashboard" 
                    className="text-gray-700 hover:text-green-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                
                {isSeller && (
                  <Link 
                    href="/seller/vehicles" 
                    className="text-gray-700 hover:text-green-600 transition-colors"
                  >
                    My Vehicles
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <span>Admin</span>
                    <Badge variant="secondary" className="text-xs">ADMIN</Badge>
                  </Link>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline">{profile?.full_name || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={`/${profile?.role || 'buyer'}/dashboard`}>
                        Profile & Settings
                      </Link>
                    </DropdownMenuItem>
                    
                    {isBuyer && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/buyer/bookings/current">My Bookings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/buyer/favorites">Favorites</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {isSeller && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/seller/bookings">Bookings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/seller/analytics">Analytics</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                  >
                    2
                  </Badge>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth/login"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Sign In
                </Link>
                <Button asChild size="sm">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white absolute left-0 right-0 top-16 shadow-lg">
            <nav className="flex flex-col space-y-2 p-4">
              <Link 
                href="/search" 
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                <span>Search Trucks</span>
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href={`/${profile?.role || 'buyer'}/dashboard`}
                    className="text-gray-700 hover:text-green-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {isBuyer && (
                    <Link 
                      href="/buyer/bookings/current"
                      className="text-gray-700 hover:text-green-600 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                  )}
                  
                  {isSeller && (
                    <Link 
                      href="/seller/vehicles"
                      className="text-gray-700 hover:text-green-600 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Vehicles
                    </Link>
                  )}
                  
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      className="flex items-center space-x-2 text-gray-700 hover:text-green-600 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Admin Panel</span>
                      <Badge variant="secondary" className="text-xs">ADMIN</Badge>
                    </Link>
                  )}
                  
                  <div className="border-t pt-2 mt-2">
                    <Button 
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      variant="ghost" 
                      className="w-full justify-start text-red-600"
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    className="text-gray-700 hover:text-green-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Button 
                    asChild 
                    className="w-full mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
