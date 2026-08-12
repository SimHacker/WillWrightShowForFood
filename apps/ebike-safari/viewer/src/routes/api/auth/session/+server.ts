import { json } from '@sveltejs/kit';
import { dbConfigured } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	return json({
		user: locals.user
			? {
					username: locals.user.username,
					displayName: locals.user.displayName
				}
			: null,
		authAvailable: dbConfigured()
	});
};
