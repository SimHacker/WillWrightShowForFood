import {
	getSessionUser,
	SESSION_COOKIE
} from '$lib/server/auth';

export async function handle({ event, resolve }) {
	const token = event.cookies.get(SESSION_COOKIE);
	event.locals.user = await getSessionUser(token);
	const response = await resolve(event);
	if (event.url.pathname.startsWith('/data/')) {
		response.headers.set('Cache-Control', 'no-store');
	}
	return response;
}
