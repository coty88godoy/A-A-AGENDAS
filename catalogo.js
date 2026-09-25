// ==========================================================
// CATÁLOGO A&A Agendas | Cuadernos
//
// Cómo editar un producto:
//   nombre     → título de la tarjeta
//   desc       → texto corto debajo del título
//   variantes  → opciones para elegir (se mandan en el mensaje de WhatsApp)
//   formato    → clave de PRECIOS ('semanal', 'dos-dias', 'diaria', 'profesional')
//   precios    → precio propio del producto, ej. { econo: 15000, premium: 25000 }
//                (si falta una versión se muestra "Consultar precio")
//   precio     → precio único para productos SIN versión Econo/Premium, ej. 4000
//   sinLineas  → true si el producto no tiene versión Econo/Premium
//   foto       → ej. 'assets/img/productos/agenda-2027-semanal.jpg'
//                (si queda null se muestra el cuaderno ilustrado)
//   tapa / sub → texto de la tapa ilustrada (máx. ~7 letras / ~11 letras)
//   nuevo      → true para mostrar la etiqueta NUEVO
// ==========================================================

// Versiones ECONO y PREMIUM
const LINEAS = [
  { id: 'econo', nombre: 'Econo', entrega: 'Lista en 2 a 3 días', incluye: ['Tapa plastificada', 'Anillado plástico'] },
  { id: 'premium', nombre: 'Premium', entrega: 'Lista en 7 a 10 días', incluye: ['Tapa dura', 'Anillado metálico', 'Elástico para cerrar', 'Sobre de cartulina con bolsillos', 'Cinta señalador'] },
];

// Precios por formato (en pesos)
const PRECIOS = {
  'semanal': { econo: 20000, premium: 28000 },
  'dos-dias': { econo: 22000, premium: 30000 },
  'diaria': { econo: 24000, premium: 32000 },
  // Profesiones y docentes: semanal + hojas extra (clientes, balance, etc.)
  'profesional': { econo: 22000, premium: 30000 },
};

const CATEGORIAS = [
  { id: 'agendas-2027', nombre: 'Agendas 2027' },
  { id: 'perpetuas', nombre: 'Agendas perpetuas' },
  { id: 'profesiones', nombre: 'Profesiones' },
  { id: 'docentes', nombre: 'Docentes' },
  { id: 'especiales', nombre: 'Especiales' },
  { id: 'cuadernos', nombre: 'Cuadernos' },
  { id: 'libretas', nombre: 'Libretas A6' },
  { id: 'anotadores', nombre: 'Anotadores' },
  { id: 'colorear', nombre: 'Para colorear' },
];

const PRODUCTOS = [
  // ---------- AGENDAS 2027 ----------
  { cat: 'agendas-2027', nombre: 'Agenda 2027 semanal', formato: 'semanal', desc: 'La semana completa a la vista, con tu nombre en tapa.', tapa: '2027', sub: 'SEMANAL', foto: null },
  { cat: 'agendas-2027', nombre: 'Agenda 2027 dos días por hoja', formato: 'dos-dias', desc: 'Más espacio que la semanal, sin llegar a la diaria.', tapa: '2027', sub: '2 DÍAS', foto: null },
  { cat: 'agendas-2027', nombre: 'Agenda 2027 diaria', formato: 'diaria', desc: 'Un día por página, para quien anota todo.', tapa: '2027', sub: 'DIARIA', foto: null },

  // ---------- AGENDAS PERPETUAS (mismo precio que las 2027: misma cantidad de hojas) ----------
  { cat: 'perpetuas', nombre: 'Agenda perpetua semanal', formato: 'semanal', desc: 'Sin fechas impresas: la empezás cuando quieras.', variantes: ['Hexágonos', 'Básica', 'Moderna', 'Planner de Harry Potter'], tapa: 'SIEMPRE', sub: 'SEMANAL', foto: null },
  { cat: 'perpetuas', nombre: 'Agenda perpetua diaria', formato: 'diaria', desc: 'Sin fechas impresas, un día por página.', variantes: ['Cactus', 'Animalitos', 'Unisex'], tapa: 'SIEMPRE', sub: 'DIARIA', foto: null },

  // ---------- PROFESIONES (agenda semanal + hojas de clientes y balance) ----------
  { cat: 'profesiones', nombre: 'Agenda de manicuría', formato: 'profesional', desc: 'Agenda semanal con hojas de clientas y balance.', tapa: 'NAILS', sub: 'MANICURÍA', foto: null },
  { cat: 'profesiones', nombre: 'Agenda de peluquería', formato: 'profesional', desc: 'Agenda semanal con hojas de clientes y balance.', tapa: 'PELU', sub: 'PELUQUERÍA', foto: null },
  { cat: 'profesiones', nombre: 'Agenda de estética', formato: 'profesional', desc: 'Agenda semanal con hojas de clientas y balance.', tapa: 'BELLEZA', sub: 'ESTÉTICA', foto: null },
  { cat: 'profesiones', nombre: 'Agenda de cosmetología', formato: 'profesional', desc: 'Agenda semanal con hojas de clientas y balance.', tapa: 'COSMETO', sub: 'COSMETOLOGÍA', foto: null },
  { cat: 'profesiones', nombre: 'Agenda de lashista', formato: 'profesional', desc: 'Agenda semanal con hojas de clientas y balance.', tapa: 'LASHES', sub: 'LASHISTA', foto: null },
  { cat: 'profesiones', nombre: 'Agenda de repostería', formato: 'profesional', desc: 'Agenda semanal con hojas de clientes y balance.', tapa: 'DULCE', sub: 'REPOSTERÍA', foto: null },
  { cat: 'profesiones', nombre: 'Agenda de tejido', formato: 'profesional', desc: 'Agenda semanal con hojas de clientes y balance.', tapa: 'TEJIDO', sub: 'AGENDA', foto: null },
  { cat: 'profesiones', nombre: 'Agenda de modista', formato: 'profesional', desc: 'Agenda semanal con hojas de clientas y balance.', tapa: 'MODISTA', sub: 'AGENDA', foto: null },
  { cat: 'profesiones', nombre: 'Agenda de maquillaje', formato: 'profesional', desc: 'Agenda semanal con hojas de clientas y balance.', tapa: 'MAKEUP', sub: 'MAQUILLAJE', foto: null },

  // ---------- DOCENTES (mismo precio que profesiones) ----------
  { cat: 'docentes', nombre: 'Agenda docente nivel inicial', formato: 'profesional', desc: 'Pensada para el día a día en el jardín.', tapa: 'SEÑO', sub: 'INICIAL', foto: null },
  { cat: 'docentes', nombre: 'Agenda docente nivel primario', formato: 'profesional', desc: 'Pensada para el día a día en la primaria.', tapa: 'SEÑO', sub: 'PRIMARIA', foto: null },
  { cat: 'docentes', nombre: 'Agenda docente nivel secundario', formato: 'profesional', desc: 'Pensada para profes de secundaria.', variantes: ['Con planner', 'Con 8 cursos'], tapa: 'PROFE', sub: 'SECUNDARIA', foto: null },
  { cat: 'docentes', nombre: 'Agenda para directivos', formato: 'profesional', desc: 'Para la gestión de la escuela.', tapa: 'DIRE', sub: 'DIRECTIVOS', foto: null },

  // ---------- ESPECIALES (Econo = Premium − $10.000) ----------
  { cat: 'especiales', nombre: 'Planificador de boda', desc: 'Para organizar cada detalle del gran día.', tapa: 'BODA', sub: 'PLANNER', foto: null },
  { cat: 'especiales', nombre: 'Planificador de viaje', desc: 'Para planificar y recordar cada viaje.', tapa: 'VIAJE', sub: 'PLANNER', foto: null },
  { cat: 'especiales', nombre: 'Control veterinario', precios: { econo: 15000, premium: 25000 }, desc: 'La salud de tu mascota, siempre a mano.', tapa: 'MASCOTA', sub: 'VETERINARIO', foto: null },
  { cat: 'especiales', nombre: 'Control vehicular', precios: { econo: 10000, premium: 20000 }, desc: 'Services, vencimientos y gastos del auto.', tapa: 'AUTO', sub: 'VEHICULAR', foto: null },
  { cat: 'especiales', nombre: 'Cuaderno de lectura', precios: { econo: 15000, premium: 25000 }, desc: 'Para registrar tus libros leídos.', tapa: 'LEO', sub: 'LECTURA', foto: null },
  { cat: 'especiales', nombre: 'Mandalas', precios: { econo: 10000, premium: 20000 }, desc: 'Para colorear y relajarse.', tapa: 'MANDALA', sub: 'COLOREAR', foto: null },
  { cat: 'especiales', nombre: 'Diario de gratitud', precios: { econo: 10000, premium: 20000 }, desc: 'Un momento del día para agradecer.', tapa: 'GRACIAS', sub: 'DIARIO', foto: null },
  { cat: 'especiales', nombre: 'Recetario', precios: { econo: 15000, premium: 25000 }, desc: 'Tus recetas favoritas, todas juntas.', tapa: 'RECETAS', sub: 'RECETARIO', foto: null },
  { cat: 'especiales', nombre: 'Agenda de embarazo', precios: { econo: 18000, premium: 28000 }, desc: 'Para acompañar cada etapa de la espera.', tapa: 'BEBÉ', sub: 'EMBARAZO', foto: null },
  { cat: 'especiales', nombre: 'Cuaderno pediátrico', precios: { econo: 18000, premium: 28000 }, desc: 'Controles y crecimiento de tu peque.', tapa: 'PEQUE', sub: 'PEDIÁTRICO', foto: null },
  { cat: 'especiales', nombre: 'Agenda estudiantil', precios: { econo: 18000, premium: 28000 }, desc: 'Agenda semanal perpetua para la escuela o la facu.', variantes: ['Con corazones', 'Unisex'], tapa: 'ESTUDIO', sub: 'ESTUDIANTIL', foto: null },
  { cat: 'especiales', nombre: 'Reseña de yerbas', precios: { econo: 16000 }, desc: 'Para puntuar cada yerba que probás. Econo en stock; Premium a pedido.', tapa: 'MATE', sub: 'YERBAS', foto: null },
  { cat: 'especiales', nombre: 'Reseña de alfajores', precios: { econo: 16000 }, desc: 'Para puntuar cada alfajor que probás. Econo en stock; Premium a pedido.', tapa: 'ALFAJOR', sub: 'RESEÑAS', foto: null },
  { cat: 'especiales', nombre: 'Agenda emprendedora', precios: { econo: 18000, premium: 28000 }, desc: 'Con planner semanal perpetuo para organizar tu emprendimiento.', tapa: 'EMPRENDE', sub: 'AGENDA', foto: null },

  // ---------- CUADERNOS ----------
  { cat: 'cuadernos', nombre: 'Cuaderno personalizado', precios: { econo: 18000, premium: 26000 }, desc: '150 hojas. A pedido también de 70 a 200 hojas (el precio varía).', variantes: ['Liso', 'Rayado', 'Cuadriculado', 'Punteado'], tapa: 'IDEAS', sub: 'CUADERNO', foto: null },

  // ---------- LIBRETAS A6 ----------
  { cat: 'libretas', nombre: 'Libreta A6', precios: { econo: 5000, premium: 7000 }, desc: 'Chiquita, para llevar a todos lados.', variantes: ['Lisa', 'Rayada', 'Cuadriculada'], tapa: 'NOTAS', sub: 'LIBRETA A6', foto: null },

  // ---------- ANOTADORES (precio único) ----------
  { cat: 'anotadores', nombre: 'Anotador', sinLineas: true, precio: 4000, desc: 'Para listas, pendientes e ideas rápidas.', tapa: 'LISTAS', sub: 'ANOTADOR', foto: null },

  // ---------- LIBROS PARA COLOREAR (precio único, cualquier modelo) ----------
  { cat: 'colorear', nombre: 'Libro para colorear', sinLineas: true, precio: 16000, desc: 'Con el personaje favorito de los chicos.', variantes: ['Stitch', 'Bears', 'Hombre Araña'], tapa: 'PINTO', sub: 'COLOREAR', foto: null },
];
