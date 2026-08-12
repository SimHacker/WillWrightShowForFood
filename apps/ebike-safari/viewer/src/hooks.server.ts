import {
	getSessionUser,
	SESSION_COOKIE
} from '$lib/server/auth';

export async function handle({ event, resolve }) {
	const token = event.cookies.get(SESSION_COOKIE);
	event.locals.user = await getSessionUser(token);
	return resolve(event);
}
