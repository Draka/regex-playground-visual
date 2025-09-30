import { basicLessonEs } from './basicLesson.es.js';
import { basicLessonEn } from './basicLesson.en.js';
import { characterClassesLesson as characterClassesLessonEs } from './characterClasses.es.js';
import { characterClassesLesson as characterClassesLessonEn } from './characterClasses.en.js';
import { quantifiersLesson as quantifiersLessonEs } from './quantifiers.es.js';
import { quantifiersLesson as quantifiersLessonEn } from './quantifiers.en.js';
import { groupsLesson as groupsLessonEs } from './groups.es.js';
import { groupsLesson as groupsLessonEn } from './groups.en.js';
import { realWorldLesson as realWorldLessonEs } from './realWorld.es.js';
import { realWorldLesson as realWorldLessonEn } from './realWorld.en.js';
import { flagsLesson as flagsLessonEs } from './flags.es.js';
import { flagsLesson as flagsLessonEn } from './flags.en.js';
import { dangerousLesson as dangerousLessonEs } from './dangerousLesson.es.js';
import { dangerousLesson as dangerousLessonEn } from './dangerousLesson.en.js';
import { performanceLesson as performanceLessonEs } from './performanceLesson.es.js';
import { performanceLesson as performanceLessonEn } from './performanceLesson.en.js';

/**
 * Obtiene las lecciones para un idioma específico
 * @param {string} locale - El código de idioma ('es', 'en')
 * @returns {Array} Array de lecciones en el idioma especificado
 */
export function getLessons(locale) {
	switch (locale) {
		case 'es':
			return [basicLessonEs, characterClassesLessonEs, quantifiersLessonEs, groupsLessonEs, realWorldLessonEs, flagsLessonEs, dangerousLessonEs, performanceLessonEs];
		case 'en':
			return [basicLessonEn, characterClassesLessonEn, quantifiersLessonEn, groupsLessonEn, realWorldLessonEn, flagsLessonEn, dangerousLessonEn, performanceLessonEn];
		default:
			// Fallback a español si el idioma no es soportado
			return [basicLessonEs, characterClassesLessonEs, quantifiersLessonEs, groupsLessonEs, realWorldLessonEs, flagsLessonEs, dangerousLessonEs, performanceLessonEs];
	}
}

/**
 * Obtiene una lección específica por ID y idioma
 * @param {string} lessonId - ID de la lección
 * @param {string} locale - Código de idioma
 * @returns {Object|null} La lección o null si no se encuentra
 */
export function getLesson(lessonId, locale) {
	const lessons = getLessons(locale);
	return lessons.find(lesson => lesson.id === lessonId) || null;
}