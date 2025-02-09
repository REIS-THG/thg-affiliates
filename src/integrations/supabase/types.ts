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
      "Forgotten Password requests": {
        Row: {
          Affiliate: boolean | null
          "Coupon Code": string | null
          created_at: string
          id: number
          requestid: string | null
          "THGrow User": boolean | null
          THGrow_pword: string | null
        }
        Insert: {
          Affiliate?: boolean | null
          "Coupon Code"?: string | null
          created_at?: string
          id?: number
          requestid?: string | null
          "THGrow User"?: boolean | null
          THGrow_pword?: string | null
        }
        Update: {
          Affiliate?: boolean | null
          "Coupon Code"?: string | null
          created_at?: string
          id?: number
          requestid?: string | null
          "THGrow User"?: boolean | null
          THGrow_pword?: string | null
        }
        Relationships: []
      }
      Keys: {
        Row: {
          access_token: string | null
          application_id: string | null
          Platform: string
        }
        Insert: {
          access_token?: string | null
          application_id?: string | null
          Platform: string
        }
        Update: {
          access_token?: string | null
          application_id?: string | null
          Platform?: string
        }
        Relationships: []
      }
      password_change_history: {
        Row: {
          changed_at: string | null
          changed_by: string
          coupon_code: string
          id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by: string
          coupon_code: string
          id?: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string
          coupon_code?: string
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      thg_affiliate_admin_users: {
        Row: {
          created_at: string
          id: string
          last_login: string | null
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_login?: string | null
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          last_login?: string | null
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      THG_Affiliate_Coupon_Use_Time: {
        Row: {
          coupon: string | null
          created_at: string
          "Final Purchase Price": number | null
          id: number
          week_used: string | null
        }
        Insert: {
          coupon?: string | null
          created_at?: string
          "Final Purchase Price"?: number | null
          id?: number
          week_used?: string | null
        }
        Update: {
          coupon?: string | null
          created_at?: string
          "Final Purchase Price"?: number | null
          id?: number
          week_used?: string | null
        }
        Relationships: []
      }
      THG_Affiliate_Users: {
        Row: {
          coupon: string | null
          created_at: string
          email_notifications: boolean | null
          id: number
          notification_email: string | null
          notification_frequency: string | null
          password: string | null
          payment_details: string | null
          payment_method: string | null
        }
        Insert: {
          coupon?: string | null
          created_at?: string
          email_notifications?: boolean | null
          id?: number
          notification_email?: string | null
          notification_frequency?: string | null
          password?: string | null
          payment_details?: string | null
          payment_method?: string | null
        }
        Update: {
          coupon?: string | null
          created_at?: string
          email_notifications?: boolean | null
          id?: number
          notification_email?: string | null
          notification_frequency?: string | null
          password?: string | null
          payment_details?: string | null
          payment_method?: string | null
        }
        Relationships: []
      }
      THGrow_admin_login: {
        Row: {
          created_at: string
          email: string
          id: string
          password: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password?: string
        }
        Relationships: []
      }
      THGrow_Consultation_Requests: {
        Row: {
          created_at: string
          detail: string | null
          email: string | null
          id: number
          in_out: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          detail?: string | null
          email?: string | null
          id?: number
          in_out?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          detail?: string | null
          email?: string | null
          id?: number
          in_out?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      THGrow_journal_entries: {
        Row: {
          content: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "THGrow_users"
            referencedColumns: ["id"]
          },
        ]
      }
      THGrow_partners: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          link: string | null
          name: string
          order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          link?: string | null
          name: string
          order: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          link?: string | null
          name?: string
          order?: number
        }
        Relationships: []
      }
      THGrow_Plant_Categories: {
        Row: {
          Category_Name: string | null
          created_at: string
          id: number
        }
        Insert: {
          Category_Name?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          Category_Name?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      THGrow_User: {
        Row: {
          created_at: string
          Email: string | null
          id: number
          Password: string | null
        }
        Insert: {
          created_at?: string
          Email?: string | null
          id?: number
          Password?: string | null
        }
        Update: {
          created_at?: string
          Email?: string | null
          id?: number
          Password?: string | null
        }
        Relationships: []
      }
      THGrow_users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          last_login: string | null
          subscription_level: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          last_login?: string | null
          subscription_level?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          last_login?: string | null
          subscription_level?: string | null
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
