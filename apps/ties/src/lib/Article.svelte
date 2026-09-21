<script>
	/**
	 * An article body. 1988 link behaviour, no popup:
	 *
	 *   single click -> definition pane (onpreview)
	 *   double click -> go there (onnavigate)
	 *
	 * The current article's own definition is not drawn here. That text belongs in the
	 * definition pane when this article is the one being *considered*, which is a
	 * single-click on a link to it — or a click on the window title.
	 */
	import { paginate, parseArticle } from './markdown.js';
	import { resolve } from './corpus.js';
	import TargetApplet from './TargetApplet.svelte';

	let { db, article, onnavigate, onpreview, titled = true } = $props();

	// Window-size paging later. For now join the authored pages and scroll.
	const segments = $derived(parseArticle(paginate(article.body).join('\n\n')));

	function consider(target) {
		if (target) onpreview?.(target);
	}

	/** Prose links are anchors inside {@html}, so they are caught by delegation. */
	function onProseClick(event) {
		const anchor = event.target.closest?.('a.ties-link');
		if (!anchor) return;
		event.preventDefault();
		const found = resolve(db, anchor.dataset.tiesName);
		if (!found) return;
		if (event.detail > 1) onnavigate?.(found);
		else consider(found);
	}

	function onProseDblClick(event) {
		const anchor = event.target.closest?.('a.ties-link');
		if (!anchor) return;
		event.preventDefault();
		const found = resolve(db, anchor.dataset.tiesName);
		if (found) onnavigate?.(found);
	}
</script>

<article>
	{#if titled}
		<header>
			<h1>{article.title}</h1>
		</header>
	{/if}

	<!-- Delegation on a wrapper: the anchors live inside rendered markdown, so there is
	     no component to put a handler on. The anchors carry href="#", which makes them
	     focusable and makes Enter dispatch a click, so the keyboard path is already
	     there and a keydown handler here would fire twice. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="body" role="presentation" onclick={onProseClick} ondblclick={onProseDblClick}>
		{#each segments as segment, i (i)}
			{#if segment.kind === 'html'}
				{@html segment.html}
			{:else}
				<TargetApplet {db} spec={segment.spec} onpreview={consider} {onnavigate} />
			{/if}
		{/each}
	</div>
</article>

<style>
	article {
		max-width: none;
	}
	h1 {
		font-size: 1.15rem;
		font-weight: 400;
		margin: 0 0 0.6rem;
		line-height: 1.2;
	}
	.body :global(a.ties-link) {
		color: inherit;
		text-decoration: none;
		border-bottom: 1px solid var(--ink, #000);
		cursor: pointer;
	}
	.body :global(a.ties-link:hover) {
		background: #000;
		color: #fff;
	}
	.body :global(p) {
		line-height: 1.45;
		margin: 0 0 0.7rem;
	}
	.body :global(h2),
	.body :global(h3) {
		font-weight: 400;
		font-size: 1rem;
		margin: 1rem 0 0.4rem;
	}
</style>
