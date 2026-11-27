<script>
	/**
	 * One node of the About tree, offered to the toolbar: its name as a link that opens its page
	 * in the viewer at the top of the outline (a new tab with `view: tab`, or ⌘-click),
	 * and, when it has nodes under it, its panel. The panel shows its line, then
	 * each node under it: a name to pin, or an outline node whose content is that node's own
	 * panel, pinnable in turn. Rendered for every node all the time, so a pinned name or panel
	 * stays in the toolbar while its home in the outline is closed. Draws nothing itself.
	 */
	import Outline from './Outline.svelte';
	import Pinnable from './Pinnable.svelte';

	/** @typedef {import('./credits.js').CreditNode} CreditNode */
	/** @type {{ bar: import('./toolbar.svelte.js').Toolbar, node: CreditNode, home: string[], outlineId: (id: string) => string }} */
	let { bar, node, home, outlineId } = $props();

	const ICONS = { person: '👤', project: '🧩', place: '📍', document: '📄' };

	$effect(() => {
		const off = [];
		if (node.url) off.push(bar.offer(`credit-${node.id}`, node.name, link, 'control', home));
		if (node.entries.length) off.push(bar.offer(`about-${node.id}`, node.name, panel, 'panel', [...home, outlineId(node.id)]));
		return () => off.forEach((f) => f());
	});
</script>

{#snippet link(compact = false)}
	<a
		class={['credit', node.kind, { compact }]}
		href={node.url}
		data-view={node.view ? '' : undefined}
		target="_blank"
		rel="noopener noreferrer"
		title="{node.name}{node.for ? `: ${node.for}` : ''}. Opens {node.url} {node.view ? 'in the viewer at the top of the outline; ⌘-click for a new tab' : 'in a new tab'}.">{ICONS[node.kind] ?? '🔗'} {node.name}</a
	>
{/snippet}

{#snippet panel(compact = false)}
	<div class={['about', { compact }]}>
		{#each node.about as p, i (i)}<p class="line">{p}</p>{/each}
		{#if node.url}<p class="line"><Pinnable {bar} id="credit-{node.id}" /></p>{/if}
		{#if node.entries.some((e) => !e.entries.length)}
			<ul class="names">
				{#each node.entries.filter((e) => !e.entries.length) as e (e.id)}
					<li><Pinnable {bar} id="credit-{e.id}" />{#if e.for && !compact}<span class="for">{e.for}</span>{/if}</li>
				{/each}
			</ul>
		{/if}
		{#each node.entries.filter((e) => e.entries.length) as e (e.id)}
			<Outline id={outlineId(e.id)} title={e.name} hint={e.about[0] ?? ''} summary="{e.entries.length} in it" pin={{ bar, id: `about-${e.id}` }}>
				{@render bar.controls.get(`about-${e.id}`)?.render(false)}
			</Outline>
		{/each}
	</div>
{/snippet}

<style>
	.about {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font: 0.85rem system-ui, sans-serif;
	}
	.about.compact {
		max-width: 40rem;
	}
	.compact .names {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.6rem;
	}
	.line {
		margin: 0;
		max-width: 46rem;
		line-height: 1.4;
	}
	.names {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.15rem 0.7rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.names li {
		display: contents;
	}
	.for {
		opacity: 0.7;
	}
	.credit {
		color: light-dark(#1d6b1d, #9fe8a0);
		text-decoration: none;
		white-space: nowrap;
	}
	.credit:hover,
	.credit:focus-visible {
		text-decoration: underline;
	}
	/* In the toolbar a pinned name is a button among buttons, in the system's button colors. */
	.credit.compact {
		display: inline-flex;
		align-items: center;
		height: 1.6rem;
		padding: 0 0.5em;
		border: 1px solid ButtonBorder;
		border-radius: 4px;
		background: ButtonFace;
		color: ButtonText;
		font: 0.8rem system-ui, sans-serif;
	}
	.credit.compact:hover,
	.credit.compact:focus-visible {
		text-decoration: none;
		filter: brightness(0.92);
	}
</style>
