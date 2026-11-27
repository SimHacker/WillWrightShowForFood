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
	 *
	 * Dragging: the row's two ends and the panels' column are layouts, and a drop is a layout and
	 * a place in it, so from one end to the other is the same move as along one. The lifted item
	 * dims where it was and a picture of it (of a panel, a small chip) goes with the pointer;
	 * where it would land a gap its size opens, and closes again as the pointer goes on. Places
	 * are found against where everything stood when the drag began, with the open gap counted
	 * in: its width is part of its target, and opening it never moves what the pointer is over.
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
	/** @typedef {'left' | 'right' | 'panels'} Layout */
	const lists = $derived({
		left: left.map((c) => c.id),
		right: right.map((c) => c.id),
		panels: panels.map((c) => c.id)
	});

	/**
	 * The item being dragged: the layout it came from, its place there, its width, and the room
	 * it takes with its spacing.
	 * @type {{ id: string, from: Layout, at: number, width: number, room: number } | null}
	 */
	let lift = $state(null);
	/** Where it would land: a layout, and a place in it counting the lifted one. @type {{ layout: Layout, at: number } | null} */
	let spot = $state(null);
	/** Where the layouts and their items stood when the drag began. @type {{ box: DOMRect, layouts: Record<string, { box: DOMRect, items: DOMRect[] }> } | null} */
	let geo = null;
	/** @type {HTMLElement | undefined} */
	let root = $state();
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let lifting;

	/** Whether a drop at this place moves the item: not where it already is. @param {Layout} layout @param {number} at */
	function moves(layout, at) {
		return !(lift && lift.from === layout && (at === lift.at || at === lift.at + 1));
	}
	/** @param {Layout} layout @param {number} at */
	function open(layout, at) {
		return !!spot && spot.layout === layout && spot.at === at && moves(layout, at);
	}

	function measure() {
		/** @type {Record<string, { box: DOMRect, items: DOMRect[] }>} */
		const layouts = {};
		for (const el of /** @type {HTMLElement} */ (root).querySelectorAll('[data-layout]')) {
			const items = [...el.querySelectorAll(':scope > [data-item]')].map((i) => i.getBoundingClientRect());
			layouts[/** @type {string} */ (/** @type {HTMLElement} */ (el).dataset.layout)] = { box: el.getBoundingClientRect(), items };
		}
		return { box: /** @type {HTMLElement} */ (root).getBoundingClientRect(), layouts };
	}

	/**
	 * The picture that goes with the pointer is taken as dragstart returns, so the item is dimmed
	 * a moment later.
	 * @param {DragEvent} e @param {string} id @param {Layout} layout
	 */
	function start(e, id, layout) {
		const dt = e.dataTransfer;
		if (!dt || !root) return;
		dt.setData(DRAG, id);
		dt.effectAllowed = 'move';
		const item = /** @type {HTMLElement} */ (/** @type {HTMLElement} */ (e.currentTarget).closest('[data-item]'));
		const box = item.getBoundingClientRect();
		const proxy = layout === 'panels' ? item.querySelector('.proxy') : null;
		if (proxy) dt.setDragImage(proxy, 12, 10);
		else dt.setDragImage(item, Math.max(0, e.clientX - box.left), Math.max(0, e.clientY - box.top));
		geo = measure();
		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
		const at = lists[layout].indexOf(id);
		const room = layout === 'panels' ? 2.4 * rem : box.width + 0.4 * rem;
		clearTimeout(lifting);
		lifting = setTimeout(() => {
			lift = { id, from: layout, at, width: box.width, room };
			spot = { layout, at };
		});
	}
	function end() {
		clearTimeout(lifting);
		lift = null;
		spot = null;
		geo = null;
	}

	/**
	 * The place under the pointer, or none. A control lands on the end on the pointer's side of
	 * the row's middle, a little above or below the row too; a panel in the column. Within a
	 * layout, an item is before the pointer if its middle is, the open gap's room added to the
	 * items it pushed along (on the right end those before it, pushed left).
	 * @param {number} x @param {number} y @returns {{ layout: Layout, at: number } | null}
	 */
	function where(x, y) {
		if (!geo || !lift) return null;
		const slack = 32;
		if (x < geo.box.left - slack || x > geo.box.right + slack) return null;
		/** @type {Layout} */
		let layout;
		if (lift.from === 'panels') {
			const col = geo.layouts.panels;
			if (!col || y < col.box.top - slack || y > col.box.bottom + 2 * slack) return null;
			layout = 'panels';
		} else {
			const l = geo.layouts.left.box;
			const r = geo.layouts.right.box;
			if (y < Math.min(l.top, r.top) - 1.5 * slack || y > Math.max(l.bottom, r.bottom) + slack) return null;
			layout = x < (l.right + r.left) / 2 ? 'left' : 'right';
		}
		const gap = spot && spot.layout === layout && open(layout, spot.at) ? spot.at : -1;
		const room = lift.room;
		let at = 0;
		geo.layouts[layout].items.forEach((b, i) => {
			const shift = gap < 0 ? 0 : layout === 'right' ? (i < gap ? -room : 0) : i >= gap ? room : 0;
			const cy = b.top + b.height / 2;
			const before =
				layout === 'panels'
					? cy + shift < y
					: Math.abs(cy - y) <= b.height / 2
						? b.left + b.width / 2 + shift < x
						: cy < y;
			if (before) at = i + 1;
		});
		return { layout, at };
	}

	/** @param {DragEvent} e */
	function track(e) {
		if (!lift || !e.dataTransfer?.types.includes(DRAG)) return;
		const s = where(e.clientX, e.clientY);
		if (s?.layout !== spot?.layout || s?.at !== spot?.at) spot = s;
		if (!s) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	}
	/** A drop anywhere a place was found, over the screen too, caught before what is under it. @param {DragEvent} e */
	function drop(e) {
		if (!lift || !e.dataTransfer?.types.includes(DRAG)) return;
		e.preventDefault();
		e.stopPropagation();
		if (spot && moves(spot.layout, spot.at)) {
			const before = lists[spot.layout][spot.at];
			if (before) bar.move(lift.id, before);
			else bar.toSide(lift.id, spot.layout === 'right' ? 'right' : 'left');
		}
		end();
	}
	/**
	 * Whose handles show: one item's at a time, like a Mac menu bar's submenus. Pointing at an
	 * item shows its handles and takes any others down at once. Leaving it, they stay a moment,
	 * so a pointer that cuts a corner does not lose them; and while the pointer heads for them
	 * (inside the triangle from where it left to their top corners) another item it crosses
	 * waits, taking over only when the pointer turns away or stops.
	 * @type {string | null}
	 */
	let hot = $state(null);
	/** The item the pointer crossed on its way to hot's handles. @type {string | null} */
	let next = null;
	/** Where the pointer left hot, and the box around hot's handles. @type {{ x: number, y: number, box: DOMRect } | null} */
	let aim = null;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let waiting;
	const LINGER = 600;
	const STOPPED = 250;

	/** @param {string | null} id */
	function settle(id) {
		clearTimeout(waiting);
		hot = id;
		next = null;
		aim = null;
	}
	/** @param {number} ms */
	function later(ms) {
		clearTimeout(waiting);
		waiting = setTimeout(() => settle(next), ms);
	}
	/** Whether the pointer is heading for hot's handles. @param {number} x @param {number} y */
	function aiming(x, y) {
		if (!aim) return false;
		const { box } = aim;
		if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) return true;
		/** @param {number} ax @param {number} ay @param {number} bx @param {number} by */
		const side = (ax, ay, bx, by) => (bx - ax) * (y - ay) - (by - ay) * (x - ax);
		const a = side(aim.x, aim.y, box.left, box.top);
		const b = side(box.left, box.top, box.right, box.top);
		const c = side(box.right, box.top, aim.x, aim.y);
		return (a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0);
	}
	/** @param {PointerEvent} e @param {string} id */
	function enter(e, id) {
		if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
		if (id === hot || !hot || !aiming(e.clientX, e.clientY)) return settle(id);
		next = id;
		later(STOPPED);
	}
	/** @param {PointerEvent & { currentTarget: HTMLElement }} e @param {string} id */
	function leave(e, id) {
		if (id !== hot) {
			if (id === next) next = null;
			return;
		}
		const boxes = [...e.currentTarget.querySelectorAll(':scope > .handle')].map((h) => h.getBoundingClientRect());
		aim = boxes.length
			? { x: e.clientX, y: e.clientY, box: new DOMRect(Math.min(...boxes.map((b) => b.left)), Math.min(...boxes.map((b) => b.top)), Math.max(...boxes.map((b) => b.right)) - Math.min(...boxes.map((b) => b.left)), Math.max(...boxes.map((b) => b.bottom)) - Math.min(...boxes.map((b) => b.top))) }
			: null;
		next = null;
		later(LINGER);
	}
	/** @param {PointerEvent} e */
	function heading(e) {
		if (next && !aiming(e.clientX, e.clientY)) settle(next);
	}

	/** @param {KeyboardEvent} e @param {string} id @param {'row' | 'column'} way */
	function key(e, id, way) {
		const back = way === 'row' ? 'ArrowLeft' : 'ArrowUp';
		const on = way === 'row' ? 'ArrowRight' : 'ArrowDown';
		if (e.key !== back && e.key !== on) return;
		e.preventDefault();
		bar.move(id, e.key === back ? -1 : 1);
		const el = /** @type {HTMLElement} */ (e.currentTarget);
		requestAnimationFrame(() => el.focus({ preventScroll: true }));
	}
</script>

{#snippet handles(/** @type {{ id: string, label: string }} */ c, /** @type {Layout} */ layout)}
	{@const way = layout === 'panels' ? 'column' : 'row'}
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
				ondragstart={(e) => start(e, c.id, layout)}
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

{#snippet gap(/** @type {Layout} */ layout, /** @type {number} */ at)}
	{#if lift && (layout === 'panels') === (lift.from === 'panels')}
		<span class={['gap', { open: open(layout, at) }]} aria-hidden="true"></span>
	{/if}
{/snippet}

{#snippet slot(/** @type {{ id: string, label: string, render: import('svelte').Snippet<[boolean]> }} */ c, /** @type {Layout} */ side)}
	<span
		class={['slot', { lifted: lift?.id === c.id, hot: hot === c.id }]}
		data-item
		role="group"
		aria-label={c.label}
		onpointerenter={(e) => enter(e, c.id)}
		onpointerleave={(e) => leave(e, c.id)}
		onpointerdowncapture={(e) => seekPress(e, c.id)}
		onmousedowncapture={(e) => seekPress(e, c.id)}
		onclickcapture={(e) => seekPress(e, c.id)}
	>
		{@render c.render(true)}{@render handles(c, side)}
	</span>
{/snippet}

<svelte:window ondragovercapture={track} ondropcapture={drop} onpointermove={heading} />

<div class="toolbar" bind:this={root} style:--lift={lift ? `${lift.width}px` : null}>
	<div class="row" role="toolbar" aria-label={label}>
		{#each /** @type {const} */ (['left', 'right']) as side (side)}
			{@const list = side === 'left' ? left : right}
			<span
				class={['end', side, { dragging: lift && lift.from !== 'panels', over: spot?.layout === side }]}
				data-layout={side}
				role="group"
				aria-label={side === 'left' ? 'Left end' : 'Right end'}
			>
				{#each list as c, i (c.id)}{@render gap(side, i)}{@render slot(c, side)}{/each}
				{@render gap(side, list.length)}
				{#if side === 'left' && !controls.length}<span class="empty">Empty: a 📌 by a control in the outline puts it here.</span>{/if}
			</span>
		{/each}
	</div>
	{#if panels.length}
		<div class="panels" data-layout="panels">
			{#each panels as c, i (c.id)}
				{@const shut = bar.isShut(c.id)}
				{@render gap('panels', i)}
				<section
					class={['panel', { lifted: lift?.id === c.id, hot: hot === c.id }]}
					data-item
					aria-label={c.label}
					onpointerenter={(e) => enter(e, c.id)}
					onpointerleave={(e) => leave(e, c.id)}
					onpointerdowncapture={(e) => seekPress(e, c.id)}
					onmousedowncapture={(e) => seekPress(e, c.id)}
					onclickcapture={(e) => seekPress(e, c.id)}
				>
					{@render handles(c, 'panels')}
					<span class="proxy" aria-hidden="true">⠿ {c.label}</span>
					<header>
						<button type="button" class="fold" aria-expanded={!shut} title={shut ? `Open ${c.label}` : `Close ${c.label} to a line`} onclick={() => bar.toggleShut(c.id)}>{shut ? '▸' : '▾'}</button>
						<span class="title">{c.label}</span>
						{#if shut && c.brief}<span class="brief">{@render c.brief()}</span>{/if}
					</header>
					{#if !shut}<div class="body">{@render c.render(true)}</div>{/if}
				</section>
			{/each}
			{@render gap('panels', panels.length)}
		</div>
	{/if}
</div>

<style>
	.toolbar {
		--handle: 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
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
	/* Spacing is the items' own margins, not the flex gap, so a closed gap takes no room. */
	.slot {
		position: relative;
		display: inline-flex;
		align-items: center;
		margin-inline: 0.2rem;
	}
	/* Where the lifted item would land: room its size, opening and closing. */
	.gap {
		flex: none;
		width: 0;
		height: 1.6rem;
		border-radius: 4px;
		transition:
			width 0.16s ease-out,
			height 0.16s ease-out,
			margin 0.16s ease-out;
	}
	.gap.open {
		outline: 1.5px dashed color-mix(in srgb, currentColor 55%, transparent);
		outline-offset: -1.5px;
		background: color-mix(in srgb, currentColor 8%, transparent);
	}
	.end > .gap.open {
		width: var(--lift);
		margin-inline: 0.2rem;
	}
	.panels {
		display: flex;
		flex-direction: column;
	}
	.panels > .gap {
		display: block;
		width: auto;
		height: 0;
	}
	.panels > .gap.open {
		height: 2rem;
		margin-block: 0.2rem;
	}
	@media (prefers-reduced-motion: reduce) {
		.gap {
			transition: none;
		}
	}
	.lifted {
		opacity: 0.25;
	}
	/* A panel's picture while it is dragged: a chip, kept out of sight until then. */
	.proxy {
		position: fixed;
		top: -100px;
		left: 0;
		padding: 2px 8px;
		border: 1px solid CanvasText;
		border-radius: 4px;
		background: Canvas;
		color: CanvasText;
		font: 600 0.8rem system-ui, sans-serif;
		white-space: nowrap;
		pointer-events: none;
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
	/* One item's at a time, by the pointer (hot, in the script), or by keyboard focus. */
	@media (hover: hover) {
		.handle {
			opacity: 0;
			visibility: hidden;
		}
		.hot > .handle,
		.slot:has(:focus-visible) > .handle,
		.panel:has(:focus-visible) > .handle {
			opacity: 1;
			visibility: visible;
			transition: opacity 0.08s;
		}
	}
	.slot.lifted > .handle,
	.panel.lifted > .handle {
		visibility: hidden;
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
		margin-block: 0.2rem;
		border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
		border-radius: 3px;
		font: 0.8rem ui-monospace, monospace;
	}
	.panel header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 0.5rem;
		padding: 0 0.4rem;
	}
	.panel header .title {
		opacity: 0.75;
	}
	.fold {
		padding: 0 0.2rem;
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
	.brief {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 0.4rem;
	}
	.panel .title {
		font-weight: 600;
	}
	.panel .body {
		padding: 0.15rem 0.4rem 0.3rem;
	}
</style>
