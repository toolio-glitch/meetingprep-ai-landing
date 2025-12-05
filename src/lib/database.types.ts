// Database types for MeetingPrep AI
// Generated from Supabase schema

export interface Database {
  public: {
    Tables: {
      meetings: {
        Row: {
          id: string
          user_id: string
          title: string
          date: string
          time: string
          attendees: string[] | null
          company: string | null
          meeting_type: string
          location: string | null
          description: string | null
          objectives: string | null
          context: string | null
          calendar_event_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          date: string
          time: string
          attendees?: string[] | null
          company?: string | null
          meeting_type?: string
          location?: string | null
          description?: string | null
          objectives?: string | null
          context?: string | null
          calendar_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          date?: string
          time?: string
          attendees?: string[] | null
          company?: string | null
          meeting_type?: string
          location?: string | null
          description?: string | null
          objectives?: string | null
          context?: string | null
          calendar_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      briefs: {
        Row: {
          id: string
          meeting_id: string
          user_id: string
          content: string
          brief_type: string
          ai_model: string
          generation_time_ms: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          user_id: string
          content: string
          brief_type?: string
          ai_model?: string
          generation_time_ms?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          user_id?: string
          content?: string
          brief_type?: string
          ai_model?: string
          generation_time_ms?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          briefs_used_this_month: number
          briefs_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          briefs_used_this_month?: number
          briefs_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          briefs_used_this_month?: number
          briefs_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Convenience types
export type Meeting = Database['public']['Tables']['meetings']['Row']
export type MeetingInsert = Database['public']['Tables']['meetings']['Insert']
export type MeetingUpdate = Database['public']['Tables']['meetings']['Update']

export type Brief = Database['public']['Tables']['briefs']['Row']
export type BriefInsert = Database['public']['Tables']['briefs']['Insert']
export type BriefUpdate = Database['public']['Tables']['briefs']['Update']

export type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row']
export type UserSubscriptionInsert = Database['public']['Tables']['user_subscriptions']['Insert']
export type UserSubscriptionUpdate = Database['public']['Tables']['user_subscriptions']['Update']

// Meeting data from Chrome extension
export interface MeetingData {
  title: string
  date: string
  time: string
  attendees: string[]
  company?: string
  location?: string
  description?: string
  objectives?: string
  context?: string
  calendar_event_id?: string
}

// API response types
export interface BriefGenerationResponse {
  success: boolean
  brief?: Brief | { content: string }
  meeting?: MeetingData | any
  error?: string
  usage?: {
    briefs_used: number
    briefs_limit: number
    plan: string
  }
  generated_at?: string
  generation_time_ms?: number
}

export interface MeetingWithBrief extends Meeting {
  brief?: Brief
}
