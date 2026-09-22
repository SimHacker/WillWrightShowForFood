import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getDb } from './db.js';

export const SESSION_COOKIE = 'hyperties_session';
const SESSION_DAYS = 30;

function hashToken(token) {
	return createHash('sha256').update(token).digest('hex');
}

export function newSessionToken() {
	return randomBytes(32).toString('hex');
}

export async function verifyLogin(username, password) {
	const sql = getDb();
	if (!sql) return null;

	const rows = await sql`
		SELECT id, username, display_name, password_hash
		FROM users
		WHERE username = ${username.trim().toLowerCase()}
		LIMIT 1
	`;

	const row = rows[0];
	if (!row || !(await bcrypt.compare(password, row.password_hash))) {
		return null;
	}

	return {
		id: row.id,
		username: row.username,
		displayName: row.display_name
	};
}

export async function createSession(userId, token) {
	const sql = getDb();
	if (!sql) throw new Error('Database not configured');

	const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

	await sql`
		INSERT INTO sessions (user_id, token_hash, expires_at)
		VALUES (${userId}, ${hashToken(token)}, ${expiresAt})
	`;

	return expiresAt;
}

export async function deleteSession(token) {
	if (!token) return;
	const sql = getDb();
	if (!sql) return;

	await sql`
		DELETE FROM sessions
		WHERE token_hash = ${hashToken(token)}
	`;
}

export async function getSessionUser(token) {
	if (!token) return null;
	const sql = getDb();
	if (!sql) return null;

	const rows = await sql`
		SELECT u.id, u.username, u.display_name, s.expires_at
		FROM sessions s
		JOIN users u ON u.id = s.user_id
		WHERE s.token_hash = ${hashToken(token)}
		LIMIT 1
	`;

	const row = rows[0];
	if (!row) return null;

	if (new Date(row.expires_at).getTime() <= Date.now()) {
		await deleteSession(token);
		return null;
	}

	return {
		id: row.id,
		username: row.username,
		displayName: row.display_name
	};
}

export function sessionCookieOptions(expiresAt) {
	const secure = process.env.NODE_ENV === 'production';
	return {
		path: '/',
		httpOnly: true,
		secure,
		sameSite: 'lax',
		expires: expiresAt
	};
}

export function clearSessionCookieOptions() {
	const secure = process.env.NODE_ENV === 'production';
	return {
		path: '/',
		httpOnly: true,
		secure,
		sameSite: 'lax',
		maxAge: 0
	};
}
