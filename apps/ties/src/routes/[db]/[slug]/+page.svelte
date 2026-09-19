<script>
	/**
	 * A deep link. The route seeds the pile and then gets out of the way: navigation from
	 * here is the pile's, so RETURN pops the visit path rather than the address bar.
	 *
	 * The path is seeded with this article alone, not with home underneath it. Arriving by
	 * link is not the same as having been home first, and RETURN should not claim you were.
	 */
	import Piles from '$lib/Piles.svelte';
	import { Browser } from '$lib/pile.svelte.js';

	let { data } = $props();

	function seed(db, slug) {
		const browser = new Browser();
		browser.contents.go(db, slug);
		return browser;
	}

	// Rebuilt only when the route changes, so navigating inside the pile keeps the visit
	// path it has accumulated and RETURN has somewhere to go back to.
	const browser = $derived.by(() => seed(data.db, data.article.slug));

	const here = $derived(browser.contents.article ?? data.article);
</script>

<svelte:head>
	<title>{here.title} — {data.db}</title>
	{#if here.definition}
		<meta name="description" content={here.definition} />
	{/if}
</svelte:head>

<p class="crumb">
	<a href="../../">HyperTIES</a> / <a href="../">{data.db}</a>
</p>

<Piles {browser} />

<style>
	.crumb {
		font-size: 0.8rem;
		opacity: 0.6;
		margin: 0 0 1.5rem;
	}
</style>
