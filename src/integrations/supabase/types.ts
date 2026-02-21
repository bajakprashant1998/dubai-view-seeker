export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      combo_deals: {
        Row: {
          best_for: string[] | null
          combo_price: number
          created_at: string
          description: string | null
          duration: string | null
          highlights: string[] | null
          id: string
          image: string | null
          popular: boolean | null
          savings: number
          savings_percent: number
          slug: string | null
          status: string
          title: string
          total_original_price: number
          tour_ids: string[]
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          best_for?: string[] | null
          combo_price?: number
          created_at?: string
          description?: string | null
          duration?: string | null
          highlights?: string[] | null
          id?: string
          image?: string | null
          popular?: boolean | null
          savings?: number
          savings_percent?: number
          slug?: string | null
          status?: string
          title: string
          total_original_price?: number
          tour_ids?: string[]
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          best_for?: string[] | null
          combo_price?: number
          created_at?: string
          description?: string | null
          duration?: string | null
          highlights?: string[] | null
          id?: string
          image?: string | null
          popular?: boolean | null
          savings?: number
          savings_percent?: number
          slug?: string | null
          status?: string
          title?: string
          total_original_price?: number
          tour_ids?: string[]
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tours: {
        Row: {
          accessibility_info: string | null
          activity_timing_location: Json | null
          additional_info: Json | null
          addons: Json | null
          adult_age_label: string | null
          adult_price: number | null
          adult_sale_price: number | null
          advantage: Json | null
          available_days: string[] | null
          banner_image: string | null
          blackout_dates: string[] | null
          booking_policy: string | null
          cancellation_policy: string | null
          capacity: Json | null
          category: string | null
          child_age_label: string | null
          child_policy: string | null
          child_price: number | null
          child_sale_price: number | null
          confirmation_type: string | null
          created_at: string
          difficulty_level: string | null
          dress_code: string | null
          dropback_time: string | null
          duration: string | null
          duration_unit: string | null
          exclusions: Json | null
          extra_fee: number | null
          extra_fee_enabled: boolean | null
          faqs: Json | null
          faqs_enabled: boolean | null
          feature_image: string | null
          featured: boolean | null
          gallery: string[] | null
          guide_type: string | null
          hotel_info: Json | null
          hourly_rentals: Json | null
          id: string
          important_info: Json | null
          inclusions: Json | null
          infant_age_label: string | null
          infant_price: number | null
          itinerary: Json | null
          languages: string[] | null
          map_link: string | null
          max_group_size: number | null
          max_people: number | null
          max_quantity: number | null
          meeting_point: string | null
          meta_description: string | null
          meta_keyword: string | null
          meta_tag: string | null
          meta_title: string | null
          min_age: number | null
          min_people: number | null
          min_quantity: number | null
          operating_hours: Json | null
          overview: string | null
          pickup_time: string | null
          pricing_type: string | null
          private_transfer_price: number | null
          safety_requirements: Json | null
          seasonal_availability: string | null
          seasonal_pricing: Json | null
          service_fee: number | null
          service_fee_enabled: boolean | null
          sharing_transfer_price: number | null
          slug: string | null
          status: string
          title: string
          tour_type: string | null
          transfer_options: Json | null
          updated_at: string
          voucher_type: string | null
          what_to_bring: Json | null
          wheelchair_accessible: boolean | null
          why_go: Json | null
          youtube_link: string | null
        }
        Insert: {
          accessibility_info?: string | null
          activity_timing_location?: Json | null
          additional_info?: Json | null
          addons?: Json | null
          adult_age_label?: string | null
          adult_price?: number | null
          adult_sale_price?: number | null
          advantage?: Json | null
          available_days?: string[] | null
          banner_image?: string | null
          blackout_dates?: string[] | null
          booking_policy?: string | null
          cancellation_policy?: string | null
          capacity?: Json | null
          category?: string | null
          child_age_label?: string | null
          child_policy?: string | null
          child_price?: number | null
          child_sale_price?: number | null
          confirmation_type?: string | null
          created_at?: string
          difficulty_level?: string | null
          dress_code?: string | null
          dropback_time?: string | null
          duration?: string | null
          duration_unit?: string | null
          exclusions?: Json | null
          extra_fee?: number | null
          extra_fee_enabled?: boolean | null
          faqs?: Json | null
          faqs_enabled?: boolean | null
          feature_image?: string | null
          featured?: boolean | null
          gallery?: string[] | null
          guide_type?: string | null
          hotel_info?: Json | null
          hourly_rentals?: Json | null
          id?: string
          important_info?: Json | null
          inclusions?: Json | null
          infant_age_label?: string | null
          infant_price?: number | null
          itinerary?: Json | null
          languages?: string[] | null
          map_link?: string | null
          max_group_size?: number | null
          max_people?: number | null
          max_quantity?: number | null
          meeting_point?: string | null
          meta_description?: string | null
          meta_keyword?: string | null
          meta_tag?: string | null
          meta_title?: string | null
          min_age?: number | null
          min_people?: number | null
          min_quantity?: number | null
          operating_hours?: Json | null
          overview?: string | null
          pickup_time?: string | null
          pricing_type?: string | null
          private_transfer_price?: number | null
          safety_requirements?: Json | null
          seasonal_availability?: string | null
          seasonal_pricing?: Json | null
          service_fee?: number | null
          service_fee_enabled?: boolean | null
          sharing_transfer_price?: number | null
          slug?: string | null
          status?: string
          title: string
          tour_type?: string | null
          transfer_options?: Json | null
          updated_at?: string
          voucher_type?: string | null
          what_to_bring?: Json | null
          wheelchair_accessible?: boolean | null
          why_go?: Json | null
          youtube_link?: string | null
        }
        Update: {
          accessibility_info?: string | null
          activity_timing_location?: Json | null
          additional_info?: Json | null
          addons?: Json | null
          adult_age_label?: string | null
          adult_price?: number | null
          adult_sale_price?: number | null
          advantage?: Json | null
          available_days?: string[] | null
          banner_image?: string | null
          blackout_dates?: string[] | null
          booking_policy?: string | null
          cancellation_policy?: string | null
          capacity?: Json | null
          category?: string | null
          child_age_label?: string | null
          child_policy?: string | null
          child_price?: number | null
          child_sale_price?: number | null
          confirmation_type?: string | null
          created_at?: string
          difficulty_level?: string | null
          dress_code?: string | null
          dropback_time?: string | null
          duration?: string | null
          duration_unit?: string | null
          exclusions?: Json | null
          extra_fee?: number | null
          extra_fee_enabled?: boolean | null
          faqs?: Json | null
          faqs_enabled?: boolean | null
          feature_image?: string | null
          featured?: boolean | null
          gallery?: string[] | null
          guide_type?: string | null
          hotel_info?: Json | null
          hourly_rentals?: Json | null
          id?: string
          important_info?: Json | null
          inclusions?: Json | null
          infant_age_label?: string | null
          infant_price?: number | null
          itinerary?: Json | null
          languages?: string[] | null
          map_link?: string | null
          max_group_size?: number | null
          max_people?: number | null
          max_quantity?: number | null
          meeting_point?: string | null
          meta_description?: string | null
          meta_keyword?: string | null
          meta_tag?: string | null
          meta_title?: string | null
          min_age?: number | null
          min_people?: number | null
          min_quantity?: number | null
          operating_hours?: Json | null
          overview?: string | null
          pickup_time?: string | null
          pricing_type?: string | null
          private_transfer_price?: number | null
          safety_requirements?: Json | null
          seasonal_availability?: string | null
          seasonal_pricing?: Json | null
          service_fee?: number | null
          service_fee_enabled?: boolean | null
          sharing_transfer_price?: number | null
          slug?: string | null
          status?: string
          title?: string
          tour_type?: string | null
          transfer_options?: Json | null
          updated_at?: string
          voucher_type?: string | null
          what_to_bring?: Json | null
          wheelchair_accessible?: boolean | null
          why_go?: Json | null
          youtube_link?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
