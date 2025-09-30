/**
 * Lesson 6: Flags and Modifiers
 * Control your regular expression behavior with flags
 */

export const flagsLesson = {
	id: 'flags',
	title: 'Flags and Modifiers',
	difficulty: 'intermediate',
	description:
		'Master regex flags to control how your patterns behave: global searches, case-insensitive matching, multiline mode and more.',
	estimatedTime: '12 minutes',
	steps: [
		{
			id: 1,
			title: 'Global Flag (g) - Find Everything',
			explanation:
				'Without the "g" flag, regex only finds the first match. With "g", it finds ALL matches in the text.',
			pattern: '\\d+',
			testText: 'I have 3 cats, 5 dogs and 12 fish at home.',
			expectedMatches: 3,
			hint: 'The pattern \\d+ searches for one or more digits. With "g" flag it will find all 3 numbers: 3, 5, and 12.',
			flags: 'g'
		},
		{
			id: 2,
			title: 'Ignore Case Flag (i) - Case Insensitive',
			explanation:
				'The "i" flag makes regex ignore the difference between uppercase and lowercase. Perfect for flexible searches.',
			pattern: 'cat',
			testText: 'My CAT is orange. Your cat is black. The Cats are awesome.',
			expectedMatches: 3,
			hint: 'Without "i" it would only find "cat" (lowercase). With "i" it finds CAT, cat and Cats.',
			flags: 'gi'
		},
		{
			id: 3,
			title: 'Multiline Flag (m) - Line Start and End',
			explanation:
				'With "m", the anchors ^ and $ work at the start/end of EACH line, not just the entire text.',
			pattern: '^\\d+',
			testText: '123 first line\nsomething in middle\n456 second line\n789 third',
			expectedMatches: 3,
			hint: '^\\d+ searches for numbers at the start. With "m" it finds at the start of each line: 123, 456, 789.',
			flags: 'gm'
		},
		{
			id: 4,
			title: 'Dotall Flag (s) - Dot Matches Everything',
			explanation:
				'Normally "." does NOT match newlines. With "s", the dot (.) matches ANY character, including \\n.',
			pattern: 'start.*end',
			testText: 'start of text\nwith line\nbreaks in\nend of text',
			expectedMatches: 1,
			hint: 'Without "s", .* doesn\'t cross lines. With "s", it finds from "start" to "end" even with \\n in between.',
			flags: 'gs'
		},
		{
			id: 5,
			title: 'Unicode Flag (u) - Special Characters',
			explanation:
				'The "u" flag enables full Unicode mode. Essential for emojis, accents and characters from other languages.',
			pattern: '\\p{Emoji}',
			testText: 'I love coding 💻 and drinking coffee ☕ while listening to music 🎵',
			expectedMatches: 3,
			hint: '\\p{Emoji} with "u" flag detects Unicode emojis. Finds 💻, ☕ and 🎵.',
			flags: 'gu'
		},
		{
			id: 6,
			title: 'Combining Flags - Full Power',
			explanation:
				'You can combine multiple flags to create powerful searches. Example: "gi" for global case-insensitive search.',
			pattern: '\\b[A-Z]{2,}\\b',
			testText:
				'NASA and UN work with USA and UK. Also NATO and WHO are in the project.',
			expectedMatches: 6,
			hint: 'Searches for uppercase-only words (2+ letters). With "gi" it wouldn\'t work well here (we want uppercase only), we use just "g".',
			flags: 'g'
		},
		{
			id: 7,
			title: 'Practical Case: Extracting Hashtags',
			explanation:
				'Use "gi" flags to find all hashtags regardless of case. Useful for social media analysis.',
			pattern: '#\\w+',
			testText:
				'Post: I love #JavaScript and #Python! I also use #nodejs and #ReactJS for my projects #WebDev',
			expectedMatches: 5,
			hint: 'The pattern #\\w+ finds hashtags. With "g" it finds all, "i" is not needed here but doesn\'t hurt.',
			flags: 'g'
		},
		{
			id: 8,
			title: 'Practical Case: Flexible Email Validation',
			explanation:
				'Combine flags for robust validations. Here we use "gi" to find emails regardless of case in the domain.',
			pattern: '\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b',
			testText:
				'Contacts: John@GMAIL.com, maria@Company.CO, Admin@WEBSITE.ORG, info@startup.io',
			expectedMatches: 4,
			hint: 'The pattern uses [A-Z] but with "i" flag it also accepts lowercase. "g" finds all emails.',
			flags: 'gi'
		}
	]
};