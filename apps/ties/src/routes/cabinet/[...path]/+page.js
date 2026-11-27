import { redirect } from '@sveltejs/kit';

export { entries } from '../../machine/[...path]/+page.js';

/**
 * The machine pages' old address. Caddy answers it with a 301 (deploy/hyperties-node.Caddyfile),
 * keeping the query; these prerendered pages are for wherever Caddy is not in front.
 */
export function load({ params }) {
	const path = (params.path ?? '').replace(/\/+$/, '');
	redirect(308, `/machine/${path ? `${path}/` : ''}`);
}
