// Renderiza el portafolio a partir de data/perfil.js y data/proyectos.js.
// No hace falta tocar este archivo para añadir proyectos.
(function () {
  const P = window.PERFIL;
  const PROYECTOS = window.PROYECTOS || [];
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ESTADOS = ["Terminado", "En desarrollo", "Planificado"];
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const fecha = (f) => { if (!f) return ""; const [a, m] = f.split("-"); return m ? `${MESES[+m - 1]} ${a}` : a; };

  // Perfil
  const [antes, ...resto] = P.titular.split(" que ");
  $("titular").innerHTML = resto.length ? `${esc(antes)} <em>que ${esc(resto.join(" que "))}</em>` : esc(P.titular);
  $("intro").textContent = P.intro;
  const partes = P.nombre.trim().split(/\s+/);
  $("nombre").innerHTML = `${esc(partes[0])}<span>${esc(partes.slice(1).join(" "))}</span>`;
  $("rol-hero").textContent = P.rol;
  const iniciales = partes.slice(0, 2).map((x) => x[0]).join("");
  $("foto").innerHTML = P.foto
    ? `<img src="${esc(P.foto)}" alt="Foto de ${esc(P.nombre)}">`
    : `<span class="initials" aria-hidden="true">${esc(iniciales)}</span><figcaption>Tu foto aquí</figcaption>`;
  if (P.cv) { $("cv").href = P.cv; $("cv").hidden = false; }

  // Iconos de redes (trazo, 24x24)
  const ICONOS = {
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    whatsapp: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'
  };
  const C = P.contacto;
  const redes = [
    ["linkedin", "LinkedIn", C.linkedin],
    ["github", "GitHub", C.github],
    ["whatsapp", "WhatsApp", C.whatsapp && `https://wa.me/${String(C.whatsapp).replace(/\D/g, "")}`],
    ["instagram", "Instagram", C.instagram],
    ["email", "Correo", C.email && `mailto:${C.email}`]
  ].filter(([, , u]) => u);
  $("redes").innerHTML = redes.map(([k, n, u]) =>
    `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${n}" title="${n}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[k]}</svg></a>`).join("");
  $("disponible").hidden = !P.disponible;
  $("sobre").innerHTML = P.sobreMi.map((t) => `<p>${esc(t)}</p>`).join("");
  $("metodo").innerHTML = P.metodo.map((m) => `<li><div><b>${esc(m.paso)}</b><span>${esc(m.texto)}</span></div></li>`).join("");
  $("skills").innerHTML = P.habilidades.map((g) =>
    `<div><h3>${esc(g.grupo)}</h3><div class="chips">${g.items.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div></div>`).join("");
  $("timeline").innerHTML = P.experiencia.map((e) => `<article class="job">
      <div class="job-head">
        <div><h3>${esc(e.empresa)}</h3><div class="org">${esc(e.puesto)}</div></div>
        <span class="when${e.actual ? " now" : ""}">${esc(e.periodo)}</span>
      </div>
      ${e.cifras?.length ? `<div class="kpis">${e.cifras.map((c) => `<div class="kpi"><b>${esc(c.valor)}</b><span>${esc(c.texto)}</span></div>`).join("")}</div>` : ""}
      <ul class="logros">${(e.logros || []).map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
    </article>`).join("");
  $("educacion").innerHTML = (P.educacion || []).map((x) =>
    `<div class="edu-item"><span class="when">${esc(x.periodo)}</span><b>${esc(x.titulo)}</b><span>${esc(x.centro)}</span></div>`).join("");
  $("docencia").innerHTML = (P.docencia || []).map((x) =>
    `<div class="edu-item doc"><span class="big">${esc(x.valor)}</span><span>${esc(x.texto)}</span></div>`).join("");
  $("certs").innerHTML = (P.certificaciones || []).map((c) =>
    `<li><span>${esc(c.nombre)}</span><small>${esc(c.emisor)} · ${esc(c.fecha)}</small></li>`).join("");
  $("lugar").textContent = P.ubicacion || "";
  $("email").textContent = P.contacto.email;
  $("social").innerHTML = [["GitHub", P.contacto.github], ["LinkedIn", P.contacto.linkedin]]
    .filter(([, u]) => u).map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n} ↗</a>`).join("");
  $("foot-name").textContent = `© ${new Date().getFullYear()} ${P.nombreCompleto || P.nombre}`;
  $("brand").firstChild.textContent = P.nombre.split(" ")[0];

  $("copy").addEventListener("click", async (ev) => {
    const btn = ev.currentTarget;
    try { await navigator.clipboard.writeText(P.contacto.email); btn.textContent = "Copiado"; }
    catch { const r = document.createRange(); r.selectNodeContents($("email")); getSelection().removeAllRanges(); getSelection().addRange(r); btn.textContent = "Selecciona y copia"; }
    setTimeout(() => (btn.textContent = "Copiar correo"), 2000);
  });

  // Proyectos ordenados: terminados primero, luego por fecha descendente
  const lista = [...PROYECTOS].sort((a, b) =>
    ESTADOS.indexOf(a.estado) - ESTADOS.indexOf(b.estado) || String(b.fecha).localeCompare(String(a.fecha)));
  const terminados = lista.filter((p) => p.estado === "Terminado").length;
  $("foot-count").textContent = `${lista.length} proyectos · ${terminados} terminados`;

  const categorias = ["Todos", ...new Set(lista.map((p) => p.categoria))];
  let filtro = "Todos";
  try { const f = localStorage.getItem("filtro"); if (categorias.includes(f)) filtro = f; } catch {}

  function card(p) {
    const m = (p.metricas || [])[0];
    const nodos = (p.flujo || []).map(() => "<b></b>").join("<i></i>");
    return `<a class="card" href="#p-${esc(p.id)}">
      <div class="card-meta"><span class="eyebrow">${esc(p.categoria)}</span>
        <span style="display:flex;gap:6px">${p.ejemplo ? '<span class="badge ejemplo">Ejemplo</span>' : ""}<span class="badge ${esc(p.estado).replace(/ /g, "-")}">${esc(p.estado)}</span></span></div>
      <h3>${esc(p.titulo)}</h3>
      <p>${esc(p.resumen)}</p>
      <div style="display:grid;gap:12px">
        ${nodos ? `<div class="mini-flow" aria-label="${(p.flujo || []).length} pasos automatizados">${nodos}</div>` : ""}
        ${m ? `<div class="headline-metric"><small>${esc(m.etiqueta)}</small><s>${esc(m.antes)}</s><span aria-hidden="true">→</span><strong>${esc(m.despues)}</strong></div>` : ""}
      </div>
    </a>`;
  }

  function renderGrid() {
    $("filters").innerHTML = categorias.map((c) => {
      const n = c === "Todos" ? lista.length : lista.filter((p) => p.categoria === c).length;
      return `<button type="button" class="filter" aria-pressed="${c === filtro}" data-c="${esc(c)}">${esc(c)}<span class="n">${n}</span></button>`;
    }).join("");
    const vis = lista.filter((p) => filtro === "Todos" || p.categoria === filtro);
    $("grid").innerHTML = vis.length ? vis.map(card).join("") : `<div class="empty">Todavía no hay proyectos en esta categoría.</div>`;
  }
  $("filters").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-c]"); if (!b) return;
    filtro = b.dataset.c; try { localStorage.setItem("filtro", filtro); } catch {}
    renderGrid();
  });
  renderGrid();

  // Detalle de proyecto: enlace #p-<id>
  function renderDetail(p) {
    const links = [["Código", p.enlaces?.repo], ["Demo", p.enlaces?.demo], ["Vídeo", p.enlaces?.video]].filter(([, u]) => u);
    $("detail").innerHTML = `<div class="wrap">
      <a class="back" href="#proyectos">← Todos los proyectos</a>
      <div class="card-meta" style="justify-content:flex-start;gap:12px">
        <span class="eyebrow">${esc(p.categoria)}${p.fecha ? " · " + fecha(p.fecha) : ""}</span>
        <span class="badge ${esc(p.estado).replace(/ /g, "-")}">${esc(p.estado)}</span>
        ${p.ejemplo ? '<span class="badge ejemplo">Ejemplo</span>' : ""}
      </div>
      <h1>${esc(p.titulo)}</h1>
      <p class="lead">${esc(p.resumen)}</p>
      <div class="chips" style="margin-top:20px">${(p.stack || []).map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
      <div class="detail-grid">
        <div class="block before"><h2>Antes</h2><p>${esc(p.problema)}</p></div>
        <div class="block after"><h2>Después</h2><p>${esc(p.solucion)}</p></div>
      </div>
      ${p.flujo?.length ? `<div class="block" style="margin-top:40px"><span class="eyebrow">Flujo automatizado</span>
        <ol class="flow">${p.flujo.map((f) => `<li><span>${esc(f)}</span></li>`).join("")}</ol></div>` : ""}
      ${p.metricas?.length ? `<div class="block" style="margin-top:40px"><span class="eyebrow">Impacto</span><div class="table-scroll">
        <table class="metrics"><thead><tr><th>Indicador</th><th>Antes</th><th>Después</th></tr></thead><tbody>
        ${p.metricas.map((m) => `<tr><td>${esc(m.etiqueta)}</td><td class="num prev">${esc(m.antes)}</td><td class="num next">${esc(m.despues)}</td></tr>`).join("")}
        </tbody></table></div></div>` : ""}
      ${links.length ? `<div class="links" style="margin-top:32px">${links.map(([n, u]) => `<a class="btn ghost" href="${esc(u)}" target="_blank" rel="noopener">${n} ↗</a>`).join("")}</div>` : ""}
      ${p.ejemplo ? `<p class="note">Proyecto de ejemplo. Las cifras son estimaciones de referencia hasta que la automatización esté construida y medida.</p>` : ""}
    </div>`;
  }

  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    const p = h.startsWith("p-") && lista.find((x) => x.id === h.slice(2));
    $("home").hidden = !!p;
    $("detail").hidden = !p;
    if (p) { renderDetail(p); document.title = `${p.titulo} · ${P.nombre}`; window.scrollTo(0, 0); }
    else {
      document.title = `${P.nombre} · Automatizaciones`;
      const destino = h && document.getElementById(h);
      if (destino) destino.scrollIntoView();
    }
  }
  addEventListener("hashchange", route);
  route();
})();
