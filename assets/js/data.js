/* ===== CONTEÚDO DO SITE =====
   Só existe 1 curso real de exemplo (Calculus I). Os outros assuntos aparecem como "em breve".
   Quando houver back-end, estes dados virão das tabelas subjects/courses/lessons/exercises. */
window.SHS = {
  subjects: [
    { id:'mathematics', tier:1, en:'Mathematics', ru:'Математика', pt:'Matemática', es:'Matemáticas',
      d:{ en:'Calculus, algebra and discrete math, step by step.', ru:'Матанализ, алгебра и дискретная математика по шагам.', pt:'Cálculo, álgebra e matemática discreta, passo a passo.', es:'Cálculo, álgebra y matemática discreta, paso a paso.' } },
    { id:'physics', tier:1, en:'Physics', ru:'Физика', pt:'Física', es:'Física',
      d:{ en:'Mechanics, electricity and waves with worked examples.', ru:'Механика, электричество и волны с разобранными примерами.', pt:'Mecânica, eletricidade e ondas com exemplos resolvidos.', es:'Mecánica, electricidad y ondas con ejemplos resueltos.' } },
    { id:'chemistry', tier:1, en:'Chemistry', ru:'Химия', pt:'Química', es:'Química',
      d:{ en:'General and inorganic chemistry, with the Russian terms beside each one.', ru:'Общая и неорганическая химия с русскими терминами рядом.', pt:'Química geral e inorgânica, com os termos russos ao lado de cada um.', es:'Química general e inorgánica, con los términos rusos junto a cada uno.' } },
    { id:'russian', tier:2, en:'Russian for foreigners', ru:'Русский для иностранцев', pt:'Russo para estrangeiros', es:'Ruso para extranjeros',
      d:{ en:'Academic vocabulary and grammar for lectures and exams.', ru:'Лексика и грамматика для лекций и экзаменов.', pt:'Vocabulário acadêmico e gramática para aulas e exames.', es:'Vocabulario académico y gramática para clases y exámenes.' } },
    { id:'english', tier:2, en:'English for Russians', ru:'Английский для русскоговорящих', pt:'Inglês para russos', es:'Inglés para rusos',
      d:{ en:'Technical English for reading papers and passing language exams.', ru:'Технический английский для чтения статей и сдачи экзаменов.', pt:'Inglês técnico para ler artigos e passar em exames de idioma.', es:'Inglés técnico para leer artículos y aprobar exámenes de idioma.' } },
    { id:'technical-drawing', tier:3, en:'Technical Drawing', ru:'Инженерная графика', pt:'Desenho Técnico', es:'Dibujo Técnico',
      d:{ en:'Projections, sections and standards, taught with video.', ru:'Проекции, разрезы и стандарты в видеоформате.', pt:'Projeções, cortes e normas, ensinados em vídeo.', es:'Proyecciones, cortes y normas, enseñados en vídeo.' } }
  ],
  courses: [
    { id:'calc1', subject:'mathematics', level:'beginner', lang:'en',
      title:{ en:'Calculus I: limits and derivatives', ru:'Математический анализ I: пределы и производные', pt:'Cálculo I: limites e derivadas', es:'Cálculo I: límites y derivadas' },
      desc:{ en:'The first topics of a university calculus course, explained in plain English with a Russian glossary.', ru:'Первые темы университетского курса матанализа простым английским с русским глоссарием.', pt:'Os primeiros tópicos de um curso universitário de cálculo, explicados em inglês simples com um glossário russo.', es:'Los primeros temas de un curso universitario de cálculo, explicados en inglés sencillo con un glosario ruso.' } }
  ],
  lessons: [
    { id:'l1', course:'calc1', pos:1, type:'material', tier:1,
      title:{ en:'Limits', ru:'Пределы', pt:'Limites', es:'Límites' },
      glossary:[ {en:'limit',ru:'предел',pt:'limite',es:'límite'}, {en:'function',ru:'функция',pt:'função',es:'función'}, {en:'approaches',ru:'стремится к',pt:'tende a',es:'tiende a'}, {en:'to cancel',ru:'сократить',pt:'cancelar',es:'cancelar'} ],
      html:`<h3>The idea</h3>
<p>A <b>limit</b> tells us which value a function gets close to when its input gets close to some number <code>a</code>. We write it like this:</p>
<span class="formula">lim (x → a) f(x) = L</span>
<p>The function does not need to be defined at <code>a</code> itself. We only care about what happens <i>near</i> it.</p>
<h3>Example 1: just look nearby</h3>
<p>Let <code>f(x) = 2x + 1</code> and let x get close to 3. For x = 2.9 we get 6.8, for x = 2.99 we get 6.98, for x = 3.01 we get 7.02. The values get close to 7, so the limit is 7.</p>
<h3>Example 2: the 0/0 problem</h3>
<p>Find the limit as x → 2 of <code>(x² − 4) / (x − 2)</code>. If we put x = 2 directly, we get 0/0, which is not an answer yet. So we simplify first:</p>
<span class="formula">x² − 4 = (x − 2)(x + 2)</span>
<p>Cancel the factor (x − 2), because x is only <i>near</i> 2, not equal to 2. What is left is <code>x + 2</code>, which gets close to 4. The limit is <b>4</b>.</p>
<p><b>Tip:</b> when you get 0/0, factor and cancel before anything else.</p>` },
    { id:'l2', course:'calc1', pos:2, type:'material', tier:1,
      title:{ en:'Derivatives', ru:'Производные', pt:'Derivadas', es:'Derivadas' },
      glossary:[ {en:'derivative',ru:'производная',pt:'derivada',es:'derivada'}, {en:'tangent line',ru:'касательная',pt:'reta tangente',es:'recta tangente'}, {en:'slope',ru:'угловой коэффициент',pt:'inclinação',es:'pendiente'}, {en:'rate of change',ru:'скорость изменения',pt:'taxa de variação',es:'tasa de cambio'}, {en:'power rule',ru:'правило степени',pt:'regra da potência',es:'regla de la potencia'} ],
      html:`<h3>What is a derivative?</h3>
<p>The <b>derivative</b> of a function tells us how fast it changes. On a graph, it is the <b>slope of the tangent line</b> at a point. The formal definition uses a limit:</p>
<span class="formula">f'(x) = lim (h → 0) [ f(x + h) − f(x) ] / h</span>
<h3>Rules you will use every day</h3>
<ul>
<li><b>Power rule:</b> the derivative of x<sup>n</sup> is n · x<sup>n−1</sup></li>
<li><b>Constant multiple:</b> the derivative of c · f(x) is c · f'(x)</li>
<li><b>Constant:</b> the derivative of a number, like 7, is 0</li>
<li><b>Sum:</b> the derivative of f + g is f' + g'</li>
</ul>
<h3>Examples</h3>
<p>If <code>f(x) = x²</code>, then <code>f'(x) = 2x</code>. At x = 3 the slope is 6.</p>
<p>If <code>f(x) = 4x³</code>, then <code>f'(x) = 4 · 3x² = 12x²</code>.</p>` },
    { id:'l3', course:'calc1', pos:3, type:'exercise_set', tier:2,
      title:{ en:'Practice: limits and derivatives', ru:'Практика: пределы и производные', pt:'Prática: limites e derivadas', es:'Práctica: límites y derivadas' },
      glossary:[ {en:'exercise',ru:'упражнение',pt:'exercício',es:'ejercicio'}, {en:'answer',ru:'ответ',pt:'resposta',es:'respuesta'}, {en:'correct',ru:'верно',pt:'correto',es:'correcto'} ] },
    { id:'l4', course:'calc1', pos:4, type:'video', tier:3,
      title:{ en:'Video: the tangent line', ru:'Видео: касательная', pt:'Vídeo: a reta tangente', es:'Vídeo: la recta tangente' },
      glossary:[ {en:'tangent line',ru:'касательная',pt:'reta tangente',es:'recta tangente'}, {en:'point',ru:'точка',pt:'ponto',es:'punto'} ] }
  ],
  exercises: [
    { id:'e1', lesson:'l3', type:'mc', answer:0,
      q:{ en:'What is the derivative of x³?', ru:'Чему равна производная x³?', pt:'Qual é a derivada de x³?', es:'¿Cuál es la derivada de x³?' },
      opts:['3x²','x²','3x','x³ / 3'],
      exp:{ en:'Power rule: bring the exponent 3 down and subtract 1 from it. So 3 · x² = 3x².', ru:'Правило степени: показатель 3 выносим вперёд и уменьшаем на 1. Получаем 3 · x² = 3x².', pt:'Regra da potência: desça o expoente 3 e subtraia 1 dele. Então 3 · x² = 3x².', es:'Regla de la potencia: baja el exponente 3 y réstale 1. Así 3 · x² = 3x².' } },
    { id:'e2', lesson:'l3', type:'num', answer:8,
      q:{ en:'Let f(x) = x². What is f\'(4)?', ru:'Пусть f(x) = x². Чему равно f\'(4)?', pt:'Seja f(x) = x². Qual é f\'(4)?', es:'Sea f(x) = x². ¿Cuánto vale f\'(4)?' },
      exp:{ en:'f\'(x) = 2x, so f\'(4) = 2 · 4 = 8.', ru:'f\'(x) = 2x, значит f\'(4) = 2 · 4 = 8.', pt:'f\'(x) = 2x, então f\'(4) = 2 · 4 = 8.', es:'f\'(x) = 2x, entonces f\'(4) = 2 · 4 = 8.' } },
    { id:'e3', lesson:'l3', type:'num', answer:10,
      q:{ en:'Let f(x) = 5x². What is f\'(1)?', ru:'Пусть f(x) = 5x². Чему равно f\'(1)?', pt:'Seja f(x) = 5x². Qual é f\'(1)?', es:'Sea f(x) = 5x². ¿Cuánto vale f\'(1)?' },
      exp:{ en:'f\'(x) = 5 · 2x = 10x, so f\'(1) = 10.', ru:'f\'(x) = 5 · 2x = 10x, значит f\'(1) = 10.', pt:'f\'(x) = 5 · 2x = 10x, então f\'(1) = 10.', es:'f\'(x) = 5 · 2x = 10x, entonces f\'(1) = 10.' } },
    { id:'e4', lesson:'l3', type:'num', answer:14,
      q:{ en:'Let f(x) = x³ + 2x. What is f\'(2)?', ru:'Пусть f(x) = x³ + 2x. Чему равно f\'(2)?', pt:'Seja f(x) = x³ + 2x. Qual é f\'(2)?', es:'Sea f(x) = x³ + 2x. ¿Cuánto vale f\'(2)?' },
      exp:{ en:'f\'(x) = 3x² + 2, so f\'(2) = 3 · 4 + 2 = 14.', ru:'f\'(x) = 3x² + 2, значит f\'(2) = 3 · 4 + 2 = 14.', pt:'f\'(x) = 3x² + 2, então f\'(2) = 3 · 4 + 2 = 14.', es:'f\'(x) = 3x² + 2, entonces f\'(2) = 3 · 4 + 2 = 14.' } },
    { id:'e5', lesson:'l3', type:'mc', answer:2,
      q:{ en:'What is the limit as x → 2 of (x² − 4) / (x − 2)?', ru:'Чему равен предел при x → 2 выражения (x² − 4) / (x − 2)?', pt:'Qual é o limite quando x → 2 de (x² − 4) / (x − 2)?', es:'¿Cuál es el límite cuando x → 2 de (x² − 4) / (x − 2)?' },
      opts:['0','2','4','It does not exist'],
      exp:{ en:'Factor: x² − 4 = (x − 2)(x + 2). Cancel (x − 2) and you get x + 2, which gets close to 4.', ru:'Разложим: x² − 4 = (x − 2)(x + 2). Сокращаем (x − 2), остаётся x + 2, оно стремится к 4.', pt:'Fatore: x² − 4 = (x − 2)(x + 2). Cancele (x − 2) e você obtém x + 2, que tende a 4.', es:'Factoriza: x² − 4 = (x − 2)(x + 2). Cancela (x − 2) y obtienes x + 2, que tiende a 4.' } }
  ]
};