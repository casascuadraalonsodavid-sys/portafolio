# Bot de negocios en Google Maps → Google Sheets

Escribes en lenguaje natural qué negocios buscas ("cafeterías en Miraflores y Barranco con más de 4 estrellas") y el bot deja la lista en tu Google Sheet: nombre, rubro, dirección, teléfono, web, calificación, reseñas y enlace a Google Maps. Después, Claude puede calificar cada negocio como prospecto (Alta / Media / Baja) según el cliente ideal que le describas.

## Problema

Armar una base de prospectos se hacía a mano: buscar en Google Maps, abrir ficha por ficha y copiar nombre, teléfono y web a una hoja. Unos 2 minutos por negocio, con duplicados y datos mal copiados, y sin un criterio uniforme para decidir a quién contactar primero.

## Solución

```
Pedido en lenguaje natural
   │
   ▼
Claude arma el plan de búsqueda ──► consultas concretas (rubro + zona) y filtros (estrellas, reseñas, abiertos)
   │
   ▼
Google Places API (Text Search) ──► hasta 60 resultados por consulta
   │
   ▼
Filtro y deduplicación por Place ID
   │
   ▼
Hoja "Negocios" (+ registro en "Historial")
   │
   ▼
Claude califica prospectos ──► Prioridad + motivo en cada fila
```

- Usa la **API oficial de Google Places**, no scraping.
- Vive **dentro del propio Google Sheet** (Apps Script): sin servidor ni instalación.
- Las claves se guardan en las Propiedades del script, nunca en el código ni en la hoja.
- Si no configuras la clave de Claude, el bot igual funciona: busca tu texto tal cual y no califica.

## Instalación (10 minutos)

### 1. Clave de Google Places

1. Entra a [console.cloud.google.com](https://console.cloud.google.com) y crea un proyecto (por ejemplo "bot-negocios").
2. Activa la facturación del proyecto. Google pide tarjeta, pero incluye un crédito mensual gratuito que cubre un uso personal moderado. Revisa los precios vigentes de "Text Search" en la página de precios de Google Maps Platform.
3. En **APIs y servicios → Biblioteca**, busca **Places API (New)** y pulsa **Habilitar**.
4. En **APIs y servicios → Credenciales → Crear credenciales → Clave de API**. Edítala y en **Restricciones de API** deja solo "Places API (New)".
5. Recomendado: en **Facturación → Presupuestos y alertas**, crea una alerta (por ejemplo, 10 USD) para no llevarte sorpresas.

### 2. Clave de Claude (opcional, pero es la parte "inteligente")

1. Entra a [console.anthropic.com](https://console.anthropic.com), carga saldo y crea una **API key**.

### 3. El Google Sheet

1. Crea un Google Sheet nuevo en tu Drive (por ejemplo "Prospectos Google Maps").
2. Menú **Extensiones → Apps Script**.
3. Borra el contenido de `Código.gs` y pega el de [`src/Codigo.gs`](src/Codigo.gs).
4. En **Configuración del proyecto** (engranaje) marca "Mostrar el archivo de manifiesto appsscript.json" y reemplaza su contenido por [`src/appsscript.json`](src/appsscript.json).
5. Guarda y vuelve a la hoja. Recárgala: aparece el menú **🤖 Bot de negocios**.
6. **🤖 Bot de negocios → Configurar claves de API…** y pega tus dos claves. La primera vez Google te pedirá autorizar el script ("Google no verificó esta app" es normal en scripts propios: Configuración avanzada → Ir al proyecto).

## Uso

- **Nueva búsqueda…**: escribe lo que buscas. Ejemplos:
  - `Cafeterías en Miraflores y Barranco con más de 4 estrellas`
  - `Talleres mecánicos en Arequipa con más de 50 reseñas`
  - `Clínicas dentales en San Isidro, Lima`
- **Calificar prospectos con Claude…**: describe a tu cliente ideal (por ejemplo "Vendo automatización de reservas; busco negocios con muchas reseñas pero sin web propia"). Claude llena *Prioridad* y *Motivo* en las filas que aún no tienen calificación.
- La hoja **Historial** registra cada búsqueda: consultas usadas, encontrados, nuevos, duplicados y segundos.

Para buscar en otro país cambia `REGION` en `CONFIG` (código de dos letras, por ejemplo `MX`, `CO`, `ES`).

## Ajustes

| Parámetro (`CONFIG`) | Para qué sirve | Valor |
|---|---|---|
| `MODELO_CLAUDE` | Modelo de Claude que planifica y califica | `claude-opus-5-5` |
| `REGION` | País donde se priorizan los resultados | `PE` |
| `MAX_POR_CONSULTA` | Tope de resultados por consulta (Google permite 60) | `60` |
| `MAX_CONSULTAS` | Variantes de búsqueda que puede proponer Claude | `4` |
| `LOTE_CALIFICACION` | Negocios que Claude califica por llamada | `20` |

## Métricas (a medir con uso real)

| Indicador | Antes (manual) | Después |
|---|---|---|
| Tiempo por negocio registrado | ~2 min | segundos |
| 100 prospectos | ~3 h | < 2 min |
| Duplicados en la base | frecuentes | 0 (por Place ID) |

## Stack

Google Apps Script · Google Places API (New) · Google Sheets · Claude API (salidas estructuradas con JSON Schema)
