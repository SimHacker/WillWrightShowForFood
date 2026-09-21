<!--
  The control strip, laid out by its storyboard. Flush to the bottom of the tiled
  window: text verbs, no boxes. Inapplicable stays in place and goes grey.
-->
<script>
	import { bind } from './commands.js';
	import { parseArticle, splitRows } from './markdown.js';

	/** @type {{ pile: import('./pile.svelte.js').Pile }} */
	let { pile } = $props();

	const commanded = $derived(pile.leader ?? pile);

	// Subscribe to the page-axis metrics so FIRST/BACK/NEXT/LAST re-enable as you scroll.
	const pageAxis = $derived(
		commanded
			? `${commanded.scrollTop}:${commanded.scrollMax}:${commanded.clientHeight}`
			: ''
	);

	const rows = $derived.by(() => {
		pageAxis;
		return splitRows(pile.currentPage).map((row) =>
			parseArticle(row)
				.filter((segment) => segment.kind === 'target' && segment.spec.command)
				.map((segment) => bind(segment.spec.command, commanded, segment.spec.label))
		);
	});
</script>

<div class="panel" role="toolbar" aria-label={pile.article?.title ?? 'control panel'}>
	{#each rows as row, i (i)}
		<div class="row">
			{#each row as verb (verb.name)}
				<button
					type="button"
					class="verb"
					class:unknown={verb.unknown}
					disabled={!verb.enabled}
					title={verb.title}
					onclick={verb.run}
				>
					{verb.label}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 0.1rem 0.35rem 0.2rem;
		background: var(--paper, #fff);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 0.85rem;
	}
	.verb {
		font: inherit;
		font-size: 0.75rem;
		letter-spacing: 0.04em;
		padding: 0.1rem 0.15rem;
		color: var(--ink, #000);
		background: none;
		border: 0;
		border-radius: 0;
		cursor: pointer;
	}
	.verb:hover:enabled {
		background: #000;
		color: #fff;
	}
	.verb:disabled {
		color: #999;
		cursor: default;
	}
	.verb.unknown {
		font-style: italic;
	}
</style>
