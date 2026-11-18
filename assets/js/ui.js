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
    setTimeout(function () { t.classList.add('hidden'); }, 2400); 
  }
  
  function go(h) { location.hash = h; }
  
  function lockBadge(tier) { 
    var plans = [{tier:1, name:'Basic'}, {tier:2, name:'Intermediate'}, {tier:3, name:'Complete'}];
    var p = plans.filter(function(x){return x.tier === tier})[0]; 
    return '<span class="badge ' + (tier === 3 ? 'gold' : '') + '">' + L('choose') + ' ' + esc(p.name) + '</span>'; 
  }
  
  function price(p) { 
    // Adiciona o valor aproximado em Rublos (cotação do dia)
    var rub = Math.round(p.usd * 82.4529).toLocaleString('ru-RU');
    return '$' + p.usd + '<small>' + L('month') + '</small>' +
           '<div class="price-rub" style="font-size:0.85rem; color:var(--muted); margin-top:0.2rem;">≈ ' + rub + ' ₽</div>'; 
  }

  function renderChrome() {
    var u = me(), h = (location.hash.split('?')[0] || '#/');
    function on(x) { return h.indexOf(x) === 0 ? ' class="on"' : ''; }
    function langBtn(code) { return '<button data-act="lang" data-v="' + code + '" aria-pressed="' + (S.getLang() === code) + '">' + code.toUpperCase() + '</button>'; }
    
    $('#header').innerHTML =
      '<div class="promo">' + L('promo') + '</div>' +
      '<div class="site-header"><div class="wrap"><a class="logo" href="#/"><i>Z</i>Зачёт</a>' +
      '<nav class="main-nav" aria-label="Main"><a href="#/courses"' + on('#/courses') + '>' + L('courses') + '</a><a href="#/plans"' + on('#/plans') + '>' + L('plans') + '</a>' +
      (u ? '<a href="#/dashboard"' + on('#/dashboard') + '>' + L('myarea') + '</a>' : '') +
      (u && u.is_admin ? '<a href="#/admin"' + on('#/admin') + '>' + L('admin') + '</a>' : '') + '</nav>' +
      '<div class="head-actions"><div class="lang" role="group" aria-label="Language">' + langBtn('en') + langBtn('ru') + langBtn('pt') + langBtn('es') + '</div>' +
      (u ? '<button class="btn btn-light btn-sm" data-act="logout">' + L('logout') + '</button>'
         : '<a class="btn btn-light btn-sm" href="#/login">' + L('login') + '</a><a class="btn btn-yellow btn-sm" href="#/signup">' + L('signup') + '</a>') +
      '</div></div></div>';
      
    $('#footer').innerHTML =
      '<div class="wrap"><div class="fgrid"><div><h4>Зачёт</h4><p>' + L('contact') + ' <a href="mailto:luizalcantara1745@gmail.com">luizalcantara1745@gmail.com</a></p></div>' +
      '<div><h4>' + L('follow') + '</h4><ul><li><a href="#">Instagram</a></li><li><a href="#">Telegram</a></li><li><a href="#">Discord</a></li></ul></div>' +
      '<div><h4>' + L('legal') + '</h4><ul><li><a href="#">' + L('terms') + '</a></li><li><a href="#">' + L('privacy') + '</a></li></ul></div></div>' +
      '<p class="fine">© 2026 Зачёт. ' + L('fine') + '</p></div>';
  }

  function planCards() {
    var feats = {
      basic: [[L('organized'), 1], [L('corrected'), 0], [L('videos'), 0]],
      intermediate: [[L('organized'), 1], [L('corrected'), 1], [L('videos'), 0]],
      complete: [[L('organized'), 1], [L('corrected'), 1], [L('videosSub'), 1]]
    };
    
    // Lista fixa de planos para não depender de banco de dados (por enquanto)
    var listaDePlanos = [
      { code: 'basic', name: 'Basic', tier: 1, usd: 15 },
      { code: 'intermediate', name: 'Intermediate', tier: 2, usd: 30 },
      { code: 'complete', name: 'Complete', tier: 3, usd: 50 }
    ];

    return '<div class="plans">' + listaDePlanos.map(function (p) {
      return '<div class="plan' + (p.tier === 3 ? ' featured' : '') + '">' + (p.tier === 3 ? '<span class="badge gold">' + L('everything') + '</span>' : '') +
        '<h3>' + esc(p.name) + '</h3><div class="price">' + price(p) + '</div><ul>' +
        feats[p.code].map(function (f) { return '<li class="' + (f[1] ? '' : 'no') + '">' + f[0] + '</li>'; }).join('') +
        '</ul><button class="btn ' + (p.tier === 3 ? 'btn-yellow' : 'btn-blue') + '" data-act="choose" data-plan="' + p.code + '">' + L('choose') + ' ' + esc(p.name) + '</button></div>';
    }).join('') + '</div>';
  }

  function subjectCards() {
    return window.SHS.subjects.map(function (s) {
      var has = window.SHS.courses.some(function (c) { return c.subject === s.id; });
      return '<article class="card"><div class="top">' + esc(X(s)) + '</div><div class="body">' + lockBadge(s.tier) + '<p>' + esc(X(s.d)) + '</p>' +
        (has ? '<a class="btn btn-outline btn-sm" href="#/courses?subject=' + s.id + '">' + L('viewCourses') + '</a>' : '<span class="badge soon">' + L('comingSoon') + '</span>') + '</div></article>';
    }).join('');
  }

  // Exporta para o escopo global
  window.UI = { $: $, toast: toast, go: go, lockBadge: lockBadge, price: price, renderChrome: renderChrome, planCards: planCards, subjectCards: subjectCards };
})();
