#!/bin/bash

# Regex Playground Visual - Git Initialization Script
# Este script inicializa el repositorio Git y lo conecta con GitHub

echo "🚀 Inicializando repositorio Git para Regex Playground Visual..."

# Verificar si ya es un repositorio Git
if [ -d ".git" ]; then
    echo "⚠️  Ya existe un repositorio Git. Saltando inicialización."
else
    echo "📁 Inicializando repositorio Git..."
    git init
    echo "✅ Repositorio Git inicializado"
fi

# Agregar archivos al staging area
echo "📋 Agregando archivos al staging area..."
git add .

# Crear commit inicial
echo "💾 Creando commit inicial..."
git commit -m "🎉 Initial commit: Regex Playground Visual v1.0.0

✨ Features implemented:
- 5 interactive lessons (Basic, Character Classes, Quantifiers, Groups, Real World)
- Visual regex animations with step-by-step explanations
- Complete Spanish/English internationalization (i18n)
- Interactive playground with live pattern testing
- Responsive design for all devices
- Comprehensive testing framework (74 test cases)
- SEO optimized with meta tags and structured data
- Professional documentation and contributing guidelines

🛠️ Tech stack:
- Svelte 5 with Runes
- Tailwind CSS v4.1
- SvelteKit for routing
- Paraglide for i18n
- Tween.js for animations
- Lucide icons

📊 Project stats:
- 5 lessons covering beginner to advanced concepts
- 74 automated tests ensuring pattern accuracy
- Bilingual support (ES/EN)
- MIT License for open source collaboration

Ready for deployment to Netlify/Vercel/GitHub Pages! 🚀"

# Configurar remote origin
echo "🔗 Configurando remote origin..."
git remote add origin https://github.com/Draka/regex-playground-visual.git

echo ""
echo "✅ ¡Repositorio Git configurado correctamente!"
echo ""
echo "📤 Próximos pasos:"
echo "1. Crear el repositorio en GitHub: https://github.com/Draka/regex-playground-visual"
echo "2. Ejecutar: git push -u origin main"
echo ""
echo "🌟 ¡El proyecto está listo para ser público!"