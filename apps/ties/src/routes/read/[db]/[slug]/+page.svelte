<script>
	/**
	 * One article on its own page: no frame, no paging buttons, no definition pane, nothing that
	 * says HyperTIES. The title carries a byline when the article names an author, email or date.
	 * Transclusions and applets work as in the frame. A link goes on a single click, to the bare
	 * version of the article it names.
	 */
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Article from '$lib/Article.svelte';
	import { getArticle } from '$lib/corpus.js';

	let { data } = $props();

	const article = $derived(getArticle(data.db, data.slug));

	function go(target) {
		if (target?.db && target?.slug) goto(resolve('/read/[db]/[slug]', { db: target.db, slug: target.slug }));
	}
</script>

<svelte:head>
	<title>{article.title}</title>
	{#if article.definition}<meta name="description" content={article.definition} />{/if}
	{#if article.author}<meta name="author" content={article.author} />{/if}
</svelte:head>

<main class="read">
	<header>
		<h1>{article.title}</h1>
		{#if article.author || article.date}
			<p class="byline">
				<span
					>{article.author}{#if article.email}{article.author ? ' ' : ''}&lt;<a
							href="mailto:{article.email}">{article.email}</a
						>&gt;{/if}</span
				>
				{#if article.date}<time datetime={article.date}>{article.date}</time>{/if}
			</p>
		{/if}
	</header>
	<Article db={data.db} {article} titled={false} onnavigate={go} onpreview={go} />
</main>

<style>
	.read {
		box-sizing: border-box;
		height: 100%;
		overflow-y: auto;
		padding: 1.5rem max(1rem, calc((100% - 60rem) / 2)) 3rem;
	}
	h1 {
		font-size: 1.8rem;
		margin: 0 0 0.3rem;
	}
	.byline {
		margin: 0 0 1.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.6em;
	}
	.read :global(.body h2) {
		font-size: 1.35rem;
		margin-top: 2.5rem;
		border-top: 1px solid var(--ink);
		padding-top: 1rem;
	}
</style>
