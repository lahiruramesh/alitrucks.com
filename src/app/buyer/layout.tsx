'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Truck, 
  Calendar, 
  CreditCard,
  MapPin,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
  Heart,
  Clock,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useMessageNotifications } from '@/hooks/useMessageNotifications';
import { useLogout } from '@/hooks/useLogout';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/buyer',
    icon: LayoutDashboard,
  },
  {
    title: 'Bookings',
    items: [
      {
        title: 'Current Bookings',
        href: '/buyer/bookings/current',
        icon: Calendar,
      },
      {
        title: 'Booking History',
        href: '/buyer/bookings/history',
        icon: Clock,
      },
      {
        title: 'Messages',
        href: '/buyer/messages',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Favorites',
    href: '/buyer/favorites',
    icon: Heart,
  },
  {
    title: 'Reviews',
    href: '/buyer/reviews',
    icon: Star,
  },
  {
    title: 'Payment Methods',
    href: '/buyer/payment-methods',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/buyer/settings',
    icon: Settings,
  },
];

const BuyerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BuyerLayoutContent>{children}</BuyerLayoutContent>
  );
};

const BuyerLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { unreadCount } = useUnreadMessages();
  const { logout } = useLogout();
  
  // Enable message notifications
  useMessageNotifications();

  const SidebarContent = () => (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">AliTrucks</h1>
          <p className="text-sm text-gray-500">Buyer Panel</p>
        </div>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item, index) => (
          <div key={index}>
            {item.items ? (
              // Group with subitems
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  {item.title}
                </div>
                {item.items.map((subItem) => (
                  <Link key={subItem.href} href={subItem.href} onClick={() => setSidebarOpen(false)}>
                    <Button
                      variant={pathname === subItem.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        pathname === subItem.href && "bg-blue-100 text-blue-700"
                      )}
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span className="truncate">{subItem.title}</span>
                      {subItem.href === '/buyer/messages' && unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            ) : (
              // Single item
              <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    pathname === item.href && "bg-blue-100 text-blue-700"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="truncate">{item.title}</span>
                </Button>
              </Link>
            )}
            {index < sidebarItems.length - 1 && item.items && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
      </nav>

      <Separator className="my-6" />
      
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={logout}
      >
        <LogOut className="w-4 h-4" />
        <span className="truncate">Sign Out</span>
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                </Sheet>
                
                <div>
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
                    {pathname === '/buyer' ? 'Dashboard' : 
                     pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h2>
                  <p className="text-sm text-gray-500 hidden sm:block">Manage your bookings and rental experience</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Trucks
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default BuyerLayout;
