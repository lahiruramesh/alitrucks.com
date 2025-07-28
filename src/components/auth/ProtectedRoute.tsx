'use client'

import { ReactNode } from 'react'
import { useRequireAuth, useRequireRole } from '@/hooks/useAuth'
import { UserRole } from '@/lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

interface RoleProtectedRouteProps extends ProtectedRouteProps {
  requiredRole: UserRole | UserRole[]
  fallback?: ReactNode
}

// Component to protect routes that require authentication
export function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const { loading, initialized, isAuthenticated } = useRequireAuth(redirectTo)

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Loading...</h3>
            <p className="text-sm text-gray-500">Setting up your dashboard</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirect will happen in useRequireAuth
  }

  return <>{children}</>
}

// Component to protect routes that require specific roles
export function RoleProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/unauthorized',
  fallback 
}: RoleProtectedRouteProps) {
  const { loading, initialized, isAuthenticated, hasRole } = useRequireRole(requiredRole, redirectTo)

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Loading...</h3>
            <p className="text-sm text-gray-500">Verifying permissions</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (!hasRole(requiredRole)) {
    if (fallback) {
      return <>{fallback}</>
    }
    return null // Will redirect to unauthorized
  }

  return <>{children}</>
}

// Admin-only route protection
export function AdminRoute({ children, ...props }: ProtectedRouteProps) {
  return (
    <RoleProtectedRoute requiredRole="admin" {...props}>
      {children}
    </RoleProtectedRoute>
  )
}

// Seller-only route protection  
export function SellerRoute({ children, ...props }: ProtectedRouteProps) {
  return (
    <RoleProtectedRoute requiredRole="seller" {...props}>
      {children}
    </RoleProtectedRoute>
  )
}

// Seller or Admin route protection
export function SellerOrAdminRoute({ children, ...props }: ProtectedRouteProps) {
  return (
    <RoleProtectedRoute requiredRole={['seller', 'admin']} {...props}>
      {children}
    </RoleProtectedRoute>
  )
}
