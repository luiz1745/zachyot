/* ===== TELAS DO SITE ===== */
(function () {
  'use strict';

  var S = window.Store, UI = window.UI, C = window.SHS;
  var L = S.L, X = S.X, esc = S.esc, me = S.me;
  var $ = UI.$;

  // --- FUNÇÕES AUXILIARES ---
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
    var list = C.courses.filter(function (c) {
      var t = (X(c.title) + ' ' + X(c.desc)).toLowerCase();
      return (!q.q || t.indexOf(q.q.toLowerCase()) > -1) && (!q.subject || c.subject === q.subject) && (!q.level || c.level === q.level) && (!q.lang || c.lang === q.lang);
    });
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
    var ls = S.lessonsOf(id), t = S.tierOf(u), done = u ? ls.filter(function (l) { return S.status(u, l.id) === 'done'; }).length : 0;
    return '<div class="page"><div class="wrap"><h1>' + esc(X(c.title)) + '</h1><p class="muted">' + esc(X(c.desc)) + '</p>' +
      (u ? '<div class="bar" aria-label="progress"><div style="width:' + (ls.length ? Math.round(done / ls.length * 100) : 0) + '%"></div></div><p class="muted">' + done + ' / ' + ls.length + ' ' + L('progress') + '</p>' : '<div class="msg info">' + L('createFree') + '</div>') +
      '<div class="panel"><ul class="lesson-list">' + ls.map(function (l) {
        var ok = t >= l.tier, st = u ? S.status(u, l.id) : '', ic = { material: '📖', exercise_set: '✍️', video: '🎬' }[l.type];
        return '<li><span>' + ic + '</span><span class="t"><a href="#/lesson/' + l.id + '">' + l.pos + '. ' + esc(X(l.title)) + '</a></span>' +
          (st === 'done' ? '<span class="tag active">' + L('done') + '</span>' : '') + (ok ? '' : '<span>🔒</span>') + UI.lockBadge(l.tier) + '</li>';
      }).join('') + '</ul></div></div></div>';
  }

  var lastCounted = null;
  function pLesson(id) {
    var l = C.lessons.filter(function (x) { return x.id === id; })[0], u = me();
    if (!l || S.DB.hidden[id]) return pCourses({});
    var c = C.courses.filter(function (x) { return x.id === l.course; })[0], need = S.planByTier(l.tier);
    var head = '<div class="page"><div class="wrap"><p><a href="#/course/' + c.id + '">← ' + esc(X(c.title)) + '</a></p><h1>' + esc(X(l.title)) + '</h1>';
    if (!u) return head + '<div class="msg info">' + L('loginToOpen') + '</div><p><a class="btn btn-yellow" href="#/login">' + L('login') + '</a> <a class="btn btn-outline" href="#/signup">' + L('signup') + '</a></p></div></div>';
    if (S.tierOf(u) < l.tier) return head + '<div class="msg info">🔒 ' + L('needPlan') + '<b>' + esc(need.name) + '</b>' + L('orHigher') + '</div><p><a class="btn btn-yellow" href="#/plans">' + L('seePlans') + '</a></p></div></div>';
    
    var sj = S.subjectOf(l.course); 
    if (lastCounted !== id) { S.DB.views[sj] = (S.DB.views[sj] || 0) + 1; lastCounted = id; } 
    S.touch(u); 
    if (!S.status(u, id)) S.mark(u, id, 'progress'); 
    S.save();
    
    var body = '';
    if (l.type === 'material') body = '<div class="panel prose">' + l.html + '</div>';
    else if (l.type === 'video') body = '<div class="empty">' + L('videoNot') + '</div>';
    else body = '<form data-form="grade" data-lesson="' + id + '">' + C.exercises.filter(function (e) { return e.lesson === id; }).map(function (e, i) {
      return '<div class="q" id="q-' + e.id + '"><b>' + (i + 1) + '. ' + esc(X(e.q)) + '</b>' + (e.type === 'mc'
        ? e.opts.map(function (o, k) { return '<label class="opt"><input type="radio" name="' + e.id + '" value="' + k + '"> ' + esc(o) + '</label>'; }).join('')
        : '<div style="max-width:12rem;margin-top:.4rem"><input name="' + e.id + '" inputmode="decimal" aria-label="answer"></div>') + '<div class="fb"></div></div>';
    }).join('') + '<button class="btn btn-yellow" type="submit">' + L('checkAnswers') + '</button></form>';
    
    var gl = '<aside class="panel"><h2>' + L('glossary') + '</h2><table style="min-width:0">' + l.glossary.map(function (g) { return '<tr><td>' + esc(g.en) + '</td><td><b>' + esc(g[S.getLang()] || g.ru) + '</b></td></tr>'; }).join('') + '</table></aside>';
    var doneBtn = l.type !== 'exercise_set' ? '<p><button class="btn btn-blue" data-act="done" data-lesson="' + id + '">' + (S.status(u, id) === 'done' ? '✓ ' + L('completed') : L('markDone')) + '</button></p>' : '';
    return head + '<div class="two"><div>' + body + doneBtn + '</div>' + gl + '</div></div></div>';
  }

  function pAuth(kind, q) {
    var su = kind === 'signup';
    return '<div class="page"><div class="wrap"><form class="auth" data-form="' + kind + '" data-plan="' + esc(q.plan || '') + '"><h1>' + (su ? L('createAcc') : L('login')) + '</h1><div id="err"></div>' +
      (su ? '<div class="field"><label for="nm">' + L('fullName') + '</label><input id="nm" name="name" required></div>' : '') +
      '<div class="field"><label for="em">' + L('email') + '</label><input id="em" name="email" type="email" required autocomplete="email"></div>' +
      '<div class="field"><label for="pw">' + L('password') + '</label><input id="pw" name="password" type="password" minlength="8" required autocomplete="' + (su ? 'new-password' : 'current-password') + '"></div>' +
      (su ? '<div class="field"><label for="co">' + L('country') + '</label><input id="co" name="country"></div><div class="field"><label for="un">' + L('university') + '</label><input id="un" name="uni" value="Saint Petersburg Mining University"></div>' : '') +
      '<button class="btn btn-yellow" type="submit">' + (su ? L('signup') : L('login')) + '</button>' +
      '<p class="muted">' + (su ? L('alreadyAcc') + '<a href="#/login">' + L('login') + '</a>' : L('newHere') + '<a href="#/signup">' + L('signup') + '</a>') + '</p>' +
      (su ? '<p class="muted" style="font-size:.82rem">' + L('previewNote') + '</p>' : '') + '</form></div></div>';
  }

  function pDash() {
    var u = me(); if (!u) return pAuth('login', {});
    var t = S.tierOf(u), sub = S.liveSub(u) || S.DB.subs.filter(function (s) { return s.userId === u.id && s.status === 'canceled' && s.periodEnd > Date.now(); })[0];
    var next = null; C.courses.forEach(function (c) { S.lessonsOf(c.id).forEach(function (l) { if (!next && t >= l.tier && S.status(u, l.id) !== 'done') next = l; }); });
    var rank = S.DB.users.filter(function (x) { return !x.isAdmin; }).sort(function (a, b) { return S.xp(b) - S.xp(a); }).slice(0, 5);
    var BADGES = function (u) {
      var any = Object.keys(S.DB.progress[u.id] || {}).some(function (k) { return S.DB.progress[u.id][k] === 'done'; });
      var correct = S.DB.attempts.some(function (a) { return a.userId === u.id && a.ok; });
      return [[any, L('badge1')], [correct, L('badge2')], [S.streak(u) >= 3, L('badge3')]];
    };
    return '<div class="page"><div class="wrap"><h1>' + L('hi') + esc(u.name.split(' ')[0]) + '!</h1>' +
      '<div class="metrics"><div class="metric"><div class="l">' + L('plan') + '</div><div class="v">' + (t ? esc(S.planByTier(t).name) : L('none')) + '</div><div class="h">' + (sub ? (sub.status === 'canceled' ? L('canceledUntil') : L('renews')) + new Date(sub.periodEnd).toLocaleDateString() : '') + '</div></div>' +
      '<div class="metric"><div class="l">' + L('streakLbl') + '</div><div class="v">🔥 ' + S.streak(u) + '</div><div class="h">' + L('daysRow') + '</div></div>' +
      '<div class="metric"><div class="l">' + L('xpLbl') + '</div><div class="v">' + S.xp(u) + '</div><div class="h">' + L('xpHelp') + '</div></div></div><br>' +
      (!t ? '<div class="msg info">' + L('noPlanMsg') + '<a href="#/plans"><b>' + L('chooseOne') + '</b></a></div><br>' : '') +
      '<div class="two"><div><div class="panel"><h2>' + L('continueStudy') + '</h2>' + (next ? '<p>' + esc(X(next.title)) + '</p><a class="btn btn-yellow" href="#/lesson/' + next.id + '">' + L('openLesson') + '</a>' : '<p class="muted">' + L('nothingContinue') + '</p>') + '</div><br>' +
      '<div class="panel"><h2>' + L('myCourses') + '</h2>' + C.courses.map(function (c) {
        var ls = S.lessonsOf(c.id), d = ls.filter(function (l) { return S.status(u, l.id) === 'done'; }).length;
        return '<p><a href="#/course/' + c.id + '"><b>' + esc(X(c.title)) + '</b></a></p><div class="bar"><div style="width:' + (ls.length ? Math.round(d / ls.length * 100) : 0) + '%"></div></div><p class="muted">' + d + ' / ' + ls.length + '</p>';
      }).join('') + '</div></div>' +
      '<div><div class="panel"><h2>' + L('badges') + '</h2>' + BADGES(u).map(function (b) { return '<p>' + (b[0] ? '🏅' : '⚪') + ' <span class="' + (b[0] ? '' : 'muted') + '">' + b[1] + '</span></p>'; }).join('') + '</div><br>' +
      '<div class="panel"><h2>' + L('ranking') + '</h2>' + rank.map(function (r, i) { return '<p>' + (i + 1) + '. ' + esc(r.name) + ' — ' + S.xp(r) + ' XP</p>'; }).join('') + '</div>' +
      (sub && sub.status === 'active' ? '<br><button class="btn btn-danger btn-sm" data-act="cancel">' + L('cancelSub') + '</button>' : '') + '</div></div></div></div>';
  }

  var adminTab = 'overview';
  function hbars(rows) {
    var max = Math.max.apply(null, rows.map(function (r) { return r[1]; }).concat([1]));
    return rows.map(function (r) { return '<div class="hbar"><span>' + esc(r[0]) + '</span><div class="bar"><div style="width:' + Math.round(r[1] / max * 100) + '%"></div></div><b>' + r[1] + '</b></div>'; }).join('');
  }
  
  function pAdmin() {
    var u = me();
    if (!u || !u.isAdmin) return '<div class="page"><div class="wrap"><div class="msg err">' + L('admOnly') + '</div></div></div>';
    var tabs = [['overview', L('tabDash')], ['users', L('tabUsers')], ['plans', L('tabPlans')], ['content', L('tabContent')]];
    var out = '<div class="page"><div class="wrap"><h1>' + L('admin') + '</h1><div class="msg info">' + L('admPreview') + '</div><br>' +
      '<div class="admin-nav">' + tabs.map(function (t) { return '<button class="btn btn-sm ' + (adminTab === t[0] ? 'btn-blue' : 'btn-outline') + '" data-act="tab" data-v="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
    var students = S.DB.users.filter(function (x) { return !x.isAdmin; });
    
    if (adminTab === 'overview') {
      var live = S.DB.subs.filter(function (s) { return s.status === 'active' && s.periodEnd > Date.now(); }), canceled = S.DB.subs.filter(function (s) { return s.status === 'canceled'; }).length;
      var mrr = live.reduce(function (a, s) { return a + S.planBy(s.plan).usd; }, 0), byPlan = S.DB.plans.map(function (p) { return [p.name, live.filter(function (s) { return s.plan === p.code; }).length]; });
      var top = byPlan.slice().sort(function (a, b) { return b[1] - a[1]; })[0];
      var vs = Object.keys(S.DB.views).map(function (k) { return [S.subjName(k), S.DB.views[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
      var old = students.filter(function (s) { return Date.now() - s.created > 30 * 864e5; });
      var ret = old.length ? Math.round(old.filter(function (s) { return (S.DB.activity[s.id] || []).some(function (d) { return new Date(d).getTime() > Date.now() - 30 * 864e5; }); }).length / old.length * 100) + '%' : '—';
      var months = {}; S.DB.payments.forEach(function (p) { var k = new Date(p.at).toISOString().slice(0, 7); months[k] = (months[k] || 0) + p.amount; });
      var mrows = Object.keys(months).sort().map(function (k) { return [k, months[k]]; });
      var M = function (l, v, h) { return '<div class="metric"><div class="l">' + l + '</div><div class="v">' + v + '</div><div class="h">' + h + '</div></div>'; };
      out += '<div class="metrics">' + M(L('registered'), students.length, '') + M(L('activeSubs'), live.length, '') +
        M(L('mrr'), '$' + mrr, L('mrrHelp')) +
        M(L('churn'), (live.length + canceled) ? Math.round(canceled / (live.length + canceled) * 100) + '%' : '—', L('churnHelp')) +
        M(L('retention'), ret, old.length ? L('retHelp') : L('retNeed')) +
        M(L('mostPlan'), top && top[1] ? esc(top[0]) : '—', top && top[1] ? top[1] + ' ' + L('subscribers') : L('noSubsYet')) + '</div><br>' +
        '<div class="two"><div class="panel"><h2>' + L('subsByPlan') + '</h2>' + (live.length ? hbars(byPlan) : '<div class="empty">' + L('noSubs') + '</div>') + '</div>' +
        '<div class="panel"><h2>' + L('mostSubjects') + '</h2>' + (vs.length ? hbars(vs) : '<div class="empty">' + L('noLessons') + '</div>') + '</div></div><br>' +
        '<div class="panel"><h2>' + L('revenue') + '</h2>' + (mrows.length ? hbars(mrows) : '<div class="empty">' + L('noPay') + '</div>') + '</div>';
    }
    if (adminTab === 'users') {
      out += '<div class="panel"><h2>' + L('usersH') + ' (' + students.length + ')</h2>' + (students.length ? '<div class="scroll"><table><thead><tr><th>' + L('name') + '</th><th>' + L('country') + '</th><th>' + L('plan') + '</th><th>' + L('access') + '</th><th></th></tr></thead><tbody>' + students.map(function (s) {
        var sb = S.liveSub(s);
        return '<tr><td>' + esc(s.name) + '<br><small class="muted">' + esc(s.email) + '</small></td><td>' + esc(s.country || '—') + '</td><td><select data-act="setplan" data-uid="' + s.id + '" aria-label="plan"><option value="">' + L('noPlan') + '</option>' + S.DB.plans.map(function (p) { return '<option value="' + p.code + '"' + (sb && sb.plan === p.code ? ' selected' : '') + '>' + esc(p.name) + '</option>'; }).join('') + '</select></td><td><span class="tag ' + (s.blocked ? 'blocked' : 'active') + '">' + (s.blocked ? L('blockedTag') : L('allowed')) + '</span></td><td><button class="btn btn-sm ' + (s.blocked ? 'btn-outline' : 'btn-danger') + '" data-act="block" data-uid="' + s.id + '">' + (s.blocked ? L('unblock') : L('block')) + '</button></td></tr>';
      }).join('') + '</tbody></table></div>' : '<div class="empty">' + L('noStudents') + '</div>') + '</div>';
    }
    if (adminTab === 'plans') {
      out += '<div class="panel"><h2>' + L('plansPrices') + '</h2><div class="scroll"><table><thead><tr><th>' + L('plan') + '</th><th>USD</th><th>RUB</th><th></th></tr></thead><tbody>' + S.DB.plans.map(function (p) {
        return '<tr data-plan="' + p.code + '"><td>' + esc(p.name) + '</td><td><input type="number" min="0" value="' + p.usd + '" data-f="usd" aria-label="USD"></td><td><input type="number" min="0" value="' + (p.rub == null ? '' : p.rub) + '" placeholder="' + L('notSet') + '" data-f="rub" aria-label="RUB"></td><td><button class="btn btn-yellow btn-sm" data-act="saveplan" data-plan="' + p.code + '">' + L('save') + '</button></td></tr>';
      }).join('') + '</tbody></table></div></div>';
    }
    if (adminTab === 'content') {
      out += '<div class="panel"><h2>' + L('lessons') + '</h2><div class="scroll"><table><thead><tr><th>' + L('courses') + '</th><th>' + L('lessonCol') + '</th><th>' + L('type') + '</th><th>' + L('minPlan') + '</th><th></th></tr></thead><tbody>' + C.lessons.map(function (l) {
        var c = C.courses.filter(function (x) { return x.id === l.course; })[0];
        return '<tr><td>' + esc(X(c.title)) + '</td><td>' + l.pos + '. ' + esc(X(l.title)) + '</td><td>' + l.type + '</td><td>' + esc(S.planByTier(l.tier).name) + '</td><td><button class="btn btn-sm btn-outline" data-act="vis" data-lesson="' + l.id + '">' + (S.DB.hidden[l.id] ? L('publish') : L('unpublish')) + '</button></td></tr>';
      }).join('') + '</tbody></table></div><p class="muted">' + L('editNeeds') + '</p></div>';
    }
    return out + '</div></div>';
  }

  // Retorna o HTML da tela atual e o nome da tela (para o app.js saber onde está)
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
    if (seg[0] !== 'lesson') lastCounted = null;
    return { html: html, name: tabName };
  }

  // Exporta para o escopo global
  window.Pages = { getPage: getPage, setAdminTab: function(t) { adminTab = t; } };
})();