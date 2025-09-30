import { testLessons, printTestReport } from '../utils/lessonTester.js';
import { basicLesson } from '../lessons/basicLesson.js';

// Función para ejecutar todos los tests
export function runAllTests() {
	const lessons = [basicLesson];
	const results = testLessons(lessons);

	printTestReport(results);

	return results;
}

// Si se ejecuta directamente
if (typeof window === 'undefined') {
	runAllTests();
}