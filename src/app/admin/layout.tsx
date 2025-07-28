'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { 
  LayoutDashboard, 
  Truck, 
  Tag, 
  Building2, 
  Car, 
  Target, 
  Fuel,
  Users,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAdminUnreadMessages } from '@/hooks/useAdminUnreadMessages';
import { useMessageNotifications } from '@/hooks/useMessageNotifications';
import { useLogout } from '@/hooks/useLogout';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Vehicle Management',
    items: [
      {
        title: 'Vehicle Approvals',
        href: '/admin/vehicle-approvals',
        icon: CheckCircle,
      },
      {
        title: 'Vehicle Types',
        href: '/admin/vehicle-types',
        icon: Truck,
      },
      {
        title: 'Vehicle Categories',
        href: '/admin/vehicle-categories',
        icon: Tag,
      },
      {
        title: 'Brands',
        href: '/admin/brands',
        icon: Building2,
      },
      {
        title: 'Models',
        href: '/admin/models',
        icon: Car,
      },
      {
        title: 'Rental Purposes',
        href: '/admin/rental-purposes',
        icon: Target,
      },
      {
        title: 'Fuel Types',
        href: '/admin/fuel-types',
        icon: Fuel,
      },
    ],
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Support',
    href: '/admin/support',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminRoute>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminRoute>
  );
};

const AdminLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useLogout();
  
  // Re-enable with optimization
  const { unreadCount } = useAdminUnreadMessages();
  
  // Re-enable message notifications
  useMessageNotifications();

  const SidebarContent = () => (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">AliTrucks</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
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
                        pathname === subItem.href && "bg-primary/10 text-primary"
                      )}
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span className="truncate">{subItem.title}</span>
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
                    pathname === item.href && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="truncate">{item.title}</span>
                  {item.href === '/admin/support' && unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {unreadCount}
                    </Badge>
                  )}
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
                    {pathname === '/admin' ? 'Dashboard' : 
                     pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h2>
                  <p className="text-sm text-gray-500 hidden sm:block">Manage your AliTrucks platform</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Quick Actions
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

export default AdminLayout;
