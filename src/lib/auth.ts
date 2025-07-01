import { supabase } from './supabase'
import { Database } from '@/types/database'

export type UserRole = 'admin' | 'seller' | 'buyer'
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']

export const auth = {
  // Sign up a new user
  async signUp(email: string, password: string, userData: {
    full_name?: string
    role?: UserRole
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role || 'buyer'
        }
      }
    })
    return { data, error }
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  // Get current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  },

  // Get user profile with role
  async getUserProfile(userId: string): Promise<{ data: UserProfile | null, error: unknown }> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  },

  // Check if user has required role
  hasRole(userProfile: UserProfile | null, requiredRole: UserRole | UserRole[]): boolean {
    if (!userProfile) return false
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return roles.includes(userProfile.role)
  },

  // Check if user is admin
  isAdmin(userProfile: UserProfile | null): boolean {
    return this.hasRole(userProfile, 'admin')
  },

  // Check if user is seller
  isSeller(userProfile: UserProfile | null): boolean {
    return this.hasRole(userProfile, 'seller')
  },

  // Check if user is buyer
  isBuyer(userProfile: UserProfile | null): boolean {
    return this.hasRole(userProfile, 'buyer')
  }
}

// Helper function to get redirect URL based on user role
export function getRoleBasedRedirectUrl(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'seller':
      return '/seller'
    case 'buyer':
      return '/'
    default:
      return '/'
  }
}
