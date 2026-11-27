<script>
	/**
	 * A machine page's preferences, at the bottom of its outline: the way back to how the page
	 * first came. The toolbar resets at once; everything else the page keeps in this browser
	 * (the outline's order and folds, panel sizes, views, volumes, the dance's style) is
	 * forgotten and the page reloads, since each part reads what it keeps as it starts. What
	 * the person made rather than chose, such as saved music seeds, is kept.
	 */
	/**
	 * `keys` match the localStorage keys the page keeps; `kept` says what a reset leaves alone.
	 * @type {{ bar: import('./toolbar.svelte.js').Toolbar, keys: RegExp[], kept?: string }}
	 */
	let { bar, keys, kept = '' } = $props();

	let said = $state('');

	const stored = () => {
		try {
			return Object.keys(globalThis.localStorage ?? {}).filter((k) => keys.some((r) => r.test(k)));
		} catch {
			return [];
		}
	};

	function resetToolbar() {
		bar.reset();
		said = 'The toolbar is as it first came.';
	}

	function resetAll() {
		const found = stored();
		if (!confirm(`Forget all ${found.length} settings this page keeps in this browser, and reload it as it first came?${kept ? ` ${kept} stay.` : ''}`)) return;
		for (const k of found) {
			try {
				globalThis.localStorage?.removeItem(k);
			} catch {
				/* Storage forbidden: nothing to forget. */
			}
		}
		location.reload();
	}
</script>

<div class="prefs">
	<div class="row">
		<button type="button" title="Put the toolbar back as it first came: its controls, their order and ends" onclick={resetToolbar}>↺ Reset the toolbar</button>
		<button type="button" title="Forget everything this page keeps in this browser (outline, sizes, views, volumes, the toolbar) and reload it as it first came" onclick={resetAll}
			>⟲ Reset everything on this page…</button
		>
	</div>
	<p class="note">{said || `This page keeps ${stored().length} settings in this browser.${kept ? ` A reset keeps ${kept}.` : ''}`}</p>
</div>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: center;
	}
	.note {
		margin: 0.3rem 0 0;
		opacity: 0.7;
	}
</style>
