export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fuel_types: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      models: {
        Row: {
          id: string
          brand_id: string
          name: string
          description: string | null
          year_start: number | null
          year_end: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          name: string
          description?: string | null
          year_start?: number | null
          year_end?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          name?: string
          description?: string | null
          year_start?: number | null
          year_end?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      rental_purposes: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'admin' | 'seller' | 'buyer'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'admin' | 'seller' | 'buyer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'admin' | 'seller' | 'buyer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_types: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          owner_id: string
          brand_id: string
          model_id: string
          year: number
          color: string
          vin: string | null
          price_per_day: number
          location: string
          availability_start_date: string
          availability_end_date: string
          description: string | null
          features: Json | null
          created_at: string
          updated_at: string
          status: "pending" | "approved" | "rejected"
          vehicle_registration_number: string
          rejection_reason: string | null
        }
        Insert: {
          id?: string
          owner_id: string
          brand_id: string
          model_id: string
          year: number
          color: string
          vin?: string | null
          price_per_day: number
          location: string
          availability_start_date: string
          availability_end_date: string
          description?: string | null
          features?: Json | null
          created_at?: string
          updated_at?: string
          status?: "pending" | "approved" | "rejected"
          vehicle_registration_number: string
          rejection_reason?: string | null
        }
        Update: {
          id?: string
          owner_id?: string
          brand_id?: string
          model_id?: string
          year?: number
          color?: string
          vin?: string | null
          price_per_day?: number
          location?: string
          availability_start_date?: string
          availability_end_date?: string
          description?: string | null
          features?: Json | null
          created_at?: string
          updated_at?: string
          status?: "pending" | "approved" | "rejected"
          vehicle_registration_number?: string
          rejection_reason?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'seller' | 'buyer'
      vehicle_status: 'pending' | 'approved' | 'rejected'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Vehicle = Database['public']['Tables']['vehicles']['Row']
