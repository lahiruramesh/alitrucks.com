'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth, AuthState } from '@/hooks/useAuth'

interface AuthContextType extends AuthState {
  isAuthenticated: boolean
  hasRole: (role: import('@/lib/auth').UserRole | import('@/lib/auth').UserRole[]) => boolean
  isAdmin: boolean
  isSeller: boolean
  isBuyer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authState = useAuth()

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
