<script>
	import { listDatabases } from '$lib/corpus.js';

	const dbs = listDatabases();
	const total = dbs.reduce(
		(acc, db) => ({
			articles: acc.articles + db.articles,
			entries: acc.entries + db.entries,
			targets: acc.targets + db.targets
		}),
		{ articles: 0, entries: 0, targets: 0 }
	);
</script>

<div class="index">
<h1>HyperTIES</h1>
<p class="lede">
	The Interactive Encyclopedia System, 1988. {total.articles} articles across {dbs.length} databases,
	{total.entries} names resolving into them, {total.targets} shaped targets. Converted from the
	original storyboards to markdown, and readable offline.
</p>

<ul class="databases">
	{#each dbs as db (db.id)}
		<li>
			<a href="{db.id}/">{db.id}</a>
			<dl>
				<dt>articles</dt>
				<dd>{db.articles}</dd>
				<dt>names</dt>
				<dd>{db.entries} <span class="sub">({db.synonyms} synonyms)</span></dd>
				<dt>targets</dt>
				<dd>{db.targets}</dd>
				<dt>pictures</dt>
				<dd>{db.pictures}</dd>
			</dl>
			{#if db.unresolved}
				<p class="unresolved">{db.unresolved} names resolve nowhere, reported not dropped</p>
			{/if}
		</li>
	{/each}
</ul>

</div>

<style>
	.index {
		max-width: 52rem;
		padding: 1.2rem 1rem 3rem;
	}
	h1 {
		font-size: 2rem;
		margin: 0 0 0.5rem;
		letter-spacing: -0.02em;
	}
	.lede {
		max-width: 40rem;
		line-height: 1.6;
		opacity: 0.8;
		margin: 0 0 2.5rem;
	}
	.databases {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
	}
	.databases li {
		border: 1px solid color-mix(in oklab, currentColor 18%, transparent);
		border-radius: 0.6rem;
		padding: 1rem 1.1rem;
	}
	.databases a {
		font-size: 1.05rem;
		font-weight: 600;
		text-decoration: none;
		border-bottom: 2px solid var(--hot);
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.1rem 0.7rem;
		margin: 0.8rem 0 0;
		font-size: 0.85rem;
	}
	dt {
		opacity: 0.55;
	}
	dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
	}
	.sub {
		opacity: 0.5;
		font-size: 0.78rem;
	}
	.unresolved {
		font-size: 0.72rem;
		opacity: 0.5;
		margin: 0.7rem 0 0;
	}
</style>
