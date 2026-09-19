<!--
  One browser: its three piles, rendered together.

  The contents pile holds the article. The definition and controls piles are made INSIDE
  it, and the triad is cross-wired so each one has a name for the others in its own
  membrane -- so both reach the article by resolving CONTENTS from where they sit. That is
  all transclusion turns out to be here: put the linked piles below the article and they
  are already showing the right thing.

  Navigation is the pile's, not the URL's. A route seeds the pile once on the way in, so
  deep links work, and after that pressing RETURN moves the pile rather than the address
  bar. One owner, no reconciliation loop.
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
		if (target?.space !== 'documents') return;
		if (onnavigate) onnavigate(target);
		else contents.go(contents.db, target.slug);
	}
</script>

<div class="pile-stack">
	<div class="pile contents" data-pile={contents.name} data-class={contents.pileClass}>
		{#if article}
			{#key `${contents.db}/${article.slug}/${contents.pageIndex}`}
				<Article db={contents.db} {article} onnavigate={navigate} />
			{/key}
			{#if contents.pageCount > 1}
				<p class="pages">page {contents.pageIndex + 1} of {contents.pageCount}</p>
			{/if}
		{:else}
			<p class="empty">This pile is empty. HOME, below, reopens the database it left.</p>
		{/if}
	</div>

	<div class="linked">
		<div class="pile" data-pile={browser.definition.name}>
			<DefinitionWindow pile={browser.definition} onnavigate={navigate} />
		</div>
		<div class="pile" data-pile={browser.controls.name}>
			<ControlPanel pile={browser.controls} />
			<p class="provenance" title="the storyboard this panel is laid out by">
				laid out by <code>{browser.controls.article?.source ?? 'no panel article'}</code>
			</p>
		</div>
	</div>
</div>

<style>
	.pile-stack {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		min-width: 0;
	}
	.linked {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.pages {
		margin: 0.6rem 0 0;
		font-size: 0.8rem;
		color: #6a6a6a;
	}
	.empty {
		color: #6a6a6a;
	}
	.provenance {
		margin: 0.35rem 0 0;
		font-size: 0.72rem;
		color: #6a6a6a;
	}
	.provenance code {
		font-size: 0.72rem;
	}
</style>
