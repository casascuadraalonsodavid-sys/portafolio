# Portafolio de automatizaciones

Web estática (HTML, CSS y JavaScript sin dependencias ni paso de compilación). Se abre con doble clic en `index.html` y se puede publicar tal cual en Vercel, Netlify o GitHub Pages.

## Estructura

```
portafolio-web/
├── index.html          estructura de la página
├── styles.css          diseño (colores, tipografía, tema claro y oscuro)
├── app.js              pinta la página a partir de los datos
└── data/
    ├── perfil.js       tus datos: titular, sobre mí, método, habilidades, experiencia, contacto
    └── proyectos.js    la lista de automatizaciones
```

Para el día a día solo se tocan los dos archivos de `data/`.

## Añadir una automatización

1. Abre `data/proyectos.js`.
2. Copia esta plantilla y pégala dentro de la lista `window.PROYECTOS = [ ... ]`, separada del proyecto anterior por una coma.
3. Rellena los campos. El proyecto aparece en la cuadrícula y tiene su propia página en `index.html#p-<id>`.

```js
{
  id: "nombre-corto-del-proyecto",
  titulo: "Título del proyecto",
  resumen: "Una o dos frases sobre qué hace.",
  categoria: "Documentos",        // Documentos | Informes | Flujos de trabajo | Integraciones | Datos
  estado: "En desarrollo",        // Planificado | En desarrollo | Terminado
  stack: ["Python", "Excel"],
  problema: "Cómo se hacía el proceso antes y qué fallaba.",
  solucion: "Qué hace la automatización.",
  flujo: ["Paso 1", "Paso 2", "Paso 3"],
  metricas: [
    { etiqueta: "Horas al mes", antes: "20 h", despues: "2 h" }
  ],
  enlaces: { repo: "", demo: "", video: "" },
  fecha: "2026-11"
}
```

La primera métrica es la que se muestra en la tarjeta, así que pon arriba la más llamativa.

Cuando un proyecto de ejemplo pase a ser real, borra la línea `ejemplo: true` y actualiza las cifras con las medidas reales.

## Cada proyecto, en su propio repositorio

Recomendación para que todos tengan la misma forma:

```
nombre-del-proyecto/
├── README.md        problema, solución, cómo ejecutarlo, métricas antes / después
├── docs/
│   ├── proceso-antes.png     diagrama del proceso manual (BPMN o diagrama de flujo)
│   └── proceso-despues.png   diagrama del flujo automatizado
├── src/             código de la automatización
└── datos-ejemplo/   ficheros de prueba anonimizados
```

El enlace `repo` de cada proyecto apunta a ese repositorio.
