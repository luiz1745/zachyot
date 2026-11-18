/* ===== O CÉREBRO DO SITE (Roteador e Eventos) ===== */
(function () {
  'use strict';

  var S = window.Store, UI = window.UI, P = window.Pages;
  var L = S.L, X = S.X, esc = S.esc, me = S.me;
  var $ = UI.$;

  // 1. Lê os parâmetros da URL (ex: ?plan=basic)
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

  // 2. Renderiza a tela baseada no link atual (ex: #/courses)
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

  // 3. Ouve a mudança de página (quando clica em um link)
  window.addEventListener('hashchange', function () { 
    render(); 
    window.scrollTo(0, 0); 
  });

  // 4. Controle do Modal de Checkout (Janela de compra)
  var pendingPlan = null;
  function openCheckout(code) {
    var p = S.planBy(code); 
    pendingPlan = code;
    $('#dlg-body').innerHTML = '<h2>' + esc(p.name) + ' — $' + p.usd + L('month') + '</h2><p class="msg info">' + L('simCheckout') + '</p>';
    $('#dlg').showModal();
  }

  // 5. Ouve os CLICKS em botões (Login, Sair, Comprar, etc)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-act]'); 
    if (!a) return; 
    
    var act = a.dataset.act, u = me();
    
    if (act === 'lang') { 
      S.setLang(a.dataset.v); 
      render(); 
    }
    else if (act === 'logout') { 
      S.DB.session = null; 
      S.save(); 
      UI.go('#/'); 
      render(); 
    }
    else if (act === 'choose') { 
      if (!u) UI.go('#/signup?plan=' + a.dataset.plan); 
      else openCheckout(a.dataset.plan); 
    }
    else if (act === 'confirm') { 
      if (u && pendingPlan) { 
        S.subscribe(u, pendingPlan, 'manual', true); 
        S.save(); 
        $('#dlg').close(); 
        UI.toast(L('planActivated')); 
        UI.go('#/dashboard'); 
        render(); 
      } 
    }
    else if (act === 'close') { 
      $('#dlg').close(); 
    }
    else if (act === 'cancel') { 
      var s = S.liveSub(u); 
      if (s) { 
        s.status = 'canceled'; 
        s.canceledAt = Date.now(); 
        S.save(); 
        render(); 
        UI.toast(L('subCanceled')); 
      } 
    }
    else if (act === 'done') { 
      if (S.status(u, a.dataset.lesson) !== 'done') u.xp = S.xp(u) + 5; 
      S.mark(u, a.dataset.lesson, 'done'); 
      S.touch(u); 
      S.save(); 
      render(); 
      UI.toast(L('lessonCompleted')); 
    }
    else if (act === 'tab') { 
      P.setAdminTab(a.dataset.v); 
      render(); 
    }
    else if (act === 'block') { 
      var t = S.DB.users.filter(function (x) { return x.id === a.dataset.uid; })[0]; 
      t.blocked = !t.blocked; 
      if (t.blocked && t.id === S.DB.session) S.DB.session = null; 
      S.save(); 
      render(); 
    }
    else if (act === 'saveplan') {
      var row = a.closest('tr'), p = S.planBy(a.dataset.plan), usd = parseFloat(row.querySelector('[data-f=usd]').value), rub = row.querySelector('[data-f=rub]').value;
      if (!(usd >= 0)) return UI.toast(L('invalidPrice')); 
      p.usd = usd; 
      p.rub = rub === '' ? null : parseFloat(rub); 
      S.save(); 
      UI.toast(L('planSaved'));
    }
    else if (act === 'vis') { 
      var id = a.dataset.lesson; 
      if (S.DB.hidden[id]) delete S.DB.hidden[id]; 
      else S.DB.hidden[id] = 1; 
      S.save(); 
      render(); 
    }
  });

  // 6. Ouve mudanças em SELECTs (ex: trocar o plano de um usuário no Admin)
  document.addEventListener('change', function (e) {
    var s = e.target.closest('[data-act=setplan]'); 
    if (!s) return;
    var t = S.DB.users.filter(function (x) { return x.id === s.dataset.uid; })[0]; 
    S.subscribe(t, s.value, 'manual', false); 
    S.save(); 
    render(); 
    UI.toast(L('planUpdated'));
  });

  // 7. Ouve o envio de FORMULÁRIOS (Busca, Cadastro, Login, Responder Exercícios)
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
      if (S.DB.users.some(function (x) { return x.email === email; })) { 
        err.innerHTML = '<div class="msg err">' + L('emailTaken') + '</div>'; 
        return; 
      }
      S.sha(d.password).then(function (h) {
        var nu = { id: S.uid(), name: d.name.trim(), email: email, hash: h, country: d.country, uni: d.uni, created: Date.now(), xp: 0, blocked: false, isAdmin: S.DB.users.length === 0 };
        S.DB.users.push(nu); 
        S.DB.session = nu.id; 
        S.touch(nu); 
        S.save();
        var plan = f.dataset.plan; 
        UI.go('#/dashboard'); 
        render(); 
        if (plan && S.planBy(plan)) openCheckout(plan);
      });
    }
    else if (kind === 'login') {
      var em = d.email.trim().toLowerCase(), er = $('#err');
      S.sha(d.password).then(function (h) {
        var usr = S.DB.users.filter(function (x) { return x.email === em && x.hash === h; })[0];
        if (!usr) { er.innerHTML = '<div class="msg err">' + L('wrongCred') + '</div>'; return; }
        if (usr.blocked) { er.innerHTML = '<div class="msg err">' + L('blocked') + '</div>'; return; }
        S.DB.session = usr.id; 
        S.touch(usr); 
        S.save(); 
        UI.go('#/dashboard'); 
        render();
      });
    }
    else if (kind === 'grade') {
      var u = me(), all = true;
      window.SHS.exercises.filter(function (x) { return x.lesson === f.dataset.lesson; }).forEach(function (ex) {
        var v = d[ex.id], ok = false, box = $('#q-' + ex.id + ' .fb');
        if (v === undefined || v === '') { all = false; box.innerHTML = '<div class="msg info">' + L('noAnswer') + '</div>'; return; }
        ok = ex.type === 'mc' ? parseInt(v, 10) === ex.answer : Math.abs(parseFloat(String(v).replace(',', '.')) - ex.answer) < 0.0001;
        if (!ok) all = false;
        var first = !S.DB.attempts.some(function (a) { return a.userId === u.id && a.ex === ex.id && a.ok; });
        S.DB.attempts.push({ userId: u.id, ex: ex.id, ok: ok, at: Date.now() });
        if (ok && first) u.xp = S.xp(u) + 10;
        box.innerHTML = '<div class="msg ' + (ok ? 'ok' : 'err') + '">' + (ok ? L('correct') : L('notQuite')) + esc(X(ex.exp)) + '</div>';
      });
      S.touch(u); 
      if (all) { 
        if (S.status(u, f.dataset.lesson) !== 'done') u.xp = S.xp(u) + 5; 
        S.mark(u, f.dataset.lesson, 'done'); 
        UI.toast(L('allCorrect')); 
      } 
      S.save();
    }
  });

  // 8. Fecha o modal se clicar fora dele
  $('#dlg').addEventListener('click', function (e) { 
    if (e.target === $('#dlg')) $('#dlg').close(); 
  });

  // 9. Dá a partida inicial no site!
  render();
})();