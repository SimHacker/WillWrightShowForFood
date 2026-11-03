<script>
	import CatalogShell from '$lib/CatalogShell.svelte';

	let { data } = $props();
</script>

<CatalogShell path={data.path} redirect={data.redirect} home={data.home} />
