<script>
	/**
	 * One article on its own page: no frame, no paging buttons, no definition pane. Transclusions
	 * and applets work as in the frame. A link goes on a single click, to the bare version of
	 * the article it names.
	 */
	import { goto } from '$app/navigation';
	import Article from '$lib/Article.svelte';
	import { getArticle } from '$lib/corpus.js';
	import { articleHref } from '$lib/href.js';

	let { data } = $props();

	const article = $derived(getArticle(data.db, data.slug));

	function go(target) {
		if (target?.db && target?.slug) goto(`/read/${target.db}/${target.slug}/`);
	}
</script>

<svelte:head>
	<title>{article.title}</title>
	{#if article.definition}<meta name="description" content={article.definition} />{/if}
</svelte:head>

<main class="read">
	<Article db={data.db} {article} onnavigate={go} onpreview={go} />
	<footer>
		<a href={articleHref(data.db, data.slug)}>Open in HyperTIES</a>
	</footer>
</main>

<style>
	.read {
		box-sizing: border-box;
		height: 100%;
		overflow-y: auto;
		padding: 1.5rem max(1rem, calc((100% - 60rem) / 2)) 3rem;
	}
	.read :global(.title) {
		font-size: 1.8rem;
	}
	.read :global(.body h2) {
		font-size: 1.35rem;
		margin-top: 2.5rem;
		border-top: 1px solid var(--ink);
		padding-top: 1rem;
	}
	footer {
		margin-top: 3rem;
		font-size: 0.85rem;
	}
</style>
