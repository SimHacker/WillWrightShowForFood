<script>
	/**
	 * The person's toolbar under a machine's screen (see toolbar.svelte.js): the controls they
	 * pinned on a row, in their order, with `end` (the speed) at the right; then the panels
	 * they pinned, one under another. Each has a ⠿ to drag it to another place among its kind
	 * (or the arrow keys on it: left and right on the row, up and down in the column) and a ⏏️
	 * to take it out. Both skip the tab order on the row, since a control's home has the 📌.
	 * A click on the ⠿, or a ⌘-click (Ctrl-click off a Mac) on the item itself, goes to its home
	 * in the outline, opening the nodes it is under: go to the original, as an editor's
	 * ⌘-click goes to a definition.
	 */
	/** @type {{ bar: import('./toolbar.svelte.js').Toolbar, label: string, end?: import('svelte').Snippet }} */
	let { bar, label, end } = $props();

	$effect(() => bar.show());

	const shown = $derived(bar.pinned.flatMap((id) => {
		const c = bar.controls.get(id);
		return c ? [{ id, ...c }] : [];
	}));
	const controls = $derived(shown.filter((c) => c.kind === 'control'));
	const panels = $derived(shown.filter((c) => c.kind === 'panel'));

	const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
	const SEEK = mac ? '⌘-click' : 'Ctrl-click';

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
	/** The item a drag is over, to mark where it would go. */
	let over = $state('');

	/** @param {DragEvent} e @param {string} id */
	function start(e, id) {
		e.dataTransfer?.setData(DRAG, id);
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}
	/** @param {DragEvent} e @param {string} id */
	function dragover(e, id) {
		if (!e.dataTransfer?.types.includes(DRAG)) return;
		e.preventDefault();
		over = id;
	}
	/** @param {DragEvent} e @param {string} id */
	function drop(e, id) {
		over = '';
		const from = e.dataTransfer?.getData(DRAG);
		if (!from || from === id) return;
		e.preventDefault();
		bar.move(from, id);
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
	<span class="handles">
		<button
			type="button"
			class="out"
			tabindex={way === 'row' ? -1 : 0}
			aria-label="Take {c.label} out of the toolbar"
			title="Take {c.label} out of the toolbar; the 📌 by it in the outline puts it back"
			onclick={() => bar.unpin(c.id)}>⏏️</button
		>
		<button
			type="button"
			class="grip"
			draggable="true"
			tabindex={way === 'row' ? -1 : 0}
			aria-label="Move {c.label}: drag it, or the arrow keys; press it to find {c.label} in the outline"
			title="Drag to move {c.label} to another place, or the arrow keys on this. Click to find it in the outline; {SEEK} on {c.label} itself does too."
			onclick={() => bar.seek(c.id)}
			ondragstart={(e) => start(e, c.id)}
			onkeydown={(e) => key(e, c.id, way)}>⠿</button
		>
	</span>
{/snippet}

<div class="toolbar">
	<div class="row" role="toolbar" aria-label={label}>
		{#each controls as c (c.id)}
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
		{:else}
			<span class="empty">Empty: a 📌 by a control in the outline puts it here.</span>
		{/each}
		{#if end}<span class="end">{@render end()}</span>{/if}
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
			<header>{@render handles(c, 'column')}<span class="title">{c.label}</span></header>
			<div class="body">{@render c.render(true)}</div>
		</section>
	{/each}
</div>

<style>
	.toolbar {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
		font: 0.85rem system-ui, sans-serif;
	}
	.slot {
		display: inline-flex;
		align-items: center;
	}
	.slot.over {
		box-shadow: inset 2px 0 0 currentColor;
	}
	.end {
		margin-left: auto;
	}
	.empty {
		opacity: 0.6;
	}
	/* ⏏️ over ⠿, one narrow column beside the control. Small, as moving and taking out are
	   rare next to using it; shown on hover, and always where there is no hover; keeping
	   their room either way, so the row never shifts. */
	.handles {
		display: inline-flex;
		flex-direction: column;
		align-self: stretch;
		justify-content: space-between;
	}
	.out,
	.grip {
		padding: 0 0.1rem;
		border: none;
		background: none;
		color: inherit;
		font-size: 0.6rem;
		line-height: 1;
		cursor: pointer;
	}
	.grip {
		cursor: grab;
	}
	@media (hover: hover) {
		.slot .handles {
			opacity: 0;
		}
		.slot:hover .handles,
		.slot:focus-within .handles {
			opacity: 0.8;
		}
	}
	.panel {
		border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
		border-radius: 3px;
		font: 0.8rem ui-monospace, monospace;
	}
	.panel.over {
		box-shadow: inset 0 2px 0 currentColor;
	}
	.panel header {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0 0.3rem;
		opacity: 0.75;
	}
	.panel header .handles {
		flex-direction: row;
		gap: 0.2rem;
	}
	.panel .title {
		font-weight: 600;
	}
	.panel .body {
		padding: 0.15rem 0.4rem 0.3rem;
	}
</style>
