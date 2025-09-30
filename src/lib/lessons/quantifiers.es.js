export const quantifiersLesson = {
	id: 'quantifiers',
	title: 'Cuantificadores - El Poder de la Repetición',
	description: 'Domina +, *, ?, {n}, {n,m} para crear patrones dinámicos que se adapten a diferentes cantidades de caracteres.',
	difficulty: 'intermediate',
	steps: [
		{
			id: 'step1',
			title: 'El Greedy Plus (+) - Uno o Más',
			explanation: 'El símbolo + significa "uno o más" del elemento anterior. \\d+ encuentra uno o más dígitos consecutivos, perfecto para números completos.',
			pattern: '\\d+',
			testText: 'Tengo 25 años, trabajo 8 horas y gano $1500 mensuales. Mi código es A123B456.',
			expectedMatches: 5,
			tip: '+ es "greedy" - toma la coincidencia más larga posible. \\d+ prefiere "1500" sobre "1", "5", "0", "0" por separado.'
		},
		{
			id: 'step2',
			title: 'El Opcional (?) - Cero o Uno',
			explanation: 'El símbolo ? hace opcional el elemento anterior. https? encuentra tanto "http" como "https", muy útil para URLs flexibles.',
			pattern: 'https?://',
			testText: 'Visita https://ejemplo.com y también http://test.org para más información.',
			expectedMatches: 2,
			tip: '? es perfecto para partes opcionales como "s" en https, "www" en URLs, o plurales opcionales.'
		},
		{
			id: 'step3',
			title: 'El Comodín (*) - Cero o Más',
			explanation: 'El símbolo * significa "cero o más" del elemento anterior. \\w* encuentra cualquier cantidad de caracteres de palabra, incluso ninguno.',
			pattern: 'test\\w*',
			testText: 'Ejecuta test, testing, tester y tests. También prueba testear y testar.',
			expectedMatches: 6,
			tip: '* es el más flexible - puede no encontrar nada y aún así ser válido. Úsalo para patrones muy variables.'
		},
		{
			id: 'step4',
			title: 'Exacto {n} - Repetición Fija',
			explanation: '{n} especifica exactamente n repeticiones. \\d{4} encuentra exactamente 4 dígitos, ideal para años, códigos postales.',
			pattern: '\\d{4}',
			testText: 'El año 2024, código postal 28001, PIN 1234 y el número 999 son ejemplos.',
			expectedMatches: 3,
			tip: '{n} es muy específico - no más, no menos. Perfecto cuando sabes la longitud exacta que necesitas.'
		},
		{
			id: 'step5',
			title: 'Rango {n,m} - Entre n y m',
			explanation: '{n,m} especifica entre n y m repeticiones. \\w{3,8} encuentra secuencias de 3 a 8 caracteres alfanuméricos, útil para usernames válidos.',
			pattern: '\\w{3,8}',
			testText: 'Usuarios: Ana, Pedro, Alejandro, MariaFernanda123, José, X, SuperLongUsername.',
			expectedMatches: 9,
			tip: '{n,m} es perfecto para validaciones - usernames, passwords, códigos que tienen rangos específicos.'
		},
		{
			id: 'step6',
			title: 'Mínimo {n,} - Al Menos n',
			explanation: '{n,} especifica al menos n repeticiones, sin límite superior. \\d{3,} encuentra números de al menos 3 dígitos.',
			pattern: '\\d{3,}',
			testText: 'Números: 12, 345, 6789, 1000000, 99 y 42 están en el texto.',
			expectedMatches: 3,
			tip: '{n,} es útil cuando tienes un mínimo pero no importa el máximo - IDs, números grandes, etc.'
		},
		{
			id: 'step7',
			title: 'Lazy vs Greedy - .*? vs .*',
			explanation: 'Por defecto los cuantificadores son "greedy" (toman lo máximo). Añadir ? los hace "lazy" (toman lo mínimo). Crucial para parsing.',
			pattern: '<.+?>',
			testText: '<h1>Título</h1> y <p>párrafo</p> son elementos HTML.',
			expectedMatches: 4,
			tip: 'Sin ?, sería <.+> y tomaría desde el primer < hasta el último >, no lo que queremos para tags HTML.'
		},
		{
			id: 'step8',
			title: 'Combinaciones Maestras - Patrones Reales',
			explanation: 'Combina cuantificadores para patrones poderosos. Este patrón básico de email usa + para el nombre, dominio y extensión.',
			pattern: '\\w+@\\w+\\.\\w{2,4}',
			testText: 'Contactos: juan@ejemplo.com, maria.garcia@test.org, admin@site.co.uk, no-válido@.com',
			expectedMatches: 3,
			tip: 'Los cuantificadores combinados crean patrones profesionales. Este es el fundamento de validaciones complejas.'
		}
	]
};