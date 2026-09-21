<script>
	/**
	 * Offline shell: same tiled browser as the site, no router.
	 */
	import { listDatabases } from './corpus.js';
	import Piles from './Piles.svelte';
	import { Workspace } from './pile.svelte.js';

	const dbs = listDatabases();
	let dbId = $state(dbs[0]?.id ?? null);
	const workspace = $derived.by(() => (dbId ? new Workspace([dbId]) : null));
	const browser = $derived(workspace?.browsers[0] ?? null);
</script>

<div class="frame">
	<div class="meta">
		<strong>HyperTIES</strong>
		<select aria-label="database" value={dbId} onchange={(e) => (dbId = e.currentTarget.value)}>
			{#each dbs as db (db.id)}
				<option value={db.id}>{db.id}</option>
			{/each}
		</select>
	</div>
	<div class="fill">
		{#if browser}
			<Piles
				{browser}
				onnavigate={(target) => workspace.navigate(browser, browser.contents.db, target.slug)}
			/>
		{/if}
	</div>
</div>

<style>
	.frame {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}
	.meta {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-shrink: 0;
		padding: 0.15rem 0.35rem;
		border-bottom: 1px solid #000;
		font-size: 0.75rem;
	}
	.meta select {
		font: inherit;
		font-size: 0.75rem;
		border: 1px solid #000;
		background: #fff;
	}
	.fill {
		flex: 1 1 auto;
		min-height: 0;
	}
</style>
