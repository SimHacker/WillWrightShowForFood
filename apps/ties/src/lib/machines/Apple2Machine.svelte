<script>
	/** microM8's Apple II running an entry's app (packages/cabinet/disks/apple2/APPS.yml). */
	import AppleApp from './AppleApp.svelte';
	import { appleApps } from '../catalog.js';

	/** @type {{ entry: import('@wwsff/catalog').Entry, values: Record<string, unknown> }} */
	let { entry } = $props();

	const app = $derived(appleApps.get(String(entry.runs?.app ?? '')));
</script>

{#key entry.id}
	{#if app}
		<AppleApp {app} />
	{:else}
		<p>No Apple app {String(entry.runs?.app ?? '')}.</p>
	{/if}
{/key}
