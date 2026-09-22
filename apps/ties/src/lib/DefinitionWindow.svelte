<!--
  Description pile. Header is one line: Description, or the storyboard title
  when something is considered. FULL ENTRY and Double Click to Go sit in the
  pane, top-right, out of flow, so they do not grow the header or shove the text.
-->
<script>
	import { renderInline } from './markdown.js';
	import { resolve } from './corpus.js';

	let { pile, onnavigate, browser = null } = $props();

	const article = $derived(pile.article);
	const canEnter = $derived(Boolean(article) && article.contents !== false);
	const armed = $derived(Boolean(article && browser?.isArmed(pile.here)));

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

<section class="definition" aria-label="description">
	<header>
		<h2 class="name">{article ? article.title : 'Description'}</h2>
	</header>
	<div class="pane">
		{#if canEnter}
			<div class="go">
				<button type="button" class="full-entry" class:armed onclick={enter}>FULL ENTRY</button>
				<p class="hint" class:on={armed}>Double Click to Go</p>
			</div>
		{/if}
		{#if article?.definition}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="abstract" class:room={canEnter} onclick={onProseClick}>{@html renderInline(article.definition, pile.db)}</div>
		{:else}
			<p class="absent">Single click for a definition, double click to go.</p>
		{/if}
	</div>
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
		flex-shrink: 0;
		padding: 0.35rem 0.75rem;
		border-bottom: 1px solid var(--ink, #000);
	}
	.name {
		margin: 0;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 700;
	}
	.pane {
		position: relative;
		flex: 1 1 auto;
		min-height: 0;
		overflow: auto;
		padding: 0.35rem 0.75rem;
	}
	.go {
		position: absolute;
		top: 0.35rem;
		right: 0.75rem;
		text-align: right;
	}
	.full-entry {
		font: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		-webkit-text-fill-color: currentColor;
	}
	.full-entry.armed,
	.hint.on {
		color: #00f;
		-webkit-text-fill-color: #00f;
	}
	.full-entry:hover {
		background: #000;
		color: var(--flash, #00f0d8);
		-webkit-text-fill-color: var(--flash, #00f0d8);
	}
	.hint {
		margin: 0.1rem 0 0;
		font-size: 0.8rem;
		font-weight: 700;
		visibility: hidden;
	}
	.hint.on {
		visibility: visible;
	}
	.abstract,
	.absent {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.35;
	}
	.abstract.room {
		padding-right: 9rem;
	}
</style>
