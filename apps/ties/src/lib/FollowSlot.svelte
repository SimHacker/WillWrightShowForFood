<script>
	/**
	 * A live transclusion: shows the article its applet's state names, and swaps it
	 * when the applet changes. Before the applet mounts, and in prerendered HTML, the
	 * seed from the applet's own fence stands in.
	 */
	import Article from './Article.svelte';
	import { useApplets } from './applets.svelte.js';
	import { followArticle } from './transclude.js';

	let { segment, reveal = false, browser = null, onpreview, onnavigate } = $props();

	const board = useApplets();
	const key = $derived(segment.spec.follows);
	const state = $derived(board?.[key] ?? segment.seeds?.[key] ?? null);
	const target = $derived(followArticle(segment, state));
</script>

{#if target}
	<section class="follow" aria-live="polite">
		{#key target.article.slug}
			<Article
				db={target.db}
				article={target.article}
				titled={segment.spec.titled ?? true}
				{reveal}
				{browser}
				{onpreview}
				{onnavigate}
				heading="h2"
			/>
		{/key}
	</section>
{/if}

<style>
	.follow {
		margin: 0 0 0.7rem;
	}
</style>
