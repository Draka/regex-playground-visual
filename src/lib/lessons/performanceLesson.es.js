/**
 * Lección 8: Rendimiento y Optimización
 *
 * Esta lección enseña cómo escribir regex eficientes:
 * - Entender el motor regex interno
 * - Técnicas de optimización
 * - Benchmarking y profiling
 * - Cuándo usar regex vs métodos de string
 * - Mejores prácticas de rendimiento
 */

export const performanceLesson = {
	id: 'performance',
	title: 'Rendimiento y Optimización - Regex Rápidos',
	description: 'Aprende a escribir regex eficientes, entender cómo funciona el motor interno, y cuándo usar alternativas. Domina las técnicas de optimización para mejorar el rendimiento de tus aplicaciones.',
	difficulty: 'avanzado',
	estimatedTime: 35,
	category: 'optimización',
	prerequisites: ['dangerous-regex', 'groups'],
	steps: [
		{
			id: 'regex-engine-internals',
			title: 'El Motor Regex Por Dentro',
			description: 'Comprende cómo funciona internamente un motor de regex para escribir patrones más eficientes.',
			content: `## ¿Cómo Funciona un Motor Regex?

### Tipos de Motores

**1. NFA (Autómata Finito No Determinista)**
- Usado por: JavaScript, Python, Perl, Java
- Características:
  - Soporta backreferences y lookarounds
  - Puede ser lento con backtracking
  - Más flexible y potente

**2. DFA (Autómata Finito Determinista)**
- Usado por: grep, awk, lex
- Características:
  - No soporta backreferences
  - Siempre O(n) en tiempo
  - Más limitado pero más rápido

### El Proceso de Matching en JavaScript

\`\`\`javascript
// Cuando ejecutas:
const regex = /ab+c/;
const result = regex.test("abbbbc");

// El motor hace esto:
// 1. COMPILACIÓN: Convierte /ab+c/ en un autómata
// 2. BÚSQUEDA: Recorre el string carácter por carácter
// 3. MATCHING: Intenta coincidir desde cada posición
// 4. BACKTRACKING: Si falla, retrocede y prueba otra ruta
\`\`\`

### Visualización del Proceso

\`\`\`
Patrón: /a(b|c)+d/
String: "abcbcd"

Posición 0: a✓ b✓ c✓ b✓ c✓ d✓ → MATCH
            ↑
            El motor prueba cada alternativa (b|c)
            y recuerda las decisiones para backtrack
\`\`\`

### ¿Por Qué Importa?

Entender el motor te ayuda a:
- Predecir el rendimiento de tus patrones
- Evitar backtracking innecesario
- Escribir regex que el motor pueda optimizar
- Elegir la herramienta correcta para cada trabajo`,
			pattern: 'a(b|c)+d',
			testText: 'abcbcd',
			expectedMatches: 1,
			flags: '',
			hint: 'El motor prueba cada alternativa en orden',
			benchmarkData: {
				compilationTime: 0.05,
				executionTime: 0.01,
				backtrackingSteps: 3
			}
		},
		{
			id: 'compilation-vs-execution',
			title: 'Compilación vs Ejecución - El Costo Oculto',
			description: 'Aprende la diferencia entre compilar y ejecutar regex, y cómo optimizar ambos.',
			content: `## El Costo de Compilación

### ⚠️ Error Común: Recompilar en Loops

\`\`\`javascript
// ❌ MALO: Compila el regex en cada iteración
function findEmails(texts) {
    const results = [];
    for (const text of texts) {
        // ¡Esto compila el regex 1000 veces!
        if (/\\b[\\w.-]+@[\\w.-]+\\.\\w+\\b/.test(text)) {
            results.push(text);
        }
    }
    return results;
}

// ✅ BUENO: Compila una vez, usa muchas veces
function findEmailsOptimized(texts) {
    const emailRegex = /\\b[\\w.-]+@[\\w.-]+\\.\\w+\\b/;
    const results = [];

    for (const text of texts) {
        // Usa el regex precompilado
        if (emailRegex.test(text)) {
            results.push(text);
        }
    }
    return results;
}
\`\`\`

### Benchmark Real

\`\`\`javascript
// Midiendo el impacto
const texts = Array(10000).fill("test@email.com");

console.time("Con recompilación");
findEmails(texts);
console.timeEnd("Con recompilación");
// Resultado: ~150ms

console.time("Precompilado");
findEmailsOptimized(texts);
console.timeEnd("Precompilado");
// Resultado: ~20ms (7.5x más rápido!)
\`\`\`

### Regex Literals vs Constructor

\`\`\`javascript
// Literal: Compilado en tiempo de parsing
const literal = /pattern/g;  // Más rápido

// Constructor: Compilado en runtime
const constructed = new RegExp("pattern", "g");  // Más lento

// Usa constructor solo cuando el patrón es dinámico
function createRegex(userInput) {
    return new RegExp(userInput, "gi");
}
\`\`\`

### Cache de Regex

\`\`\`javascript
// Cache para patrones dinámicos
const regexCache = new Map();

function getCachedRegex(pattern, flags = '') {
    const key = \`\${pattern}::\${flags}\`;

    if (!regexCache.has(key)) {
        regexCache.set(key, new RegExp(pattern, flags));
    }

    return regexCache.get(key);
}
\`\`\``,
			pattern: '\\b[\\w.-]+@[\\w.-]+\\.\\w+\\b',
			testText: 'contacto@ejemplo.com y ventas@tienda.net son emails',
			expectedMatches: 2,
			flags: 'g',
			hint: 'Precompila tus regex fuera de loops',
			benchmarkData: {
				compilationTime: 0.5,
				executionTime: 0.02,
				improvement: '7.5x con precompilación'
			}
		},
		{
			id: 'anchoring-optimization',
			title: 'Anclaje - Tu Mejor Amigo de Rendimiento',
			description: 'Descubre cómo los anchors pueden mejorar dramáticamente el rendimiento.',
			content: `## El Poder del Anclaje

### Sin Anclaje: El Motor Busca Everywhere

\`\`\`javascript
// ❌ SIN ANCLAR: Busca en todas las posiciones
const slow = /\\d{3}-\\d{4}/;

// En "abc123-4567xyz", el motor intenta:
// Posición 0: a → falla
// Posición 1: b → falla
// Posición 2: c → falla
// Posición 3: 1 → continúa...
// ... prueba en CADA posición
\`\`\`

### Con Anclaje: Búsqueda Dirigida

\`\`\`javascript
// ✅ ANCLADO AL INICIO
const fast = /^\\d{3}-\\d{4}/;
// Solo intenta en posición 0

// ✅ ANCLADO AL FINAL
const fastEnd = /\\d{3}-\\d{4}$/;
// Solo intenta donde puede terminar

// ✅ COMPLETAMENTE ANCLADO
const fastest = /^\\d{3}-\\d{4}$/;
// Una sola verificación
\`\`\`

### Benchmark de Anclaje

\`\`\`javascript
const text = "x".repeat(1000) + "123-4567";

// Sin anclar: ~500 μs (busca en 1000+ posiciones)
/\\d{3}-\\d{4}/.test(text);

// Anclado al final: ~5 μs (100x más rápido!)
/\\d{3}-\\d{4}$/.test(text);
\`\`\`

### Word Boundaries (\\b)

\`\`\`javascript
// \\b es un anchor de palabra
const wordRegex = /\\bcat\\b/;

// Más eficiente que:
const slowRegex = /(?<!\\w)cat(?!\\w)/;

// \\b no consume caracteres (zero-width)
"The cat sat" // \\b coincide antes de 'c' y después de 't'
\`\`\`

### Cuándo Usar Anclaje

**Siempre ancla cuando:**
- Validas formato completo (emails, URLs)
- Buscas al inicio/final del string
- Verificas estructura exacta

**No ancles cuando:**
- Buscas dentro del texto
- Extraes múltiples coincidencias
- El patrón puede aparecer anywhere`,
			pattern: '^\\d{3}-\\d{4}$',
			testText: '123-4567',
			expectedMatches: 1,
			flags: '',
			hint: 'Los anchors eliminan búsquedas innecesarias',
			benchmarkData: {
				withoutAnchors: '500μs',
				withAnchors: '5μs',
				improvement: '100x más rápido'
			}
		},
		{
			id: 'greedy-vs-lazy',
			title: 'Greedy vs Lazy - El Dilema del Rendimiento',
			description: 'Entiende cuándo usar cuantificadores greedy vs lazy para optimizar.',
			content: `## Greedy vs Lazy: ¿Cuál es Más Rápido?

### Comportamiento Greedy (Por Defecto)

\`\`\`javascript
// Greedy: Toma todo lo posible, luego retrocede
const greedy = /".*"/;

// Con: "hello" and "world"
// 1. .* captura: hello" and "world
// 2. No encuentra " final
// 3. Backtrack: hello" and "worl
// 4. Backtrack: hello" and "wor
// ... muchos pasos de backtracking
\`\`\`

### Comportamiento Lazy

\`\`\`javascript
// Lazy: Toma lo mínimo, luego avanza
const lazy = /".*?"/;

// Con: "hello" and "world"
// 1. .*? captura: (nada)
// 2. Avanza: h
// 3. Avanza: he
// ... hasta encontrar "
\`\`\`

### ¿Cuál es Mejor?

\`\`\`javascript
// Para strings cortos: LAZY suele ser mejor
const html = '<div>content</div>';
/<.*?>/.exec(html);  // Lazy: 5 pasos
/<.*>/.exec(html);   // Greedy: 15 pasos + backtrack

// Para strings largos: DEPENDE
const longText = '<' + 'a'.repeat(1000) + '>';
/<.*?>/.exec(longText);  // Lazy: 1000 pasos
/<.*>/.exec(longText);   // Greedy: 1 paso!
\`\`\`

### La Mejor Solución: Character Classes

\`\`\`javascript
// ❌ LAZY (múltiples pasos)
const lazy = /".*?"/;

// ❌ GREEDY (backtracking)
const greedy = /".*"/;

// ✅ ÓPTIMO (sin backtracking)
const optimal = /"[^"]*"/;

// Benchmark con 100 strings entrecomillados:
// Lazy: ~50μs
// Greedy: ~80μs
// Character class: ~10μs ← ¡5x más rápido!
\`\`\`

### Regla de Oro

> "Si puedes usar una character class negada [^x]*,
> es casi siempre mejor que .* o .*?"

**Casos comunes:**
- Strings entrecomillados: \`"[^"]*"\`
- Tags HTML: \`<[^>]*>\`
- Hasta un delimitador: \`[^,]*\`
- Palabras: \`[^\\s]+\``,
			pattern: '"[^"]*"',
			testText: 'El dijo "hola mundo" y ella respondió "adiós"',
			expectedMatches: 2,
			flags: 'g',
			hint: 'Character classes son más eficientes que .* o .*?',
			benchmarkData: {
				greedy: '80μs',
				lazy: '50μs',
				characterClass: '10μs',
				winner: 'Character class (5x más rápido)'
			}
		},
		{
			id: 'alternation-order',
			title: 'Orden de Alternativas - Primero lo Más Probable',
			description: 'Optimiza el orden de las alternativas para mejorar el rendimiento promedio.',
			content: `## El Orden Importa en Alternativas

### El Motor Prueba de Izquierda a Derecha

\`\`\`javascript
// El motor prueba EN ORDEN
const regex = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;

// Si el texto es "sunday":
// 1. Intenta "monday" → falla
// 2. Intenta "tuesday" → falla
// 3. Intenta "wednesday" → falla
// 4. Intenta "thursday" → falla
// 5. Intenta "friday" → falla
// 6. Intenta "saturday" → falla
// 7. Intenta "sunday" → ¡éxito!
\`\`\`

### Optimización por Frecuencia

\`\`\`javascript
// ❌ ORDEN ALEATORIO
const slowFileExt = /\\.(doc|xls|ppt|txt|jpg|png|pdf|html|js|css)$/;

// ✅ ORDENADO POR FRECUENCIA (más común primero)
const fastFileExt = /\\.(js|css|html|jpg|png|pdf|txt|doc|xls|ppt)$/;

// En un proyecto web típico:
// - 40% archivos .js/.css
// - 30% imágenes .jpg/.png
// - 20% .html
// - 10% otros
\`\`\`

### Caso Real: Detección de Navegador

\`\`\`javascript
// ❌ INEFICIENTE (Chrome es 65% del tráfico pero está último)
const slowBrowser = /(Firefox|Safari|Edge|Chrome)/;

// ✅ OPTIMIZADO (Chrome primero)
const fastBrowser = /(Chrome|Firefox|Safari|Edge)/;

// Impacto en 10,000 user agents:
// Slow: ~250ms
// Fast: ~100ms (2.5x más rápido)
\`\`\`

### Técnica: Trie-like Optimization

\`\`\`javascript
// ❌ MÚLTIPLES COMPARACIONES
const keywords = /\\b(function|for|foreach|format|form)\\b/;

// ✅ AGRUPADO POR PREFIJO COMÚN
const optimized = /\\b(f(unction|or(each|mat)?|orm))\\b/;

// Reduce comparaciones cuando hay prefijos comunes
\`\`\`

### Herramienta de Análisis

\`\`\`javascript
// Analiza frecuencia para optimizar orden
function analyzeFrequency(texts, alternatives) {
    const counts = {};
    alternatives.forEach(alt => counts[alt] = 0);

    texts.forEach(text => {
        alternatives.forEach(alt => {
            if (text.includes(alt)) counts[alt]++;
        });
    });

    // Ordena por frecuencia descendente
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([alt]) => alt);
}

// Uso
const optimizedOrder = analyzeFrequency(
    userAgents,
    ['Chrome', 'Firefox', 'Safari', 'Edge']
);
// Resultado: ['Chrome', 'Firefox', 'Safari', 'Edge']
\`\`\``,
			pattern: '\\.(js|css|html|jpg|png)$',
			testText: 'archivo.js',
			expectedMatches: 1,
			flags: '',
			hint: 'Pon las alternativas más frecuentes primero',
			benchmarkData: {
				worstCase: '5 comparaciones para .png',
				bestCase: '1 comparación para .js',
				avgCase: '2.3 comparaciones'
			}
		},
		{
			id: 'string-methods-vs-regex',
			title: 'Regex vs Métodos de String - Elige Sabiamente',
			description: 'Aprende cuándo es mejor usar métodos nativos de string en lugar de regex.',
			content: `## ¿Cuándo NO Usar Regex?

### Métodos de String Son Más Rápidos Para Casos Simples

\`\`\`javascript
// ❌ REGEX INNECESARIO
if (/^hello/.test(str)) { }
if (/world$/.test(str)) { }
if (/test/.test(str)) { }

// ✅ MÉTODOS NATIVOS (2-10x más rápido)
if (str.startsWith('hello')) { }
if (str.endsWith('world')) { }
if (str.includes('test')) { }
\`\`\`

### Benchmark Comparativo

\`\`\`javascript
const text = "Hello, this is a test string for benchmarking";

// Buscar substring simple
console.time('includes');
for (let i = 0; i < 1000000; i++) {
    text.includes('test');
}
console.timeEnd('includes'); // ~15ms

console.time('regex');
for (let i = 0; i < 1000000; i++) {
    /test/.test(text);
}
console.timeEnd('regex'); // ~45ms (3x más lento)
\`\`\`

### Cuándo Usar Cada Uno

**USA MÉTODOS DE STRING para:**
\`\`\`javascript
// Búsqueda exacta
str.includes('exact')

// Inicio/fin
str.startsWith('prefix')
str.endsWith('suffix')

// Reemplazo simple
str.replace('old', 'new')  // Primera ocurrencia
str.replaceAll('old', 'new')  // Todas (ES2021)

// División simple
str.split(',')

// Mayúsculas/minúsculas
str.toLowerCase()
str.toUpperCase()
\`\`\`

**USA REGEX para:**
\`\`\`javascript
// Patrones complejos
/\\b\\w+@\\w+\\.\\w+\\b/  // Emails

// Múltiples condiciones
/cat|dog|bird/  // Cualquiera de estos

// Validación de formato
/^\\d{3}-\\d{3}-\\d{4}$/  // Teléfono

// Extracción con grupos
/(\\d{2})\\/(\\d{2})\\/(\\d{4})/  // Fecha

// Reemplazo complejo
str.replace(/\\s+/g, ' ')  // Múltiples espacios
\`\`\`

### Tabla de Decisión Rápida

| Operación | String Method | Regex | Ganador |
|-----------|--------------|-------|---------|
| Buscar texto exacto | includes() | /text/ | String |
| Verificar inicio | startsWith() | /^text/ | String |
| Verificar fin | endsWith() | /text$/ | String |
| Buscar patrón | ❌ | /\\d+/ | Regex |
| Validar formato | ❌ | /^....$/ | Regex |
| Múltiples opciones | ❌ | /(a\|b\|c)/ | Regex |`,
			pattern: 'test',
			testText: 'Este es un test de rendimiento',
			expectedMatches: 1,
			flags: '',
			hint: 'Para búsquedas simples, includes() es más rápido',
			benchmarkData: {
				stringMethod: '15ms per million',
				regexMethod: '45ms per million',
				winner: 'String method (3x más rápido)'
			}
		},
		{
			id: 'optimization-techniques',
			title: 'Técnicas Avanzadas de Optimización',
			description: 'Domina las técnicas profesionales para escribir regex ultra-rápidos.',
			content: `## Técnicas Pro de Optimización

### 1. Atomic Groups (Cuando Disponible)

\`\`\`javascript
// Atomic groups previenen backtracking
// JavaScript no los soporta nativamente, pero puedes simular:

// En lugar de:
/(\\d+)+b/  // Catastrophic backtracking

// Usa:
/(?=(\\d+))\\1+b/  // Simula atomic group con lookahead
\`\`\`

### 2. Unrolling the Loop

\`\`\`javascript
// ❌ LOOP SIMPLE (más backtracking)
const quoted = /"(?:[^"\\\\]|\\\\.)*"/;

// ✅ LOOP UNROLLED (menos backtracking)
const unrolled = /"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"/;

// El patrón unrolled:
// 1. Captura todo lo normal [^"\\\\]*
// 2. Solo procesa escapes cuando es necesario
// 3. 30-50% más rápido en strings largos
\`\`\`

### 3. Possessive Quantifiers (Simulados)

\`\`\`javascript
// JavaScript no tiene possessive quantifiers (++, *+)
// Pero puedes simularlos:

// En lugar de: \\d++ (no existe en JS)
// Usa lookahead:
/(?=(\\d+))\\1/

// Esto "posee" los dígitos sin backtracking
\`\`\`

### 4. Branch Reset Pattern

\`\`\`javascript
// Cuando tienes múltiples ramas similares:

// ❌ REPETITIVO
/(jpg|jpeg|png|gif|bmp|webp)$/i

// ✅ OPTIMIZADO con prefijos comunes
/\\.(?:jpe?g|png|gif|bmp|webp)$/i

// Agrupa prefijos comunes para reducir comparaciones
\`\`\`

### 5. Precompilación y Flags

\`\`\`javascript
// Efecto de los flags en rendimiento:

// Sin flags: Más rápido
/pattern/

// Flag 'i': ~10% más lento (case conversion)
/pattern/i

// Flag 'g': ~5% overhead (estado global)
/pattern/g

// Flag 'm': Mínimo impacto
/pattern/m

// Usa flags solo cuando necesario
\`\`\`

### 6. Técnica del "Anchor First"

\`\`\`javascript
// Pon las condiciones más restrictivas primero

// ❌ MENOS EFICIENTE
/.*\\.js$/  // Primero .*, luego verifica .js

// ✅ MÁS EFICIENTE
/\\.js$/  // Verifica el final directo

// Si necesitas capturar todo:
/^(.*\\.js)$/  // Ancla primero, captura después
\`\`\`

### Checklist de Optimización

- [ ] ¿Puedo usar un método de string en su lugar?
- [ ] ¿Está el regex precompilado fuera del loop?
- [ ] ¿Puedo añadir anchors (^, $, \\b)?
- [ ] ¿Puedo usar character classes [^x]* en lugar de .*?
- [ ] ¿Están las alternativas ordenadas por frecuencia?
- [ ] ¿Puedo eliminar capturas innecesarias con (?:)?
- [ ] ¿He limitado los cuantificadores {n,m}?
- [ ] ¿He probado el rendimiento con datos reales?`,
			pattern: '"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"',
			testText: '"Esta es una \\"cadena\\" con escapes"',
			expectedMatches: 1,
			flags: '',
			hint: 'Loop unrolling reduce el backtracking',
			benchmarkData: {
				simple: '100μs',
				unrolled: '65μs',
				improvement: '35% más rápido'
			}
		},
		{
			id: 'profiling-tools',
			title: 'Herramientas de Profiling - Mide, No Adivines',
			description: 'Aprende a usar herramientas para medir y optimizar el rendimiento de tus regex.',
			content: `## Herramientas de Profiling y Análisis

### 1. Medición Básica con console.time

\`\`\`javascript
// Medición simple
const testString = "test".repeat(10000);

console.time('regex1');
/test/g.exec(testString);
console.timeEnd('regex1');

console.time('regex2');
testString.match(/test/g);
console.timeEnd('regex2');
\`\`\`

### 2. Performance API para Precisión

\`\`\`javascript
class RegexProfiler {
    constructor() {
        this.results = [];
    }

    profile(name, regex, text, iterations = 1000) {
        const start = performance.now();

        for (let i = 0; i < iterations; i++) {
            regex.test(text);
            regex.lastIndex = 0; // Reset para regex con flag 'g'
        }

        const duration = performance.now() - start;
        const avgTime = duration / iterations;

        this.results.push({
            name,
            pattern: regex.source,
            flags: regex.flags,
            iterations,
            totalTime: duration.toFixed(2),
            avgTime: avgTime.toFixed(4),
            opsPerSec: Math.round(1000 / avgTime)
        });

        return this;
    }

    compare() {
        console.table(this.results);

        // Encuentra el más rápido
        const fastest = this.results.reduce((min, r) =>
            r.avgTime < min.avgTime ? r : min
        );

        // Calcula mejoras relativas
        this.results.forEach(r => {
            if (r !== fastest) {
                const improvement = ((r.avgTime / fastest.avgTime - 1) * 100).toFixed(1);
                console.log(\`\${r.name} es \${improvement}% más lento que \${fastest.name}\`);
            }
        });
    }
}

// Uso
const profiler = new RegexProfiler();

profiler
    .profile('Greedy', /".+"/, '"hello" and "world"')
    .profile('Lazy', /".+?"/, '"hello" and "world"')
    .profile('CharClass', /"[^"]+"/, '"hello" and "world"')
    .compare();
\`\`\`

### 3. Herramientas Online

**regex101.com - Debugger Visual**
- Steps counter
- Debugger paso a paso
- Explicación de cada paso
- Performance warnings

**regexpal.com - Testing Rápido**
- Highlighting en tiempo real
- Sin overhead de compilación

**regexr.com - Análisis Detallado**
- Performance timeline
- Heatmap de matches

### 4. Node.js Profiling Avanzado

\`\`\`javascript
// Para Node.js: usa el flag --prof
// node --prof regex-script.js

// Luego procesa el log:
// node --prof-process isolate-0xnnnnnnnnnnnn-v8.log

// O usa el inspector:
// node --inspect regex-script.js
// Abre chrome://inspect
\`\`\`

### 5. Benchmark Suite Completo

\`\`\`javascript
class RegexBenchmark {
    static run(patterns, testCases) {
        const results = {};

        patterns.forEach(({ name, regex }) => {
            results[name] = {
                compile: 0,
                execute: 0,
                matches: 0
            };

            testCases.forEach(text => {
                // Mide compilación
                const compileStart = performance.now();
                const compiled = new RegExp(regex.source, regex.flags);
                results[name].compile += performance.now() - compileStart;

                // Mide ejecución
                const execStart = performance.now();
                const matches = text.match(compiled);
                results[name].execute += performance.now() - execStart;

                if (matches) {
                    results[name].matches += matches.length;
                }
            });
        });

        return results;
    }
}
\`\`\`

### Métricas Clave a Medir

1. **Tiempo de Compilación**: Crítico si creas regex dinámicamente
2. **Tiempo de Primera Coincidencia**: Para .test() y .search()
3. **Tiempo Total de Extracción**: Para .match() y .matchAll()
4. **Pasos de Backtracking**: Indicador de eficiencia
5. **Uso de Memoria**: Para patterns con muchas capturas`,
			pattern: '\\b\\w+@\\w+\\.\\w{2,4}\\b',
			testText: 'Contacta a info@ejemplo.com o ventas@tienda.es',
			expectedMatches: 2,
			flags: 'g',
			hint: 'Siempre mide el rendimiento con datos reales',
			benchmarkData: {
				compilationTime: '0.05ms',
				executionTime: '0.02ms per match',
				totalTime: '0.09ms',
				stepsExecuted: 45
			}
		}
	],

	exercises: [
		{
			id: 'optimize-email',
			title: 'Optimiza el Validador de Email',
			description: 'Este validador de email funciona pero es lento. ¿Puedes optimizarlo?',
			startingPattern: '.*@.*\\..+',
			testCases: [
				{ input: 'user@example.com', shouldMatch: true },
				{ input: 'test.email@domain.co.uk', shouldMatch: true },
				{ input: 'not-an-email', shouldMatch: false },
				{ input: '@invalid.com', shouldMatch: false }
			],
			solution: '^[^@]+@[^@]+\\.[^@]+$',
			hints: [
				'Los .* son lentos, usa character classes',
				'Añade anchors para evitar búsquedas innecesarias',
				'Usa [^@]+ en lugar de .*'
			]
		},
		{
			id: 'optimize-html-tags',
			title: 'Mejora el Parser de HTML Tags',
			description: 'Este patrón encuentra tags HTML pero tiene problemas de rendimiento.',
			startingPattern: '<.*>',
			testCases: [
				{ input: '<div>', shouldMatch: true },
				{ input: '<span class="test">', shouldMatch: true },
				{ input: 'not a tag', shouldMatch: false },
				{ input: '<p>texto</p>', shouldMatch: true }
			],
			solution: '<[^>]+>',
			hints: [
				'El .* es greedy y causa backtracking',
				'Usa [^>]+ para ser más específico',
				'No necesitas lazy quantifier aquí'
			]
		}
	],

	quiz: [
		{
			question: '¿Cuál es generalmente más rápido para buscar texto exacto?',
			options: [
				'regex.test()',
				'string.includes()',
				'regex.exec()',
				'Son iguales'
			],
			correct: 1,
			explanation: 'string.includes() es 2-3x más rápido para búsquedas exactas porque no necesita compilar un patrón.'
		},
		{
			question: '¿Qué técnica reduce más el backtracking?',
			options: [
				'Usar más grupos de captura',
				'Usar character classes negadas [^x]',
				'Usar múltiples .*',
				'Usar flags globales'
			],
			correct: 1,
			explanation: 'Character classes negadas [^x] son específicas y no requieren backtracking como .*'
		},
		{
			question: '¿Cuándo deberías precompilar un regex?',
			options: [
				'Nunca, JavaScript lo hace automáticamente',
				'Solo con patrones complejos',
				'Cuando lo uses múltiples veces',
				'Solo con el constructor RegExp'
			],
			correct: 2,
			explanation: 'Precompila regex que uses múltiples veces para evitar recompilación, especialmente en loops.'
		},
		{
			question: '¿Qué flag tiene mayor impacto en el rendimiento?',
			options: [
				'g (global)',
				'i (case insensitive)',
				'm (multiline)',
				's (dotall)'
			],
			correct: 1,
			explanation: 'El flag "i" requiere conversión de mayúsculas/minúsculas, añadiendo ~10% de overhead.'
		}
	],

	highlights: [
		'Precompilar regex fuera de loops puede mejorar el rendimiento 7x',
		'Los anchors (^, $) pueden hacer un regex 100x más rápido',
		'Character classes [^x] son casi siempre mejores que .* o .*?',
		'Para búsquedas simples, los métodos de string son 2-3x más rápidos',
		'El orden de las alternativas debe basarse en la frecuencia de aparición'
	],

	resources: [
		{
			title: 'regex101.com - Debugger y Profiler',
			url: 'https://regex101.com/',
			type: 'herramienta'
		},
		{
			title: 'Mastering Regular Expressions (Libro)',
			url: 'https://www.oreilly.com/library/view/mastering-regular-expressions/0596528124/',
			type: 'libro'
		},
		{
			title: 'V8 Regex Performance',
			url: 'https://v8.dev/blog/regexp-tier-up',
			type: 'artículo'
		}
	]
};