/* ===== O CÉREBRO DO SITE (Roteador e Eventos) ===== */
(function () {
  'use strict';

  var S = window.Store, UI = window.UI, P = window.Pages;
  var L = S.L, X = S.X, esc = S.esc, me = S.me;
  var $ = UI.$;

  function parseQ(s) { 
    var o = {}; 
    (s || '').split('&').forEach(function (p) { 
      if (p) { 
        var k = p.split('='); 
        o[k[0]] = decodeURIComponent((k[1] || '').replace(/\+/g, ' ')); 
      } 
    }); 
    return o; 
  }

  function render() {
    var raw = location.hash.slice(1) || '/', 
        parts = raw.split('?'), 
        seg = parts[0].split('/').filter(Boolean), 
        q = parseQ(parts[1]);
    
    var page = P.getPage(seg, q);
    
    document.documentElement.lang = S.getLang();
    UI.renderChrome(); 
    $('#view').innerHTML = page.html;
  }

  window.addEventListener('hashchange', function () { 
    render(); 
    window.scrollTo(0, 0); 
  });

  var pendingPlan = null;
  function openCheckout(code) {
    var p = { name: 'Plano Selecionado' };
    pendingPlan = code;
    $('#dlg-body').innerHTML = '<h2>' + esc(p.name) + '</h2><p class="msg info">' + L('simCheckout') + '</p>';
    $('#dlg').showModal();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-act]'); 
    if (!a) return; 
    
    var act = a.dataset.act, u = me();
    
    if (act === 'lang') { 
      S.setLang(a.dataset.v); 
      render(); 
    }
    else if (act === 'logout') { 
      S.logout().then(function() {
        UI.go('#/'); 
        render(); 
      });
    }
    else if (act === 'choose') { 
      if (!u) UI.go('#/signup?plan=' + a.dataset.plan); 
      else openCheckout(a.dataset.plan); 
    }
    else if (act === 'confirm') { 
      $('#dlg').close(); 
      UI.toast('Plano ativado (Simulação)'); 
      UI.go('#/dashboard'); 
      render(); 
    }
    else if (act === 'close') { 
      $('#dlg').close(); 
    }
    else if (act === 'tab') { 
      P.setAdminTab(a.dataset.v); 
      render(); 
    }
  });

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-form]'); 
    if (!f) return; 
    e.preventDefault();
    
    var kind = f.dataset.form, d = {}; 
    new FormData(f).forEach(function (v, k) { d[k] = v; });
    
    if (kind === 'search') { 
      var qs = Object.keys(d).filter(function (k) { return d[k]; }).map(function (k) { return k + '=' + encodeURIComponent(d[k]); }).join('&'); 
      UI.go('#/courses' + (qs ? '?' + qs : '')); 
    }
    else if (kind === 'signup') {
      var email = d.email.trim().toLowerCase(), err = $('#err');
      err.innerHTML = '<div class="msg info">Criando conta...</div>';
      
      S.signup(d.name.trim(), email, d.password, d.country).then(function(res) {
        if (res && res.requireConfirm) {
          err.innerHTML = '<div class="msg info">Conta criada! Verifique seu e-mail para confirmar.</div>';
        } else {
          UI.toast('Conta criada com sucesso!');
          UI.go('#/dashboard'); 
          render();
        }
      }).catch(function(error) {
        err.innerHTML = '<div class="msg err">' + error.message + '</div>'; 
      });
    }
    else if (kind === 'login') {
      var em = d.email.trim().toLowerCase(), er = $('#err');
      er.innerHTML = '<div class="msg info">Entrando...</div>';
      
      S.login(em, d.password).then(function(user) {
        UI.go('#/dashboard'); 
        render();
      }).catch(function(error) {
        er.innerHTML = '<div class="msg err">' + error.message + '</div>'; 
      });
    }
  });

  $('#dlg').addEventListener('click', function (e) { 
    if (e.target === $('#dlg')) $('#dlg').close(); 
  });

  // Inicializa o site
  S.checkSession().then(function() {
    render();
  }).catch(function() {
    render();
  });
})();
