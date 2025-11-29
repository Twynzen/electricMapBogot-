-- ============================================
-- ElectricMap Bogotá - Database Schema
-- ============================================
-- Run this script in Supabase SQL Editor to create the database structure.
-- Supabase Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- OPERATORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS operadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  contacto TEXT,
  telefono TEXT,
  web TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for operator lookups
CREATE INDEX IF NOT EXISTS idx_operadores_nombre ON operadores(nombre);

-- ============================================
-- STATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS estaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operador_id UUID REFERENCES operadores(id),
  nombre TEXT NOT NULL,
  lat NUMERIC(10, 7) NOT NULL,
  lng NUMERIC(10, 7) NOT NULL,
  direccion TEXT,
  ciudad TEXT DEFAULT 'Bogotá',
  localidad TEXT,

  -- Charging details (stored as JSONB for flexibility)
  tipos_conector JSONB DEFAULT '[]',
  -- Example: [{"type": "Type2", "powerKw": 22, "quantity": 2}, {"type": "CCS2", "powerKw": 50, "quantity": 1}]

  potencia_kw NUMERIC(6, 2),  -- Max power in kW
  precio_kwh NUMERIC(10, 2),  -- Price per kWh in COP

  -- Status
  estado TEXT DEFAULT 'unknown' CHECK (estado IN ('available', 'busy', 'unavailable', 'unknown')),
  total_puntos INTEGER DEFAULT 1,
  puntos_disponibles INTEGER,

  -- Operating hours
  horario_24h BOOLEAN DEFAULT TRUE,
  horario_notas TEXT,

  -- Amenities (stored as array)
  servicios TEXT[] DEFAULT '{}',
  -- Example: ['parking', 'restroom', 'wifi', 'cafe']

  -- Metadata
  fuente TEXT DEFAULT 'manual' CHECK (fuente IN ('manual', 'ocm', 'scrape', 'operator', 'community')),
  verificada BOOLEAN DEFAULT FALSE,
  ocm_id INTEGER,  -- OpenChargeMap ID if synced
  descripcion TEXT,
  imagen_url TEXT,
  url_externa TEXT,

  -- Timestamps
  ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_estaciones_operador ON estaciones(operador_id);
CREATE INDEX IF NOT EXISTS idx_estaciones_estado ON estaciones(estado);
CREATE INDEX IF NOT EXISTS idx_estaciones_ciudad ON estaciones(ciudad);
CREATE INDEX IF NOT EXISTS idx_estaciones_localidad ON estaciones(localidad);
CREATE INDEX IF NOT EXISTS idx_estaciones_lat_lng ON estaciones(lat, lng);
CREATE INDEX IF NOT EXISTS idx_estaciones_potencia ON estaciones(potencia_kw);
CREATE INDEX IF NOT EXISTS idx_estaciones_updated ON estaciones(ultima_actualizacion);

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS noticias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  resumen TEXT,
  contenido TEXT,
  tipo TEXT DEFAULT 'general' CHECK (tipo IN ('outage', 'price', 'new_station', 'closure', 'promotion', 'regulation', 'general')),
  prioridad TEXT DEFAULT 'medium' CHECK (prioridad IN ('low', 'medium', 'high', 'urgent')),

  -- Related entities
  estacion_id UUID REFERENCES estaciones(id),
  estacion_nombre TEXT,
  operador_id UUID REFERENCES operadores(id),
  operador_nombre TEXT,
  localidad TEXT,

  -- Source
  fuente_url TEXT,
  fuente_nombre TEXT,
  autor TEXT,
  imagen_url TEXT,

  -- Status
  activa BOOLEAN DEFAULT TRUE,
  vistas INTEGER DEFAULT 0,

  -- Timestamps
  fecha_publicacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_expiracion TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for news queries
CREATE INDEX IF NOT EXISTS idx_noticias_tipo ON noticias(tipo);
CREATE INDEX IF NOT EXISTS idx_noticias_activa ON noticias(activa);
CREATE INDEX IF NOT EXISTS idx_noticias_fecha ON noticias(fecha_publicacion DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_estacion ON noticias(estacion_id);

-- ============================================
-- REPORTS TABLE (Community feedback)
-- ============================================
CREATE TABLE IF NOT EXISTS reportes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estacion_id UUID REFERENCES estaciones(id) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('working', 'not_working', 'ice_blocked', 'price_wrong', 'other')),
  comentario TEXT,
  usuario_id UUID,  -- Optional, if using auth
  ip_hash TEXT,     -- Hashed IP for spam prevention

  -- Status
  revisado BOOLEAN DEFAULT FALSE,
  resuelto BOOLEAN DEFAULT FALSE,

  -- Timestamps
  fecha TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for reports
CREATE INDEX IF NOT EXISTS idx_reportes_estacion ON reportes(estacion_id);
CREATE INDEX IF NOT EXISTS idx_reportes_fecha ON reportes(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_reportes_tipo ON reportes(tipo);

-- ============================================
-- PRICE HISTORY TABLE (for tracking changes)
-- ============================================
CREATE TABLE IF NOT EXISTS historial_precios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estacion_id UUID REFERENCES estaciones(id) NOT NULL,
  precio_kwh NUMERIC(10, 2),
  precio_minuto NUMERIC(10, 2),
  notas TEXT,
  fecha TIMESTAMPTZ DEFAULT NOW()
);

-- Index for price history
CREATE INDEX IF NOT EXISTS idx_historial_estacion ON historial_precios(estacion_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_precios(fecha DESC);

-- ============================================
-- VIEWS
-- ============================================

-- View: Stations with operator info
CREATE OR REPLACE VIEW estaciones_completas AS
SELECT
  e.*,
  o.nombre AS operador_nombre,
  o.web AS operador_web,
  o.telefono AS operador_telefono,
  o.logo_url AS operador_logo
FROM estaciones e
LEFT JOIN operadores o ON e.operador_id = o.id;

-- View: Active news
CREATE OR REPLACE VIEW noticias_activas AS
SELECT *
FROM noticias
WHERE activa = TRUE
  AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())
ORDER BY fecha_publicacion DESC;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Update timestamp on record change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for operators
DROP TRIGGER IF EXISTS trigger_operadores_updated ON operadores;
CREATE TRIGGER trigger_operadores_updated
  BEFORE UPDATE ON operadores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function: Get stations within radius (in km)
CREATE OR REPLACE FUNCTION estaciones_cercanas(
  user_lat NUMERIC,
  user_lng NUMERIC,
  radio_km NUMERIC DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  nombre TEXT,
  lat NUMERIC,
  lng NUMERIC,
  direccion TEXT,
  estado TEXT,
  potencia_kw NUMERIC,
  distancia_km NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.nombre,
    e.lat,
    e.lng,
    e.direccion,
    e.estado,
    e.potencia_kw,
    (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(e.lat)) *
        cos(radians(e.lng) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(e.lat))
      )
    )::NUMERIC(10, 2) AS distancia_km
  FROM estaciones e
  WHERE (
    6371 * acos(
      cos(radians(user_lat)) * cos(radians(e.lat)) *
      cos(radians(e.lng) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(e.lat))
    )
  ) <= radio_km
  ORDER BY distancia_km ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE operadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE estaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_precios ENABLE ROW LEVEL SECURITY;

-- Public read access (anon users can read)
CREATE POLICY "Public read operadores" ON operadores FOR SELECT USING (true);
CREATE POLICY "Public read estaciones" ON estaciones FOR SELECT USING (true);
CREATE POLICY "Public read noticias" ON noticias FOR SELECT USING (activa = true);
CREATE POLICY "Public read historial" ON historial_precios FOR SELECT USING (true);

-- Public can create reports
CREATE POLICY "Public create reportes" ON reportes FOR INSERT WITH CHECK (true);

-- ============================================
-- SEED DATA: Operators
-- ============================================

INSERT INTO operadores (id, nombre, contacto, web) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Enel X', 'soporte@enelx.com', 'https://enelx.com/co/es'),
  ('22222222-2222-2222-2222-222222222222', 'Celsia', 'contacto@celsia.com', 'https://www.celsia.com'),
  ('33333333-3333-3333-3333-333333333333', 'Terpel Voltex', 'voltex@terpel.com', 'https://www.terpel.com/nueva-movilidad-y-energias/terpel-voltex'),
  ('44444444-4444-4444-4444-444444444444', 'La Rolita (TransMilenio)', NULL, 'https://www.transmilenio.gov.co'),
  ('55555555-5555-5555-5555-555555555555', 'EVConnect Colombia', 'info@evconnect.com.co', 'https://evconnect.com.co')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED DATA: Sample Stations
-- ============================================

INSERT INTO estaciones (
  nombre, operador_id, lat, lng, direccion, ciudad, localidad,
  tipos_conector, potencia_kw, precio_kwh, estado, total_puntos,
  horario_24h, servicios, fuente, verificada
) VALUES
(
  'Enel X - Portal de las Américas',
  '11111111-1111-1111-1111-111111111111',
  4.6284, -74.1399,
  'Portal de las Américas, Av. Ciudad de Cali',
  'Bogotá', 'Kennedy',
  '[{"type": "Type2", "powerKw": 22, "quantity": 2}, {"type": "CCS2", "powerKw": 50, "quantity": 1}]'::jsonb,
  50, 1600, 'available', 3,
  TRUE, ARRAY['parking', 'restroom', 'wifi'],
  'manual', TRUE
),
(
  'Terpel Voltex - Autopista Norte Km 12',
  '33333333-3333-3333-3333-333333333333',
  4.7890, -74.0350,
  'Autopista Norte Km 12, Estación Terpel',
  'Bogotá', 'Usaquén',
  '[{"type": "CCS2", "powerKw": 150, "quantity": 2}, {"type": "CHAdeMO", "powerKw": 50, "quantity": 1}]'::jsonb,
  150, 1450, 'available', 3,
  TRUE, ARRAY['parking', 'restroom', 'cafe', 'convenience_store'],
  'manual', TRUE
),
(
  'Celsia - Centro Comercial Santa Fe',
  '22222222-2222-2222-2222-222222222222',
  4.7620, -74.0445,
  'Calle 185 #45-03, CC Santa Fe',
  'Bogotá', 'Usaquén',
  '[{"type": "Type2", "powerKw": 22, "quantity": 2}, {"type": "CCS2", "powerKw": 50, "quantity": 1}]'::jsonb,
  50, 1600, 'available', 3,
  FALSE, ARRAY['parking', 'restroom', 'cafe', 'shopping'],
  'manual', TRUE
)
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
-- Your database is now ready for ElectricMap Bogotá.
-- Copy your Supabase URL and anon key to environment.ts
