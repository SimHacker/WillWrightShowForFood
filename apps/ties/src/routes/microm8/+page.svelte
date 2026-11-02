<script>
	// microM8's Apple II running in the page as WebAssembly, with the cabinet's Apple disks.
	import { load as loadYaml } from 'js-yaml';
	import MicroM8 from '$lib/MicroM8.svelte';
	import catalog from '../../../../../packages/cabinet/disks/apple2/DISKS.yml?raw';

	const found = import.meta.glob(
		['../../../../../packages/cabinet/disks/apple2/**/*.{dsk,po,woz,nib,2mg}', '!**/pascal/**'],
		{ query: '?url', import: 'default' }
	);
	/** The machine each disk needs, from DISKS.yml; absent means the //e. */
	const profiles = new Map(
		/** @type {{ disks?: { file: string, profile?: string }[] }} */ (loadYaml(catalog)).disks
			?.filter((d) => d.profile)
			.map((d) => [d.file, /** @type {string} */ (d.profile)]) ?? []
	);
	const disks = Object.entries(found)
		.map(([path, load]) => {
			const name = path.split('/disks/apple2/')[1] ?? path;
			return { name, profile: profiles.get(name) ?? '', url: async () => String(await load()) };
		})
		.sort((a, b) => a.name.localeCompare(b.name));
</script>

<svelte:head>
	<title>microM8 Apple II</title>
</svelte:head>

<main>
	<h1>microM8 Apple II</h1>
	<MicroM8 {disks} />
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
