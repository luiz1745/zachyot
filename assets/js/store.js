/* ===== CAMADA DE DADOS (Supabase) =====
   - Planos: Free(0) Basic(1) Intermediate(2) Complete(3)
   - Catálogo (matérias/cursos/aulas): vem das tabelas cat_* do Supabase.
     Se as tabelas estiverem vazias, o site usa o conteúdo inicial do data.js. */
(function () {
  'use strict';

  var supabaseUrl = 'https://zatcmcmyhspxwqjzxtfg.supabase.co';
  var supabaseKey = 'sb_publishable_GueoZKjCvtDI9E-1sfKRbg_GoTPeXNR'; // chave pública (segura com RLS ligado)

  var supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  var LKEY = 'zachyot_lang';
  var lang = 'en';
  try {
    var sv = localStorage.getItem(LKEY);
    if (sv === 'ru' || sv === 'pt' || sv === 'es') lang = sv;
  } catch (e) {}

  var currentUser = null;
  var catalogSource = 'seed'; // 'seed' = data.js | 'db' = Supabase

  // Cotação usada só para mostrar "≈ preço em rublos". Atualize à mão de vez em quando.
  var RUB_RATE = 82.4529;

  var PLANS = [
    { code: 'free',         name: 'Free',         tier: 0, usd: 0 },
    { code: 'basic',        name: 'Basic',        tier: 1, usd: 15 },
    { code: 'intermediate', name: 'Intermediate', tier: 2, usd: 30 },
    { code: 'complete',     name: 'Complete',     tier: 3, usd: 50 }
  ];

  // Cópia do conteúdo inicial (data.js) para o botão "Importar conteúdo inicial"
  var SEED = JSON.parse(JSON.stringify(window.SHS));

  function L(k) { return (window.I18N[lang] && window.I18N[lang][k]) || window.I18N.en[k] || k; }
  function X(o) { return o ? (o[lang] || o.en || '') : ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
  function today() { return new Date().toLocaleDateString('sv'); }
  function must(res) { if (res && res.error) throw res.error; return res ? res.data : null; }
  function slug(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  }

  /* ---------- REGRAS DE PLANO ---------- */
  // Plano mínimo "padrão" por tipo de aula: material = Basic, exercícios corrigidos = Intermediate, vídeo = Complete
  function defaultTier(type) { return type === 'video' ? 3 : (type === 'exercise_set' ? 2 : 1); }

  function planOf(u) {
    if (!u) return PLANS[0];
    if (u.is_admin) return PLANS[PLANS.length - 1];
    return PLANS.filter(function (p) { return p.code === u.plan; })[0] || PLANS[0];
  }
  function tierOf(u) { return planOf(u).tier; }
  function planByTier(t) {
    return PLANS.filter(function (p) { return p.tier >= t; })[0] || PLANS[PLANS.length - 1];
  }
  function courseOf(id) { return window.SHS.courses.filter(function (c) { return c.id === id; })[0]; }

  // Plano mínimo EFETIVO de uma aula (0 = grátis)
  function lessonTier(l) {
    var c = courseOf(l.course);
    if (c) {
      if (c.all_free) return 0;
      if (c.free_lessons && l.pos <= c.free_lessons) return 0;
    }
    return Math.max(1, l.tier || defaultTier(l.type));
  }

  /* ---------- CATÁLOGO ---------- */
  function subjFromRow(r) {
    var o = Object.assign({}, r.name || {});
    o.id = r.id; o.d = r.descr || {}; o.icon = r.icon; o.color = r.color;
    o.free_courses = !!r.free_courses; o.pos = r.pos || 0;
    return o;
  }
  function courseFromRow(r) {
    return { id: r.id, subject: r.subject, level: r.level, lang: r.lang, title: r.title, desc: r.descr || {},
             all_free: !!r.all_free, free_lessons: r.free_lessons || 0, published: r.published !== false };
  }
  function useSeed() {
    var H = window.SHS, s = JSON.parse(JSON.stringify(SEED));
    H.subjects = s.subjects; H.courses = s.courses; H.lessons = s.lessons; H.exercises = s.exercises;
    catalogSource = 'seed';
  }
  // IMPORTANTE: troca só as listas dentro de window.SHS (nunca troca o objeto), para as telas verem os dados novos
  async function loadCatalog() {
    try {
      var r = await Promise.all([
        supabase.from('cat_subjects').select('*').order('pos'),
        supabase.from('cat_courses').select('*').order('created_at'),
        supabase.from('cat_lessons').select('*').order('pos'),
        supabase.from('cat_exercises').select('*').order('pos')
      ]);
      r.forEach(function (x) { if (x.error) throw x.error; });
      if (!r[0].data.length && !r[1].data.length) { useSeed(); return; }
      var H = window.SHS;
      H.subjects = r[0].data.map(subjFromRow);
      H.courses = r[1].data.map(courseFromRow);
      H.lessons = r[2].data.map(function (l) {
        return { id: l.id, course: l.course, pos: l.pos, type: l.type, tier: l.tier, title: l.title,
                 glossary: l.glossary || [], html: l.html || '', published: l.published !== false };
      });
      H.exercises = r[3].data.map(function (e) {
        return { id: e.id, lesson: e.lesson, type: e.type, answer: e.answer, q: e.q, opts: e.opts || [], exp: e.exp || {} };
      });
      catalogSource = 'db';
    } catch (e) {
      console.log('Catálogo: usando data.js (', e && e.message, ')');
      useSeed();
    }
  }

  async function seedCatalog() {
    var s = SEED;
    var ml = function (o) { return { en: o.en, ru: o.ru, pt: o.pt, es: o.es }; };
    var subs = s.subjects.map(function (x, i) {
      return { id: x.id, name: ml(x), descr: x.d || {}, icon: x.icon || 'book', color: x.color || '#27509B', free_courses: !!x.free_courses, pos: i };
    });
    var cs = s.courses.map(function (c) {
      return { id: c.id, subject: c.subject, level: c.level || 'beginner', lang: c.lang || 'en', title: c.title, descr: c.desc || {},
               all_free: !!c.all_free, free_lessons: c.free_lessons || 0, published: true };
    });
    var ls = s.lessons.map(function (l) {
      return { id: l.id, course: l.course, pos: l.pos, type: l.type, tier: l.tier || defaultTier(l.type),
               title: l.title, glossary: l.glossary || [], html: l.html || '', published: true };
    });
    var es = s.exercises.map(function (e, i) {
      return { id: e.id, lesson: e.lesson, type: e.type, answer: e.answer, q: e.q, opts: e.opts || null, exp: e.exp || {}, pos: i };
    });
    must(await supabase.from('cat_subjects').upsert(subs));
    must(await supabase.from('cat_courses').upsert(cs));
    must(await supabase.from('cat_lessons').upsert(ls));
    if (es.length) must(await supabase.from('cat_exercises').upsert(es));
    await loadCatalog();
  }

  /* ---------- LOGIN ---------- */
  async function fetchProfile(id) {
    var res = await supabase.from('profiles').select('*').eq('id', id).single();
    if (res.error) throw res.error;
    return res.data;
  }

  window.Store = {
    getLang: function () { return lang; },
    setLang: function (l) { lang = l; try { localStorage.setItem(LKEY, l); } catch (e) {} },
    L: L, X: X, esc: esc, today: today, slug: slug,

    me: function () { return currentUser || null; },

    login: async function (email, pass) {
      var r = await supabase.auth.signInWithPassword({ email: email, password: pass });
      if (r.error) throw r.error;
      currentUser = await fetchProfile(r.data.user.id);
      await loadCatalog(); // admin passa a ver rascunhos
      return currentUser;
    },

    signup: async function (name, email, pass, country) {
      var r = await supabase.auth.signUp({ email: email, password: pass, options: { data: { name: name } } });
      if (r.error) throw r.error;
      if (!r.data.session) return { requireConfirm: true };
      currentUser = await fetchProfile(r.data.user.id);
      return currentUser;
    },

    logout: async function () {
      await supabase.auth.signOut();
      currentUser = null;
      await loadCatalog();
    },

    checkSession: async function () {
      try {
        var r = await supabase.auth.getSession();
        if (r.error) throw r.error;
        if (r.data && r.data.session) currentUser = await fetchProfile(r.data.session.user.id);
      } catch (e) {
        console.log('Visitante (sem sessão ativa).');
      }
    },

    // planos
    getPlans: function () { return PLANS; },
    planByTier: planByTier,
    planOf: planOf,
    tierOf: tierOf,
    lessonTier: lessonTier,
    defaultTier: defaultTier,
    rubRate: function () { return RUB_RATE; },

    // catálogo
    loadCatalog: loadCatalog,
    catalogSource: function () { return catalogSource; },
    seedCatalog: seedCatalog,
    courseOf: courseOf,
    subjectById: function (id) { return window.SHS.subjects.filter(function (s) { return s.id === id; })[0]; },
    subjName: function (id) {
      var s = window.SHS.subjects.filter(function (x) { return x.id === id; })[0];
      return s ? X(s) : id;
    },
    lessonsOf: function (courseId) {
      return window.SHS.lessons.filter(function (l) { return l.course === courseId; })
        .sort(function (a, b) { return a.pos - b.pos; });
    },
    xp: function (u) { return u ? (u.xp || 0) : 0; },

    // escrita (só funciona para admin: o Supabase bloqueia os outros via RLS)
    saveRow: function (table, row) { return supabase.from(table).upsert(row).then(must); },
    deleteRow: function (table, id) { return supabase.from(table).delete().eq('id', id).then(must); },
    setUserPlan: function (id, plan) { return supabase.from('profiles').update({ plan: plan }).eq('id', id).then(must); }
  };

  window.supabaseClient = supabase;
})();
