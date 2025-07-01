'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, Tag, Building2, Car, Target, Fuel, Plus, TrendingUp } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Stats {
  vehicleTypes: number;
  vehicleCategories: number;
  brands: number;
  models: number;
  rentalPurposes: number;
  fuelTypes: number;
}

const AdminPage = () => {
  const [stats, setStats] = useState<Stats>({
    vehicleTypes: 0,
    vehicleCategories: 0,
    brands: 0,
    models: 0,
    rentalPurposes: 0,
    fuelTypes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [vehicleTypes, vehicleCategories, brands, models, rentalPurposes, fuelTypes] = await Promise.all([
        supabase.from('vehicle_types').select('id', { count: 'exact', head: true }),
        supabase.from('vehicle_categories').select('id', { count: 'exact', head: true }),
        supabase.from('brands').select('id', { count: 'exact', head: true }),
        supabase.from('models').select('id', { count: 'exact', head: true }),
        supabase.from('rental_purposes').select('id', { count: 'exact', head: true }),
        supabase.from('fuel_types').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        vehicleTypes: vehicleTypes.count || 0,
        vehicleCategories: vehicleCategories.count || 0,
        brands: brands.count || 0,
        models: models.count || 0,
        rentalPurposes: rentalPurposes.count || 0,
        fuelTypes: fuelTypes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Add Vehicle Type', href: '/admin/vehicle-types', icon: Plus },
    { label: 'Add Brand', href: '/admin/brands', icon: Plus },
    { label: 'Add Model', href: '/admin/models', icon: Plus },
  ];

  const statsCards = [
    {
      title: 'Vehicle Types',
      value: stats.vehicleTypes,
      icon: Truck,
      href: '/admin/vehicle-types',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Vehicle Categories',
      value: stats.vehicleCategories,
      icon: Tag,
      href: '/admin/vehicle-categories',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Brands',
      value: stats.brands,
      icon: Building2,
      href: '/admin/brands',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Models',
      value: stats.models,
      icon: Car,
      href: '/admin/models',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Rental Purposes',
      value: stats.rentalPurposes,
      icon: Target,
      href: '/admin/rental-purposes',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Fuel Types',
      value: stats.fuelTypes,
      icon: Fuel,
      href: '/admin/fuel-types',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 lg:p-6 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome to AliTrucks Admin</h1>
        <p className="text-blue-100 text-sm lg:text-base">Manage your electric truck rental platform from this central dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statsCards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = card.href}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Click to manage
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-sm">
            Commonly used actions to manage your platform data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs lg:text-sm"
                onClick={() => window.location.href = action.href}
              >
                <action.icon className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">{action.label}</span>
                <span className="sm:hidden">{action.label.split(' ')[1] || action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">System Status</CardTitle>
          <CardDescription className="text-sm">
            Current status of your AliTrucks platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Connection</span>
              <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vehicle Attributes</span>
              <Badge variant="secondary" className="text-xs">
                {Object.values(stats).reduce((a, b) => a + b, 0)} total items
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Platform Status</span>
              <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                Operational
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
