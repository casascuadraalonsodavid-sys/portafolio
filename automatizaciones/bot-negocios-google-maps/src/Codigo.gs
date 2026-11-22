/**
 * Bot de negocios en Google Maps -> Google Sheets
 * ------------------------------------------------
 * Escribes lo que buscas en lenguaje natural ("cafeterías en Miraflores con buenas reseñas")
 * y el bot:
 *   1. Usa Claude para convertir el pedido en consultas de búsqueda concretas.
 *   2. Busca los negocios con la API oficial de Google Places (Text Search, API nueva).
 *   3. Escribe los resultados en la hoja "Negocios", sin duplicados (por Place ID).
 *   4. Opcional: Claude califica cada negocio como prospecto (Alta / Media / Baja) y explica por qué.
 *
 * Vive dentro del propio Google Sheet (Extensiones > Apps Script). No necesita servidor.
 * Las claves se guardan en las Propiedades del script, nunca en el código.
 */

// ---------- Configuración ----------
const CONFIG = {
  HOJA_NEGOCIOS: 'Negocios',
  HOJA_HISTORIAL: 'Historial',
  MODELO_CLAUDE: 'claude-opus-5-5',
  IDIOMA: 'es',
  REGION: 'PE',            // código de país para sesgar resultados (PE = Perú)
  MAX_POR_CONSULTA: 60,    // Places devuelve como máximo 60 resultados (3 páginas de 20) por consulta
  MAX_CONSULTAS: 4,        // cuántas variantes de búsqueda puede proponer Claude
  LOTE_CALIFICACION: 20    // negocios por llamada a Claude al calificar
};

const COLUMNAS = [
  'Fecha', 'Pedido', 'Consulta', 'Nombre', 'Categoría', 'Dirección', 'Teléfono', 'Sitio web',
  'Calificación', 'Nº reseñas', 'Estado', 'Google Maps', 'Place ID',
  'Prioridad (Claude)', 'Motivo (Claude)'
];
const COL = Object.fromEntries(COLUMNAS.map((c, i) => [c, i + 1]));

// ---------- Menú ----------
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🤖 Bot de negocios')
    .addItem('Nueva búsqueda…', 'nuevaBusqueda')
    .addItem('Calificar prospectos con Claude…', 'calificarProspectos')
    .addSeparator()
    .addItem('Configurar claves de API…', 'configurarClaves')
    .addItem('Preparar hojas', 'prepararHojas')
    .addToUi();
}

function configurarClaves() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getScriptProperties();
  const pedir = (nombre, ayuda) => {
    const r = ui.prompt(nombre, ayuda + '\n\nDéjalo vacío para mantener la clave actual.', ui.ButtonSet.OK_CANCEL);
    if (r.getSelectedButton() !== ui.Button.OK) return false;
    const v = r.getResponseText().trim();
    if (v) props.setProperty(nombre, v);
    return true;
  };
  if (!pedir('GOOGLE_PLACES_API_KEY', 'Clave de Google Cloud con "Places API (New)" habilitada.')) return;
  if (!pedir('ANTHROPIC_API_KEY', 'Clave de la API de Claude (console.anthropic.com). Opcional: sin ella el bot busca tu texto tal cual y no califica.')) return;
  ui.alert('Claves guardadas en las Propiedades del script.');
}

function prepararHojas() {
  const ss = SpreadsheetApp.getActive();
  let hoja = ss.getSheetByName(CONFIG.HOJA_NEGOCIOS) || ss.insertSheet(CONFIG.HOJA_NEGOCIOS);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold').setBackground('#1f3b57').setFontColor('#ffffff');
    hoja.setFrozenRows(1);
  }
  let hist = ss.getSheetByName(CONFIG.HOJA_HISTORIAL) || ss.insertSheet(CONFIG.HOJA_HISTORIAL);
  if (hist.getLastRow() === 0) {
    hist.appendRow(['Fecha', 'Pedido', 'Consultas usadas', 'Encontrados', 'Nuevos', 'Duplicados', 'Segundos']);
    hist.getRange(1, 1, 1, 7).setFontWeight('bold');
    hist.setFrozenRows(1);
  }
  return hoja;
}

// ---------- 1. Nueva búsqueda ----------
function nuevaBusqueda() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('¿Qué negocios buscas?',
    'Escríbelo como se lo dirías a una persona. Ejemplos:\n' +
    '• Cafeterías en Miraflores y Barranco\n' +
    '• Talleres mecánicos en Arequipa con más de 50 reseñas\n' +
    '• Clínicas dentales en San Isidro, Lima', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK || !r.getResponseText().trim()) return;
  const res = buscarYGuardar(r.getResponseText().trim());
  ui.alert('Búsqueda terminada',
    `Consultas: ${res.consultas.join(' | ')}\n` +
    `Encontrados: ${res.encontrados} · Nuevos en la hoja: ${res.nuevos} · Ya estaban: ${res.duplicados}` +
    (res.filtrados ? `\nDescartados por tus filtros: ${res.filtrados}` : ''), ui.ButtonSet.OK);
}

/** Lógica principal, separada del menú para poder llamarla desde un activador programado. */
function buscarYGuardar(pedido) {
  const t0 = Date.now();
  const hoja = prepararHojas();
  const plan = planificarBusqueda(pedido);

  const vistos = new Set(leerPlaceIds(hoja));
  const filas = [];
  let encontrados = 0, duplicados = 0, filtrados = 0;
  const ahora = new Date();

  plan.consultas.forEach((consulta) => {
    buscarEnPlaces(consulta).forEach((p) => {
      encontrados++;
      if (vistos.has(p.id)) { duplicados++; return; }
      if (!cumpleFiltros(p, plan)) { filtrados++; return; }
      vistos.add(p.id);
      filas.push([
        ahora, pedido, consulta,
        p.displayName ? p.displayName.text : '',
        p.primaryTypeDisplayName ? p.primaryTypeDisplayName.text : '',
        p.formattedAddress || '',
        p.internationalPhoneNumber || p.nationalPhoneNumber || '',
        p.websiteUri || '',
        p.rating || '',
        p.userRatingCount || '',
        traducirEstado(p.businessStatus),
        p.googleMapsUri || '',
        p.id, '', ''
      ]);
    });
  });

  if (filas.length) {
    hoja.getRange(hoja.getLastRow() + 1, 1, filas.length, COLUMNAS.length).setValues(filas);
  }
  const segundos = Math.round((Date.now() - t0) / 1000);
  SpreadsheetApp.getActive().getSheetByName(CONFIG.HOJA_HISTORIAL)
    .appendRow([ahora, pedido, plan.consultas.join(' | '), encontrados, filas.length, duplicados, segundos]);
  return { consultas: plan.consultas, encontrados, nuevos: filas.length, duplicados, filtrados };
}

/** Claude convierte el pedido en consultas concretas y filtros. Sin clave de Claude, usa el texto tal cual. */
function planificarBusqueda(pedido) {
  const porDefecto = { consultas: [pedido], calificacion_minima: 0, resenas_minimas: 0, solo_abiertos: true };
  if (!clave('ANTHROPIC_API_KEY', false)) return porDefecto;

  const esquema = {
    type: 'object',
    additionalProperties: false,
    required: ['consultas', 'calificacion_minima', 'resenas_minimas', 'solo_abiertos'],
    properties: {
      consultas: { type: 'array', items: { type: 'string' } },
      calificacion_minima: { type: 'number' },
      resenas_minimas: { type: 'integer' },
      solo_abiertos: { type: 'boolean' }
    }
  };
  const prompt =
    'Convierte este pedido en un plan de búsqueda para Google Maps (Places Text Search).\n' +
    `Pedido: "${pedido}"\n\n` +
    `- "consultas": de 1 a ${CONFIG.MAX_CONSULTAS} textos de búsqueda, cada uno con rubro + zona ` +
    '(ej. "cafetería en Miraflores, Lima"). Si el pedido nombra varias zonas o sinónimos útiles del rubro, ' +
    'haz una consulta por combinación relevante. No inventes zonas que el pedido no menciona.\n' +
    '- "calificacion_minima": calificación mínima (0 a 5) si el pedido la pide, si no 0.\n' +
    '- "resenas_minimas": número mínimo de reseñas si el pedido lo pide, si no 0.\n' +
    '- "solo_abiertos": true salvo que el pedido pida incluir negocios cerrados.';
  try {
    const plan = llamarClaude(prompt, esquema, 'low');
    plan.consultas = (plan.consultas || []).filter(Boolean).slice(0, CONFIG.MAX_CONSULTAS);
    return plan.consultas.length ? plan : porDefecto;
  } catch (e) {
    console.warn('Claude no pudo planificar, se usa el pedido tal cual: ' + e.message);
    return porDefecto;
  }
}

function cumpleFiltros(p, plan) {
  if (plan.solo_abiertos && p.businessStatus && p.businessStatus !== 'OPERATIONAL') return false;
  if (plan.calificacion_minima && (p.rating || 0) < plan.calificacion_minima) return false;
  if (plan.resenas_minimas && (p.userRatingCount || 0) < plan.resenas_minimas) return false;
  return true;
}

// ---------- Google Places API (New): Text Search ----------
function buscarEnPlaces(consulta) {
  const campos = [
    'places.id', 'places.displayName', 'places.primaryTypeDisplayName', 'places.formattedAddress',
    'places.nationalPhoneNumber', 'places.internationalPhoneNumber', 'places.websiteUri',
    'places.rating', 'places.userRatingCount', 'places.businessStatus', 'places.googleMapsUri',
    'nextPageToken'
  ].join(',');
  const resultados = [];
  let token = '';
  do {
    const cuerpo = { textQuery: consulta, languageCode: CONFIG.IDIOMA, regionCode: CONFIG.REGION, pageSize: 20 };
    if (token) cuerpo.pageToken = token;
    const resp = UrlFetchApp.fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'X-Goog-Api-Key': clave('GOOGLE_PLACES_API_KEY'), 'X-Goog-FieldMask': campos },
      payload: JSON.stringify(cuerpo),
      muteHttpExceptions: true
    });
    const datos = JSON.parse(resp.getContentText() || '{}');
    if (resp.getResponseCode() !== 200) {
      throw new Error('Google Places respondió ' + resp.getResponseCode() + ': ' +
        (datos.error ? datos.error.message : resp.getContentText()));
    }
    (datos.places || []).forEach((p) => resultados.push(p));
    token = datos.nextPageToken || '';
    if (token) Utilities.sleep(1500); // el token de la página siguiente tarda unos segundos en activarse
  } while (token && resultados.length < CONFIG.MAX_POR_CONSULTA);
  return resultados;
}

function traducirEstado(s) {
  return ({ OPERATIONAL: 'Abierto', CLOSED_TEMPORARILY: 'Cerrado temporalmente', CLOSED_PERMANENTLY: 'Cerrado' })[s] || '';
}

// ---------- 2. Calificar prospectos con Claude ----------
function calificarProspectos() {
  const ui = SpreadsheetApp.getUi();
  clave('ANTHROPIC_API_KEY'); // avisa si falta
  const props = PropertiesService.getScriptProperties();
  const r = ui.prompt('¿Qué cliente ideal buscas?',
    'Describe a quién le quieres vender y qué hace a un negocio buen prospecto. Ejemplo:\n' +
    '"Ofrezco automatización de reservas. Busco negocios con muchas reseñas pero sin sitio web propio."',
    ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const criterio = r.getResponseText().trim() || props.getProperty('CRITERIO_PROSPECTO') || 'Negocios activos con buena reputación.';
  props.setProperty('CRITERIO_PROSPECTO', criterio);
  const n = calificarPendientes(criterio);
  ui.alert(`Listo: ${n} negocios calificados. Puedes ordenar la hoja por "Prioridad (Claude)".`);
}

function calificarPendientes(criterio) {
  const hoja = prepararHojas();
  const ultima = hoja.getLastRow();
  if (ultima < 2) return 0;
  const datos = hoja.getRange(2, 1, ultima - 1, COLUMNAS.length).getValues();
  const pendientes = [];
  datos.forEach((f, i) => { if (!f[COL['Prioridad (Claude)'] - 1]) pendientes.push({ fila: i + 2, f }); });

  const esquema = {
    type: 'object', additionalProperties: false, required: ['resultados'],
    properties: {
      resultados: {
        type: 'array',
        items: {
          type: 'object', additionalProperties: false, required: ['place_id', 'prioridad', 'motivo'],
          properties: {
            place_id: { type: 'string' },
            prioridad: { type: 'string', enum: ['Alta', 'Media', 'Baja'] },
            motivo: { type: 'string' }
          }
        }
      }
    }
  };

  let total = 0;
  for (let i = 0; i < pendientes.length; i += CONFIG.LOTE_CALIFICACION) {
    const lote = pendientes.slice(i, i + CONFIG.LOTE_CALIFICACION);
    const negocios = lote.map(({ f }) => ({
      place_id: f[COL['Place ID'] - 1],
      nombre: f[COL['Nombre'] - 1],
      categoria: f[COL['Categoría'] - 1],
      direccion: f[COL['Dirección'] - 1],
      tiene_telefono: !!f[COL['Teléfono'] - 1],
      sitio_web: f[COL['Sitio web'] - 1] || null,
      calificacion: f[COL['Calificación'] - 1] || null,
      resenas: f[COL['Nº reseñas'] - 1] || 0,
      estado: f[COL['Estado'] - 1]
    }));
    const prompt =
      'Eres analista comercial. Califica cada negocio como prospecto según este criterio del usuario:\n' +
      `"${criterio}"\n\n` +
      'Usa solo los datos dados, sin suponer información que no aparece. "motivo" en español, máximo 20 palabras.\n' +
      'Devuelve un resultado por cada place_id.\n\n' + JSON.stringify(negocios);
    const salida = llamarClaude(prompt, esquema, 'low');
    const porId = Object.fromEntries((salida.resultados || []).map((x) => [x.place_id, x]));
    lote.forEach(({ fila, f }) => {
      const x = porId[f[COL['Place ID'] - 1]];
      if (!x) return;
      hoja.getRange(fila, COL['Prioridad (Claude)'], 1, 2).setValues([[x.prioridad, x.motivo]]);
      total++;
    });
    SpreadsheetApp.flush();
  }
  return total;
}

// ---------- Claude API (HTTP, Apps Script no tiene SDK oficial) ----------
function llamarClaude(prompt, esquema, esfuerzo) {
  const resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': clave('ANTHROPIC_API_KEY'),
      'anthropic-version': '2026-10-21',
      'anthropic-beta': 'server-side-fallback-2026-07-01'
    },
    payload: JSON.stringify({
      model: CONFIG.MODELO_CLAUDE,
      max_tokens: 16000,
      fallbacks: 'default',
      output_config: { effort: esfuerzo || 'low', format: { type: 'json_schema', schema: esquema } },
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  const datos = JSON.parse(resp.getContentText() || '{}');
  if (resp.getResponseCode() !== 200) {
    throw new Error('Claude respondió ' + resp.getResponseCode() + ': ' + (datos.error ? datos.error.message : resp.getContentText()));
  }
  if (datos.stop_reason === 'refusal') throw new Error('Claude rechazó la solicitud.');
  if (datos.stop_reason === 'max_tokens') throw new Error('La respuesta de Claude se cortó (max_tokens).');
  const texto = (datos.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  return JSON.parse(texto);
}

// ---------- Utilidades ----------
function clave(nombre, obligatoria) {
  const v = PropertiesService.getScriptProperties().getProperty(nombre);
  if (!v && obligatoria !== false) {
    throw new Error(`Falta ${nombre}. Ve a 🤖 Bot de negocios > Configurar claves de API.`);
  }
  return v;
}

function leerPlaceIds(hoja) {
  const ultima = hoja.getLastRow();
  if (ultima < 2) return [];
  return hoja.getRange(2, COL['Place ID'], ultima - 1, 1).getValues().map((r) => r[0]).filter(String);
}
