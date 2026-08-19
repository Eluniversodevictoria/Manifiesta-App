// Tipos generados manualmente — se reemplazarán con `supabase gen types` tras conectar el proyecto
// Actualizar cada vez que se añada o modifique una tabla

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
      // ── USUARIOS Y PLAN ──────────────────────────────────────────
      user_settings: {
        Row: {
          user_id: string;
          // Acceso — fuente de verdad en backend
          access_status: 'trial_active' | 'paid_active' | 'trial_expired' | 'subscription_inactive';
          trial_started_at: string | null;
          trial_ends_at: string | null;
          plan_periodo: 'mensual' | 'anual' | null;
          hotmart_subscription_id: string | null;
          // Legado — mantener para no romper migraciones existentes
          plan: 'free' | 'pro';
          plan_activado_at: string | null;
          // Preferencias
          manifestacion_activa_id: string | null;
          preferencia_media: 'leer' | 'escuchar' | 'ambas';
          is_owner: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_settings']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_settings']['Insert']>;
      };

      // ── MANIFESTACIONES ──────────────────────────────────────────
      manifestaciones: {
        Row: {
          id: string;
          user_id: string;
          deseo: string;
          categoria: string;
          estado: 'activa' | 'manifestada' | 'pausada' | 'archivada';
          color: string;
          icono: string;
          fecha_inicio: string;
          fecha_manifestada: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['manifestaciones']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['manifestaciones']['Insert']>;
      };

      // ── PROGRESO DE PRÁCTICA ─────────────────────────────────────
      practice_progress: {
        Row: {
          id: string;
          user_id: string;
          manifestacion_id: string | null;
          tipo: string;
          completado_at: string;
          duracion_seg: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['practice_progress']['Row'], 'created_at'> & {
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['practice_progress']['Insert']>;
      };

      // ── ÓRDENES DE HOTMART ───────────────────────────────────────
      hotmart_orders: {
        Row: {
          id: string;
          hotmart_order_id: string;
          buyer_email: string;
          buyer_name: string | null;
          user_id: string | null;
          product_id: string;
          offer_code: string | null;
          plan_periodo: 'mensual' | 'anual';
          amount_usd: number;
          currency: string;
          status: 'approved' | 'refunded' | 'cancelled';
          event_type: string;
          hotmart_payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hotmart_orders']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['hotmart_orders']['Insert']>;
      };

      // ── LLAMADAS A IA ────────────────────────────────────────────
      ai_calls: {
        Row: {
          id: string;
          user_id: string;
          tipo: string;
          tokens_in: number | null;
          tokens_out: number | null;
          latency_ms: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_calls']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ai_calls']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
