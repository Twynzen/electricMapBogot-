# ElectricMap Bogotá - Guía de Configuración

Esta guía te ayudará a configurar y ejecutar el proyecto completo.

## Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Local](#instalación-local)
3. [Configurar Supabase](#configurar-supabase)
4. [Configurar OpenChargeMap](#configurar-openchargemap)
5. [Ejecutar el Proyecto](#ejecutar-el-proyecto)
6. [Compilar para Android (APK)](#compilar-para-android-apk)
7. [Desplegar en Producción](#desplegar-en-producción)

---

## Requisitos Previos

### Software Necesario

| Software | Versión | Descarga |
|----------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Incluido con Node.js |
| Git | 2.x | https://git-scm.com |
| Android Studio | Latest | https://developer.android.com/studio |

### Cuentas Necesarias (Gratuitas)

1. **Supabase** - https://supabase.com (backend y base de datos)
2. **OpenChargeMap** - https://openchargemap.org/site/develop (datos de estaciones)
3. **Vercel o Netlify** - Para hosting web (opcional)

---

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/electricmap-bogota.git
cd electricmap-bogota
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar Ionic CLI (global)

```bash
npm install -g @ionic/cli
```

---

## Configurar Supabase

### Paso 1: Crear cuenta y proyecto

1. Ve a https://supabase.com y crea una cuenta gratuita
2. Click en "New Project"
3. Configura:
   - **Name:** electricmap-bogota
   - **Database Password:** (guárdala, la necesitarás)
   - **Region:** South America (São Paulo) - la más cercana a Colombia
4. Espera ~2 minutos mientras se crea

### Paso 2: Crear las tablas

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Click en "New Query"
3. Copia todo el contenido de `supabase/schema.sql`
4. Click en "Run" (o Cmd/Ctrl + Enter)
5. Verifica que no hay errores

### Paso 3: Obtener credenciales

1. Ve a **Settings** > **API**
2. Copia estos valores:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJ...` (la larga)

### Paso 4: Configurar en el proyecto

Edita `src/environments/environment.ts`:

```typescript
supabase: {
  url: 'https://TU-PROYECTO.supabase.co',
  anonKey: 'TU-ANON-KEY-AQUI'
}
```

---

## Configurar OpenChargeMap

### Paso 1: Registrarse

1. Ve a https://openchargemap.org/site/develop
2. Crea una cuenta gratuita
3. Solicita una API Key

### Paso 2: Obtener API Key

1. Una vez aprobado, ve a tu perfil
2. Copia tu API Key

### Paso 3: Configurar en el proyecto

Edita `src/environments/environment.ts`:

```typescript
openChargeMap: {
  apiUrl: 'https://api.openchargemap.io/v3/poi/',
  apiKey: 'TU-OCM-API-KEY'
}
```

---

## Ejecutar el Proyecto

### Desarrollo local (navegador)

```bash
ionic serve
```

Esto abrirá http://localhost:8100 con hot-reload.

### Con emulador de móvil

```bash
ionic serve --lab
```

---

## Compilar para Android (APK)

### Paso 1: Compilar el proyecto web

```bash
npm run build:prod
```

### Paso 2: Agregar plataforma Android

```bash
npx cap add android
```

### Paso 3: Sincronizar archivos

```bash
npx cap sync android
```

### Paso 4: Abrir en Android Studio

```bash
npx cap open android
```

### Paso 5: Generar APK

En Android Studio:
1. Ve a **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. Espera la compilación
3. El APK estará en `android/app/build/outputs/apk/debug/`

### Paso 6: Firmar para producción

Para subir a Play Store, necesitas firmar el APK:

1. **Build** > **Generate Signed Bundle / APK**
2. Selecciona **APK**
3. Crea o usa un keystore existente
4. Completa la información
5. Selecciona **release**
6. Genera el APK firmado

---

## Desplegar en Producción

### Opción 1: Vercel (Recomendado - Gratis)

1. Crea cuenta en https://vercel.com
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build:prod`
   - **Output Directory:** `www`
4. Deploy!

### Opción 2: Netlify (Gratis)

1. Crea cuenta en https://netlify.com
2. Arrastra la carpeta `www/` después de compilar
3. O conecta GitHub para deploys automáticos

### Variables de entorno en producción

En Vercel/Netlify, configura estas variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OCM_API_KEY`

Y modifica `environment.prod.ts` para leerlas.

---

## Estructura del Proyecto

```
electricmap-bogota/
├── src/
│   ├── app/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── data/           # Datos seed locales
│   │   ├── layout/         # Layout (tabs)
│   │   ├── models/         # Interfaces TypeScript
│   │   ├── pages/          # Páginas de la app
│   │   └── services/       # Servicios (API, location, etc.)
│   ├── assets/             # Íconos, imágenes
│   ├── environments/       # Configuración por ambiente
│   └── theme/              # Variables CSS de Ionic
├── supabase/
│   └── schema.sql          # Esquema de base de datos
├── android/                # Proyecto Android (generado)
├── capacitor.config.ts     # Config de Capacitor
├── ionic.config.json       # Config de Ionic
└── package.json
```

---

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `ionic serve` | Ejecutar en desarrollo |
| `npm run build:prod` | Compilar para producción |
| `npx cap sync` | Sincronizar con plataformas nativas |
| `npx cap open android` | Abrir proyecto Android |
| `ionic generate page nombre` | Crear nueva página |
| `ionic generate service nombre` | Crear nuevo servicio |

---

## Solución de Problemas

### Error: "Supabase not configured"

El proyecto funciona sin Supabase usando datos locales. Si quieres datos en tiempo real, configura las credenciales en `environment.ts`.

### Error: Leaflet no carga el mapa

Verifica que `node_modules/leaflet/dist/leaflet.css` está incluido en `angular.json` bajo `styles`.

### Error: Geolocalización no funciona

- En navegador: necesita HTTPS o localhost
- En Android: verifica permisos en `AndroidManifest.xml`

### El APK es muy grande

Activa ProGuard y minificación en `android/app/build.gradle`:
```gradle
minifyEnabled true
shrinkResources true
```

---

## Próximos Pasos (Fase 2)

Una vez el MVP esté funcionando:

1. **Scraping de operadores** - Actualizar precios automáticamente
2. **Autenticación** - Permitir usuarios registrados
3. **Reportes de comunidad** - Usuarios reportan estado real
4. **Push notifications** - Alertas de fallas y promociones
5. **Integración de pagos** - Si es posible con operadores

---

## Soporte

¿Problemas? Abre un issue en el repositorio o revisa la documentación de:

- Ionic: https://ionicframework.com/docs
- Capacitor: https://capacitorjs.com/docs
- Supabase: https://supabase.com/docs
- Leaflet: https://leafletjs.com/reference.html

---

**¡Listo!** Ahora tienes todo para ejecutar ElectricMap Bogotá.
