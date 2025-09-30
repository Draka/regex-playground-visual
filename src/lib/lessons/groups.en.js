export const groupsLesson = {
	id: 'groups',
	title: 'Groups and Capture - Ninja Level Regex',
	description: 'Unlock the advanced power of capture, references and lookahead/lookbehind to create professional patterns.',
	difficulty: 'advanced',
	steps: [
		{
			id: 'step1',
			title: 'Basic Groups () - Grouping Elements',
			explanation: 'Parentheses () group elements. (abc)+ repeats the entire "abc" sequence, not just the "c".',
			pattern: '(ha)+',
			testText: 'Laughing: hehehe, hahaha, hohoho, hihihi, haha and he he he.',
			expectedMatches: 2,
			tip: 'Groups are fundamental - they allow quantifiers to apply to complete sequences instead of single characters.'
		},
		{
			id: 'step2',
			title: 'Capture and Data Extraction',
			explanation: 'Groups capture data for extraction. (\\d{2})/(\\d{2})/(\\d{4}) captures day, month and year separately.',
			pattern: '(\\d{2})/(\\d{2})/(\\d{4})',
			testText: 'Important dates: 15/03/2024, 08/12/2023 and 31/12/1999.',
			expectedMatches: 3,
			tip: 'Each group in () becomes a "capture" you can use later - perfect for extracting structured data.'
		},
		{
			id: 'step3',
			title: 'Non-Capturing Groups (?:) - Grouping Only',
			explanation: '(?:) groups without capturing. (?:www\\.)? makes "www." optional without creating an extra capture.',
			pattern: '(?:www\\.)?[a-z]+\\.com',
			testText: 'Sites: example.com, www.test.com, demo.com and www.sample.com',
			expectedMatches: 4,
			tip: 'Use (?:) when you need grouping but not capturing - keeps the pattern clean and efficient.'
		},
		{
			id: 'step4',
			title: 'Backreferences \\1 - Detecting Repetitions',
			explanation: '\\1 refers to the first captured group. (\\w+)\\s+\\1 finds consecutive duplicate words.',
			pattern: '(\\w+)\\s+\\1',
			testText: 'Errors: the the code has duplicate duplicate words and and mistakes.',
			expectedMatches: 3,
			tip: 'Backreferences \\1, \\2, etc. are super powerful for finding patterns that repeat exactly.'
		},
		{
			id: 'step5',
			title: 'Alternatives | - Multiple Options',
			explanation: '| means "or". (cat|dog|bird) finds any of the three words.',
			pattern: '(cat|dog|bird)',
			testText: 'Pets: I have a cat, my sister has a dog and my cousin has a bird.',
			expectedMatches: 3,
			tip: 'Alternatives are perfect for lists of valid options - names, codes, categories, etc.'
		},
		{
			id: 'step6',
			title: 'Positive Lookahead (?=) - "Followed by"',
			explanation: '(?=) checks that something follows WITHOUT including it in the match. \\d+(?=€) finds numbers before €.',
			pattern: '\\d+(?=€)',
			testText: 'Prices: 25€, 100$, 50€, 75£ and 200€ in the store.',
			expectedMatches: 3,
			tip: 'Lookahead is great for conditions - "I want numbers, but only if followed by €".'
		},
		{
			id: 'step7',
			title: 'Negative Lookahead (?!) - "NOT followed by"',
			explanation: '(?!) checks that something does NOT follow. \\d+(?!€) finds numbers NOT followed by €.',
			pattern: '\\d+(?!€)',
			testText: 'Prices: 25€, 100$, 50€, 75£ and 200€ in the store.',
			expectedMatches: 5,
			tip: 'Negative lookahead is perfect for exclusions - "I want numbers, but NOT those with €".'
		},
		{
			id: 'step8',
			title: 'Real Complex Regex - Professional Validator',
			explanation: 'Combines everything: groups, alternatives and lookahead for a professional password validator.',
			pattern: '\\b(?=\\w*[a-z])(?=\\w*[A-Z])(?=\\w*\\d)\\w{8,}\\b',
			testText: 'abc123 Password1 ALLCAPS123 lowercase Password123 Test1234',
			expectedMatches: 3,
			tip: 'This pattern uses multiple lookaheads to verify: lowercase, uppercase, digit and minimum 8 characters.'
		}
	]
};