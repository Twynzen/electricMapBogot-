# ElectricMap Bogotá

Mapa de estaciones de carga para vehículos eléctricos en Bogotá, Colombia.

## Características

- Mapa interactivo con estaciones de carga
- Filtros por tipo de conector, operador y potencia
- Información detallada de cada estación
- Geolocalización para encontrar estaciones cercanas
- Interfaz optimizada para móvil
- Funciona offline con datos locales

## Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Frontend | Ionic 7 + Angular 17 |
| Mapas | Leaflet + OpenStreetMap |
| Backend | Supabase (PostgreSQL) |
| Build móvil | Capacitor |
| Hosting | Vercel |

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
ionic serve

# Compilar para producción
npm run build:prod

# Generar APK Android
npx cap sync android && npx cap open android
```

## Configuración

Ver [SETUP.md](./SETUP.md) para instrucciones detalladas de:
- Configurar Supabase
- Obtener API key de OpenChargeMap
- Compilar el APK para Android
- Desplegar en producción

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/    # Componentes reutilizables
│   ├── data/          # Datos seed de estaciones
│   ├── models/        # Interfaces TypeScript
│   ├── pages/         # Páginas (map, list, detail, news, about)
│   └── services/      # Servicios (stations, location, supabase)
├── environments/      # Configuración por ambiente
└── theme/             # Variables de estilo
```

## Operadores Incluidos

- Enel X
- Celsia
- Terpel Voltex
- La Rolita (TransMilenio)
- EVConnect Colombia

## Conectores Soportados

- Type 2 (Mennekes)
- Type 1 (J1772)
- CCS2
- CCS1
- CHAdeMO
- GB/T

## Costos

| Servicio | Costo |
|----------|-------|
| Leaflet + OpenStreetMap | Gratis |
| Supabase (free tier) | Gratis |
| OpenChargeMap API | Gratis |
| Vercel hosting | Gratis |
| **Total** | **$0/mes** |

## Roadmap

### MVP (Actual)
- [x] Mapa con estaciones
- [x] Filtros básicos
- [x] Detalle de estación
- [x] Geolocalización
- [x] Datos de 20+ estaciones en Bogotá

### Fase 2
- [ ] Scraping automático de precios
- [ ] Reportes de comunidad
- [ ] Push notifications
- [ ] Autenticación de usuarios

### Fase 3
- [ ] Integración con operadores
- [ ] Pagos in-app
- [ ] Expansión a otras ciudades

## Licencia

MIT

## Créditos

- Datos de estaciones: OpenChargeMap, operadores locales
- Mapas: OpenStreetMap contributors
- Framework: Ionic Team
