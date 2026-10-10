/* CYSI V11 · Edita esta lista para añadir o reordenar imágenes.
 * Copia la imagen nueva a la misma carpeta y añade { src, alt, caption }.
 * La primera entrada es la portada del carrusel. No requiere compilación.
 */
window.CYSI_GALLERIES = {
  vehice: {
    title: 'VEHICE · Sistema RAS',
    images: [
      { src: 'proyecto-vehice.webp', alt: 'Tablero de control y visualización del sistema RAS de VEHICE', caption: 'Control, instrumentación y visualización del sistema RAS' },
      { src: 'galeria-acuicultura-01.webp', thumbnail: 'mini-acuicultura-01.webp', alt: 'Diseño del tablero, controlador y conexión de sensores', caption: 'Diseño del tablero y conexiones de instrumentación' },
      { src: 'galeria-acuicultura-02.webp', thumbnail: 'mini-acuicultura-02.webp', alt: 'Diagrama de instrumentación entre proceso, control e interfaz HMI', caption: 'Instrumentación: del proceso a la interfaz de operación' },
      { src: 'galeria-acuicultura-03.webp', thumbnail: 'mini-acuicultura-03.webp', alt: 'Lógica de control del sistema RAS en Siemens LOGO!', caption: 'Lógica de control, señales analógicas y niveles' },
      { src: 'galeria-acuicultura-04.webp', thumbnail: 'mini-acuicultura-04.webp', alt: 'Vista de cámaras de los estanques de acuicultura', caption: 'Monitoreo visual de estanques' },
      { src: 'galeria-acuicultura-05.webp', thumbnail: 'mini-acuicultura-05.webp', alt: 'Esquema eléctrico del controlador y los sensores de agua', caption: 'Conexiones eléctricas y sensores de calidad del agua' },
      { src: 'galeria-acuicultura-06.webp', thumbnail: 'mini-acuicultura-06.webp', alt: 'Interfaz con indicadores de oxígeno, ORP, temperatura, conductividad, pH y turbidez', caption: 'Visualización de variables del proceso' },
      { src: 'galeria-acuicultura-07.webp', thumbnail: 'mini-acuicultura-07.webp', alt: 'Estanques y tuberías del sistema de recirculación acuícola', caption: 'Instalación de estanques y recirculación' }
    ]
  },
  chiller: {
    title: 'Chiller industrial',
    images: [
      { src: 'proyecto-chiller.webp', alt: 'Vista general del chiller industrial y su panel de control', caption: 'Equipo y panel de control del chiller industrial' },
      { src: 'galeria-chiller-01.webp', thumbnail: 'mini-chiller-01.webp', alt: 'Panel del chiller con identificación de mandos, indicadores y parada de emergencia', caption: 'Mandos e indicadores del panel de operación' },
      { src: 'galeria-chiller-02.webp', thumbnail: 'mini-chiller-02.webp', alt: 'Diagrama de flujo de las condiciones de operación del chiller', caption: 'Secuencia de operación y condiciones del proceso' },
      { src: 'galeria-chiller-03.webp', thumbnail: 'mini-chiller-03.webp', alt: 'Esquema del circuito frigorífico y sus componentes', caption: 'Esquema de referencia del circuito frigorífico' }
    ]
  },
  switchgear: {
    title: 'Medición y diagnóstico eléctrico',
    images: [
      { src: 'proyecto-switchgear.webp', alt: 'Instrumentación utilizada en la medición eléctrica', caption: 'Medición y diagnóstico de equipos de maniobra' },
      { src: 'galeria-mantenimiento-01.webp', thumbnail: 'mini-mantenimiento-01.webp', alt: 'Pantalla y conexiones del instrumento de medición eléctrica', caption: 'Registro de la respuesta de maniobra' },
      { src: 'galeria-mantenimiento-02.webp', thumbnail: 'mini-mantenimiento-02.webp', alt: 'Placa original de identificación de un equipo switchgear', caption: 'Identificación técnica del equipo' },
      { src: 'galeria-mantenimiento-03.webp', thumbnail: 'mini-mantenimiento-03.webp', alt: 'Interior del tablero con relés, contactores y borneras', caption: 'Circuitos de control y conexiones del tablero' },
      { src: 'galeria-mantenimiento-04.webp', thumbnail: 'mini-mantenimiento-04.webp', alt: 'Equipo de maniobra eléctrica y conexiones de ensayo', caption: 'Detalle de componentes y conexiones de ensayo' },
      { src: 'galeria-mantenimiento-05.webp', thumbnail: 'mini-mantenimiento-05.webp', alt: 'Mecanismo interior del equipo de maniobra eléctrica', caption: 'Mecanismo de accionamiento y componentes internos' }
    ]
  }
};
