<script>
	// The Apple II page. microM8 is one engine in the menu, not the address of the machine.
	import MicroM8 from '$lib/MicroM8.svelte';
	import { appleDisks } from '$lib/catalog.js';
</script>

<svelte:head>
	<title>Apple II</title>
</svelte:head>

<main>
	<h1>Apple II</h1>
	<MicroM8 disks={appleDisks} defaultCpu="compile" />
</main>

<style>
	main {
		padding: 1rem;
	}
	h1 {
		font: 600 1.1rem system-ui, sans-serif;
		margin: 0 0 0.75rem;
	}
</style>
