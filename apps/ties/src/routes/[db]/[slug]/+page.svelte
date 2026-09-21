<script>
	import Piles from '$lib/Piles.svelte';
	import { Browser } from '$lib/pile.svelte.js';

	let { data } = $props();

	function seed(db, slug) {
		const browser = new Browser();
		browser.contents.go(db, slug);
		return browser;
	}

	const browser = $derived.by(() => seed(data.db, data.article.slug));
	const here = $derived(browser.contents.article ?? data.article);
</script>

<svelte:head>
	<title>{here.title} — {data.db}</title>
	{#if here.definition}
		<meta name="description" content={here.definition} />
	{/if}
</svelte:head>

<div class="frame">
	<p class="crumb">
		<a href="../../">HyperTIES</a> / <a href="../">{data.db}</a>
	</p>
	<div class="fill">
		<Piles {browser} />
	</div>
</div>

<style>
	.frame {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}
	.crumb {
		flex-shrink: 0;
		font-size: 0.72rem;
		margin: 0;
		padding: 0.15rem 0.35rem;
		border-bottom: 1px solid var(--ink, #000);
	}
	.fill {
		flex: 1 1 auto;
		min-height: 0;
	}
</style>
