/* ===== O CÉREBRO DO SITE (Roteador e Eventos) ===== */
(function () {
  'use strict';

  var S = window.Store, UI = window.UI, P = window.Pages, C = window.SHS;
  var L = S.L, X = S.X, esc = S.esc, me = S.me;
  var $ = UI.$;
  var rendered = false;

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
    rendered = true;
    if (P.afterRender) P.afterRender(seg);
  }

  window.addEventListener('hashchange', function () {
    render();
    window.scrollTo(0, 0);
  });

  function openCheckout(code) {
    var p = S.getPlans().filter(function (x) { return x.code === code; })[0] || { name: code };
    $('#dlg-body').innerHTML = '<h2>' + esc(p.name) + '</h2><p class="msg info">' + L('paySoon') + '</p>' +
      '<p><button class="btn btn-outline" data-act="close">' + L('okBtn') + '</button></p>';
    $('#dlg').showModal();
  }

  function closeLang() {
    var dd = document.querySelector('.lang-dropdown');
    if (dd && dd.classList.contains('open')) {
      dd.classList.remove('open');
      var btn = document.querySelector('[data-act="toggle-lang"]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }

  function fail(err) { UI.toast((err && err.message) || String(err)); }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLang(); });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.lang-selector')) closeLang();

    var a = e.target.closest('[data-act]');
    if (!a) return;
    var act = a.dataset.act, u = me();

    if (act === 'toggle-lang') {
      var dd = document.querySelector('.lang-dropdown');
      var isOpen = dd.classList.contains('open');
      dd.classList.toggle('open');
      a.setAttribute('aria-expanded', String(!isOpen));
    }
    else if (act === 'toggle-menu') {
      var nav = document.querySelector('.main-nav');
      if (nav) {
        var open = nav.classList.toggle('open');
        a.setAttribute('aria-expanded', String(open));
      }
    }
    else if (act === 'lang') { S.setLang(a.dataset.v); render(); }
    else if (act === 'logout') {
      S.logout().then(function () { UI.go('#/'); render(); });
    }
    else if (act === 'choose') {
      var code = a.dataset.plan;
      var plan = S.getPlans().filter(function (p) { return p.code === code; })[0];
      if (!plan || plan.tier === 0) UI.go(u ? '#/courses' : '#/signup');
      else if (!u) UI.go('#/signup?plan=' + encodeURIComponent(code));
      else openCheckout(code);
    }
    else if (act === 'close') { $('#dlg').close(); }
    else if (act === 'tab') { P.setAdminTab(a.dataset.v); render(); }
    /* ----- ADMIN ----- */
    else if (act === 'adm-edit') { P.adminEdit(a.dataset.t, a.dataset.id); render(); window.scrollTo(0, 0); }
    else if (act === 'adm-cancel') { P.adminEdit(null); render(); }
    else if (act === 'adm-del') {
      if (!window.confirm(L('admConfirmDel'))) return;
      P.adminDelete(a.dataset.t, a.dataset.id).then(function () { UI.toast(L('admDeleted')); render(); }).catch(fail);
    }
    else if (act === 'adm-seed') {
      a.disabled = true;
      P.adminSeed().then(function () { UI.toast(L('admSeeded')); render(); }).catch(function (err) { a.disabled = false; fail(err); });
    }
  });

  // Admin troca o plano de um aluno
  document.addEventListener('change', function (e) {
    // Novo curso: marca "curso grátis" sozinho se a matéria escolhida é grátis por padrão
    var ss = e.target.closest('form[data-form="adm-course"] select[name="subject"]');
    if (ss && !ss.form.querySelector('input[name="id"]')) {
      var sj = S.subjectById(ss.value), cb = ss.form.querySelector('input[name="all_free"]');
      if (cb) cb.checked = !!(sj && sj.free_courses);
    }
    var sel = e.target.closest('[data-plan-user]');
    if (!sel) return;
    P.setUserPlan(sel.dataset.planUser, sel.value).then(function () { UI.toast(L('admSaved')); }).catch(fail);
  });

  function goAfterAuth(f) {
    var plan = f.dataset.plan;
    UI.go(plan && plan !== 'free' ? '#/plans' : '#/dashboard');
    render();
  }

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
      var btn = f.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = L('signingUp'); }
      err.innerHTML = '';
      S.signup(d.name.trim(), email, d.password, d.country).then(function (res) {
        if (res && res.requireConfirm) {
          err.innerHTML = '<div class="msg info">' + L('confirmEmail') + '</div>';
          if (btn) { btn.disabled = false; btn.textContent = L('signup'); }
        } else {
          UI.toast(L('accountCreated'));
          goAfterAuth(f);
        }
      }).catch(function (error) {
        err.innerHTML = '<div class="msg err">' + esc(error.message) + '</div>';
        if (btn) { btn.disabled = false; btn.textContent = L('signup'); }
      });
    }
    else if (kind === 'login') {
      var em = d.email.trim().toLowerCase(), er = $('#err');
      var lb = f.querySelector('button[type="submit"]');
      if (lb) { lb.disabled = true; lb.textContent = L('loggingIn'); }
      er.innerHTML = '';
      S.login(em, d.password).then(function () { goAfterAuth(f); }).catch(function (error) {
        er.innerHTML = '<div class="msg err">' + esc(error.message) + '</div>';
        if (lb) { lb.disabled = false; lb.textContent = L('login'); }
      });
    }
    else if (kind === 'grade') {
      var lid = f.dataset.lesson, right = 0;
      var exs = C.exercises.filter(function (x) { return x.lesson === lid; });
      exs.forEach(function (x) {
        var box = document.getElementById('q-' + x.id), fb = box && box.querySelector('.fb'), v = d[x.id];
        if (!fb) return;
        if (v === undefined || String(v).trim() === '') { fb.innerHTML = '<div class="msg info">' + L('noAnswer') + '</div>'; return; }
        var ok = x.type === 'mc'
          ? Number(v) === Number(x.answer)
          : Math.abs(parseFloat(String(v).replace(',', '.')) - Number(x.answer)) < 1e-9;
        if (ok) right++;
        fb.innerHTML = '<div class="msg ' + (ok ? 'ok' : 'err') + '">' + UI.icon(ok ? 'check' : 'x', 16) + ' <b>' + (ok ? L('correct') : L('notQuite')) + '</b> ' + esc(X(x.exp)) + '</div>';
      });
      if (exs.length && right === exs.length) UI.toast(L('allCorrect'));
    }
    else if (kind.indexOf('adm-') === 0) {
      P.adminSubmit(kind, d).then(function () { UI.toast(L('admSaved')); render(); }).catch(fail);
    }
  });

  $('#dlg').addEventListener('click', function (e) {
    if (e.target === $('#dlg')) $('#dlg').close();
  });

  /* ----- Inicialização: mostra "esqueleto" enquanto carrega; nunca fica em branco ----- */
  UI.renderChrome();
  $('#view').innerHTML = '<div class="page"><div class="wrap"><div class="skeleton sk-title"></div><div class="skeleton sk-line"></div><div class="skeleton sk-line short"></div></div></div>';

  function lateRender() {
    if (/^#\/(login|signup)/.test(location.hash)) return; // não apaga o que a pessoa está digitando
    render();
  }
  S.checkSession().then(function () { return S.loadCatalog(); }).then(lateRender, lateRender);
  setTimeout(function () { if (!rendered) render(); }, 6000);
})();
