// Finding a control or panel's home in the outline, from its copy in the toolbar: the outline
// nodes on the way to it open (each Outline watches `reveal`), then the home is scrolled to
// the middle of the window, flashed, and focused. A home is the element with its
// `data-home`; a node closed until now renders it only after it opens, hence the waits.

import { tick } from 'svelte';

export const reveal = $state({ ids: /** @type {string[]} */ ([]), n: 0 });

/** @param {string[]} path the outline node ids from the top down @param {string} home */
export async function seekHome(path, home) {
	reveal.ids = path;
	reveal.n++;
	for (let i = 0; i <= path.length; i++) await tick();
	requestAnimationFrame(() => {
		reveal.ids = [];
		const el = document.querySelector(`[data-home="${CSS.escape(home)}"]`);
		if (!(el instanceof HTMLElement)) return;
		const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
		el.scrollIntoView({ block: 'center', behavior: still ? 'auto' : 'smooth' });
		const first = el.querySelector('button, input, select');
		if (first instanceof HTMLElement) first.focus({ preventScroll: true });
		el.animate([{ boxShadow: '0 0 0 3px #48f' }, { boxShadow: '0 0 0 3px transparent' }], { duration: still ? 1 : 1600, easing: 'ease-out' });
	});
}
