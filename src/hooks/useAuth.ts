'use client'

import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { auth, UserProfile, UserRole } from '@/lib/auth'

export interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
}

// Simple in-memory cache for user profiles
const profileCache = new Map<string, UserProfile>()

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    const supabase = createClient()
    
    // Set a timeout to prevent indefinite loading
    timeoutId = setTimeout(() => {
      setState(prev => ({
        ...prev,
        loading: false,
        initialized: true
      }))
    }, 5000) // 5 second timeout
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        
        if (session?.user) {
          // Check cache first
          let profile = profileCache.get(session.user.id)
          
          if (!profile) {
            const { data: fetchedProfile } = await auth.getUserProfile(session.user.id)
            if (fetchedProfile) {
              profileCache.set(session.user.id, fetchedProfile)
              profile = fetchedProfile
            }
          }
          
          setState({
            user: session.user,
            session,
            profile: profile || null,
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
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
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
      async (event: string, session: Session | null) => {
        try {
          if (session?.user) {
            // Check cache first
            let profile = profileCache.get(session.user.id)
            
            if (!profile || event === 'SIGNED_IN') {
              const { data: fetchedProfile } = await auth.getUserProfile(session.user.id)
              if (fetchedProfile) {
                profileCache.set(session.user.id, fetchedProfile)
                profile = fetchedProfile
              }
            }
            
            setState({
              user: session.user,
              session,
              profile: profile || null,
              loading: false,
              initialized: true
            })
          } else {
            // Clear cache on sign out
            if (event === 'SIGNED_OUT') {
              profileCache.clear()
            }
            setState({
              user: null,
              session: null,
              profile: null,
              loading: false,
              initialized: true
            })
          }
        } catch (error) {
          console.error('Error handling auth state change:', error)
          setState(prev => ({
            ...prev,
            loading: false,
            initialized: true
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
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
  const { initialized, isAuthenticated, hasRole } = authState
  
  useEffect(() => {
    if (initialized && isAuthenticated && !hasRole(requiredRole)) {
      window.location.href = redirectTo
    }
  }, [initialized, isAuthenticated, hasRole, requiredRole, redirectTo])

  return authState
}
