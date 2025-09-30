# 🚀 Regex Playground Visual

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=flat&logo=svelte&logoColor=white)](https://svelte.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Interactive visual tool for learning regular expressions with step-by-step animations and gamified lessons**

> 🌟 Learn regex patterns through visual animations and interactive tutorials. Perfect for beginners and professionals who want to master regular expressions in an engaging way.

## ✨ Features

- 🎓 **5 Interactive Lessons** - From basic concepts to real-world applications
- 🎬 **Visual Animations** - See regex matching in real-time
- 🌍 **Bilingual Support** - Complete Spanish/English internationalization
- 🎮 **Gamified Learning** - Progress tracking and achievements
- 🧪 **Interactive Playground** - Test your own patterns with live feedback
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast & Modern** - Built with Svelte 5 and Tailwind CSS v4

## 🎯 Lessons Available

1. **🚀 First Steps with Regex** - Basic patterns and literal matching
2. **🔤 Character Classes** - `[a-z]`, `\d`, `\w`, `\s` and negation
3. **🔢 Quantifiers** - `+`, `*`, `?`, `{n,m}` and greedy vs lazy
4. **👥 Groups and Capture** - Advanced grouping and backreferences
5. **🌍 Real World Applications** - Emails, URLs, phones, dates, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Draka/regex-playground-visual.git
cd regex-playground-visual

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (validates all lesson patterns)
npm run test

# Format code
npm run format

# Lint code
npm run lint
```

### Testing

The project includes a comprehensive testing framework that validates all regex patterns in lessons:

```bash
npm run test:lessons
```

This ensures all 74 lesson steps work correctly across both languages.

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   │   ├── RegexEngine.svelte
│   │   ├── PlaygroundInterface.svelte
│   │   ├── LessonCard.svelte
│   │   └── LessonPlayer.svelte
│   ├── lessons/             # Lesson content (ES/EN)
│   │   ├── basicLesson.es.js
│   │   ├── characterClasses.es.js
│   │   └── ...
│   ├── utils/               # Utility functions
│   │   ├── regexEngine.js
│   │   └── lessonTester.js
│   └── paraglide/           # i18n files (auto-generated)
├── routes/                  # SvelteKit routes
│   ├── +page.svelte         # Home page
│   ├── playground/          # Interactive playground
│   └── +layout.svelte       # Global layout
└── messages/                # Translation files
    ├── es.json              # Spanish translations
    └── en.json              # English translations
```

## 🌍 Internationalization

The project uses [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for internationalization:

- **Spanish** (`/es/*`) - Complete translation
- **English** (`/en/*`) - Complete translation
- Automatic route localization
- Separate lesson content per language

## 🎨 Tech Stack

- **Frontend**: Svelte 5 with Runes
- **Styling**: Tailwind CSS v4.1
- **Routing**: SvelteKit
- **Animations**: Tween.js + Motion
- **Icons**: Lucide Svelte + Simple Icons
- **i18n**: Paraglide
- **Build**: Vite
- **Deploy**: Static adapter (Netlify/Vercel ready)

## 🚢 Deployment

The project is configured for static deployment:

```bash
npm run build
```

The built files will be in the `build/` directory, ready for deployment to:

- **Netlify**: Drag and drop `build` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use GitHub Actions
- **Any static hosting**: Upload `build` folder contents

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Adding New Lessons

1. Create lesson files in `src/lib/lessons/`:
   ```javascript
   // newLesson.es.js & newLesson.en.js
   export const newLesson = {
     id: 'new-lesson',
     title: 'Lesson Title',
     difficulty: 'intermediate',
     steps: [/* lesson steps */]
   }
   ```

2. Add to lesson index in `src/lib/lessons/index.js`

3. Run tests: `npm run test:lessons`

### Improving Translations

1. Edit `messages/es.json` or `messages/en.json`
2. Translations compile automatically during development and build
3. Test in both languages

### Development Guidelines

- Follow existing code style
- Add JSDoc comments to functions
- Test all lesson patterns thoroughly
- Maintain responsive design
- Update documentation

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Bundle Size**: < 200KB gzipped
- **First Contentful Paint**: < 1.2s
- **Interactive**: < 2s

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pixel Du Nord** - Original concept and development
- **Svelte Team** - Amazing framework
- **Tailwind CSS** - Utility-first CSS framework
- **Paraglide** - Internationalization solution
- **Community** - Thanks to all contributors!

## 🌟 Show Your Support

If you find this project helpful, please:

- ⭐ Star the repository
- 🐛 Report bugs or request features
- 🔀 Submit pull requests
- 📢 Share with others learning regex

---

**Made with ❤️ by [Pixel Du Nord](https://github.com/pixeldunord)**

*Learn regex visually, master it practically!*