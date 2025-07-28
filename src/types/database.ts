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
      booking_messages: {
        Row: {
          id: string
          booking_id: string
          sender_id: string
          message: string
          message_type: 'text' | 'system' | 'status_update'
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          sender_id: string
          message: string
          message_type?: 'text' | 'system' | 'status_update'
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          sender_id?: string
          message?: string
          message_type?: 'text' | 'system' | 'status_update'
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      booking_reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          reviewed_user_id: string
          vehicle_id: number
          rating: number
          title: string | null
          comment: string | null
          review_type: 'vehicle' | 'seller' | 'buyer'
          is_public: boolean
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          reviewed_user_id: string
          vehicle_id: number
          rating: number
          title?: string | null
          comment?: string | null
          review_type: 'vehicle' | 'seller' | 'buyer'
          is_public?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          reviewer_id?: string
          reviewed_user_id?: string
          vehicle_id?: number
          rating?: number
          title?: string | null
          comment?: string | null
          review_type?: 'vehicle' | 'seller' | 'buyer'
          is_public?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          vehicle_id: number
          buyer_id: string
          seller_id: string
          start_date: string
          end_date: string
          pickup_time: string
          return_time: string
          pickup_location: string
          return_location: string | null
          price_per_day: number
          total_days: number
          subtotal: number
          service_fee: number
          taxes: number
          total_amount: number
          status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund'
          special_requests: string | null
          renter_notes: string | null
          seller_notes: string | null
          cancellation_reason: string | null
          renter_phone: string | null
          renter_email: string | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
          cancelled_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          vehicle_id: number
          buyer_id: string
          seller_id?: string
          start_date: string
          end_date: string
          pickup_time?: string
          return_time?: string
          pickup_location: string
          return_location?: string | null
          price_per_day: number
          total_days: number
          subtotal: number
          service_fee?: number
          taxes?: number
          total_amount: number
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund'
          special_requests?: string | null
          renter_notes?: string | null
          seller_notes?: string | null
          cancellation_reason?: string | null
          renter_phone?: string | null
          renter_email?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          vehicle_id?: number
          buyer_id?: string
          seller_id?: string
          start_date?: string
          end_date?: string
          pickup_time?: string
          return_time?: string
          pickup_location?: string
          return_location?: string | null
          price_per_day?: number
          total_days?: number
          subtotal?: number
          service_fee?: number
          taxes?: number
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund'
          special_requests?: string | null
          renter_notes?: string | null
          seller_notes?: string | null
          cancellation_reason?: string | null
          renter_phone?: string | null
          renter_email?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
        }
      }
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
          id: number
          owner_id: string
          brand_id: number
          model_id: number
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
      booking_status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund'
      user_role: 'admin' | 'seller' | 'buyer'
      vehicle_status: 'pending' | 'approved' | 'rejected'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Vehicle = Database['public']['Tables']['vehicles']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingReview = Database['public']['Tables']['booking_reviews']['Row']
export type BookingMessage = Database['public']['Tables']['booking_messages']['Row']
