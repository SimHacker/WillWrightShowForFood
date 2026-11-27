<script>
	/**
	 * The person's toolbar under a machine's screen (see toolbar.svelte.js): the controls they
	 * pinned on a row, in their order, at its left end or its right (the speed readout); then
	 * the panels they pinned, one under another.
	 *
	 * Each item has handles that float over its top edge while the pointer is on it (always,
	 * where there is no hover), drawn on top of everything, the screen included, with a ring
	 * that shows on light and dark alike. A handle is anchored to a point of the item: the ⠿
	 * at top-left drags it to another place (or the arrow keys on it), and a click on it goes
	 * to its home in the outline; the ⏏️ at top-right takes it out, far from the ⠿ so a drag
	 * does not become an eject. HANDLES lists them by anchor; more anchors (the other corners,
	 * the edges' middles) and more handles come later, and a ring of them is a pie menu.
	 * ⌘-click (Ctrl-click off a Mac) on the item itself also goes to its home, as an editor's
	 * ⌘-click goes to a definition.
	 */
	/** @type {{ bar: import('./toolbar.svelte.js').Toolbar, label: string }} */
	let { bar, label } = $props();

	$effect(() => bar.show());

	const shown = $derived(
		bar.pinned.flatMap((id) => {
			const c = bar.controls.get(id);
			return c ? [{ id, ...c }] : [];
		})
	);
	const controls = $derived(shown.filter((c) => c.kind === 'control'));
	const left = $derived(controls.filter((c) => bar.side(c.id) === 'left'));
	const right = $derived(controls.filter((c) => bar.side(c.id) === 'right'));
	const panels = $derived(shown.filter((c) => c.kind === 'panel'));

	const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
	const SEEK = mac ? '⌘-click' : 'Ctrl-click';

	/** @typedef {'top-left' | 'top-right'} Anchor */
	/** The handles on every item, by the point of it they hang from. @type {{ anchor: Anchor, handle: 'grip' | 'out' }[]} */
	const HANDLES = [
		{ anchor: 'top-left', handle: 'grip' },
		{ anchor: 'top-right', handle: 'out' }
	];

	/**
	 * ⌘ or Ctrl down: the press goes to the item's home instead of the item, caught before the
	 * control sees it, so a slider does not slide and a menu does not open.
	 * @param {MouseEvent} e @param {string} id
	 */
	function seekPress(e, id) {
		if (!(e.metaKey || e.ctrlKey)) return;
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'click') bar.seek(id);
	}

	const DRAG = 'text/x-toolbar-item';
	/** The item a drag is over, to mark where it would go; or an end of the row. */
	let over = $state('');
	let dragging = $state(false);

	/** @param {DragEvent} e @param {string} id */
	function start(e, id) {
		e.dataTransfer?.setData(DRAG, id);
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
		dragging = true;
	}
	function end() {
		dragging = false;
		over = '';
	}
	/** @param {DragEvent} e @param {string} id */
	function dragover(e, id) {
		if (!e.dataTransfer?.types.includes(DRAG)) return;
		e.preventDefault();
		e.stopPropagation();
		over = id;
	}
	/** @param {DragEvent} e @param {string} id */
	function drop(e, id) {
		over = '';
		const from = e.dataTransfer?.getData(DRAG);
		e.stopPropagation();
		if (!from || from === id) return;
		e.preventDefault();
		bar.move(from, id);
	}
	/** A drop on an end's free space puts it last at that end. @param {DragEvent} e @param {'left' | 'right'} side */
	function dropAt(e, side) {
		over = '';
		const from = e.dataTransfer?.getData(DRAG);
		if (!from) return;
		e.preventDefault();
		bar.toSide(from, side);
	}
	/** @param {KeyboardEvent} e @param {string} id @param {'row' | 'column'} way */
	function key(e, id, way) {
		const back = way === 'row' ? 'ArrowLeft' : 'ArrowUp';
		const on = way === 'row' ? 'ArrowRight' : 'ArrowDown';
		if (e.key !== back && e.key !== on) return;
		e.preventDefault();
		bar.move(id, e.key === back ? -1 : 1);
		const el = /** @type {HTMLElement} */ (e.currentTarget);
		requestAnimationFrame(() => el.focus());
	}
</script>

{#snippet handles(/** @type {{ id: string, label: string }} */ c, /** @type {'row' | 'column'} */ way)}
	{#each HANDLES as h (h.anchor)}
		{#if h.handle === 'grip'}
			<button
				type="button"
				class={['handle', h.anchor]}
				draggable="true"
				tabindex={way === 'row' ? -1 : 0}
				aria-label="Move {c.label}: drag it, or the arrow keys; press it to find {c.label} in the outline"
				title="Drag to move {c.label}, or use the arrow keys on this. Click: find {c.label} in the outline ({SEEK} on it does too)."
				onclick={() => bar.seek(c.id)}
				ondragstart={(e) => start(e, c.id)}
				ondragend={end}
				onkeydown={(e) => key(e, c.id, way)}>⠿</button
			>
		{:else}
			<button
				type="button"
				class={['handle', h.anchor]}
				tabindex={way === 'row' ? -1 : 0}
				aria-label="Take {c.label} out of the toolbar"
				title="Take {c.label} out of the toolbar. The 📌 by it in the outline puts it back."
				onclick={() => bar.unpin(c.id)}>⏏️</button
			>
		{/if}
	{/each}
{/snippet}

{#snippet slot(/** @type {{ id: string, label: string, render: import('svelte').Snippet<[boolean]> }} */ c)}
	<span
		class={['slot', { over: over === c.id }]}
		role="group"
		aria-label={c.label}
		onpointerdowncapture={(e) => seekPress(e, c.id)}
		onmousedowncapture={(e) => seekPress(e, c.id)}
		onclickcapture={(e) => seekPress(e, c.id)}
		ondragover={(e) => dragover(e, c.id)}
		ondragleave={() => (over = '')}
		ondrop={(e) => drop(e, c.id)}
	>
		{@render c.render(true)}{@render handles(c, 'row')}
	</span>
{/snippet}

<div class="toolbar">
	<div class="row" role="toolbar" aria-label={label}>
		{#each ['left', 'right'] as side (side)}
			{@const list = side === 'left' ? left : right}
			<span
				class={['end', side, { dragging, over: over === side }]}
				role="group"
				aria-label={side === 'left' ? 'Left end' : 'Right end'}
				ondragover={(e) => {
					if (!e.dataTransfer?.types.includes(DRAG)) return;
					e.preventDefault();
					over = side;
				}}
				ondragleave={() => (over = '')}
				ondrop={(e) => dropAt(e, /** @type {'left' | 'right'} */ (side))}
			>
				{#each list as c (c.id)}{@render slot(c)}{/each}
				{#if side === 'left' && !controls.length}<span class="empty">Empty: a 📌 by a control in the outline puts it here.</span>{/if}
			</span>
		{/each}
	</div>
	{#each panels as c (c.id)}
		<section
			class={['panel', { over: over === c.id }]}
			aria-label={c.label}
			onpointerdowncapture={(e) => seekPress(e, c.id)}
			onmousedowncapture={(e) => seekPress(e, c.id)}
			onclickcapture={(e) => seekPress(e, c.id)}
			ondragover={(e) => dragover(e, c.id)}
			ondragleave={() => (over = '')}
			ondrop={(e) => drop(e, c.id)}
		>
			{@render handles(c, 'column')}
			<header><span class="title">{c.label}</span></header>
			<div class="body">{@render c.render(true)}</div>
		</section>
	{/each}
</div>

<style>
	.toolbar {
		--handle: 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font: 0.85rem system-ui, sans-serif;
	}
	.end {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		min-height: 1.6rem;
		border-radius: 4px;
	}
	.end.right {
		margin-left: auto;
		justify-content: flex-end;
	}
	/* While dragging, an end shows where a drop there lands, even an empty one. */
	.end.dragging {
		min-width: 2.5rem;
		outline: 1px dashed color-mix(in srgb, currentColor 35%, transparent);
	}
	.end.over {
		outline-style: solid;
	}
	.slot {
		position: relative;
		display: inline-flex;
		align-items: center;
	}
	.slot.over {
		box-shadow: inset 2px 0 0 currentColor;
	}
	.empty {
		opacity: 0.6;
	}
	/* Just above the item, touching it, so they never hide it and the pointer crosses no gap to
	   them; over everything, the screen too, and readable on anything: the page's own paper and
	   ink, ringed in ink and then paper, so one ring or the other stands out from what is under
	   it. A narrow item's two handles meet at its middle instead of overlapping. */
	.handle {
		position: absolute;
		z-index: 50;
		bottom: 100%;
		display: grid;
		place-items: center;
		width: var(--handle);
		height: var(--handle);
		padding: 0;
		border: none;
		border-radius: 5px;
		background: Canvas;
		color: CanvasText;
		box-shadow:
			0 0 0 1px CanvasText,
			0 0 0 2.5px Canvas,
			0 2px 6px 2px rgb(0 0 0 / 0.35);
		font: 0.8rem/1 system-ui, sans-serif;
		cursor: pointer;
	}
	.handle.top-left {
		left: min(0px, 50% - var(--handle) - 1px);
		cursor: grab;
	}
	.handle.top-right {
		right: min(0px, 50% - var(--handle) - 1px);
	}
	@media (hover: hover) {
		.handle {
			opacity: 0;
			pointer-events: none;
			transition: opacity 0.12s 0.25s;
		}
		.slot:hover > .handle,
		.slot:focus-within > .handle,
		.panel:hover > .handle,
		.panel:focus-within > .handle {
			opacity: 1;
			pointer-events: auto;
			transition-delay: 0s;
		}
	}
	/* Always shown where there is no hover: room above the row and each panel for them. */
	@media (hover: none) {
		.row {
			padding-top: 0.9rem;
		}
		.panel {
			margin-top: 0.9rem;
		}
	}
	.panel {
		position: relative;
		border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
		border-radius: 3px;
		font: 0.8rem ui-monospace, monospace;
	}
	.panel.over {
		box-shadow: inset 0 2px 0 currentColor;
	}
	.panel header {
		padding: 0 0.4rem;
		opacity: 0.75;
	}
	.panel .title {
		font-weight: 600;
	}
	.panel .body {
		padding: 0.15rem 0.4rem 0.3rem;
	}
</style>
