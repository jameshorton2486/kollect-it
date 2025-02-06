export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      articles: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      auth_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          type: Database["public"]["Enums"]["auth_token_type"]
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          type: Database["public"]["Enums"]["auth_token_type"]
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          type?: Database["public"]["Enums"]["auth_token_type"]
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          guest_email: string | null
          guest_session_id: string | null
          id: string
          last_activity: string | null
          product_id: string
          quantity: number
          reminder_sent: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          guest_email?: string | null
          guest_session_id?: string | null
          id?: string
          last_activity?: string | null
          product_id: string
          quantity?: number
          reminder_sent?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          guest_email?: string | null
          guest_session_id?: string | null
          id?: string
          last_activity?: string | null
          product_id?: string
          quantity?: number
          reminder_sent?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string
          email_order_updates: boolean | null
          email_promotions: boolean | null
          id: string
          push_order_updates: boolean | null
          push_promotions: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_order_updates?: boolean | null
          email_promotions?: boolean | null
          id?: string
          push_order_updates?: boolean | null
          push_promotions?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_order_updates?: boolean | null
          email_promotions?: boolean | null
          id?: string
          push_order_updates?: boolean | null
          push_promotions?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price_at_time: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_at_time: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_at_time?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          order_id: string | null
          read: boolean | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          order_id?: string | null
          read?: boolean | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          order_id?: string | null
          read?: boolean | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          estimated_delivery_date: string | null
          guest_info: Json | null
          id: string
          payment_intent_id: string | null
          payment_method: string | null
          payment_method_details: Json | null
          payment_status: string | null
          product_id: string
          refund_amount: number | null
          refund_status: string | null
          return_reason: string | null
          return_status: string | null
          seller_id: string
          shipping_address: Json
          shipping_label_url: string | null
          shipping_method: string | null
          status: string
          total_amount: number
          tracking_carrier: string | null
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          estimated_delivery_date?: string | null
          guest_info?: Json | null
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_method_details?: Json | null
          payment_status?: string | null
          product_id: string
          refund_amount?: number | null
          refund_status?: string | null
          return_reason?: string | null
          return_status?: string | null
          seller_id: string
          shipping_address?: Json
          shipping_label_url?: string | null
          shipping_method?: string | null
          status?: string
          total_amount: number
          tracking_carrier?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          estimated_delivery_date?: string | null
          guest_info?: Json | null
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_method_details?: Json | null
          payment_status?: string | null
          product_id?: string
          refund_amount?: number | null
          refund_status?: string | null
          return_reason?: string | null
          return_status?: string | null
          seller_id?: string
          shipping_address?: Json
          shipping_label_url?: string | null
          shipping_method?: string | null
          status?: string
          total_amount?: number
          tracking_carrier?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          product_id: string | null
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          image_url: string
          product_id?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          condition: string | null
          created_at: string
          description: string | null
          era: string | null
          estimated_age: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          provenance: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          social_shares: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          era?: string | null
          estimated_age?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          provenance?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          social_shares?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          era?: string | null
          estimated_age?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          provenance?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          social_shares?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          buyer_id: string
          comment: string | null
          communication_rating: number | null
          condition_accuracy: number | null
          created_at: string
          id: string
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          order_id: string
          price_satisfaction: number | null
          product_accuracy: number | null
          product_quality: number | null
          rating: number
          seller_id: string
          shipping_speed: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          comment?: string | null
          communication_rating?: number | null
          condition_accuracy?: number | null
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          order_id: string
          price_satisfaction?: number | null
          product_accuracy?: number | null
          product_quality?: number | null
          rating: number
          seller_id: string
          shipping_speed?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          comment?: string | null
          communication_rating?: number | null
          condition_accuracy?: number | null
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          order_id?: string
          price_satisfaction?: number | null
          product_accuracy?: number | null
          product_quality?: number | null
          rating?: number
          seller_id?: string
          shipping_speed?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string | null
          criteria: Json
          id: string
          name: string
          notify: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          id?: string
          name: string
          notify?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          id?: string
          name?: string
          notify?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seller_analytics: {
        Row: {
          average_rating: number
          created_at: string
          growth_rate: number
          id: string
          seller_id: string
          total_customers: number
          total_orders: number
          total_products: number
          total_revenue: number
          updated_at: string
        }
        Insert: {
          average_rating?: number
          created_at?: string
          growth_rate?: number
          id?: string
          seller_id: string
          total_customers?: number
          total_orders?: number
          total_products?: number
          total_revenue?: number
          updated_at?: string
        }
        Update: {
          average_rating?: number
          created_at?: string
          growth_rate?: number
          id?: string
          seller_id?: string
          total_customers?: number
          total_orders?: number
          total_products?: number
          total_revenue?: number
          updated_at?: string
        }
        Relationships: []
      }
      shipping_zones: {
        Row: {
          additional_item_cost: number
          base_cost: number
          country: string
          created_at: string
          estimated_days_max: number
          estimated_days_min: number
          free_shipping_threshold: number | null
          id: string
          name: string
          state: string | null
          updated_at: string
          zip_code_pattern: string | null
        }
        Insert: {
          additional_item_cost?: number
          base_cost?: number
          country: string
          created_at?: string
          estimated_days_max: number
          estimated_days_min: number
          free_shipping_threshold?: number | null
          id?: string
          name: string
          state?: string | null
          updated_at?: string
          zip_code_pattern?: string | null
        }
        Update: {
          additional_item_cost?: number
          base_cost?: number
          country?: string
          created_at?: string
          estimated_days_max?: number
          estimated_days_min?: number
          free_shipping_threshold?: number | null
          id?: string
          name?: string
          state?: string | null
          updated_at?: string
          zip_code_pattern?: string | null
        }
        Relationships: []
      }
      social_shares: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          product_id: string | null
          shared_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          product_id?: string | null
          shared_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          product_id?: string | null
          shared_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_shares_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json | null
          id: string
          item_limit: number
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json | null
          id?: string
          item_limit: number
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json | null
          id?: string
          item_limit?: number
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_type: string
          created_at: string
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          plan_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_product_rating: {
        Args: {
          product_uuid: string
        }
        Returns: {
          avg_quality: number
          avg_price_satisfaction: number
          avg_condition: number
          total_reviews: number
        }[]
      }
      calculate_seller_rating: {
        Args: {
          seller_uuid: string
        }
        Returns: {
          avg_communication: number
          avg_shipping: number
          avg_accuracy: number
          total_reviews: number
        }[]
      }
      calculate_shipping_cost: {
        Args: {
          p_total_amount: number
          p_item_count: number
          p_country: string
          p_state?: string
          p_zip_code?: string
        }
        Returns: {
          base_cost: number
          total_cost: number
          estimated_days_min: number
          estimated_days_max: number
          is_free_shipping: boolean
        }[]
      }
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      log_activity: {
        Args: {
          activity: Database["public"]["Enums"]["activity_type"]
          details?: Json
          ip_address?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      activity_type:
        | "login"
        | "logout"
        | "profile_update"
        | "password_change"
        | "role_change"
        | "content_create"
        | "content_update"
        | "content_delete"
        | "category_create"
        | "category_update"
        | "category_delete"
      auth_token_type: "email_verification" | "password_reset"
      user_role: "buyer" | "seller" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
