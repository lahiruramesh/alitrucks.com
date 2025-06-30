'use client'

import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { auth, UserProfile, UserRole } from '@/lib/auth'

export interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: profile } = await auth.getUserProfile(session.user.id)
        setState({
          user: session.user,
          session,
          profile,
          loading: false,
          initialized: true
        })
      } else {
        setState({
          user: null,
          session: null,
          profile: null,
          loading: false,
          initialized: true
        })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await auth.getUserProfile(session.user.id)
          setState({
            user: session.user,
            session,
            profile,
            loading: false,
            initialized: true
          })
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            loading: false,
            initialized: true
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    ...state,
    isAuthenticated: !!state.user,
    hasRole: (role: UserRole | UserRole[]) => auth.hasRole(state.profile, role),
    isAdmin: auth.isAdmin(state.profile),
    isSeller: auth.isSeller(state.profile),
    isBuyer: auth.isBuyer(state.profile)
  }
}

// Hook for requiring authentication
export function useRequireAuth(redirectTo = '/auth/login') {
  const authState = useAuth()
  
  useEffect(() => {
    if (authState.initialized && !authState.isAuthenticated) {
      window.location.href = redirectTo
    }
  }, [authState.initialized, authState.isAuthenticated, redirectTo])

  return authState
}

// Hook for requiring specific role
export function useRequireRole(requiredRole: UserRole | UserRole[], redirectTo = '/unauthorized') {
  const authState = useAuth()
  
  useEffect(() => {
    if (authState.initialized && authState.isAuthenticated && !authState.hasRole(requiredRole)) {
      window.location.href = redirectTo
    }
  }, [authState.initialized, authState.isAuthenticated, authState.profile, requiredRole, redirectTo])

  return authState
}
