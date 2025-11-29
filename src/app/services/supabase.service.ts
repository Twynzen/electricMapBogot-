import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env/environment';

/**
 * Supabase Service
 *
 * Provides access to Supabase client for database operations.
 * Initialize by calling configure() with your credentials.
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private isConfigured = false;

  constructor() {
    this.initializeClient();
  }

  /**
   * Initialize Supabase client with environment credentials
   */
  private initializeClient(): void {
    const { url, anonKey } = environment.supabase;

    // Check if credentials are placeholder values
    if (url === 'YOUR_SUPABASE_URL' || anonKey === 'YOUR_SUPABASE_ANON_KEY') {
      console.warn(
        'Supabase credentials not configured. Using local data only. ' +
        'See SETUP.md for configuration instructions.'
      );
      this.isConfigured = false;
      return;
    }

    try {
      this.supabase = createClient(url, anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        }
      });
      this.isConfigured = true;
      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Get Supabase client instance
   */
  get client(): SupabaseClient | null {
    return this.supabase;
  }

  /**
   * Check if Supabase is configured and ready
   */
  get isReady(): boolean {
    return this.isConfigured && this.supabase !== null;
  }

  /**
   * Get stations from database
   */
  async getStations(options?: {
    limit?: number;
    offset?: number;
    operatorId?: string;
    status?: string;
  }) {
    if (!this.isReady || !this.supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    let query = this.supabase
      .from('estaciones')
      .select(`
        *,
        operador:operadores(*)
      `)
      .order('nombre', { ascending: true });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    if (options?.operatorId) {
      query = query.eq('operador_id', options.operatorId);
    }

    if (options?.status) {
      query = query.eq('estado', options.status);
    }

    return await query;
  }

  /**
   * Get a single station by ID
   */
  async getStation(id: string) {
    if (!this.isReady || !this.supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    return await this.supabase
      .from('estaciones')
      .select(`
        *,
        operador:operadores(*)
      `)
      .eq('id', id)
      .single();
  }

  /**
   * Get stations within a bounding box
   */
  async getStationsInBounds(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) {
    if (!this.isReady || !this.supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    return await this.supabase
      .from('estaciones')
      .select(`
        *,
        operador:operadores(*)
      `)
      .gte('lat', bounds.south)
      .lte('lat', bounds.north)
      .gte('lng', bounds.west)
      .lte('lng', bounds.east);
  }

  /**
   * Get all operators
   */
  async getOperators() {
    if (!this.isReady || !this.supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    return await this.supabase
      .from('operadores')
      .select('*')
      .order('nombre', { ascending: true });
  }

  /**
   * Get news items
   */
  async getNews(options?: { limit?: number; type?: string }) {
    if (!this.isReady || !this.supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    let query = this.supabase
      .from('noticias')
      .select('*')
      .eq('activa', true)
      .order('fecha_publicacion', { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.type) {
      query = query.eq('tipo', options.type);
    }

    return await query;
  }

  /**
   * Submit a station report from user
   */
  async submitReport(report: {
    stationId: string;
    type: 'working' | 'not_working' | 'ice_blocked' | 'other';
    comment?: string;
  }) {
    if (!this.isReady || !this.supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    return await this.supabase
      .from('reportes')
      .insert({
        estacion_id: report.stationId,
        tipo: report.type,
        comentario: report.comment,
        fecha: new Date().toISOString()
      });
  }
}
