export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          createdAt: string | null
          id: string
          name: string | null
          token: string | null
          url: string | null
        }
        Insert: {
          createdAt?: string | null
          id: string
          name?: string | null
          token?: string | null
          url?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: string
          name?: string | null
          token?: string | null
          url?: string | null
        }
        Relationships: []
      }
      measurements: {
        Row: {
          createdAt: string | null
          deviceId: string | null
          id: number
          ppm: number | null
          source: string | null
          temperature: number | null
        }
        Insert: {
          createdAt?: string | null
          deviceId?: string | null
          id?: number
          ppm?: number | null
          source?: string | null
          temperature?: number | null
        }
        Update: {
          createdAt?: string | null
          deviceId?: string | null
          id?: number
          ppm?: number | null
          source?: string | null
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measurements_deviceId_fkey"
            columns: ["deviceId"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_daily_sample: {
        Args: {
          p_deviceid: string
        }
        Returns: {
          createdAt: string | null
          deviceId: string | null
          id: number
          ppm: number | null
          source: string | null
          temperature: number | null
        }[]
      }
      get_weekly_sample: {
        Args: {
          p_deviceid: string
        }
        Returns: {
          createdAt: string | null
          deviceId: string | null
          id: number
          ppm: number | null
          source: string | null
          temperature: number | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
