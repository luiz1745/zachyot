/* ===== TELAS DO SITE ===== */
(function () {
  'use strict';

  var S = window.Store, UI = window.UI, C = window.SHS;
  var L = S.L, X = S.X, esc = S.esc, me = S.me;
  var $ = UI.$;

  function pHome() {
    var gl = [['Derivative', 'Производная'], ['Force', 'Сила'], ['Solution', 'Раствор'], ['Drawing scale', 'Масштаб чертежа']];
    return '<section class="hero"><div class="wrap"><h1>' + L('heroTitle') + '</h1>' +
      '<p class="lead">' + L('heroLead') + '</p>' +
      '<div class="cta"><a class="btn btn-yellow" href="#/plans">' + L('seePlans') + '</a><a class="btn btn-light" href="#/courses">' + L('browse') + '</a></div>' +
      '<ul class="gloss" aria-label="Glossary example">' + gl.map(function (g) { return '<li><span class="en">' + g[0] + '</span><span class="ru">' + g[1] + '</span></li>'; }).join('') + '</ul></div></section>' +
      '<section class="search"><div class="wrap"><form data-form="search" role="search"><div class="field"><label for="q">' + L('searchLabel') + '</label><input id="q" name="q" type="search" placeholder="' + L('searchPh') + '"></div>' +
      '<div class="field"><label for="s">' + L('subject') + '</label><select id="s" name="subject"><option value="">' + L('allSubjects') + '</option>' + C.subjects.map(function (s) { return '<option value="' + s.id + '">' + esc(X(s)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="l">' + L('explainedIn') + '</label><select id="l" name="lang"><option value="">' + L('any') + '</option><option value="en">English</option><option value="ru">Русский</option></select></div>' +
      '<div class="field"><label for="v">' + L('level') + '</label><select id="v" name="level"><option value="">' + L('anyLevel') + '</option><option value="beginner">' + L('beginner') + '</option><option value="intermediate">' + L('intermediate') + '</option><option value="advanced">' + L('advanced') + '</option></select></div>' +
      '<button class="btn btn-yellow" type="submit">' + L('searchBtn') + '</button></form></div></section>' +
      '<section class="block"><div class="wrap"><h2 class="section-title">' + L('subjectsTitle') + '</h2><p class="muted">' + L('subjectsSub') + '</p><div class="grid">' + UI.subjectCards() + '</div></div></section>' +
      '<section class="block alt"><div class="wrap"><h2 class="section-title">' + L('howTitle') + '</h2><div class="steps">' +
      '<div class="step"><div><b>' + L('step1') + '</b><br><span class="muted">' + L('step1d') + '</span></div></div>' +
      '<div class="step"><div><b>' + L('step2') + '</b><br><span class="muted">' + L('step2d') + '</span></div></div>' +
      '<div class="step"><div><b>' + L('step3') + '</b><br><span class="muted">' + L('step3d') + '</span></div></div></div></div></section>' +
      '<section class="block"><div class="wrap"><h2 class="section-title">' + L('plansTitle') + '</h2><p class="muted">' + L('plansSub') + '</p>' + UI.planCards() + '</div></section>' +
      '<section class="block alt"><div class="wrap"><h2 class="section-title">' + L('qTitle') + '</h2>' +
      '<details><summary>' + L('q1') + '</summary><p>' + L('a1') + '</p></details>' +
      '<details><summary>' + L('q2') + '</summary><p>' + L('a2') + '</p></details>' +
      '<details><summary>' + L('q3') + '</summary><p>' + L('a3') + '</p></details></div></section>';
  }

  function pPlans() { 
    return '<div class="page"><div class="wrap"><h1>' + L('plansTitle') + '</h1><p class="muted">' + L('plansSub') + ' ' + L('a3') + '</p>' + UI.planCards() + '</div></div>'; 
  }

  function pCourses(q) {
    var list = C.courses;
    var sel = q.subject ? C.subjects.filter(function (s) { return s.id === q.subject; })[0] : null;
    return '<div class="page"><div class="wrap"><h1>' + L('courses') + (sel ? ': ' + esc(X(sel)) : '') + '</h1>' +
      (list.length ? '<div class="grid">' + list.map(function (c) {
        var n = S.lessonsOf(c.id).length;
        return '<article class="card"><div class="top">' + esc(X(c.title)) + '</div><div class="body"><span class="badge">' + esc(S.subjName(c.subject)) + '</span><p>' + esc(X(c.desc)) + '</p><span class="muted">' + n + ' ' + L('lessons') + '</span><a class="btn btn-yellow btn-sm" href="#/course/' + c.id + '">' + L('openCourse') + '</a></div></article>';
      }).join('') + '</div>' : '<div class="empty">' + L('noCourses') + '</div>') +
      '<p><a href="#/">' + L('backSubjects') + '</a></p></div></div>';
  }

  function pCourse(id) {
    var c = C.courses.filter(function (x) { return x.id === id; })[0], u = me();
    if (!c) return pCourses({});
    var ls = S.lessonsOf(id), t = S.tierOf(u), done = 0;
    return '<div class="page"><div class="wrap"><h1>' + esc(X(c.title)) + '</h1><p class="muted">' + esc(X(c.desc)) + '</p>' +
      (u ? '<div class="bar" aria-label="progress"><div style="width:0%"></div></div><p class="muted">0 / ' + ls.length + ' ' + L('progress') + '</p>' : '<div class="msg info">' + L('createFree') + '</div>') +
      '<div class="panel"><ul class="lesson-list">' + ls.map(function (l) {
        var ok = t >= l.tier, ic = { material: '📖', exercise_set: '✍️', video: '🎬' }[l.type];
        return '<li><span>' + ic + '</span><span class="t"><a href="#/lesson/' + l.id + '">' + l.pos + '. ' + esc(X(l.title)) + '</a></span>' +
          (ok ? '' : '<span>🔒</span>') + UI.lockBadge(l.tier) + '</li>';
      }).join('') + '</ul></div></div></div>';
  }

  function pLesson(id) {
    var l = C.lessons.filter(function (x) { return x.id === id; })[0], u = me();
    if (!l) return pCourses({});
    var c = C.courses.filter(function (x) { return x.id === l.course; })[0], need = S.planByTier(l.tier);
    var head = '<div class="page"><div class="wrap"><p><a href="#/course/' + c.id + '">← ' + esc(X(c.title)) + '</a></p><h1>' + esc(X(l.title)) + '</h1>';
    if (!u) return head + '<div class="msg info">' + L('loginToOpen') + '</div><p><a class="btn btn-yellow" href="#/login">' + L('login') + '</a> <a class="btn btn-outline" href="#/signup">' + L('signup') + '</a></p></div></div>';
    if (S.tierOf(u) < l.tier) return head + '<div class="msg info">🔒 ' + L('needPlan') + '<b>' + esc(need.name) + '</b>' + L('orHigher') + '</div><p><a class="btn btn-yellow" href="#/plans">' + L('seePlans') + '</a></p></div></div>';
    
    var body = '';
    if (l.type === 'material') body = '<div class="panel prose">' + l.html + '</div>';
    else if (l.type === 'video') body = '<div class="empty">' + L('videoNot') + '</div>';
    else body = '<form data-form="grade" data-lesson="' + id + '">' + C.exercises.filter(function (e) { return e.lesson === id; }).map(function (e, i) {
      return '<div class="q" id="q-' + e.id + '"><b>' + (i + 1) + '. ' + esc(X(e.q)) + '</b>' + (e.type === 'mc'
        ? e.opts.map(function (o, k) { return '<label class="opt"><input type="radio" name="' + e.id + '" value="' + k + '"> ' + esc(o) + '</label>'; }).join('')
        : '<div style="max-width:12rem;margin-top:.4rem"><input name="' + e.id + '" inputmode="decimal" aria-label="answer"></div>') + '<div class="fb"></div></div>';
    }).join('') + '<button class="btn btn-yellow" type="submit">' + L('checkAnswers') + '</button></form>';
    
    var gl = '<aside class="panel"><h2>' + L('glossary') + '</h2><table style="min-width:0">' + l.glossary.map(function (g) { return '<tr><td>' + esc(g.en) + '</td><td><b>' + esc(g[S.getLang()] || g.ru) + '</b></td></tr>'; }).join('') + '</table></aside>';
    return head + '<div class="two"><div>' + body + '</div>' + gl + '</div></div></div>';
  }

  function pAuth(kind, q) {
    var su = kind === 'signup';
    return '<div class="page"><div class="wrap"><form class="auth" data-form="' + kind + '" data-plan="' + esc(q.plan || '') + '"><h1>' + (su ? L('createAcc') : L('login')) + '</h1><div id="err"></div>' +
      (su ? '<div class="field"><label for="nm">' + L('fullName') + '</label><input id="nm" name="name" required></div>' : '') +
      '<div class="field"><label for="em">' + L('email') + '</label><input id="em" name="email" type="email" required autocomplete="email"></div>' +
      '<div class="field"><label for="pw">' + L('password') + '</label><input id="pw" name="password" type="password" minlength="8" required autocomplete="' + (su ? 'new-password' : 'current-password') + '"></div>' +
      (su ? '<div class="field"><label for="co">' + L('country') + '</label><input id="co" name="country"></div>' : '') +
      '<button class="btn btn-yellow" type="submit">' + (su ? L('signup') : L('login')) + '</button>' +
      '<p class="muted">' + (su ? L('alreadyAcc') + '<a href="#/login">' + L('login') + '</a>' : L('newHere') + '<a href="#/signup">' + L('signup') + '</a>') + '</p>' +
      (su ? '<p class="muted" style="font-size:.82rem">' + L('previewNote') + '</p>' : '') + '</form></div></div>';
  }

  function pDash() {
    var u = me(); if (!u) return pAuth('login', {});
    return '<div class="page"><div class="wrap"><h1>' + L('hi') + esc(u.name ? u.name.split(' ')[0] : 'Aluno') + '!</h1>' +
      '<div class="metrics"><div class="metric"><div class="l">' + L('plan') + '</div><div class="v">Complete</div></div>' +
      '<div class="metric"><div class="l">' + L('streakLbl') + '</div><div class="v">🔥 1</div></div>' +
      '<div class="metric"><div class="l">' + L('xpLbl') + '</div><div class="v">' + (u.xp || 0) + '</div></div></div><br>' +
      '<div class="two"><div><div class="panel"><h2>' + L('continueStudy') + '</h2><p>Bem-vindo à sua área do aluno! O banco de dados está conectado.</p></div></div>' +
      '<div><div class="panel"><h2>' + L('badges') + '</h2><p>Em breve...</p></div></div></div></div></div>';
  }

  function pAdmin() {
    var u = me();
    if (!u || !u.is_admin) return '<div class="page"><div class="wrap"><div class="msg err">' + L('admOnly') + '</div></div></div>';
    
    return '<div class="page"><div class="wrap"><h1>' + L('admin') + '</h1>' +
      '<div class="msg info">' + L('admPreview') + '</div><br>' +
      '<div class="panel"><h2>Status da Conexão</h2><p>Você está logado como <b>' + esc(u.name) + '</b> e tem permissões de Administrador no banco de dados.</p></div>' +
      '</div></div>';
  }

  function getPage(seg, q) {
    var html, tabName = seg[0];
    switch (seg[0]) {
      case undefined: html = pHome(); break;
      case 'plans': html = pPlans(); break;
      case 'courses': html = pCourses(q); break;
      case 'course': html = pCourse(seg[1]); break;
      case 'lesson': html = pLesson(seg[1]); break;
      case 'login': html = pAuth('login', q); break;
      case 'signup': html = pAuth('signup', q); break;
      case 'dashboard': html = pDash(); break;
      case 'admin': html = pAdmin(); break;
      default: html = pHome();
    }
    return { html: html, name: tabName };
  }

  window.Pages = { getPage: getPage, setAdminTab: function(t) {} };
})();
