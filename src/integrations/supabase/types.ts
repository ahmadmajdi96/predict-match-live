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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contest_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          expense_date: string
          id: string
          title: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          title: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      leagues: {
        Row: {
          api_id: number | null
          country: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          name_ar: string | null
          prediction_price: number | null
        }
        Insert: {
          api_id?: number | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          name_ar?: string | null
          prediction_price?: number | null
        }
        Update: {
          api_id?: number | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          name_ar?: string | null
          prediction_price?: number | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          api_id: number | null
          away_coach: string | null
          away_formation: string | null
          away_lineup: Json | null
          away_score: number | null
          away_substitutes: Json | null
          away_team_id: string | null
          created_at: string | null
          home_coach: string | null
          home_formation: string | null
          home_lineup: Json | null
          home_score: number | null
          home_substitutes: Json | null
          home_team_id: string | null
          id: string
          kickoff_time: string
          league_id: string | null
          match_details: Json | null
          match_stats: Json | null
          referee: string | null
          stadium: string | null
          status: string | null
          updated_at: string | null
          weather: string | null
        }
        Insert: {
          api_id?: number | null
          away_coach?: string | null
          away_formation?: string | null
          away_lineup?: Json | null
          away_score?: number | null
          away_substitutes?: Json | null
          away_team_id?: string | null
          created_at?: string | null
          home_coach?: string | null
          home_formation?: string | null
          home_lineup?: Json | null
          home_score?: number | null
          home_substitutes?: Json | null
          home_team_id?: string | null
          id?: string
          kickoff_time: string
          league_id?: string | null
          match_details?: Json | null
          match_stats?: Json | null
          referee?: string | null
          stadium?: string | null
          status?: string | null
          updated_at?: string | null
          weather?: string | null
        }
        Update: {
          api_id?: number | null
          away_coach?: string | null
          away_formation?: string | null
          away_lineup?: Json | null
          away_score?: number | null
          away_substitutes?: Json | null
          away_team_id?: string | null
          created_at?: string | null
          home_coach?: string | null
          home_formation?: string | null
          home_lineup?: Json | null
          home_score?: number | null
          home_substitutes?: Json | null
          home_team_id?: string | null
          id?: string
          kickoff_time?: string
          league_id?: string | null
          match_details?: Json | null
          match_stats?: Json | null
          referee?: string | null
          stadium?: string | null
          status?: string | null
          updated_at?: string | null
          weather?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          match_id: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          match_id?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          match_id?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          api_id: number | null
          created_at: string | null
          id: string
          is_substitute: boolean | null
          jersey_number: number | null
          name: string
          name_ar: string | null
          photo_url: string | null
          position: string | null
          team_id: string | null
        }
        Insert: {
          api_id?: number | null
          created_at?: string | null
          id?: string
          is_substitute?: boolean | null
          jersey_number?: number | null
          name: string
          name_ar?: string | null
          photo_url?: string | null
          position?: string | null
          team_id?: string | null
        }
        Update: {
          api_id?: number | null
          created_at?: string | null
          id?: string
          is_substitute?: boolean | null
          jersey_number?: number | null
          name?: string
          name_ar?: string | null
          photo_url?: string | null
          position?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          id: string
          is_paid: boolean | null
          match_id: string
          points_earned: number | null
          predicted_away_score: number
          predicted_first_scorer_id: string | null
          predicted_home_score: number
          predicted_total_cards: number | null
          predicted_total_corners: number | null
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          id?: string
          is_paid?: boolean | null
          match_id: string
          points_earned?: number | null
          predicted_away_score: number
          predicted_first_scorer_id?: string | null
          predicted_home_score: number
          predicted_total_cards?: number | null
          predicted_total_corners?: number | null
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          id?: string
          is_paid?: boolean | null
          match_id?: string
          points_earned?: number | null
          predicted_away_score?: number
          predicted_first_scorer_id?: string | null
          predicted_home_score?: number
          predicted_total_cards?: number | null
          predicted_total_corners?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_predicted_first_scorer_id_fkey"
            columns: ["predicted_first_scorer_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          api_id: number | null
          created_at: string | null
          id: string
          league_id: string | null
          logo_url: string | null
          name: string
          name_ar: string | null
        }
        Insert: {
          api_id?: number | null
          created_at?: string | null
          id?: string
          league_id?: string | null
          logo_url?: string | null
          name: string
          name_ar?: string | null
        }
        Update: {
          api_id?: number | null
          created_at?: string | null
          id?: string
          league_id?: string | null
          logo_url?: string | null
          name?: string
          name_ar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      get_leaderboard: {
        Args: never
        Returns: {
          avatar_url: string
          display_name: string
          id: string
          total_points: number
          total_predictions: number
        }[]
      }
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
