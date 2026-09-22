<script>
	import TiesFrame from '$lib/TiesFrame.svelte';

	let { data } = $props();
</script>

<TiesFrame db={data.db} slug={data.slug} />
