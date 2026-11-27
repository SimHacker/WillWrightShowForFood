<script>
	/**
	 * The viewer, a node of a machine page's outline, first until it is dragged elsewhere: a row with what web-panel.svelte.js
	 * has open, closing to its title like any other, with the opener's buttons, a link out and a
	 * close box on the row. Under it a video, a markdown file read in place, or a page in a
	 * frame, with a grip to make it taller or shorter. It scrolls into view when a link or a
	 * watch opens it, and again when one asks for it while it is open. It also catches plain
	 * clicks on the links it can show, anywhere on the page.
	 */
	import MarkdownIt from 'markdown-it';
	import Outline from './Outline.svelte';
	import { closeWeb, githubMarkdown, openWeb, viewable, webPanel } from './web-panel.svelte.js';

	/**
	 * `id` is its place in the page's outline order, and `move` lets it be dragged there like
	 * any node; it opens where it was put.
	 * @type {{ id?: string, move?: (id: string, to: string | number) => void }}
	 */
	let { id = 'viewer', move } = $props();

	/** @typedef {'web' | 'youtube' | 'markdown'} Kind */
	const MIN = 120;
	/** @param {Kind} kind */
	const key = (kind) => `web-panel-height-${kind}`;
	/** A height the person set, kept in this browser per kind; null for the usual. @param {Kind} kind */
	function kept(kind) {
		try {
			const n = Number(globalThis.localStorage?.getItem(key(kind)));
			return Number.isFinite(n) && n >= MIN ? n : null;
		} catch {
			return null;
		}
	}
	/** @param {Kind} kind */
	function keep(kind) {
		try {
			const h = heights[kind];
			if (h === null) globalThis.localStorage?.removeItem(key(kind));
			else globalThis.localStorage?.setItem(key(kind), String(h));
		} catch {
			/* Storage forbidden: the height lasts until the page goes. */
		}
	}
	/** @type {Record<Kind, number | null>} */
	const heights = $state({ web: kept('web'), youtube: kept('youtube'), markdown: kept('markdown') });
	/** @type {HTMLElement | undefined} */
	let frame = $state();
	/** @type {{ y: number, from: number, kind: Kind } | null} */
	let sizing = null;

	/** @param {PointerEvent} e @param {Kind} kind */
	function gripdown(e, kind) {
		if (e.button !== 0 || !frame) return;
		e.preventDefault();
		/** @type {HTMLElement} */ (e.currentTarget).setPointerCapture(e.pointerId);
		sizing = { y: e.clientY, from: frame.offsetHeight, kind };
	}
	/** @param {PointerEvent} e */
	function gripmove(e) {
		if (sizing) heights[sizing.kind] = Math.max(MIN, Math.round(sizing.from + e.clientY - sizing.y));
	}
	function gripup() {
		if (!sizing) return;
		keep(sizing.kind);
		sizing = null;
	}
	/** 20 pixels a press, 100 with Shift. @param {KeyboardEvent} e @param {Kind} kind */
	function gripkey(e, kind) {
		if (!frame || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
		e.preventDefault();
		heights[kind] = Math.max(MIN, frame.offsetHeight + (e.key === 'ArrowDown' ? 1 : -1) * (e.shiftKey ? 100 : 20));
		keep(kind);
	}

	const md = new MarkdownIt({ linkify: true });
	/** The markdown file's page, as HTML, or what went wrong; null while it comes. @type {{ url: string, html: string } | null} */
	let doc = $state(null);

	/**
	 * Read a markdown file's text and make it a page: links go where they go on GitHub and open
	 * here too, the browser's ⌘-click still a tab, and pictures come raw.
	 * @param {string} url @param {string} raw
	 */
	async function read(url, raw) {
		let html;
		try {
			const res = await fetch(raw);
			if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
			const text = (await res.text()).replace(/^---\n[\s\S]*?\n---\n/, '');
			const page = document.createElement('div');
			page.innerHTML = md.render(text);
			for (const a of page.querySelectorAll('a[href]')) {
				const to = new URL(/** @type {string} */ (a.getAttribute('href')), url).href;
				a.setAttribute('href', to);
				if (to.startsWith(`${url}#`) || !/^https?:/.test(to)) continue;
				a.setAttribute('target', '_blank');
				a.setAttribute('rel', 'noopener noreferrer');
				a.setAttribute('data-view', '');
			}
			for (const img of page.querySelectorAll('img[src]')) img.setAttribute('src', new URL(/** @type {string} */ (img.getAttribute('src')), raw).href);
			html = page.innerHTML;
		} catch (err) {
			html = `<p>Could not read ${raw}: ${/** @type {Error} */ (err).message}. GitHub ↗ opens it there.</p>`;
		}
		if (webPanel.view?.url === url) doc = { url, html };
	}
	$effect(() => {
		const v = webPanel.view;
		if (v?.kind === 'markdown' && doc?.url !== v.url) {
			doc = null;
			read(v.url, v.raw);
		}
	});

	/** @param {MouseEvent} e */
	function caught(e) {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		const a = /** @type {Element | null} */ (e.target)?.closest?.('a[href]');
		if (!(a instanceof HTMLAnchorElement) || a.closest('.web .links')) return;
		if (!viewable(a.href) && !a.hasAttribute('data-view')) return;
		e.preventDefault();
		const name = a.title.split('. Opens ')[0].split(': ')[0] || a.textContent?.trim() || a.href;
		openWeb(a.href, { title: githubMarkdown(a.href) && !a.title ? a.href.replace(/^https:\/\/github\.com\/[^/]+\/[^/]+\/(blob|tree)\/[^/]+\//, '') : name, reveal: true });
	}
</script>

<svelte:document onclick={caught} />

{#snippet links()}
	{@const v = webPanel.view}
	{#if v}
		<span class="links">
			{#each v.buttons as b (b.label)}
				{#if b.checked}
					<label class="mine" title={b.title}><input type="checkbox" checked={b.checked()} onchange={b.action} /> {b.label}</label>
				{:else}
					<button type="button" class="mine" title={b.title} onclick={b.action}>{b.label}</button>
				{/if}
			{/each}
			<a class="out" href={v.url} target="_blank" rel="noopener noreferrer" title="Open {v.url} in a new tab">{v.kind === 'youtube' ? 'YouTube' : v.kind === 'markdown' ? 'GitHub' : 'New tab'} ↗</a>
			<button type="button" title="Close the viewer" aria-label="Close the viewer" onclick={closeWeb}>✕</button>
		</span>
	{/if}
{/snippet}

{#if webPanel.view}
	{@const v = webPanel.view}
	{@const h = heights[v.kind]}
	<div class="web" {@attach (el) => void (webPanel.reveals && v.reveal && el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))}>
		<Outline {id} {move} title={v.title.length > 64 ? `${v.title.slice(0, 63)}…` : v.title} hint="The viewer: {v.url}" end={links} bind:open={webPanel.open}>
			{#key v.url}
				{#if v.kind === 'youtube'}
					<iframe
						bind:this={frame}
						class="video"
						style:height={h === null ? null : `${h}px`}
						style:width={h === null ? null : `min(100%, ${(h * 16) / 9}px)`}
						src={v.src}
						title={v.title}
						allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
						allowfullscreen
					></iframe>
				{:else if v.kind === 'markdown'}
					<article bind:this={frame} class="markdown" style:height={h === null ? null : `${h}px`}>
						{#if doc?.url === v.url}
							<!-- markdown-it with HTML off: the file's own tags are text, and its links are checked. -->
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html doc.html}
						{:else}
							<p>Reading {v.raw}…</p>
						{/if}
					</article>
				{:else}
					<iframe bind:this={frame} class="page" style:height={h === null ? null : `${h}px`} src={v.src} title={v.title} sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
				{/if}
			{/key}
			<button
				type="button"
				class="grip"
				aria-label="The viewer's height: drag, or the up and down arrow keys"
				title="Drag to make the viewer taller or shorter; kept for every {v.kind === 'youtube' ? 'video' : v.kind === 'markdown' ? 'file' : 'page'}. Arrow keys: a little at a time, Shift for more. Double-click: back to the usual height."
				onpointerdown={(e) => gripdown(e, v.kind)}
				onpointermove={gripmove}
				onpointerup={gripup}
				onpointercancel={gripup}
				onkeydown={(e) => gripkey(e, v.kind)}
				ondblclick={() => {
					heights[v.kind] = null;
					keep(v.kind);
				}}
			></button>
			{#if v.kind === 'web'}<p class="note">A site that forbids being shown inside another page stays blank here; New tab ↗ opens it.</p>{/if}
		</Outline>
	</div>
{/if}

<style>
	.links {
		display: inline-flex;
		align-items: center;
		gap: 0.6em;
		font: 0.85em system-ui, sans-serif;
	}
	.mine {
		font-weight: 600;
	}
	label.mine {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		cursor: pointer;
	}
	iframe {
		display: block;
		width: 100%;
		border: 0;
	}
	/* A video the size of its picture: as wide as fits, but never taller than most of the window. */
	.video {
		width: min(100%, 70vh * 16 / 9);
		aspect-ratio: 16 / 9;
		background: #000;
	}
	/* A page in a short window onto it, so the machine stays in sight; New tab ↗ for the whole. */
	.page {
		height: min(45vh, 28rem);
		background: #fff;
	}
	.markdown {
		height: min(50vh, 32rem);
		overflow: auto;
		padding: 0 0.8rem;
		border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
		border-radius: 4px;
		font: 0.9rem/1.45 system-ui, sans-serif;
	}
	.markdown :global(table) {
		border-collapse: collapse;
	}
	.markdown :global(th),
	.markdown :global(td) {
		padding: 0.15rem 0.5rem;
		border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
		vertical-align: top;
	}
	.markdown :global(pre) {
		overflow: auto;
	}
	.markdown :global(img) {
		max-width: 100%;
	}
	.grip {
		display: grid;
		width: 100%;
		height: 0.75rem;
		padding: 0;
		border: none;
		background: none;
		color: inherit;
		place-items: center;
		cursor: ns-resize;
		touch-action: none;
	}
	.grip::before {
		content: '';
		width: 3rem;
		height: 3px;
		border-radius: 2px;
		background: currentColor;
		opacity: 0.35;
	}
	.grip:hover::before,
	.grip:focus-visible::before {
		opacity: 0.8;
	}
	.note {
		margin: 0;
		font: 0.8em system-ui, sans-serif;
		opacity: 0.7;
	}
</style>
