import { json } from '@sveltejs/kit';

export const prerender = false;

/** Saved views need a table. Not yet. */
export async function GET() {
	return json({ message: 'views are not stored yet' }, { status: 501 });
}

export async function PUT() {
	return json({ message: 'views are not stored yet' }, { status: 501 });
}
