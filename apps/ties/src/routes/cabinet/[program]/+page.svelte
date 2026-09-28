<script>
	import CabinetPage from '$lib/CabinetPage.svelte';

	let { data } = $props();
</script>

{#key data.program}
	<CabinetPage program={data.program} />
{/key}
