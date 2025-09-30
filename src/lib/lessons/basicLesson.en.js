/** @type {import('$lib/types.js').Lesson} */
export const basicLessonEn = {
	id: 'basic-regex',
	title: 'First Steps with Regex',
	description: 'Learn the basics of regular expressions with simple and fun examples.',
	difficulty: 'beginner',
	steps: [
		{
			id: 'step-1',
			title: 'Hello Regex! 👋',
			explanation: `
				Regular expressions (regex) are patterns that help us search for specific text.

				Imagine you're a detective looking for clues in text. Regex is your special magnifying glass
				that helps you find exactly what you're looking for.

				Let's start with something super simple: searching for the word "cat" in text.
			`,
			pattern: 'cat',
			testText: 'My cat is very playful. The cat sleeps all day. That cat is awesome!',
			expectedMatches: 3,
			tips: [
				'The regex will search for exactly the word "cat"',
				'Notice it finds ALL occurrences',
				'It\'s case-sensitive'
			]
		},
		{
			id: 'step-2',
			title: 'Special Characters: The Dot 🔍',
			explanation: `
				The dot (.) is a special character that means "any character".

				It's like a wildcard that can be any letter, number, or symbol.

				For example, "c.t" will find "cat", "cot", "cut", "c7t", etc.
			`,
			pattern: 'c.t',
			testText: 'cat cot cut c7t cit c@t',
			expectedMatches: 6,
			tips: [
				'The dot (.) matches ANY character',
				'It only matches ONE character, no more',
				'Very useful when you don\'t know exactly which character to expect'
			]
		},
		{
			id: 'step-3',
			title: 'Repetition: The Asterisk 🌟',
			explanation: `
				The asterisk (*) means "zero or more times the previous character".

				It's like saying "it might appear, it might not, or it might appear many times".

				For example, "go*gle" will find "ggle", "gogle", "google", "gooogle", etc.
			`,
			pattern: 'go*gle',
			testText: 'ggle gogle google gooogle goooogle',
			expectedMatches: 5,
			tips: [
				'The * applies only to the immediately preceding character',
				'Zero occurrences also counts as a match',
				'Very useful for word variations'
			]
		},
		{
			id: 'step-4',
			title: 'Magic Numbers 🔢',
			explanation: `
				\\d is a special shortcut that means "any digit from 0 to 9".

				It's like having a super specific number detector.

				For example, "\\d\\d\\d" will find any sequence of exactly 3 numbers.
			`,
			pattern: '\\d\\d\\d',
			testText: 'Call 123 or 987. The code is 789, not 12 or 67.',
			expectedMatches: 3,
			tips: [
				'\\d is equivalent to [0-9]',
				'Each \\d represents exactly ONE digit',
				'Perfect for searching phone numbers, codes, etc.'
			]
		},
		{
			id: 'step-5',
			title: 'The Final Challenge 🏆',
			explanation: `
				Now you're a basic regex expert!

				Let's combine everything you've learned:
				- Literal text
				- The dot (.)
				- The asterisk (*)
				- Numbers (\\d)

				Your mission: find codes that start with "CODE", followed by any amount
				of letters (no spaces), and end with exactly 2 numbers.
			`,
			pattern: 'CODE[A-Z]*\\d\\d',
			testText: 'CODE123 CODEX99 CODEABC12 CODE77',
			expectedMatches: 4,
			tips: [
				'CODE searches for exactly that word',
				'[A-Z]* means "any uppercase letter, zero or more times"',
				'\\d\\d are exactly two digits at the end',
				'Spaces separate the matches, so we find 4 distinct codes'
			]
		}
	]
};