/**
 * Development environment configuration
 *
 * IMPORTANT: Replace these values with your actual credentials before deploying.
 * See SETUP.md for instructions on obtaining these values.
 */

export const environment = {
  production: false,

  // Supabase Configuration
  // Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
  supabase: {
    url: 'YOUR_SUPABASE_URL',           // e.g., 'https://xxxxx.supabase.co'
    anonKey: 'YOUR_SUPABASE_ANON_KEY'   // Public anon key (safe to expose)
  },

  // OpenChargeMap API
  // Get key from: https://openchargemap.org/site/develop/api
  openChargeMap: {
    apiUrl: 'https://api.openchargemap.io/v3/poi/',
    apiKey: 'YOUR_OCM_API_KEY'  // Free registration required
  },

  // Map Configuration
  map: {
    // Bogotá center coordinates
    defaultCenter: {
      lat: 4.6097,
      lng: -74.0817
    },
    defaultZoom: 12,
    minZoom: 10,
    maxZoom: 18,

    // OpenStreetMap tile server (free, no API key needed)
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

    // Bounding box for Bogotá area (to limit searches)
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
    cacheExpirationMinutes: 15
  }
};
