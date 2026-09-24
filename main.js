// A&A Agendas | Cuadernos — interacciones del sitio

// Número de WhatsApp en formato internacional (Argentina: 54 9 + característica + número)
const WA_NUMBER = '5493525404356';
const WA_DEFAULT = 'Hola! Quiero hacer un pedido de agenda/cuaderno personalizado.';

// Todos los enlaces con data-wa abren WhatsApp con un mensaje precargado
document.querySelectorAll('[data-wa]').forEach((el) => {
  const msg = el.getAttribute('data-wa') || WA_DEFAULT;
  el.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  el.target = '_blank';
  el.rel = 'noopener';
});

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

// Filtros del catálogo
const chips = document.querySelectorAll('.chip');
const products = document.querySelectorAll('.product');
const empty = document.querySelector('.empty');
const applyFilter = (cat) => {
  chips.forEach((c) => {
    const active = c.dataset.filter === cat;
    c.classList.toggle('is-active', active);
    c.setAttribute('aria-pressed', String(active));
  });
  let visible = 0;
  products.forEach((p) => {
    const show = cat === 'todos' || p.dataset.cat === cat;
    p.hidden = !show;
    if (show) visible++;
  });
  empty.hidden = visible > 0;
};
chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
document.querySelectorAll('[data-filter-link]').forEach((a) =>
  a.addEventListener('click', () => applyFilter(a.dataset.filterLink))
);

// Favoritos (solo visual)
document.querySelectorAll('.fav').forEach((b) =>
  b.addEventListener('click', () => b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')))
);

// Preguntas frecuentes: una abierta por vez
const faqs = document.querySelectorAll('.qa');
faqs.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
}));

// Aparición suave de secciones al hacer scroll
if ('IntersectionObserver' in window) {
  const items = document.querySelectorAll('.cat, .product, .step, .feature, .review, .qa, .final__box, .sec-head');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
}

document.getElementById('year').textContent = new Date().getFullYear();
