<!--
  One browser, tiled like 1988: title bar, scrolling article, definition strip,
  control strip. Definition and controls are pinned; the article scrolls under them.
-->
<script>
	import Article from './Article.svelte';
	import ControlPanel from './ControlPanel.svelte';
	import DefinitionWindow from './DefinitionWindow.svelte';

	/** @type {{ browser: import('./pile.svelte.js').Browser, onnavigate?: (t: object) => void }} */
	let { browser, onnavigate } = $props();

	const contents = $derived(browser.contents);
	const article = $derived(contents.article);

	function navigate(target) {
		if (target?.space && target.space !== 'documents') return;
		if (!target?.slug) return;
		if (onnavigate) onnavigate(target);
		else contents.go(target.db ?? contents.db, target.slug);
	}

	function preview(target) {
		if (!target?.slug) return;
		if (target.space && target.space !== 'documents') return;
		browser.definition.preview(target.db ?? contents.db, target.slug);
	}

	function defineHere() {
		if (!article) return;
		browser.definition.preview(contents.db, article.slug);
	}

	let scrollerEl = $state(null);

	$effect(() => {
		const el = scrollerEl;
		const pile = contents;
		const _article = article;
		if (!el) return;
		pile.attachScroller(el);
		const ro = new ResizeObserver(() => pile.syncScroll(el));
		ro.observe(el);
		if (el.firstElementChild) ro.observe(el.firstElementChild);
		return () => ro.disconnect();
	});
</script>

<div class="ties-window">
	<header class="titlebar">
		<button type="button" class="win-title" onclick={defineHere} title="show this article's definition">
			{article?.title ?? ''}
		</button>
	</header>

	<div
		class="contents"
		data-pile={contents.name}
		data-class={contents.pileClass}
		bind:this={scrollerEl}
		onscroll={() => contents.syncScroll(scrollerEl)}
	>
		{#if article}
			{#key `${contents.db}/${article.slug}`}
				<Article
					db={contents.db}
					{article}
					titled={false}
					onpreview={preview}
					onnavigate={navigate}
				/>
			{/key}
		{:else}
			<p class="empty">This pile is empty. HOME reopens the database it left.</p>
		{/if}
	</div>

	<DefinitionWindow pile={browser.definition} onnavigate={navigate} />

	<div class="controls" data-pile={browser.controls.name}>
		<ControlPanel pile={browser.controls} />
	</div>
</div>

<style>
	.ties-window {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		border: 1px solid var(--ink, #000);
		background: var(--paper, #fff);
	}
	.titlebar {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		flex-shrink: 0;
		padding: 0.12rem 0.45rem;
		border-bottom: 1px solid var(--ink, #000);
		font-size: 0.8rem;
	}
	.win-title {
		font: inherit;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		cursor: pointer;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.win-title:hover {
		background: #000;
		color: #fff;
	}
	.contents {
		flex: 1 1 auto;
		min-height: 0;
		overflow: auto;
		padding: 0.45rem 0.6rem 0.6rem;
	}
	.controls {
		flex-shrink: 0;
		border-top: 1px solid var(--ink, #000);
	}
	.empty {
		color: #666;
		margin: 0;
		font-size: 0.85rem;
	}
</style>
