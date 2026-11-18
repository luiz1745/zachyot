/* ===== CAMADA DE DADOS CONECTADA AO SUPABASE ===== */
(function () {
  'use strict';

  // ATENÇÃO: COLE A SUA CHAVE COMPLETA DO SUPABASE AQUI
  var supabaseUrl = 'https://zatcmcmyhspxwqjzxtfg.supabase.co';
  var supabaseKey = 'sb_publishable_GueoZKjCvtDI9E-1sfKRbg_GoTPeXNR'; 
  
  var supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  var LKEY = 'zachyot_lang';
  var lang = 'en';
  
  try { 
    var sv = localStorage.getItem(LKEY); 
    if (sv === 'ru' || sv === 'pt' || sv === 'es') lang = sv; 
  } catch (e) {}

  var currentUser = null;

  function L(k) { return (window.I18N[lang] && window.I18N[lang][k]) || window.I18N.en[k] || k; }
  function X(o) { return o ? (o[lang] || o.en) : ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
  function today() { return new Date().toLocaleDateString('sv'); }

  window.Store = {
    getLang: function() { return lang; },
    setLang: function(l) { lang = l; try { localStorage.setItem(LKEY, l); } catch (e) {} },
    L: L, X: X, esc: esc, today: today,
    
    // --- AUTENTICAÇÃO REAL ---
    me: function() { return currentUser || null; },
    
    login: async function(email, pass) {
      var { data, error } = await supabase.auth.signInWithPassword({ email: email, password: pass });
      if (error) throw error;
      var { data: profile, error: profileErr } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      if (profileErr) throw profileErr;
      currentUser = profile;
      return profile;
    },
    
    signup: async function(name, email, pass, country) {
      var { data, error } = await supabase.auth.signUp({ 
        email: email, 
        password: pass,
        options: { data: { name: name } }
      });
      if (error) throw error;
      
      if (!data.session) {
        return { requireConfirm: true };
      }
      var { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      currentUser = profile;
      return profile;
    },
    
    logout: async function() {
      await supabase.auth.signOut();
      currentUser = null;
    },
    
    checkSession: async function() {
      try {
        var { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data && data.session) {
          var { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).single();
          if (!pErr && profile) currentUser = profile;
        }
      } catch (e) {
        console.log("Visitante (sem sessão ativa).");
      }
    },

    // --- FUNÇÕES DE APOIO (Para o site não quebrar) ---
    planByTier: function(t) { 
      var plans = [{tier:1, name:'Basic'}, {tier:2, name:'Intermediate'}, {tier:3, name:'Complete'}]; 
      return plans.filter(function(p){return p.tier === t})[0]; 
    },
    tierOf: function(u) { 
      return u ? 3 : 0; // Simula que todo logado tem acesso "Complete"
    },
    liveSub: function(u) { 
      if (!u) return null;
      return { plan: 'complete', status: 'active', periodEnd: Date.now() + 30 * 864e5 }; 
    },
    status: function(u, id) { return ''; },
    mark: function(u, id, st) {},
    touch: function(u) {},
    xp: function(u) { return u ? (u.xp || 0) : 0; },
    streak: function(u) { return 1; },
    subjectOf: function(id) { return 'mathematics'; },
    subjName: function(id) { return 'Mathematics'; },
    lessonsOf: function(id) { return window.SHS.lessons; },
    reset: function() {}
  };
  
  window.supabaseClient = supabase;
})();
