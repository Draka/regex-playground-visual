export const characterClassesLesson = {
	id: 'character-classes',
	title: 'Character Classes',
	description: 'Learn to use ranges, groups and predefined classes like [a-z], \\d, \\w and \\s to make more flexible patterns.',
	difficulty: 'intermediate',
	steps: [
		{
			id: 'step1',
			title: 'Letter ranges [a-z]',
			explanation: 'Square brackets [] create a character class. [a-z] matches any lowercase letter from a to z.',
			pattern: '[a-z]',
			testText: 'Hello World 123 ABC xyz',
			expectedMatches: 11,
			tip: 'Ranges use the dash - to indicate from-to. [a-z] means "any letter from a to z".'
		},
		{
			id: 'step2',
			title: 'Number ranges [0-9]',
			explanation: '[0-9] matches any digit from 0 to 9. Very useful for finding numbers in text.',
			pattern: '[0-9]',
			testText: 'I am 25 years old and live in 2024. My phone is 555-123-4567.',
			expectedMatches: 16,
			tip: 'You can also use partial ranges like [0-5] for digits from 0 to 5 only.'
		},
		{
			id: 'step3',
			title: 'Multiple ranges [a-zA-Z0-9]',
			explanation: 'You can combine multiple ranges in a single class. [a-zA-Z0-9] matches lowercase, uppercase letters and numbers.',
			pattern: '[a-zA-Z0-9]',
			testText: 'User123 has an email: john@example.com and lives in 2024!',
			expectedMatches: 45,
			tip: 'Order inside [] doesn\'t matter. [0-9a-z] is the same as [a-z0-9].'
		},
		{
			id: 'step4',
			title: 'Digit class \\d',
			explanation: '\\d is a shorthand for [0-9]. It\'s shorter and easier to write for matching any digit.',
			pattern: '\\d',
			testText: 'The code is 4829 and the date is 15/03/2024. Price: $199.99',
			expectedMatches: 17,
			tip: '\\d is equivalent to [0-9]. Use whichever is clearer in each case.'
		},
		{
			id: 'step5',
			title: 'Word class \\w',
			explanation: '\\w matches "word" characters: letters, numbers and underscore. Equivalent to [a-zA-Z0-9_].',
			pattern: '\\w',
			testText: 'my_variable = "Hello_World123" and other_var = 456;',
			expectedMatches: 40,
			tip: '\\w includes underscore _, very useful for variable names and identifiers.'
		},
		{
			id: 'step6',
			title: 'Whitespace \\s',
			explanation: '\\s matches any whitespace character: spaces, tabs, line breaks.',
			pattern: '\\s',
			testText: 'Hello\tWorld\nThis is a\r\ntest with spaces.',
			expectedMatches: 8,
			tip: '\\s includes normal space, tab (\\t), newline (\\n) and carriage return (\\r).'
		},
		{
			id: 'step7',
			title: 'Negation with ^',
			explanation: 'The ^ symbol at the start of a class negates it. [^0-9] matches any character that is NOT a digit.',
			pattern: '[^0-9]',
			testText: 'Code ABC123 with symbols @#$ and spaces',
			expectedMatches: 36,
			tip: 'Negation ^ only works at the START of the class. [0-9^] would search for digits OR the ^ symbol.'
		},
		{
			id: 'step8',
			title: 'Literal special characters',
			explanation: 'To search for special characters like [ ] - inside a class, sometimes you need to escape them with \\.',
			pattern: '[\\[\\]]',
			testText: 'Arrays: arr[0], arr[1], obj["key"] and more [elements]',
			expectedMatches: 8,
			tip: 'Inside [] some characters lose their special meaning, but [ ] and - need escaping.'
		}
	]
};