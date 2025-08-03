export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      booking_messages: {
        Row: {
          booking_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          message_type: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          is_verified: boolean | null
          rating: number
          review_type: string
          reviewed_user_id: string
          reviewer_id: string
          title: string | null
          updated_at: string | null
          vehicle_id: number
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          rating: number
          review_type: string
          reviewed_user_id: string
          reviewer_id: string
          title?: string | null
          updated_at?: string | null
          vehicle_id: number
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          rating?: number
          review_type?: string
          reviewed_user_id?: string
          reviewer_id?: string
          title?: string | null
          updated_at?: string | null
          vehicle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_reviews_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          buyer_id: string
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          confirmed_at: string | null
          created_at: string | null
          end_date: string
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          pickup_location: string
          pickup_time: string | null
          price_per_day: number
          renter_email: string | null
          renter_notes: string | null
          renter_phone: string | null
          return_location: string | null
          return_time: string | null
          seller_id: string
          seller_notes: string | null
          service_fee: number | null
          special_requests: string | null
          start_date: string
          status: Database["public"]["Enums"]["booking_status"]
          subtotal: number
          taxes: number | null
          total_amount: number
          total_days: number
          updated_at: string | null
          vehicle_id: number
        }
        Insert: {
          buyer_id: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          pickup_location: string
          pickup_time?: string | null
          price_per_day: number
          renter_email?: string | null
          renter_notes?: string | null
          renter_phone?: string | null
          return_location?: string | null
          return_time?: string | null
          seller_id: string
          seller_notes?: string | null
          service_fee?: number | null
          special_requests?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"]
          subtotal: number
          taxes?: number | null
          total_amount: number
          total_days: number
          updated_at?: string | null
          vehicle_id: number
        }
        Update: {
          buyer_id?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          pickup_location?: string
          pickup_time?: string | null
          price_per_day?: number
          renter_email?: string | null
          renter_notes?: string | null
          renter_phone?: string | null
          return_location?: string | null
          return_time?: string | null
          seller_id?: string
          seller_notes?: string | null
          service_fee?: number | null
          special_requests?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"]
          subtotal?: number
          taxes?: number | null
          total_amount?: number
          total_days?: number
          updated_at?: string | null
          vehicle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      buyer_profiles: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string
          driving_license_url: string
          full_name: string
          id: string
          license_expiry_date: string
          license_number: string
          phone: string
          updated_at: string
          user_id: string
          verification_notes: string | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth: string
          driving_license_url: string
          full_name: string
          id?: string
          license_expiry_date: string
          license_number: string
          phone: string
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string
          driving_license_url?: string
          full_name?: string
          id?: string
          license_expiry_date?: string
          license_number?: string
          phone?: string
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: number
          id: number
          joined_at: string | null
          left_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: number
          id?: never
          joined_at?: string | null
          left_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          conversation_id?: number
          id?: never
          joined_at?: string | null
          left_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          admin_id: string | null
          booking_id: number | null
          category: string | null
          created_at: string | null
          id: number
          last_message_at: string | null
          priority: string
          resolved_at: string | null
          status: string
          subject: string | null
          updated_at: string | null
          user_id: string
          vehicle_id: number | null
        }
        Insert: {
          admin_id?: string | null
          booking_id?: number | null
          category?: string | null
          created_at?: string | null
          id?: never
          last_message_at?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_id?: number | null
        }
        Update: {
          admin_id?: string | null
          booking_id?: number | null
          category?: string | null
          created_at?: string | null
          id?: never
          last_message_at?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          booking_id: string | null
          coupon_id: number | null
          discount_amount: number
          id: number
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          coupon_id?: number | null
          discount_amount: number
          id?: number
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          coupon_id?: number | null
          discount_amount?: number
          id?: number
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          id: number
          is_active: boolean | null
          maximum_discount: number | null
          minimum_amount: number | null
          name: string
          updated_at: string | null
          usage_limit: number | null
          used_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: number
          is_active?: boolean | null
          maximum_discount?: number | null
          minimum_amount?: number | null
          name: string
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: number
          is_active?: boolean | null
          maximum_discount?: number | null
          minimum_amount?: number | null
          name?: string
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      fuel_types: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_mime_type: string | null
          attachment_name: string | null
          attachment_size: number | null
          attachment_url: string | null
          content: string
          conversation_id: number
          created_at: string | null
          id: number
          is_read: boolean | null
          message_type: string
          read_at: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          attachment_mime_type?: string | null
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          content: string
          conversation_id: number
          created_at?: string | null
          id?: never
          is_read?: boolean | null
          message_type?: string
          read_at?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          attachment_mime_type?: string | null
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          content?: string
          conversation_id?: number
          created_at?: string | null
          id?: never
          is_read?: boolean | null
          message_type?: string
          read_at?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          brand_id: number
          id: number
          name: string
        }
        Insert: {
          brand_id: number
          id?: never
          name: string
        }
        Update: {
          brand_id?: number
          id?: never
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_policies: {
        Row: {
          content: string
          created_at: string | null
          id: number
          is_active: boolean | null
          is_default: boolean | null
          policy_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          is_default?: boolean | null
          policy_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          is_default?: boolean | null
          policy_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      rental_purposes: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_availability: {
        Row: {
          created_at: string | null
          end_date: string
          id: number
          is_available: boolean | null
          notes: string | null
          special_price_per_day: number | null
          start_date: string
          vehicle_id: number
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: never
          is_available?: boolean | null
          notes?: string | null
          special_price_per_day?: number | null
          start_date: string
          vehicle_id: number
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: never
          is_available?: boolean | null
          notes?: string | null
          special_price_per_day?: number | null
          start_date?: string
          vehicle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_availability_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      vehicle_images: {
        Row: {
          alt_text: string | null
          display_order: number | null
          file_name: string
          file_size: number | null
          id: number
          image_path: string
          image_url: string
          is_primary: boolean | null
          mime_type: string | null
          uploaded_at: string | null
          vehicle_id: number
        }
        Insert: {
          alt_text?: string | null
          display_order?: number | null
          file_name: string
          file_size?: number | null
          id?: never
          image_path: string
          image_url: string
          is_primary?: boolean | null
          mime_type?: string | null
          uploaded_at?: string | null
          vehicle_id: number
        }
        Update: {
          alt_text?: string | null
          display_order?: number | null
          file_name?: string
          file_size?: number | null
          id?: never
          image_path?: string
          image_url?: string
          is_primary?: boolean | null
          mime_type?: string | null
          uploaded_at?: string | null
          vehicle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_types: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          brand_id: number | null
          cancellation_policy_id: number | null
          cargo_volume: number | null
          charging_time_hours: number | null
          created_at: string | null
          description: string | null
          fuel_policy_id: number | null
          fuel_type_id: number | null
          id: number
          is_featured: boolean | null
          key_features: string[] | null
          location: string
          max_weight_capacity: number | null
          mileage: number | null
          model_id: number | null
          name: string
          offers: string[] | null
          pickup_location: string | null
          price_per_day: number | null
          price_per_month: number | null
          price_per_week: number | null
          range_miles: number | null
          rejection_reason: string | null
          return_location: string | null
          return_policy_id: number | null
          search_vector: unknown | null
          seller_id: string
          specifications: Json | null
          status: string
          updated_at: string | null
          vehicle_category_id: number | null
          vehicle_registration_number: string
          vehicle_type_id: number | null
          year: number
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          brand_id?: number | null
          cancellation_policy_id?: number | null
          cargo_volume?: number | null
          charging_time_hours?: number | null
          created_at?: string | null
          description?: string | null
          fuel_policy_id?: number | null
          fuel_type_id?: number | null
          id?: never
          is_featured?: boolean | null
          key_features?: string[] | null
          location: string
          max_weight_capacity?: number | null
          mileage?: number | null
          model_id?: number | null
          name: string
          offers?: string[] | null
          pickup_location?: string | null
          price_per_day?: number | null
          price_per_month?: number | null
          price_per_week?: number | null
          range_miles?: number | null
          rejection_reason?: string | null
          return_location?: string | null
          return_policy_id?: number | null
          search_vector?: unknown | null
          seller_id: string
          specifications?: Json | null
          status?: string
          updated_at?: string | null
          vehicle_category_id?: number | null
          vehicle_registration_number: string
          vehicle_type_id?: number | null
          year: number
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          brand_id?: number | null
          cancellation_policy_id?: number | null
          cargo_volume?: number | null
          charging_time_hours?: number | null
          created_at?: string | null
          description?: string | null
          fuel_policy_id?: number | null
          fuel_type_id?: number | null
          id?: never
          is_featured?: boolean | null
          key_features?: string[] | null
          location?: string
          max_weight_capacity?: number | null
          mileage?: number | null
          model_id?: number | null
          name?: string
          offers?: string[] | null
          pickup_location?: string | null
          price_per_day?: number | null
          price_per_month?: number | null
          price_per_week?: number | null
          range_miles?: number | null
          rejection_reason?: string | null
          return_location?: string | null
          return_policy_id?: number | null
          search_vector?: unknown | null
          seller_id?: string
          specifications?: Json | null
          status?: string
          updated_at?: string | null
          vehicle_category_id?: number | null
          vehicle_registration_number?: string
          vehicle_type_id?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_cancellation_policy_id_fkey"
            columns: ["cancellation_policy_id"]
            isOneToOne: false
            referencedRelation: "platform_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_fuel_policy_id_fkey"
            columns: ["fuel_policy_id"]
            isOneToOne: false
            referencedRelation: "platform_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_fuel_type_id_fkey"
            columns: ["fuel_type_id"]
            isOneToOne: false
            referencedRelation: "fuel_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_return_policy_id_fkey"
            columns: ["return_policy_id"]
            isOneToOne: false
            referencedRelation: "platform_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_vehicle_category_id_fkey"
            columns: ["vehicle_category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "active"
        | "completed"
        | "cancelled"
        | "rejected"
      payment_status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "partial_refund"
      user_role: "admin" | "seller" | "buyer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
        "rejected",
      ],
      payment_status: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partial_refund",
      ],
      user_role: ["admin", "seller", "buyer"],
    },
  },
} as const

