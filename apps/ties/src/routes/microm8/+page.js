import { redirect } from '@sveltejs/kit';

// Prerender cannot read the query string. /microm8/ is the old address of this page;
// microM8 the engine is /apple2/?cpu=microm8.
export function load() {
	redirect(308, '/apple2/');
}
