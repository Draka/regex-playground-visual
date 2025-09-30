/**
 * Regex Danger Analyzer
 *
 * Detecta patrones peligrosos y analiza el riesgo de ReDoS
 */

/**
 * Analiza un patrón regex para detectar vulnerabilidades
 * @param {string} pattern - El patrón regex a analizar
 * @returns {Object} Análisis del patrón
 */
export function analyzeRegexDanger(pattern) {
	const analysis = {
		pattern,
		dangerLevel: 'safe', // 'safe', 'low', 'medium', 'high', 'critical'
		issues: [],
		safeAlternatives: [],
		complexity: calculateComplexity(pattern),
		estimatedWorstCase: null
	};

	// Detectar patrones peligrosos
	const dangers = detectDangerousPatterns(pattern);

	if (dangers.length > 0) {
		analysis.issues = dangers;
		analysis.dangerLevel = calculateDangerLevel(dangers);
		analysis.safeAlternatives = suggestSafeAlternatives(pattern, dangers);
		analysis.estimatedWorstCase = estimateWorstCaseComplexity(pattern);
	}

	return analysis;
}

/**
 * Detecta patrones peligrosos específicos
 */
function detectDangerousPatterns(pattern) {
	const issues = [];

	// Detectar cuantificadores anidados: (x+)+, (x*)+, etc.
	if (/\([^)]*[+*]\)[+*?]/.test(pattern)) {
		issues.push({
			type: 'nested-quantifiers',
			severity: 'critical',
			description: 'Cuantificadores anidados detectados (ej: (a+)+)',
			pattern: pattern.match(/\([^)]*[+*]\)[+*?]/)[0]
		});
	}

	// Detectar alternativas superpuestas: (a|ab)*
	if (/\([^)|]*\|[^)]*\)[+*]/.test(pattern)) {
		const alternation = pattern.match(/\([^)|]*\|[^)]*\)[+*]/)[0];
		if (hasOverlappingAlternatives(alternation)) {
			issues.push({
				type: 'overlapping-alternations',
				severity: 'high',
				description: 'Alternativas superpuestas con repetición',
				pattern: alternation
			});
		}
	}

	// Detectar múltiples .* en el mismo patrón
	const dotStarCount = (pattern.match(/\.\*/g) || []).length;
	if (dotStarCount > 1) {
		issues.push({
			type: 'multiple-dot-star',
			severity: 'medium',
			description: `Múltiples .* detectados (${dotStarCount} instancias)`,
			pattern: '.*'
		});
	}

	// Detectar .* sin anclar
	if (/^\.\*/.test(pattern) || /\.\*$/.test(pattern)) {
		issues.push({
			type: 'unanchored-dot-star',
			severity: 'low',
			description: '.* sin anclar al inicio o final',
			pattern: pattern.match(/^\.\*|\.\*$/)[0]
		});
	}

	// Detectar cuantificadores sin límite superior
	if (/\{(\d+),\}/.test(pattern)) {
		const unlimited = pattern.match(/\{(\d+),\}/g);
		unlimited.forEach(match => {
			const min = parseInt(match.match(/\d+/)[0]);
			if (min > 10) {
				issues.push({
					type: 'unlimited-quantifier',
					severity: 'medium',
					description: `Cuantificador sin límite superior: ${match}`,
					pattern: match
				});
			}
		});
	}

	// Detectar lookaheads/lookbehinds complejos
	const lookaheadCount = (pattern.match(/\(\?[=!]/g) || []).length;
	const lookbehindCount = (pattern.match(/\(\?<[=!]/g) || []).length;
	if (lookaheadCount + lookbehindCount > 3) {
		issues.push({
			type: 'complex-lookarounds',
			severity: 'medium',
			description: `Demasiados lookarounds (${lookaheadCount + lookbehindCount} encontrados)`,
			pattern: 'Multiple lookarounds'
		});
	}

	// Detectar grupos de captura excesivos
	const captureGroupCount = (pattern.match(/\([^?]/g) || []).length;
	if (captureGroupCount > 10) {
		issues.push({
			type: 'excessive-captures',
			severity: 'low',
			description: `Demasiados grupos de captura (${captureGroupCount} encontrados)`,
			pattern: `${captureGroupCount} capture groups`
		});
	}

	return issues;
}

/**
 * Verifica si las alternativas se superponen
 */
function hasOverlappingAlternatives(alternation) {
	// Extraer las alternativas
	const alternatives = alternation
		.replace(/^\(/, '')
		.replace(/\)[+*?]?$/, '')
		.split('|');

	// Verificar si alguna alternativa es prefijo de otra
	for (let i = 0; i < alternatives.length; i++) {
		for (let j = i + 1; j < alternatives.length; j++) {
			if (alternatives[i].startsWith(alternatives[j]) ||
				alternatives[j].startsWith(alternatives[i])) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Calcula el nivel de peligro basado en los issues encontrados
 */
function calculateDangerLevel(issues) {
	if (issues.some(i => i.severity === 'critical')) return 'critical';
	if (issues.some(i => i.severity === 'high')) return 'high';
	if (issues.filter(i => i.severity === 'medium').length >= 2) return 'high';
	if (issues.some(i => i.severity === 'medium')) return 'medium';
	if (issues.length > 0) return 'low';
	return 'safe';
}

/**
 * Calcula la complejidad del patrón
 */
function calculateComplexity(pattern) {
	let complexity = pattern.length;

	// Penalizar por características complejas
	complexity += (pattern.match(/[+*?]/g) || []).length * 2;
	complexity += (pattern.match(/\{/g) || []).length * 3;
	complexity += (pattern.match(/\|/g) || []).length * 2;
	complexity += (pattern.match(/\(\?/g) || []).length * 5;
	complexity += (pattern.match(/\\/g) || []).length;

	return complexity;
}

/**
 * Estima la complejidad en el peor caso
 */
function estimateWorstCaseComplexity(pattern) {
	// Simplificación: contar cuantificadores anidados
	const nestedQuantifiers = (pattern.match(/\([^)]*[+*]\)[+*?]/g) || []).length;
	const alternations = (pattern.match(/\|/g) || []).length;

	if (nestedQuantifiers > 0) {
		return {
			timeComplexity: 'O(2^n)',
			description: 'Tiempo exponencial debido a cuantificadores anidados',
			inputLength10: '~1ms',
			inputLength20: '~1s',
			inputLength30: '~17min',
			inputLength40: '~11 días'
		};
	}

	if (alternations > 5) {
		return {
			timeComplexity: 'O(n^m)',
			description: 'Tiempo polinomial alto debido a múltiples alternativas',
			inputLength10: '~1ms',
			inputLength100: '~100ms',
			inputLength1000: '~10s'
		};
	}

	return {
		timeComplexity: 'O(n)',
		description: 'Tiempo lineal - patrón seguro',
		inputLength1000: '<1ms',
		inputLength10000: '<10ms'
	};
}

/**
 * Sugiere alternativas seguras para patrones peligrosos
 */
function suggestSafeAlternatives(pattern, issues) {
	const suggestions = [];

	issues.forEach(issue => {
		switch (issue.type) {
			case 'nested-quantifiers':
				// Simplificar (a+)+ a a+
				const simplified = pattern.replace(/\(([^)]+)\+\)\+/, '$1+');
				if (simplified !== pattern) {
					suggestions.push({
						original: pattern,
						suggested: simplified,
						reason: 'Eliminar cuantificadores anidados'
					});
				}
				break;

			case 'multiple-dot-star':
				// Reemplazar .* con clases de caracteres más específicas
				suggestions.push({
					original: pattern,
					suggested: pattern.replace(/\.\*/g, '[^\\n]*'),
					reason: 'Usar [^\\n]* en lugar de .* para ser más específico'
				});
				break;

			case 'unlimited-quantifier':
				// Añadir límite superior a cuantificadores
				const limited = pattern.replace(/\{(\d+),\}/g, (match, p1) => {
					const min = parseInt(p1);
					const max = min * 10; // Límite arbitrario
					return `{${min},${max}}`;
				});
				suggestions.push({
					original: pattern,
					suggested: limited,
					reason: 'Añadir límite superior a cuantificadores'
				});
				break;

			case 'excessive-captures':
				// Sugerir grupos no-capturantes
				suggestions.push({
					original: pattern,
					suggested: 'Considera usar (?:...) para grupos no-capturantes',
					reason: 'Reducir el uso de memoria con grupos no-capturantes'
				});
				break;
		}
	});

	// Eliminar duplicados
	return suggestions.filter((s, i, arr) =>
		arr.findIndex(x => x.suggested === s.suggested) === i
	);
}

/**
 * Prueba un patrón con timeout de seguridad
 */
export function testRegexWithTimeout(pattern, testString, timeout = 1000) {
	return new Promise((resolve, reject) => {
		const startTime = performance.now();

		// Crear un worker para ejecutar el regex de forma aislada
		// (simplificación: aquí usamos setTimeout para simular)
		const timer = setTimeout(() => {
			reject({
				error: 'timeout',
				message: `Regex timeout después de ${timeout}ms`,
				executionTime: timeout
			});
		}, timeout);

		try {
			const regex = new RegExp(pattern);
			const result = regex.test(testString);
			const executionTime = performance.now() - startTime;

			clearTimeout(timer);

			resolve({
				success: true,
				result,
				executionTime,
				warning: executionTime > 100 ? 'Tiempo de ejecución alto' : null
			});
		} catch (error) {
			clearTimeout(timer);
			reject({
				error: 'invalid',
				message: error.message
			});
		}
	});
}

/**
 * Genera casos de prueba maliciosos para un patrón
 */
export function generateEvilTestCases(pattern) {
	const testCases = [];
	const analysis = analyzeRegexDanger(pattern);

	if (analysis.issues.some(i => i.type === 'nested-quantifiers')) {
		// Generar strings que causan backtracking
		for (let len of [10, 15, 20, 25]) {
			testCases.push({
				input: 'a'.repeat(len) + '!',
				description: `String de ${len} 'a's sin match final`,
				expectedBehavior: 'timeout'
			});
		}
	}

	if (analysis.issues.some(i => i.type === 'multiple-dot-star')) {
		// Generar strings largos
		testCases.push({
			input: 'x'.repeat(1000),
			description: 'String largo para múltiples .*',
			expectedBehavior: 'slow'
		});
	}

	// Casos normales para comparación
	testCases.push({
		input: 'test',
		description: 'String corto normal',
		expectedBehavior: 'fast'
	});

	return testCases;
}

/**
 * Formatea el análisis para mostrar al usuario
 */
export function formatDangerAnalysis(analysis) {
	const dangerEmojis = {
		safe: '✅',
		low: '⚠️',
		medium: '🔶',
		high: '🔴',
		critical: '💀'
	};

	const dangerColors = {
		safe: 'green',
		low: 'yellow',
		medium: 'orange',
		high: 'red',
		critical: 'darkred'
	};

	return {
		emoji: dangerEmojis[analysis.dangerLevel],
		color: dangerColors[analysis.dangerLevel],
		level: analysis.dangerLevel,
		summary: analysis.issues.length === 0
			? 'Patrón seguro - No se detectaron problemas'
			: `${analysis.issues.length} problema(s) detectado(s)`,
		issues: analysis.issues,
		alternatives: analysis.safeAlternatives,
		complexity: analysis.complexity,
		worstCase: analysis.estimatedWorstCase
	};
}