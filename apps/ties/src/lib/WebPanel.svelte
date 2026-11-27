<script>
	/**
	 * The viewer, a node of a machine page's outline, first until it is dragged elsewhere: a row with what web-panel.svelte.js
	 * has open, closing to its title like any other, with the opener's buttons, a link out and a
	 * close box on the row. Under it a video, a GitHub file read in place (markdown, text or a
	 * PDF in the browser's reader), a page in a frame, or for a site that refuses frames a card
	 * with the way out; with a grip to make it taller or shorter. It scrolls into view when a link or a
	 * watch opens it, and again when one asks for it while it is open. It also catches plain
	 * clicks on the links it can show, anywhere on the page.
	 */
	import MarkdownIt from 'markdown-it';
	import Outline from './Outline.svelte';
	import { closeWeb, githubRaw, openWeb, viewable, webPanel } from './web-panel.svelte.js';

	/**
	 * `id` is its place in the page's outline order, and `move` lets it be dragged there like
	 * any node; it opens where it was put.
	 * @type {{ id?: string, move?: (id: string, to: string | number) => void }}
	 */
	let { id = 'viewer', move } = $props();

	/** @typedef {import('./web-panel.svelte.js').ViewKind} Kind */
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
	const heights = $state({ web: kept('web'), youtube: kept('youtube'), markdown: kept('markdown'), text: kept('text'), pdf: kept('pdf'), card: null });
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
	/**
	 * A GitHub file, fetched: the page made of it, or the PDF's address for the browser's reader,
	 * or what went wrong; null while it comes.
	 * @type {{ url: string, html?: string, pdf?: string, failed?: string } | null}
	 */
	let doc = $state(null);

	/** A repository's README may be spelled in lower case. @param {string} raw */
	async function fetchRaw(raw) {
		let res = await fetch(raw);
		if (res.status === 404 && raw.endsWith('/README.md')) res = await fetch(raw.replace(/README\.md$/, 'readme.md'));
		if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
		return res;
	}

	/**
	 * Read a GitHub file and make it something to see. Markdown becomes a page whose links go
	 * where they go on GitHub and open here too, the browser's ⌘-click still a tab, with its
	 * pictures raw; text is shown as it is; a PDF is handed to the browser's reader, which
	 * GitHub's raw files are not, being served as bytes.
	 * @param {import('./web-panel.svelte.js').WebView} v
	 */
	async function read(v) {
		const { url, raw, kind } = v;
		/** @type {NonNullable<typeof doc>} */
		let got;
		try {
			const res = await fetchRaw(raw);
			if (kind === 'pdf') {
				got = { url, pdf: URL.createObjectURL(new Blob([await res.arrayBuffer()], { type: 'application/pdf' })) };
			} else if (kind === 'text') {
				const pre = document.createElement('pre');
				pre.textContent = await res.text();
				got = { url, html: pre.outerHTML };
			} else {
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
				got = { url, html: page.innerHTML };
			}
		} catch (err) {
			got = { url, failed: `Could not read ${raw}: ${/** @type {Error} */ (err).message}.` };
		}
		if (webPanel.view?.url === url) doc = got;
		else if (got.pdf) URL.revokeObjectURL(got.pdf);
	}
	$effect(() => {
		const v = webPanel.view;
		if (v?.raw && doc?.url !== v.url) {
			doc = null;
			read(v);
		}
	});
	$effect(() => {
		const pdf = doc?.pdf;
		return () => pdf && URL.revokeObjectURL(pdf);
	});

	/** @param {MouseEvent} e */
	function caught(e) {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		const a = /** @type {Element | null} */ (e.target)?.closest?.('a[href]');
		if (!(a instanceof HTMLAnchorElement) || a.closest('.web .links')) return;
		if (!viewable(a.href) && !a.hasAttribute('data-view')) return;
		e.preventDefault();
		const name = a.dataset.name || a.title.split('. Opens ')[0].split(': ')[0] || a.textContent?.trim() || a.href;
		const path = githubRaw(a.href) && !a.title && !a.dataset.name ? a.href.replace(/^https:\/\/github\.com\//, '').replace(/\/(blob|tree)\/[^/]+\//, ' / ') : '';
		openWeb(a.href, { title: path || name, about: a.dataset.about ?? '', reveal: true });
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
			<a class="out" href={v.url} target="_blank" rel="noopener noreferrer" title="Open {v.url} in a new tab">{v.kind === 'youtube' ? 'YouTube' : v.raw ? 'GitHub' : 'New tab'} ↗</a>
			<button type="button" title="Close the viewer" aria-label="Close the viewer" onclick={closeWeb}>✕</button>
		</span>
	{/if}
{/snippet}

{#snippet card(/** @type {import('./web-panel.svelte.js').WebView} */ v, /** @type {string | undefined} */ failed)}
	<div class="card">
		<p class="name">{v.title}</p>
		{#if v.about}<p>{v.about}</p>{/if}
		<p class="why">{failed ?? `${new URL(v.url).hostname} will not be shown inside another site's page.`}</p>
		<a class="go" href={v.url} target="_blank" rel="noopener noreferrer">Open {v.url.replace(/^https?:\/\//, '').slice(0, 60)} in a new tab ↗</a>
	</div>
{/snippet}

{#if webPanel.view}
	{@const v = webPanel.view}
	{@const h = heights[v.kind]}
	{@const failed = doc?.url === v.url ? doc.failed : undefined}
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
				{:else if v.kind === 'card' || failed}
					{@render card(v, failed)}
				{:else if v.kind === 'markdown' || v.kind === 'text'}
					<article bind:this={frame} class="markdown" class:text={v.kind === 'text'} style:height={h === null ? null : `${h}px`}>
						{#if doc?.url === v.url && doc.html}
							<!-- markdown-it with HTML off, or text set as text: the file's own tags are text, and its links are checked. -->
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html doc.html}
						{:else}
							<p>Reading {v.raw}…</p>
						{/if}
					</article>
				{:else if v.kind === 'pdf'}
					{#if doc?.url === v.url && doc.pdf}
						<iframe bind:this={frame} class="pdf" style:height={h === null ? null : `${h}px`} src={doc.pdf} title={v.title}></iframe>
					{:else}
						<p bind:this={frame} class="pdf wait" style:height={h === null ? null : `${h}px`}>Fetching {v.raw}…</p>
					{/if}
				{:else}
					<iframe bind:this={frame} class="page" style:height={h === null ? null : `${h}px`} src={v.src} title={v.title} sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
				{/if}
			{/key}
			{#if v.kind !== 'card' && !failed}<button
				type="button"
				class="grip"
				aria-label="The viewer's height: drag, or the up and down arrow keys"
				title="Drag to make the viewer taller or shorter; kept for every {{ youtube: 'video', markdown: 'file', text: 'file', pdf: 'PDF', web: 'page', card: '' }[v.kind]}. Arrow keys: a little at a time, Shift for more. Double-click: back to the usual height."
				onpointerdown={(e) => gripdown(e, v.kind)}
				onpointermove={gripmove}
				onpointerup={gripup}
				onpointercancel={gripup}
				onkeydown={(e) => gripkey(e, v.kind)}
				ondblclick={() => {
					heights[v.kind] = null;
					keep(v.kind);
				}}
			></button>{/if}
			{#if v.kind === 'web' && new URL(v.url, location.href).origin !== location.origin}<p class="note">A site that forbids being shown inside another page stays blank here; New tab ↗ opens it.</p>{/if}
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
	.markdown.text {
		padding: 0;
	}
	.markdown.text :global(pre) {
		margin: 0;
		padding: 0.4rem 0.6rem;
		font: 0.8rem/1.35 ui-monospace, monospace;
	}
	.pdf {
		height: min(70vh, 48rem);
		background: #fff;
	}
	.wait {
		display: grid;
		margin: 0;
		place-items: center;
		background: none;
		font: 0.9rem system-ui, sans-serif;
		opacity: 0.7;
	}
	.card {
		max-width: 40rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
		border-radius: 4px;
		font: 0.9rem/1.45 system-ui, sans-serif;
	}
	.card p {
		margin: 0 0 0.4rem;
	}
	.card .name {
		font-weight: 600;
	}
	.card .why {
		opacity: 0.7;
	}
	.card .go {
		display: inline-block;
		padding: 0.25rem 0.7rem;
		border: 1px solid ButtonBorder;
		border-radius: 4px;
		background: ButtonFace;
		color: ButtonText;
		text-decoration: none;
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
