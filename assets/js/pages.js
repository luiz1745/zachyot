/* ===== TELAS DO SITE ===== */
(function () {
  'use strict';

  var S = window.Store, UI = window.UI, C = window.SHS;   // C é sempre o mesmo objeto (as listas dentro dele é que mudam)
  var L = S.L, X = S.X, esc = S.esc, me = S.me, icon = UI.icon;

  /* ---------- HOME ---------- */
  function pHome() {
    var gl = [['Derivative', 'Производная'], ['Force', 'Сила'], ['Solution', 'Раствор'], ['Drawing scale', 'Масштаб чертежа']];
    return '<section class="hero"><div class="wrap hero-grid">' +
      '<div class="hero-copy"><h1>' + L('heroTitle') + '</h1><p class="lead">' + L('heroLead') + '</p>' +
      '<div class="cta"><a class="btn btn-yellow" href="#/courses">' + L('browse') + '</a><a class="btn btn-light" href="#/plans">' + L('plans') + '</a></div>' +
      '<p class="hero-note">' + L('forGorny') + '</p></div>' +
      '<div class="hero-card" aria-label="Glossary example"><span class="formula">f\'(x) = lim (h → 0) [ f(x + h) − f(x) ] / h</span>' +
      '<ul class="gloss">' + gl.map(function (g) { return '<li><span class="en">' + g[0] + '</span><span class="ru">' + g[1] + '</span></li>'; }).join('') + '</ul></div>' +
      '</div></section>' +

      '<section class="search"><div class="wrap"><form data-form="search" role="search">' +
      '<div class="field"><label for="q">' + L('searchLabel') + '</label><input id="q" name="q" type="search" placeholder="' + esc(L('searchPh')) + '"></div>' +
      '<div class="field"><label for="s">' + L('subject') + '</label><select id="s" name="subject"><option value="">' + L('allSubjects') + '</option>' +
        C.subjects.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc(X(s)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="l">' + L('explainedIn') + '</label><select id="l" name="lang"><option value="">' + L('any') + '</option><option value="en">English</option><option value="ru">Русский</option></select></div>' +
      '<div class="field"><label for="v">' + L('level') + '</label><select id="v" name="level"><option value="">' + L('anyLevel') + '</option><option value="beginner">' + L('beginner') + '</option><option value="intermediate">' + L('intermediate') + '</option><option value="advanced">' + L('advanced') + '</option></select></div>' +
      '<button class="btn btn-yellow" type="submit">' + L('searchBtn') + '</button></form></div></section>' +

      '<section class="block"><div class="wrap"><h2 class="section-title">' + L('subjectsTitle') + '</h2><p class="muted">' + L('subjectsSub') + '</p><div class="grid">' + UI.subjectCards() + '</div></div></section>' +

      '<section class="block alt"><div class="wrap"><h2 class="section-title">' + L('howTitle') + '</h2><div class="steps">' +
      '<div class="step"><div><b>' + L('step1') + '</b><br><span class="muted">' + L('step1d') + '</span></div></div>' +
      '<div class="step"><div><b>' + L('step2') + '</b><br><span class="muted">' + L('step2d') + '</span></div></div>' +
      '<div class="step"><div><b>' + L('step3') + '</b><br><span class="muted">' + L('step3d') + '</span></div></div></div></div></section>' +

      '<section class="block"><div class="wrap"><h2 class="section-title">' + L('qTitle') + '</h2>' +
      '<details><summary>' + L('q1') + '</summary><p>' + L('a1') + '</p></details>' +
      '<details><summary>' + L('q2') + '</summary><p>' + L('a2') + '</p></details>' +
      '<details><summary>' + L('q3') + '</summary><p>' + L('a3') + '</p></details></div></section>';
  }

  /* ---------- PLANOS ---------- */
  function pPlans() {
    return '<div class="page"><div class="wrap"><h1>' + L('plansTitle') + '</h1><p class="muted">' + L('plansSub') + '</p>' + UI.planCards() + '</div></div>';
  }

  /* ---------- CURSOS (com filtros que funcionam) ---------- */
  function accessBadge(c) {
    if (c.all_free) return '<span class="badge ok">' + L('free') + '</span>';
    if (c.free_lessons > 0) return '<span class="badge ok">' + L('firstFree').replace('{n}', c.free_lessons) + '</span>';
    return '';
  }

  function pCourses(q) {
    var list = C.courses.slice();
    var sel = q.subject ? C.subjects.filter(function (s) { return s.id === q.subject; })[0] : null;
    if (q.subject) list = list.filter(function (c) { return c.subject === q.subject; });
    if (q.lang) list = list.filter(function (c) { return c.lang === q.lang; });
    if (q.level) list = list.filter(function (c) { return c.level === q.level; });
    if (q.q) {
      var t = q.q.toLowerCase();
      list = list.filter(function (c) { return (X(c.title) + ' ' + X(c.desc)).toLowerCase().indexOf(t) > -1; });
    }
    return '<div class="page"><div class="wrap"><h1>' + L('courses') + (sel ? ': ' + esc(X(sel)) : '') + '</h1>' +
      (list.length ? '<div class="grid">' + list.map(function (c) {
        var n = S.lessonsOf(c.id).length, s = S.subjectById(c.subject);
        return '<article class="card" style="--c:' + UI.safeColor(s && s.color) + '"><div class="head">' + UI.subjTile(s) + '<h3>' + esc(X(c.title)) + '</h3></div><div class="body">' +
          '<div class="badges"><span class="badge">' + esc(S.subjName(c.subject)) + '</span>' + accessBadge(c) + (c.published === false ? '<span class="badge soon">' + L('admDraft') + '</span>' : '') + '</div>' +
          '<p>' + esc(X(c.desc)) + '</p><span class="muted">' + n + ' ' + L('lessons') + '</span>' +
          '<a class="btn btn-yellow btn-sm" href="#/course/' + encodeURIComponent(c.id) + '">' + L('openCourse') + '</a></div></article>';
      }).join('') + '</div>' : UI.emptyState('inbox', L('noCourses'))) +
      '<p><a href="#/">' + L('backSubjects') + '</a></p></div></div>';
  }

  function pCourse(id) {
    var c = S.courseOf(id), u = me();
    if (!c) return pCourses({});
    var ls = S.lessonsOf(id), t = S.tierOf(u), s = S.subjectById(c.subject);

    var locked = ls.filter(function (l) { return S.lessonTier(l) > t; });
    var strip = '';
    if (c.all_free) strip = '<div class="msg ok">' + L('freeCourse') + '</div>';
    else if (locked.length) {
      var need = S.planByTier(Math.min.apply(null, locked.map(S.lessonTier)));
      strip = '<div class="plan-required"><span>' + icon('lock', 16) + ' ' + L('needPlan') + '<b>' + esc(need.name) + '</b>' + L('orHigher') + '</span>' +
        '<a class="btn btn-yellow btn-sm" href="#/plans">' + L('seePlans') + '</a></div>';
    }

    return '<div class="page"><div class="wrap"><nav class="crumbs"><a href="#/courses">' + L('courses') + '</a></nav>' +
      '<h1 class="h-icon">' + UI.subjTile(s) + '<span>' + esc(X(c.title)) + '</span></h1><p class="muted">' + esc(X(c.desc)) + '</p>' +
      (!c.all_free && c.free_lessons > 0 ? '<p class="muted">' + L('firstFree').replace('{n}', c.free_lessons) + '</p>' : '') +
      strip + (u ? '' : '<div class="msg info">' + L('createFree') + '</div>') +
      (ls.length ? '<div class="panel"><ul class="lesson-list">' + ls.map(function (l) {
        var lt = S.lessonTier(l);
        var right = lt > t ? UI.lockBadge(lt) : (lt === 0 && !c.all_free ? '<span class="badge ok">' + L('free') + '</span>' : '');
        return '<li><span class="li-ic">' + UI.typeIcon(l.type) + '</span><span class="t"><a href="#/lesson/' + encodeURIComponent(l.id) + '">' + l.pos + '. ' + esc(X(l.title)) + '</a></span>' + right + '</li>';
      }).join('') + '</ul></div>' : UI.emptyState('inbox', L('noLessons'))) +
      '</div></div>';
  }

  /* ---------- AULA ---------- */
  function pLesson(id) {
    var l = C.lessons.filter(function (x) { return x.id === id; })[0], u = me();
    if (!l) return pCourses({});
    var c = S.courseOf(l.course), lt = S.lessonTier(l);
    var crumbs = '<nav class="crumbs"><a href="#/courses">' + L('courses') + '</a> › <a href="#/course/' + encodeURIComponent(c.id) + '">' + esc(X(c.title)) + '</a></nav>';
    var head = '<div class="page"><div class="wrap">' + crumbs + '<h1>' + esc(X(l.title)) + '</h1>';

    if (!u) return head + '<div class="msg info">' + L('loginToOpen') + '</div><p><a class="btn btn-yellow" href="#/login">' + L('login') + '</a> <a class="btn btn-outline" href="#/signup">' + L('signup') + '</a></p></div></div>';
    if (S.tierOf(u) < lt) return head + '<div class="msg info">' + icon('lock', 16) + ' ' + L('needPlan') + '<b>' + esc(S.planByTier(lt).name) + '</b>' + L('orHigher') + '</div><p><a class="btn btn-yellow" href="#/plans">' + L('seePlans') + '</a></p></div></div>';

    var body;
    if (l.type === 'material') body = '<div class="panel prose">' + l.html + '</div>';
    else if (l.type === 'video') body = UI.emptyState('play', L('videoNot'));
    else {
      var exs = C.exercises.filter(function (e) { return e.lesson === id; });
      body = exs.length ? '<form data-form="grade" data-lesson="' + esc(id) + '">' + exs.map(function (e, i) {
        return '<div class="q" id="q-' + esc(e.id) + '"><b>' + (i + 1) + '. ' + esc(X(e.q)) + '</b>' + (e.type === 'mc'
          ? (e.opts || []).map(function (o, k) { return '<label class="opt"><input type="radio" name="' + esc(e.id) + '" value="' + k + '"> ' + esc(o) + '</label>'; }).join('')
          : '<div class="num-answer"><input name="' + esc(e.id) + '" inputmode="decimal" aria-label="answer"></div>') + '<div class="fb"></div></div>';
      }).join('') + '<button class="btn btn-yellow" type="submit">' + L('checkAnswers') + '</button></form>'
        : UI.emptyState('pencil', L('noExercises'));
    }

    // anterior / próxima
    var ls = S.lessonsOf(l.course), i = ls.indexOf(l);
    var prev = ls[i - 1], next = ls[i + 1];
    var nav = '<div class="lesson-nav">' +
      (prev ? '<a class="btn btn-outline btn-sm" href="#/lesson/' + encodeURIComponent(prev.id) + '">← ' + L('prev') + '</a>' : '<span></span>') +
      (next ? '<a class="btn btn-blue btn-sm" href="#/lesson/' + encodeURIComponent(next.id) + '">' + L('next') + ' →</a>' : '') + '</div>';

    var gloss = l.glossary || [];
    var gl = gloss.length ? '<aside class="panel"><h2>' + L('glossary') + '</h2><table class="mini">' + gloss.map(function (g) {
      return '<tr><td>' + esc(g.en) + '</td><td><b>' + esc(g[S.getLang()] || g.ru || '') + '</b></td></tr>';
    }).join('') + '</table></aside>' : '';

    return head + (gl ? '<div class="two"><div>' + body + nav + '</div>' + gl + '</div>' : body + nav) + '</div></div>';
  }

  /* ---------- LOGIN / CADASTRO ---------- */
  function pAuth(kind, q) {
    var su = kind === 'signup';
    return '<div class="page"><div class="wrap"><form class="auth" data-form="' + kind + '" data-plan="' + esc(q.plan || '') + '"><h1>' + (su ? L('createAcc') : L('login')) + '</h1><div id="err"></div>' +
      (su ? '<div class="field"><label for="nm">' + L('fullName') + '</label><input id="nm" name="name" required></div>' : '') +
      '<div class="field"><label for="em">' + L('email') + '</label><input id="em" name="email" type="email" required autocomplete="email"></div>' +
      '<div class="field"><label for="pw">' + L('password') + '</label><input id="pw" name="password" type="password" minlength="8" required autocomplete="' + (su ? 'new-password' : 'current-password') + '"></div>' +
      (su ? '<div class="field"><label for="co">' + L('country') + '</label><input id="co" name="country"></div>' : '') +
      '<button class="btn btn-yellow" type="submit" id="auth-submit">' + (su ? L('signup') : L('login')) + '</button>' +
      '<p class="muted">' + (su ? L('alreadyAcc') + '<a href="#/login">' + L('login') + '</a>' : L('newHere') + '<a href="#/signup">' + L('signup') + '</a>') + '</p>' +
      (su ? '<p class="muted small">' + L('previewNote') + '</p>' : '') + '</form></div></div>';
  }

  /* ---------- MINHA ÁREA ---------- */
  function pDash() {
    var u = me(); if (!u) return pAuth('login', {});
    return '<div class="page"><div class="wrap"><h1>' + L('hi') + esc(u.name ? u.name.split(' ')[0] : '') + '!</h1>' +
      '<div class="metrics"><div class="metric"><div class="l">' + L('plan') + '</div><div class="v">' + esc(S.planOf(u).name) + '</div></div>' +
      '<div class="metric"><div class="l">' + L('streakLbl') + '</div><div class="v">—</div></div>' +
      '<div class="metric"><div class="l">' + L('xpLbl') + '</div><div class="v">' + (u.xp || 0) + '</div></div></div><br>' +
      '<div class="two"><div><div class="panel"><h2>' + L('continueStudy') + '</h2><p class="muted">' + L('nothingContinue') + '</p>' +
      '<a class="btn btn-yellow btn-sm" href="#/courses">' + L('browse') + '</a></div></div>' +
      '<div><div class="panel"><h2>' + L('badges') + '</h2><p class="muted">—</p></div></div></div></div></div>';
  }

  /* ======================= ADMIN ======================= */
  var adminTab = 'students';
  var adminEdit = null;           // { t:'subject'|'course'|'lesson', id:'...' }

  function setAdminTab(t) { adminTab = t; adminEdit = null; }
  function setAdminEdit(t, id) { adminEdit = t ? { t: t, id: id } : null; }

  /* --- peças de formulário --- */
  function i18nFields(labelKey, name, obj, area, req) {
    obj = obj || {};
    function one(code, r) {
      var id = name + '_' + code, v = esc(obj[code] || '');
      var ctl = area ? '<textarea id="' + id + '" name="' + id + '" rows="2"' + (r ? ' required' : '') + '>' + v + '</textarea>'
                     : '<input id="' + id + '" name="' + id + '" value="' + v + '"' + (r ? ' required' : '') + '>';
      return '<div class="field"><label for="' + id + '">' + L(labelKey) + ' (' + code.toUpperCase() + ')</label>' + ctl + '</div>';
    }
    return one('en', req) + '<details class="more"><summary>' + L('admTranslations') + '</summary><div class="cols">' + one('ru') + one('pt') + one('es') + '</div></details>';
  }
  function selectF(name, labelKey, opts, val) {
    return '<div class="field"><label for="f-' + name + '">' + L(labelKey) + '</label><select id="f-' + name + '" name="' + name + '">' +
      opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(val) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></div>';
  }
  function checkF(name, labelKey, on) {
    return '<label class="chk"><input type="checkbox" name="' + name + '"' + (on ? ' checked' : '') + '> ' + L(labelKey) + '</label>';
  }
  function formWrap(kind, ed, inner) {
    return '<form class="panel admin-form" data-form="' + kind + '"><h2>' + (ed ? L('admEdit') : L('admNew')) + '</h2>' +
      (ed ? '<input type="hidden" name="id" value="' + esc(ed.id) + '">' : '') + inner +
      '<div class="row-actions"><button class="btn btn-yellow" type="submit">' + L('admSave') + '</button>' +
      (ed ? '<button class="btn btn-outline" type="button" data-act="adm-cancel">' + L('admCancel') + '</button>' : '') + '</div></form>';
  }
  function rowActions(t, id) {
    return '<div class="row-actions"><button class="btn btn-outline btn-sm" data-act="adm-edit" data-t="' + t + '" data-id="' + esc(id) + '">' + L('admEdit') + '</button>' +
      '<button class="btn btn-danger btn-sm" data-act="adm-del" data-t="' + t + '" data-id="' + esc(id) + '">' + L('admDelete') + '</button></div>';
  }
  function editing(t, list) {
    if (!adminEdit || adminEdit.t !== t) return null;
    return list.filter(function (x) { return x.id === adminEdit.id; })[0] || null;
  }
  function glossToText(g) {
    return (g || []).map(function (x) { return [x.en, x.ru, x.pt, x.es].map(function (v) { return v || ''; }).join(' | '); }).join('\n');
  }
  function textToGloss(t) {
    return String(t || '').split('\n').map(function (line) {
      var p = line.split('|').map(function (s) { return s.trim(); });
      if (!p[0]) return null;
      var o = { en: p[0] }; if (p[1]) o.ru = p[1]; if (p[2]) o.pt = p[2]; if (p[3]) o.es = p[3];
      return o;
    }).filter(Boolean);
  }
  function planName(t) { return t === 0 ? L('free') : S.planByTier(t).name; }

  /* --- abas --- */
  function tabSubjects() {
    var ed = editing('subject', C.subjects), s = ed || { color: '#27509B', icon: 'book' };
    var form = formWrap('adm-subject', ed,
      i18nFields('fName', 'name', ed, false, true) + i18nFields('fDesc', 'descr', ed ? ed.d : {}, true, false) +
      '<div class="cols">' + selectF('icon', 'fIcon', UI.ICON_NAMES.map(function (n) { return [n, n]; }), s.icon) +
      '<div class="field"><label for="f-color">' + L('fColor') + '</label><input id="f-color" name="color" type="color" value="' + esc(UI.safeColor(s.color)) + '"></div></div>' +
      checkF('free_courses', 'fFreeCourses', ed && ed.free_courses));
    var rows = C.subjects.map(function (x) {
      var n = C.courses.filter(function (c) { return c.subject === x.id; }).length;
      return '<tr><td>' + UI.subjTile(x) + ' ' + esc(X(x)) + '</td><td>' + n + '</td><td>' + rowActions('subject', x.id) + '</td></tr>';
    }).join('');
    return form + '<div class="panel"><div class="scroll"><table><thead><tr><th>' + L('fName') + '</th><th>' + L('courses') + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  }

  function tabCourses() {
    var ed = editing('course', C.courses), c = ed || { level: 'beginner', lang: 'en', published: true, free_lessons: 0 };
    var form = formWrap('adm-course', ed,
      selectF('subject', 'fSubject', C.subjects.map(function (s) { return [s.id, X(s)]; }), c.subject) +
      i18nFields('fName', 'title', ed ? ed.title : {}, false, true) + i18nFields('fDesc', 'descr', ed ? ed.desc : {}, true, false) +
      '<div class="cols">' + selectF('level', 'level', [['beginner', L('beginner')], ['intermediate', L('intermediate')], ['advanced', L('advanced')]], c.level) +
      selectF('lang', 'explainedIn', [['en', 'English'], ['ru', 'Русский']], c.lang) +
      '<div class="field"><label for="f-fl">' + L('fFreeN') + '</label><input id="f-fl" name="free_lessons" type="number" min="0" value="' + (c.free_lessons || 0) + '"></div></div>' +
      checkF('all_free', 'fFreeAll', ed ? ed.all_free : !!(C.subjects[0] && C.subjects[0].free_courses)) + checkF('published', 'fPublished', c.published !== false));
    var rows = C.courses.map(function (x) {
      var acc = x.all_free ? L('free') : (x.free_lessons ? L('firstFree').replace('{n}', x.free_lessons) : '—');
      return '<tr><td>' + esc(X(x.title)) + '</td><td>' + esc(S.subjName(x.subject)) + '</td><td>' + esc(acc) + '</td><td>' +
        (x.published === false ? '<span class="badge soon">' + L('admDraft') + '</span>' : '<span class="badge ok">' + L('publish') + '</span>') + '</td><td>' + rowActions('course', x.id) + '</td></tr>';
    }).join('');
    return form + '<div class="panel"><div class="scroll"><table><thead><tr><th>' + L('fName') + '</th><th>' + L('subject') + '</th><th>' + L('access') + '</th><th></th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  }

  function tabLessons() {
    var ed = editing('lesson', C.lessons);
    var l = ed || { type: 'material', pos: 1, published: true };
    var courseOpts = C.courses.map(function (c) { return [c.id, X(c.title)]; });
    var tierOpts = [['auto', L('fAuto')]].concat(S.getPlans().filter(function (p) { return p.tier > 0; }).map(function (p) { return [p.tier, p.name]; }));
    var form = formWrap('adm-lesson', ed,
      selectF('course', 'fCourse', courseOpts, l.course) +
      '<div class="cols"><div class="field"><label for="f-pos">' + L('fPos') + '</label><input id="f-pos" name="pos" type="number" min="1" value="' + (l.pos || 1) + '" required></div>' +
      selectF('type', 'type', [['material', L('tMaterial')], ['exercise_set', L('tExercise')], ['video', L('tVideo')]], l.type) +
      selectF('tier', 'fMinPlan', tierOpts, ed ? l.tier : 'auto') + '</div>' +
      i18nFields('fName', 'title', ed ? ed.title : {}, false, true) +
      '<div class="field"><label for="f-gl">' + L('fGlossary') + '</label><textarea id="f-gl" name="glossary" rows="4">' + esc(glossToText(l.glossary)) + '</textarea></div>' +
      '<div class="field"><label for="f-html">' + L('fContent') + '</label><textarea id="f-html" name="html" rows="12" class="mono">' + esc(l.html || '') + '</textarea></div>' +
      checkF('published', 'fPublished', l.published !== false));
    var rows = C.lessons.slice().sort(function (a, b) { return a.course === b.course ? a.pos - b.pos : (a.course < b.course ? -1 : 1); }).map(function (x) {
      var c = S.courseOf(x.course);
      return '<tr><td>' + esc(c ? X(c.title) : x.course) + '</td><td>' + x.pos + '</td><td>' + esc(X(x.title)) + '</td><td>' + UI.typeIcon(x.type) + '</td><td>' + esc(planName(S.lessonTier(x))) + '</td><td>' +
        (x.published === false ? '<span class="badge soon">' + L('admDraft') + '</span>' : '') + '</td><td>' + rowActions('lesson', x.id) + '</td></tr>';
    }).join('');
    return form + '<div class="panel"><div class="scroll"><table><thead><tr><th>' + L('fCourse') + '</th><th>#</th><th>' + L('fName') + '</th><th>' + L('type') + '</th><th>' + L('minPlan') + '</th><th></th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  }

  function tabStudents() {
    return '<div class="panel"><h2>' + L('usersH') + '</h2><div id="admin-users-list"><div class="empty">' + L('loading') + '</div></div></div>';
  }

  function pAdmin() {
    var u = me();
    if (!u || !u.is_admin) return '<div class="page"><div class="wrap"><div class="msg err">' + L('admOnly') + '</div></div></div>';

    var tabs = [['students', 'admStudents'], ['subjects', 'admSubjects'], ['courses', 'admCourses'], ['lessons', 'admLessons']];
    var nav = '<div class="admin-nav">' + tabs.map(function (t) {
      return '<button class="btn btn-sm ' + (adminTab === t[0] ? 'btn-blue' : 'btn-outline') + '" data-act="tab" data-v="' + t[0] + '">' + L(t[1]) + '</button>';
    }).join('') + '</div>';

    var content;
    if (adminTab !== 'students' && S.catalogSource() === 'seed') {
      // Evita que o conteúdo do data.js "suma" quando o primeiro item novo é salvo no banco
      content = '<div class="msg info">' + L('admSeedMsg') + '</div><p><button class="btn btn-yellow" data-act="adm-seed">' + L('admSeed') + '</button></p>';
    } else if (adminTab === 'subjects') content = tabSubjects();
    else if (adminTab === 'courses') content = tabCourses();
    else if (adminTab === 'lessons') content = tabLessons();
    else content = tabStudents();

    return '<div class="page"><div class="wrap"><h1>' + L('admin') + '</h1>' + nav + content + '</div></div>';
  }

  function loadAdminUsers() {
    var box = document.getElementById('admin-users-list');
    if (!box) return;
    window.supabaseClient.from('profiles').select('*').order('created_at', { ascending: false }).then(function (res) {
      if (res.error) { box.innerHTML = '<div class="msg err">' + esc(res.error.message) + '</div>'; return; }
      if (!res.data || !res.data.length) { box.innerHTML = '<div class="empty">' + L('noStudents') + '</div>'; return; }
      var rows = res.data.map(function (p) {
        var tipo = p.is_admin ? '<span class="badge gold">Admin</span>' : '<span class="badge">' + L('student') + '</span>';
        var sel = '<select data-plan-user="' + esc(p.id) + '" aria-label="' + esc(L('plan')) + '">' + S.getPlans().map(function (pl) {
          return '<option value="' + pl.code + '"' + ((p.plan || 'free') === pl.code ? ' selected' : '') + '>' + pl.name + '</option>';
        }).join('') + '</select>';
        return '<tr><td>' + esc(p.name || '—') + '</td><td>' + esc(p.email || '') + '</td><td>' + tipo + '</td><td>' + (p.xp || 0) + '</td><td>' + sel + '</td></tr>';
      }).join('');
      box.innerHTML = '<div class="scroll"><table><thead><tr><th>' + L('name') + '</th><th>' + L('email') + '</th><th>' + L('type') + '</th><th>' + L('xpLbl') + '</th><th>' + L('plan') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    }).catch(function (err) { box.innerHTML = '<div class="msg err">' + esc(err.message || String(err)) + '</div>'; });
  }

  /* --- gravar / apagar --- */
  function ml(d, p) {
    var o = {};
    ['en', 'ru', 'pt', 'es'].forEach(function (c) { var v = String(d[p + '_' + c] || '').trim(); if (v) o[c] = v; });
    return o;
  }
  function exists(list, id) { return list.some(function (x) { return x.id === id; }); }
  var TABLES = { subject: 'cat_subjects', course: 'cat_courses', lesson: 'cat_lessons' };

  function adminSubmit(kind, d) {
    var isNew = !d.id, row, table;
    try {
      if (kind === 'adm-subject') {
        var name = ml(d, 'name'), id = d.id || S.slug(name.en);
        if (!id) throw new Error('ID');
        if (isNew && exists(C.subjects, id)) throw new Error(L('admExists'));
        var old = C.subjects.filter(function (x) { return x.id === id; })[0];
        row = { id: id, name: name, descr: ml(d, 'descr'), icon: d.icon || 'book', color: UI.safeColor(d.color), free_courses: d.free_courses === 'on', pos: old ? old.pos : C.subjects.length };
        table = 'cat_subjects';
      } else if (kind === 'adm-course') {
        var title = ml(d, 'title'), cid = d.id || S.slug(title.en);
        if (!cid) throw new Error('ID');
        if (isNew && exists(C.courses, cid)) throw new Error(L('admExists'));
        row = { id: cid, subject: d.subject, level: d.level, lang: d.lang, title: title, descr: ml(d, 'descr'),
                all_free: d.all_free === 'on', free_lessons: Math.max(0, parseInt(d.free_lessons, 10) || 0), published: d.published === 'on' };
        table = 'cat_courses';
      } else if (kind === 'adm-lesson') {
        var pos = Math.max(1, parseInt(d.pos, 10) || 1), lid = d.id || (d.course + '-' + pos);
        if (isNew && exists(C.lessons, lid)) throw new Error(L('admExists'));
        row = { id: lid, course: d.course, pos: pos, type: d.type,
                tier: d.tier === 'auto' ? S.defaultTier(d.type) : parseInt(d.tier, 10),
                title: ml(d, 'title'), glossary: textToGloss(d.glossary), html: d.html || '', published: d.published === 'on' };
        table = 'cat_lessons';
      }
    } catch (e) { return Promise.reject(e); }
    return S.saveRow(table, row).then(function () { adminEdit = null; return S.loadCatalog(); });
  }

  function adminDelete(t, id) {
    return S.deleteRow(TABLES[t], id).then(function () { adminEdit = null; return S.loadCatalog(); });
  }
  function adminSeed() { return S.seedCatalog(); }
  function setUserPlan(id, plan) { return S.setUserPlan(id, plan); }

  /* ---------- ROTEADOR ---------- */
  function afterRender(seg) {
    if (seg[0] === 'admin' && adminTab === 'students') loadAdminUsers();
  }

  function getPage(seg, q) {
    var html;
    var id = seg[1] ? decodeURIComponent(seg[1]) : seg[1];
    switch (seg[0]) {
      case undefined: html = pHome(); break;
      case 'plans': html = pPlans(); break;
      case 'courses': html = pCourses(q); break;
      case 'course': html = pCourse(id); break;
      case 'lesson': html = pLesson(id); break;
      case 'login': html = pAuth('login', q); break;
      case 'signup': html = pAuth('signup', q); break;
      case 'dashboard': html = pDash(); break;
      case 'admin': html = pAdmin(); break;
      default: html = pHome();
    }
    return { html: html, name: seg[0] };
  }

  window.Pages = {
    getPage: getPage, afterRender: afterRender,
    setAdminTab: setAdminTab, adminEdit: setAdminEdit,
    adminSubmit: adminSubmit, adminDelete: adminDelete, adminSeed: adminSeed, setUserPlan: setUserPlan
  };
})();
