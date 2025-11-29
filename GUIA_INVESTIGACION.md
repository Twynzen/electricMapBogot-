# Guía de Investigación: ElectricMap Bogotá

## Objetivo
Recopilar toda la información necesaria para desarrollar un MVP de mapa de estaciones de carga para vehículos eléctricos en Bogotá, con noticias y monetización.

---

## SECCIÓN 1: Datos de Estaciones de Carga en Bogotá

### 1.1 OpenChargeMap - Investigar API

**Qué necesito que averigües:**

1. Ir a: https://openchargemap.org/site/develop/api
2. Registrarte y obtener una API Key (es gratis)
3. Probar esta consulta para Bogotá:
   ```
   https://api.openchargemap.io/v3/poi/?output=json&countrycode=CO&latitude=4.6097&longitude=-74.0817&distance=50&distanceunit=KM&maxresults=100&key=TU_API_KEY
   ```

**Preguntas a responder:**
- [ ] ¿Cuántas estaciones devuelve para Bogotá y alrededores?
- [ ] ¿Qué datos incluye? (nombre, dirección, conectores, precios, estado)
- [ ] ¿Están actualizados? (ver fechas de última modificación)
- [ ] ¿Faltan estaciones que tú conoces?

**Ejemplo de respuesta que espero:**
```
OpenChargeMap Bogotá:
- Total estaciones encontradas: XX
- Datos disponibles: nombre ✓, dirección ✓, conectores ✓, precio ✗ (no disponible), estado ✓
- Última actualización promedio: hace X meses
- Estaciones que faltan: [lista de nombres/ubicaciones que conoces y no aparecen]
```

---

### 1.2 Operadores Locales - Mapeo Manual

**Qué necesito que averigües:**

Visitar las webs/apps de cada operador y documentar:

| Operador | Web/App | ¿Tiene mapa público? | ¿Muestra precios? | ¿API pública? | Notas |
|----------|---------|---------------------|-------------------|---------------|-------|
| Celsia (Epsa) | ? | ? | ? | ? | ? |
| Enel X | ? | ? | ? | ? | ? |
| Terpel Voltex | ? | ? | ? | ? | ? |
| EPM | ? | ? | ? | ? | ? |
| ChargePoint | ? | ? | ? | ? | ? |
| Otros... | ? | ? | ? | ? | ? |

**Ejemplo de investigación para UN operador:**
```
OPERADOR: Celsia
- Web: https://www.celsia.com/movilidad-electrica/
- Mapa público: SÍ, en https://celsia.com/mapa-estaciones
- Precios visibles: SÍ, $800/kWh promedio
- API pública: NO encontrada
- Estructura HTML del mapa:
  - URL del mapa: [URL exacta]
  - ¿Usa JavaScript para cargar datos?: SÍ/NO
  - Si es NO, ¿dónde están los datos en el HTML?: [selector CSS aproximado]
  - Si es SÍ, ¿hay llamadas XHR/fetch visibles en Network tab?: [URLs de las llamadas]
- Cantidad de estaciones listadas: XX en Bogotá
- Datos disponibles: nombre, dirección, conectores, potencia, horario
- Última verificación: [fecha]
```

**Cómo investigar la estructura HTML (para el scraping futuro):**
1. Abrir la página del mapa en Chrome
2. Click derecho > Inspeccionar
3. Ir a la pestaña "Network"
4. Recargar la página
5. Filtrar por "XHR" o "Fetch"
6. Ver si hay llamadas a APIs internas que devuelvan JSON con las estaciones
7. Si no hay, ir a "Elements" y buscar dónde están los datos de las estaciones

---

### 1.3 Datos Manuales Iniciales

**Qué necesito:**

Lista de 20-30 estaciones que conozcas personalmente o puedas verificar en Google Maps:

```
ESTACIÓN 1:
- Nombre: [nombre comercial]
- Operador: [quién la opera]
- Dirección exacta: [calle, número, localidad]
- Coordenadas: [lat, lng - obtener de Google Maps]
- Conectores: [CHAdeMO, CCS2, Tipo2, etc.]
- Potencia: [XX kW]
- Precio aproximado: [$XXX/kWh o gratis]
- Estado actual: [operativa/fuera de servicio]
- Horario: [24h o específico]
- Cómo lo verificaste: [visita personal, Google Maps, llamada, etc.]
```

**Cómo obtener coordenadas de Google Maps:**
1. Buscar la ubicación en Google Maps
2. Click derecho en el punto exacto
3. Click en las coordenadas que aparecen (se copian automáticamente)
4. Formato: 4.XXXXX, -74.XXXXX

---

## SECCIÓN 2: Google Maps Platform

### 2.1 Crear Cuenta y Proyecto

**Pasos a seguir:**
1. Ir a: https://console.cloud.google.com/
2. Crear cuenta o usar existente
3. Crear nuevo proyecto: "ElectricMapBogota"
4. Ir a "APIs & Services" > "Enable APIs"
5. Habilitar:
   - Maps JavaScript API
   - Places API
   - Geocoding API

**Lo que necesito que me reportes:**
```
Google Cloud:
- Proyecto creado: SÍ/NO
- ID del proyecto: [tu-project-id]
- APIs habilitadas: [lista]
- API Key generada: SÍ/NO (NO me compartas la key, solo confirma)
- Restricciones configuradas: [dominio, IP, etc.]
- Crédito gratuito disponible: $XXX USD
```

### 2.2 Entender Costos

**Investigar en:** https://cloud.google.com/maps-platform/pricing

**Preguntas a responder:**
- [ ] ¿Cuánto cuesta cada 1000 cargas del mapa (Map Loads)?
- [ ] ¿Cuánto cuesta cada 1000 búsquedas de Places Autocomplete?
- [ ] ¿Cuánto crédito gratis dan mensualmente?
- [ ] ¿Con 1000 usuarios/día, cuánto costaría aproximadamente?

**Formato de respuesta:**
```
Costos Google Maps (Nov 2024):
- Map Loads: $X.XX por 1000
- Places Autocomplete: $X.XX por 1000
- Crédito mensual gratis: $XXX
- Estimación 1000 usuarios/día: $XXX/mes
```

---

## SECCIÓN 3: Supabase (Backend)

### 3.1 Crear Cuenta y Proyecto

**Pasos:**
1. Ir a: https://supabase.com/
2. Crear cuenta (gratis)
3. Crear nuevo proyecto: "electricmap-bogota"
4. Elegir región más cercana a Colombia (idealmente Sao Paulo)

**Lo que necesito que me reportes:**
```
Supabase:
- Cuenta creada: SÍ/NO
- Proyecto creado: SÍ/NO
- Región seleccionada: [región]
- URL del proyecto: https://[tu-id].supabase.co
- Plan actual: Free/Pro
- Límites del plan free: [storage, bandwidth, etc.]
```

### 3.2 Entender Límites del Plan Gratuito

**Investigar en:** https://supabase.com/pricing

```
Límites Plan Free:
- Base de datos: XX GB
- Storage: XX GB
- Bandwidth: XX GB/mes
- Edge Functions: XX invocaciones
- Auth usuarios: XX
```

---

## SECCIÓN 4: Contexto Local y Competencia

### 4.1 Apps/Webs Existentes en Colombia

**Investigar:**
- PlugShare (https://www.plugshare.com/) - ¿Cubre Bogotá bien?
- ChargeMap (https://chargemap.com/) - ¿Tiene datos de Colombia?
- Apps de cada operador

**Formato de respuesta:**
```
COMPETIDOR: PlugShare
- Cobertura Bogotá: XX estaciones
- Fortalezas: [qué hace bien]
- Debilidades: [qué le falta]
- Funciones que tienen y queremos: [lista]
- Funciones que NO tienen y podemos ofrecer: [lista]
```

### 4.2 Comunidad EV en Bogotá

**Investigar:**
- Grupos de Facebook de EVs en Colombia
- Foros/comunidades
- Influencers o cuentas de Instagram/Twitter

**Por qué importa:** Para validar el producto, conseguir beta testers, y entender qué problemas reales tienen.

```
Comunidades encontradas:
1. [Nombre grupo] - [plataforma] - [# miembros] - [URL]
2. ...

Problemas comunes que mencionan:
- [problema 1]
- [problema 2]
```

---

## SECCIÓN 5: Decisiones Técnicas Pendientes

### 5.1 Preguntas que Necesito que Respondas

Por favor responde estas preguntas para alinear el desarrollo:

```
1. ALCANCE GEOGRÁFICO
   - ¿Solo Bogotá o también ciudades cercanas (Chía, Cota, Cajicá)?
   - ¿Eventualmente otras ciudades de Colombia?
   Respuesta:

2. PLATAFORMAS
   - ¿MVP solo web, solo Android, o ambos?
   - ¿iOS es necesario para el MVP o puede esperar?
   Respuesta:

3. USUARIOS Y AUTH
   - ¿Los usuarios necesitan crear cuenta para usar la app?
   - ¿O solo para funciones como reportar/comentar?
   Respuesta:

4. MONETIZACIÓN INICIAL
   - ¿Incluir ads desde el día 1 o esperar a tener usuarios?
   - ¿Tienes cuenta de AdSense?
   Respuesta:

5. PRESUPUESTO MENSUAL
   - ¿Cuánto puedes invertir en hosting/APIs al mes?
   - ¿$0 (solo free tiers), $10-20, $50+?
   Respuesta:

6. TU EXPERIENCIA
   - ¿Has trabajado con Angular/Ionic antes?
   - ¿Python?
   - ¿SQL/bases de datos?
   Respuesta:

7. IDIOMA DE LA APP
   - ¿Solo español o también inglés?
   Respuesta:

8. NOMBRE FINAL
   - ¿"ElectricMap Bogotá" o tienes otro nombre en mente?
   - ¿Tienes dominio comprado?
   Respuesta:
```

---

## SECCIÓN 6: Checklist de Entregables de la Investigación

Cuando termines la investigación, deberías tener:

### Datos de Estaciones
- [ ] Respuesta de OpenChargeMap para Bogotá (JSON o resumen)
- [ ] Tabla de operadores con URLs y análisis de scrapeabilidad
- [ ] Lista de 20-30 estaciones verificadas manualmente
- [ ] Identificación de fuentes de precios actualizados

### Cuentas y Accesos
- [ ] Cuenta Google Cloud creada con proyecto y APIs habilitadas
- [ ] Cuenta Supabase creada con proyecto
- [ ] API Key de OpenChargeMap

### Análisis de Mercado
- [ ] Análisis de 2-3 competidores (PlugShare, ChargeMap, apps locales)
- [ ] Lista de comunidades EV en Colombia
- [ ] 5-10 problemas reales que tienen los usuarios de EVs

### Decisiones
- [ ] Respuestas a todas las preguntas de la Sección 5.1

---

## Formato de Entrega

Puedes entregarme la investigación en:
1. **Un documento markdown** como este con todas las secciones completadas
2. **Respuestas directas en el chat** sección por sección
3. **Archivos JSON** para los datos estructurados (estaciones, operadores)

Lo importante es que la información esté clara y organizada para que yo pueda desarrollar sin ambigüedades.

---

## Tiempo Estimado de Investigación

| Sección | Tiempo Aprox |
|---------|--------------|
| 1. Datos de estaciones | 3-4 horas |
| 2. Google Maps Platform | 30 min |
| 3. Supabase | 30 min |
| 4. Competencia y comunidad | 1-2 horas |
| 5. Decisiones técnicas | 15 min |
| **Total** | **5-7 horas** |

---

## Notas Finales

- No necesitas ser exhaustivo en la primera pasada. Es mejor tener datos de calidad de 30 estaciones que datos incompletos de 100.
- Si encuentras algo interesante que no está en esta guía, inclúyelo.
- Si algo no está claro o tienes dudas, pregunta antes de asumir.

¡Éxito con la investigación! Cuando la tengas, la analizamos juntos y arrancamos el desarrollo.
