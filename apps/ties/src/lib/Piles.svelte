<!--
  One browser, tiled like 1988: title bar, scrolling article, definition strip,
  control strip. Definition and controls are pinned; the article scrolls under them.
-->
<script>
	import Article from './Article.svelte';
	import ControlPanel from './ControlPanel.svelte';
	import DefinitionWindow from './DefinitionWindow.svelte';
	import { articleHref, pathTrail } from './href.js';

	/** @type {{ browser: import('./pile.svelte.js').Browser, onnavigate?: (t: object) => void }} */
	let { browser, onnavigate } = $props();

	const contents = $derived(browser.contents);
	const article = $derived(contents.article);
	const crumbs = $derived(pathTrail(contents.path));
	let reveal = $state(false);
	let press = $state(null);
	let barEl = $state(null);
	let tapeEl = $state(null);
	let probeEl = $state(null);
	let squeezed = $state(false);
	let keep = $state(1);
	let showAll = $state(false);
	const tail = $derived(squeezed ? crumbs.slice(-keep) : []);

	const DRAG = 4;

	function selected() {
		const sel = window.getSelection();
		return Boolean(sel && !sel.isCollapsed);
	}

	let lastDetail = 1;

	/**
	 * Do not cancel mousedown — that swallows click. Block selection on the
	 * selectstart instead: targets never select, and a second click without a
	 * drag must not pick a word or a paragraph. First press on paper may drag.
	 */
	function onWindowDown(event) {
		if (event.button !== 0) return;
		lastDetail = event.detail;
	}

	function onSelectStart(event) {
		const t = event.target;
		if (t instanceof Element && t.closest('a.ties-link, button, path, [data-applet]')) {
			event.preventDefault();
			return;
		}
		if (lastDetail > 1) event.preventDefault();
	}

	function onPaperDown(event) {
		if (event.button !== 0) return;
		const t = event.target;
		if (!(t instanceof Element)) return;
		// Applets own their presses; the paper's reveal-all is not theirs to trigger.
		if (t.closest('a, button, path, [data-applet]')) return;
		if (selected()) return;
		press = { x: event.clientX, y: event.clientY };
		reveal = true;
	}

	function onPaperMove(event) {
		if (!press) return;
		const dx = event.clientX - press.x;
		const dy = event.clientY - press.y;
		if (dx * dx + dy * dy < DRAG * DRAG) return;
		reveal = false;
		press = null;
	}

	function onPaperUp() {
		reveal = false;
		press = null;
	}

	function navigate(target) {
		if (target?.space && target.space !== 'documents') return;
		if (!target?.slug) return;
		showAll = false;
		if (onnavigate) onnavigate(target);
		else contents.go(target.db ?? contents.db, target.slug);
	}

	function preview(target) {
		if (!target?.slug) return;
		if (target.space && target.space !== 'documents') return;
		browser.definition.preview(target.db ?? contents.db, target.slug);
		browser.arm(target);
	}

	function onCrumb(event, crumb) {
		event.preventDefault();
		showAll = false;
		browser.disarm();
		if (crumb.root) contents.goRoot();
		else contents.truncate(crumb.index);
	}

	$effect(() => {
		const bar = barEl;
		const tape = tapeEl;
		const probe = probeEl;
		const all = showAll;
		const n = crumbs.length;
		if (!bar || !tape) return;
		const fit = () => {
			if (all || n <= 2 || tape.scrollWidth <= bar.clientWidth + 1) {
				squeezed = false;
				keep = 1;
				return;
			}
			const links = [...tape.querySelectorAll('a.ties-link')];
			if (links.length < 2) {
				squeezed = false;
				keep = 1;
				return;
			}
			const widths = links.map((a) => a.getBoundingClientRect().width);
			const sep = tape.querySelector('.sep');
			const sepW = sep ? sep.getBoundingClientRect().width : 12;
			const gap = probe ? probe.getBoundingClientRect().width : sepW * 2 + 12;
			let used = widths[0] + gap + widths[n - 1];
			let k = 1;
			for (let i = n - 2; i >= 1 && k < n - 2; i--) {
				const add = sepW + widths[i];
				if (used + add > bar.clientWidth) break;
				used += add;
				k += 1;
			}
			squeezed = true;
			keep = k;
		};
		const ro = new ResizeObserver(fit);
		ro.observe(bar);
		fit();
		return () => ro.disconnect();
	});

	let scrollerEl = $state(null);

	$effect(() => {
		const el = scrollerEl;
		const pile = contents;
		const _article = article;
		if (!el) return;
		pile.attachScroller(el);
		const ro = new ResizeObserver(() => pile.syncScroll(el));
		ro.observe(el);
		if (el.firstElementChild) ro.observe(el.firstElementChild);
		requestAnimationFrame(() => pile.syncScroll(el));
		return () => ro.disconnect();
	});
</script>

<svelte:window
	onmousedown={onWindowDown}
	onmouseup={onPaperUp}
	onmousemove={onPaperMove}
	onselectstart={onSelectStart}
/>

<div class="ties-window">
	<header class="titlebar">
		<nav
			class="crumbs"
			class:reveal-all={reveal}
			class:squeezed
			class:open={showAll}
			bind:this={barEl}
			aria-label="location"
		>
			{#snippet crumbLink(crumb)}
				<a
					class="ties-link"
					href={articleHref(crumb.db, crumb.slug)}
					onclick={(e) => onCrumb(e, crumb)}
				>{crumb.label}</a>
			{/snippet}
			<span class="probe" bind:this={probeEl} aria-hidden="true">&nbsp;/&nbsp;…&nbsp;/&nbsp;</span>
			<span class="tape" bind:this={tapeEl}>
				{#each crumbs as crumb, i (crumb.index)}
					{#if i > 0}<span class="sep">&nbsp;/&nbsp;</span>{/if}
					{@render crumbLink(crumb)}
				{/each}
			</span>
			{#if squeezed && crumbs.length > 2}
				<span class="fit">
					{@render crumbLink(crumbs[0])}
					<span class="sep">&nbsp;/&nbsp;</span>
					<button type="button" class="ties-link more" onclick={() => (showAll = true)}>…</button>
					{#each tail as crumb (crumb.index)}
						<span class="sep">&nbsp;/&nbsp;</span>
						{@render crumbLink(crumb)}
					{/each}
				</span>
			{/if}
		</nav>
	</header>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="contents"
		class:reveal-all={reveal}
		role="presentation"
		data-pile={contents.name}
		data-class={contents.pileClass}
		bind:this={scrollerEl}
		onscroll={() => contents.syncScroll(scrollerEl)}
		onmousedown={onPaperDown}
	>
		{#if article}
			{#key `${contents.db}/${article.slug}`}
				<Article
					db={contents.db}
					{article}
					{browser}
					titled={false}
					{reveal}
					onpreview={preview}
					onnavigate={navigate}
				/>
			{/key}
		{:else}
			<p class="empty">This pile is empty. HOME reopens the database it left.</p>
		{/if}
	</div>

	<DefinitionWindow pile={browser.definition} {browser} onnavigate={navigate} />

	<div class="controls" data-pile={browser.controls.name}>
		<ControlPanel pile={browser.controls} {reveal} />
	</div>
</div>

<style>
	.ties-window {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		border: 1px solid var(--ink, #000);
		background: var(--paper, #fff);
	}
	.titlebar {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		flex-shrink: 0;
		padding: 0.4rem 0.75rem;
		border-bottom: 1px solid var(--ink, #000);
		font-size: 0.8rem;
		font-weight: 700;
	}
	.crumbs {
		position: relative;
		min-width: 0;
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		line-height: 1.35;
	}
	.crumbs.open {
		white-space: normal;
		overflow: visible;
	}
	.probe {
		position: absolute;
		visibility: hidden;
		pointer-events: none;
		white-space: nowrap;
	}
	.tape {
		display: inline-block;
	}
	.crumbs.squeezed .tape {
		visibility: hidden;
		pointer-events: none;
	}
	.fit {
		position: absolute;
		inset: 0;
		overflow: hidden;
		white-space: nowrap;
	}
	.crumbs :global(a.ties-link),
	.crumbs :global(button.ties-link) {
		color: inherit;
		text-decoration: none;
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		font: inherit;
		font-weight: inherit;
		background: none;
		border: 0;
		padding: 0;
	}
	.crumbs :global(a.ties-link:hover),
	.crumbs :global(button.ties-link:hover),
	.crumbs.reveal-all :global(a.ties-link),
	.crumbs.reveal-all :global(button.ties-link) {
		background: #000;
		color: var(--flash, #00f0d8);
		-webkit-text-fill-color: var(--flash, #00f0d8);
	}
	.contents {
		flex: 1 1 auto;
		min-height: 0;
		overflow: auto;
		padding: 0.5rem 0.75rem 0.75rem;
	}
	.controls {
		flex-shrink: 0;
		border-top: 1px solid var(--ink, #000);
	}
	.empty {
		margin: 0;
		font-size: 0.85rem;
	}
</style>
