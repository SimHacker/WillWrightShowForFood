import { redirect } from '@sveltejs/kit';

/** The Apple page lives at /apple2. microM8 is an engine on that page, chosen with ?cpu=microm8. */
export function load({ url }) {
	redirect(308, `/apple2${url.search}`);
}
