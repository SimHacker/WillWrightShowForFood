import { json } from '@sveltejs/kit';
import { dbConfigured } from '$lib/server/db.js';

export const prerender = false;

export async function GET({ locals }) {
	return json({
		user: locals.user
			? { username: locals.user.username, displayName: locals.user.displayName }
			: null,
		authAvailable: dbConfigured()
	});
}
