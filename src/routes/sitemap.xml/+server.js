// Prerender this route for static generation
export const prerender = true;

export async function GET() {
	const baseUrl = 'https://regex.pixeldunord.com';
	const lastmod = new Date().toISOString().split('T')[0];

	// URLs principales en ambos idiomas
	const urls = [
		// Página principal
		{ loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
		{ loc: `${baseUrl}/es/`, priority: '1.0', changefreq: 'weekly' },

		// Playground interactivo
		{ loc: `${baseUrl}/playground/`, priority: '0.9', changefreq: 'weekly' },
		{ loc: `${baseUrl}/es/playground/`, priority: '0.9', changefreq: 'weekly' },

		// Página inglés directa
		{ loc: `${baseUrl}/en/`, priority: '0.8', changefreq: 'weekly' },
		{ loc: `${baseUrl}/en/playground/`, priority: '0.8', changefreq: 'weekly' },
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
	${urls.map(url => `
	<url>
		<loc>${url.loc}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${url.changefreq}</changefreq>
		<priority>${url.priority}</priority>
		${generateAlternateLinks(url.loc, baseUrl)}
	</url>`).join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
}

// Helper function para generar enlaces alternativos multiidioma
function generateAlternateLinks(currentUrl, baseUrl) {
	// Detectar si es español o inglés
	const isSpanish = currentUrl.includes('/es/');
	const isEnglish = currentUrl.includes('/en/');
	const path = currentUrl.replace(baseUrl, '').replace(/^\/(es|en)\//, '/');

	let links = '';

	if (!isSpanish) {
		// Agregar enlace a versión en español
		const spanishUrl = `${baseUrl}/es${path === '/' ? '/' : path}`;
		links += `\n\t\t<xhtml:link rel="alternate" hreflang="es" href="${spanishUrl}" />`;
	}

	if (!isEnglish && !currentUrl.endsWith('/')) {
		// Agregar enlace a versión en inglés
		const englishUrl = `${baseUrl}/en${path === '/' ? '/' : path}`;
		links += `\n\t\t<xhtml:link rel="alternate" hreflang="en" href="${englishUrl}" />`;
	}

	// Enlace hreflang por defecto (inglés)
	if (isSpanish) {
		const defaultUrl = `${baseUrl}${path === '/' ? '/' : path}`;
		links += `\n\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`;
	}

	return links;
}