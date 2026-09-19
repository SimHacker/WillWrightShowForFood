<!--
  The control panel, laid out by its storyboard rather than by this file.

  Everything drawn here comes from an article: which buttons exist, what they are called,
  what order they sit in, and where the rows break. This component knows only how to turn
  a target block naming a verb into a button, and how to ask the verb whether it currently
  applies. Point the pile at a different article and you get a different panel -- which is
  HyperLook's argument about property sheets, that an inspector is a stack like any other
  and so can be cloned and edited by whoever is using it.

  Inapplicable verbs are disabled rather than hidden, so the panel keeps its shape and the
  buttons stay where the hand learned they are.
-->
<script>
	import { bind } from './commands.js';
	import { parseArticle, splitRows } from './markdown.js';

	/** @type {{ pile: import('./pile.svelte.js').Pile }} */
	let { pile } = $props();

	// A panel commands the contents pile it resolves from where it sits, and falls back to
	// commanding itself so that a pile opened on the panel article alone is still
	// explorable rather than inert.
	const commanded = $derived(pile.leader ?? pile);

	const rows = $derived(
		splitRows(pile.currentPage).map((row) =>
			parseArticle(row)
				.filter((segment) => segment.kind === 'target' && segment.spec.command)
				.map((segment) => bind(segment.spec.command, commanded, segment.spec.label))
		)
	);
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
		gap: 0.4rem;
		padding: 0.6rem 0.7rem;
		background: var(--panel, #fff);
		border: 1px solid var(--ink, #000);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.verb {
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
	.verb:hover:enabled {
		color: var(--paper, #fff);
		background: var(--hot, #c8102e);
		border-color: var(--hot, #c8102e);
	}
	/* Still legible, still in place, plainly not available. */
	.verb:disabled {
		color: #9a9a9a;
		border-color: #cfcfcf;
		cursor: default;
	}
	/* A panel naming a verb the reader has never heard of should say so on the screen. */
	.verb.unknown {
		border-style: dashed;
		font-style: italic;
	}
</style>
