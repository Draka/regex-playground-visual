// Prerender this route for static generation
export const prerender = true;

export async function GET() {
	const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://regex.pixeldunord.com/sitemap.xml

# Block common non-content paths
Disallow: /api/
Disallow: /_app/
Disallow: /.*\\.json$`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain',
		},
	});
}