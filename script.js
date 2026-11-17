// Capital beauty — демо. Все цены из данных салона (тенге).
// Формат услуги: [название, цена от, цена до | null]. open: true — цена только «от».
document.documentElement.classList.add('js');

const GROUPS = [
  { id: 'hair', name: 'Волосы', items: [
    ['Женская стрижка', 10000, 15000],
    ['Стрижка чёлки', 4000, null],
    ['Детская стрижка (девочка)', 6000, 9000],
    ['Мужская стрижка', 5000, null, true],
    ['Укладка женская', 10000, 15000],
    ['Причёска', 12000, 17000],
    ['Мытьё и сушка', 6000, 8000],
    ['Окрашивание тон в тон', 25000, 60000],
    ['Окрашивание корней', 18000, 35000],
    ['Сложное окрашивание', 65000, 150000],
    ['Тонирование', 20000, 35000],
    ['Осветление маслом Davines', 50000, null, true],
    ['SPA для волос', 25000, 60000],
    ['Уход Davines', 35000, 70000]
  ] },
  { id: 'nails', name: 'Ногти', items: [
    ['Маникюр', 7000, null],
    ['Маникюр + гель', 10000, null],
    ['Маникюр + обычный лак', 8000, null],
    ['Японский маникюр', 9000, 10000],
    ['Мужской маникюр', 10000, null],
    ['Наращивание ногтей', 18000, 21000],
    ['Коррекция наращивания', 16000, 18000],
    ['Педикюр', 11000, null],
    ['Педикюр + гель', 12500, null],
    ['Smart-педикюр', 13000, 15000],
    ['Снятие геля', 2000, null],
    ['Дизайн', 2000, null]
  ] },
  { id: 'brows', name: 'Брови', items: [
    ['Коррекция бровей', 4000, null],
    ['Окрашивание бровей', 4000, null],
    ['Коррекция + окрашивание', 7000, null],
    ['Ламинирование бровей', 10000, null],
    ['Ламинирование + окрашивание + ботокс', 13000, null],
    ['Окрашивание + коррекция + ламинирование', 13000, null],
    ['Осветление бровей', 4000, null]
  ] },
  { id: 'lashes', name: 'Ресницы', items: [
    ['Наращивание: классика', 10000, null],
    ['Наращивание 2D', 11000, null],
    ['Наращивание 3D', 13000, null],
    ['Наращивание 4D–5D', 14000, null, true],
    ['Коррекция ресниц', 7000, null],
    ['Снятие ресниц', 2000, null],
    ['Ламинирование ресниц и бровей', 18000, null]
  ] },
  { id: 'wax', name: 'Депиляция', items: [
    ['Воск: усики', 3000, null],
    ['Воск: нос', 3000, null],
    ['Воск: бикини', 9000, null],
    ['Воск: баки', 3000, null],
    ['Воск: лоб', 3000, null],
    ['Шугаринг: подмышки', 2500, null]
  ] },
  { id: 'makeup', name: 'Макияж', items: [
    ['Макияж', 12000, null, true]
  ] }
];

const money = (n) => n.toLocaleString('ru-RU') + ' ₸';
function priceText(item) {
  const [, min, max, open] = item;
  if (open) return 'от ' + money(min);
  if (max) return min.toLocaleString('ru-RU') + ' – ' + money(max);
  return money(min);
}
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/* ---------- Окошко демо ---------- */
const modal = document.getElementById('modal');
const msgBox = modal.querySelector('.modal__msg');
const msgPre = modal.querySelector('.js-msg');
function openModal(message) {
  msgBox.hidden = !message;
  msgPre.textContent = message || '';
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', '');
}
modal.querySelector('.js-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
document.querySelectorAll('.js-book').forEach((b) => b.addEventListener('click', () => openModal('')));

/* ---------- Шапка при прокрутке ---------- */
const topBar = document.getElementById('top');
const onScroll = () => topBar.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Конструктор образа ---------- */
const chipsBox = document.querySelector('.chips');
const cardsBox = document.getElementById('cards');
const picked = new Map(); // ключ "группа:индекс" -> услуга
let current = GROUPS[0].id;

GROUPS.forEach((g) => {
  const chip = el('button', 'chip', g.name);
  chip.type = 'button';
  chip.setAttribute('role', 'tab');
  chip.id = 'tab-' + g.id;
  chip.dataset.id = g.id;
  chip.setAttribute('aria-selected', String(g.id === current));
  chip.setAttribute('aria-controls', 'cards');
  chip.tabIndex = g.id === current ? 0 : -1;
  chip.appendChild(el('span', 'chip__n')).hidden = true;
  chip.addEventListener('click', () => switchTab(g.id));
  chipsBox.appendChild(chip);
});
chipsBox.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const i = GROUPS.findIndex((g) => g.id === current);
  const next = GROUPS[(i + (e.key === 'ArrowRight' ? 1 : GROUPS.length - 1)) % GROUPS.length];
  switchTab(next.id);
  document.getElementById('tab-' + next.id).focus();
});

function renderCards() {
  const g = GROUPS.find((x) => x.id === current);
  cardsBox.setAttribute('aria-labelledby', 'tab-' + g.id);
  cardsBox.replaceChildren();
  g.items.forEach((item, i) => {
    const key = g.id + ':' + i;
    const b = el('button', 'svc');
    b.type = 'button';
    b.setAttribute('aria-pressed', String(picked.has(key)));
    const txt = el('span');
    txt.append(el('span', 'svc__name', item[0]), el('span', 'svc__price', priceText(item)));
    const plus = el('span', 'svc__plus', '+');
    plus.setAttribute('aria-hidden', 'true');
    b.append(txt, plus);
    b.addEventListener('click', () => {
      if (picked.has(key)) picked.delete(key); else picked.set(key, item);
      b.setAttribute('aria-pressed', String(picked.has(key)));
      updateSummary();
    });
    cardsBox.appendChild(b);
  });
}

let switching = null;
function switchTab(id) {
  if (id === current) return;
  current = id;
  chipsBox.querySelectorAll('.chip').forEach((c) => {
    const on = c.dataset.id === id;
    c.setAttribute('aria-selected', String(on));
    c.tabIndex = on ? 0 : -1;
  });
  clearTimeout(switching);
  cardsBox.classList.add('is-out');
  switching = setTimeout(() => {
    renderCards();
    cardsBox.classList.remove('is-out');
  }, 350);
}

function totals() {
  let min = 0, max = 0, open = false;
  picked.forEach((it) => {
    min += it[1];
    max += it[2] || it[1];
    if (it[3]) open = true;
  });
  if (!picked.size) return '0 ₸';
  if (open) return 'от ' + money(min);
  if (min === max) return money(min);
  return 'от ' + min.toLocaleString('ru-RU') + ' до ' + money(max);
}
function plural(n) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return n + ' услуга';
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return n + ' услуги';
  return n + ' услуг';
}

const list = document.querySelector('.summary__list');
const empty = document.querySelector('.summary__empty');
const resetBtn = document.querySelector('.js-reset');
const floatbar = document.querySelector('.floatbar');
let builderVisible = false;

function updateSummary() {
  const total = totals();
  document.querySelectorAll('.js-total').forEach((t) => { t.textContent = total; });
  document.querySelector('.js-count').textContent = plural(picked.size);
  empty.hidden = picked.size > 0;
  resetBtn.hidden = picked.size === 0;
  document.querySelectorAll('.js-send').forEach((b) => { b.disabled = picked.size === 0; });

  list.replaceChildren();
  picked.forEach((it) => {
    const li = el('li');
    li.append(el('span', '', it[0]), el('span', '', priceText(it)));
    list.appendChild(li);
  });

  // счётчики на вкладках
  chipsBox.querySelectorAll('.chip').forEach((c) => {
    let n = 0;
    picked.forEach((_, k) => { if (k.startsWith(c.dataset.id + ':')) n++; });
    const badge = c.querySelector('.chip__n');
    badge.textContent = n;
    badge.hidden = n === 0;
  });
  toggleFloatbar();
}

function toggleFloatbar() {
  const on = picked.size > 0 && builderVisible;
  if (on) {
    floatbar.hidden = false;
    requestAnimationFrame(() => floatbar.classList.add('is-on'));
  } else {
    floatbar.classList.remove('is-on');
  }
}
floatbar.addEventListener('transitionend', () => {
  if (!floatbar.classList.contains('is-on')) floatbar.hidden = true;
});

resetBtn.addEventListener('click', () => {
  picked.clear();
  renderCards();
  updateSummary();
});

function buildMessage() {
  const lines = ['Здравствуйте! Хочу записаться в Capital beauty:'];
  picked.forEach((it) => lines.push('— ' + it[0] + ' (' + priceText(it) + ')'));
  lines.push('Примерно: ' + totals());
  return lines.join('\n');
}
document.querySelectorAll('.js-send').forEach((b) => b.addEventListener('click', () => {
  if (picked.size) openModal(buildMessage());
}));

renderCards();
updateSummary();

/* ---------- Цены: аккордеон ---------- */
const acc = document.getElementById('acc');
if (acc) GROUPS.forEach((g, gi) => {
  const item = el('div', 'acc__item');
  const head = el('button', 'acc__head');
  head.type = 'button';
  head.id = 'acc-h-' + g.id;
  head.setAttribute('aria-expanded', 'false');
  head.setAttribute('aria-controls', 'acc-b-' + g.id);
  const min = Math.min(...g.items.map((x) => x[1]));
  const titles = el('span');
  titles.append(
    el('span', 'acc__name', g.name),
    el('span', 'acc__meta', plural(g.items.length) + ' · от ' + money(min))
  );
  const icon = el('span', 'acc__icon');
  icon.setAttribute('aria-hidden', 'true');
  head.append(titles, icon);

  const body = el('div', 'acc__body');
  body.id = 'acc-b-' + g.id;
  body.setAttribute('role', 'region');
  body.setAttribute('aria-labelledby', head.id);
  const inner = el('div');
  const ul = el('ul', 'acc__list');
  g.items.forEach((it) => {
    const li = el('li');
    li.append(el('span', '', it[0]), el('span', 'num', priceText(it)));
    ul.appendChild(li);
  });
  inner.appendChild(ul);
  body.appendChild(inner);
  body.inert = true;

  head.addEventListener('click', () => {
    const open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));
    body.inert = !open;
  });
  item.append(head, body);
  acc.appendChild(item);
  if (gi === 0) head.click();
});

/* ---------- Отзывы: открытки ---------- */
document.querySelectorAll('.card-r').forEach((c) => {
  c.addEventListener('click', () => {
    const on = c.getAttribute('aria-pressed') !== 'true';
    document.querySelectorAll('.card-r').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    c.setAttribute('aria-pressed', String(on));
  });
});

/* ---------- Статус «открыто / закрыто» по времени Астаны (UTC+5) ---------- */
const statusEl = document.querySelector('.js-status');
function updateStatus() {
  const d = new Date(Date.now() + 5 * 3600 * 1000);
  const mins = d.getUTCHours() * 60 + d.getUTCMinutes();
  const open = mins >= 600 && mins < 1200;
  statusEl.textContent = open ? 'Сейчас открыто, до 20:00' : 'Сейчас закрыто, откроемся в 10:00';
  statusEl.classList.toggle('is-open', open);
}
updateStatus();
setInterval(updateStatus, 60000);

/* ---------- Появление блоков и видимость конструктора ---------- */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((r) => io.observe(r));

  new IntersectionObserver((entries) => {
    builderVisible = entries[0].isIntersecting;
    toggleFloatbar();
  }, { rootMargin: '0px 0px -30% 0px' }).observe(document.getElementById('obraz'));
} else {
  document.querySelectorAll('.reveal').forEach((r) => r.classList.add('is-in'));
  builderVisible = true;
}
