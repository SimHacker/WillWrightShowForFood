<script>
	// A read-only browser over the emulator's Korz structures: seas, selectors, slots, the
	// dispatch methods the resolver generated, and the blocks the compiler generated, with the
	// JavaScript each became. The tree comes from @wwsff/cabinet/korz/inspect; a closed branch
	// is never computed. Live, it rereads the open branches once a second.

	/**
	 * roots() gives the top nodes. follow(), if given, gives the node for where the machine is
	 * now (the block at the PC), shown when Follow is on. onOpen(addr) opens memory there.
	 * @type {{ roots: () => import('@wwsff/cabinet/korz/inspect').KorzNode[], follow?: (() => import('@wwsff/cabinet/korz/inspect').KorzNode | null) | null, onOpen?: ((addr: number) => void) | null, height?: string }}
	 */
	let { roots, follow = null, onOpen = null, height = '22rem' } = $props();

	/** Shown at most per branch; the rest are counted. */
	const MAX_SHOWN = 400;

	let tick = $state(0);
	let live = $state(true);
	let following = $state(false);
	let open = $state(new Set());
	let selectedPath = $state('');

	$effect(() => {
		if (!live) return;
		const id = setInterval(() => (tick += 1), 1000);
		return () => clearInterval(id);
	});

	const top = $derived.by(() => {
		tick;
		return roots();
	});

	/** The node at a path of ids, read fresh. */
	function at(path) {
		let list = top;
		let node = null;
		for (const id of path.split('\u0000')) {
			node = list.find((n) => n.id === id) ?? null;
			if (!node) return null;
			list = node.children?.() ?? [];
		}
		return node;
	}

	// A node that has gone (a block thrown away) stays shown until something replaces it.
	let lastShown = null;
	const shown = $derived.by(() => {
		tick;
		const n = following && follow ? follow() : selectedPath ? at(selectedPath) : null;
		if (n) lastShown = n;
		return lastShown;
	});

	const pathOf = (parent, n) => (parent ? `${parent}\u0000${n.id}` : n.id);

	function toggle(path) {
		const next = new Set(open);
		if (next.has(path)) next.delete(path);
		else next.add(path);
		open = next;
	}

	function select(path, n) {
		following = false;
		selectedPath = path;
		if (n.children && !n.text) toggle(path);
	}

	function kids(n, path) {
		tick;
		return open.has(path) ? (n.children?.() ?? []) : [];
	}
</script>

{#snippet branch(list, parent, depth)}
	{#each list.slice(0, MAX_SHOWN) as n (n.id)}
		{@const path = pathOf(parent, n)}
		<li>
			<div class="line" class:sel={!following && selectedPath === path} style:padding-left="{depth * 0.9}rem">
				{#if n.children}
					<button type="button" class="twist" aria-expanded={open.has(path)} aria-label={open.has(path) ? `Close ${n.label}` : `Open ${n.label}`} onclick={() => toggle(path)}
						>{open.has(path) ? '▾' : '▸'}</button
					>
				{:else}
					<span class="twist"></span>
				{/if}
				<button type="button" class="name" onclick={() => select(path, n)}>{n.label}</button>
				{#if n.note}<span class="note">{n.note}</span>{/if}
			</div>
			{#if open.has(path)}
				<ul>{@render branch(kids(n, path), path, depth + 1)}</ul>
			{/if}
		</li>
	{/each}
	{#if list.length > MAX_SHOWN}
		<li class="more" style:padding-left="{depth * 0.9 + 1.1}rem">and {(list.length - MAX_SHOWN).toLocaleString()} more</li>
	{/if}
{/snippet}

<div class="korz" style:height>
	<div class="bar">
		<label title="Reread the open branches once a second"><input type="checkbox" bind:checked={live} /> Live</label>
		{#if follow}
			<label title="Show the compiled block the machine is in now"><input type="checkbox" bind:checked={following} /> Follow PC</label>
		{/if}
		<span class="hint">Read-only. Open a branch with ▸; pick a name to see its code.</span>
	</div>
	<div class="panes">
		<ul class="tree" aria-label="Korz structures">{@render branch(top, '', 0)}</ul>
		<div class="view">
			{#if shown}
				<div class="head">
					<b>{shown.label}</b>
					{#if shown.note}<span class="note">{shown.note}</span>{/if}
					{#if onOpen && shown.addr !== undefined}
						<button type="button" class="go" title="Show this address in the memory panel" onclick={() => onOpen(shown.addr)}>memory</button>
					{/if}
				</div>
				<pre>{shown.text ?? (shown.children ? 'Open it to see what is inside.' : '')}</pre>
			{:else}
				<p class="empty">Nothing picked. Open Compiler, then Blocks, and pick a block to see the JavaScript the JIT made from it.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.korz {
		display: flex;
		flex-direction: column;
		min-height: 10rem;
		font: 12px ui-monospace, Menlo, monospace;
	}
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 1rem;
		padding-bottom: 0.3rem;
	}
	.bar label {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
	}
	.hint {
		opacity: 0.6;
	}
	.panes {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(14rem, 2fr) 3fr;
		gap: 0.5rem;
	}
	@media (max-width: 640px) {
		.panes {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
		}
	}
	.tree,
	.view {
		min-height: 0;
		overflow: auto;
		border: 1px solid #333;
		background: #050505;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.tree {
		padding: 0.2rem 0;
	}
	.line {
		display: flex;
		align-items: baseline;
		gap: 0.3em;
		white-space: nowrap;
		padding-right: 0.4rem;
	}
	.line.sel {
		background: #1c3a1c;
	}
	button {
		font: inherit;
		color: inherit;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
	}
	.twist {
		display: inline-block;
		width: 1em;
		flex-shrink: 0;
		text-align: center;
		opacity: 0.8;
	}
	.name:hover {
		text-decoration: underline;
	}
	.note {
		opacity: 0.55;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.more {
		opacity: 0.55;
	}
	.view {
		display: flex;
		flex-direction: column;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.6rem;
		padding: 0.25rem 0.4rem;
		border-bottom: 1px solid #333;
	}
	.go {
		margin-left: auto;
		padding: 0 0.4em;
		border: 1px solid #555;
	}
	pre {
		flex: 1;
		margin: 0;
		padding: 0.3rem 0.4rem;
		overflow: auto;
		color: #b8e8b8;
		tab-size: 2;
	}
	.empty {
		margin: 0.4rem;
		opacity: 0.7;
	}
</style>
