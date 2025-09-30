export const groupsLesson = {
	id: 'groups',
	title: 'Grupos y Captura - Regex Nivel Ninja',
	description: 'Desbloquea el poder avanzado de captura, referencias y lookahead/lookbehind para crear patrones profesionales.',
	difficulty: 'advanced',
	steps: [
		{
			id: 'step1',
			title: 'Grupos Básicos () - Agrupando Elementos',
			explanation: 'Los paréntesis () agrupan elementos. (abc)+ repite toda la secuencia "abc", no solo la "c".',
			pattern: '(ha)+',
			testText: 'jajaja, hahaha, hohoho, hehehe, haha y ja ja ja.',
			expectedMatches: 2,
			tip: 'Los grupos son fundamentales - permiten aplicar cuantificadores a secuencias completas en lugar de un solo carácter.'
		},
		{
			id: 'step2',
			title: 'Captura y Extracción de Datos',
			explanation: 'Los grupos capturan datos para extraer. (\\d{2})/(\\d{2})/(\\d{4}) captura día, mes y año por separado.',
			pattern: '(\\d{2})/(\\d{2})/(\\d{4})',
			testText: 'Fechas importantes: 15/03/2024, 08/12/2023 y 31/12/1999.',
			expectedMatches: 3,
			tip: 'Cada grupo entre () se convierte en una "captura" que puedes usar después - perfecto para extraer datos estructurados.'
		},
		{
			id: 'step3',
			title: 'Grupos No-Capturantes (?:) - Solo Agrupación',
			explanation: '(?:) agrupa sin capturar. (?:www\\.)? hace "www." opcional sin crear una captura extra.',
			pattern: '(?:www\\.)?[a-z]+\\.com',
			testText: 'Sitios: ejemplo.com, www.test.com, demo.com y www.prueba.com',
			expectedMatches: 4,
			tip: 'Usa (?:) cuando necesites agrupar pero no capturar - mantiene el patrón limpio y eficiente.'
		},
		{
			id: 'step4',
			title: 'Referencias Hacia Atrás \\1 - Detectar Repeticiones',
			explanation: '\\1 se refiere al primer grupo capturado. (\\w+)\\s+\\1 encuentra palabras duplicadas consecutivas.',
			pattern: '(\\w+)\\s+\\1',
			testText: 'Errores: el el código tiene palabras palabras duplicadas y y errores.',
			expectedMatches: 3,
			tip: 'Las referencias \\1, \\2, etc. son súper poderosas para encontrar patrones que se repiten exactamente.'
		},
		{
			id: 'step5',
			title: 'Alternativas | - Múltiples Opciones',
			explanation: '| significa "o". (cat|dog|bird) encuentra cualquiera de las tres palabras.',
			pattern: '(gato|perro|pájaro)',
			testText: 'Mascotas: tengo un gato, mi hermana tiene un perro y mi primo un pájaro.',
			expectedMatches: 3,
			tip: 'Las alternativas son perfectas para listas de opciones válidas - nombres, códigos, categorías, etc.'
		},
		{
			id: 'step6',
			title: 'Lookahead Positivo (?=) - "Seguido por"',
			explanation: '(?=) verifica que algo sigue SIN incluirlo en la coincidencia. \\d+(?=€) encuentra números antes de €.',
			pattern: '\\d+(?=€)',
			testText: 'Precios: 25€, 100$, 50€, 75£ y 200€ en la tienda.',
			expectedMatches: 3,
			tip: 'Lookahead es genial para condiciones - "quiero números, pero solo si van seguidos de €".'
		},
		{
			id: 'step7',
			title: 'Lookahead Negativo (?!) - "NO seguido por"',
			explanation: '(?!) verifica que algo NO sigue. \\d+(?!€) encuentra números que NO van seguidos de €.',
			pattern: '\\d+(?!€)',
			testText: 'Precios: 25€, 100$, 50€, 75£ y 200€ en la tienda.',
			expectedMatches: 5,
			tip: 'Lookahead negativo es perfecto para exclusiones - "quiero números, pero NO los que tienen €".'
		},
		{
			id: 'step8',
			title: 'Regex Complejo Real - Validador Profesional',
			explanation: 'Combina todo: grupos, alternativas y lookahead para un validador de contraseñas profesional.',
			pattern: '\\b(?=\\w*[a-z])(?=\\w*[A-Z])(?=\\w*\\d)\\w{8,}\\b',
			testText: 'abc123 Password1 ALLCAPS123 minúsculas Password123 Test1234',
			expectedMatches: 3,
			tip: 'Este patrón usa múltiples lookaheads para verificar: minúscula, mayúscula, número y mínimo 8 caracteres.'
		}
	]
};