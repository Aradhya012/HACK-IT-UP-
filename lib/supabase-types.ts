export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          repo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          repo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          repo_url?: string | null
          created_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          project_id: string
          severity_counts: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          severity_counts?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          severity_counts?: Json | null
          created_at?: string
        }
      }
      vulnerabilities: {
        Row: {
          id: string
          scan_id: string
          severity: string
          file_path: string
          line_number: number
          description: string
          code_snippet: string
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          severity: string
          file_path: string
          line_number: number
          description: string
          code_snippet: string
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          severity?: string
          file_path?: string
          line_number?: number
          description?: string
          code_snippet?: string
          created_at?: string
        }
      }
      patches: {
        Row: {
          id: string
          scan_id: string
          vulnerability_id: string
          before_code: string | null
          after_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          vulnerability_id: string
          before_code?: string | null
          after_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          vulnerability_id?: string
          before_code?: string | null
          after_code?: string | null
          created_at?: string
        }
      }
      timeline_events: {
        Row: {
          id: string
          project_id: string
          event_type: string
          event_message: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          event_type: string
          event_message: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          event_type?: string
          event_message?: string
          created_at?: string
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
      [_ in never]: never
    }
  }
}