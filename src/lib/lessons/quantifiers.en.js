export const quantifiersLesson = {
	id: 'quantifiers',
	title: 'Quantifiers - The Power of Repetition',
	description: 'Master +, *, ?, {n}, {n,m} to create dynamic patterns that adapt to different amounts of characters.',
	difficulty: 'intermediate',
	steps: [
		{
			id: 'step1',
			title: 'The Greedy Plus (+) - One or More',
			explanation: 'The + symbol means "one or more" of the preceding element. \\d+ finds one or more consecutive digits, perfect for complete numbers.',
			pattern: '\\d+',
			testText: 'I am 25 years old, work 8 hours and earn $1500 monthly. My code is A123B456.',
			expectedMatches: 5,
			tip: '+ is "greedy" - takes the longest possible match. \\d+ prefers "1500" over separate "1", "5", "0", "0".'
		},
		{
			id: 'step2',
			title: 'The Optional (?) - Zero or One',
			explanation: 'The ? symbol makes the preceding element optional. https? finds both "http" and "https", very useful for flexible URLs.',
			pattern: 'https?://',
			testText: 'Visit https://example.com and also http://test.org for more information.',
			expectedMatches: 2,
			tip: '? is perfect for optional parts like "s" in https, "www" in URLs, or optional plurals.'
		},
		{
			id: 'step3',
			title: 'The Wildcard (*) - Zero or More',
			explanation: 'The * symbol means "zero or more" of the preceding element. \\w* finds any amount of word characters, even none.',
			pattern: 'test\\w*',
			testText: 'Run test, testing, tester and tests. Also try testable and testing.',
			expectedMatches: 6,
			tip: '* is the most flexible - can match nothing and still be valid. Use it for highly variable patterns.'
		},
		{
			id: 'step4',
			title: 'Exact {n} - Fixed Repetition',
			explanation: '{n} specifies exactly n repetitions. \\d{4} finds exactly 4 digits, ideal for years, postal codes.',
			pattern: '\\d{4}',
			testText: 'The year 2024, postal code 12345, PIN 1234 and the number 999 are examples.',
			expectedMatches: 3,
			tip: '{n} is very specific - no more, no less. Perfect when you know the exact length you need.'
		},
		{
			id: 'step5',
			title: 'Range {n,m} - Between n and m',
			explanation: '{n,m} specifies between n and m repetitions. \\w{3,8} finds sequences of 3 to 8 word characters, useful for valid usernames.',
			pattern: '\\w{3,8}',
			testText: 'Users: Ana, Peter, Alexander, MariaFernanda123, José, X, SuperLongUsername.',
			expectedMatches: 9,
			tip: '{n,m} is perfect for validations - usernames, passwords, codes that have specific ranges.'
		},
		{
			id: 'step6',
			title: 'Minimum {n,} - At Least n',
			explanation: '{n,} specifies at least n repetitions, with no upper limit. \\d{3,} finds numbers with at least 3 digits.',
			pattern: '\\d{3,}',
			testText: 'Numbers: 12, 345, 6789, 1000000, 99 and 42 are in the text.',
			expectedMatches: 3,
			tip: '{n,} is useful when you have a minimum but the maximum doesn\'t matter - IDs, large numbers, etc.'
		},
		{
			id: 'step7',
			title: 'Lazy vs Greedy - .*? vs .*',
			explanation: 'By default quantifiers are "greedy" (take the maximum). Adding ? makes them "lazy" (take the minimum). Crucial for parsing.',
			pattern: '<.+?>',
			testText: '<h1>Title</h1> and <p>paragraph</p> are HTML elements.',
			expectedMatches: 4,
			tip: 'Without ?, it would be <.+> and would take from the first < to the last >, not what we want for HTML tags.'
		},
		{
			id: 'step8',
			title: 'Master Combinations - Real Patterns',
			explanation: 'Combine quantifiers for powerful patterns. This basic email pattern uses + for name, domain and extension.',
			pattern: '\\w+@\\w+\\.\\w{2,4}',
			testText: 'Contacts: john@example.com, maria.garcia@test.org, admin@site.co.uk, invalid@.com',
			expectedMatches: 3,
			tip: 'Combined quantifiers create professional patterns. This is the foundation of complex validations.'
		}
	]
};