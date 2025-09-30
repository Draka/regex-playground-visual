/**
 * Lección 6: Flags y Modificadores
 * Controla el comportamiento de tus expresiones regulares con flags
 */

export const flagsLesson = {
	id: 'flags',
	title: 'Flags y Modificadores',
	difficulty: 'intermediate',
	description:
		'Domina los flags de regex para controlar cómo se comportan tus patrones: búsquedas globales, case-insensitive, multilínea y más.',
	estimatedTime: '12 minutos',
	steps: [
		{
			id: 1,
			title: 'Flag Global (g) - Encuentra Todo',
			explanation:
				'Sin el flag "g", regex solo encuentra la primera coincidencia. Con "g", encuentra TODAS las coincidencias en el texto.',
			pattern: '\\d+',
			testText: 'Tengo 3 gatos, 5 perros y 12 peces en casa.',
			expectedMatches: 3,
			hint: 'El patrón \\d+ busca uno o más dígitos. Con flag "g" encontrará los 3 números: 3, 5 y 12.',
			flags: 'g'
		},
		{
			id: 2,
			title: 'Flag Ignore Case (i) - Mayúsculas y Minúsculas',
			explanation:
				'El flag "i" hace que el regex ignore la diferencia entre mayúsculas y minúsculas. Perfecto para búsquedas flexibles.',
			pattern: 'gato',
			testText: 'Mi GATO es naranja. Tu gato es negro. Los Gatos son geniales.',
			expectedMatches: 3,
			hint: 'Sin "i" solo encontraría "gato" (minúsculas). Con "i" encuentra GATO, gato y Gatos.',
			flags: 'gi'
		},
		{
			id: 3,
			title: 'Flag Multiline (m) - Inicio y Fin de Línea',
			explanation:
				'Con "m", los anchors ^ y $ funcionan al inicio/fin de CADA línea, no solo del texto completo.',
			pattern: '^\\d+',
			testText: '123 primera línea\nalgo en medio\n456 segunda línea\n789 tercera',
			expectedMatches: 3,
			hint: '^\\d+ busca números al inicio. Con "m" encuentra al inicio de cada línea: 123, 456, 789.',
			flags: 'gm'
		},
		{
			id: 4,
			title: 'Flag Dotall (s) - El Punto Incluye Todo',
			explanation:
				'Normalmente "." NO coincide con saltos de línea. Con "s", el punto (.) coincide con CUALQUIER carácter, incluyendo \\n.',
			pattern: 'inicio.*fin',
			testText: 'inicio de texto\ncon saltos\nde línea\nfin de texto',
			expectedMatches: 1,
			hint: 'Sin "s", .* no cruza líneas. Con "s", encuentra desde "inicio" hasta "fin" aunque haya \\n en medio.',
			flags: 'gs'
		},
		{
			id: 5,
			title: 'Flag Unicode (u) - Caracteres Especiales',
			explanation:
				'El flag "u" activa el modo Unicode completo. Esencial para emojis, acentos y caracteres de otros idiomas.',
			pattern: '\\p{Emoji}',
			testText: 'Me encanta programar 💻 y tomar café ☕ mientras escucho música 🎵',
			expectedMatches: 3,
			hint: '\\p{Emoji} con flag "u" detecta emojis Unicode. Encuentra 💻, ☕ y 🎵.',
			flags: 'gu'
		},
		{
			id: 6,
			title: 'Combinando Flags - Poder Total',
			explanation:
				'Puedes combinar múltiples flags para crear búsquedas poderosas. Ejemplo: "gi" para búsqueda global sin distinción de mayúsculas.',
			pattern: '\\b[A-Z]{2,}\\b',
			testText:
				'La NASA y la ONU trabajan con USA y UK. También están la OTAN y la OMS en el proyecto.',
			expectedMatches: 6,
			hint: 'Busca palabras de solo mayúsculas (2+ letras). Con "gi" NO funcionaría bien aquí (queremos solo mayúsculas), usamos solo "g".',
			flags: 'g'
		},
		{
			id: 7,
			title: 'Caso Práctico: Extrayendo Hashtags',
			explanation:
				'Usa flags "gi" para encontrar todos los hashtags sin importar mayúsculas. Útil para análisis de redes sociales.',
			pattern: '#\\w+',
			testText:
				'Post: Me encanta #JavaScript y #Python! También uso #nodejs y #ReactJS para mis proyectos #WebDev',
			expectedMatches: 5,
			hint: 'El patrón #\\w+ encuentra hashtags. Con "g" encuentra todos, "i" no es necesario aquí pero no afecta.',
			flags: 'g'
		},
		{
			id: 8,
			title: 'Caso Práctico: Validación de Emails Flexible',
			explanation:
				'Combina flags para validaciones robustas. Aquí usamos "gi" para encontrar emails sin importar mayúsculas en el dominio.',
			pattern: '\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b',
			testText:
				'Contactos: Juan@GMAIL.com, maria@Empresa.CO, Admin@SITIO.ORG, info@startup.io',
			expectedMatches: 4,
			hint: 'El patrón usa [A-Z] pero con flag "i" también acepta minúsculas. "g" encuentra todos los emails.',
			flags: 'gi'
		}
	]
};