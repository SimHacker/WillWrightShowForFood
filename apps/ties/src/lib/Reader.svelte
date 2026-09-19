<script>
	/**
	 * The whole reader with no router: navigation is state, not URL.
	 *
	 * This is what makes the offline single file possible. Under file:// there are no
	 * paths to match, so a URL-driven router cannot work — but Article and TargetApplet
	 * never knew about routing in the first place. They ask their parent to navigate
	 * through `onnavigate`, so the same components serve both the prerendered site and
	 * this shell. The seam was there before it was needed.
	 */
	import { listDatabases, getDatabase, articleList, getArticle } from './corpus.js';
	import Article from './Article.svelte';

	const dbs = listDatabases();

	let dbId = $state(dbs[0]?.id ?? null);
	let slug = $state(null);
	let query = $state('');
	let history = $state([]);

	const articles = $derived(dbId ? articleList(dbId) : []);
	const article = $derived(dbId && slug ? getArticle(dbId, slug) : null);
	const shown = $derived(
		articles.filter((a) => {
			const q = query.trim().toLowerCase();
			if (!q) return true;
			return (
				a.title.toLowerCase().includes(q) ||
				a.synonyms.some((s) => String(s).toLowerCase().includes(q))
			);
		})
	);

	/** The home article, if the database declares one: HyperTIES spelled it "!home". */
	function home(id) {
		const db = getDatabase(id);
		return db?.documents.get('!home')?.slug ?? null;
	}

	function openDatabase(id) {
		dbId = id;
		history = [];
		slug = home(id);
	}

	function open(target) {
		if (target.space !== 'documents') return;
		if (slug) history = [...history, slug];
		slug = target.slug;
	}

	function back() {
		slug = history.at(-1) ?? null;
		history = history.slice(0, -1);
	}

	$effect(() => {
		if (dbId && slug === null && !history.length) slug = home(dbId);
	});
</script>

<header class="bar">
	<strong>HyperTIES</strong>
	<select
		aria-label="database"
		value={dbId}
		onchange={(e) => openDatabase(e.currentTarget.value)}
	>
		{#each dbs as db (db.id)}
			<option value={db.id}>{db.id} ({db.articles})</option>
		{/each}
	</select>
	{#if history.length}
		<button type="button" onclick={back}>← back</button>
	{/if}
	{#if slug}
		<button type="button" onclick={() => { slug = null; history = []; }}>index</button>
	{/if}
	<input type="search" placeholder="title or synonym" bind:value={query} aria-label="filter" />
</header>

<main>
	{#if article}
		<Article db={dbId} {article} onnavigate={open} />
	{:else}
		<h1>{dbId}</h1>
		<ul class="articles">
			{#each shown as a (a.slug)}
				<li>
					<button type="button" class="title" onclick={() => open({ space: 'documents', slug: a.slug })}>
						{a.title}
					</button>
					{#if a.definition}<p>{a.definition}</p>{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	.bar {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		flex-wrap: wrap;
		padding: 0.8rem 1.2rem;
		border-bottom: 1px solid color-mix(in oklab, currentColor 20%, transparent);
		position: sticky;
		top: 0;
		background: var(--paper, #ffffff);
		z-index: 5;
	}
	.bar select,
	.bar input,
	.bar button {
		font: inherit;
		font-size: 0.85rem;
		background: transparent;
		color: inherit;
		border: 1px solid color-mix(in oklab, currentColor 30%, transparent);
		border-radius: 0.3rem;
		padding: 0.2rem 0.5rem;
	}
	.bar button {
		cursor: pointer;
	}
	main {
		max-width: 62rem;
		margin: 0 auto;
		padding: 2rem 1.2rem 5rem;
	}
	h1 {
		font-size: 1.5rem;
		margin: 0 0 1.5rem;
	}
	.articles {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 1.1rem;
	}
	.articles li {
		max-width: 40rem;
	}
	.title {
		font: inherit;
		font-size: 1.02rem;
		background: none;
		border: none;
		border-bottom: 2px solid var(--hot, #c8102e);
		color: inherit;
		padding: 0;
		cursor: pointer;
		text-align: left;
	}
	.articles p {
		margin: 0.3rem 0 0;
		opacity: 0.72;
		font-size: 0.9rem;
		line-height: 1.5;
	}
</style>
