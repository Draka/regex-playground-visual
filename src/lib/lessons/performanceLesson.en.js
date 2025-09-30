/**
 * Lesson 8: Performance and Optimization
 *
 * This lesson teaches how to write efficient regex:
 * - Understanding the internal regex engine
 * - Optimization techniques
 * - Benchmarking and profiling
 * - When to use regex vs string methods
 * - Performance best practices
 */

export const performanceLesson = {
	id: 'performance',
	title: 'Performance & Optimization - Fast Regex',
	description: 'Learn to write efficient regex, understand how the internal engine works, and when to use alternatives. Master optimization techniques to improve your application performance.',
	difficulty: 'advanced',
	estimatedTime: 35,
	category: 'optimization',
	prerequisites: ['dangerous-regex', 'groups'],
	steps: [
		{
			id: 'regex-engine-internals',
			title: 'The Regex Engine Inside Out',
			description: 'Understand how a regex engine works internally to write more efficient patterns.',
			content: `## How Does a Regex Engine Work?

### Types of Engines

**1. NFA (Non-deterministic Finite Automaton)**
- Used by: JavaScript, Python, Perl, Java
- Features:
  - Supports backreferences and lookarounds
  - Can be slow with backtracking
  - More flexible and powerful

**2. DFA (Deterministic Finite Automaton)**
- Used by: grep, awk, lex
- Features:
  - No backreference support
  - Always O(n) time
  - More limited but faster

### The Matching Process in JavaScript

\`\`\`javascript
// When you execute:
const regex = /ab+c/;
const result = regex.test("abbbbc");

// The engine does this:
// 1. COMPILATION: Converts /ab+c/ into an automaton
// 2. SEARCH: Traverses the string character by character
// 3. MATCHING: Tries to match from each position
// 4. BACKTRACKING: If it fails, backtracks and tries another path
\`\`\`

### Process Visualization

\`\`\`
Pattern: /a(b|c)+d/
String: "abcbcd"

Position 0: a✓ b✓ c✓ b✓ c✓ d✓ → MATCH
            ↑
            The engine tries each alternative (b|c)
            and remembers decisions for backtracking
\`\`\`

### Why Does It Matter?

Understanding the engine helps you:
- Predict pattern performance
- Avoid unnecessary backtracking
- Write regex the engine can optimize
- Choose the right tool for each job`,
			pattern: 'a(b|c)+d',
			testText: 'abcbcd',
			expectedMatches: 1,
			flags: '',
			hint: 'The engine tries each alternative in order',
			benchmarkData: {
				compilationTime: 0.05,
				executionTime: 0.01,
				backtrackingSteps: 3
			}
		},
		{
			id: 'compilation-vs-execution',
			title: 'Compilation vs Execution - The Hidden Cost',
			description: 'Learn the difference between compiling and executing regex, and how to optimize both.',
			content: `## The Cost of Compilation

### ⚠️ Common Mistake: Recompiling in Loops

\`\`\`javascript
// ❌ BAD: Compiles regex on each iteration
function findEmails(texts) {
    const results = [];
    for (const text of texts) {
        // This compiles the regex 1000 times!
        if (/\\b[\\w.-]+@[\\w.-]+\\.\\w+\\b/.test(text)) {
            results.push(text);
        }
    }
    return results;
}

// ✅ GOOD: Compile once, use many times
function findEmailsOptimized(texts) {
    const emailRegex = /\\b[\\w.-]+@[\\w.-]+\\.\\w+\\b/;
    const results = [];

    for (const text of texts) {
        // Use the precompiled regex
        if (emailRegex.test(text)) {
            results.push(text);
        }
    }
    return results;
}
\`\`\`

### Real Benchmark

\`\`\`javascript
// Measuring the impact
const texts = Array(10000).fill("test@email.com");

console.time("With recompilation");
findEmails(texts);
console.timeEnd("With recompilation");
// Result: ~150ms

console.time("Precompiled");
findEmailsOptimized(texts);
console.timeEnd("Precompiled");
// Result: ~20ms (7.5x faster!)
\`\`\`

### Regex Literals vs Constructor

\`\`\`javascript
// Literal: Compiled at parse time
const literal = /pattern/g;  // Faster

// Constructor: Compiled at runtime
const constructed = new RegExp("pattern", "g");  // Slower

// Use constructor only when pattern is dynamic
function createRegex(userInput) {
    return new RegExp(userInput, "gi");
}
\`\`\`

### Regex Caching

\`\`\`javascript
// Cache for dynamic patterns
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
			testText: 'contact@example.com and sales@shop.net are emails',
			expectedMatches: 2,
			flags: 'g',
			hint: 'Precompile your regex outside of loops',
			benchmarkData: {
				compilationTime: 0.5,
				executionTime: 0.02,
				improvement: '7.5x with precompilation'
			}
		},
		{
			id: 'anchoring-optimization',
			title: 'Anchoring - Your Performance Best Friend',
			description: 'Discover how anchors can dramatically improve performance.',
			content: `## The Power of Anchoring

### Without Anchoring: The Engine Searches Everywhere

\`\`\`javascript
// ❌ UNANCHORED: Searches at every position
const slow = /\\d{3}-\\d{4}/;

// In "abc123-4567xyz", the engine tries:
// Position 0: a → fails
// Position 1: b → fails
// Position 2: c → fails
// Position 3: 1 → continues...
// ... tries at EVERY position
\`\`\`

### With Anchoring: Directed Search

\`\`\`javascript
// ✅ ANCHORED TO START
const fast = /^\\d{3}-\\d{4}/;
// Only tries at position 0

// ✅ ANCHORED TO END
const fastEnd = /\\d{3}-\\d{4}$/;
// Only tries where it can end

// ✅ FULLY ANCHORED
const fastest = /^\\d{3}-\\d{4}$/;
// Single check only
\`\`\`

### Anchoring Benchmark

\`\`\`javascript
const text = "x".repeat(1000) + "123-4567";

// Unanchored: ~500 μs (searches at 1000+ positions)
/\\d{3}-\\d{4}/.test(text);

// Anchored to end: ~5 μs (100x faster!)
/\\d{3}-\\d{4}$/.test(text);
\`\`\`

### Word Boundaries (\\b)

\`\`\`javascript
// \\b is a word anchor
const wordRegex = /\\bcat\\b/;

// More efficient than:
const slowRegex = /(?<!\\w)cat(?!\\w)/;

// \\b doesn't consume characters (zero-width)
"The cat sat" // \\b matches before 'c' and after 't'
\`\`\`

### When to Use Anchoring

**Always anchor when:**
- Validating complete format (emails, URLs)
- Searching at start/end of string
- Verifying exact structure

**Don't anchor when:**
- Searching within text
- Extracting multiple matches
- Pattern can appear anywhere`,
			pattern: '^\\d{3}-\\d{4}$',
			testText: '123-4567',
			expectedMatches: 1,
			flags: '',
			hint: 'Anchors eliminate unnecessary searches',
			benchmarkData: {
				withoutAnchors: '500μs',
				withAnchors: '5μs',
				improvement: '100x faster'
			}
		},
		{
			id: 'greedy-vs-lazy',
			title: 'Greedy vs Lazy - The Performance Dilemma',
			description: 'Understand when to use greedy vs lazy quantifiers to optimize.',
			content: `## Greedy vs Lazy: Which is Faster?

### Greedy Behavior (Default)

\`\`\`javascript
// Greedy: Takes everything possible, then backtracks
const greedy = /".*"/;

// With: "hello" and "world"
// 1. .* captures: hello" and "world
// 2. Can't find final "
// 3. Backtrack: hello" and "worl
// 4. Backtrack: hello" and "wor
// ... many backtracking steps
\`\`\`

### Lazy Behavior

\`\`\`javascript
// Lazy: Takes minimum, then advances
const lazy = /".*?"/;

// With: "hello" and "world"
// 1. .*? captures: (nothing)
// 2. Advances: h
// 3. Advances: he
// ... until finding "
\`\`\`

### Which is Better?

\`\`\`javascript
// For short strings: LAZY is usually better
const html = '<div>content</div>';
/<.*?>/.exec(html);  // Lazy: 5 steps
/<.*>/.exec(html);   // Greedy: 15 steps + backtrack

// For long strings: IT DEPENDS
const longText = '<' + 'a'.repeat(1000) + '>';
/<.*?>/.exec(longText);  // Lazy: 1000 steps
/<.*>/.exec(longText);   // Greedy: 1 step!
\`\`\`

### The Best Solution: Character Classes

\`\`\`javascript
// ❌ LAZY (multiple steps)
const lazy = /".*?"/;

// ❌ GREEDY (backtracking)
const greedy = /".*"/;

// ✅ OPTIMAL (no backtracking)
const optimal = /"[^"]*"/;

// Benchmark with 100 quoted strings:
// Lazy: ~50μs
// Greedy: ~80μs
// Character class: ~10μs ← 5x faster!
\`\`\`

### Golden Rule

> "If you can use a negated character class [^x]*,
> it's almost always better than .* or .*?"

**Common cases:**
- Quoted strings: \`"[^"]*"\`
- HTML tags: \`<[^>]*>\`
- Until delimiter: \`[^,]*\`
- Words: \`[^\\s]+\``,
			pattern: '"[^"]*"',
			testText: 'He said "hello world" and she replied "goodbye"',
			expectedMatches: 2,
			flags: 'g',
			hint: 'Character classes are more efficient than .* or .*?',
			benchmarkData: {
				greedy: '80μs',
				lazy: '50μs',
				characterClass: '10μs',
				winner: 'Character class (5x faster)'
			}
		},
		{
			id: 'alternation-order',
			title: 'Alternation Order - Most Likely First',
			description: 'Optimize the order of alternatives to improve average performance.',
			content: `## Order Matters in Alternations

### The Engine Tries Left to Right

\`\`\`javascript
// The engine tries IN ORDER
const regex = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;

// If the text is "sunday":
// 1. Tries "monday" → fails
// 2. Tries "tuesday" → fails
// 3. Tries "wednesday" → fails
// 4. Tries "thursday" → fails
// 5. Tries "friday" → fails
// 6. Tries "saturday" → fails
// 7. Tries "sunday" → success!
\`\`\`

### Optimization by Frequency

\`\`\`javascript
// ❌ RANDOM ORDER
const slowFileExt = /\\.(doc|xls|ppt|txt|jpg|png|pdf|html|js|css)$/;

// ✅ ORDERED BY FREQUENCY (most common first)
const fastFileExt = /\\.(js|css|html|jpg|png|pdf|txt|doc|xls|ppt)$/;

// In a typical web project:
// - 40% .js/.css files
// - 30% .jpg/.png images
// - 20% .html
// - 10% others
\`\`\`

### Real Case: Browser Detection

\`\`\`javascript
// ❌ INEFFICIENT (Chrome is 65% of traffic but last)
const slowBrowser = /(Firefox|Safari|Edge|Chrome)/;

// ✅ OPTIMIZED (Chrome first)
const fastBrowser = /(Chrome|Firefox|Safari|Edge)/;

// Impact on 10,000 user agents:
// Slow: ~250ms
// Fast: ~100ms (2.5x faster)
\`\`\`

### Technique: Trie-like Optimization

\`\`\`javascript
// ❌ MULTIPLE COMPARISONS
const keywords = /\\b(function|for|foreach|format|form)\\b/;

// ✅ GROUPED BY COMMON PREFIX
const optimized = /\\b(f(unction|or(each|mat)?|orm))\\b/;

// Reduces comparisons when there are common prefixes
\`\`\`

### Frequency Analysis Tool

\`\`\`javascript
// Analyze frequency to optimize order
function analyzeFrequency(texts, alternatives) {
    const counts = {};
    alternatives.forEach(alt => counts[alt] = 0);

    texts.forEach(text => {
        alternatives.forEach(alt => {
            if (text.includes(alt)) counts[alt]++;
        });
    });

    // Sort by descending frequency
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([alt]) => alt);
}

// Usage
const optimizedOrder = analyzeFrequency(
    userAgents,
    ['Chrome', 'Firefox', 'Safari', 'Edge']
);
// Result: ['Chrome', 'Firefox', 'Safari', 'Edge']
\`\`\``,
			pattern: '\\.(js|css|html|jpg|png)$',
			testText: 'file.js',
			expectedMatches: 1,
			flags: '',
			hint: 'Put most frequent alternatives first',
			benchmarkData: {
				worstCase: '5 comparisons for .png',
				bestCase: '1 comparison for .js',
				avgCase: '2.3 comparisons'
			}
		},
		{
			id: 'string-methods-vs-regex',
			title: 'Regex vs String Methods - Choose Wisely',
			description: 'Learn when it\'s better to use native string methods instead of regex.',
			content: `## When NOT to Use Regex?

### String Methods Are Faster for Simple Cases

\`\`\`javascript
// ❌ UNNECESSARY REGEX
if (/^hello/.test(str)) { }
if (/world$/.test(str)) { }
if (/test/.test(str)) { }

// ✅ NATIVE METHODS (2-10x faster)
if (str.startsWith('hello')) { }
if (str.endsWith('world')) { }
if (str.includes('test')) { }
\`\`\`

### Comparative Benchmark

\`\`\`javascript
const text = "Hello, this is a test string for benchmarking";

// Simple substring search
console.time('includes');
for (let i = 0; i < 1000000; i++) {
    text.includes('test');
}
console.timeEnd('includes'); // ~15ms

console.time('regex');
for (let i = 0; i < 1000000; i++) {
    /test/.test(text);
}
console.timeEnd('regex'); // ~45ms (3x slower)
\`\`\`

### When to Use Each

**USE STRING METHODS for:**
\`\`\`javascript
// Exact search
str.includes('exact')

// Start/end
str.startsWith('prefix')
str.endsWith('suffix')

// Simple replacement
str.replace('old', 'new')  // First occurrence
str.replaceAll('old', 'new')  // All (ES2021)

// Simple split
str.split(',')

// Case conversion
str.toLowerCase()
str.toUpperCase()
\`\`\`

**USE REGEX for:**
\`\`\`javascript
// Complex patterns
/\\b\\w+@\\w+\\.\\w+\\b/  // Emails

// Multiple conditions
/cat|dog|bird/  // Any of these

// Format validation
/^\\d{3}-\\d{3}-\\d{4}$/  // Phone

// Group extraction
/(\\d{2})\\/(\\d{2})\\/(\\d{4})/  // Date

// Complex replacement
str.replace(/\\s+/g, ' ')  // Multiple spaces
\`\`\`

### Quick Decision Table

| Operation | String Method | Regex | Winner |
|-----------|--------------|-------|---------|
| Exact text search | includes() | /text/ | String |
| Check start | startsWith() | /^text/ | String |
| Check end | endsWith() | /text$/ | String |
| Pattern search | ❌ | /\\d+/ | Regex |
| Format validation | ❌ | /^....$/ | Regex |
| Multiple options | ❌ | /(a\|b\|c)/ | Regex |`,
			pattern: 'test',
			testText: 'This is a test of performance',
			expectedMatches: 1,
			flags: '',
			hint: 'For simple searches, includes() is faster',
			benchmarkData: {
				stringMethod: '15ms per million',
				regexMethod: '45ms per million',
				winner: 'String method (3x faster)'
			}
		},
		{
			id: 'optimization-techniques',
			title: 'Advanced Optimization Techniques',
			description: 'Master professional techniques to write ultra-fast regex.',
			content: `## Pro Optimization Techniques

### 1. Atomic Groups (When Available)

\`\`\`javascript
// Atomic groups prevent backtracking
// JavaScript doesn't support them natively, but you can simulate:

// Instead of:
/(\\d+)+b/  // Catastrophic backtracking

// Use:
/(?=(\\d+))\\1+b/  // Simulates atomic group with lookahead
\`\`\`

### 2. Unrolling the Loop

\`\`\`javascript
// ❌ SIMPLE LOOP (more backtracking)
const quoted = /"(?:[^"\\\\]|\\\\.)*"/;

// ✅ UNROLLED LOOP (less backtracking)
const unrolled = /"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"/;

// The unrolled pattern:
// 1. Captures all normal [^"\\\\]*
// 2. Only processes escapes when necessary
// 3. 30-50% faster on long strings
\`\`\`

### 3. Possessive Quantifiers (Simulated)

\`\`\`javascript
// JavaScript doesn't have possessive quantifiers (++, *+)
// But you can simulate them:

// Instead of: \\d++ (doesn't exist in JS)
// Use lookahead:
/(?=(\\d+))\\1/

// This "possesses" the digits without backtracking
\`\`\`

### 4. Branch Reset Pattern

\`\`\`javascript
// When you have multiple similar branches:

// ❌ REPETITIVE
/(jpg|jpeg|png|gif|bmp|webp)$/i

// ✅ OPTIMIZED with common prefixes
/\\.(?:jpe?g|png|gif|bmp|webp)$/i

// Groups common prefixes to reduce comparisons
\`\`\`

### 5. Precompilation and Flags

\`\`\`javascript
// Flag performance impact:

// No flags: Fastest
/pattern/

// Flag 'i': ~10% slower (case conversion)
/pattern/i

// Flag 'g': ~5% overhead (global state)
/pattern/g

// Flag 'm': Minimal impact
/pattern/m

// Use flags only when necessary
\`\`\`

### 6. "Anchor First" Technique

\`\`\`javascript
// Put most restrictive conditions first

// ❌ LESS EFFICIENT
/.*\\.js$/  // First .*, then check .js

// ✅ MORE EFFICIENT
/\\.js$/  // Check end directly

// If you need to capture everything:
/^(.*\\.js)$/  // Anchor first, capture after
\`\`\`

### Optimization Checklist

- [ ] Can I use a string method instead?
- [ ] Is the regex precompiled outside the loop?
- [ ] Can I add anchors (^, $, \\b)?
- [ ] Can I use character classes [^x]* instead of .*?
- [ ] Are alternatives ordered by frequency?
- [ ] Can I eliminate unnecessary captures with (?:)?
- [ ] Have I limited quantifiers {n,m}?
- [ ] Have I tested performance with real data?`,
			pattern: '"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"',
			testText: '"This is a \\"string\\" with escapes"',
			expectedMatches: 1,
			flags: '',
			hint: 'Loop unrolling reduces backtracking',
			benchmarkData: {
				simple: '100μs',
				unrolled: '65μs',
				improvement: '35% faster'
			}
		},
		{
			id: 'profiling-tools',
			title: 'Profiling Tools - Measure, Don\'t Guess',
			description: 'Learn to use tools to measure and optimize your regex performance.',
			content: `## Profiling and Analysis Tools

### 1. Basic Measurement with console.time

\`\`\`javascript
// Simple measurement
const testString = "test".repeat(10000);

console.time('regex1');
/test/g.exec(testString);
console.timeEnd('regex1');

console.time('regex2');
testString.match(/test/g);
console.timeEnd('regex2');
\`\`\`

### 2. Performance API for Precision

\`\`\`javascript
class RegexProfiler {
    constructor() {
        this.results = [];
    }

    profile(name, regex, text, iterations = 1000) {
        const start = performance.now();

        for (let i = 0; i < iterations; i++) {
            regex.test(text);
            regex.lastIndex = 0; // Reset for regex with 'g' flag
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

        // Find fastest
        const fastest = this.results.reduce((min, r) =>
            r.avgTime < min.avgTime ? r : min
        );

        // Calculate relative improvements
        this.results.forEach(r => {
            if (r !== fastest) {
                const improvement = ((r.avgTime / fastest.avgTime - 1) * 100).toFixed(1);
                console.log(\`\${r.name} is \${improvement}% slower than \${fastest.name}\`);
            }
        });
    }
}

// Usage
const profiler = new RegexProfiler();

profiler
    .profile('Greedy', /".+"/, '"hello" and "world"')
    .profile('Lazy', /".+?"/, '"hello" and "world"')
    .profile('CharClass', /"[^"]+"/, '"hello" and "world"')
    .compare();
\`\`\`

### 3. Online Tools

**regex101.com - Visual Debugger**
- Steps counter
- Step-by-step debugger
- Explanation of each step
- Performance warnings

**regexpal.com - Quick Testing**
- Real-time highlighting
- No compilation overhead

**regexr.com - Detailed Analysis**
- Performance timeline
- Match heatmap

### 4. Node.js Advanced Profiling

\`\`\`javascript
// For Node.js: use --prof flag
// node --prof regex-script.js

// Then process the log:
// node --prof-process isolate-0xnnnnnnnnnnnn-v8.log

// Or use inspector:
// node --inspect regex-script.js
// Open chrome://inspect
\`\`\`

### 5. Complete Benchmark Suite

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
                // Measure compilation
                const compileStart = performance.now();
                const compiled = new RegExp(regex.source, regex.flags);
                results[name].compile += performance.now() - compileStart;

                // Measure execution
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

### Key Metrics to Measure

1. **Compilation Time**: Critical if creating regex dynamically
2. **First Match Time**: For .test() and .search()
3. **Total Extraction Time**: For .match() and .matchAll()
4. **Backtracking Steps**: Efficiency indicator
5. **Memory Usage**: For patterns with many captures`,
			pattern: '\\b\\w+@\\w+\\.\\w{2,4}\\b',
			testText: 'Contact info@example.com or sales@shop.es',
			expectedMatches: 2,
			flags: 'g',
			hint: 'Always measure performance with real data',
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
			title: 'Optimize the Email Validator',
			description: 'This email validator works but is slow. Can you optimize it?',
			startingPattern: '.*@.*\\..+',
			testCases: [
				{ input: 'user@example.com', shouldMatch: true },
				{ input: 'test.email@domain.co.uk', shouldMatch: true },
				{ input: 'not-an-email', shouldMatch: false },
				{ input: '@invalid.com', shouldMatch: false }
			],
			solution: '^[^@]+@[^@]+\\.[^@]+$',
			hints: [
				'.* is slow, use character classes',
				'Add anchors to avoid unnecessary searches',
				'Use [^@]+ instead of .*'
			]
		},
		{
			id: 'optimize-html-tags',
			title: 'Improve the HTML Tag Parser',
			description: 'This pattern finds HTML tags but has performance issues.',
			startingPattern: '<.*>',
			testCases: [
				{ input: '<div>', shouldMatch: true },
				{ input: '<span class="test">', shouldMatch: true },
				{ input: 'not a tag', shouldMatch: false },
				{ input: '<p>text</p>', shouldMatch: true }
			],
			solution: '<[^>]+>',
			hints: [
				'.* is greedy and causes backtracking',
				'Use [^>]+ to be more specific',
				'You don\'t need lazy quantifier here'
			]
		}
	],

	quiz: [
		{
			question: 'Which is generally faster for exact text search?',
			options: [
				'regex.test()',
				'string.includes()',
				'regex.exec()',
				'They are equal'
			],
			correct: 1,
			explanation: 'string.includes() is 2-3x faster for exact searches because it doesn\'t need to compile a pattern.'
		},
		{
			question: 'Which technique reduces backtracking the most?',
			options: [
				'Using more capture groups',
				'Using negated character classes [^x]',
				'Using multiple .*',
				'Using global flags'
			],
			correct: 1,
			explanation: 'Negated character classes [^x] are specific and don\'t require backtracking like .*'
		},
		{
			question: 'When should you precompile a regex?',
			options: [
				'Never, JavaScript does it automatically',
				'Only with complex patterns',
				'When you use it multiple times',
				'Only with RegExp constructor'
			],
			correct: 2,
			explanation: 'Precompile regex you use multiple times to avoid recompilation, especially in loops.'
		},
		{
			question: 'Which flag has the biggest performance impact?',
			options: [
				'g (global)',
				'i (case insensitive)',
				'm (multiline)',
				's (dotall)'
			],
			correct: 1,
			explanation: 'The "i" flag requires case conversion, adding ~10% overhead.'
		}
	],

	highlights: [
		'Precompiling regex outside loops can improve performance 7x',
		'Anchors (^, $) can make a regex 100x faster',
		'Character classes [^x] are almost always better than .* or .*?',
		'For simple searches, string methods are 2-3x faster',
		'Alternation order should be based on frequency of occurrence'
	],

	resources: [
		{
			title: 'regex101.com - Debugger & Profiler',
			url: 'https://regex101.com/',
			type: 'tool'
		},
		{
			title: 'Mastering Regular Expressions (Book)',
			url: 'https://www.oreilly.com/library/view/mastering-regular-expressions/0596528124/',
			type: 'book'
		},
		{
			title: 'V8 Regex Performance',
			url: 'https://v8.dev/blog/regexp-tier-up',
			type: 'article'
		}
	]
};