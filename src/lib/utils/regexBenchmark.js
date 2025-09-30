/**
 * Regex Benchmark Utility
 *
 * Herramientas para medir y comparar el rendimiento de regex
 */

/**
 * Clase para perfilar y comparar regex
 */
export class RegexProfiler {
	constructor() {
		this.results = [];
		this.comparisons = [];
	}

	/**
	 * Perfila un regex con un texto dado
	 * @param {string} name - Nombre descriptivo
	 * @param {RegExp} regex - El regex a perfilar
	 * @param {string} text - Texto de prueba
	 * @param {number} iterations - Número de iteraciones
	 * @returns {RegexProfiler} this para chaining
	 */
	profile(name, regex, text, iterations = 1000) {
		// Calentar el motor
		for (let i = 0; i < 10; i++) {
			regex.test(text);
			if (regex.global) regex.lastIndex = 0;
		}

		// Medir compilación (si es dinámico)
		const compileStart = performance.now();
		const compiled = new RegExp(regex.source, regex.flags);
		const compileTime = performance.now() - compileStart;

		// Medir ejecución
		const execStart = performance.now();
		let matches = 0;
		let steps = 0;

		for (let i = 0; i < iterations; i++) {
			const result = regex.test(text);
			if (result) matches++;
			if (regex.global) regex.lastIndex = 0;
			steps += this.estimateSteps(regex, text);
		}

		const execTime = performance.now() - execStart;
		const avgTime = execTime / iterations;

		this.results.push({
			name,
			pattern: regex.source,
			flags: regex.flags || 'none',
			iterations,
			compileTime: compileTime.toFixed(4),
			totalTime: execTime.toFixed(2),
			avgTime: avgTime.toFixed(4),
			opsPerSec: Math.round(1000 / avgTime),
			matches,
			estimatedSteps: Math.round(steps / iterations),
			textLength: text.length
		});

		return this;
	}

	/**
	 * Estima los pasos de ejecución basado en el patrón
	 */
	estimateSteps(regex, text) {
		const pattern = regex.source;
		let steps = text.length; // Base: recorrer el texto

		// Penalizaciones por complejidad
		if (pattern.includes('.*')) steps *= 2;
		if (pattern.includes('.*?')) steps *= 1.5;
		if (pattern.includes('+') || pattern.includes('*')) steps *= 1.2;
		if (pattern.includes('|')) steps *= 1.3;
		if (pattern.includes('(?')) steps *= 1.5;

		// Bonus por optimizaciones
		if (pattern.startsWith('^')) steps *= 0.1;
		if (pattern.endsWith('$')) steps *= 0.5;
		if (pattern.includes('[^')) steps *= 0.8;

		return Math.round(steps);
	}

	/**
	 * Compara los resultados
	 */
	compare() {
		if (this.results.length === 0) return null;

		// Ordenar por tiempo promedio
		const sorted = [...this.results].sort((a, b) =>
			parseFloat(a.avgTime) - parseFloat(b.avgTime)
		);

		const fastest = sorted[0];
		const slowest = sorted[sorted.length - 1];

		// Calcular mejoras relativas
		this.comparisons = sorted.map(result => {
			const improvement = result === fastest ? 0 :
				((parseFloat(result.avgTime) / parseFloat(fastest.avgTime) - 1) * 100);

			return {
				...result,
				improvement: improvement.toFixed(1),
				rank: sorted.indexOf(result) + 1,
				isFastest: result === fastest,
				isSlowest: result === slowest
			};
		});

		return this.comparisons;
	}

	/**
	 * Genera un reporte formateado
	 */
	getReport() {
		const comparisons = this.compare();
		if (!comparisons) return 'No results to report';

		let report = '📊 Regex Performance Report\n';
		report += '═'.repeat(50) + '\n\n';

		comparisons.forEach(result => {
			const emoji = result.isFastest ? '🏆' : result.isSlowest ? '🐌' : '📊';

			report += `${emoji} ${result.name}\n`;
			report += `   Pattern: /${result.pattern}/${result.flags}\n`;
			report += `   Avg Time: ${result.avgTime}ms\n`;
			report += `   Ops/Sec: ${result.opsPerSec.toLocaleString()}\n`;
			report += `   Est. Steps: ${result.estimatedSteps}\n`;

			if (!result.isFastest) {
				report += `   ${result.improvement}% slower than fastest\n`;
			}
			report += '\n';
		});

		return report;
	}

	/**
	 * Limpia los resultados
	 */
	clear() {
		this.results = [];
		this.comparisons = [];
		return this;
	}
}

/**
 * Benchmark para comparar regex vs métodos de string
 */
export class StringVsRegexBenchmark {
	/**
	 * Compara una búsqueda simple
	 */
	static compareSimpleSearch(text, searchTerm, iterations = 100000) {
		const results = {};

		// String.includes()
		const includesStart = performance.now();
		for (let i = 0; i < iterations; i++) {
			text.includes(searchTerm);
		}
		results.includes = performance.now() - includesStart;

		// String.indexOf()
		const indexOfStart = performance.now();
		for (let i = 0; i < iterations; i++) {
			text.indexOf(searchTerm) !== -1;
		}
		results.indexOf = performance.now() - indexOfStart;

		// Regex.test()
		const regex = new RegExp(searchTerm);
		const regexStart = performance.now();
		for (let i = 0; i < iterations; i++) {
			regex.test(text);
		}
		results.regex = performance.now() - regexStart;

		// Regex literal
		const literal = /test/; // Asumiendo 'test' como ejemplo
		const literalStart = performance.now();
		for (let i = 0; i < iterations; i++) {
			literal.test(text);
		}
		results.regexLiteral = performance.now() - literalStart;

		return {
			winner: Object.entries(results).reduce((min, [key, time]) =>
				time < min.time ? { method: key, time } : min,
				{ method: '', time: Infinity }
			).method,
			results,
			improvements: this.calculateImprovements(results)
		};
	}

	/**
	 * Compara verificación de inicio/fin
	 */
	static compareAnchors(text, prefix, suffix, iterations = 100000) {
		const results = {};

		// startsWith
		const startsWithTime = performance.now();
		for (let i = 0; i < iterations; i++) {
			text.startsWith(prefix);
		}
		results.startsWith = performance.now() - startsWithTime;

		// Regex ^
		const regexStart = new RegExp('^' + prefix);
		const regexStartTime = performance.now();
		for (let i = 0; i < iterations; i++) {
			regexStart.test(text);
		}
		results.regexStart = performance.now() - regexStartTime;

		// endsWith
		const endsWithTime = performance.now();
		for (let i = 0; i < iterations; i++) {
			text.endsWith(suffix);
		}
		results.endsWith = performance.now() - endsWithTime;

		// Regex $
		const regexEnd = new RegExp(suffix + '$');
		const regexEndTime = performance.now();
		for (let i = 0; i < iterations; i++) {
			regexEnd.test(text);
		}
		results.regexEnd = performance.now() - regexEndTime;

		return {
			results,
			improvements: this.calculateImprovements(results)
		};
	}

	/**
	 * Calcula mejoras relativas
	 */
	static calculateImprovements(results) {
		const min = Math.min(...Object.values(results));
		const improvements = {};

		Object.entries(results).forEach(([method, time]) => {
			improvements[method] = {
				time: time.toFixed(2) + 'ms',
				relative: ((time / min - 1) * 100).toFixed(1) + '% slower'
			};
		});

		return improvements;
	}
}

/**
 * Generador de casos de prueba para benchmark
 */
export class BenchmarkTestCases {
	/**
	 * Genera strings de diferentes longitudes
	 */
	static generateStrings(pattern, lengths = [10, 100, 1000, 10000]) {
		return lengths.map(len => ({
			length: len,
			text: pattern.repeat(Math.ceil(len / pattern.length)).slice(0, len),
			description: `${len} characters`
		}));
	}

	/**
	 * Genera casos extremos para testing
	 */
	static generateEdgeCases(basePattern) {
		return [
			{
				name: 'Empty string',
				text: '',
				pattern: basePattern
			},
			{
				name: 'Single character',
				text: 'a',
				pattern: basePattern
			},
			{
				name: 'No match',
				text: 'xyz'.repeat(100),
				pattern: basePattern
			},
			{
				name: 'All match',
				text: basePattern.repeat(100),
				pattern: basePattern
			},
			{
				name: 'Match at start',
				text: basePattern + 'x'.repeat(100),
				pattern: basePattern
			},
			{
				name: 'Match at end',
				text: 'x'.repeat(100) + basePattern,
				pattern: basePattern
			}
		];
	}

	/**
	 * Genera casos para probar anchors
	 */
	static generateAnchorTests() {
		const text = 'x'.repeat(1000) + 'target' + 'y'.repeat(1000);

		return [
			{
				name: 'No anchor',
				regex: /target/,
				text,
				expectedTime: 'slow'
			},
			{
				name: 'Start anchor',
				regex: /^target/,
				text: 'target' + text,
				expectedTime: 'fast'
			},
			{
				name: 'End anchor',
				regex: /target$/,
				text: text + 'target',
				expectedTime: 'fast'
			},
			{
				name: 'Both anchors',
				regex: /^target$/,
				text: 'target',
				expectedTime: 'fastest'
			}
		];
	}
}

/**
 * Visualizador de resultados de benchmark
 */
export function formatBenchmarkResults(results) {
	const bars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
	const maxTime = Math.max(...results.map(r => parseFloat(r.avgTime)));

	return results.map(result => {
		const percentage = parseFloat(result.avgTime) / maxTime;
		const barIndex = Math.floor(percentage * (bars.length - 1));
		const bar = bars[barIndex].repeat(Math.ceil(percentage * 20));

		return {
			name: result.name,
			pattern: result.pattern,
			time: result.avgTime + 'ms',
			bar,
			performance: result.opsPerSec + ' ops/sec',
			rank: result.rank || '-'
		};
	});
}