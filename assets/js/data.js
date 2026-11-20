/* ===== CONTEÚDO INICIAL DO SITE =====
   Regras de acesso: all_free:true = curso 100% grátis | free_lessons:N = primeiras N aulas grátis.
   As demais aulas exigem o plano pelo tipo: material=Basic, exercícios=Intermediate, vídeo=Complete.
   Depois de importar para o Supabase (Admin > botão Importar), o que vale é o banco.
   Só existe 1 curso real de exemplo (Calculus I). Os outros assuntos aparecem como "em breve".
   Quando houver back-end, estes dados virão das tabelas subjects/courses/lessons/exercises. */
window.SHS = {
  subjects: [
    { id:'mathematics', icon:'sigma', color:'#27509B', free_courses:false, en:'Mathematics', ru:'Математика', pt:'Matemática', es:'Matemáticas',
      d:{ en:'Calculus, algebra and discrete math, step by step.', ru:'Матанализ, алгебра и дискретная математика по шагам.', pt:'Cálculo, álgebra e matemática discreta, passo a passo.', es:'Cálculo, álgebra y matemática discreta, paso a paso.' } },
    { id:'physics', icon:'atom', color:'#6B4BB8', free_courses:false, en:'Physics', ru:'Физика', pt:'Física', es:'Física',
      d:{ en:'Mechanics, electricity and waves with worked examples.', ru:'Механика, электричество и волны с разобранными примерами.', pt:'Mecânica, eletricidade e ondas com exemplos resolvidos.', es:'Mecánica, electricidad y ondas con ejemplos resueltos.' } },
    { id:'chemistry', icon:'flask', color:'#1B7F4B', free_courses:false, en:'Chemistry', ru:'Химия', pt:'Química', es:'Química',
      d:{ en:'General and inorganic chemistry, with the Russian terms beside each one.', ru:'Общая и неорганическая химия с русскими терминами рядом.', pt:'Química geral e inorgânica, com os termos russos ao lado de cada um.', es:'Química general e inorgánica, con los términos rusos junto a cada uno.' } },
    { id:'russian', icon:'globe', color:'#B3261E', free_courses:true, en:'Russian for foreigners', ru:'Русский для иностранцев', pt:'Russo para estrangeiros', es:'Ruso para extranjeros',
      d:{ en:'Academic vocabulary and grammar for lectures and exams.', ru:'Лексика и грамматика для лекций и экзаменов.', pt:'Vocabulário acadêmico e gramática para aulas e exames.', es:'Vocabulario académico y gramática para clases y exámenes.' } },
    { id:'english', icon:'chat', color:'#D9731A', free_courses:true, en:'English for Russians', ru:'Английский для русскоговорящих', pt:'Inglês para russos', es:'Inglés para rusos',
      d:{ en:'Technical English for reading papers and passing language exams.', ru:'Технический английский для чтения статей и сдачи экзаменов.', pt:'Inglês técnico para ler artigos e passar em exames de idioma.', es:'Inglés técnico para leer artículos y aprobar exámenes de idioma.' } },
    { id:'technical-drawing', icon:'ruler', color:'#4B6A7C', free_courses:false, en:'Technical Drawing', ru:'Инженерная графика', pt:'Desenho Técnico', es:'Dibujo Técnico',
      d:{ en:'Projections, sections and standards, taught with video.', ru:'Проекции, разрезы и стандарты в видеоформате.', pt:'Projeções, cortes e normas, ensinados em vídeo.', es:'Proyecciones, cortes y normas, enseñados en vídeo.' } }
  ],
  courses: [
    // CURSO DE MATEMÁTICA AVANÇADA
    { id:'math-adv', subject:'mathematics', level:'advanced', lang:'en', free_lessons:3,
      title:{ en:'Advanced Mathematics', ru:'Продвинутая математика', pt:'Matemática Avançada', es:'Matemáticas Avanzadas' },
      desc:{ en:'Calculus, analytical geometry, linear algebra and systems. The complete university math track.', ru:'Матанализ, аналитическая геометрия, линейная алгебра и системы. Полный университетский курс математики.', pt:'Cálculo, geometria analítica, álgebra linear e sistemas. A trilha completa de matemática universitária.', es:'Cálculo, geometría analítica, álgebra lineal y sistemas. La pista completa de matemáticas universitarias.' } },
    
    // CURSO DE MATEMÁTICA PARA ESTRANGEIROS
    { id:'math-foreigners', subject:'mathematics', level:'beginner', lang:'en', all_free:true,
      title:{ en:'Mathematics for Foreigners', ru:'Математика для иностранцев', pt:'Matemática para Estrangeiros', es:'Matemáticas para Extranjeros' },
      desc:{ en:'Basic math concepts with Russian vocabulary: numbers, operations and geometry foundations.', ru:'Базовые математические понятия с русской лексикой: числа, операции и основы геометрии.', pt:'Conceitos básicos de matemática com vocabulário russo: números, operações e fundamentos de geometria.', es:'Conceptos básicos de matemáticas con vocabulario ruso: números, operaciones y fundamentos de geometría.' } }
  ],
  lessons: [
    // LIÇÕES DE MATEMÁTICA AVANÇADA (baseadas no plano fornecido)
    { id:'ma1', course:'math-adv', pos:1, type:'material', tier:1,
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
    { id:'ma2', course:'math-adv', pos:2, type:'material', tier:1,
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
    { id:'ma3', course:'math-adv', pos:3, type:'material', tier:1,
      title:{ en:'Analytical Geometry', ru:'Аналитическая геометрия', pt:'Geometria Analítica', es:'Geometría Analítica' },
      glossary:[ {en:'line',ru:'прямая',pt:'reta',es:'recta'}, {en:'vector',ru:'вектор',pt:'vetor',es:'vector'}, {en:'circle',ru:'окружность',pt:'circunferência',es:'circunferencia'}, {en:'ellipse',ru:'эллипс',pt:'elipse',es:'elipse'} ],
      html:`<h3>The line in the plane</h3>
<p>The general equation of a line is <code>Ax + By + C = 0</code>. The slope-intercept form is <code>y = kx + b</code>.</p>
<p>To find the equation of a line passing through two points, use the formula:</p>
<span class="formula">(x − x₁) / (x₂ − x₁) = (y − y₁) / (y₂ − y₁)</span>
<h3>Conics (second-degree curves)</h3>
<ul>
<li><b>Circle:</b> <code>(x − a)² + (y − b)² = R²</code></li>
<li><b>Ellipse:</b> <code>x²/a² + y²/b² = 1</code></li>
<li><b>Hyperbola:</b> <code>x²/a² − y²/b² = 1</code></li>
<li><b>Parabola:</b> <code>y² = 2px</code></li>
</ul>
<p><b>Tip:</b> The oral exam (colloquium) requires deducing these equations. Practice writing them by hand.</p>` },
    { id:'ma4', course:'math-adv', pos:4, type:'material', tier:1,
      title:{ en:'Matrices and Determinants', ru:'Матрицы и определители', pt:'Matrizes e Determinantes', es:'Matrices y Determinantes' },
      glossary:[ {en:'matrix',ru:'матрица',pt:'matriz',es:'matriz'}, {en:'determinant',ru:'определитель',pt:'determinante',es:'determinante'}, {en:'inverse matrix',ru:'обратная матрица',pt:'matriz inversa',es:'matriz inversa'} ],
      html:`<h3>Matrix operations</h3>
<p>You can add, subtract and multiply matrices. Multiplication is not commutative: <code>AB ≠ BA</code>.</p>
<h3>Determinants</h3>
<p>For a 2×2 matrix, <code>det = ad − bc</code>. For 3×3, use <b>Sarrus' rule</b>. For 4×4, use the <b>Laplace expansion</b>.</p>
<h3>Inverse matrix</h3>
<span class="formula">A⁻¹ = (1 / det A) · A*</span>
<p>where <code>A*</code> is the adjugate matrix (transpose of the cofactor matrix).</p>` },
    { id:'ma5', course:'math-adv', pos:5, type:'material', tier:1,
      title:{ en:'Linear Systems (SLAE)', ru:'Системы линейных уравнений', pt:'Sistemas Lineares (SLAE)', es:'Sistemas Lineales (SLAE)' },
      glossary:[ {en:'system',ru:'система',pt:'sistema',es:'sistema'}, {en:'Cramer\'s rule',ru:'правило Крамера',pt:'regra de Cramer',es:'regla de Cramer'}, {en:'Gauss method',ru:'метод Гаусса',pt:'método de Gauss',es:'método de Gauss'}, {en:'rank',ru:'ранг',pt:'posto',es:'rango'} ],
      html:`<h3>Cramer's rule</h3>
<p>For a system with the same number of equations and unknowns, compute <code>Δ</code>, <code>Δx</code>, <code>Δy</code>, <code>Δz</code>. The solution is <code>x = Δx / Δ</code>, etc.</p>
<h3>Gauss method</h3>
<p>Use row operations to reduce the augmented matrix to row echelon form, then back-substitute.</p>
<h3>Kronecker-Capelli theorem</h3>
<p>A system has a solution if and only if the rank of the coefficient matrix equals the rank of the augmented matrix. If the rank equals the number of unknowns, the solution is unique.</p>` },
    
    // LIÇÕES DE MATEMÁTICA PARA ESTRANGEIROS
    { id:'mf1', course:'math-foreigners', pos:1, type:'material', tier:1,
      title:{ en:'Numbers in Russian', ru:'Числа на русском', pt:'Números em Russo', es:'Números en Ruso' },
      glossary:[ {en:'one',ru:'один',pt:'um',es:'uno'}, {en:'two',ru:'два',pt:'dois',es:'dos'}, {en:'three',ru:'три',pt:'três',es:'tres'}, {en:'four',ru:'четыре',pt:'quatro',es:'cuatro'}, {en:'five',ru:'пять',pt:'cinco',es:'cinco'}, {en:'six',ru:'шесть',pt:'seis',es:'seis'}, {en:'seven',ru:'семь',pt:'sete',es:'siete'}, {en:'eight',ru:'восемь',pt:'oito',es:'ocho'}, {en:'nine',ru:'девять',pt:'nove',es:'nueve'}, {en:'ten',ru:'десять',pt:'dez',es:'diez'} ],
      html:`<h3>Why learn numbers first?</h3>
<p>When your professor says "решите задачу <b>два</b>" (solve problem <b>two</b>), you need to know the Russian word for "two" instantly.</p>
<h3>Numbers 1 to 10</h3>
<table style="min-width:300px">
<tr><th>Number</th><th>Russian</th><th>Pronunciation</th></tr>
<tr><td>1</td><td>один</td><td>ah-DEEN</td></tr>
<tr><td>2</td><td>два</td><td>dva</td></tr>
<tr><td>3</td><td>три</td><td>tree</td></tr>
<tr><td>4</td><td>четыре</td><td>chee-TY-ree</td></tr>
<tr><td>5</td><td>пять</td><td>pyat'</td></tr>
<tr><td>6</td><td>шесть</td><td>shest'</td></tr>
<tr><td>7</td><td>семь</td><td>syem'</td></tr>
<tr><td>8</td><td>восемь</td><td>VO-syem'</td></tr>
<tr><td>9</td><td>девять</td><td>DYEH-vyat'</td></tr>
<tr><td>10</td><td>десять</td><td>DYEH-syat'</td></tr>
</table>
<h3>Numbers 11 to 20</h3>
<p>11 = одиннадцать, 12 = двенадцать, 13 = тринадцать, 14 = четырнадцать, 15 = пятнадцать, 16 = шестнадцать, 17 = семнадцать, 18 = восемнадцать, 19 = девятнадцать, 20 = двадцать.</p>
<h3>Practice tip</h3>
<p>Say the numbers out loud in Russian when you solve a math problem. This builds the vocabulary muscle memory you need for exams.</p>` },
    { id:'mf2', course:'math-foreigners', pos:2, type:'material', tier:1,
      title:{ en:'Basic Operations', ru:'Базовые операции', pt:'Operações Básicas', es:'Operaciones Básicas' },
      glossary:[ {en:'addition',ru:'сложение',pt:'adição',es:'suma'}, {en:'subtraction',ru:'вычитание',pt:'subtração',es:'resta'}, {en:'multiplication',ru:'умножение',pt:'multiplicação',es:'multiplicación'}, {en:'division',ru:'деление',pt:'divisão',es:'división'}, {en:'equals',ru:'равно',pt:'igual',es:'igual'} ],
      html:`<h3>Vocabulary</h3>
<ul>
<li><b>+</b> = плюс (plus)</li>
<li><b>−</b> = минус (minus)</li>
<li><b>×</b> = умножить на (multiply by)</li>
<li><b>÷</b> = разделить на (divide by)</li>
<li><b>=</b> = равно (equals)</li>
</ul>
<h3>Example</h3>
<p>"2 + 3 = 5" in Russian is "<b>два плюс три равно пять</b>".</p>
<p>"6 × 4 = 24" is "<b>шесть умножить на четыре равно двадцать четыре</b>".</p>
<h3>Practice</h3>
<p>Read these aloud in Russian:</p>
<ul>
<li>7 + 3 = 10</li>
<li>9 − 4 = 5</li>
<li>5 × 6 = 30</li>
<li>20 ÷ 4 = 5</li>
</ul>` },
    { id:'mf3', course:'math-foreigners', pos:3, type:'material', tier:1,
      title:{ en:'Fractions and Powers', ru:'Дроби и степени', pt:'Frações e Potências', es:'Fracciones y Potencias' },
      glossary:[ {en:'fraction',ru:'дробь',pt:'fração',es:'fracción'}, {en:'numerator',ru:'числитель',pt:'numerador',es:'numerador'}, {en:'denominator',ru:'знаменатель',pt:'denominador',es:'denominador'}, {en:'power',ru:'степень',pt:'potência',es:'potencia'}, {en:'root',ru:'корень',pt:'raiz',es:'raíz'} ],
      html:`<h3>Fractions</h3>
<p>In a fraction <code>a/b</code>, <b>a</b> is the numerator (числитель) and <b>b</b> is the denominator (знаменатель).</p>
<p>To simplify, divide both by their greatest common divisor.</p>
<h3>Powers</h3>
<ul>
<li><code>x²</code> = x squared = "x в квадрате"</li>
<li><code>x³</code> = x cubed = "x в кубе"</li>
<li><code>x⁰ = 1</code></li>
<li><code>x⁻ⁿ = 1/xⁿ</code></li>
</ul>
<h3>Roots</h3>
<p><code>√x</code> = "корень из x" (square root of x).</p>
<p><code>∛x</code> = "кубический корень из x" (cube root of x).</p>` },
    { id:'mf4', course:'math-foreigners', pos:4, type:'exercise_set', tier:2,
      title:{ en:'Practice: numbers and operations', ru:'Практика: числа и операции', pt:'Prática: números e operações', es:'Práctica: números y operaciones' },
      glossary:[ {en:'exercise',ru:'упражнение',pt:'exercício',es:'ejercicio'}, {en:'answer',ru:'ответ',pt:'resposta',es:'respuesta'} ] }
  ],
  exercises: [
    { id:'e1', lesson:'mf4', type:'mc', answer:0,
      q:{ en:'What is the Russian word for "5"?', ru:'Как по-русски "5"?', pt:'Qual é a palavra russa para "5"?', es:'¿Cuál es la palabra rusa para "5"?' },
      opts:['пять (pyat\')','шесть (shest\')','семь (syem\')','восемь (vosyem\')'],
      exp:{ en:'"5" in Russian is пять (pyat\').', ru:'"5" по-русски — пять.', pt:'"5" em russo é пять (pyat\').', es:'"5" en ruso es пять (pyat\').' } },
    { id:'e2', lesson:'mf4', type:'num', answer:10,
      q:{ en:'What is "seven plus three" in numbers? (7 + 3 = ?)', ru:'Сколько будет "семь плюс три"? (7 + 3 = ?)', pt:'Quanto é "sete mais três"? (7 + 3 = ?)', es:'¿Cuánto es "siete más tres"? (7 + 3 = ?)' },
      exp:{ en:'7 + 3 = 10.', ru:'7 + 3 = 10.', pt:'7 + 3 = 10.', es:'7 + 3 = 10.' } },
    { id:'e3', lesson:'mf4', type:'mc', answer:1,
      q:{ en:'What is "два умножить на четыре"?', ru:'Что такое "два умножить на четыре"?', pt:'O que é "два умножить на четыре"?', es:'¿Qué es "два умножить на четыре"?' },
      opts:['6','8','10','12'],
      exp:{ en:'"два умножить на четыре" = 2 × 4 = 8.', ru:'"два умножить на четыре" = 2 × 4 = 8.', pt:'"два умножить на четыре" = 2 × 4 = 8.', es:'"два умножить на четыре" = 2 × 4 = 8.' } }
  ]
};