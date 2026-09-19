<script>
	/**
	 * An article, rendered from markdown, with 1988 link behaviour:
	 *
	 *   single click -> show the destination's DEFINITION, without leaving the page
	 *   double click -> go there
	 *
	 * Every article was required to have a definition, so the preview always has
	 * something true to show. That schema requirement is what bought the interaction.
	 */
	import { parseArticle } from './markdown.js';
	import { resolve } from './corpus.js';
	import TargetApplet from './TargetApplet.svelte';

	let { db, article, onnavigate } = $props();

	const segments = $derived(parseArticle(article.body));

	let preview = $state(null);

	function show(target) {
		preview = target;
	}

	/** Prose links are anchors inside {@html}, so they are caught by delegation. */
	function onProseClick(event) {
		const anchor = event.target.closest?.('a.ties-link');
		if (!anchor) return;
		event.preventDefault();
		const found = resolve(db, anchor.dataset.tiesName);
		if (!found) return;
		if (event.detail > 1) onnavigate?.(found);
		else show(found);
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
	<header>
		<h1>{article.title}</h1>
		{#if article.definition}
			<p class="definition">{article.definition}</p>
		{/if}
		<!-- Synonyms are deliberately not rendered. In fmt.f, `.synonyms` emits nothing at
		     all: it sets ignore-until to a vocabulary and skips input until the next
		     section header. The names are for make-index, which reads them with
		     FindCommand("synonyms synonym ") and files them in the document namespace.
		     Same bytes, two consumers, only one of which draws. -->
	</header>

	<!-- Delegation on a wrapper: the anchors live inside rendered markdown, so there is
	     no component to put a handler on. The anchors carry href="#", which makes them
	     focusable and makes Enter dispatch a click, so the keyboard path is already
	     there and a keydown handler here would fire twice. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="body" onclick={onProseClick} ondblclick={onProseDblClick}>
		{#each segments as segment, i (i)}
			{#if segment.kind === 'html'}
				{@html segment.html}
			{:else}
				<TargetApplet {db} spec={segment.spec} onpreview={show} {onnavigate} />
			{/if}
		{/each}
	</div>

	<footer>
		<span class="source" title="the storyboard this was converted from">{article.source}</span>
	</footer>
</article>

{#if preview}
	<div class="preview" role="dialog" aria-label="definition">
		<h2>{preview.title ?? preview.name}</h2>
		{#if preview.space === 'documents'}
			<p>{preview.definition || 'No definition in the storyboard.'}</p>
			<div class="actions">
				<button type="button" onclick={() => { const p = preview; preview = null; onnavigate?.(p); }}>
					Go to article
				</button>
				<button type="button" class="ghost" onclick={() => (preview = null)}>Close</button>
			</div>
			{#if preview.alias}
				<p class="note">reached by synonym</p>
			{/if}
		{:else}
			<p class="note">resolves in the {preview.space} namespace</p>
			<div class="actions">
				<button type="button" class="ghost" onclick={() => (preview = null)}>Close</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	article {
		max-width: 38rem;
	}
	h1 {
		font-size: 1.6rem;
		margin: 0 0 0.3rem;
		line-height: 1.2;
	}
	.definition {
		margin: 0 0 0.75rem;
		font-size: 1.05rem;
		opacity: 0.85;
		border-left: 3px solid var(--hot, #c8102e);
		padding-left: 0.7rem;
	}
	.body :global(a.ties-link) {
		color: inherit;
		text-decoration: none;
		border-bottom: 2px solid var(--hot, #c8102e);
		cursor: pointer;
	}
	.body :global(a.ties-link:hover) {
		background: color-mix(in oklab, var(--hot, #c8102e) 25%, transparent);
	}
	.body :global(p) {
		line-height: 1.6;
	}
	footer {
		margin-top: 3rem;
		font-size: 0.7rem;
		opacity: 0.4;
		font-family: ui-monospace, monospace;
	}
	.preview {
		position: fixed;
		right: 1.5rem;
		bottom: 1.5rem;
		max-width: 22rem;
		padding: 1rem 1.1rem;
		background: var(--panel, #ffffff);
		color: inherit;
		border: 1px solid color-mix(in oklab, currentColor 35%, transparent);
		border-radius: 0.6rem;
		box-shadow: 0 8px 30px rgb(0 0 0 / 0.18);
	}
	.preview h2 {
		font-size: 0.95rem;
		margin: 0 0 0.4rem;
	}
	.preview p {
		margin: 0 0 0.8rem;
		font-size: 0.9rem;
		line-height: 1.45;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	.preview button {
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
		border-radius: 999px;
		border: 1px solid currentColor;
		padding: 0.2rem 0.75rem;
		background: var(--hot, #c8102e);
		color: #fff;
	}
	.preview button.ghost {
		background: transparent;
		color: inherit;
	}
	.note {
		font-size: 0.75rem;
		opacity: 0.6;
	}
</style>
