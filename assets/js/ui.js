/* ===== COMPONENTES DE INTERFACE ===== */
(function () {
  'use strict';

  var S = window.Store;
  var L = S.L, X = S.X, esc = S.esc, me = S.me;

  function $(sel) { return document.querySelector(sel); }

  function toast(m) {
    var t = $('#toast');
    t.textContent = m;
    t.classList.remove('hidden');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.add('hidden'); }, 3200);
  }

  function go(h) { location.hash = h; }

  /* ---------- ÍCONES (SVG, mesmo traço em todos os aparelhos) ---------- */
  var ICONS = {
    sigma:   '<path d="M18 7V5H6l6 7-6 7h12v-2"/>',
    atom:    '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    flask:   '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3M7.5 15h9"/>',
    globe:   '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    chat:    '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    ruler:   '<path d="M3 17 17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
    book:    '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2.5zM6 17h14"/>',
    pencil:  '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    play:    '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/>',
    lock:    '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    check:   '<path d="M5 12l5 5L20 7"/>',
    x:       '<path d="M6 6l12 12M18 6L6 18"/>',
    menu:    '<path d="M4 6h16M4 12h16M4 18h16"/>',
    inbox:   '<path d="M3 13l3-8h12l3 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13h5l1 3h6l1-3h5"/>'
  };
  var ICON_NAMES = ['sigma', 'atom', 'flask', 'globe', 'chat', 'ruler', 'book'];

  function icon(name, size) {
    size = size || 20;
    return '<svg class="ic" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.book) + '</svg>';
  }
  function safeColor(c) { return /^#[0-9a-f]{6}$/i.test(c || '') ? c : '#27509B'; }
  // quadradinho colorido com o ícone da matéria
  function subjTile(s) {
    return '<span class="ico" style="--c:' + safeColor(s && s.color) + '">' + icon((s && s.icon) || 'book', 20) + '</span>';
  }
  function typeIcon(t) { return icon({ material: 'book', exercise_set: 'pencil', video: 'play' }[t] || 'book', 18); }

  /* ---------- PLANOS / PREÇOS ---------- */
  function lockBadge(tier) {
    return '<span class="badge locked">' + icon('lock', 12) + ' ' + esc(S.planByTier(tier).name) + '</span>';
  }

  function price(p) {
    if (p.usd === 0) return '<span class="price-free">' + L('free') + '</span>';
    var rub = Math.round(p.usd * S.rubRate()).toLocaleString('ru-RU');
    return '$' + p.usd + '<small>' + L('month') + '</small><div class="price-rub">≈ ' + rub + ' ₽</div>';
  }

  // Acesso de uma matéria: grátis, parcialmente grátis, paga ou em breve
  function subjectAccess(s) {
    var cs = window.SHS.courses.filter(function (c) { return c.subject === s.id; });
    if (!cs.length) return { kind: 'soon' };
    if (cs.every(function (c) { return c.all_free; })) return { kind: 'free' };
    var ls = window.SHS.lessons.filter(function (l) { return cs.some(function (c) { return c.id === l.course; }); });
    var paid = ls.map(S.lessonTier).filter(function (t) { return t > 0; });
    var anyFree = cs.some(function (c) { return c.all_free || c.free_lessons > 0; });
    return { kind: anyFree ? 'partial' : 'paid', tier: paid.length ? Math.min.apply(null, paid) : 1 };
  }

  /* ---------- CABEÇALHO E RODAPÉ ---------- */
  function renderChrome() {
    var u = me(), h = (location.hash.split('?')[0] || '#/');
    function on(x) { return h.indexOf(x) === 0 ? ' class="on"' : ''; }

    var langBtn = function () {
      var cur = S.getLang();
      var flags = { en: '🇬🇧', ru: '🇷🇺', pt: '🇧🇷', es: '🇪🇸' };
      var names = { en: 'English', ru: 'Русский', pt: 'Português', es: 'Español' };
      return '<div class="lang-selector">' +
        '<button class="lang-btn" aria-haspopup="listbox" aria-expanded="false" data-act="toggle-lang" aria-label="' + esc(L('langBtnLabel')) + '">' +
          '<span class="flag">' + flags[cur] + '</span><span class="lang-name">' + names[cur] + '</span></button>' +
        '<ul class="lang-dropdown" role="listbox" aria-label="' + esc(L('langBtnLabel')) + '">' +
          Object.keys(names).map(function (code) {
            return '<li role="option" aria-selected="' + (cur === code) + '"><button data-act="lang" data-v="' + code + '" aria-pressed="' + (cur === code) + '">' +
              '<span class="flag">' + flags[code] + '</span> ' + names[code] + '</button></li>';
          }).join('') +
        '</ul></div>';
    };

    $('#header').innerHTML =
      '<div class="global-banner">' + L('promo') + '</div>' +
      '<div class="site-header"><div class="wrap">' +
        '<a class="logo" href="#/"><i>Z</i>Зачёт</a>' +
        '<button class="menu-toggle" data-act="toggle-menu" aria-expanded="false" aria-label="' + esc(L('menuLabel')) + '">' + icon('menu', 22) + '</button>' +
        '<nav class="main-nav" aria-label="Main">' +
          '<a href="#/courses"' + on('#/courses') + '>' + L('courses') + '</a>' +
          '<a href="#/plans"' + on('#/plans') + '>' + L('plans') + '</a>' +
          (u ? '<a href="#/dashboard"' + on('#/dashboard') + '>' + L('myarea') + '</a>' : '') +
          (u && u.is_admin ? '<a href="#/admin"' + on('#/admin') + '>' + L('admin') + '</a>' : '') +
        '</nav>' +
        '<div class="head-actions">' + langBtn() +
          (u ? '<button class="btn btn-light btn-sm" data-act="logout">' + L('logout') + '</button>'
             : '<a class="btn btn-light btn-sm" href="#/login">' + L('login') + '</a><a class="btn btn-yellow btn-sm" href="#/signup">' + L('signup') + '</a>') +
        '</div>' +
      '</div></div>';

    // Links que ainda não existem aparecem como texto (não levam à Home sem querer)
    $('#footer').innerHTML =
      '<div class="wrap"><div class="fgrid">' +
        '<div><h4>Зачёт</h4><p>' + L('contact') + ' <a href="mailto:luizalcantara1745@gmail.com">luizalcantara1745@gmail.com</a></p></div>' +
        '<div><h4>' + L('follow') + '</h4><ul><li><span class="soon-link">Instagram</span></li><li><span class="soon-link">Telegram</span></li><li><span class="soon-link">Discord</span></li></ul></div>' +
        '<div><h4>' + L('legal') + '</h4><ul><li><span class="soon-link">' + L('terms') + '</span></li><li><span class="soon-link">' + L('privacy') + '</span></li></ul></div>' +
      '</div><p class="fine">© 2026 Зачёт. ' + L('fine') + '</p></div>';
  }

  /* ---------- CARTÕES ---------- */
  function planCards() {
    var plans = S.getPlans(), u = me(), mine = S.planOf(u).code;
    // Regra: Basic = materiais | Intermediate = + exercícios corrigidos | Complete = + videoaulas
    var feats = {
      free:         [[L('freeContent'), 1], [L('corrected'), 0], [L('videos'), 0]],
      basic:        [[L('organized'), 1], [L('corrected'), 0], [L('videos'), 0]],
      intermediate: [[L('organized'), 1], [L('corrected'), 1], [L('videos'), 0]],
      complete:     [[L('organized'), 1], [L('corrected'), 1], [L('videosSub'), 1]]
    };
    return '<div class="plans">' + plans.map(function (p) {
      var feat = p.tier === 3;
      var btn = (u && mine === p.code)
        ? '<button class="btn btn-outline" disabled>' + L('yourPlan') + '</button>'
        : '<button class="btn ' + (feat ? 'btn-yellow' : 'btn-blue') + '" data-act="choose" data-plan="' + p.code + '">' + L('choose') + ' ' + esc(p.name) + '</button>';
      return '<div class="plan' + (feat ? ' featured' : '') + '">' +
        (feat ? '<span class="badge gold">' + L('everything') + '</span>' : '') +
        '<h3>' + esc(p.name) + '</h3><div class="price">' + price(p) + '</div>' +
        (p.tier === 0 ? '<p class="muted small">' + L('freePlanDesc') + '</p>' : '') +
        '<ul>' + feats[p.code].map(function (f) { return '<li class="' + (f[1] ? '' : 'no') + '">' + f[0] + '</li>'; }).join('') + '</ul>' + btn + '</div>';
    }).join('') + '</div>';
  }

  function subjectCards() {
    return window.SHS.subjects.map(function (s) {
      var a = subjectAccess(s), badge;
      if (a.kind === 'free') badge = '<span class="badge ok">' + L('free') + '</span>';
      else if (a.kind === 'partial') badge = '<span class="badge ok">' + L('freeLessons') + '</span>';
      else if (a.kind === 'paid') badge = lockBadge(a.tier);
      else badge = '';
      return '<article class="card" style="--c:' + safeColor(s.color) + '"><div class="head">' + subjTile(s) + '<h3>' + esc(X(s)) + '</h3></div><div class="body">' +
        badge + '<p>' + esc(X(s.d)) + '</p>' +
        (a.kind !== 'soon' ? '<a class="btn btn-outline btn-sm" href="#/courses?subject=' + encodeURIComponent(s.id) + '">' + L('viewCourses') + '</a>'
                           : '<span class="badge soon">' + L('comingSoon') + '</span>') +
        '</div></article>';
    }).join('');
  }

  function emptyState(iconName, text) {
    return '<div class="empty">' + icon(iconName, 32) + '<p>' + text + '</p></div>';
  }

  window.UI = {
    $: $, toast: toast, go: go, icon: icon, ICON_NAMES: ICON_NAMES, subjTile: subjTile, typeIcon: typeIcon, safeColor: safeColor,
    lockBadge: lockBadge, price: price, renderChrome: renderChrome, planCards: planCards, subjectCards: subjectCards,
    subjectAccess: subjectAccess, emptyState: emptyState
  };
})();
