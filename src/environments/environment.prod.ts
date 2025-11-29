/**
 * Production environment configuration
 *
 * IMPORTANT: Replace these values with your actual credentials before deploying.
 * For production, consider using environment variables or a secrets manager.
 */

export const environment = {
  production: true,

  // Supabase Configuration
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
  },

  // OpenChargeMap API
  openChargeMap: {
    apiUrl: 'https://api.openchargemap.io/v3/poi/',
    apiKey: 'YOUR_OCM_API_KEY'
  },

  // Map Configuration
  map: {
    defaultCenter: {
      lat: 4.6097,
      lng: -74.0817
    },
    defaultZoom: 12,
    minZoom: 10,
    maxZoom: 18,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    bogotaBounds: {
      north: 4.85,
      south: 4.45,
      east: -73.90,
      west: -74.25
    }
  },

  // App Configuration
  app: {
    name: 'ElectricMap Bogotá',
    version: '1.0.0',
    defaultLanguage: 'es',
    cacheExpirationMinutes: 30
  }
};
