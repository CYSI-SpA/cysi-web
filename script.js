'use strict';

const select = (selector, root = document) => root.querySelector(selector);
const selectAll = (selector, root = document) => [...root.querySelectorAll(selector)];
select('#year').textContent = new Date().getFullYear();

// Native navigation remains usable without JavaScript; only the mobile toggle needs it.
const menuToggle = select('.menu-toggle');
const nav = select('#main-nav');
function closeMenu(restoreFocus = false) {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('menu-open', open);
});
selectAll('a', nav).forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (nav.classList.contains('open') && !event.target.closest('.header')) closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const layers = {
  sources: ['01 / FUENTES', 'La información nace en sistemas distintos: ERP, documentos, correo y registros operacionales. El primer paso es identificar qué existe, quién lo administra y qué puede integrarse.'],
  connectors: ['02 / CONECTORES', 'APIs y flujos de integración sincronizan la información con permisos y alcances definidos. El piloto trabaja con herramientas como n8n y conectores empresariales.'],
  memory: ['03 / MEMORIA', 'Una memoria estructurada conserva eventos, entidades y su origen. PostgreSQL, históricos y auditoría permiten consultar información sin perder su contexto.'],
  intelligence: ['04 / INTELIGENCIA', 'Reglas, análisis y modelos de IA se apoyan en evidencia disponible. El desarrollo incorpora verificación de afirmaciones y explicita cuándo la información es insuficiente.'],
  actions: ['05 / ACCIONES', 'Buscar, alertar, reportar y recomendar: convertir información conectada en apoyo concreto a las decisiones, con evidencia y supervisión humana.']
};
selectAll('[data-layer]').forEach(button => button.addEventListener('click', () => {
  selectAll('[data-layer]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const [label, description] = layers[button.dataset.layer];
  select('#layer-label').textContent = label;
  select('#layer-description').textContent = description;
}));

const modes = {
  search: ['¿Dónde está el historial de este equipo?', 'La información, en su contexto.', 'Reunir documentos, intervenciones y eventos asociados a un activo, conservando su origen y fecha para poder verificarlos.', ['Documentos', 'Historial', 'Trazabilidad']],
  alert: ['¿Qué necesita atención hoy?', 'La excepción se vuelve visible.', 'Un ejemplo: una variable supera el umbral definido para el proceso. La alerta identifica el evento, su fuente y el responsable de revisarlo.', ['Umbrales definidos', 'Evento trazable', 'Revisión humana']],
  report: ['¿Cómo se está comportando la operación?', 'Indicadores con una fuente verificable.', 'Consolidar registros en un reporte, distinguir períodos completos y parciales, y mostrar qué datos respaldan cada indicador.', ['Período de análisis', 'Indicadores', 'Evidencia']],
  recommend: ['¿Cuál podría ser el siguiente paso?', 'Una recomendación que puedes evaluar.', 'Proponer una revisión de los activos con desviaciones recurrentes. Cada sugerencia debe señalar su evidencia, sus límites y qué necesita validar el equipo.', ['Contexto', 'Límites explícitos', 'Decisión supervisada']]
};
const modeTabs = selectAll('[data-mode]');
function activateMode(tab, focus = false) {
  modeTabs.forEach(button => {
    const selected = button === tab;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  const [question, title, description, sources] = modes[tab.dataset.mode];
  select('#demo-question').textContent = question;
  select('#demo-title').textContent = title;
  select('#demo-description').textContent = description;
  select('#brain-demo').setAttribute('aria-labelledby', tab.id);
  select('#demo-sources').replaceChildren(...sources.map(text => {
    const span = document.createElement('span'); span.textContent = text; return span;
  }));
  if (focus) tab.focus();
}
modeTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateMode(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % modeTabs.length;
    if (event.key === 'ArrowLeft') next = (index + modeTabs.length - 1) % modeTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = modeTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateMode(modeTabs[next], true); }
  });
});

function stepResponse(t, damping, naturalFrequency = 1.4) {
  const x = naturalFrequency * t;
  if (Math.abs(damping - 1) < 0.00001) return 1 - Math.exp(-x) * (1 + x);
  if (damping < 1) {
    const c = Math.sqrt(1 - damping * damping);
    return 1 - Math.exp(-damping * x) * (Math.cos(c * x) + damping / c * Math.sin(c * x));
  }
  const c = Math.sqrt(damping * damping - 1);
  return 1 - Math.exp(-damping * x) * (Math.cosh(c * x) + damping / c * Math.sinh(c * x));
}
function updateResponse() {
  const damping = Number(select('#damping').value);
  const path = Array.from({ length: 251 }, (_, index) => {
    const t = index / 25;
    return `${index ? 'L' : 'M'}${(45 + t * 57).toFixed(2)} ${(198 - stepResponse(t, damping) * 112).toFixed(2)}`;
  }).join(' ');
  select('#response-curve').setAttribute('d', path);
  select('#damping-value').textContent = damping.toFixed(2);
  const description = damping < 1 ? 'Respuesta oscilatoria amortiguada: al aumentar ζ se reduce el sobreimpulso.' : damping === 1 ? 'Amortiguamiento crítico: respuesta sin oscilación.' : 'Respuesta sobreamortiguada: sin oscilación, con una aproximación más lenta.';
  select('#damping-description').textContent = description;
  select('#plot-description').textContent = `Respuesta al escalón con amortiguamiento ${damping.toFixed(2)}. ${description}`;
}
select('#damping').addEventListener('input', updateResponse);
updateResponse();

const details = {
  industrial: {
    eyebrow: '01 / CYSI INDUSTRIAL INTELLIGENCE', title: 'Ver el proceso. Entender el riesgo. Actuar a tiempo.',
    intro: 'Para operaciones con activos críticos, automatización parcial o información técnica dispersa. La primera oportunidad suele estar en conocer mejor lo que ya está ocurriendo.',
    sections: [
      ['Qué podemos abordar', ['Diagnóstico del proceso, inspección e identificación de variables críticas.', 'Integración de PLC, sensores e instrumentación; monitoreo, alarmas e históricos.', 'Visualización del estado de los activos, documentación y apoyo al mantenimiento.']],
      ['Para quién', 'Jefaturas de mantenimiento, planta, operaciones y proyectos en refrigeración, acuicultura, agua, energía y manufactura.'],
      ['Cómo puede comenzar', 'Un activo crítico, una falla recurrente o una variable que hoy no se puede observar. Definimos el alcance y el criterio de resultado antes de intervenir.']
    ], note: 'La analítica avanzada y la anticipación de fallas dependen de la calidad del historial y se evalúan según el proyecto.', area: 'Industrial Intelligence'
  },
  digital: {
    eyebrow: '02 / CYSI DIGITAL OPERATIONS', title: 'Tus herramientas, trabajando como una sola operación.',
    intro: 'Para empresas que ya usan ERP, correo, planillas o documentos compartidos, pero aún dependen del trabajo manual para coordinarse.',
    sections: [
      ['Qué podemos abordar', ['Mapa de procesos y fuentes de información.', 'Integración mediante APIs, automatización de flujos y organización de documentos.', 'Seguimiento de solicitudes, alertas e indicadores con trazabilidad.']],
      ['Para quién', 'Pymes comerciales, distribuidores, servicios técnicos, postventa y equipos B2B que necesitan coordinar ventas, administración y operación.'],
      ['Cómo puede comenzar', 'Un flujo de información repetitivo: una solicitud, una cotización o un reporte. Se define una mejora observable y se valida antes de ampliar.']
    ], note: 'CYSI Brain forma parte de la evolución de esta línea y se encuentra en desarrollo y validación.', area: 'Digital Operations'
  },
  lab: {
    image: 'cysi-lab-holografico.webp', imageAlt: 'Visión conceptual de un laboratorio con prototipos holográficos', eyebrow: '03 / CYSI LAB', title: 'Probar una idea antes de escalarla.',
    intro: 'Un espacio de desarrollo para transformar problemas técnicos que se repiten en prototipos, módulos y soluciones reutilizables.',
    sections: [
      ['Qué podemos abordar', ['Exploración del problema y definición de requisitos medibles.', 'Prototipos de hardware, software, telemetría o control.', 'Pilotos, pruebas funcionales y documentación de aprendizajes.']],
      ['Para quién', 'Empresas industriales, centros tecnológicos y equipos que necesitan validar una solución especial antes de invertir en una implementación mayor.'],
      ['El camino', 'Problema validado → prototipo → prueba en contexto → evaluación de resultados → decisión de producto.']
    ], note: 'Los desarrollos de CYSI Lab se plantean como prototipos y pilotos. La disponibilidad de un producto se confirma caso a caso.', area: 'CYSI Lab'
  },
  integration: {
    image: 'cysi-integracion-metatron.webp', imageAlt: 'Integración geométrica conceptual de sistemas industriales', eyebrow: '04 / INGENIERÍA E INTEGRACIÓN DE SISTEMAS', title: 'Una visión completa del proceso.',
    intro: 'La capacidad integradora de CYSI conecta el mundo físico, el control, el software, la información y las personas que operan el sistema.',
    sections: [
      ['Qué podemos abordar', ['Levantamiento, diagnóstico y arquitectura de solución.', 'Automatización, instrumentación e integración OT/IT.', 'Documentación técnica, puesta en servicio y acompañamiento según el alcance acordado.']],
      ['Para quién', 'Operaciones industriales, empresas técnicas y proyectos multidisciplinarios con sistemas fragmentados.'],
      ['Nuestro criterio', 'Entender las restricciones reales, aprovechar la infraestructura viable y modernizar por etapas con criterios técnicos verificables.']
    ], area: 'Ingeniería e Integración de Sistemas'
  },
  pilot: {
    eyebrow: 'CYSI BRAIN / PILOTO PUNTO FRÍO', title: 'Construir inteligencia sobre evidencia real.',
    intro: 'El piloto de Punto Frío permite desarrollar y probar una arquitectura de información empresarial sobre una operación B2B de refrigeración.',
    sections: [
      ['Líneas de trabajo', ['Integración progresiva de datos empresariales y fuentes operacionales.', 'Memoria de eventos, entidades y trazabilidad de la información.', 'Consultas e indicadores basados en evidencia, con verificación de afirmaciones.']],
      ['Desarrollo responsable', 'Las capacidades se prueban de forma incremental. La arquitectura distingue hechos e inferencias y puede indicar que no existe evidencia suficiente para responder.'],
      ['Siguiente horizonte', 'Validar estabilidad, utilidad y alcance de las capacidades antes de convertirlas en una solución repetible para otros clientes.']
    ], note: 'Es un piloto en desarrollo. No se publican cifras internas, resultados económicos no validados ni datos comerciales del cliente.', area: 'CYSI Brain'
  },
  vehice: {
    eyebrow: 'EXPERIENCIA APLICADA / VEHICE', title: 'Control y sensórica para un sistema RAS.',
    intro: 'Antecedente de trabajo en el laboratorio de histopatología VEHICE: integración de control, medición y visualización en un sistema de recirculación acuícola.', image: 'proyecto-vehice.webp', imageAlt: 'Fotografía completa del proyecto VEHICE',
    sections: [['Alcance técnico documentado', ['Control de nivel con PLC Siemens LOGO! e instrumentación.', 'Monitoreo de oxígeno disuelto, ORP, temperatura, conductividad, pH y turbidez.', 'Integración de transmisores y visualización de variables críticas.']]], area: 'Industrial Intelligence'
  },
  chiller: {
    eyebrow: 'EXPERIENCIA APLICADA / REFRIGERACIÓN', title: 'Control y operación de un chiller industrial.',
    intro: 'Diagnóstico e intervención técnica de un sistema de enfriamiento, orientados al funcionamiento del equipo y la continuidad del proceso térmico.', image: 'proyecto-chiller.webp', imageAlt: 'Fotografía completa del proyecto chiller industrial',
    sections: [['Enfoque del trabajo', ['Revisión del comportamiento y condiciones de operación del equipo.', 'Diagnóstico e intervención de control.', 'Evaluación funcional del sistema de refrigeración.']]], area: 'Industrial Intelligence'
  },
  switchgear: {
    eyebrow: 'EXPERIENCIA APLICADA / MANTENIMIENTO ELÉCTRICO', title: 'Medir la respuesta. Sustentar el diagnóstico.',
    intro: 'Trabajo de medición de equipos de maniobra eléctrica mediante instrumentación especializada.', image: 'proyecto-switchgear.webp', imageAlt: 'Fotografía completa del trabajo de medición eléctrica',
    sections: [['Variables de evaluación', ['Tiempos de cierre.', 'Corriente máxima.', 'Respuesta de maniobra como evidencia para el diagnóstico.']]], area: 'Ingeniería e Integración de Sistemas'
  },
  privacy: {
    eyebrow: 'INFORMACIÓN DEL SITIO', title: 'Privacidad y contacto.',
    intro: 'Esta web no incorpora herramientas de seguimiento publicitario, cuentas de usuario ni almacenamiento de los datos del formulario.',
    sections: [['Formulario de contacto', 'El mensaje se prepara en tu navegador. Solo se comparte con el canal elegido cuando decides abrir WhatsApp o tu aplicación de correo y enviarlo. Estos servicios aplican sus propias políticas.'], ['Recursos locales', 'Las tipografías, fotografías e ilustraciones se sirven desde el propio sitio. El servicio de alojamiento puede procesar datos técnicos de acceso necesarios para entregar la página.'], ['Contacto', 'Puedes consultar sobre el tratamiento de información escribiendo a controlysistemasindustriales@gmail.com.']]
  }
};
const dialog = select('#detail-dialog');
let dialogTrigger;
function element(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}
function openDetail(key, trigger) {
  const detail = details[key];
  if (!detail) return;
  dialogTrigger = trigger;
  const wrapper = element('div', 'dialog-content-inner');
  wrapper.append(element('p', 'eyebrow dark', detail.eyebrow));
  const title = element('h2', '', detail.title); title.id = 'dialog-title'; wrapper.append(title);
  wrapper.append(element('p', '', detail.intro));
  if (window.CYSI_GALLERIES?.[key]) {
    wrapper.append(createGallery(key, true));
  } else if (detail.image) {
    const image = element('img', 'dialog-image'); image.src = detail.image; image.alt = detail.imageAlt; wrapper.append(image);
  }
  detail.sections.forEach(([heading, body]) => {
    wrapper.append(element('h3', '', heading));
    if (Array.isArray(body)) { const list = element('ul'); body.forEach(text => list.append(element('li', '', text))); wrapper.append(list); }
    else wrapper.append(element('p', '', body));
  });
  if (detail.note) wrapper.append(element('p', 'dialog-note', detail.note));
  if (detail.area) {
    const action = element('a', 'button button-cyan', 'Conversemos sobre tu proyecto →'); action.href = '#contacto';
    action.addEventListener('click', () => { select('#contact-area').value = detail.area; dialog.close(); setTimeout(() => select('#contact-name').focus({ preventScroll: true }), 50); });
    wrapper.append(action);
  }
  select('#dialog-content').replaceChildren(wrapper);
  document.body.classList.add('modal-open');
  dialog.showModal(); dialog.scrollTop = 0;
}
selectAll('[data-detail]').forEach(button => button.addEventListener('click', () => openDetail(button.dataset.detail, button)));
select('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); dialogTrigger?.focus({ preventScroll: true }); });

const form = select('#contact-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const name = select('#contact-name').value.trim();
  const company = select('#contact-company').value.trim();
  const area = select('#contact-area').value;
  const challenge = select('#contact-message').value.trim();
  if (!name || challenge.length < 10) {
    const field = !name ? select('#contact-name') : select('#contact-message');
    field.setCustomValidity(!name ? 'Escribe tu nombre.' : 'Describe el desafío con al menos 10 caracteres.');
    field.reportValidity(); return;
  }
  const message = `Hola CYSI, soy ${name}${company ? ' de ' + company : ''}.\n\nMe interesa: ${area}.\n\n${challenge}\n\nMe gustaría conversar sobre cómo abordar este desafío.`;
  select('#message-preview').textContent = message;
  select('#send-whatsapp').href = `https://wa.me/56954393441?text=${encodeURIComponent(message)}`;
  select('#send-email').href = `mailto:controlysistemasindustriales@gmail.com?subject=${encodeURIComponent('Consulta CYSI · ' + area)}&body=${encodeURIComponent(message)}`;
  const result = select('#contact-result'); result.hidden = false;
  result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
});
form.addEventListener('input', event => {
  if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  select('#contact-result').hidden = true;
});

// Gallery content lives in galerias.js so new images can be added without changing this code.
const galleryPositions = Object.create(null);
const galleryViews = Object.create(null);
const galleryCategories = { vehice: 'ACUICULTURA / RAS', chiller: 'REFRIGERACIÓN INDUSTRIAL', switchgear: 'MANTENIMIENTO ELÉCTRICO' };

function setGalleryIndex(key, next) {
  const images = window.CYSI_GALLERIES[key].images;
  galleryPositions[key] = (next + images.length) % images.length;
  galleryViews[key] = (galleryViews[key] || []).filter(view => view.root.isConnected);
  galleryViews[key].forEach(view => view.render());
}

function createGallery(key, expanded = false) {
  const config = window.CYSI_GALLERIES[key];
  const images = config.images;
  if (!images.length) return element('p', '', 'No hay imágenes disponibles.');
  if (!Number.isInteger(galleryPositions[key])) galleryPositions[key] = 0;
  const root = element('div', 'project-carousel' + (expanded ? ' carousel-expanded' : ''));
  root.dataset.gallery = key;
  root.setAttribute('role', 'group');
  root.setAttribute('aria-roledescription', 'carrusel');
  root.setAttribute('aria-label', 'Imágenes de ' + config.title);
  root.tabIndex = 0;
  const header = element('div', 'carousel-header');
  header.append(element('span', '', galleryCategories[key]));
  const count = element('span', 'carousel-count'); header.append(count); root.append(header);
  const viewport = element('div', 'carousel-viewport');
  const imageButton = element(expanded ? 'a' : 'button', 'carousel-image');
  if (expanded) { imageButton.target = '_blank'; imageButton.rel = 'noopener'; }
  else imageButton.type = 'button';
  const image = element('img'); image.loading = 'lazy'; image.decoding = 'async';
  imageButton.append(image);
  const enlarge = element('span', 'carousel-enlarge', '↗'); enlarge.setAttribute('aria-hidden', 'true'); imageButton.append(enlarge);
  viewport.append(imageButton); root.append(viewport);
  const controls = element('div', 'carousel-controls');
  const previous = element('button', 'carousel-arrow', '←'); previous.type = 'button'; previous.setAttribute('aria-label', 'Imagen anterior de ' + config.title);
  const next = element('button', 'carousel-arrow', '→'); next.type = 'button'; next.setAttribute('aria-label', 'Imagen siguiente de ' + config.title);
  const caption = element('p', 'carousel-caption');
  controls.append(previous, caption, next); root.append(controls);
  const thumbnails = element('div', 'carousel-thumbnails'); thumbnails.setAttribute('aria-label', 'Elegir imagen de ' + config.title);
  const thumbButtons = images.map((item, index) => {
    const button = element('button', 'carousel-thumb'); button.type = 'button';
    button.setAttribute('aria-label', `Ver imagen ${index + 1}: ${item.caption}`);
    const thumb = element('img'); thumb.src = item.thumbnail || item.src; thumb.alt = ''; thumb.loading = 'lazy'; thumb.width = 48; thumb.height = 38;
    button.append(thumb); button.addEventListener('click', () => setGalleryIndex(key, index)); thumbnails.append(button); return button;
  });
  root.append(thumbnails);
  const status = element('span', 'sr-only'); status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true'); root.append(status);
  let originalLink;
  if (expanded) {
    const footer = element('div', 'carousel-footer');
    footer.append(element('span', '', 'Usa las flechas o desliza para recorrer las imágenes.'));
    originalLink = element('a', 'text-action dark-text', 'Abrir imagen completa ↗'); originalLink.target = '_blank'; originalLink.rel = 'noopener';
    footer.append(originalLink); root.append(footer);
  }
  function render() {
    const index = galleryPositions[key];
    const current = images[index];
    image.src = current.src; image.alt = current.alt;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
    caption.textContent = current.caption;
    status.textContent = `Imagen ${index + 1} de ${images.length}. ${current.caption}`;
    imageButton.setAttribute('aria-label', `Ampliar imagen ${index + 1} de ${config.title}: ${current.caption}`);
    if (expanded) { imageButton.href = current.src; originalLink.href = current.src; }
    thumbButtons.forEach((button, thumbIndex) => button.setAttribute('aria-pressed', String(thumbIndex === index)));
    if (root.isConnected) {
      const selected = thumbButtons[index].getBoundingClientRect();
      const strip = thumbnails.getBoundingClientRect();
      if (selected.left < strip.left) thumbnails.scrollLeft -= strip.left - selected.left + 12;
      else if (selected.right > strip.right) thumbnails.scrollLeft += selected.right - strip.right + 12;
    }
  }
  previous.addEventListener('click', () => setGalleryIndex(key, galleryPositions[key] - 1));
  next.addEventListener('click', () => setGalleryIndex(key, galleryPositions[key] + 1));
  root.addEventListener('keydown', event => {
    const index = galleryPositions[key];
    const target = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: images.length - 1 }[event.key];
    if (target !== undefined) { event.preventDefault(); setGalleryIndex(key, target); }
  });
  let touchStart;
  let ignoreClickUntil = 0;
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') touchStart = { x: event.clientX, y: event.clientY };
  });
  viewport.addEventListener('pointercancel', () => { touchStart = null; });
  viewport.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      ignoreClickUntil = performance.now() + 500;
      setGalleryIndex(key, galleryPositions[key] + (dx < 0 ? 1 : -1));
    }
  });
  imageButton.addEventListener('click', event => {
    if (performance.now() < ignoreClickUntil) { event.preventDefault(); return; }
    if (!expanded) openDetail(key, imageButton);
  });
  if (images.length === 1) { previous.hidden = true; next.hidden = true; thumbnails.hidden = true; }
  render();
  (galleryViews[key] ||= []).push({ root, render });
  return root;
}

if (window.CYSI_GALLERIES) {
  selectAll('.project-card > .project-image[data-detail]').forEach(cover => {
    if (window.CYSI_GALLERIES[cover.dataset.detail]) cover.replaceWith(createGallery(cover.dataset.detail));
  });
}
