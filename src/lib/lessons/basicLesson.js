/** @type {import('$lib/types.js').Lesson} */
export const basicLesson = {
	id: 'basic-regex',
	title: 'Primeros Pasos con Regex',
	description: 'Aprende los conceptos básicos de las expresiones regulares con ejemplos simples y divertidos.',
	difficulty: 'beginner',
	steps: [
		{
			id: 'step-1',
			title: '¡Hola Regex! 👋',
			explanation: `
				Las expresiones regulares (regex) son patrones que nos ayudan a buscar texto específico.

				Imagina que eres un detective buscando pistas en un texto. El regex es tu lupa especial
				que te ayuda a encontrar exactamente lo que buscas.

				Comencemos con algo súper simple: buscar la palabra "gato" en un texto.
			`,
			pattern: 'gato',
			testText: 'Mi gato es muy juguetón. El gato duerme todo el día. ¡Ese gato es genial!',
			expectedMatches: 3,
			tips: [
				'El regex buscará exactamente la palabra "gato"',
				'Fíjate que encuentra TODAS las apariciones',
				'Es sensible a mayúsculas y minúsculas'
			]
		},
		{
			id: 'step-2',
			title: 'Caracteres Especiales: El Punto 🔍',
			explanation: `
				El punto (.) es un carácter especial que significa "cualquier carácter".

				Es como un comodín que puede ser cualquier letra, número o símbolo.

				Por ejemplo, "g.to" encontrará "gato", "geto", "gito", "g7to", etc.
			`,
			pattern: 'g.to',
			testText: 'gato geto gito g7to goto g@to',
			expectedMatches: 6,
			tips: [
				'El punto (.) coincide con CUALQUIER carácter',
				'Solo coincide con UN carácter, no más',
				'Muy útil cuando no sabes exactamente qué carácter esperar'
			]
		},
		{
			id: 'step-3',
			title: 'Repetición: El Asterisco 🌟',
			explanation: `
				El asterisco (*) significa "cero o más veces el carácter anterior".

				Es como decir "puede que aparezca, puede que no, o puede que aparezca muchas veces".

				Por ejemplo, "go*gle" encontrará "ggle", "gogle", "google", "gooogle", etc.
			`,
			pattern: 'go*gle',
			testText: 'ggle gogle google gooogle goooogle',
			expectedMatches: 5,
			tips: [
				'El * aplica solo al carácter inmediatamente anterior',
				'Cero apariciones también cuenta como coincidencia',
				'Muy útil para variaciones de palabras'
			]
		},
		{
			id: 'step-4',
			title: 'Números Mágicos 🔢',
			explanation: `
				\\d es un atajo especial que significa "cualquier dígito del 0 al 9".

				Es como tener un detector de números súper específico.

				Por ejemplo, "\\d\\d\\d" encontrará cualquier secuencia de exactamente 3 números.
			`,
			pattern: '\\d\\d\\d',
			testText: 'Llama al 123 o al 987. El código es 789, no 12 ni 67.',
			expectedMatches: 3,
			tips: [
				'\\d es equivalente a [0-9]',
				'Cada \\d representa exactamente UN dígito',
				'Perfecto para buscar números de teléfono, códigos, etc.'
			]
		},
		{
			id: 'step-5',
			title: 'El Desafío Final 🏆',
			explanation: `
				¡Ahora eres todo un expert@ en regex básico!

				Vamos a combinar todo lo que has aprendido:
				- Texto literal
				- El punto (.)
				- El asterisco (*)
				- Números (\\d)

				Tu misión: encontrar códigos que empiecen con "CODE", seguidos de cualquier cantidad
				de letras (sin espacios), y terminen con exactamente 2 números.
			`,
			pattern: 'CODE[A-Z]*\\d\\d',
			testText: 'CODE123 CODEX99 CODEABC12 CODE77',
			expectedMatches: 4,
			tips: [
				'CODE busca exactamente esa palabra',
				'[A-Z]* significa "cualquier letra mayúscula, cero o más veces"',
				'\\d\\d son exactamente dos dígitos al final',
				'Los espacios separan las coincidencias, así encontramos 4 códigos distintos'
			]
		}
	]
};