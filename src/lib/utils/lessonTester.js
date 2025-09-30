/**
 * Motor de testing para validar que las lecciones funcionen correctamente
 */

/**
 * Ejecuta un regex y cuenta las coincidencias
 * @param {string} pattern - El patrón regex
 * @param {string} text - El texto a analizar
 * @param {string} flags - Flags del regex (por defecto 'g')
 * @returns {{matches: Array, count: number, error: string|null}}
 */
export function executeRegex(pattern, text, flags = 'g') {
	try {
		// Asegurar que siempre incluye 'g' para iterar
		const flagsToUse = flags.includes('g') ? flags : flags + 'g';
		const regex = new RegExp(pattern, flagsToUse);
		const matches = [];
		let match;

		while ((match = regex.exec(text)) !== null) {
			matches.push({
				match: match[0],
				index: match.index,
				length: match[0].length,
				groups: match.slice(1)
			});

			// Evitar bucles infinitos con matches de longitud 0
			if (match.index === regex.lastIndex) {
				regex.lastIndex++;
			}
		}

		return {
			matches,
			count: matches.length,
			error: null
		};
	} catch (error) {
		return {
			matches: [],
			count: 0,
			error: error.message
		};
	}
}

/**
 * Testa un paso individual de una lección
 * @param {Object} step - El paso de la lección
 * @returns {{passed: boolean, expected: number, actual: number, matches: Array, error: string|null}}
 */
export function testLessonStep(step) {
	const result = executeRegex(step.pattern, step.testText, step.flags || 'g');

	if (result.error) {
		return {
			passed: false,
			expected: step.expectedMatches,
			actual: 0,
			matches: [],
			error: result.error
		};
	}

	const passed = result.count === step.expectedMatches;

	return {
		passed,
		expected: step.expectedMatches,
		actual: result.count,
		matches: result.matches,
		error: passed ? null : `Expected ${step.expectedMatches} matches, but found ${result.count}`
	};
}

/**
 * Testa una lección completa
 * @param {Object} lesson - La lección a testear
 * @returns {{passed: boolean, totalSteps: number, passedSteps: number, failedSteps: Array, results: Array}}
 */
export function testLesson(lesson) {
	const results = lesson.steps.map((step, index) => ({
		stepIndex: index,
		stepId: step.id,
		stepTitle: step.title,
		...testLessonStep(step)
	}));

	const failedSteps = results.filter(result => !result.passed);
	const passedSteps = results.length - failedSteps.length;

	return {
		passed: failedSteps.length === 0,
		totalSteps: results.length,
		passedSteps,
		failedSteps,
		results
	};
}

/**
 * Testa múltiples lecciones
 * @param {Array} lessons - Array de lecciones
 * @returns {{passed: boolean, totalLessons: number, passedLessons: number, failedLessons: Array, results: Array}}
 */
export function testLessons(lessons) {
	const results = lessons.map((lesson, index) => ({
		lessonIndex: index,
		lessonId: lesson.id,
		lessonTitle: lesson.title,
		...testLesson(lesson)
	}));

	const failedLessons = results.filter(result => !result.passed);
	const passedLessons = results.length - failedLessons.length;

	return {
		passed: failedLessons.length === 0,
		totalLessons: results.length,
		passedLessons,
		failedLessons,
		results
	};
}

/**
 * Imprime un reporte detallado de testing
 * @param {Object} testResults - Resultado de testLessons()
 */
export function printTestReport(testResults) {
	console.log('\n🧪 REPORTE DE TESTING DE LECCIONES');
	console.log('=====================================');

	if (testResults.passed) {
		console.log(`✅ Todas las lecciones pasaron! (${testResults.passedLessons}/${testResults.totalLessons})`);
	} else {
		console.log(`❌ ${testResults.failedLessons.length} lección(es) fallaron de ${testResults.totalLessons}`);
	}

	console.log('\nDetalle por lección:');

	testResults.results.forEach(lessonResult => {
		const icon = lessonResult.passed ? '✅' : '❌';
		console.log(`\n${icon} ${lessonResult.lessonTitle} (${lessonResult.lessonId})`);
		console.log(`   Pasos: ${lessonResult.passedSteps}/${lessonResult.totalSteps} pasaron`);

		if (!lessonResult.passed) {
			lessonResult.failedSteps.forEach(failedStep => {
				console.log(`   ❌ Paso ${failedStep.stepIndex + 1}: ${failedStep.stepTitle}`);
				console.log(`      Patrón: ${failedStep.stepId}`);
				console.log(`      Error: ${failedStep.error}`);
				console.log(`      Coincidencias encontradas:`, failedStep.matches.map(m => `"${m.match}"`));
			});
		}
	});

	console.log('\n=====================================\n');
}