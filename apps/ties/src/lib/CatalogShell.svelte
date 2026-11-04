<script>
	/**
	 * One page for everything the cabinet runs (packages/cabinet/CARTRIDGES.md §7a): the catalog
	 * as a tree, a list or by facet, beside the entry it is showing. An entry with `runs` gets
	 * its machine, imported when first needed; going to an entry on another machine reloads the
	 * page, so only one emulator is ever loaded.
	 */
	import { untrack } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { afterNavigate, goto } from '$app/navigation';
	import { parseLaunch, effectiveValues, launchUrl } from '@wwsff/catalog';
	import { catalog, CATALOG_BASE, entryForProgram } from './catalog.js';
	import { machineFor } from './machines.js';
	import { loadRepoDoc, githubUrl } from './repo-docs.js';

	/** @typedef {import('@wwsff/catalog').CatalogNode} CatalogNode */
	/** @typedef {import('@wwsff/catalog').Entry} Entry */

	/** @type {{ path: string, redirect?: string | null, home?: boolean }} */
	let { path, redirect = null, home = false } = $props();

	/** The folders open in the tree, kept across visits; the current entry's folders open on arrival. */
	const OPENED = 'cabinet-tree-open';
	const opened = new SvelteSet();
	let restored = false;

	/** @param {string} at */
	function openTo(at) {
		const parts = at.split('/').filter(Boolean);
		for (let i = 1; i < parts.length; i++) opened.add(parts.slice(0, i).join('/'));
	}

	/** @param {string} at @param {boolean} open */
	function remember(at, open) {
		if (filtering || view !== 'tree' || open === opened.has(at)) return;
		if (open) opened.add(at);
		else opened.delete(at);
		localStorage.setItem(OPENED, JSON.stringify([...opened]));
	}

	let search = $state('');
	afterNavigate(() => {
		if (!restored) {
			restored = true;
			width = Math.max(SIDE_MIN, Number(localStorage.getItem(WIDTH)) || width);
			try {
				for (const at of JSON.parse(localStorage.getItem(OPENED) ?? '[]')) opened.add(String(at));
			} catch {
				localStorage.removeItem(OPENED);
			}
		}
		openTo(path);
		peek = null;
		search = location.search;
		const query = new URLSearchParams(search);
		solo = query.has('solo');
		if (solo) sidebar = false;
		document.documentElement.classList.remove('solo');
		const program = home ? query.get('program') : null;
		const old = program ? entryForProgram(program) : undefined;
		if (old) {
			query.delete('program');
			goto(launchUrl(old, {}, { base: CATALOG_BASE }) + (query.size ? `?${query}` : ''), { replaceState: true });
		} else if (redirect) {
			goto(`${CATALOG_BASE}${redirect}/${search}`, { replaceState: true });
		}
	});

	const launch = $derived(parseLaunch(catalog, path, search, { base: '' }));
	const entry = $derived(launch?.entry);
	const folder = $derived(entry ? undefined : catalog.tree(path));
	const values = $derived(entry ? effectiveValues(entry, launch?.values) : {});
	const machine = $derived(machineFor(/** @type {string | undefined} */ (entry?.runs?.machine)));
	const title = $derived(entry?.title ?? (folder?.title || 'Cabinet'));

	/** The machine this page has started; another one needs a fresh page. */
	/** @type {string | undefined} */
	let running = $state();

	/** The entry's machine adapter, imported once; this page is that machine's from then on. */
	/** @param {NonNullable<ReturnType<typeof machineFor>>} m */
	const start = (m) =>
		m.adapter().then((mod) => {
			running = m.name;
			return mod;
		});

	let view = $state(/** @type {'tree' | 'list' | 'facet'} */ ('tree'));
	let text = $state('');
	/** @type {Record<string, string>} */
	let picked = $state({});
	let facet = $state('machine');
	// Opened at an entry's address, the page is that machine: the catalog starts closed. At a
	// folder or the root it starts open. After that it stays as the reader leaves it.
	let sidebar = $state(untrack(() => !catalog.resolve(path)?.entry));
	/** `?solo`: the machine alone, the catalog closed and the entry's notes and guide left out. */
	let solo = $state(false);

	/** The catalog column's width in px, dragged by its edge and kept across visits. */
	const WIDTH = 'cabinet-sidebar-width';
	const SIDE_MIN = 180;
	/** Released narrower than this, the column closes; while dragged there it ghosts out. */
	const SIDE_CLOSE = 120;
	let width = $state(272);
	let dragAt = $state(/** @type {number | null} */ (null));
	let viewW = $state(1024);
	const ghost = $derived(dragAt !== null && dragAt < SIDE_CLOSE);
	const shownWidth = $derived(dragAt === null ? width : Math.max(24, Math.min(dragAt, viewW * 0.6)));

	/** @param {PointerEvent} ev */
	function grab(ev) {
		if (ev.button !== 0) return;
		try {
			/** @type {HTMLElement} */ (ev.currentTarget).setPointerCapture(ev.pointerId);
		} catch {
			/* A pointer the browser does not know, from a script: drag without capture. */
		}
		dragAt = ev.clientX;
	}
	/** @param {PointerEvent} ev */
	function drag(ev) {
		if (dragAt !== null) dragAt = ev.clientX;
	}
	function drop() {
		if (dragAt === null) return;
		if (ghost) sidebar = false;
		else {
			width = Math.round(Math.max(SIDE_MIN, shownWidth));
			localStorage.setItem(WIDTH, String(width));
		}
		dragAt = null;
	}

	const filtering = $derived(text.trim() !== '' || Object.keys(picked).length > 0);
	const found = $derived(catalog.find({ text: text.trim() || undefined, tags: picked }));
	const foundIds = $derived(new Set(found.map((e) => e.id)));
	/** Every tag in the catalog, so the chips stay put while the counts follow the filter. */
	const allFacets = catalog.facets();
	const facetNames = Object.keys(allFacets).sort();
	const counts = $derived(catalog.facets(found));

	/** The tree with only the branches that hold a found entry. */
	/** @param {CatalogNode} node @returns {CatalogNode | undefined} */
	function prune(node) {
		if (node.entry) return foundIds.has(node.entry.id) ? node : undefined;
		const children = node.children.map(prune).filter((c) => c !== undefined);
		return children.length || !filtering ? { ...node, children } : undefined;
	}
	const tree = $derived(view === 'facet' ? catalog.byFacet(facet, found) : catalog.tree());
	const shown = $derived(tree ? (filtering ? prune(tree) : tree) : undefined);

	/** @param {CatalogNode} node */
	const hrefOf = (node) => (node.entry ? launchUrl(node.entry, {}, { base: CATALOG_BASE }) : node.path ? `${CATALOG_BASE}${node.path}/` : CATALOG_BASE);

	/** A link to an entry on another machine than the one running reloads the page. */
	/** @param {Entry | undefined} target */
	const reloads = (target) => {
		const other = /** @type {string | undefined} */ (target?.runs?.machine);
		return running !== undefined && other !== undefined && other !== running && machineFor(other)?.fresh === true;
	};

	/**
	 * The tree item being looked at. A click shows it over the page without leaving the one
	 * running; a double click, or Run, goes there.
	 * @type {CatalogNode | null}
	 */
	let peek = $state(null);
	const peekHere = $derived(!!peek && (peek.entry ? peek.entry === entry : !entry && peek.path === path));

	/** @param {MouseEvent} ev @param {CatalogNode} node */
	function look(ev, node) {
		if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
		ev.preventDefault();
		if (ev.detail < 2) peek = node;
	}

	/** @param {CatalogNode} node */
	function go(node) {
		peek = null;
		const href = hrefOf(node);
		if (reloads(node.entry)) location.assign(href);
		else goto(href);
	}

	/** @param {KeyboardEvent} ev */
	function onkeydown(ev) {
		if (ev.key === 'Escape' && peek) {
			ev.preventDefault();
			ev.stopPropagation();
			peek = null;
		}
	}

	/** @param {string} at */
	const crumbsOf = (at) =>
		at
			.split('/')
			.filter(Boolean)
			.map((_, i, all) => all.slice(0, i + 1).join('/'))
			.map((p) => ({ path: p, title: catalog.tree(p)?.title ?? p }));

	/** @param {string} name @param {string} value */
	function pick(name, value) {
		if (picked[name] === value) delete picked[name];
		else picked[name] = value;
	}

	const crumbs = $derived(crumbsOf(path));
</script>

<svelte:head>
	<title>{path ? `${title} — Cabinet` : title}</title>
	<!-- Prerendered pages cannot see the query, so ?solo is applied by class until the script runs. -->
	{@html `<script>if (/[?&]solo(?:[=&]|$)/.test(location.search)) document.documentElement.classList.add('solo')</script>`}
</svelte:head>

{#snippet link(/** @type {CatalogNode} */ node)}
	{#if !node.entry && view === 'facet'}
		<span>{node.title}</span>
	{:else}
		{@render anchor(node)}
	{/if}
{/snippet}

{#snippet anchor(/** @type {CatalogNode} */ node)}
	<a
		href={hrefOf(node)}
		class={{ entry: !!node.entry, also: node.link, peeked: peek?.path === node.path && peek?.entry === node.entry }}
		aria-current={(node.entry ? node.entry === entry : !entry && !node.link && node.path === path) ? 'page' : undefined}
		data-sveltekit-reload={reloads(node.entry) ? '' : undefined}
		title={node.entry?.description}
		onclick={(ev) => look(ev, node)}
		ondblclick={(ev) => (ev.preventDefault(), go(node))}>{node.title}</a
	>
{/snippet}

{#snippet chips(/** @type {Entry} */ e)}
	<p class="tags">
		{#each Object.entries(e.tags) as [name, vs] (name)}
			{#each vs as v (v)}
				<button class="chip" onclick={() => ((sidebar = true), pick(name, v))} title="Show everything tagged {name}: {v}"
					>{name}: {v}</button
				>
			{/each}
		{/each}
	</p>
{/snippet}

{#snippet guideDoc(/** @type {string} */ at)}
	{#key at}
		{#await loadRepoDoc(at)}
			<p class="wait">Loading the guide…</p>
		{:then html}
			{#if html}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="doc">{@html html}</div>
			{:else}
				<p class="wait"><a href={githubUrl(at)} target="_blank" rel="noopener">{at}</a></p>
			{/if}
		{/await}
	{/key}
{/snippet}

{#snippet contents(/** @type {CatalogNode} */ node)}
	{@const picks = catalog.featured(node.folder)}
	{#if picks.length}
		<h2 class="section">Start here</h2>
		<ul class="contents featured">
			{#each picks as e (e.id)}
				<li>
					{@render link({ path: e.path, slug: '', title: e.title, entry: e, children: [] })}
					{#if e.description}<span class="note">{e.description}</span>{/if}
				</li>
			{/each}
		</ul>
		<h2 class="section">Everything</h2>
	{/if}
	<ul class="contents">
		{#each node.children as child (child.path + (child.link ? '@' : ''))}
			<li>
				{@render link(child)}
				{#if child.entry?.description ?? child.folder?.description}
					<span class="note">{child.entry?.description ?? child.folder?.description}</span>
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet branch(/** @type {CatalogNode} */ node)}
	{#if node.entry}
		<li>{@render link(node)}</li>
	{:else}
		<li>
			<details open={filtering || view === 'facet' || opened.has(node.path)} ontoggle={(ev) => remember(node.path, ev.currentTarget.open)}>
				<summary>{@render link(node)}</summary>
				<ul>
					{#each node.children as child (child.path + (child.link ? '@' : ''))}
						{@render branch(child)}
					{/each}
				</ul>
			</details>
		</li>
	{/if}
{/snippet}

<svelte:window bind:innerWidth={viewW} onkeydowncapture={onkeydown} />

<div class={['catalog', { closed: !sidebar, dragging: dragAt !== null }]} style:--side="{shownWidth}px" style:--kept="{width}px">
	{#if sidebar}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class={['edge', { ghost }]}
			title="Drag to resize; drag narrow and let go to hide"
			onpointerdown={grab}
			onpointermove={drag}
			onpointerup={drop}
			onpointercancel={() => (dragAt = null)}
		></div>
		<aside class={{ ghost }}>
			<div class="bar">
				<span class="brand">Cabinet:</span>
				<button class="toggle" onclick={() => (sidebar = false)} aria-expanded="true" title="Hide the catalog">‹</button>
			</div>
			<input type="search" placeholder="Search titles, tags, notes" bind:value={text} />
			<div class="views" role="group" aria-label="View">
				{#each /** @type {const} */ (['tree', 'list', 'facet']) as v (v)}
					<button class={{ on: view === v }} aria-pressed={view === v} onclick={() => (view = v)}
						>{v === 'facet' ? 'By' : v === 'tree' ? 'Tree' : 'List'}</button
					>
				{/each}
				{#if view === 'facet'}
					<select bind:value={facet} aria-label="Facet">
						{#each facetNames as f (f)}<option value={f}>{f}</option>{/each}
					</select>
				{/if}
			</div>
			<details class="facets" open={filtering}>
				<summary>Tags{#if filtering}: {found.length} found{/if}</summary>
				{#each facetNames as name (name)}
					<div class="facet">
						<span class="name">{name}</span>
						{#each Object.keys(allFacets[name] ?? {}).sort() as value (value)}
							{@const n = counts[name]?.[value] ?? 0}
							<button
								class={['chip', { on: picked[name] === value, none: n === 0 }]}
								aria-pressed={picked[name] === value}
								onclick={() => pick(name, value)}>{value} <span class="num">{n}</span></button
							>
						{/each}
					</div>
				{/each}
				<button class="clear" disabled={!filtering} onclick={() => ((text = ''), (picked = {}))}>Clear</button>
			</details>
			<nav aria-label="Catalog">
				{#if view === 'list'}
					<ul class="flat">
						{#each [...found].filter((e) => e.runs).sort((a, b) => a.title.localeCompare(b.title)) as e (e.id)}
							<li>{@render link({ path: e.path, slug: '', title: e.title, entry: e, children: [] })}</li>
						{/each}
					</ul>
				{:else if shown && view === 'tree'}
					<ul class="tree">
						<li class="root">
							{@render anchor({ ...shown, title: shown.title || 'Cabinet' })}
							<ul>
								{#each shown.children as child (child.path + (child.link ? '@' : ''))}
									{@render branch(child)}
								{/each}
							</ul>
						</li>
					</ul>
				{:else if shown}
					<ul class="tree">
						{#each shown.children as child (child.path + (child.link ? '@' : ''))}
							{@render branch(child)}
						{/each}
					</ul>
				{/if}
				{#if filtering && found.length === 0}<p class="none">Nothing matches.</p>{/if}
			</nav>
		</aside>
	{/if}

	<main>
		<header>
			<div class="titlebar">
				{#if !sidebar}
					<button class="toggle" onclick={() => (sidebar = true)} aria-expanded="false" title="Show the catalog">›</button>
					<a class="brand" href={CATALOG_BASE} title="Everything in the cabinet">Cabinet:</a>
				{/if}
				{#if crumbs.length > 1}
					<span class="crumbs"
						>{#each crumbs.slice(0, -1) as c, i (c.path)}{#if i}/{/if}<a href="{CATALOG_BASE}{c.path}/">{c.title}</a>{/each}:</span
					>
				{/if}
				<h1>{title}</h1>
			</div>
			{#if !solo && (entry?.description ?? folder?.folder?.description)}
				<p class="about">{entry?.description ?? folder?.folder?.description}</p>
			{/if}
			{#if entry && !solo}{@render chips(entry)}{/if}
			{#if launch?.ignored.length}
				<p class="ignored">
					Ignored: {#each launch.ignored as i, n (n)}<code>{i.param}={i.value}</code> ({i.reason}){n < launch.ignored.length - 1 ? ', ' : ''}{/each}
				</p>
			{/if}
		</header>

		{#if entry && machine}
			<div class="machine">
				{#key machine}
					{#await start(machine)}
						<p class="wait">Loading the {machine.title}…</p>
					{:then mod}
						<mod.default {entry} {values} />
					{:catch e}
						<p class="wait">The {machine.title} did not load: {e instanceof Error ? e.message : e}</p>
					{/await}
				{/key}
			</div>
			{#if entry.guide && !solo}
				<details class="guide" open>
					<summary>Guide</summary>
					{@render guideDoc(entry.guide)}
				</details>
			{/if}
		{:else if entry}
			<p class="wait">No machine runs <code>{String(entry.runs?.machine ?? 'nothing')}</code> yet.</p>
		{:else if folder}
			<div class="folder">{@render contents(folder)}</div>
		{/if}

		{#if peek}
			{@const p = peek}
			{@const m = machineFor(/** @type {string | undefined} */ (p.entry?.runs?.machine))}
			{@const where = crumbsOf(p.path).slice(0, -1)}
			<div class="peek" role="dialog" aria-label="About {p.title}">
				<div class="peekbar">
					<button class="run" disabled={peekHere} onclick={() => go(p)} title={peekHere ? 'This is the page you are on' : 'Double-click in the tree does the same'}
						>{peekHere ? (p.entry ? 'Running' : 'Open') : p.entry ? 'Run' : 'Open'}</button
					>
					<span class="where">{#each where as c, i (c.path)}{#if i}/{/if}{c.title}{/each}{#if where.length}:{/if}</span>
					<button class="close" onclick={() => (peek = null)} title="Close (Escape)" aria-label="Close">✕</button>
				</div>
				<div class="peekbody">
					<h2>{p.title}</h2>
					{#if p.entry?.description ?? p.folder?.description}
						<p class="about">{p.entry?.description ?? p.folder?.description}</p>
					{/if}
					{#if p.entry}
						{@render chips(p.entry)}
						{#if !peekHere}
							<p class="runs">
								{#if m}Runs on the {m.title}.{:else}No machine runs <code>{String(p.entry.runs?.machine ?? 'nothing')}</code> yet.{/if}
								{#if reloads(p.entry)}Running it reloads the page, which stops what is running now.{:else if entry}Running it replaces what is running now.{/if}
							</p>
						{/if}
						{#if p.entry.guide}{@render guideDoc(p.entry.guide)}{/if}
					{:else if p.children.length}
						{@render contents(p)}
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	:global(html:has(.catalog)),
	:global(body:has(.catalog)) {
		background: #000;
		color-scheme: dark;
		scrollbar-color: #2f5a30 #000;
	}
	.catalog {
		display: grid;
		grid-template-columns: var(--side, 17rem) minmax(0, 1fr);
		min-height: 100vh;
		color: #d8e8d8;
		font: 14px/1.4 system-ui, sans-serif;
	}
	.catalog.closed,
	:global(html.solo) .catalog {
		grid-template-columns: minmax(0, 1fr);
	}
	:global(html.solo) .catalog > :is(.edge, aside),
	:global(html.solo) :is(.about, .tags, .guide) {
		display: none;
	}
	.catalog.dragging {
		cursor: col-resize;
		user-select: none;
	}
	aside {
		position: sticky;
		top: 0;
		align-self: start;
		height: 100vh;
		overflow: auto;
		padding: 0.5rem;
		border-right: 1px solid #1f3a20;
		box-sizing: border-box;
		transition: opacity 0.15s, filter 0.15s;
	}
	aside.ghost {
		opacity: 0.25;
		filter: grayscale(1) blur(1px);
		overflow: hidden;
	}
	aside.ghost > * {
		min-width: calc(var(--kept) - 1rem);
	}
	.edge {
		position: fixed;
		top: 0;
		bottom: 0;
		left: calc(var(--side, 17rem) - 4px);
		width: 8px;
		z-index: 10;
		cursor: col-resize;
		touch-action: none;
	}
	.edge:hover,
	.dragging .edge {
		background: linear-gradient(90deg, transparent 3px, #4f9a50 3px, #4f9a50 5px, transparent 5px);
	}
	.edge.ghost {
		background: linear-gradient(90deg, transparent 3px, #3a3a3a 3px, #3a3a3a 5px, transparent 5px);
	}
	.bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.4rem;
	}
	.brand {
		font-weight: 600;
		font-size: 1.15rem;
	}
	a.brand {
		color: inherit;
	}
	a {
		color: #9fd89f;
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
	a[aria-current='page'] {
		color: #000;
		background: #9fd89f;
		padding: 0 0.25rem;
	}
	a.also {
		font-style: italic;
	}
	a:not(.entry) {
		color: #d8e8d8;
	}
	button,
	select,
	input {
		font: inherit;
		color: inherit;
		background: #0c160c;
		border: 1px solid #2f5a30;
		border-radius: 3px;
	}
	button {
		cursor: pointer;
		padding: 0 0.4rem;
	}
	button.on {
		background: #2f5a30;
	}
	.toggle {
		align-self: center;
		width: 1.6rem;
		height: 1.6rem;
		padding: 0;
		font-size: 1rem;
		line-height: 1;
	}
	input[type='search'] {
		width: 100%;
		box-sizing: border-box;
		padding: 0.2rem 0.4rem;
	}
	.views {
		display: flex;
		gap: 0.25rem;
		margin: 0.4rem 0;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0 0 0 0.9rem;
	}
	nav > ul {
		padding: 0;
	}
	summary {
		cursor: pointer;
	}
	li {
		margin: 0.1rem 0;
	}
	.none {
		opacity: 0.7;
	}
	.facets {
		margin: 0.4rem 0 0.6rem;
		border-bottom: 1px solid #1f3a20;
		padding-bottom: 0.4rem;
	}
	.facet {
		margin: 0.3rem 0;
	}
	.facet .name {
		display: block;
		opacity: 0.7;
		font-size: 12px;
	}
	.chip {
		font-size: 12px;
		margin: 0 0.2rem 0.2rem 0;
	}
	.num {
		opacity: 0.6;
	}
	.chip.none {
		opacity: 0.4;
	}
	.clear {
		margin-top: 0.3rem;
	}
	main {
		min-width: 0;
	}
	.peek {
		position: fixed;
		top: 0;
		bottom: 0;
		left: var(--side, 17rem);
		right: 0;
		z-index: 5;
		display: flex;
		flex-direction: column;
		background: rgb(0 0 0 / 0.94);
		backdrop-filter: blur(3px);
		border-left: 1px solid #1f3a20;
	}
	.closed .peek {
		left: 0;
	}
	.peekbar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 1rem;
		border-bottom: 1px solid #1f3a20;
	}
	.peekbar .run {
		min-width: 8rem;
		padding: 0.35rem 1.2rem;
		font-size: 1.15rem;
		font-weight: 600;
		background: #2f5a30;
		border-color: #4f9a50;
	}
	.peekbar .run:disabled {
		cursor: default;
		opacity: 0.5;
	}
	.peekbar .where {
		flex: 1;
		opacity: 0.7;
	}
	.peekbar .close {
		width: 2rem;
		height: 2rem;
		padding: 0;
		font-size: 1.1rem;
	}
	.peekbody {
		overflow: auto;
		padding: 0.5rem 1rem 2rem;
	}
	.peekbody h2 {
		margin: 0.3rem 0;
		font-size: 1.4rem;
	}
	.runs {
		opacity: 0.85;
	}
	a.peeked:not([aria-current='page']) {
		outline: 1px solid #4f9a50;
		outline-offset: 1px;
	}
	header {
		padding: 0.5rem 1rem 0.25rem;
	}
	.guide {
		margin-top: 1rem;
		border-top: 1px solid #1f3a20;
		padding: 0.4rem 1rem 1.5rem;
	}
	.guide > :global(*) {
		max-width: 52rem;
	}
	.guide > summary {
		cursor: pointer;
		font-weight: 600;
	}
	.doc {
		line-height: 1.5;
	}
	.doc :global(h1),
	.doc :global(h2),
	.doc :global(h3) {
		font-size: 1.05rem;
		margin: 1.1rem 0 0.3rem;
	}
	.doc :global(h1) {
		font-size: 1.2rem;
	}
	.doc :global(table) {
		border-collapse: collapse;
	}
	.doc :global(th),
	.doc :global(td) {
		border: 1px solid #1f3a20;
		padding: 0.15rem 0.5rem;
		text-align: left;
		vertical-align: top;
	}
	.doc :global(code),
	.doc :global(kbd) {
		font-family: ui-monospace, monospace;
		background: #0c160c;
		padding: 0 0.2rem;
	}
	.doc :global(img) {
		max-width: 100%;
		image-rendering: pixelated;
	}
	.titlebar {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem;
		font-size: 1.15rem;
	}
	h1 {
		font-size: inherit;
		margin: 0;
	}
	.about,
	.tags,
	.ignored {
		margin: 0.25rem 0;
	}
	.about {
		max-width: 50rem;
		opacity: 0.85;
	}
	.ignored {
		color: #e8c070;
	}
	.machine {
		padding: 0.25rem 1rem 1rem;
	}
	.wait {
		margin: 0;
		padding: 0.75rem 0;
	}
	.contents {
		padding: 0.5rem 1rem;
	}
	.folder {
		padding: 0 1rem;
	}
	.folder .contents {
		padding: 0.25rem 0 0.75rem;
	}
	.section {
		margin: 0.75rem 0 0.1rem;
		font-size: 0.95rem;
		font-weight: 600;
		opacity: 0.75;
	}
	.featured li {
		margin: 0.5rem 0;
	}
	li.root > a {
		font-weight: 600;
	}
	.contents li {
		margin: 0.35rem 0;
	}
	.note {
		display: block;
		opacity: 0.7;
		font-size: 13px;
		max-width: 50rem;
	}
	@media (max-width: 700px) {
		.catalog,
		.catalog.closed {
			grid-template-columns: 1fr;
		}
		.edge {
			display: none;
		}
		.peek {
			left: 0;
		}
		aside {
			position: static;
			height: auto;
			border-right: 0;
			border-bottom: 1px solid #1f3a20;
		}
	}
</style>
