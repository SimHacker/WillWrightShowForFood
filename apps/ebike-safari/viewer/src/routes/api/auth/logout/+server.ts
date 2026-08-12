import { json } from '@sveltejs/kit';
import {
	clearSessionCookieOptions,
	deleteSession,
	SESSION_COOKIE
} from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get(SESSION_COOKIE);
	await deleteSession(token);
	cookies.set(SESSION_COOKIE, '', clearSessionCookieOptions());
	return json({ ok: true });
};
