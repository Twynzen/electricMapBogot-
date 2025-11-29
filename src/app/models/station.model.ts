/**
 * Station and related data models for ElectricMap Bogotá
 */

// Connector types available in Colombia
export type ConnectorType =
  | 'Type2'      // Mennekes - Most common AC
  | 'Type1'      // J1772 - Common AC
  | 'CCS2'       // DC Fast - New standard
  | 'CCS1'       // DC Fast - Common
  | 'CHAdeMO'    // DC - Nissan/Mitsubishi
  | 'GBT'        // Chinese standard
  | 'Tesla'      // Tesla proprietary
  | 'Schuko';    // Standard plug (slow)

// Charging speed category
export type ChargingSpeed = 'slow' | 'fast' | 'rapid' | 'ultra';

// Station operational status
export type StationStatus = 'available' | 'busy' | 'unavailable' | 'unknown';

// Data source for the station
export type DataSource = 'manual' | 'ocm' | 'scrape' | 'operator' | 'community';

// Operator information
export interface Operator {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  logoUrl?: string;
}

// Individual connector at a station
export interface Connector {
  type: ConnectorType;
  powerKw: number;
  quantity: number;
  status?: StationStatus;
}

// Pricing information
export interface Pricing {
  pricePerKwh?: number;      // COP per kWh
  pricePerMinute?: number;   // COP per minute
  pricePerSession?: number;  // COP flat fee
  isFree: boolean;
  currency: string;          // Always 'COP' for Colombia
  notes?: string;
}

// Operating hours
export interface OperatingHours {
  is24Hours: boolean;
  schedule?: {
    [day: string]: { open: string; close: string } | null;
  };
  notes?: string;
}

// Main Station interface
export interface Station {
  id: string;
  name: string;
  operatorId?: string;
  operator?: Operator;

  // Location
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  locality?: string;        // Localidad in Bogotá

  // Charging details
  connectors: Connector[];
  maxPowerKw: number;
  chargingSpeed: ChargingSpeed;

  // Status and availability
  status: StationStatus;
  totalSpots: number;
  availableSpots?: number;

  // Pricing
  pricing?: Pricing;

  // Operating info
  operatingHours?: OperatingHours;
  amenities?: string[];     // e.g., 'wifi', 'restroom', 'cafe', 'parking'

  // Metadata
  source: DataSource;
  verified: boolean;
  lastUpdated: Date;
  createdAt: Date;

  // Community data
  rating?: number;
  reviewCount?: number;

  // Additional info
  description?: string;
  imageUrl?: string;
  externalUrl?: string;
  ocmId?: number;           // OpenChargeMap ID if synced
}

// Station for map display (lighter version)
export interface StationMapMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: StationStatus;
  maxPowerKw: number;
  connectorTypes: ConnectorType[];
  operatorName?: string;
}

// Filter options for station search
export interface StationFilters {
  connectorTypes?: ConnectorType[];
  operators?: string[];
  minPowerKw?: number;
  maxPowerKw?: number;
  status?: StationStatus[];
  chargingSpeed?: ChargingSpeed[];
  isFree?: boolean;
  is24Hours?: boolean;
  hasAmenity?: string[];
}

// Bounding box for map queries
export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Search result with distance
export interface StationSearchResult extends Station {
  distanceKm?: number;
}

// Helper functions

export function getChargingSpeed(powerKw: number): ChargingSpeed {
  if (powerKw <= 7) return 'slow';
  if (powerKw <= 22) return 'fast';
  if (powerKw <= 50) return 'rapid';
  return 'ultra';
}

export function getConnectorLabel(type: ConnectorType): string {
  const labels: Record<ConnectorType, string> = {
    'Type2': 'Tipo 2 (Mennekes)',
    'Type1': 'Tipo 1 (J1772)',
    'CCS2': 'CCS Combo 2',
    'CCS1': 'CCS Combo 1',
    'CHAdeMO': 'CHAdeMO',
    'GBT': 'GB/T',
    'Tesla': 'Tesla',
    'Schuko': 'Schuko (Enchufe)'
  };
  return labels[type] || type;
}

export function getStatusLabel(status: StationStatus): string {
  const labels: Record<StationStatus, string> = {
    'available': 'Disponible',
    'busy': 'Ocupada',
    'unavailable': 'No disponible',
    'unknown': 'Estado desconocido'
  };
  return labels[status] || status;
}

export function getSpeedLabel(speed: ChargingSpeed): string {
  const labels: Record<ChargingSpeed, string> = {
    'slow': 'Carga lenta (≤7 kW)',
    'fast': 'Carga semi-rápida (7-22 kW)',
    'rapid': 'Carga rápida (22-50 kW)',
    'ultra': 'Carga ultra-rápida (>50 kW)'
  };
  return labels[speed] || speed;
}

export function formatPrice(pricing?: Pricing): string {
  if (!pricing) return 'Precio no disponible';
  if (pricing.isFree) return 'Gratis';
  if (pricing.pricePerKwh) {
    return `$${pricing.pricePerKwh.toLocaleString('es-CO')}/kWh`;
  }
  if (pricing.pricePerMinute) {
    return `$${pricing.pricePerMinute.toLocaleString('es-CO')}/min`;
  }
  return 'Consultar precio';
}
