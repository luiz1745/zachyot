/* ===== CAMADA DE DADOS (Memória do Navegador) ===== */
(function () {
  'use strict';
  
  var KEY = 'zachyot_v1', LKEY = 'zachyot_lang', mem = null;

  function defaults() {
    return { 
      users: [], subs: [], payments: [], progress: {}, attempts: [], activity: {}, views: {}, hidden: {}, session: null,
      plans: [ 
        { code:'basic', name:'Basic', tier:1, usd:15, rub:null },
        { code:'intermediate', name:'Intermediate', tier:2, usd:30, rub:null },
        { code:'complete', name:'Complete', tier:3, usd:50, rub:null } 
      ] 
    };
  }

  var DB;
  try { DB = JSON.parse(localStorage.getItem(KEY)); } catch (e) { DB = mem; }
  if (!DB) DB = defaults();
  
  function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { mem = DB; } }

  var lang = 'en';
  try { 
    var sv = localStorage.getItem(LKEY); 
    if (sv === 'ru' || sv === 'pt' || sv === 'es') lang = sv; 
  } catch (e) {}

  // Funções auxiliares de dados
  function L(k) { return (window.I18N[lang] && window.I18N[lang][k]) || window.I18N.en[k] || k; }
  function X(o) { return o ? (o[lang] || o.en) : ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
  function today() { return new Date().toLocaleDateString('sv'); }
  function uid() { return 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  
  function sha(txt) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }

  function me() { return DB.users.filter(function (u) { return u.id === DB.session; })[0] || null; }
  function planBy(code) { return DB.plans.filter(function (p) { return p.code === code; })[0]; }
  function planByTier(t) { return DB.plans.filter(function (p) { return p.tier === t; })[0]; }
  
  function tierOf(u) {
    var best = 0;
    if (!u) return 0;
    DB.subs.forEach(function (s) {
      if (s.userId === u.id && (s.status === 'active' || s.status === 'canceled') && s.periodEnd > Date.now()) best = Math.max(best, planBy(s.plan).tier);
    });
    return best;
  }
  
  function liveSub(u) { return DB.subs.filter(function (s) { return s.userId === u.id && s.status === 'active' && s.periodEnd > Date.now(); })[0]; }
  
  function subscribe(u, code, provider, paid) {
    DB.subs.forEach(function (s) { if (s.userId === u.id && s.status === 'active') s.status = 'replaced'; });
    if (!code) return;
    var p = planBy(code), now = Date.now();
    var sub = { id: uid(), userId: u.id, plan: code, status: 'active', provider: provider, start: now, periodEnd: now + 30 * 864e5 };
    DB.subs.push(sub);
    if (paid) DB.payments.push({ id: uid(), userId: u.id, plan: code, amount: p.usd, currency: 'USD', at: now, simulated: true });
  }

  function mark(u, lessonId, st) { (DB.progress[u.id] = DB.progress[u.id] || {})[lessonId] = st; }
  function status(u, lessonId) { return (DB.progress[u.id] || {})[lessonId] || ''; }
  function touch(u) { var a = (DB.activity[u.id] = DB.activity[u.id] || []); if (a.indexOf(today()) < 0) a.push(today()); }
  function xp(u) { return u.xp || 0; }
  
  function streak(u) {
    var set = {}, n = 0, d = new Date();
    (DB.activity[u.id] || []).forEach(function (x) { set[x] = 1; });
    if (!set[d.toLocaleDateString('sv')]) d.setDate(d.getDate() - 1);
    while (set[d.toLocaleDateString('sv')]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function lessonsOf(courseId) { return window.SHS.lessons.filter(function (l) { return l.course === courseId && !DB.hidden[l.id]; }).sort(function (a, b) { return a.pos - b.pos; }); }
  function subjectOf(courseId) { return window.SHS.courses.filter(function (c) { return c.id === courseId; })[0].subject; }
  function subjName(id) { var s = window.SHS.subjects.filter(function (x) { return x.id === id; })[0]; return s ? X(s) : id; }

  // Exporta tudo para o escopo global para os outros arquivos usarem
  window.Store = {
    DB: DB, save: save,
    getLang: function() { return lang; },
    setLang: function(l) { lang = l; try { localStorage.setItem(LKEY, l); } catch (e) {} },
    L: L, X: X, esc: esc, today: today, uid: uid, sha: sha,
    me: me, planBy: planBy, planByTier: planByTier, tierOf: tierOf, liveSub: liveSub, subscribe: subscribe,
    mark: mark, status: status, touch: touch, xp: xp, streak: streak,
    lessonsOf: lessonsOf, subjectOf: subjectOf, subjName: subjName,
    reset: function() { DB = defaults(); save(); }
  };
})();