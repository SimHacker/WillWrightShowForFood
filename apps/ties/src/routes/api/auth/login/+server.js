import { json } from '@sveltejs/kit';
import {
	createSession,
	newSessionToken,
	SESSION_COOKIE,
	sessionCookieOptions,
	verifyLogin
} from '$lib/server/auth.js';
import { dbConfigured } from '$lib/server/db.js';

export const prerender = false;

export async function POST({ request, cookies }) {
	if (!dbConfigured()) {
		return json({ message: 'Login is not configured' }, { status: 503 });
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ message: 'Invalid JSON' }, { status: 400 });
	}

	const username = body.username?.trim();
	const password = body.password ?? '';
	if (!username || !password) {
		return json({ message: 'Username and password required' }, { status: 400 });
	}

	const user = await verifyLogin(username, password);
	if (!user) {
		return json({ message: 'Invalid username or password' }, { status: 401 });
	}

	const token = newSessionToken();
	const expiresAt = await createSession(user.id, token);
	cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));

	return json({
		user: { username: user.username, displayName: user.displayName }
	});
}
