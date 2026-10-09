// Lista de proyectos del portafolio.
// Para añadir una automatización nueva, copia la plantilla de README.md y pégala al final de esta lista.
//
// Campos:
//   id         identificador único, solo minúsculas, números y guiones (se usa en el enlace #p-<id>)
//   titulo     nombre del proyecto
//   resumen    una o dos frases para la tarjeta
//   categoria  "Documentos" | "Informes" | "Flujos de trabajo" | "Integraciones" | "Datos"
//   estado     "Planificado" | "En desarrollo" | "Terminado"
//   ejemplo    true mientras sea un proyecto de muestra; quítalo cuando sea real
//   stack      herramientas usadas
//   problema   cómo era el proceso antes
//   solucion   qué hace la automatización
//   flujo      pasos del proceso automatizado, en orden
//   metricas   comparación antes / después
//   enlaces    repo, demo y video (deja "" si no hay)
//   fecha      "AAAA-MM"

window.PROYECTOS = [
  {
    id: "facturas-proveedores",
    titulo: "Registro automático de facturas de proveedores",
    resumen: "Lee las facturas PDF que llegan por correo, extrae los datos clave y los registra en una hoja de control sin intervención manual.",
    categoria: "Documentos",
    estado: "Planificado",
    ejemplo: true,
    stack: ["Python", "OCR", "Outlook / Gmail API", "Excel"],
    problema: "Administración descarga cada factura, la abre y copia a mano proveedor, fecha, base imponible e IVA en un Excel. Con unas 300 facturas al mes aparecen errores de transcripción y retrasos en el cierre.",
    solucion: "Un proceso revisa el buzón cada hora, extrae los datos de cada PDF, valida importes y NIF, y escribe una fila nueva en la hoja de control. Las facturas dudosas pasan a una cola de revisión.",
    flujo: ["Llega el correo", "Descarga del PDF", "Extracción de datos", "Validación", "Registro en Excel", "Aviso de excepciones"],
    metricas: [
      { etiqueta: "Tiempo por factura", antes: "4 min", despues: "20 s" },
      { etiqueta: "Horas al mes", antes: "20 h", despues: "2 h" },
      { etiqueta: "Errores de transcripción", antes: "3 %", despues: "< 0,5 %" }
    ],
    enlaces: { repo: "", demo: "", video: "" },
    fecha: "2026-11"
  },
  {
    id: "informe-kpis-semanal",
    titulo: "Informe semanal de KPIs automático",
    resumen: "Consolida datos de varias fuentes, calcula los indicadores de la semana y envía el informe por correo cada lunes a las 8:00.",
    categoria: "Informes",
    estado: "Planificado",
    ejemplo: true,
    stack: ["Python", "pandas", "SQL", "Power BI"],
    problema: "Cada lunes alguien exporta tres ficheros, los cruza en Excel y monta el informe a mano. Lleva media mañana y depende de una sola persona.",
    solucion: "Un script programado extrae los datos, calcula los KPIs, genera el informe y lo envía a la lista de distribución. Si falta una fuente, avisa en lugar de enviar datos incompletos.",
    flujo: ["Disparador semanal", "Extracción de fuentes", "Limpieza y cruce", "Cálculo de KPIs", "Generación del informe", "Envío por correo"],
    metricas: [
      { etiqueta: "Tiempo de preparación", antes: "3 h", despues: "0 h" },
      { etiqueta: "Hora de entrega", antes: "12:00", despues: "08:00" }
    ],
    enlaces: { repo: "", demo: "", video: "" },
    fecha: "2026-12"
  },
  {
    id: "aprobacion-solicitudes",
    titulo: "Flujo de aprobación de solicitudes de compra",
    resumen: "Sustituye la cadena de correos por un formulario con aprobaciones automáticas según importe y avisos al responsable.",
    categoria: "Flujos de trabajo",
    estado: "Planificado",
    ejemplo: true,
    stack: ["Power Automate", "Microsoft Forms", "Teams", "SharePoint"],
    problema: "Las solicitudes se piden por correo, se pierden en bandejas de entrada y nadie sabe en qué estado está cada una.",
    solucion: "El solicitante rellena un formulario. El flujo enruta la solicitud al aprobador según el importe, recuerda las pendientes y registra cada decisión con fecha.",
    flujo: ["Formulario", "Enrutado por importe", "Aprobación en Teams", "Registro en SharePoint", "Aviso al solicitante"],
    metricas: [
      { etiqueta: "Tiempo de aprobación", antes: "4 días", despues: "6 h" },
      { etiqueta: "Solicitudes sin estado", antes: "~15 %", despues: "0 %" }
    ],
    enlaces: { repo: "", demo: "", video: "" },
    fecha: "2027-01"
  }
];
