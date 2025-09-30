import { paraglideMiddleware } from '$lib/paraglide/server';

// @ts-ignore
const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			// @ts-ignore
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle = handleParaglide;
