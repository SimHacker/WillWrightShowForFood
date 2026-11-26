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
	import { onMount } from 'svelte';

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

	// The tree's width and the panel's height, dragged by the divider and the bottom grip and
	// kept across visits. Null is the stylesheet's default.
	const TREE_W = 'korz-browser-tree-width';
	const PANEL_H = 'korz-browser-height';
	const TREE_MIN = 120;
	const VIEW_MIN = 160;
	const PANEL_MIN = 160;
	/** @type {number | null} */
	let treeW = $state(null);
	/** @type {number | null} */
	let panelH = $state(null);
	/** @type {HTMLDivElement | undefined} */
	let panes = $state();
	/** @type {HTMLDivElement | undefined} */
	let panel = $state();
	/** @type {{ axis: 'x' | 'y', from: number, size: number } | null} */
	let drag = $state(null);

	onMount(() => {
		treeW = Number(localStorage.getItem(TREE_W)) || null;
		panelH = Number(localStorage.getItem(PANEL_H)) || null;
	});

	/** @param {number} w */
	const clampW = (w) => Math.max(TREE_MIN, Math.min(w, (panes?.clientWidth ?? 800) - VIEW_MIN));
	/** @param {number} h */
	const clampH = (h) => Math.max(PANEL_MIN, Math.min(h, window.innerHeight * 0.95));

	/** @param {PointerEvent} ev @param {'x' | 'y'} axis */
	function grab(ev, axis) {
		const tree = panes?.firstElementChild;
		const size = axis === 'x' ? (tree?.getBoundingClientRect().width ?? 0) : (panel?.getBoundingClientRect().height ?? 0);
		drag = { axis, from: axis === 'x' ? ev.clientX : ev.clientY, size };
		try {
			/** @type {HTMLElement} */ (ev.currentTarget).setPointerCapture(ev.pointerId);
		} catch {
			/* A pointer the browser does not know, from a script: drag without capture. */
		}
		ev.preventDefault();
	}

	/** @param {PointerEvent} ev */
	function move(ev) {
		if (!drag) return;
		if (drag.axis === 'x') treeW = clampW(drag.size + ev.clientX - drag.from);
		else panelH = clampH(drag.size + ev.clientY - drag.from);
	}

	function drop() {
		if (!drag) return;
		if (drag.axis === 'x' && treeW) localStorage.setItem(TREE_W, String(Math.round(treeW)));
		if (drag.axis === 'y' && panelH) localStorage.setItem(PANEL_H, String(Math.round(panelH)));
		drag = null;
	}

	/** @param {KeyboardEvent} ev @param {'x' | 'y'} axis */
	function nudge(ev, axis) {
		const step = ev.shiftKey ? 64 : 16;
		const keys = axis === 'x' ? { ArrowLeft: -step, ArrowRight: step } : { ArrowUp: -step, ArrowDown: step };
		const by = keys[/** @type {keyof typeof keys} */ (ev.key)];
		if (!by) return;
		ev.preventDefault();
		if (axis === 'x') {
			treeW = clampW((treeW ?? panes?.firstElementChild?.getBoundingClientRect().width ?? 0) + by);
			localStorage.setItem(TREE_W, String(Math.round(treeW)));
		} else {
			panelH = clampH((panelH ?? panel?.getBoundingClientRect().height ?? 0) + by);
			localStorage.setItem(PANEL_H, String(Math.round(panelH)));
		}
	}

	/** Double-click a handle to go back to the default size. @param {'x' | 'y'} axis */
	function unset(axis) {
		if (axis === 'x') {
			treeW = null;
			localStorage.removeItem(TREE_W);
		} else {
			panelH = null;
			localStorage.removeItem(PANEL_H);
		}
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

<div class={['korz', drag && `dragging-${drag.axis}`]} style:height={panelH ? `${panelH}px` : height} bind:this={panel}>
	<div class="bar">
		<label title="Reread the open branches once a second"><input type="checkbox" bind:checked={live} /> Live</label>
		{#if follow}
			<label title="Show the compiled block the machine is in now"><input type="checkbox" bind:checked={following} /> Follow PC</label>
		{/if}
		<span class="hint">Read-only. Open a branch with ▸; pick a name to see its code.</span>
	</div>
	<div class="panes" bind:this={panes} style:--tree={treeW ? `${treeW}px` : null}>
		<ul class="tree" aria-label="Korz structures">{@render branch(top, '', 0)}</ul>
		<button
			type="button"
			class="divider"
			aria-label="Resize the tree and the code"
			title="Drag to resize; double-click for the default"
			onpointerdown={(ev) => grab(ev, 'x')}
			onpointermove={move}
			onpointerup={drop}
			onpointercancel={drop}
			onkeydown={(ev) => nudge(ev, 'x')}
			ondblclick={() => unset('x')}
		></button>
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
	<button
		type="button"
		class="grip"
		aria-label="Resize the panel's height"
		title="Drag to resize; double-click for the default"
		onpointerdown={(ev) => grab(ev, 'y')}
		onpointermove={move}
		onpointerup={drop}
		onpointercancel={drop}
		onkeydown={(ev) => nudge(ev, 'y')}
		ondblclick={() => unset('y')}
	></button>
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
		grid-template-columns: var(--tree, minmax(14rem, 2fr)) 0.5rem minmax(0, 3fr);
	}
	.divider,
	.grip {
		touch-action: none;
		background: transparent;
	}
	.divider {
		cursor: col-resize;
		position: relative;
	}
	.divider::after {
		content: '';
		position: absolute;
		inset: 0 calc(50% - 1px);
		background: #333;
	}
	.grip {
		flex: none;
		display: block;
		width: 100%;
		height: 0.5rem;
		margin-top: 0.15rem;
		cursor: row-resize;
		background: linear-gradient(#333, #333) center / 2.5rem 3px no-repeat;
	}
	.divider:hover::after,
	.divider:focus-visible::after,
	.dragging-x .divider::after {
		background: #6a6;
	}
	.grip:hover,
	.grip:focus-visible,
	.dragging-y .grip {
		background-image: linear-gradient(#6a6, #6a6);
		background-size: 100% 3px;
	}
	.divider:focus-visible,
	.grip:focus-visible {
		outline: none;
	}
	.dragging-x {
		cursor: col-resize;
		user-select: none;
	}
	.dragging-y {
		cursor: row-resize;
		user-select: none;
	}
	@media (max-width: 640px) {
		.panes {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
			gap: 0.5rem;
		}
		.divider {
			display: none;
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
	.name {
		flex-shrink: 0;
		max-width: 100%;
		overflow-wrap: anywhere;
		text-align: left;
	}
	.note {
		min-width: 0;
		opacity: 0.55;
		overflow-wrap: anywhere;
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
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		color: #b8e8b8;
		tab-size: 2;
	}
	.empty {
		margin: 0.4rem;
		opacity: 0.7;
	}
</style>
