// ==========================================================
// CATÁLOGO A&A Agendas | Cuadernos
//
// Cómo editar un producto:
//   nombre     → título de la tarjeta
//   desc       → texto corto debajo del título
//   variantes  → opciones para elegir (se mandan en el mensaje de WhatsApp)
//   precio     → ej. '$ 18.500'  (si queda null se muestra "Consultar precio")
//   foto       → ej. 'assets/img/productos/agenda-2027-semanal.jpg'
//                (si queda null se muestra el cuaderno ilustrado)
//   tapa / sub → texto de la tapa ilustrada (máx. ~7 letras / ~11 letras)
//   nuevo      → true para mostrar la etiqueta NUEVO
// ==========================================================

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
  { cat: 'agendas-2027', nombre: 'Agenda 2027 semanal', desc: 'La semana completa a la vista, con tu nombre en tapa.', tapa: '2027', sub: 'SEMANAL', precio: null, foto: null },
  { cat: 'agendas-2027', nombre: 'Agenda 2027 dos días por hoja', desc: 'Más espacio que la semanal, sin llegar a la diaria.', tapa: '2027', sub: '2 DÍAS', precio: null, foto: null },
  { cat: 'agendas-2027', nombre: 'Agenda 2027 diaria', desc: 'Un día por página, para quien anota todo.', tapa: '2027', sub: 'DIARIA', precio: null, foto: null },

  // ---------- AGENDAS PERPETUAS ----------
  { cat: 'perpetuas', nombre: 'Agenda perpetua semanal', desc: 'Sin fechas impresas: la empezás cuando quieras.', variantes: ['Hexágonos', 'Básica', 'Moderna', 'Planner de Harry Potter'], tapa: 'SIEMPRE', sub: 'SEMANAL', precio: null, foto: null },
  { cat: 'perpetuas', nombre: 'Agenda perpetua diaria', desc: 'Sin fechas impresas, un día por página.', variantes: ['Cactus', 'Animalitos', 'Unisex'], tapa: 'SIEMPRE', sub: 'DIARIA', precio: null, foto: null },

  // ---------- PROFESIONES ----------
  { cat: 'profesiones', nombre: 'Agenda de manicuría', desc: 'Para organizar turnos y clientas.', tapa: 'NAILS', sub: 'MANICURÍA', precio: null, foto: null },
  { cat: 'profesiones', nombre: 'Agenda de peluquería', desc: 'Para organizar turnos y clientes.', tapa: 'PELU', sub: 'PELUQUERÍA', precio: null, foto: null },
  { cat: 'profesiones', nombre: 'Agenda de estética', desc: 'Para organizar turnos y tratamientos.', tapa: 'BELLEZA', sub: 'ESTÉTICA', precio: null, foto: null },
  { cat: 'profesiones', nombre: 'Agenda de cosmetología', desc: 'Para organizar turnos y tratamientos.', tapa: 'COSMETO', sub: 'COSMETOLOGÍA', precio: null, foto: null },
  { cat: 'profesiones', nombre: 'Agenda de lashista', desc: 'Para organizar turnos y clientas.', tapa: 'LASHES', sub: 'LASHISTA', precio: null, foto: null },
  { cat: 'profesiones', nombre: 'Agenda de repostería', desc: 'Pedidos, entregas y recetas en un solo lugar.', tapa: 'DULCE', sub: 'REPOSTERÍA', precio: null, foto: null },
  { cat: 'profesiones', nombre: 'Agenda de tejido', desc: 'Para organizar pedidos y proyectos.', tapa: 'TEJIDO', sub: 'AGENDA', precio: null, foto: null },
  { cat: 'profesiones', nombre: 'Agenda de modista', desc: 'Para organizar pedidos, medidas y entregas.', tapa: 'MODISTA', sub: 'AGENDA', precio: null, foto: null },
  { cat: 'profesiones', nombre: 'Agenda de maquillaje', desc: 'Para organizar turnos y eventos.', tapa: 'MAKEUP', sub: 'MAQUILLAJE', precio: null, foto: null },

  // ---------- DOCENTES ----------
  { cat: 'docentes', nombre: 'Agenda docente nivel inicial', desc: 'Pensada para el día a día en el jardín.', tapa: 'SEÑO', sub: 'INICIAL', precio: null, foto: null },
  { cat: 'docentes', nombre: 'Agenda docente nivel primario', desc: 'Pensada para el día a día en la primaria.', tapa: 'SEÑO', sub: 'PRIMARIA', precio: null, foto: null },
  { cat: 'docentes', nombre: 'Agenda docente nivel secundario', desc: 'Pensada para profes de secundaria.', variantes: ['Con planner', 'Con 8 cursos'], tapa: 'PROFE', sub: 'SECUNDARIA', precio: null, foto: null },
  { cat: 'docentes', nombre: 'Agenda para directivos', desc: 'Para la gestión de la escuela.', tapa: 'DIRE', sub: 'DIRECTIVOS', precio: null, foto: null },

  // ---------- ESPECIALES ----------
  { cat: 'especiales', nombre: 'Planificador de boda', desc: 'Para organizar cada detalle del gran día.', tapa: 'BODA', sub: 'PLANNER', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Planificador de viaje', desc: 'Para planificar y recordar cada viaje.', tapa: 'VIAJE', sub: 'PLANNER', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Control veterinario', desc: 'La salud de tu mascota, siempre a mano.', tapa: 'MASCOTA', sub: 'VETERINARIO', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Control vehicular', desc: 'Services, vencimientos y gastos del auto.', tapa: 'AUTO', sub: 'VEHICULAR', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Cuaderno de lectura', desc: 'Para registrar tus libros leídos.', tapa: 'LEO', sub: 'LECTURA', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Mandalas', desc: 'Para colorear y relajarse.', tapa: 'MANDALA', sub: 'COLOREAR', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Diario de gratitud', desc: 'Un momento del día para agradecer.', tapa: 'GRACIAS', sub: 'DIARIO', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Recetario', desc: 'Tus recetas favoritas, todas juntas.', tapa: 'RECETAS', sub: 'RECETARIO', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Agenda de embarazo', desc: 'Para acompañar cada etapa de la espera.', tapa: 'BEBÉ', sub: 'EMBARAZO', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Cuaderno pediátrico', desc: 'Controles y crecimiento de tu peque.', tapa: 'PEQUE', sub: 'PEDIÁTRICO', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Agenda estudiantil', desc: 'Para organizar la escuela o la facu.', variantes: ['Con corazones', 'Unisex'], tapa: 'ESTUDIO', sub: 'ESTUDIANTIL', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Reseña de yerbas', desc: 'Para puntuar cada yerba que probás.', tapa: 'MATE', sub: 'YERBAS', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Reseña de alfajores', desc: 'Para puntuar cada alfajor que probás.', tapa: 'ALFAJOR', sub: 'RESEÑAS', precio: null, foto: null },
  { cat: 'especiales', nombre: 'Agenda emprendedora', desc: 'Para organizar tu emprendimiento.', tapa: 'EMPRENDE', sub: 'AGENDA', precio: null, foto: null },

  // ---------- CUADERNOS ----------
  { cat: 'cuadernos', nombre: 'Cuaderno personalizado', desc: 'Con tu nombre y el interior que prefieras.', variantes: ['Liso', 'Rayado', 'Cuadriculado', 'Punteado'], tapa: 'IDEAS', sub: 'CUADERNO', precio: null, foto: null },

  // ---------- LIBRETAS A6 ----------
  { cat: 'libretas', nombre: 'Libreta A6', desc: 'Chiquita, para llevar a todos lados.', variantes: ['Lisa', 'Rayada', 'Cuadriculada'], tapa: 'NOTAS', sub: 'LIBRETA A6', precio: null, foto: null },

  // ---------- ANOTADORES ----------
  { cat: 'anotadores', nombre: 'Anotador', desc: 'Para listas, pendientes e ideas rápidas.', tapa: 'LISTAS', sub: 'ANOTADOR', precio: null, foto: null },

  // ---------- LIBROS PARA COLOREAR ----------
  { cat: 'colorear', nombre: 'Libro para colorear', desc: 'Con el personaje favorito de los chicos.', variantes: ['Stitch', 'Bears', 'Hombre Araña'], tapa: 'PINTO', sub: 'COLOREAR', precio: null, foto: null },
];
