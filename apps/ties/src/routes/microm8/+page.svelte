<script>
	// microM8's Apple II running in the page as WebAssembly, with every Apple disk in the catalog.
	import MicroM8 from '$lib/MicroM8.svelte';
	import { appleDisks } from '$lib/catalog.js';
</script>

<svelte:head>
	<title>microM8 Apple II</title>
</svelte:head>

<main>
	<h1>microM8 Apple II</h1>
	<MicroM8 disks={appleDisks} />
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
