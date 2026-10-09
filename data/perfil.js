// Datos personales del portafolio. Edita este archivo para cambiar textos, enlaces y experiencia.
window.PERFIL = {
  nombre: "Alonso Casas",
  nombreCompleto: "Alonso David Casas Cuadra",
  rol: "Process Engineer",
  titular: "Transformo necesidades del negocio en procesos que se ejecutan solos.",
  intro:
    "Ingeniero informático con más de 3 años en mejora de procesos, automatización y análisis de datos. Llevo cada solución de punta a punta: requerimientos, modelado AS-IS / TO-BE, KPIs, implementación y adopción.",
  ubicacion: "Lima, Perú",
  disponible: true,

  // Foto de portada: guarda tu foto en la carpeta img/ y pon aquí su ruta.
  // Si lo dejas vacío se muestran tus iniciales.
  foto: "img/foto.jpg",
  // Enlace a tu CV en PDF. Si lo dejas vacío no aparece el botón.
  cv: "docs/cv-alonso-casas.pdf",

  sobreMi: [
    "Trabajo como Process Engineer. Lidero la estrategia de automatización de procesos operativos y el diseño de soluciones con inteligencia artificial, incluidos proyectos agénticos.",
    "Mi trabajo empieza antes de escribir código: levantar el proceso con los equipos, medirlo, encontrar los cuellos de botella y decidir qué merece la pena automatizar. Después construyo la solución y me aseguro de que se adopte."
  ],

  // Método de trabajo: es una secuencia real, por eso se muestra numerada.
  metodo: [
    { paso: "Levantar", texto: "Entrevisto a los stakeholders y analizo los datos para documentar el proceso actual (AS-IS)." },
    { paso: "Medir", texto: "Defino KPIs y una línea base: tiempos, volumen, reprocesos y errores." },
    { paso: "Rediseñar", texto: "Diseño el TO-BE eliminando brechas y pasos sin valor antes de automatizar." },
    { paso: "Automatizar", texto: "Construyo la solución con la herramienta adecuada: RPA, Apps Script, Python, n8n o agentes de IA." },
    { paso: "Adoptar y medir", texto: "Despliego, acompaño la adopción y comparo los indicadores frente a la línea base." }
  ],

  habilidades: [
    { grupo: "Gestión de procesos", items: ["AS-IS / TO-BE", "BPMN (Visio)", "Process Journey", "Brechas y riesgos", "KPIs"] },
    { grupo: "Automatización", items: ["Google Apps Script", "RPA", "RDA", "Power Automate", "n8n", "Make.com"] },
    { grupo: "Analítica y BI", items: ["Modelado de datos", "Looker Studio", "Power BI", "Métricas de servicio"] },
    { grupo: "Lenguajes e IA", items: ["Python", "SQL", "PL/SQL", "JavaScript", "HTML / CSS", "Agentes de IA", "Prompt Engineering"] },
    { grupo: "Metodologías", items: ["Lean Six Sigma (Green Belt)", "Scrum (SFPC)", "Kanban", "Design Thinking"] }
  ],

  experiencia: [
    {
      periodo: "May 2026 — Actualidad",
      actual: true,
      empresa: "BBVA",
      puesto: "Engineering Senior · Process Engineer",
      cifras: [
        { valor: "200+", texto: "procesos en el roadmap" },
        { valor: "2x", texto: "productividad con IA agéntica" },
        { valor: "S/ 1.4M", texto: "ahorro anual" }
      ],
      logros: [
        "Dirijo la estrategia y el roadmap de automatización de procesos operativos (BPO) a gran escala, con un portafolio de más de 200 procesos.",
        "Lidero el diseño e implementación de soluciones de inteligencia artificial, en concreto proyectos agénticos, que duplican la productividad de los procesos intervenidos.",
        "Generé un ahorro de S/ 1.4M anuales internalizando 6 procesos operativos automatizados con RPA (Python + IA) y diseñé el gobierno de la fábrica IT OPS.",
        "Gestiono la relación con stakeholders ejecutivos de más de 30 equipos de negocio y lidero equipos multidisciplinarios, impulsando el upskilling del 60 % del área."
      ]
    },
    {
      periodo: "Ene 2024 — Abr 2026",
      empresa: "BBVA",
      puesto: "Engineering Associate · Process Engineer",
      cifras: [
        { valor: "-60%", texto: "tiempo de detección de incidencias" },
        { valor: "+30%", texto: "productividad" },
        { valor: "-50%", texto: "tiempo operativo" }
      ],
      logros: [
        "Levanté y documenté procesos operativos (AS-IS), identifiqué brechas y cuellos de botella, y diseñé iniciativas TO-BE para reducir reprocesos.",
        "Implementé KPIs operativos y tableros en Looker Studio que redujeron un 60 % el tiempo de detección de incidencias.",
        "Desarrollé automatizaciones con Apps Script, Python e IA que aumentaron la productividad un 30 % y redujeron el tiempo operativo a la mitad.",
        "Lideré el despliegue de la primera solución de IA a escala nacional en BBVA Perú, desde el diseño funcional hasta producción.",
        "Implementé el modelo de gobierno de agentes de IA en Operaciones: monitoreo de outputs, versionado de prompts, control de accesos y trazabilidad."
      ]
    },
    {
      periodo: "Ene 2023 — Dic 2023",
      empresa: "BBVA",
      puesto: "Engineering Analyst · Process Engineer",
      cifras: [
        { valor: "30 FTE", texto: "de eficiencia anual con RDA" }
      ],
      logros: [
        "Convertí requerimientos de los equipos operativos en soluciones con KPIs, alcance y criterios de éxito definidos.",
        "Documenté procesos AS-IS y diseñé el TO-BE de contratos y gestiones, con estados, responsables, SLAs y trazabilidad end-to-end.",
        "Desarrollé automatizaciones de escritorio (RDA) con Python y AutoHotkey que liberaron 30 FTE al año en Operaciones Centralizadas.",
        "Diseñé aplicaciones web sobre Google Cloud Platform y tableros en Looker Studio para mejorar la trazabilidad y la calidad de los datos."
      ]
    }
  ],

  // Docencia y liderazgo (sección "Otros" del CV)
  docencia: [
    { valor: "77", texto: "Senseis formados en automatización y mejora de procesos (programa Sensei, BBVA Perú)." },
    { valor: "+120", texto: "asistentes en vivo al curso Samurai de Apps Script (BBVA global), con un NPS del 90 %." }
  ],

  educacion: [
    { centro: "CENTRUM PUCP", titulo: "Programa de Especialización en Inteligencia Artificial Aplicada a los Negocios", periodo: "Mar 2026 — Jul 2026" },
    { centro: "Pontificia Universidad Católica del Perú (PUCP)", titulo: "Bachiller en Ingeniería Informática", periodo: "Mar 2018 — Jul 2024" }
  ],

  certificaciones: [
    { nombre: "Prompt Engineering Foundation Professional Certification (CPEFPC)", emisor: "CertiProf", fecha: "Nov 2025" },
    { nombre: "Microsoft Azure AI Essentials", emisor: "Microsoft & LinkedIn Learning", fecha: "Oct 2025" },
    { nombre: "Inteligencia Artificial para Gerentes", emisor: "Microsoft & LinkedIn Learning", fecha: "Oct 2025" },
    { nombre: "Talking to AI: Prompt Engineering for Project Managers", emisor: "PMI", fecha: "Oct 2025" },
    { nombre: "Domina Power Automate: Automatización de procesos", emisor: "LinkedIn Learning", fecha: "Oct 2025" },
    { nombre: "Diseña agentes de IA con Microsoft Copilot Studio", emisor: "LinkedIn Learning", fecha: "Oct 2025" },
    { nombre: "Scrum Foundation Professional Certification (SFPC)", emisor: "CertiProf", fecha: "Jun 2025" },
    { nombre: "Lean Six Sigma Green Belt", emisor: "UTEC", fecha: "Dic 2024" },
    { nombre: "Análisis de Datos con Power BI", emisor: "Platzi", fecha: "Dic 2022" }
  ],

  // Redes de la portada. Deja "" en las que no quieras mostrar.
  contacto: {
    email: "alonso.david.casas@gmail.com",
    linkedin: "https://www.linkedin.com/in/alonsocasas",
    github: "https://github.com/casascuadraalonsodavid-sys",
    whatsapp: "51961004629",   // número con prefijo de país y sin espacios
    instagram: "https://www.instagram.com/casas.01"
  }
};
