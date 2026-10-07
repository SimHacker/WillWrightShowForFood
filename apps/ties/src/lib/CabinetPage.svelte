<script>
	/** The cabinet alone on the page: no article, no HyperTIES frame. */
	import { onMount } from 'svelte';
	import CabinetApplet from './CabinetApplet.svelte';
	import { cabinetSpec } from './cabinet-url.js';
	import { PROGRAMS, programById } from './cabinet-programs.js';

	let { program = null } = $props();

	let spec = $state(null);
	let failed = $state(null);
	const title = $derived(programById(spec?.program ?? program)?.label ?? 'PDP-7');

	onMount(() => {
		try {
			spec = cabinetSpec(new URLSearchParams(location.search), program);
		} catch (e) {
			failed = e instanceof Error ? e.message : String(e);
		}
	});
</script>

<svelte:head>
	<title>{title} — PDP-7 cabinet</title>
</svelte:head>

<main class="bare">
	{#if spec}
		<CabinetApplet {spec} />
	{:else if failed}
		<p>{failed}. Programs: {PROGRAMS.map((p) => p.id).join(', ')}.</p>
	{:else}
		<p>Loading the PDP-7…</p>
	{/if}
</main>

<style>
	.bare {
		margin: 0;
		padding: 0;
	}
	.bare > :global(.cabinet-applet) {
		margin: 0;
	}
	:global(html) {
		scrollbar-gutter: stable;
	}
	:global(html:has(main.bare)),
	:global(body:has(main.bare)) {
		background: #000;
	}
	:global(html:has(main.bare)) {
		color-scheme: dark;
		scrollbar-color: #2f5a30 #000;
	}
	:global(html:has(main.bare) ::-webkit-scrollbar) {
		width: 12px;
		height: 12px;
		background: #000;
	}
	:global(html:has(main.bare) ::-webkit-scrollbar-thumb) {
		background: #2f5a30;
		border: 3px solid #000;
		border-radius: 6px;
	}
	:global(html:has(main.bare) ::-webkit-scrollbar-thumb:hover) {
		background: #9fe8a0;
	}
</style>
