import { json } from '@sveltejs/kit';
import { clearSessionCookieOptions, deleteSession, SESSION_COOKIE } from '$lib/server/auth.js';

export const prerender = false;

export async function POST({ cookies }) {
	await deleteSession(cookies.get(SESSION_COOKIE));
	cookies.set(SESSION_COOKIE, '', clearSessionCookieOptions());
	return json({ ok: true });
}
