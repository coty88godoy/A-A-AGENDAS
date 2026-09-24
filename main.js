// A&A Agendas | Cuadernos — interacciones del sitio

// Número de WhatsApp en formato internacional (Argentina: 54 9 + característica + número)
const WA_NUMBER = '5493525404356';
const WA_DEFAULT = 'Hola! Quiero hacer un pedido de agenda/cuaderno personalizado.';
const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

// Todos los enlaces con data-wa abren WhatsApp con un mensaje precargado
const setupWa = (root = document) => root.querySelectorAll('[data-wa]').forEach((el) => {
  el.href = waLink(el.getAttribute('data-wa') || WA_DEFAULT);
  el.target = '_blank';
  el.rel = 'noopener';
});
setupWa();

// Menú móvil
const nav = document.querySelector('.nav');
const burger = document.querySelector('.nav__burger');
const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
};
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
document.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ---------- Catálogo (datos en catalogo.js) ----------
const TODOS_VISIBLES = 8; // cuántos productos se muestran en "Todos" antes de "Ver todo el catálogo"
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const catName = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).nombre || '';
const COLORES = ['magenta', 'black', 'white'];
const GIROS = [-4, 3, -3, 4];

const precioDe = (p, linea) => {
  const tabla = p.precios || PRECIOS[p.formato];
  return tabla && tabla[linea] ? tabla[linea] : null;
};
const pesos = (n) => '$ ' + n.toLocaleString('es-AR');
const lineaDe = (id) => LINEAS.find((l) => l.id === id);

const pedidoMsg = (p, variante, linea) => {
  const precio = precioDe(p, linea);
  return `Hola! Quiero pedir: ${p.nombre}${variante ? ` (${variante})` : ''}, versión ${lineaDe(linea).nombre}` +
    `${precio ? ` (${pesos(precio)})` : ''}. ¿Me pasás ${precio ? 'las opciones de tapa' : 'precio y opciones de tapa'}?`;
};

// Actualiza precio, tiempo de entrega y link de WhatsApp de una tarjeta según lo elegido
const actualizarTarjeta = (card) => {
  const p = PRODUCTOS[card.dataset.i];
  const linea = card.dataset.linea;
  const precio = precioDe(p, linea);
  const priceEl = card.querySelector('.price');
  priceEl.textContent = precio ? pesos(precio) : 'Consultar precio';
  priceEl.classList.toggle('price--ask', !precio);
  card.querySelector('.product__time').textContent = lineaDe(linea).entrega;
  card.querySelector('[data-pedir]').href = waLink(pedidoMsg(p, card.dataset.variante, linea));
};

const productoHTML = (p, i) => {
  const img = p.foto
    ? `<img class="product__photo" src="${esc(p.foto)}" alt="${esc(p.nombre)}" loading="lazy">`
    : `<i class="product__arch"></i>
       <div class="nb nb--${COLORES[i % 3]}" style="--w:160px;--h:220px;--r:${GIROS[i % 4]}deg;--t:20px" aria-hidden="true"><i class="nb__pages"></i><i class="nb__cover"></i><i class="nb__rings"></i><i class="nb__band"></i><div class="nb__label"><b>${esc(p.tapa)}</b><small>${esc(p.sub)}</small></div></div>`;
  const variantes = p.variantes && p.variantes.length
    ? `<div class="variants" role="group" aria-label="Elegí el modelo">${p.variantes
        .map((v, j) => `<button type="button" class="variant${j === 0 ? ' is-active' : ''}" aria-pressed="${j === 0}">${esc(v)}</button>`)
        .join('')}</div>`
    : '';
  const primera = (p.variantes && p.variantes[0]) || '';
  const lineas = `<div class="lines" role="group" aria-label="Elegí la versión">${LINEAS
    .map((l, j) => `<button type="button" class="line${j === 0 ? ' is-active' : ''}" data-linea="${l.id}" aria-pressed="${j === 0}">${esc(l.nombre)}</button>`)
    .join('')}</div>`;
  return `<article class="product card" data-i="${i}" data-linea="${LINEAS[0].id}" data-variante="${esc(primera)}">
    <div class="product__img">
      ${img}
      <span class="tag">${p.nuevo ? 'NUEVO' : esc(catName(p.cat).toUpperCase())}</span>
      <button type="button" class="fav" aria-label="Guardar ${esc(p.nombre)} en favoritos" aria-pressed="false"><svg class="ic"><use href="#i-heart"/></svg></button>
    </div>
    <div class="product__body">
      <h3 class="display">${esc(p.nombre)}</h3>
      <p>${esc(p.desc)}</p>
      ${variantes}
      ${lineas}
      <p class="product__time"></p>
      <div class="product__foot">
        <span class="price"></span>
        <a href="#" target="_blank" rel="noopener" class="btn btn--outline btn--sm" data-pedir><svg class="ic"><use href="#i-wa"/></svg><span>Pedir</span></a>
      </div>
    </div>
  </article>`;
};

const filtersEl = document.querySelector('[data-filters]');
const productsEl = document.querySelector('[data-products]');
const moreBtn = document.querySelector('[data-more]');
let filtroActual = 'todos';
let expandido = false;

filtersEl.innerHTML = [{ id: 'todos', nombre: 'Todos' }, ...CATEGORIAS]
  .map((c) => `<button type="button" class="chip${c.id === 'todos' ? ' is-active' : ''}" data-filter="${c.id}" aria-pressed="${c.id === 'todos'}">${esc(c.nombre)}</button>`)
  .join('');

const render = () => {
  const lista = PRODUCTOS.map((p, i) => ({ p, i })).filter(({ p }) => filtroActual === 'todos' || p.cat === filtroActual);
  const recortar = filtroActual === 'todos' && !expandido && lista.length > TODOS_VISIBLES;
  const visibles = recortar ? lista.slice(0, TODOS_VISIBLES) : lista;
  productsEl.innerHTML = visibles.map(({ p, i }) => productoHTML(p, i)).join('');
  productsEl.querySelectorAll('.product').forEach(actualizarTarjeta);
  moreBtn.hidden = !recortar;
  filtersEl.querySelectorAll('.chip').forEach((c) => {
    const activo = c.dataset.filter === filtroActual;
    c.classList.toggle('is-active', activo);
    c.setAttribute('aria-pressed', String(activo));
  });
};

const aplicarFiltro = (cat) => { filtroActual = cat; expandido = false; render(); };
filtersEl.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (chip) aplicarFiltro(chip.dataset.filter);
});
document.querySelectorAll('[data-filter-link]').forEach((a) =>
  a.addEventListener('click', () => aplicarFiltro(a.dataset.filterLink))
);
moreBtn.addEventListener('click', () => { expandido = true; render(); });

// Variantes y favoritos dentro de las tarjetas
productsEl.addEventListener('click', (e) => {
  const fav = e.target.closest('.fav');
  if (fav) {
    fav.setAttribute('aria-pressed', String(fav.getAttribute('aria-pressed') !== 'true'));
    return;
  }
  const btn = e.target.closest('.variant, .line');
  if (!btn) return;
  const card = btn.closest('.product');
  const grupo = btn.classList.contains('line') ? '.line' : '.variant';
  card.querySelectorAll(grupo).forEach((b) => {
    b.classList.toggle('is-active', b === btn);
    b.setAttribute('aria-pressed', String(b === btn));
  });
  if (grupo === '.line') card.dataset.linea = btn.dataset.linea;
  else card.dataset.variante = btn.textContent;
  actualizarTarjeta(card);
});

render();

// Preguntas frecuentes: una abierta por vez
const faqs = document.querySelectorAll('.qa');
faqs.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
}));

// Aparición suave de secciones al hacer scroll
if ('IntersectionObserver' in window) {
  const items = document.querySelectorAll('.cat, .step, .feature, .review, .qa, .final__box, .sec-head');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
}

document.getElementById('year').textContent = new Date().getFullYear();
