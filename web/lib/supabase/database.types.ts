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
          plan: 'free' | 'pro';
          plan_periodo: 'mensual' | 'anual' | null;
          plan_activado_at: string | null;
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
          manifestacion_id: string;
          dia_actual: number;
          ciclo: number;
          racha_actual: number;
          racha_maxima: number;
          ultima_practica_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['practice_progress']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['practice_progress']['Insert']>;
      };

      // ── SNAPSHOTS DE PRÁCTICA ────────────────────────────────────
      practice_snapshots: {
        Row: {
          id: string;
          user_id: string;
          manifestacion_id: string;
          dia: number;
          ciclo: number;
          familia: string;
          template_id: string;
          content_version: string;
          engine_version: string;
          deseo_snapshot: string;
          bloques: Json;
          completed_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['practice_snapshots']['Row'], 'created_at'> & {
          created_at?: string;
        };
        Update: never; // inmutable
      };

      // ── CHECK-INS ────────────────────────────────────────────────
      check_ins: {
        Row: {
          id: string;
          user_id: string;
          manifestacion_id: string;
          practice_snapshot_id: string | null;
          date: string;
          nota: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['check_ins']['Row'], 'created_at'> & {
          created_at?: string;
        };
        Update: never; // inmutable
      };

      // ── SCRIPTING / JOURNALING ───────────────────────────────────
      scripts: {
        Row: {
          id: string;
          user_id: string;
          manifestacion_id: string | null;
          contenido: string;
          modo: 'libre' | 'guiado' | 'urgente';
          intencion: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scripts']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['scripts']['Insert']>;
      };

      // ── BIBLIOTECA: GUARDADOS ────────────────────────────────────
      biblioteca_guardados: {
        Row: {
          user_id: string;
          contenido_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['biblioteca_guardados']['Row'], 'created_at'> & {
          created_at?: string;
        };
        Update: never;
      };

      // ── BIBLIOTECA: RECIENTES ────────────────────────────────────
      biblioteca_recientes: {
        Row: {
          user_id: string;
          contenido_id: string;
          visto_at: string;
        };
        Insert: {
          user_id: string;
          contenido_id: string;
          visto_at?: string;
        };
        Update: Pick<Database['public']['Tables']['biblioteca_recientes']['Row'], 'visto_at'>;
      };

      // ── EVENT LOG ────────────────────────────────────────────────
      event_log: {
        Row: {
          id: string;
          user_id: string;
          event_name: string;
          properties: Json | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['event_log']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
      };

      // ── AI CALLS ─────────────────────────────────────────────────
      ai_calls: {
        Row: {
          id: string;
          user_id: string;
          model: string;
          input_tokens: number;
          output_tokens: number;
          cost_usd: number;
          purpose: string;
          manifestacion_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_calls']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
      };

      // ── Hotmart orders ───────────────────────────────────────────
      hotmart_orders: {
        Row: {
          id: string;
          hotmart_order_id: string;
          buyer_email: string;
          buyer_name: string | null;
          user_id: string | null;
          product_id: string;
          offer_code: string | null;
          plan_periodo: 'mensual' | 'anual' | null;
          amount_usd: number;
          currency: string;
          status: string;
          event_type: string;
          hotmart_payload: Json | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hotmart_orders']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['hotmart_orders']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_owner: { Args: Record<string, never>; Returns: boolean };
      admin_get_metrics: { Args: Record<string, never>; Returns: Json };
      admin_get_users: {
        Args: { search_query?: string | null };
        Returns: Array<{
          user_id: string;
          email: string;
          plan: 'free' | 'pro';
          plan_periodo: 'mensual' | 'anual' | null;
          plan_activado_at: string | null;
          is_owner: boolean;
          manifestaciones_activas: number;
          check_ins_total: number;
          registered_at: string;
        }>;
      };
      admin_update_user_plan: {
        Args: { target_user_id: string; new_plan: 'free' | 'pro'; new_periodo?: 'mensual' | 'anual' | null };
        Returns: void;
      };
      admin_set_owner: { Args: { target_user_id: string; new_value: boolean }; Returns: void };
      admin_get_ai_stats: { Args: Record<string, never>; Returns: Json };
      admin_get_events: { Args: { limit_n?: number; name_filter?: string | null }; Returns: Array<{ id: string; user_id: string; event_name: string; properties: Json | null; created_at: string }> };
      admin_get_funnel_stats: { Args: Record<string, never>; Returns: Json };
    };
    Enums: {
      plan_tipo: 'free' | 'pro';
      plan_periodo: 'mensual' | 'anual';
      manifestacion_estado: 'activa' | 'manifestada' | 'pausada' | 'archivada';
      preferencia_media: 'leer' | 'escuchar' | 'ambas';
      script_modo: 'libre' | 'guiado' | 'urgente';
    };
  };
}
