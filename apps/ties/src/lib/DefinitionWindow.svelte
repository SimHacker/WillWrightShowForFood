<!--
  The definition pile. 1988: a fixed strip under the article. Empty until a single
  click names a destination. Navigation empties it again. FULL ENTRY is the
  escalation: leave the current article for the one whose definition is showing.

  Title of this pane is the *previewed* article, not the word "Definition" — see
  the Space Telescope screenshot: "Faint Object Camera" while the contents title
  is still "Participating Organizations".
-->
<script>
	import { renderInline } from './markdown.js';
	import { resolve } from './corpus.js';

	/**
	 * @type {{
	 *   pile: import('./pile.svelte.js').Pile,
	 *   onnavigate?: (found: object) => void
	 * }}
	 */
	let { pile, onnavigate } = $props();

	const article = $derived(pile.article);
	const canEnter = $derived(Boolean(article) && article.contents !== false);

	function enter() {
		const here = pile.here;
		if (!here) return;
		onnavigate?.({ space: 'documents', db: here.db, slug: here.slug });
	}

	function onProseClick(event) {
		const anchor = event.target.closest?.('a.ties-link');
		if (!anchor) return;
		event.preventDefault();
		const found = resolve(pile.db, anchor.dataset.tiesName);
		if (found) onnavigate?.(found);
	}
</script>

<section class="definition" aria-label="definition">
	{#if article}
		<header>
			<button type="button" class="name" onclick={enter} title="full entry">
				{article.title}
			</button>
			{#if canEnter}
				<button type="button" class="full-entry" onclick={enter}>FULL ENTRY</button>
			{/if}
		</header>
		{#if article.definition}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="abstract" onclick={onProseClick}>{@html renderInline(article.definition)}</div>
		{:else}
			<p class="absent">No .definition.</p>
		{/if}
	{:else}
		<header>
			<span class="name idle">Definition</span>
		</header>
		<p class="absent">Single-click a link.</p>
	{/if}
</section>

<style>
	.definition {
		display: flex;
		flex-direction: column;
		height: 5.2rem;
		border-top: 1px solid var(--ink, #000);
		background: var(--paper, #fff);
		flex-shrink: 0;
	}
	header {
		display: flex;
		align-items: baseline;
		gap: 0.8rem;
		padding: 0.15rem 0.45rem 0;
		border-bottom: 1px solid var(--ink, #000);
	}
	.name {
		font: inherit;
		font-size: 0.8rem;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		cursor: pointer;
		text-align: left;
	}
	.name.idle {
		cursor: default;
		opacity: 0.45;
	}
	.full-entry {
		margin-left: auto;
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		padding: 0.05rem 0.2rem;
		border: 0;
		background: none;
		color: inherit;
		cursor: pointer;
	}
	.full-entry:hover,
	.name:hover:not(.idle) {
		background: #000;
		color: #fff;
	}
	.abstract,
	.absent {
		margin: 0;
		padding: 0.25rem 0.45rem;
		font-size: 0.82rem;
		line-height: 1.35;
		overflow: auto;
	}
	.absent {
		color: #666;
	}
</style>
