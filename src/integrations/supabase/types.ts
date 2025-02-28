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
      coupon_usage: {
        Row: {
          code: string
          created_at: string | null
          date: string
          earnings: number
          id: string
          order_status: string | null
          payout_date: string | null
          product_name: string
          quantity: number
        }
        Insert: {
          code: string
          created_at?: string | null
          date: string
          earnings?: number
          id?: string
          order_status?: string | null
          payout_date?: string | null
          product_name: string
          quantity?: number
        }
        Update: {
          code?: string
          created_at?: string | null
          date?: string
          earnings?: number
          id?: string
          order_status?: string | null
          payout_date?: string | null
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_code_fkey"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "thg_affiliate_users"
            referencedColumns: ["coupon"]
          },
        ]
      }
      password_change_history: {
        Row: {
          changed_by: string
          coupon_code: string
          created_at: string | null
          id: string
        }
        Insert: {
          changed_by: string
          coupon_code: string
          created_at?: string | null
          id?: string
        }
        Update: {
          changed_by?: string
          coupon_code?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_change_history_coupon_code_fkey"
            columns: ["coupon_code"]
            isOneToOne: false
            referencedRelation: "thg_affiliate_users"
            referencedColumns: ["coupon"]
          },
        ]
      }
      thg_affiliate_users: {
        Row: {
          coupon: string
          created_at: string | null
          email: string | null
          email_notifications: boolean | null
          id: string
          notification_email: string | null
          notification_frequency: string | null
          password: string
          payment_details: string | null
          payment_method: string | null
          role: string | null
        }
        Insert: {
          coupon: string
          created_at?: string | null
          email?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_email?: string | null
          notification_frequency?: string | null
          password: string
          payment_details?: string | null
          payment_method?: string | null
          role?: string | null
        }
        Update: {
          coupon?: string
          created_at?: string | null
          email?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_email?: string | null
          notification_frequency?: string | null
          password?: string
          payment_details?: string | null
          payment_method?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
