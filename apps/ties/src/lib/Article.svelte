<script>
	/**
	 * An article body. 1988 link behaviour, no popup:
	 *
	 *   single click -> definition pane (onpreview)
	 *   double click -> go there (onnavigate)
	 *
	 * The current article's own definition is not drawn here. That text belongs in the
	 * definition pane when this article is the one being *considered*, which is a
	 * single-click on a link to it — or a click on the window title.
	 */
	import { paginate, parseArticle } from './markdown.js';
	import { getArticle, resolve } from './corpus.js';
	import TargetApplet from './TargetApplet.svelte';
	import CabinetApplet from './CabinetApplet.svelte';
	import YouTubeEmbed from './YouTubeEmbed.svelte';

	let { db, article, onnavigate, onpreview, titled = true, reveal = false, browser = null } = $props();

	let bodyEl = $state(null);

	/** A ```transclude names another article, optionally in another database. */
	function expandTranscludes(dbId, segs, depth = 0) {
		const out = [];
		for (const segment of segs) {
			if (segment.kind !== 'transclude') {
				out.push({ ...segment, db: segment.db ?? dbId });
				continue;
			}
			if (depth > 2) continue;
			if (segment.spec.path) {
				out.push({ kind: 'coming', spec: segment.spec, db: dbId });
				continue;
			}
			const name = segment.spec.article ?? segment.spec.from ?? segment.spec.of;
			const sourceDb = segment.spec.db ?? dbId;
			const found = resolve(sourceDb, name);
			const art = found?.slug ? getArticle(found.db ?? sourceDb, found.slug) : null;
			if (!art) {
				out.push({
					kind: 'html',
					html: `<p class="absent">transclude missed: ${sourceDb}/${name ?? '?'}</p>`,
					db: dbId
				});
				continue;
			}
			const fromDb = found.db ?? sourceDb;
			const inner = parseArticle(paginate(art.body).join('\n\n'), fromDb);
			out.push(...expandTranscludes(fromDb, inner, depth + 1));
		}
		return out;
	}

	// Window-size paging later. For now join the authored pages and scroll.
	const segments = $derived(
		expandTranscludes(db, parseArticle(paginate(article.body).join('\n\n'), db))
	);

	function consider(target) {
		if (!target) return;
		onpreview?.(target);
		browser?.arm(target);
	}

	function go(target) {
		if (!target) return;
		browser?.disarm();
		onnavigate?.(target);
	}

	/** Prose links are anchors inside {@html}, so they are caught by delegation. */
	function onProseClick(event) {
		const anchor = event.target.closest?.('a.ties-link');
		if (!anchor) return;
		event.preventDefault();
		const found = resolve(db, anchor.dataset.tiesName);
		if (!found) return;
		if (event.detail > 1 || browser?.isArmed(found)) go(found);
		else consider(found);
	}

	function onProseDblClick(event) {
		const anchor = event.target.closest?.('a.ties-link');
		if (!anchor) return;
		event.preventDefault();
		const found = resolve(db, anchor.dataset.tiesName);
		if (found) go(found);
	}

	$effect(() => {
		const armed = browser?.armed;
		const root = bodyEl;
		if (!root) return;
		for (const a of root.querySelectorAll('a.ties-link')) {
			const found = resolve(db, a.dataset.tiesName);
			a.classList.toggle('armed', Boolean(armed && found && browser.isArmed(found)));
		}
	});
</script>

<article class:reveal-all={reveal}>
	{#if titled}
		<header>
			<h1>{article.title}</h1>
		</header>
	{/if}

	<!-- Delegation on a wrapper: the anchors live inside rendered markdown, so there is
	     no component to put a handler on. The anchors carry href="#", which makes them
	     focusable and makes Enter dispatch a click, so the keyboard path is already
	     there and a keydown handler here would fire twice. Background press is the
	     same wrapper: invert .ties-link, leave ordinary hrefs alone. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="body"
		bind:this={bodyEl}
		role="presentation"
		onclick={onProseClick}
		ondblclick={onProseDblClick}
	>
		{#each segments as segment, i (i)}
			{#if segment.kind === 'html'}
				{@html segment.html}
			{:else if segment.kind === 'coming'}
				<aside class="coming">
					<p>Coming soon, by transclusion.</p>
					<code>{segment.spec.path}</code>
				</aside>
			{:else if segment.kind === 'cabinet'}
				<CabinetApplet spec={segment.spec} />
			{:else if segment.kind === 'youtube'}
				<YouTubeEmbed spec={segment.spec} />
			{:else}
				<TargetApplet
					db={segment.db ?? db}
					spec={segment.spec}
					{reveal}
					{browser}
					onpreview={consider}
					onnavigate={go}
				/>
			{/if}
		{/each}
	</div>
</article>

<style>
	article {
		max-width: none;
	}
	article.reveal-all :global(a.ties-link),
	.body :global(a.ties-link:hover),
	.body :global(a.ties-link.armed:hover),
	article.reveal-all :global(a.ties-link.armed) {
		background: #000;
		color: var(--flash, #00f0d8);
		-webkit-text-fill-color: var(--flash, #00f0d8);
		border-bottom-color: var(--flash, #00f0d8);
	}
	.body :global(a.ties-link.armed) {
		color: #00f;
		-webkit-text-fill-color: #00f;
		border-bottom-color: #00f;
	}
	h1 {
		font-size: 1.15rem;
		font-weight: 700;
		margin: 0 0 0.6rem;
		line-height: 1.2;
	}
	.body :global(a.ties-link) {
		color: inherit;
		-webkit-text-fill-color: currentColor;
		text-decoration: none;
		border-bottom: 1px solid var(--ink, #000);
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
	}
	.body :global(p) {
		line-height: 1.45;
		margin: 0 0 0.7rem;
	}
	.body :global(blockquote) {
		margin: 0 0 0.7rem;
		padding: 0 0 0 0.7rem;
		border-left: 2px solid var(--ink, #000);
	}
	.body :global(img) {
		max-width: 100%;
		height: auto;
	}
	.body :global(ul),
	.body :global(ol) {
		margin: 0 0 0.7rem;
		padding-left: 1.25rem;
	}
	.body :global(li) {
		margin: 0.2rem 0;
		line-height: 1.4;
	}
	.body :global(h2),
	.body :global(h3) {
		font-weight: 700;
		font-size: 1rem;
		margin: 1rem 0 0.4rem;
	}
	.coming {
		margin: 0.8rem 0;
		padding: 0.45rem 0.6rem;
		border: 1px dashed var(--ink, #000);
		font-size: 0.85rem;
	}
	.coming p {
		margin: 0 0 0.25rem;
	}
	.coming code {
		font-size: 0.78rem;
		word-break: break-all;
	}
</style>
