/**
 * Lesson 7: Dangerous Regex - Avoiding Pitfalls
 *
 * This lesson teaches about the dangers of poorly designed regex:
 * - Catastrophic Backtracking
 * - ReDoS (Regex Denial of Service)
 * - Memory Exhaustion
 * - Inefficient patterns
 * - Security best practices
 */

export const dangerousLesson = {
	id: 'dangerous-regex',
	title: 'Dangerous Regex - Avoiding Pitfalls',
	description: 'Learn to identify and avoid regex that can break applications. Discover the dangers of catastrophic backtracking, ReDoS, and how to write safe and efficient patterns.',
	difficulty: 'advanced',
	estimatedTime: 30,
	category: 'security',
	prerequisites: ['groups', 'quantifiers'],
	steps: [
		{
			id: 'catastrophic-backtracking',
			title: 'Catastrophic Backtracking - The Hidden Danger',
			description: 'When a regex can take millions of paths to try to match, performance degrades exponentially.',
			content: `## The Catastrophic Backtracking Problem

Imagine your regex is like an explorer in a maze. With poorly designed patterns,
the explorer can take **billions** of paths before giving up.

### Dangerous Example:
\`\`\`javascript
// ⚠️ DANGER: This pattern is vulnerable
const badRegex = /(a+)+b/;

// With this input, the regex hangs:
const input = "aaaaaaaaaaaaaaaaaaaaaaaa!"; // No 'b' at the end

// The engine tries all possible combinations:
// (a)(a)(a)(a)...
// (aa)(a)(a)...
// (a)(aa)(a)...
// (aaa)(a)...
// ... millions of combinations
\`\`\`

### Why Does It Happen?
Nested quantifiers like \`(a+)+\`, \`(a*)*\`, or \`(a+)*\` create ambiguity.
The engine doesn't know how many characters each group should capture, so it tries ALL combinations.

### Execution Time:
- 10 characters: ~1 ms
- 20 characters: ~1 second
- 30 characters: ~17 minutes
- 40 characters: ~11 days 😱

The time grows exponentially!`,
			pattern: '(a+)+b',
			testText: 'aaaaaaaab',
			expectedMatches: 1,
			flags: '',
			hint: 'This pattern is safe with "b" at the end, but dangerous without it',
			dangerLevel: 'critical',
			safeAlternative: 'a+b',
			explanation: 'The pattern (a+)+ creates exponential backtracking. Use a+b instead.'
		},
		{
			id: 'redos-attack',
			title: 'ReDoS - Denial of Service Attacks',
			description: 'Attackers can use vulnerable regex to completely freeze your application.',
			content: `## ReDoS: Regex Denial of Service

An attacker can send specially crafted data to exploit vulnerable regex
and make your server run out of resources.

### Real Case: Stack Overflow (2016)
\`\`\`javascript
// Vulnerable regex used in Stack Overflow
const regex = /^(a+)+$/;

// Attack: String without final match
const attack = "a".repeat(100) + "X";
// The server hangs processing this
\`\`\`

### Common Vulnerable Patterns:

1. **Nested Repetition**
   - \`(a+)*\`
   - \`(a*)+\`
   - \`(a+)+\`

2. **Overlapping Alternatives**
   - \`(a|ab)*\`
   - \`(a|a)*\`

3. **Repeated Optional Suffixes**
   - \`(a+)+b\`
   - \`([a-z]+)*@\`

### Real Impact:
- **Cloudflare (2019)**: 27 minutes of global outage
- **Stack Overflow (2016)**: 34 minutes offline
- **npm (2018)**: Multiple vulnerable packages

### How to Protect Yourself:
1. Use timeouts on regex execution
2. Validate maximum input length
3. Use static analysis tools
4. Prefer string methods when possible`,
			pattern: '(.*,){11}P',
			testText: '1,2,3,4,5,6,7,8,9,10,11,P',
			expectedMatches: 1,
			flags: '',
			hint: 'This pattern looks for 11 commas followed by P, but is vulnerable to ReDoS',
			dangerLevel: 'high',
			safeAlternative: '(?:[^,]*,){11}P',
			explanation: 'Using .* with repetition creates vulnerability. [^,]* is more specific and safe.'
		},
		{
			id: 'memory-exhaustion',
			title: 'Memory Exhaustion - The Silent Killer',
			description: 'Some patterns can consume gigabytes of memory, crashing your application.',
			content: `## Memory-Devouring Patterns

Certain regex can make your application consume all available memory.

### Excessive Capture Groups
\`\`\`javascript
// ⚠️ BAD: Creates thousands of capture groups
const badRegex = /((((((((((.*)))))))))) /g;

// On large text, this can use GB of memory
const hugeText = "a".repeat(1000000);
badRegex.exec(hugeText); // 💥 Possible crash
\`\`\`

### Nested Lookaheads
\`\`\`javascript
// ⚠️ DANGEROUS: Complex lookaheads
const complex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{8,}/;

// With malicious input, consumes lots of memory
const malicious = "Aa1!".repeat(10000);
\`\`\`

### Unlimited Quantifiers
\`\`\`javascript
// ⚠️ RISKY: No upper limit
const noLimit = /\w{1000,}/g;

// vs

// ✅ BETTER: With reasonable limit
const withLimit = /\w{1000,5000}/g;
\`\`\`

### Best Practices:
1. **Limit quantifiers**: Use \`{n,m}\` instead of \`{n,}\`
2. **Avoid unnecessary captures**: Use \`(?:...)\` for non-capturing groups
3. **Simplify lookaheads**: Combine them when possible
4. **Set input limits**: Validate size before applying regex`,
			pattern: '(\\w+\\s?){1,100}',
			testText: 'This is a normal text with words and spaces',
			expectedMatches: 1,
			flags: '',
			hint: 'This pattern is safe with limit, but without it could consume lots of memory',
			dangerLevel: 'medium',
			safeAlternative: '\\w+(?:\\s+\\w+){0,99}',
			explanation: 'Limiting repetitions and being specific prevents memory exhaustion.'
		},
		{
			id: 'common-vulnerable-patterns',
			title: 'Common Vulnerable Patterns',
			description: 'Learn to identify and fix the most frequent dangerous patterns.',
			content: `## Gallery of Dangerous Patterns

### 1. Vulnerable Email Validation
\`\`\`javascript
// ⚠️ VULNERABLE
const badEmail = /^([a-zA-Z0-9_\\.\\-])+@([a-zA-Z0-9_\\.\\-])+\\.([a-zA-Z]{2,5})$/;

// ✅ SAFE
const safeEmail = /^[a-zA-Z0-9_\\.\\-]+@[a-zA-Z0-9_\\.\\-]+\\.[a-zA-Z]{2,5}$/;
\`\`\`

### 2. Dangerous URL Parsing
\`\`\`javascript
// ⚠️ VULNERABLE: Multiple .*
const badUrl = /^(https?:\\/\\/)?.*(www\\.)?.*/;

// ✅ SAFE: More specific
const safeUrl = /^https?:\\/\\/[^\\s\\/$.?#].[^\\s]*$/;
\`\`\`

### 3. Risky HTML Tag Matching
\`\`\`javascript
// ⚠️ VULNERABLE: Greedy with HTML
const badHtml = /<.*>/;

// ✅ SAFE: Lazy quantifier
const safeHtml = /<.*?>/;

// ✅ BETTER: No dots
const betterHtml = /<[^>]*>/;
\`\`\`

### 4. Problematic CSV Parsing
\`\`\`javascript
// ⚠️ VULNERABLE
const badCsv = /^(.*,)*.*$/;

// ✅ SAFE
const safeCsv = /^([^,]*,)*[^,]*$/;
\`\`\`

### Red Flags 🚩
- Nested quantifiers: \`(x+)+\`, \`(x*)*\`
- Overlapping alternatives: \`(a|ab)*\`
- Multiple \`.*\` in the same pattern
- Complex lookaheads/lookbehinds
- Excessive capture groups`,
			pattern: '^([^,]*,){3}[^,]*$',
			testText: 'one,two,three,four',
			expectedMatches: 1,
			flags: '',
			hint: 'Safe pattern for parsing CSV with exactly 4 fields',
			dangerLevel: 'safe',
			safeAlternative: 'Already safe',
			explanation: 'Using [^,]* is safer than .* for CSV parsing.'
		},
		{
			id: 'performance-testing',
			title: 'Performance Testing - Measure Before Deploy',
			description: 'Learn to detect performance issues before they reach production.',
			content: `## Tools to Detect Dangerous Regex

### 1. Static Analysis
\`\`\`javascript
// Function to detect dangerous patterns
function isDangerousRegex(pattern) {
    const dangerous = [
        /\\([^)]*[+*]\\)[+*]/,  // (x+)+ or (x*)*
        /\\([^)|]*\\|[^)]*\\)[+*]/, // (a|b)*
        /\\.\\*.*\\.\\*/,          // Multiple .*
    ];

    return dangerous.some(d => d.test(pattern));
}

// Usage
isDangerousRegex("(a+)+b");  // true - Dangerous!
isDangerousRegex("a+b");     // false - Safe
\`\`\`

### 2. Performance Benchmark
\`\`\`javascript
function benchmarkRegex(regex, testStrings) {
    const results = [];

    for (const str of testStrings) {
        const start = performance.now();

        // Safety timeout
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

### 3. Test Case Generation
\`\`\`javascript
// Generate strings that can cause backtracking
function generateEvilString(baseChar, length, suffix = "X") {
    return baseChar.repeat(length) + suffix;
}

// Test with different lengths
const testCases = [10, 20, 30, 40].map(n =>
    generateEvilString("a", n, "!")
);
\`\`\`

### Recommended Tools:
- **safe-regex**: npm detector
- **rxxr2**: Online analyzer
- **regex101**: Includes debugger
- **redos-checker**: ReDoS validator`,
			pattern: '^[a-zA-Z0-9]+$',
			testText: 'SafeString123',
			expectedMatches: 1,
			flags: '',
			hint: 'Simple and safe pattern for alphanumeric validation',
			dangerLevel: 'safe',
			safeAlternative: 'Already optimal',
			explanation: 'Simple patterns without nesting are the safest and fastest.'
		},
		{
			id: 'safe-alternatives',
			title: 'Safe Alternatives - The Solution',
			description: 'Learn to rewrite dangerous patterns in a safe and efficient way.',
			content: `## Transforming Dangerous Patterns into Safe Ones

### Technique 1: Remove Nesting
\`\`\`javascript
// ⚠️ DANGEROUS
const dangerous = /(x+)+y/;

// ✅ SAFE: Simplify
const safe = /x+y/;

// If you need to capture groups:
// ⚠️ DANGEROUS
const dangerousGroups = /(\\w+\\s*)+/;

// ✅ SAFE: Atomic grouping (when available)
const safeGroups = /(?:\\w+\\s*)*/;
\`\`\`

### Technique 2: Use Negation Instead of .*
\`\`\`javascript
// ⚠️ SLOW: Greedy dot
const slow = /<.*>/;

// ✅ FAST: Negated character class
const fast = /<[^>]*>/;

// More examples:
// Quoted strings
const quoted = /"[^"]*"/;  // Better than /".*?"/

// Until next space
const word = /[^\\s]+/;    // Better than /.*?\\s/
\`\`\`

### Technique 3: Anchor When Possible
\`\`\`javascript
// ⚠️ UNANCHORED: Searches entire string
const unanchored = /\\d{3}-\\d{4}/;

// ✅ ANCHORED: More efficient
const anchored = /^\\d{3}-\\d{4}$/;

// Partially anchored also helps
const startAnchored = /^\\d{3}-\\d{4}/;
\`\`\`

### Technique 4: Limit Quantifiers
\`\`\`javascript
// ⚠️ UNLIMITED
const unlimited = /\\w+/;

// ✅ WITH REASONABLE LIMIT
const limited = /\\w{1,100}/;

// For passwords
const password = /^.{8,128}$/; // Maximum limit
\`\`\`

### Technique 5: Prefer String Methods
\`\`\`javascript
// Sometimes you don't need regex

// Instead of:
if (/^hello/.test(str)) { }

// Use:
if (str.startsWith("hello")) { }

// Instead of:
str.replace(/\\s+/g, " ");

// Consider:
str.split(/\\s+/).join(" ");
\`\`\``,
			pattern: '^[^@]+@[^@]+\\.[^@]+$',
			testText: 'user@example.com',
			expectedMatches: 1,
			flags: '',
			hint: 'Safe email validation using negation',
			dangerLevel: 'safe',
			safeAlternative: 'Already safe and efficient',
			explanation: 'Using [^@]+ is safer than .* for email validation.'
		},
		{
			id: 'real-world-fixes',
			title: 'Real-World Cases and Solutions',
			description: 'Examples of real vulnerabilities found in production and how they were fixed.',
			content: `## Real ReDoS Cases in Production

### Case 1: Whitespace Validation (OWASP)
\`\`\`javascript
// ⚠️ VULNERABLE: Used in multiple frameworks
const trimRegex = /^[\\s\\t\\r\\n]*(.*?)[\\s\\t\\r\\n]*$/;

// Problem: "\\t".repeat(50000) causes timeout

// ✅ SOLUTION: Use native trim()
const trimmed = str.trim();
\`\`\`

### Case 2: Markdown Parser (marked.js)
\`\`\`javascript
// ⚠️ VULNERABLE: CVE-2022-21680
const linkRegex = /^!?\\[([^\\[\\]\\\\]|\\\\.)*\\]/;

// Attack: "[".repeat(50000)

// ✅ SOLUTION: Limit depth
const safeLinkRegex = /^!?\\[([^\\[\\]\\\\]|\\\\.){0,1000}\\]/;
\`\`\`

### Case 3: User-Agent Parser
\`\`\`javascript
// ⚠️ VULNERABLE: ua-parser-js
const osRegex = /(windows|mac|linux).*(\\d+\\.\\d+).*/i;

// ✅ SOLUTION: More specific
const safeOsRegex = /^[^(]*\\(([^)]+)\\)/;
// Then parse the parenthesis content
\`\`\`

### Case 4: URL Validation (validator.js)
\`\`\`javascript
// ⚠️ VULNERABLE: Old versions
const urlRegex = /^(?:(?:https?|ftp):\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!10(?:\\.\\d{1,3}){3})(?!127(?:\\.\\d{1,3}){3})(?!169\\.254(?:\\.\\d{1,3}){2})(?!192\\.168(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:\\/[^\\s]*)?$/i;

// ✅ SOLUTION: Use URL constructor
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
\`\`\`

### Lessons Learned:
1. **Complex regex is risky**: Simplify whenever possible
2. **Use native APIs**: URL, trim(), startsWith() are safer
3. **Update dependencies**: Many CVEs are due to vulnerable regex
4. **Audit regularly**: Use security tools`,
			pattern: '^\\S+@\\S+\\.\\S+$',
			testText: 'safe@email.com',
			expectedMatches: 1,
			flags: '',
			hint: 'Super simple but safe email validation',
			dangerLevel: 'safe',
			safeAlternative: 'Simple and safe',
			explanation: 'Sometimes simplicity is the best defense against ReDoS.'
		},
		{
			id: 'best-practices',
			title: 'Security Best Practices',
			description: 'Complete guide to writing safe regex and keeping your application protected.',
			content: `## The Definitive Guide to Safe Regex

### 🛡️ Security Principles

#### 1. Defense in Depth
\`\`\`javascript
// Multiple layers of protection
function safeRegexMatch(pattern, input, maxLength = 10000) {
    // Layer 1: Limit length
    if (input.length > maxLength) {
        throw new Error("Input too long");
    }

    // Layer 2: Timeout
    const start = Date.now();
    const timeout = 1000; // 1 second maximum

    // Layer 3: Try-catch
    try {
        const regex = new RegExp(pattern);

        // Layer 4: Check complexity
        if (isDangerousPattern(pattern)) {
            console.warn("Potentially dangerous pattern detected");
        }

        const result = regex.test(input);

        // Layer 5: Check time
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

#### 2. Security Checklist
- [ ] No nested quantifiers \`(x+)+\`
- [ ] No multiple \`.*\` in pattern
- [ ] Limits on quantifiers \`{n,m}\`
- [ ] Anchors when possible \`^$\`
- [ ] Specific character classes \`[^x]\`
- [ ] Execution timeout implemented
- [ ] Maximum input length validated
- [ ] Performance tests executed
- [ ] Security code review

#### 3. Defensive Architecture
\`\`\`javascript
class SafeRegexValidator {
    constructor(options = {}) {
        this.maxInputLength = options.maxInputLength || 10000;
        this.timeout = options.timeout || 1000;
        this.cache = new Map(); // Results cache
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

#### 4. Production Monitoring
\`\`\`javascript
// Important metrics
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

### 📚 Essential Resources
- [OWASP ReDoS Guide](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)
- [Safe-Regex NPM](https://www.npmjs.com/package/safe-regex)
- [Regex101 Debugger](https://regex101.com/)
- [ReDos Checker](https://redos-checker.surge.sh/)

### ✅ Remember:
> "The safest regex is the one you don't write. Use native methods when possible."`,
			pattern: '^[a-zA-Z0-9]{3,20}$',
			testText: 'SafeUsername123',
			expectedMatches: 1,
			flags: '',
			hint: 'Username validation with clear limits',
			dangerLevel: 'safe',
			safeAlternative: 'Optimal pattern',
			explanation: 'Clear limits, no nesting, anchored = perfect regex.'
		}
	],

	exercises: [
		{
			id: 'fix-dangerous-1',
			title: 'Fix the Dangerous Email Validator',
			description: 'This email validator has a ReDoS issue. Can you fix it?',
			startingPattern: '^([a-zA-Z0-9_\\.\\-])+@([a-zA-Z0-9_\\.\\-])+\\.([a-zA-Z]{2,5})$',
			testCases: [
				{ input: 'user@example.com', shouldMatch: true },
				{ input: 'test.email@domain.co.uk', shouldMatch: true },
				{ input: 'a'.repeat(100) + '@', shouldMatch: false }
			],
			solution: '^[a-zA-Z0-9_\\.\\-]+@[a-zA-Z0-9_\\.\\-]+\\.[a-zA-Z]{2,5}$',
			hints: [
				'Parentheses with + after are unnecessary',
				'Remove capture groups you don\'t use',
				'Simplify by removing parentheses'
			]
		},
		{
			id: 'fix-dangerous-2',
			title: 'Fix the Vulnerable CSV Parser',
			description: 'This CSV parsing pattern can cause catastrophic backtracking.',
			startingPattern: '^(.*,)*.*$',
			testCases: [
				{ input: 'field1,field2,field3', shouldMatch: true },
				{ input: 'single', shouldMatch: true },
				{ input: 'a,'.repeat(50) + 'X', shouldMatch: true }
			],
			solution: '^([^,]*,)*[^,]*$',
			hints: [
				'.* is too ambiguous',
				'Use [^,]* to be more specific',
				'Avoid the pattern matching comma in multiple ways'
			]
		}
	],

	quiz: [
		{
			question: 'Which of these patterns is most prone to catastrophic backtracking?',
			options: [
				'(a+)+b',
				'a+b',
				'[a]+b',
				'a{1,10}b'
			],
			correct: 0,
			explanation: '(a+)+ creates nested quantifiers, causing exponential backtracking when there\'s no match.'
		},
		{
			question: 'What\'s the best way to prevent ReDoS?',
			options: [
				'Use more capture groups',
				'Make the pattern more complex',
				'Limit input size and use timeouts',
				'Always use the global flag'
			],
			correct: 2,
			explanation: 'Limiting input size and using timeouts are effective defenses against ReDoS.'
		},
		{
			question: 'Why is [^,]* safer than .* for CSV parsing?',
			options: [
				'It\'s shorter',
				'It\'s more specific and avoids ambiguity',
				'It captures more characters',
				'It works with multiline flag'
			],
			correct: 1,
			explanation: '[^,]* is specific (everything except commas), preventing the engine from trying multiple ways to match.'
		}
	],

	highlights: [
		'Nested quantifiers like (a+)+ can cause exponential execution time',
		'ReDoS is a real attack vector that has affected major companies',
		'Using negated character classes [^x] is safer than .*',
		'Always implement timeouts and input limits',
		'Sometimes native string methods are better than regex'
	],

	resources: [
		{
			title: 'OWASP ReDoS Prevention',
			url: 'https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS',
			type: 'guide'
		},
		{
			title: 'Cloudflare - Details of the Cloudflare outage',
			url: 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/',
			type: 'case study'
		},
		{
			title: 'Stack Overflow Postmortem',
			url: 'https://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016',
			type: 'postmortem'
		}
	]
};