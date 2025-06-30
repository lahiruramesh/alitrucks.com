'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Menu, Search, User, MapPin, Calendar, Users, LogOut, Settings, Shield, X } from 'lucide-react'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { auth, getRoleBasedRedirectUrl } from '@/lib/auth'

export default function NavigationFixed() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, profile, isAuthenticated } = useAuthContext()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const getUserDisplayName = () => {
    return profile?.full_name || user?.email || 'Account'
  }

  const getUserInitials = () => {
    const name = profile?.full_name || user?.email || 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getDashboardLink = () => {
    if (!profile) return '/'
    return getRoleBasedRedirectUrl(profile.role)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-500">
                AliTrucks
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-900 hover:text-green-500 font-medium transition-colors">
                Browse Trucks
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900 transition-colors">
                How it works
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-900 transition-colors">
                Support
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Auth Actions */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt="User Avatar" />
                        ) : (
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {profile?.role} Account
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>
                      Sign up
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Menu className={`h-6 w-6 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                      <X className={`h-6 w-6 absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col space-y-4 mt-8">
                      <Link 
                        href="/" 
                        className="text-lg font-medium hover:text-green-500 transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Browse Trucks
                      </Link>
                      <Link 
                        href="/about" 
                        className="text-lg font-medium hover:text-green-500 transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        How it works
                      </Link>
                      <Link 
                        href="/contact" 
                        className="text-lg font-medium hover:text-green-500 transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Support
                      </Link>
                      
                      {!isAuthenticated && (
                        <>
                          <hr className="my-4" />
                          <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full">
                              Log in
                            </Button>
                          </Link>
                          <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                            <Button className="w-full">
                              Sign up
                            </Button>
                          </Link>
                        </>
                      )}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20" />
    </>
  )
}
