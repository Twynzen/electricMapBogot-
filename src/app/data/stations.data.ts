import { Station, ConnectorType, StationStatus, Operator } from '../models/station.model';

/**
 * Seed data for Bogotá charging stations
 *
 * This data is used as fallback when Supabase is not configured.
 * Based on real operator data from the research phase.
 *
 * Sources:
 * - Enel X Colombia
 * - Celsia Movilidad
 * - Terpel Voltex
 * - OpenChargeMap
 * - Manual verification
 */

// Operators
export const OPERATORS: Record<string, Operator> = {
  'enel-x': {
    id: 'enel-x',
    name: 'Enel X',
    website: 'https://enelx.com/co/es',
    contactPhone: '+57 1 601 2347'
  },
  'celsia': {
    id: 'celsia',
    name: 'Celsia',
    website: 'https://www.celsia.com',
    contactPhone: '+57 1 601 3456'
  },
  'terpel': {
    id: 'terpel',
    name: 'Terpel Voltex',
    website: 'https://www.terpel.com/nueva-movilidad-y-energias/terpel-voltex',
    contactPhone: '+57 1 601 7890'
  },
  'la-rolita': {
    id: 'la-rolita',
    name: 'La Rolita (TransMilenio)',
    website: 'https://www.transmilenio.gov.co'
  },
  'evconnect': {
    id: 'evconnect',
    name: 'EVConnect Colombia',
    website: 'https://evconnect.com.co'
  },
  'otro': {
    id: 'otro',
    name: 'Otro operador',
  }
};

// Bogotá charging stations
export const BOGOTA_STATIONS: Station[] = [
  // ============================================
  // ENEL X STATIONS
  // ============================================
  {
    id: 'enel-portal-americas',
    name: 'Enel X - Portal de las Américas',
    operatorId: 'enel-x',
    operator: OPERATORS['enel-x'],
    latitude: 4.6284,
    longitude: -74.1399,
    address: 'Portal de las Américas, Av. Ciudad de Cali',
    city: 'Bogotá',
    locality: 'Kennedy',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', powerKw: 50, quantity: 1 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 1600,
      isFree: false,
      currency: 'COP',
      notes: 'Requiere app Enel X Way'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom', 'wifi'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-11-01'),
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'enel-portal-norte',
    name: 'Enel X - Portal Norte',
    operatorId: 'enel-x',
    operator: OPERATORS['enel-x'],
    latitude: 4.7541,
    longitude: -74.0462,
    address: 'Portal Norte, Autopista Norte',
    city: 'Bogotá',
    locality: 'Usaquén',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', powerKw: 50, quantity: 1 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 1600,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-11-01'),
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'enel-san-andresito-38',
    name: 'Enel X - San Andresito de la 38',
    operatorId: 'enel-x',
    operator: OPERATORS['enel-x'],
    latitude: 4.6198,
    longitude: -74.0929,
    address: 'Carrera 38 #10-25, San Andresito',
    city: 'Bogotá',
    locality: 'Puente Aranda',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 }
    ],
    maxPowerKw: 22,
    chargingSpeed: 'fast',
    status: 'available',
    totalSpots: 2,
    pricing: {
      pricePerKwh: 1400,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: false, notes: '6:00 AM - 10:00 PM' },
    amenities: ['parking'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-15'),
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'enel-cc-titan',
    name: 'Enel X - Centro Comercial Titán Plaza',
    operatorId: 'enel-x',
    operator: OPERATORS['enel-x'],
    latitude: 4.6958,
    longitude: -74.0706,
    address: 'Av. Boyacá #80-94, CC Titán Plaza',
    city: 'Bogotá',
    locality: 'Engativá',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', powerKw: 50, quantity: 1 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 1800,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: false, notes: '10:00 AM - 9:00 PM' },
    amenities: ['parking', 'restroom', 'cafe', 'shopping'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-20'),
    createdAt: new Date('2024-03-01')
  },
  {
    id: 'enel-unicentro',
    name: 'Enel X - Centro Comercial Unicentro',
    operatorId: 'enel-x',
    operator: OPERATORS['enel-x'],
    latitude: 4.7010,
    longitude: -74.0426,
    address: 'Av. 15 #124-30, CC Unicentro',
    city: 'Bogotá',
    locality: 'Usaquén',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', powerKw: 50, quantity: 2 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 4,
    pricing: {
      pricePerKwh: 1800,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: false, notes: '10:00 AM - 9:00 PM' },
    amenities: ['parking', 'restroom', 'cafe', 'shopping'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-11-10'),
    createdAt: new Date('2024-03-15')
  },
  {
    id: 'enel-cc-andino',
    name: 'Enel X - Centro Comercial Andino',
    operatorId: 'enel-x',
    operator: OPERATORS['enel-x'],
    latitude: 4.6669,
    longitude: -74.0531,
    address: 'Carrera 11 #82-71, CC Andino',
    city: 'Bogotá',
    locality: 'Chapinero',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', powerKw: 50, quantity: 1 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 2000,
      isFree: false,
      currency: 'COP',
      notes: 'Zona premium'
    },
    operatingHours: { is24Hours: false, notes: '10:00 AM - 9:00 PM' },
    amenities: ['parking', 'restroom', 'cafe', 'shopping'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-11-05'),
    createdAt: new Date('2024-04-01')
  },

  // ============================================
  // CELSIA STATIONS
  // ============================================
  {
    id: 'celsia-calle-100',
    name: 'Celsia - World Trade Center',
    operatorId: 'celsia',
    operator: OPERATORS['celsia'],
    latitude: 4.6850,
    longitude: -74.0480,
    address: 'Calle 100 #8A-55, World Trade Center',
    city: 'Bogotá',
    locality: 'Usaquén',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', powerKw: 60, quantity: 1 }
    ],
    maxPowerKw: 60,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 1500,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: false, notes: '6:00 AM - 10:00 PM' },
    amenities: ['parking', 'restroom', 'wifi'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-25'),
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'celsia-cc-santa-fe',
    name: 'Celsia - Centro Comercial Santa Fe',
    operatorId: 'celsia',
    operator: OPERATORS['celsia'],
    latitude: 4.7620,
    longitude: -74.0445,
    address: 'Calle 185 #45-03, CC Santa Fe',
    city: 'Bogotá',
    locality: 'Usaquén',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', powerKw: 50, quantity: 1 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 1600,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: false, notes: '10:00 AM - 9:00 PM' },
    amenities: ['parking', 'restroom', 'cafe', 'shopping'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-28'),
    createdAt: new Date('2024-03-01')
  },

  // ============================================
  // TERPEL VOLTEX STATIONS
  // ============================================
  {
    id: 'terpel-autopista-norte',
    name: 'Terpel Voltex - Autopista Norte Km 12',
    operatorId: 'terpel',
    operator: OPERATORS['terpel'],
    latitude: 4.7890,
    longitude: -74.0350,
    address: 'Autopista Norte Km 12, Estación Terpel',
    city: 'Bogotá',
    locality: 'Usaquén',
    connectors: [
      { type: 'CCS2', powerKw: 150, quantity: 2 },
      { type: 'CHAdeMO', powerKw: 50, quantity: 1 }
    ],
    maxPowerKw: 150,
    chargingSpeed: 'ultra',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 1450,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom', 'cafe', 'convenience_store'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-11-01'),
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'terpel-calle-80',
    name: 'Terpel Voltex - Avenida Calle 80',
    operatorId: 'terpel',
    operator: OPERATORS['terpel'],
    latitude: 4.6921,
    longitude: -74.0834,
    address: 'Av. Calle 80 #68-98, Estación Terpel',
    city: 'Bogotá',
    locality: 'Engativá',
    connectors: [
      { type: 'CCS2', powerKw: 100, quantity: 1 },
      { type: 'Type2', powerKw: 22, quantity: 1 }
    ],
    maxPowerKw: 100,
    chargingSpeed: 'ultra',
    status: 'available',
    totalSpots: 2,
    pricing: {
      pricePerKwh: 1450,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom', 'convenience_store'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-30'),
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'terpel-suba',
    name: 'Terpel Voltex - Suba',
    operatorId: 'terpel',
    operator: OPERATORS['terpel'],
    latitude: 4.7400,
    longitude: -74.0850,
    address: 'Av. Suba #116-80, Estación Terpel',
    city: 'Bogotá',
    locality: 'Suba',
    connectors: [
      { type: 'CCS2', powerKw: 50, quantity: 1 },
      { type: 'Type2', powerKw: 22, quantity: 1 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 2,
    pricing: {
      pricePerKwh: 1450,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom', 'convenience_store'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-25'),
    createdAt: new Date('2024-03-01')
  },

  // ============================================
  // LA ROLITA (TRANSMILENIO) STATIONS
  // ============================================
  {
    id: 'rolita-portal-80',
    name: 'La Rolita - Portal 80',
    operatorId: 'la-rolita',
    operator: OPERATORS['la-rolita'],
    latitude: 4.6933,
    longitude: -74.0933,
    address: 'Portal 80, Av. Calle 80',
    city: 'Bogotá',
    locality: 'Engativá',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 4 }
    ],
    maxPowerKw: 22,
    chargingSpeed: 'fast',
    status: 'available',
    totalSpots: 4,
    pricing: {
      pricePerKwh: 1200,
      isFree: false,
      currency: 'COP',
      notes: 'Precio subsidiado para taxis eléctricos'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-11-01'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'rolita-portal-sur',
    name: 'La Rolita - Portal Sur',
    operatorId: 'la-rolita',
    operator: OPERATORS['la-rolita'],
    latitude: 4.5960,
    longitude: -74.1395,
    address: 'Portal Sur, Autopista Sur',
    city: 'Bogotá',
    locality: 'Bosa',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 4 }
    ],
    maxPowerKw: 22,
    chargingSpeed: 'fast',
    status: 'available',
    totalSpots: 4,
    pricing: {
      pricePerKwh: 1200,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-28'),
    createdAt: new Date('2024-01-10')
  },

  // ============================================
  // OTHER / FREE CHARGERS
  // ============================================
  {
    id: 'parque-93',
    name: 'Estación Parque de la 93',
    operatorId: 'evconnect',
    operator: OPERATORS['evconnect'],
    latitude: 4.6768,
    longitude: -74.0484,
    address: 'Carrera 13 #93A-45',
    city: 'Bogotá',
    locality: 'Chapinero',
    connectors: [
      { type: 'Type2', powerKw: 7, quantity: 2 }
    ],
    maxPowerKw: 7,
    chargingSpeed: 'slow',
    status: 'available',
    totalSpots: 2,
    pricing: {
      pricePerKwh: 0,
      isFree: true,
      currency: 'COP',
      notes: 'Gratis por tiempo limitado'
    },
    operatingHours: { is24Hours: false, notes: '6:00 AM - 10:00 PM' },
    amenities: ['parking'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-15'),
    createdAt: new Date('2024-04-01')
  },
  {
    id: 'cc-gran-estacion',
    name: 'Centro Comercial Gran Estación',
    operatorId: 'enel-x',
    operator: OPERATORS['enel-x'],
    latitude: 4.6474,
    longitude: -74.1020,
    address: 'Av. Calle 26 #62-47, Gran Estación',
    city: 'Bogotá',
    locality: 'Fontibón',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', powerKw: 50, quantity: 1 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 1700,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: false, notes: '10:00 AM - 9:00 PM' },
    amenities: ['parking', 'restroom', 'cafe', 'shopping'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-11-05'),
    createdAt: new Date('2024-03-20')
  },
  {
    id: 'cc-plaza-imperial',
    name: 'Centro Comercial Plaza Imperial',
    operatorId: 'celsia',
    operator: OPERATORS['celsia'],
    latitude: 4.7350,
    longitude: -74.0920,
    address: 'Av. Calle 134 #9-51, Plaza Imperial',
    city: 'Bogotá',
    locality: 'Suba',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 }
    ],
    maxPowerKw: 22,
    chargingSpeed: 'fast',
    status: 'available',
    totalSpots: 2,
    pricing: {
      pricePerKwh: 1500,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: false, notes: '10:00 AM - 9:00 PM' },
    amenities: ['parking', 'restroom', 'shopping'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-20'),
    createdAt: new Date('2024-04-15')
  },
  {
    id: 'hotel-tequendama',
    name: 'Hotel Tequendama',
    operatorId: 'otro',
    operator: OPERATORS['otro'],
    latitude: 4.6130,
    longitude: -74.0693,
    address: 'Carrera 10 #26-21, Centro Internacional',
    city: 'Bogotá',
    locality: 'Santa Fe',
    connectors: [
      { type: 'Type2', powerKw: 11, quantity: 2 }
    ],
    maxPowerKw: 11,
    chargingSpeed: 'fast',
    status: 'available',
    totalSpots: 2,
    pricing: {
      pricePerKwh: 0,
      isFree: true,
      currency: 'COP',
      notes: 'Gratis para huéspedes'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom', 'wifi', 'hotel'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-09-15'),
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'aeropuerto-eldorado',
    name: 'Aeropuerto El Dorado - Parqueadero',
    operatorId: 'enel-x',
    operator: OPERATORS['enel-x'],
    latitude: 4.7016,
    longitude: -74.1469,
    address: 'Aeropuerto Internacional El Dorado, Parqueadero P5',
    city: 'Bogotá',
    locality: 'Fontibón',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 4 },
      { type: 'CCS2', powerKw: 50, quantity: 2 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 6,
    pricing: {
      pricePerKwh: 1800,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom', 'wifi'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-11-10'),
    createdAt: new Date('2024-01-05')
  },

  // ============================================
  // ADDITIONAL STATIONS FOR COVERAGE
  // ============================================
  {
    id: 'cc-hayuelos',
    name: 'Centro Comercial Hayuelos',
    operatorId: 'celsia',
    operator: OPERATORS['celsia'],
    latitude: 4.6610,
    longitude: -74.1195,
    address: 'Calle 20 #82-52, CC Hayuelos',
    city: 'Bogotá',
    locality: 'Fontibón',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 }
    ],
    maxPowerKw: 22,
    chargingSpeed: 'fast',
    status: 'available',
    totalSpots: 2,
    pricing: {
      pricePerKwh: 1500,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: false, notes: '10:00 AM - 9:00 PM' },
    amenities: ['parking', 'restroom', 'shopping'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-18'),
    createdAt: new Date('2024-05-01')
  },
  {
    id: 'terpel-via-soacha',
    name: 'Terpel Voltex - Vía Soacha',
    operatorId: 'terpel',
    operator: OPERATORS['terpel'],
    latitude: 4.5860,
    longitude: -74.1970,
    address: 'Autopista Sur Km 8, Estación Terpel',
    city: 'Soacha',
    locality: 'Soacha',
    connectors: [
      { type: 'CCS2', powerKw: 100, quantity: 2 },
      { type: 'CHAdeMO', powerKw: 50, quantity: 1 }
    ],
    maxPowerKw: 100,
    chargingSpeed: 'ultra',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 1450,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: true },
    amenities: ['parking', 'restroom', 'cafe', 'convenience_store'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-10-25'),
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'cc-centro-mayor',
    name: 'Centro Comercial Centro Mayor',
    operatorId: 'enel-x',
    operator: OPERATORS['enel-x'],
    latitude: 4.5925,
    longitude: -74.1265,
    address: 'Av. NQS #38A Sur-50, CC Centro Mayor',
    city: 'Bogotá',
    locality: 'Antonio Nariño',
    connectors: [
      { type: 'Type2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', powerKw: 50, quantity: 1 }
    ],
    maxPowerKw: 50,
    chargingSpeed: 'rapid',
    status: 'available',
    totalSpots: 3,
    pricing: {
      pricePerKwh: 1600,
      isFree: false,
      currency: 'COP'
    },
    operatingHours: { is24Hours: false, notes: '10:00 AM - 9:00 PM' },
    amenities: ['parking', 'restroom', 'shopping'],
    source: 'manual',
    verified: true,
    lastUpdated: new Date('2025-11-01'),
    createdAt: new Date('2024-04-01')
  }
];

/**
 * Get all unique localities from stations
 */
export function getLocalities(): string[] {
  const localities = new Set<string>();
  BOGOTA_STATIONS.forEach(s => {
    if (s.locality) localities.add(s.locality);
  });
  return Array.from(localities).sort();
}

/**
 * Get station count by operator
 */
export function getStationsByOperator(): Record<string, number> {
  const counts: Record<string, number> = {};
  BOGOTA_STATIONS.forEach(s => {
    const operatorName = s.operator?.name || 'Desconocido';
    counts[operatorName] = (counts[operatorName] || 0) + 1;
  });
  return counts;
}
