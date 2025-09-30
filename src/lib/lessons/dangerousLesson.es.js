/**
 * Lección 7: Regex Peligrosos - Evita las Trampas
 *
 * Esta lección enseña sobre los peligros de regex mal diseñados:
 * - Catastrophic Backtracking
 * - ReDoS (Regex Denial of Service)
 * - Memory Exhaustion
 * - Patrones ineficientes
 * - Mejores prácticas de seguridad
 */

export const dangerousLesson = {
	id: 'dangerous-regex',
	title: 'Regex Peligrosos - Evita las Trampas',
	description: 'Aprende a identificar y evitar regex que pueden quebrar aplicaciones. Descubre los peligros del catastrophic backtracking, ReDoS, y cómo escribir patrones seguros y eficientes.',
	difficulty: 'avanzado',
	estimatedTime: 30,
	category: 'seguridad',
	prerequisites: ['groups', 'quantifiers'],
	steps: [
		{
			id: 'catastrophic-backtracking',
			title: 'Catastrophic Backtracking - El Peligro Oculto',
			description: 'Cuando un regex puede tomar millones de caminos para intentar coincidir, el rendimiento se desploma exponencialmente.',
			content: `## El Problema del Backtracking Catastrófico

Imagina que tu regex es como un explorador en un laberinto. Con patrones mal diseñados,
el explorador puede tomar **billones** de caminos antes de darse por vencido.

### Ejemplo Peligroso:
\`\`\`javascript
// ⚠️ PELIGRO: Este patrón es vulnerable
const malRegex = /(a+)+b/;

// Con esta entrada, el regex se cuelga:
const input = "aaaaaaaaaaaaaaaaaaaaaaaa!"; // Sin 'b' al final

// El motor intenta todas las combinaciones posibles:
// (a)(a)(a)(a)...
// (aa)(a)(a)...
// (a)(aa)(a)...
// (aaa)(a)...
// ... millones de combinaciones
\`\`\`

### ¿Por qué sucede?
Los cuantificadores anidados como \`(a+)+\`, \`(a*)*\`, o \`(a+)*\` crean ambigüedad.
El motor no sabe cuántos caracteres debe capturar cada grupo, así que prueba TODAS las combinaciones.

### Tiempo de Ejecución:
- 10 caracteres: ~1 ms
- 20 caracteres: ~1 segundo
- 30 caracteres: ~17 minutos
- 40 caracteres: ~11 días 😱

¡El tiempo crece exponencialmente!`,
			pattern: '(a+)+b',
			testText: 'aaaaaaaab',
			expectedMatches: 1,
			flags: '',
			hint: 'Este patrón es seguro con "b" al final, pero peligroso sin él',
			dangerLevel: 'critical',
			safeAlternative: 'a+b',
			explanation: 'El patrón (a+)+ crea backtracking exponencial. Usa a+b en su lugar.'
		},
		{
			id: 'redos-attack',
			title: 'ReDoS - Ataques de Denegación de Servicio',
			description: 'Los atacantes pueden usar regex vulnerables para hacer que tu aplicación se congele completamente.',
			content: `## ReDoS: Regex Denial of Service

Un atacante puede enviar datos especialmente diseñados para explotar regex vulnerables
y hacer que tu servidor se quede sin recursos.

### Caso Real: Stack Overflow (2016)
\`\`\`javascript
// Regex vulnerable usado en Stack Overflow
const regex = /^(a+)+$/;

// Ataque: String sin coincidencia final
const attack = "a".repeat(100) + "X";
// El servidor se cuelga procesando esto
\`\`\`

### Patrones Vulnerables Comunes:

1. **Repetición Anidada**
   - \`(a+)*\`
   - \`(a*)+\`
   - \`(a+)+\`

2. **Alternativas con Superposición**
   - \`(a|ab)*\`
   - \`(a|a)*\`

3. **Sufijos Opcionales Repetidos**
   - \`(a+)+b\`
   - \`([a-z]+)*@\`

### Impacto Real:
- **Cloudflare (2019)**: 27 minutos de caída global
- **Stack Overflow (2016)**: 34 minutos fuera de línea
- **npm (2018)**: Múltiples paquetes vulnerables

### Cómo Protegerte:
1. Usa timeouts en la ejecución de regex
2. Valida la longitud de entrada máxima
3. Usa herramientas de análisis estático
4. Prefiere métodos de string cuando sea posible`,
			pattern: '(.*,){11}P',
			testText: '1,2,3,4,5,6,7,8,9,10,11,P',
			expectedMatches: 1,
			flags: '',
			hint: 'Este patrón busca 11 comas seguidas de P, pero es vulnerable a ReDoS',
			dangerLevel: 'high',
			safeAlternative: '(?:[^,]*,){11}P',
			explanation: 'Usar .* con repetición crea vulnerabilidad. [^,]* es más específico y seguro.'
		},
		{
			id: 'memory-exhaustion',
			title: 'Agotamiento de Memoria - El Asesino Silencioso',
			description: 'Algunos patrones pueden consumir gigabytes de memoria, crasheando tu aplicación.',
			content: `## Patrones que Devoran Memoria

Ciertos regex pueden hacer que tu aplicación consuma toda la memoria disponible.

### Grupos de Captura Excesivos
\`\`\`javascript
// ⚠️ MALO: Crea miles de grupos de captura
const badRegex = /((((((((((.*)))))))))) /g;

// En un texto largo, esto puede usar GB de memoria
const hugeText = "a".repeat(1000000);
badRegex.exec(hugeText); // 💥 Posible crash
\`\`\`

### Lookaheads Anidados
\`\`\`javascript
// ⚠️ PELIGROSO: Lookaheads complejos
const complex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{8,}/;

// Con entrada maliciosa, consume mucha memoria
const malicious = "Aa1!".repeat(10000);
\`\`\`

### Cuantificadores sin Límite
\`\`\`javascript
// ⚠️ RIESGOSO: Sin límite superior
const noLimit = /\w{1000,}/g;

// vs

// ✅ MEJOR: Con límite razonable
const withLimit = /\w{1000,5000}/g;
\`\`\`

### Mejores Prácticas:
1. **Limita los cuantificadores**: Usa \`{n,m}\` en lugar de \`{n,}\`
2. **Evita capturas innecesarias**: Usa \`(?:...)\` para grupos no-capturantes
3. **Simplifica lookaheads**: Combínalos cuando sea posible
4. **Establece límites de entrada**: Valida el tamaño antes de aplicar regex`,
			pattern: '(\\w+\\s?){1,100}',
			testText: 'Este es un texto normal con palabras y espacios',
			expectedMatches: 1,
			flags: '',
			hint: 'Este patrón es seguro con límite, pero sin él podría consumir mucha memoria',
			dangerLevel: 'medium',
			safeAlternative: '\\w+(?:\\s+\\w+){0,99}',
			explanation: 'Limitar repeticiones y ser específico previene el agotamiento de memoria.'
		},
		{
			id: 'common-vulnerable-patterns',
			title: 'Patrones Vulnerables Comunes',
			description: 'Aprende a identificar y corregir los patrones peligrosos más frecuentes.',
			content: `## Galería de Patrones Peligrosos

### 1. Email Validation Vulnerable
\`\`\`javascript
// ⚠️ VULNERABLE
const badEmail = /^([a-zA-Z0-9_\\.\\-])+@([a-zA-Z0-9_\\.\\-])+\\.([a-zA-Z]{2,5})$/;

// ✅ SEGURO
const safeEmail = /^[a-zA-Z0-9_\\.\\-]+@[a-zA-Z0-9_\\.\\-]+\\.[a-zA-Z]{2,5}$/;
\`\`\`

### 2. URL Parsing Peligroso
\`\`\`javascript
// ⚠️ VULNERABLE: Múltiples .*
const badUrl = /^(https?:\\/\\/)?.*(www\\.)?.*/;

// ✅ SEGURO: Más específico
const safeUrl = /^https?:\\/\\/[^\\s\\/$.?#].[^\\s]*$/;
\`\`\`

### 3. HTML Tag Matching Riesgoso
\`\`\`javascript
// ⚠️ VULNERABLE: Greedy con HTML
const badHtml = /<.*>/;

// ✅ SEGURO: Lazy quantifier
const safeHtml = /<.*?>/;

// ✅ MEJOR: Sin puntos
const betterHtml = /<[^>]*>/;
\`\`\`

### 4. CSV Parsing Problemático
\`\`\`javascript
// ⚠️ VULNERABLE
const badCsv = /^(.*,)*.*$/;

// ✅ SEGURO
const safeCsv = /^([^,]*,)*[^,]*$/;
\`\`\`

### Señales de Alerta 🚩
- Cuantificadores anidados: \`(x+)+\`, \`(x*)*\`
- Alternativas superpuestas: \`(a|ab)*\`
- Múltiples \`.*\` en el mismo patrón
- Lookaheads/lookbehinds complejos
- Grupos de captura excesivos`,
			pattern: '^([^,]*,){3}[^,]*$',
			testText: 'uno,dos,tres,cuatro',
			expectedMatches: 1,
			flags: '',
			hint: 'Patrón seguro para parsear CSV con exactamente 4 campos',
			dangerLevel: 'safe',
			safeAlternative: 'Ya es seguro',
			explanation: 'Usar [^,]* es más seguro que .* para parsear CSV.'
		},
		{
			id: 'performance-testing',
			title: 'Testing de Rendimiento - Mide Antes de Deployar',
			description: 'Aprende a detectar problemas de rendimiento antes de que lleguen a producción.',
			content: `## Herramientas para Detectar Regex Peligrosos

### 1. Análisis Estático
\`\`\`javascript
// Función para detectar patrones peligrosos
function isDangerousRegex(pattern) {
    const dangerous = [
        /\\([^)]*[+*]\\)[+*]/,  // (x+)+ o (x*)*
        /\\([^)|]*\\|[^)]*\\)[+*]/, // (a|b)*
        /\\.\\*.*\\.\\*/,          // Multiple .*
    ];

    return dangerous.some(d => d.test(pattern));
}

// Uso
isDangerousRegex("(a+)+b");  // true - ¡Peligroso!
isDangerousRegex("a+b");     // false - Seguro
\`\`\`

### 2. Benchmark de Rendimiento
\`\`\`javascript
function benchmarkRegex(regex, testStrings) {
    const results = [];

    for (const str of testStrings) {
        const start = performance.now();

        // Timeout de seguridad
        const timeout = setTimeout(() => {
            throw new Error("Regex timeout!");
        }, 1000);

        try {
            regex.test(str);
            clearTimeout(timeout);
            const time = performance.now() - start;
            results.push({ str, time });
        } catch (e) {
            results.push({ str, time: "TIMEOUT", danger: true });
        }
    }

    return results;
}
\`\`\`

### 3. Generación de Casos de Prueba
\`\`\`javascript
// Genera strings que pueden causar backtracking
function generateEvilString(baseChar, length, suffix = "X") {
    return baseChar.repeat(length) + suffix;
}

// Prueba con diferentes longitudes
const testCases = [10, 20, 30, 40].map(n =>
    generateEvilString("a", n, "!")
);
\`\`\`

### Herramientas Recomendadas:
- **safe-regex**: Detector de npm
- **rxxr2**: Analizador online
- **regex101**: Incluye debugger
- **redos-checker**: Validador de ReDoS`,
			pattern: '^[a-zA-Z0-9]+$',
			testText: 'SafeString123',
			expectedMatches: 1,
			flags: '',
			hint: 'Patrón simple y seguro para validar alfanuméricos',
			dangerLevel: 'safe',
			safeAlternative: 'Ya es óptimo',
			explanation: 'Los patrones simples sin anidación son los más seguros y rápidos.'
		},
		{
			id: 'safe-alternatives',
			title: 'Alternativas Seguras - La Solución',
			description: 'Aprende a reescribir patrones peligrosos de forma segura y eficiente.',
			content: `## Transformando Patrones Peligrosos en Seguros

### Técnica 1: Eliminar Anidación
\`\`\`javascript
// ⚠️ PELIGROSO
const dangerous = /(x+)+y/;

// ✅ SEGURO: Simplifica
const safe = /x+y/;

// Si necesitas capturar grupos:
// ⚠️ PELIGROSO
const dangerousGroups = /(\\w+\\s*)+/;

// ✅ SEGURO: Atomic grouping (cuando esté disponible)
const safeGroups = /(?:\\w+\\s*)*/;
\`\`\`

### Técnica 2: Usar Negación en Lugar de .*
\`\`\`javascript
// ⚠️ LENTO: Greedy dot
const slow = /<.*>/;

// ✅ RÁPIDO: Character class negada
const fast = /<[^>]*>/;

// Más ejemplos:
// Strings entre comillas
const quoted = /"[^"]*"/;  // Mejor que /".*?"/

// Hasta el siguiente espacio
const word = /[^\\s]+/;    // Mejor que /.*?\\s/
\`\`\`

### Técnica 3: Anclar Cuando Sea Posible
\`\`\`javascript
// ⚠️ SIN ANCLAR: Busca en todo el string
const unanchored = /\\d{3}-\\d{4}/;

// ✅ ANCLADO: Más eficiente
const anchored = /^\\d{3}-\\d{4}$/;

// Parcialmente anclado también ayuda
const startAnchored = /^\\d{3}-\\d{4}/;
\`\`\`

### Técnica 4: Limitar Cuantificadores
\`\`\`javascript
// ⚠️ SIN LÍMITE
const unlimited = /\\w+/;

// ✅ CON LÍMITE RAZONABLE
const limited = /\\w{1,100}/;

// Para passwords
const password = /^.{8,128}$/; // Límite máximo
\`\`\`

### Técnica 5: Preferir Métodos de String
\`\`\`javascript
// A veces no necesitas regex

// En lugar de:
if (/^hello/.test(str)) { }

// Usa:
if (str.startsWith("hello")) { }

// En lugar de:
str.replace(/\\s+/g, " ");

// Considera:
str.split(/\\s+/).join(" ");
\`\`\``,
			pattern: '^[^@]+@[^@]+\\.[^@]+$',
			testText: 'usuario@ejemplo.com',
			expectedMatches: 1,
			flags: '',
			hint: 'Email validation segura usando negación',
			dangerLevel: 'safe',
			safeAlternative: 'Ya es seguro y eficiente',
			explanation: 'Usar [^@]+ es más seguro que .* para validar emails.'
		},
		{
			id: 'real-world-fixes',
			title: 'Casos Reales y Sus Soluciones',
			description: 'Ejemplos de vulnerabilidades reales encontradas en producción y cómo fueron corregidas.',
			content: `## Casos Reales de ReDoS en Producción

### Caso 1: Validación de Espacios en Blanco (OWASP)
\`\`\`javascript
// ⚠️ VULNERABLE: Usado en múltiples frameworks
const trimRegex = /^[\\s\\t\\r\\n]*(.*?)[\\s\\t\\r\\n]*$/;

// Problema: "\\t".repeat(50000) causa timeout

// ✅ SOLUCIÓN: Usar trim() nativo
const trimmed = str.trim();
\`\`\`

### Caso 2: Markdown Parser (marked.js)
\`\`\`javascript
// ⚠️ VULNERABLE: CVE-2022-21680
const linkRegex = /^!?\\[([^\\[\\]\\\\]|\\\\.)*\\]/;

// Ataque: "[".repeat(50000)

// ✅ SOLUCIÓN: Limitar profundidad
const safeLinkRegex = /^!?\\[([^\\[\\]\\\\]|\\\\.){0,1000}\\]/;
\`\`\`

### Caso 3: User-Agent Parser
\`\`\`javascript
// ⚠️ VULNERABLE: ua-parser-js
const osRegex = /(windows|mac|linux).*(\\d+\\.\\d+).*/i;

// ✅ SOLUCIÓN: Más específico
const safeOsRegex = /^[^(]*\\(([^)]+)\\)/;
// Luego parsear el contenido del paréntesis
\`\`\`

### Caso 4: Validación de URLs (validator.js)
\`\`\`javascript
// ⚠️ VULNERABLE: Versiones antiguas
const urlRegex = /^(?:(?:https?|ftp):\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!10(?:\\.\\d{1,3}){3})(?!127(?:\\.\\d{1,3}){3})(?!169\\.254(?:\\.\\d{1,3}){2})(?!192\\.168(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:\\/[^\\s]*)?$/i;

// ✅ SOLUCIÓN: Usar URL constructor
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
\`\`\`

### Lecciones Aprendidas:
1. **Los regex complejos son un riesgo**: Simplifica siempre que puedas
2. **Usa APIs nativas**: URL, trim(), startsWith() son más seguros
3. **Actualiza dependencias**: Muchos CVEs son por regex vulnerables
4. **Audita regularmente**: Usa herramientas de seguridad`,
			pattern: '^\\S+@\\S+\\.\\S+$',
			testText: 'seguro@email.com',
			expectedMatches: 1,
			flags: '',
			hint: 'Validación de email súper simple pero segura',
			dangerLevel: 'safe',
			safeAlternative: 'Simple y seguro',
			explanation: 'A veces la simplicidad es la mejor defensa contra ReDoS.'
		},
		{
			id: 'best-practices',
			title: 'Mejores Prácticas de Seguridad',
			description: 'Guía completa para escribir regex seguros y mantener tu aplicación protegida.',
			content: `## Guía Definitiva de Regex Seguros

### 🛡️ Principios de Seguridad

#### 1. Defensa en Profundidad
\`\`\`javascript
// Múltiples capas de protección
function safeRegexMatch(pattern, input, maxLength = 10000) {
    // Capa 1: Limitar longitud
    if (input.length > maxLength) {
        throw new Error("Input too long");
    }

    // Capa 2: Timeout
    const start = Date.now();
    const timeout = 1000; // 1 segundo máximo

    // Capa 3: Try-catch
    try {
        const regex = new RegExp(pattern);

        // Capa 4: Verificar complejidad
        if (isDangerousPattern(pattern)) {
            console.warn("Potentially dangerous pattern detected");
        }

        const result = regex.test(input);

        // Capa 5: Verificar tiempo
        if (Date.now() - start > timeout) {
            throw new Error("Regex timeout");
        }

        return result;
    } catch (error) {
        console.error("Regex error:", error);
        return false;
    }
}
\`\`\`

#### 2. Lista de Verificación de Seguridad
- [ ] Sin cuantificadores anidados \`(x+)+\`
- [ ] Sin múltiples \`.*\` en el patrón
- [ ] Límites en cuantificadores \`{n,m}\`
- [ ] Anclajes cuando sea posible \`^$\`
- [ ] Character classes específicas \`[^x]\`
- [ ] Timeout de ejecución implementado
- [ ] Longitud máxima de entrada validada
- [ ] Tests de rendimiento ejecutados
- [ ] Code review por seguridad

#### 3. Arquitectura Defensiva
\`\`\`javascript
class SafeRegexValidator {
    constructor(options = {}) {
        this.maxInputLength = options.maxInputLength || 10000;
        this.timeout = options.timeout || 1000;
        this.cache = new Map(); // Cache de resultados
    }

    validate(pattern, input) {
        // Check cache first
        const cacheKey = \`\${pattern}::\${input}\`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Validate with protection
        const result = this.safeExecute(pattern, input);

        // Cache result
        this.cache.set(cacheKey, result);

        return result;
    }

    safeExecute(pattern, input) {
        // Implementation with all safety checks
        // ...
    }
}
\`\`\`

#### 4. Monitoreo en Producción
\`\`\`javascript
// Métricas importantes
const regexMetrics = {
    totalExecutions: 0,
    timeouts: 0,
    avgExecutionTime: 0,
    slowestPattern: null,

    track(pattern, executionTime) {
        this.totalExecutions++;

        if (executionTime > 1000) {
            this.timeouts++;
            console.error(\`Slow regex detected: \${pattern}\`);
        }

        // Update metrics...
    }
};
\`\`\`

### 📚 Recursos Esenciales
- [OWASP ReDoS Guide](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)
- [Safe-Regex NPM](https://www.npmjs.com/package/safe-regex)
- [Regex101 Debugger](https://regex101.com/)
- [ReDos Checker](https://redos-checker.surge.sh/)

### ✅ Recuerda:
> "El regex más seguro es el que no escribes. Usa métodos nativos cuando sea posible."`,
			pattern: '^[a-zA-Z0-9]{3,20}$',
			testText: 'SafeUsername123',
			expectedMatches: 1,
			flags: '',
			hint: 'Validación de username con límites claros',
			dangerLevel: 'safe',
			safeAlternative: 'Patrón óptimo',
			explanation: 'Límites claros, sin anidación, anclado = regex perfecto.'
		}
	],

	exercises: [
		{
			id: 'fix-dangerous-1',
			title: 'Corrige el Email Validator Peligroso',
			description: 'Este validador de email tiene un problema de ReDoS. ¿Puedes arreglarlo?',
			startingPattern: '^([a-zA-Z0-9_\\.\\-])+@([a-zA-Z0-9_\\.\\-])+\\.([a-zA-Z]{2,5})$',
			testCases: [
				{ input: 'user@example.com', shouldMatch: true },
				{ input: 'test.email@domain.co.uk', shouldMatch: true },
				{ input: 'a'.repeat(100) + '@', shouldMatch: false }
			],
			solution: '^[a-zA-Z0-9_\\.\\-]+@[a-zA-Z0-9_\\.\\-]+\\.[a-zA-Z]{2,5}$',
			hints: [
				'Los paréntesis con + después son innecesarios',
				'Elimina los grupos de captura que no uses',
				'Simplifica quitando los paréntesis'
			]
		},
		{
			id: 'fix-dangerous-2',
			title: 'Arregla el Parser CSV Vulnerable',
			description: 'Este patrón para parsear CSV puede causar catastrophic backtracking.',
			startingPattern: '^(.*,)*.*$',
			testCases: [
				{ input: 'campo1,campo2,campo3', shouldMatch: true },
				{ input: 'solo', shouldMatch: true },
				{ input: 'a,'.repeat(50) + 'X', shouldMatch: true }
			],
			solution: '^([^,]*,)*[^,]*$',
			hints: [
				'El .* es demasiado ambiguo',
				'Usa [^,]* para ser más específico',
				'Evita que el patrón pueda coincidir con la coma de múltiples formas'
			]
		}
	],

	quiz: [
		{
			question: '¿Cuál de estos patrones es más propenso a catastrophic backtracking?',
			options: [
				'(a+)+b',
				'a+b',
				'[a]+b',
				'a{1,10}b'
			],
			correct: 0,
			explanation: '(a+)+ crea anidación de cuantificadores, causando backtracking exponencial cuando no hay coincidencia.'
		},
		{
			question: '¿Cuál es la mejor forma de prevenir ReDoS?',
			options: [
				'Usar más grupos de captura',
				'Hacer el patrón más complejo',
				'Limitar el tamaño de entrada y usar timeouts',
				'Usar siempre el flag global'
			],
			correct: 2,
			explanation: 'Limitar el tamaño de entrada y usar timeouts son defensas efectivas contra ReDoS.'
		},
		{
			question: '¿Por qué [^,]* es más seguro que .* para parsear CSV?',
			options: [
				'Es más corto',
				'Es más específico y evita ambigüedad',
				'Captura más caracteres',
				'Funciona con el flag multiline'
			],
			correct: 1,
			explanation: '[^,]* es específico (todo excepto comas), evitando que el motor pruebe múltiples formas de coincidir.'
		}
	],

	highlights: [
		'Los cuantificadores anidados como (a+)+ pueden causar tiempo de ejecución exponencial',
		'ReDoS es un vector de ataque real que ha afectado a grandes empresas',
		'Usar character classes negadas [^x] es más seguro que .*',
		'Siempre implementa timeouts y límites de entrada',
		'A veces los métodos nativos de string son mejores que regex'
	],

	resources: [
		{
			title: 'OWASP ReDoS Prevention',
			url: 'https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS',
			type: 'guía'
		},
		{
			title: 'Cloudflare - Details of the Cloudflare outage',
			url: 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/',
			type: 'caso de estudio'
		},
		{
			title: 'Stack Overflow Postmortem',
			url: 'https://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016',
			type: 'postmortem'
		}
	]
};