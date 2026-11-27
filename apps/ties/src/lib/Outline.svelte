<script>
	import { untrack } from 'svelte';
	import { reveal } from './outline-reveal.svelte.js';
	/**
	 * One node of the machine pages' outline: a heading row that opens and closes the content
	 * under it, and the content, which holds more nodes. The row shows a triangle, the title,
	 * `summary` (open or closed, so the outline reads the same either way) and `actions`, buttons
	 * that work without opening the node. Open and the content's height are kept per `id` in
	 * this browser. `resize` puts a bar under the content to drag its height; a double click on
	 * the bar lets it take what it needs again. `opened` is how it starts the first time, before
	 * the person has opened or closed it. `move` lets the person reorder nodes: drag the grip onto
	 * another node's row to put this one there, or Alt+Up and Alt+Down on the title. `pin` names
	 * the panel this node's content is offered to the toolbar as: its row gets the 📌 (or ⏏️).
	 */
	/** @typedef {import('svelte').Snippet} Snippet */
	/** @type {{ id: string, title: string, hint?: string, summary?: string | Snippet, actions?: Snippet, resize?: boolean, open?: boolean, opened?: boolean, move?: (id: string, to: string | number) => void, pin?: { bar: import('./toolbar.svelte.js').Toolbar, id: string }, children: Snippet }} */
	let { id, title, hint = '', summary, actions, resize = false, open = $bindable(), opened = false, move, pin, children } = $props();
	const pinned = $derived(!!pin && pin.bar.has(pin.id));
	const pinLabel = $derived(pin ? (pin.bar.controls.get(pin.id)?.label ?? title) : '');

	const key = () => `outline:${id}`;
	const kept = (() => {
		try {
			return JSON.parse(globalThis.localStorage?.getItem(key()) ?? 'null');
		} catch {
			return null;
		}
	})();
	if (open === undefined) open = typeof kept?.open === 'boolean' ? kept.open : untrack(() => opened);
	/** The content's height in pixels when dragged; null takes what the content needs. */
	let height = $state(/** @type {number | null} */ (typeof kept?.height === 'number' ? kept.height : null));

	function save() {
		try {
			globalThis.localStorage?.setItem(key(), JSON.stringify({ open, height }));
		} catch {
			/* Storage full or forbidden: the outline forgets. */
		}
	}

	// Opened from outside: on the way to a control's home (outline-reveal.svelte.js).
	$effect(() => {
		if (reveal.n && reveal.ids.includes(id) && !untrack(() => open)) {
			open = true;
			save();
		}
	});

	function toggle() {
		open = !open;
		save();
	}

	const DRAG = 'text/x-outline-node';
	let over = $state(false);

	/** @param {KeyboardEvent} e */
	function moveKey(e) {
		if (!move || !e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
		e.preventDefault();
		move(id, e.key === 'ArrowUp' ? -1 : 1);
		const el = /** @type {HTMLElement} */ (e.currentTarget);
		requestAnimationFrame(() => el.focus({ preventScroll: true }));
	}

	/** @type {HTMLElement | null} */
	let body = $state(null);

	/** @param {PointerEvent} e */
	function drag(e) {
		if (!body) return;
		e.preventDefault();
		const bar = /** @type {HTMLElement} */ (e.currentTarget);
		bar.setPointerCapture(e.pointerId);
		const from = e.clientY;
		const start = body.getBoundingClientRect().height;
		/** @param {PointerEvent} m */
		const follow = (m) => (height = Math.max(24, Math.round(start + m.clientY - from)));
		const up = () => {
			bar.removeEventListener('pointermove', follow);
			bar.removeEventListener('pointerup', up);
			bar.removeEventListener('pointercancel', up);
			save();
		};
		bar.addEventListener('pointermove', follow);
		bar.addEventListener('pointerup', up);
		bar.addEventListener('pointercancel', up);
	}

	/** @param {KeyboardEvent} e */
	function nudge(e) {
		if (!body || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
		e.preventDefault();
		height = Math.max(24, Math.round(body.getBoundingClientRect().height + (e.key === 'ArrowDown' ? 16 : -16)));
		save();
	}
</script>

<section class="node" aria-label={title} data-home={pin?.id}>
	<!-- The whole row opens and closes the node for a pointer, a target as wide as the page; the
	     keyboard has the twisty button, so the row itself needs no key handler. -->
	<div
		class={['head', { over }]}
		role="presentation"
		onclick={(e) => {
			if (!(e.target instanceof Element) || e.target.closest('button, a, input, select, textarea, label, .grip')) return;
			toggle();
		}}
		ondragover={(e) => {
			if (!move || !e.dataTransfer?.types.includes(DRAG)) return;
			e.preventDefault();
			over = true;
		}}
		ondragleave={() => (over = false)}
		ondrop={(e) => {
			over = false;
			const from = e.dataTransfer?.getData(DRAG);
			if (move && from && from !== id) {
				e.preventDefault();
				move(from, id);
			}
		}}
	>
		{#if move}
			<span
				class="grip"
				draggable="true"
				role="img"
				aria-label="Drag to move {title}; or Alt+Up and Alt+Down on its title"
				title="Drag onto another row to move {title} there; or Alt+Up and Alt+Down on its title"
				ondragstart={(e) => {
					e.dataTransfer?.setData(DRAG, id);
					if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
				}}>⠿</span
			>
		{/if}
		<button
			type="button"
			class="twisty"
			aria-expanded={open}
			aria-keyshortcuts={move ? 'Alt+ArrowUp Alt+ArrowDown' : undefined}
			title={hint || (open ? `Close ${title}` : `Open ${title}`)}
			onclick={toggle}
			onkeydown={moveKey}
			><span class="tri" aria-hidden="true">{open ? '▾' : '▸'}</span><span class="title">{title}</span></button
		>
		{#if pin?.bar.live && pin.bar.controls.has(pin.id)}
			<button
				type="button"
				class={['pin', { pinned }]}
				aria-label={pinned ? `Take ${pinLabel} out of the toolbar` : `Put ${pinLabel} in the toolbar`}
				title={pinned ? `Take ${pinLabel} out of the toolbar` : `Put ${pinLabel} in the toolbar, under the row of controls`}
				onclick={() => pin.bar.toggle(pin.id)}>{pinned ? '⏏️' : '📌'}</button
			>
		{/if}
		{#if actions}<span class="actions">{@render actions()}</span>{/if}
		{#if typeof summary === 'string'}
			{#if summary}<span class="summary" title={summary}>{summary}</span>{/if}
		{:else if summary}
			<span class="summary">{@render summary()}</span>
		{/if}
	</div>
	{#if open}
		<div class="body" class:sized={height !== null} bind:this={body} style:height={height !== null ? `${height}px` : null}>
			{@render children()}
		</div>
		{#if resize}
			<button
				type="button"
				class="bar"
				aria-label="Height of {title}: drag, or the arrow keys; double click to fit"
				title="Drag to change the height; double click to fit"
				onpointerdown={drag}
				onkeydown={nudge}
				ondblclick={() => ((height = null), save())}
			></button>
		{/if}
	{/if}
</section>

<style>
	.node {
		border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent);
	}
	.head {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 1.75rem;
		min-width: 0;
		cursor: pointer;
	}
	.head:hover {
		background: color-mix(in srgb, currentColor 5%, transparent);
	}
	.head.over {
		box-shadow: inset 0 2px 0 currentColor;
	}
	.grip {
		flex: none;
		align-self: stretch;
		display: inline-flex;
		align-items: center;
		padding: 0 0.15rem;
		cursor: grab;
		opacity: 0.35;
		user-select: none;
	}
	.head:hover .grip {
		opacity: 0.8;
	}
	.twisty {
		display: inline-flex;
		align-items: baseline;
		gap: 0.3rem;
		flex: none;
		padding: 0.1rem 0.2rem 0.1rem 0;
		border: none;
		background: none;
		color: inherit;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		text-align: left;
	}
	.twisty:hover .title {
		text-decoration: underline;
	}
	.tri {
		display: inline-block;
		width: 0.8em;
		opacity: 0.7;
	}
	.pin {
		flex: none;
		padding: 0 0.1rem;
		border: none;
		background: none;
		font-size: 0.7rem;
		line-height: 1;
		opacity: 0.4;
		cursor: pointer;
	}
	.pin:hover,
	.pin:focus-visible {
		opacity: 1;
	}
	.pin.pinned {
		opacity: 0.6;
	}
	.actions {
		display: inline-flex;
		gap: 0.3rem;
		flex: none;
	}
	.summary {
		flex: 1 1 0;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		opacity: 0.7;
		font-size: 0.9em;
	}
	/* Tight: a level is under a centimeter in, so deep nodes keep the width. */
	.body {
		margin-left: 0.35rem;
		padding: 0.15rem 0 0.35rem 0.55rem;
		border-left: 1px solid color-mix(in srgb, currentColor 22%, transparent);
	}
	.body.sized {
		overflow: auto;
	}
	/* 12px to grab, 4px to see: the line in the middle of a transparent band. */
	.bar {
		--line: color-mix(in srgb, currentColor 14%, transparent);
		height: 12px;
		display: block;
		width: calc(100% - 0.35rem);
		padding: 0;
		border: none;
		margin-left: 0.35rem;
		cursor: ns-resize;
		background: linear-gradient(transparent 4px, var(--line) 4px, var(--line) 8px, transparent 8px);
		touch-action: none;
	}
	.bar:hover,
	.bar:focus-visible {
		--line: color-mix(in srgb, currentColor 40%, transparent);
	}
</style>
