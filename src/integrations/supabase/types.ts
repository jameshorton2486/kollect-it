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
      admin_activity_logs: {
        Row: {
          action_type: string
          admin_id: string
          changes: Json | null
          created_at: string
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id: string
          changes?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          changes?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      admin_dashboard_settings: {
        Row: {
          admin_id: string
          created_at: string
          id: string
          layout_preferences: Json | null
          updated_at: string
          visible_metrics: string[] | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          id?: string
          layout_preferences?: Json | null
          updated_at?: string
          visible_metrics?: string[] | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          id?: string
          layout_preferences?: Json | null
          updated_at?: string
          visible_metrics?: string[] | null
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
      auth_attempts: {
        Row: {
          attempted_at: string | null
          created_at: string
          failure_reason: string | null
          id: string
          ip_address: string
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          attempted_at?: string | null
          created_at?: string
          failure_reason?: string | null
          id?: string
          ip_address: string
          success: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          attempted_at?: string | null
          created_at?: string
          failure_reason?: string | null
          id?: string
          ip_address?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_tokens: {
        Row: {
          client_info: Json | null
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          invalidated_at: string | null
          token: string
          type: Database["public"]["Enums"]["auth_token_type"]
          used_at: string | null
          user_id: string
        }
        Insert: {
          client_info?: Json | null
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          invalidated_at?: string | null
          token: string
          type: Database["public"]["Enums"]["auth_token_type"]
          used_at?: string | null
          user_id: string
        }
        Update: {
          client_info?: Json | null
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invalidated_at?: string | null
          token?: string
          type?: Database["public"]["Enums"]["auth_token_type"]
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      authentication_examples: {
        Row: {
          category: string
          code_snippet: string
          created_at: string
          description: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          code_snippet: string
          created_at?: string
          description: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          code_snippet?: string
          created_at?: string
          description?: string
          id?: string
          title?: string
          updated_at?: string
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
      collection_items_tags: {
        Row: {
          item_id: string
          tag_id: string
        }
        Insert: {
          item_id: string
          tag_id: string
        }
        Update: {
          item_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "personal_collection_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "collection_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_active: boolean | null
          notification_dashboard: boolean | null
          notification_email: boolean | null
          product_id: string
          threshold: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          notification_dashboard?: boolean | null
          notification_email?: boolean | null
          product_id: string
          threshold?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          notification_dashboard?: boolean | null
          notification_email?: boolean | null
          product_id?: string
          threshold?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_history: {
        Row: {
          change_type: string
          created_at: string
          id: string
          new_quantity: number
          previous_quantity: number
          product_id: string
          quantity_change: number
          reason: string | null
          user_id: string
        }
        Insert: {
          change_type: string
          created_at?: string
          id?: string
          new_quantity: number
          previous_quantity: number
          product_id: string
          quantity_change: number
          reason?: string | null
          user_id: string
        }
        Update: {
          change_type?: string
          created_at?: string
          id?: string
          new_quantity?: number
          previous_quantity?: number
          product_id?: string
          quantity_change?: number
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_tracking: {
        Row: {
          avg_daily_sales: number | null
          created_at: string | null
          id: string
          last_order_date: string | null
          last_restock_date: string | null
          low_stock_threshold: number | null
          next_restock_date: string | null
          product_id: string
          seller_id: string
          sold_count: number
          stock: number
          updated_at: string | null
        }
        Insert: {
          avg_daily_sales?: number | null
          created_at?: string | null
          id?: string
          last_order_date?: string | null
          last_restock_date?: string | null
          low_stock_threshold?: number | null
          next_restock_date?: string | null
          product_id: string
          seller_id: string
          sold_count?: number
          stock?: number
          updated_at?: string | null
        }
        Update: {
          avg_daily_sales?: number | null
          created_at?: string | null
          id?: string
          last_order_date?: string | null
          last_restock_date?: string | null
          low_stock_threshold?: number | null
          next_restock_date?: string | null
          product_id?: string
          seller_id?: string
          sold_count?: number
          stock?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempt_time: string | null
          email: string
          id: string
          ip_address: string
          success: boolean
        }
        Insert: {
          attempt_time?: string | null
          email: string
          id?: string
          ip_address: string
          success: boolean
        }
        Update: {
          attempt_time?: string | null
          email?: string
          id?: string
          ip_address?: string
          success?: boolean
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          id: string
          message: string
          order_id: string | null
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          order_id?: string | null
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          order_id?: string | null
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_settings: {
        Row: {
          backup_codes: Json | null
          created_at: string
          enabled: boolean | null
          preferred_method: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: Json | null
          created_at?: string
          enabled?: boolean | null
          preferred_method?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: Json | null
          created_at?: string
          enabled?: boolean | null
          preferred_method?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mfa_verification_attempts: {
        Row: {
          attempt_time: string
          id: string
          ip_address: string | null
          success: boolean | null
          user_id: string | null
          verification_type: string | null
        }
        Insert: {
          attempt_time?: string
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_id?: string | null
          verification_type?: string | null
        }
        Update: {
          attempt_time?: string
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_id?: string | null
          verification_type?: string | null
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
          action_required: boolean | null
          created_at: string | null
          id: string
          message: string
          notification_type: string | null
          order_id: string | null
          priority: string | null
          read: boolean | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action_required?: boolean | null
          created_at?: string | null
          id?: string
          message: string
          notification_type?: string | null
          order_id?: string | null
          priority?: string | null
          read?: boolean | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action_required?: boolean | null
          created_at?: string | null
          id?: string
          message?: string
          notification_type?: string | null
          order_id?: string | null
          priority?: string | null
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
          cancellation_reason: string | null
          cancellation_status: string | null
          cancellation_window: unknown | null
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
          restocking_fee_percentage: number | null
          return_reason: string | null
          return_status: string | null
          return_window: unknown | null
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
          cancellation_reason?: string | null
          cancellation_status?: string | null
          cancellation_window?: unknown | null
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
          restocking_fee_percentage?: number | null
          return_reason?: string | null
          return_status?: string | null
          return_window?: unknown | null
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
          cancellation_reason?: string | null
          cancellation_status?: string | null
          cancellation_window?: unknown | null
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
          restocking_fee_percentage?: number | null
          return_reason?: string | null
          return_status?: string | null
          return_window?: unknown | null
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
      personal_collection_items: {
        Row: {
          collection_type: string
          created_at: string
          id: string
          notes: string | null
          product_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_type: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_collection_items_product_id_fkey"
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
          low_stock_threshold: number | null
          name: string
          price: number
          provenance: string | null
          search_vector: unknown | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          social_shares: number | null
          stock_quantity: number | null
          stock_status: string | null
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
          low_stock_threshold?: number | null
          name: string
          price: number
          provenance?: string | null
          search_vector?: unknown | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          social_shares?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
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
          low_stock_threshold?: number | null
          name?: string
          price?: number
          provenance?: string | null
          search_vector?: unknown | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          social_shares?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
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
          business_name: string | null
          created_at: string
          first_name: string | null
          id: string
          is_seller: boolean | null
          last_name: string | null
          rating: number | null
          seller_since: string | null
          total_sales: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          is_seller?: boolean | null
          last_name?: string | null
          rating?: number | null
          seller_since?: string | null
          total_sales?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_seller?: boolean | null
          last_name?: string | null
          rating?: number | null
          seller_since?: string | null
          total_sales?: number | null
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
          last_notification_sent: string | null
          name: string
          notification_frequency: string | null
          notify: boolean | null
          notify_criteria: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          id?: string
          last_notification_sent?: string | null
          name: string
          notification_frequency?: string | null
          notify?: boolean | null
          notify_criteria?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          id?: string
          last_notification_sent?: string | null
          name?: string
          notification_frequency?: string | null
          notify?: boolean | null
          notify_criteria?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seller_analytics: {
        Row: {
          average_rating: number
          created_at: string
          customer_demographics: Json | null
          growth_rate: number
          id: string
          inventory_metrics: Json | null
          monthly_revenue: Json | null
          most_viewed_products: Json | null
          product_performance: Json | null
          recent_notifications: Json | null
          seller_id: string
          social_engagement_metrics: Json | null
          total_customers: number
          total_orders: number
          total_products: number
          total_revenue: number
          updated_at: string
          yearly_revenue: Json | null
        }
        Insert: {
          average_rating?: number
          created_at?: string
          customer_demographics?: Json | null
          growth_rate?: number
          id?: string
          inventory_metrics?: Json | null
          monthly_revenue?: Json | null
          most_viewed_products?: Json | null
          product_performance?: Json | null
          recent_notifications?: Json | null
          seller_id: string
          social_engagement_metrics?: Json | null
          total_customers?: number
          total_orders?: number
          total_products?: number
          total_revenue?: number
          updated_at?: string
          yearly_revenue?: Json | null
        }
        Update: {
          average_rating?: number
          created_at?: string
          customer_demographics?: Json | null
          growth_rate?: number
          id?: string
          inventory_metrics?: Json | null
          monthly_revenue?: Json | null
          most_viewed_products?: Json | null
          product_performance?: Json | null
          recent_notifications?: Json | null
          seller_id?: string
          social_engagement_metrics?: Json | null
          total_customers?: number
          total_orders?: number
          total_products?: number
          total_revenue?: number
          updated_at?: string
          yearly_revenue?: Json | null
        }
        Relationships: []
      }
      seller_guidelines: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          order_position: number
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_position: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_audit_logs: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_audit_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
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
          device_type: string | null
          id: string
          ip_address: string | null
          platform: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          details?: Json | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          platform?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          details?: Json | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          platform?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          banned_by: string
          created_at: string
          expires_at: string | null
          id: string
          lift_reason: string | null
          lifted_at: string | null
          lifted_by: string | null
          reason: string
          user_id: string
        }
        Insert: {
          banned_by: string
          created_at?: string
          expires_at?: string | null
          id?: string
          lift_reason?: string | null
          lifted_at?: string | null
          lifted_by?: string | null
          reason: string
          user_id: string
        }
        Update: {
          banned_by?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          lift_reason?: string | null
          lifted_at?: string | null
          lifted_by?: string | null
          reason?: string
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
      user_sessions: {
        Row: {
          compliance_accepted: boolean | null
          created_at: string | null
          device_info: Json | null
          expires_at: string
          gdpr_consent: Json | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_active: string | null
          refresh_token: string
          session_metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          compliance_accepted?: boolean | null
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          gdpr_consent?: Json | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active?: string | null
          refresh_token: string
          session_metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          compliance_accepted?: boolean | null
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          gdpr_consent?: Json | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active?: string | null
          refresh_token?: string
          session_metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
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
      check_if_user_banned: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      check_mfa_rate_limit: {
        Args: {
          check_user_id: string
          window_minutes?: number
          max_attempts?: number
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          check_ip: string
          check_email: string
          window_minutes?: number
          max_attempts?: number
        }
        Returns: boolean
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_backup_codes: {
        Args: {
          num_codes?: number
        }
        Returns: string[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
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
      matches_saved_search: {
        Args: {
          product_row: unknown
          search_criteria: Json
        }
        Returns: boolean
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
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
      order_status: "pending" | "shipped" | "delivered" | "cancelled"
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
