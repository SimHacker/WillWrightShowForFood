<script>
	/**
	 * The PDP-7 cabinet running an entry's `runs.program`, at the entry's `size`. One applet for
	 * every PDP-7 entry: a new entry switches its program, and its program menu goes to the
	 * picked program's entry.
	 */
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { launchUrl } from '@wwsff/catalog';
	import CabinetApplet from '../CabinetApplet.svelte';
	import { cabinetSpec } from '../cabinet-url.js';
	import { CATALOG_BASE, entryForProgram } from '../catalog.js';

	/** @type {{ entry: import('@wwsff/catalog').Entry, values: Record<string, unknown> }} */
	let { entry, values } = $props();

	const program = $derived(String(entry.runs?.program ?? ''));
	const size = untrack(() => values.size);
	const spec = $derived({
		...cabinetSpec(new URLSearchParams(), program),
		...(typeof size === 'number' ? { size } : {})
	});

	/** @param {string} id */
	function onprogram(id) {
		const target = entryForProgram(id);
		if (target) goto(launchUrl(target, { values }, { base: CATALOG_BASE }));
	}
</script>

<CabinetApplet {spec} {onprogram} />
