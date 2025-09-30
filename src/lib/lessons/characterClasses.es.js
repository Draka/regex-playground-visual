export const characterClassesLesson = {
	id: 'character-classes',
	title: 'Clases de Caracteres',
	description: 'Aprende a usar rangos, grupos y clases predefinidas como [a-z], \\d, \\w y \\s para hacer patrones más flexibles.',
	difficulty: 'intermediate',
	steps: [
		{
			id: 'step1',
			title: 'Rangos de letras [a-z]',
			explanation: 'Los corchetes [] crean una clase de caracteres. [a-z] encuentra cualquier letra minúscula de la a a la z.',
			pattern: '[a-z]',
			testText: 'Hola Mundo 123 ABC xyz',
			expectedMatches: 10,
			tip: 'Los rangos usan el guión - para indicar desde-hasta. [a-z] significa "cualquier letra de la a a la z".'
		},
		{
			id: 'step2',
			title: 'Rangos de números [0-9]',
			explanation: '[0-9] encuentra cualquier dígito del 0 al 9. Es muy útil para encontrar números en texto.',
			pattern: '[0-9]',
			testText: 'Tengo 25 años y vivo en el 2024. Mi teléfono es 555-123-4567.',
			expectedMatches: 16,
			tip: 'También puedes usar rangos parciales como [0-5] para dígitos del 0 al 5 solamente.'
		},
		{
			id: 'step3',
			title: 'Múltiples rangos [a-zA-Z0-9]',
			explanation: 'Puedes combinar múltiples rangos en una sola clase. [a-zA-Z0-9] encuentra letras minúsculas, mayúsculas y números.',
			pattern: '[a-zA-Z0-9]',
			testText: 'Usuario123 tiene un email: juan@ejemplo.com y vive en 2024!',
			expectedMatches: 47,
			tip: 'El orden dentro de [] no importa. [0-9a-z] es igual a [a-z0-9].'
		},
		{
			id: 'step4',
			title: 'Clase de dígitos \\d',
			explanation: '\\d es una abreviación para [0-9]. Es más corta y fácil de escribir para encontrar cualquier dígito.',
			pattern: '\\d',
			testText: 'El código es 4829 y la fecha es 15/03/2024. Precio: $199.99',
			expectedMatches: 17,
			tip: '\\d es equivalente a [0-9]. Usa la que te resulte más clara en cada caso.'
		},
		{
			id: 'step5',
			title: 'Clase de letras \\w',
			explanation: '\\w encuentra caracteres de "palabra": letras, números y guión bajo. Equivale a [a-zA-Z0-9_].',
			pattern: '\\w',
			testText: 'mi_variable = "Hola_Mundo123" y otra_var = 456;',
			expectedMatches: 36,
			tip: '\\w incluye el guión bajo _, muy útil para nombres de variables y identificadores.'
		},
		{
			id: 'step6',
			title: 'Espacios en blanco \\s',
			explanation: '\\s encuentra cualquier espacio en blanco: espacios, tabulaciones, saltos de línea.',
			pattern: '\\s',
			testText: 'Hola\tMundo\nEsto es una\r\nprueba con espacios.',
			expectedMatches: 8,
			tip: '\\s incluye espacio normal, tabulación (\\t), salto de línea (\\n) y retorno de carro (\\r).'
		},
		{
			id: 'step7',
			title: 'Negación con ^',
			explanation: 'El símbolo ^ al inicio de una clase la niega. [^0-9] encuentra cualquier carácter que NO sea un dígito.',
			pattern: '[^0-9]',
			testText: 'Código ABC123 con símbolos @#$ y espacios',
			expectedMatches: 38,
			tip: 'La negación ^ solo funciona al INICIO de la clase. [0-9^] buscaría dígitos O el símbolo ^.'
		},
		{
			id: 'step8',
			title: 'Caracteres especiales literales',
			explanation: 'Para buscar caracteres especiales como [ ] - dentro de una clase, a veces necesitas escaparlos con \\.',
			pattern: '[\\[\\]]',
			testText: 'Arrays: arr[0], arr[1], obj["key"] y más [elementos]',
			expectedMatches: 8,
			tip: 'Dentro de [] algunos caracteres pierden su significado especial, pero [ ] y - necesitan escape.'
		}
	]
};