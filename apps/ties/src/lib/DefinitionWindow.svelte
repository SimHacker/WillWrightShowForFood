<!--
  The definition pile. In 1988 this was a window of its own, and the formatter gave it a
  title while setting it up:

      : init-definition
        use-definition-pile
        _zap_pages
        c~ Definition~ _set_title drop

  It follows the contents pile rather than navigating, which is what makes transcluding it
  below the article nothing more than rendering it: a linked pile shows the definition of
  whatever its leader is showing.

  FULL ENTRY is here rather than in the panel because that is where the original put it.
  The formatter drew it during the definition pass, and only on reaching `.contents`:

      else doing-definition? @ if
        _full_entry_button_ref @ _show_string
        _full_entry_button_name @ _stamp_target
        pop-interpreter

  so an article with no body never had the button at all. The condition was settled at
  format time, which is why it is a property of the article and not a discovery made on
  the click.
-->
<script>
	import { bind } from './commands.js';
	import { resolve } from './corpus.js';
	import { renderInline } from './markdown.js';

	/**
	 * @type {{
	 *   pile: import('./pile.svelte.js').Pile,
	 *   onnavigate?: (found: object) => void,
	 *   onfullentry?: () => void
	 * }}
	 */
	let { pile, onnavigate, onfullentry } = $props();

	const commanded = $derived(pile.leader ?? pile);
	const article = $derived(pile.article);
	const fullEntry = $derived(bind('!Full-Entry', commanded));

	/**
	 * A definition is prose and can carry links of its own, so they work here too. Safe
	 * to render: markdown-it is configured `html: false`, so the only markup reaching the
	 * page is what our own inline rule emits, and any HTML in the archive is escaped.
	 */
	function onProseClick(event) {
		const anchor = event.target.closest?.('a.ties-link');
		if (!anchor) return;
		event.preventDefault();
		const found = resolve(commanded.db, anchor.dataset.tiesName);
		if (found) onnavigate?.(found);
	}
</script>

<section class="definition" aria-label={pile.title || 'definition'}>
	<header>{pile.title || 'Definition'}</header>

	{#if article}
		<h3>{article.title}</h3>
		{#if article.definition}
			<!-- Delegation on a wrapper, as in Article.svelte: the anchors live inside
			     rendered markdown, so there is no component to put a handler on, and they
			     carry href="#" so Enter already dispatches a click. -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="abstract" onclick={onProseClick}>{@html renderInline(article.definition)}</div>
		{:else}
			<p class="absent">
				This article declares no <code>.definition</code>, so a single click had nothing to
				show.
			</p>
		{/if}
		<button
			type="button"
			class="full-entry"
			disabled={!fullEntry.enabled}
			title={fullEntry.enabled ? fullEntry.title : 'this article has no .contents'}
			onclick={() => {
				fullEntry.run();
				onfullentry?.();
			}}
		>
			{fullEntry.label}
		</button>
	{:else}
		<p class="absent">Nothing selected.</p>
	{/if}
</section>

<style>
	.definition {
		border: 1px solid var(--ink, #000);
		background: var(--panel, #fff);
	}
	header {
		padding: 0.25rem 0.7rem;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--paper, #fff);
		background: var(--ink, #000);
	}
	h3 {
		margin: 0.7rem 0.7rem 0.3rem;
		font-size: 1rem;
	}
	.abstract {
		margin: 0 0.7rem 0.7rem;
		line-height: 1.5;
	}
	.absent {
		margin: 0.7rem;
		color: #6a6a6a;
		font-size: 0.9rem;
	}
	.full-entry {
		margin: 0 0.7rem 0.7rem;
		font: inherit;
		font-size: 0.82rem;
		letter-spacing: 0.04em;
		padding: 0.25rem 0.6rem;
		color: var(--ink, #000);
		background: var(--paper, #fff);
		border: 1px solid var(--ink, #000);
		border-radius: 2px;
		cursor: pointer;
	}
	.full-entry:hover:enabled {
		color: var(--paper, #fff);
		background: var(--hot, #c8102e);
		border-color: var(--hot, #c8102e);
	}
	.full-entry:disabled {
		color: #9a9a9a;
		border-color: #cfcfcf;
		cursor: default;
	}
</style>
