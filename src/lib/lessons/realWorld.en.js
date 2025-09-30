/**
 * Lesson 5: Real World Applications
 * Useful regex patterns for common validations in web development
 */

export const realWorldLesson = {
  id: 'real-world',
  title: 'Real World Applications',
  difficulty: 'intermediate',
  description: 'Learn useful regex patterns for common validations: emails, URLs, phones, dates and more.',
  estimatedTime: '15 minutes',
  steps: [
    {
      id: 1,
      title: 'Basic Email Validation',
      explanation: 'A simple but effective pattern to validate email addresses. Looks for: text + @ + domain + extension.',
      pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      testText: 'Contacts: john@gmail.com, mary_lopez@company.co, admin@web-site.org, invalid@.com, @nodomain.com',
      expectedMatches: 3,
      hint: 'Valid emails have text before and after the @, and a domain with at least 2 characters in the extension.'
    },
    {
      id: 2,
      title: 'URLs and Websites',
      explanation: 'Detects complete URLs starting with http:// or https://. Useful for finding links in text.',
      pattern: 'https?://[A-Za-z0-9.-]+\\.[A-Za-z]{2,}(?:/[A-Za-z0-9._~:/?#[\\]@!$&\'()*+,;=-]*)?',
      testText: 'Visit https://google.com or http://example.org/page?id=123. There\'s also ftp://file.com',
      expectedMatches: 2,
      hint: 'The pattern looks for http:// or https:// followed by a valid domain and optionally a path.'
    },
    {
      id: 3,
      title: 'Phone Numbers',
      explanation: 'Finds phone numbers in different formats: with or without country codes, with spaces, hyphens or parentheses.',
      pattern: '(?:\\+?\\d{1,3}[\\s.-]?)?(?:\\(?\\d{3}\\)?[\\s.-]?)?\\d{3}[\\s.-]?\\d{4}',
      testText: 'Call +1 555 1234-5678, (555) 123-4567, 555.123.4567 or simply 5551234567',
      expectedMatches: 4,
      hint: 'The pattern is flexible: optional country code, optional area with parentheses, and numbers with variable separators.'
    },
    {
      id: 4,
      title: 'Dates in DD/MM/YYYY Format',
      explanation: 'Validates dates in day/month/year format. Accepts separators like /, - or dots.',
      pattern: '\\b(?:0?[1-9]|[12]\\d|3[01])[/.-](?:0?[1-9]|1[0-2])[/.-](?:19|20)\\d{2}\\b',
      testText: 'Important dates: 15/03/2024, 01-12-2023, 31.01.2022, 40/15/2024 (invalid), 15/3/24 (short year)',
      expectedMatches: 3,
      hint: 'Validates days 01-31, months 01-12, years 1900-2099. Date 40/15/2024 is invalid for having impossible day and month.'
    },
    {
      id: 5,
      title: 'ZIP Codes (5 digits)',
      explanation: 'US ZIP codes have exactly 5 digits. Useful for address forms.',
      pattern: '\\b\\d{5}\\b',
      testText: 'ZIP codes: 01234, 54321, 99999, 1234 (too short), 123456 (too long), ZIP: 90210',
      expectedMatches: 4,
      hint: 'Exactly 5 consecutive digits. Codes 1234 and 123456 don\'t meet the format.'
    },
    {
      id: 6,
      title: 'Credit Cards (Visa)',
      explanation: 'Detects Visa card numbers starting with 4 and having 16 digits. With or without spaces.',
      pattern: '4\\d{3}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}',
      testText: 'Cards: 4532 1234 5678 9012, 4532-1234-5678-9012, 4532123456789012, 5432123456789012 (MasterCard)',
      expectedMatches: 3,
      hint: 'Visa always starts with 4. MasterCard starts with 5, so it doesn\'t match our pattern.'
    },
    {
      id: 7,
      title: 'Social Media Hashtags',
      explanation: 'Finds hashtags like on Twitter/X: # followed by letters, numbers and underscores.',
      pattern: '#[A-Za-z0-9_]+',
      testText: 'Popular posts: #JavaScript #regex_tutorial #HTML5 #CSS3 #2024trends. Symbol only: #',
      expectedMatches: 5,
      hint: 'A hashtag must have at least one character after the #. The # symbol alone doesn\'t count.'
    },
    {
      id: 8,
      title: 'IPv4 Addresses',
      explanation: 'Validates IPv4 format IP addresses: 4 numbers from 0-255 separated by dots.',
      pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\b',
      testText: 'IPs: 192.168.1.1, 127.0.0.1, 255.255.255.255, 192.168.300.1 (invalid), 192.168.1',
      expectedMatches: 3,
      hint: 'Each octet must be between 0-255. IP 192.168.300.1 is invalid because 300 > 255.'
    }
  ]
};