export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      community_moments: {
        Row: {
          id: string;
          headline: string;
          borough: string;
          submitted_at: string;
          is_visible: boolean;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          headline: string;
          borough?: string;
          submitted_at?: string;
          is_visible?: boolean;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          headline?: string;
          borough?: string;
          submitted_at?: string;
          is_visible?: boolean;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      stories_cache: {
        Row: {
          id: string;
          category: 'fix' | 'gather' | 'create' | 'care' | 'custom';
          date_str: string;
          line1: string;
          line2: string;
          detail: string;
          is_ai_generated: boolean;
          generated_at: string;
          borough: string | null;
          fact: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          category: 'fix' | 'gather' | 'create' | 'care' | 'custom';
          date_str: string;
          line1: string;
          line2: string;
          detail: string;
          is_ai_generated?: boolean;
          generated_at?: string;
          borough?: string | null;
          fact?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          category?: 'fix' | 'gather' | 'create' | 'care' | 'custom';
          date_str?: string;
          line1?: string;
          line2?: string;
          detail?: string;
          is_ai_generated?: boolean;
          generated_at?: string;
          borough?: string | null;
          fact?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string | null;
          headline: string;
          borough: string | null;
          is_shared_to_community: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          headline: string;
          borough?: string | null;
          is_shared_to_community?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          headline?: string;
          borough?: string | null;
          is_shared_to_community?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      custom_datasets: {
        Row: {
          id: string;
          dataset_id: string;
          dataset_name: string;
          dataset_url: string | null;
          endpoint: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          dataset_id: string;
          dataset_name: string;
          dataset_url?: string | null;
          endpoint: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          dataset_id?: string;
          dataset_name?: string;
          dataset_url?: string | null;
          endpoint?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_community_likes: {
        Args: {
          entry_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
