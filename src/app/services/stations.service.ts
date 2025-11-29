import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, tap, BehaviorSubject } from 'rxjs';
import { environment } from '@env/environment';
import { SupabaseService } from './supabase.service';
import {
  Station,
  StationMapMarker,
  StationFilters,
  BoundingBox,
  ConnectorType,
  StationStatus,
  getChargingSpeed,
  Connector
} from '../models/station.model';
import { BOGOTA_STATIONS } from '../data/stations.data';

/**
 * Stations Service
 *
 * Manages station data from multiple sources:
 * 1. Local seed data (always available)
 * 2. Supabase database (when configured)
 * 3. OpenChargeMap API (when configured)
 */
@Injectable({
  providedIn: 'root'
})
export class StationsService {
  // Reactive state using signals
  private stationsSignal = signal<Station[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private filtersSignal = signal<StationFilters>({});

  // Public computed values
  readonly stations = this.stationsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();

  // Filtered stations computed
  readonly filteredStations = computed(() => {
    const all = this.stationsSignal();
    const filters = this.filtersSignal();
    return this.applyFilters(all, filters);
  });

  // Map markers computed (lightweight version for map display)
  readonly mapMarkers = computed<StationMapMarker[]>(() => {
    return this.filteredStations().map(s => ({
      id: s.id,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      status: s.status,
      maxPowerKw: s.maxPowerKw,
      connectorTypes: s.connectors.map(c => c.type),
      operatorName: s.operator?.name
    }));
  });

  // Statistics computed
  readonly stats = computed(() => {
    const stations = this.stationsSignal();
    return {
      total: stations.length,
      available: stations.filter(s => s.status === 'available').length,
      unavailable: stations.filter(s => s.status === 'unavailable').length,
      operators: new Set(stations.map(s => s.operator?.name).filter(Boolean)).size
    };
  });

  private lastLoadTime: Date | null = null;
  private readonly CACHE_DURATION_MS = environment.app.cacheExpirationMinutes * 60 * 1000;

  constructor(
    private http: HttpClient,
    private supabase: SupabaseService
  ) {
    // Load initial data
    this.loadStations();
  }

  /**
   * Load stations from all available sources
   */
  async loadStations(forceRefresh = false): Promise<void> {
    // Check cache
    if (!forceRefresh && this.lastLoadTime) {
      const elapsed = Date.now() - this.lastLoadTime.getTime();
      if (elapsed < this.CACHE_DURATION_MS && this.stationsSignal().length > 0) {
        return;
      }
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      let stations: Station[] = [];

      // Try Supabase first
      if (this.supabase.isReady) {
        const { data, error } = await this.supabase.getStations({ limit: 500 });
        if (!error && data && data.length > 0) {
          stations = this.transformSupabaseStations(data);
          console.log(`Loaded ${stations.length} stations from Supabase`);
        }
      }

      // Fall back to or supplement with local data
      if (stations.length === 0) {
        stations = BOGOTA_STATIONS;
        console.log(`Using ${stations.length} local seed stations`);
      }

      this.stationsSignal.set(stations);
      this.lastLoadTime = new Date();
    } catch (error) {
      console.error('Error loading stations:', error);
      this.errorSignal.set('Error al cargar estaciones');
      // Fall back to local data on error
      this.stationsSignal.set(BOGOTA_STATIONS);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Get a single station by ID
   */
  getStation(id: string): Station | undefined {
    return this.stationsSignal().find(s => s.id === id);
  }

  /**
   * Get station by ID (async, fetches from server if not in cache)
   */
  async getStationAsync(id: string): Promise<Station | null> {
    // Check local cache first
    const cached = this.getStation(id);
    if (cached) return cached;

    // Try Supabase
    if (this.supabase.isReady) {
      const { data, error } = await this.supabase.getStation(id);
      if (!error && data) {
        return this.transformSupabaseStation(data);
      }
    }

    // Check local data
    const local = BOGOTA_STATIONS.find(s => s.id === id);
    return local || null;
  }

  /**
   * Get stations within map bounds
   */
  getStationsInBounds(bounds: BoundingBox): Station[] {
    return this.filteredStations().filter(s =>
      s.latitude >= bounds.south &&
      s.latitude <= bounds.north &&
      s.longitude >= bounds.west &&
      s.longitude <= bounds.east
    );
  }

  /**
   * Search stations by text query
   */
  searchStations(query: string): Station[] {
    if (!query || query.length < 2) return this.filteredStations();

    const lowerQuery = query.toLowerCase();
    return this.filteredStations().filter(s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.address.toLowerCase().includes(lowerQuery) ||
      s.operator?.name.toLowerCase().includes(lowerQuery) ||
      s.locality?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get stations near a location
   */
  getStationsNearLocation(lat: number, lng: number, radiusKm: number = 5): Station[] {
    return this.filteredStations()
      .map(s => ({
        ...s,
        distance: this.calculateDistance(lat, lng, s.latitude, s.longitude)
      }))
      .filter(s => s.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Update filters
   */
  setFilters(filters: StationFilters): void {
    this.filtersSignal.set(filters);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filtersSignal.set({});
  }

  /**
   * Get unique connector types from all stations
   */
  getAvailableConnectorTypes(): ConnectorType[] {
    const types = new Set<ConnectorType>();
    this.stationsSignal().forEach(s => {
      s.connectors.forEach(c => types.add(c.type));
    });
    return Array.from(types).sort();
  }

  /**
   * Get unique operators from all stations
   */
  getAvailableOperators(): string[] {
    const operators = new Set<string>();
    this.stationsSignal().forEach(s => {
      if (s.operator?.name) {
        operators.add(s.operator.name);
      }
    });
    return Array.from(operators).sort();
  }

  // =====================
  // Private methods
  // =====================

  private applyFilters(stations: Station[], filters: StationFilters): Station[] {
    if (!filters || Object.keys(filters).length === 0) {
      return stations;
    }

    return stations.filter(station => {
      // Connector type filter
      if (filters.connectorTypes && filters.connectorTypes.length > 0) {
        const stationTypes = station.connectors.map(c => c.type);
        if (!filters.connectorTypes.some(t => stationTypes.includes(t))) {
          return false;
        }
      }

      // Operator filter
      if (filters.operators && filters.operators.length > 0) {
        if (!station.operator?.name || !filters.operators.includes(station.operator.name)) {
          return false;
        }
      }

      // Power filter
      if (filters.minPowerKw && station.maxPowerKw < filters.minPowerKw) {
        return false;
      }
      if (filters.maxPowerKw && station.maxPowerKw > filters.maxPowerKw) {
        return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(station.status)) {
          return false;
        }
      }

      // Charging speed filter
      if (filters.chargingSpeed && filters.chargingSpeed.length > 0) {
        if (!filters.chargingSpeed.includes(station.chargingSpeed)) {
          return false;
        }
      }

      // Free charging filter
      if (filters.isFree !== undefined) {
        if (filters.isFree && !station.pricing?.isFree) {
          return false;
        }
      }

      // 24 hours filter
      if (filters.is24Hours && !station.operatingHours?.is24Hours) {
        return false;
      }

      return true;
    });
  }

  private transformSupabaseStations(data: any[]): Station[] {
    return data.map(row => this.transformSupabaseStation(row));
  }

  private transformSupabaseStation(row: any): Station {
    const connectors: Connector[] = (row.tipos_conector || []).map((c: any) => ({
      type: c.type || 'Type2',
      powerKw: c.powerKw || row.potencia_kw || 22,
      quantity: c.quantity || 1,
      status: 'available' as StationStatus
    }));

    const maxPower = Math.max(...connectors.map(c => c.powerKw), row.potencia_kw || 22);

    return {
      id: row.id,
      name: row.nombre,
      operatorId: row.operador_id,
      operator: row.operador ? {
        id: row.operador.id,
        name: row.operador.nombre,
        website: row.operador.web,
        contactPhone: row.operador.contacto
      } : undefined,
      latitude: parseFloat(row.lat),
      longitude: parseFloat(row.lng),
      address: row.direccion || 'Dirección no disponible',
      city: 'Bogotá',
      locality: row.localidad,
      connectors: connectors.length > 0 ? connectors : [{
        type: 'Type2' as ConnectorType,
        powerKw: row.potencia_kw || 22,
        quantity: 1
      }],
      maxPowerKw: maxPower,
      chargingSpeed: getChargingSpeed(maxPower),
      status: (row.estado as StationStatus) || 'unknown',
      totalSpots: connectors.reduce((sum, c) => sum + c.quantity, 0) || 1,
      pricing: row.precio_kwh ? {
        pricePerKwh: row.precio_kwh,
        isFree: row.precio_kwh === 0,
        currency: 'COP'
      } : undefined,
      operatingHours: {
        is24Hours: row.horario_24h ?? true
      },
      source: row.fuente || 'manual',
      verified: row.verificada || false,
      lastUpdated: new Date(row.ultima_actualizacion || row.created_at),
      createdAt: new Date(row.created_at || Date.now())
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
