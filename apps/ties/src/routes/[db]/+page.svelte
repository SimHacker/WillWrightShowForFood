<script>
	/**
	 * A database opens at its home article, not at a list of its contents.
	 *
	 * Piles are window scopes, and there can be more than one: `.new-pile <class>` made
	 * them in 1988 and `32 constant /piles` was the ceiling. Split opens a second, which
	 * browses independently until synchronized, at which point navigating either navigates
	 * both -- by NAME rather than by slug, so two piles on different databases still track
	 * each other wherever the name resolves in both.
	 */
	import Piles from '$lib/Piles.svelte';
	import { Workspace } from '$lib/pile.svelte.js';

	let { data } = $props();

	// One workspace per database. Recomputed only when the route changes, so navigating
	// inside a pile never rebuilds it: the visit path belongs to the pile, which is what
	// gives RETURN something to pop.
	const workspace = $derived.by(() => new Workspace([data.id]));
	const primary = $derived(workspace.browsers[0]);

	function split() {
		workspace.open(data.id);
	}
</script>

<svelte:head>
	<title>{data.id} — HyperTIES</title>
</svelte:head>

<p class="crumb"><a href="../">HyperTIES</a> / {data.id}</p>

<div class="bar">
	<span class="count">{data.principals} articles, {data.entries} names in the index</span>
	<span class="spacer"></span>
	{#if workspace.browsers.length > 1}
		<label class="sync">
			<input type="checkbox" bind:checked={workspace.synchronized} />
			synchronized
		</label>
	{/if}
	<button type="button" onclick={split} disabled={workspace.browsers.length >= 4}>
		new pile
	</button>
</div>

<div class="piles" class:split={workspace.browsers.length > 1}>
	{#each workspace.browsers as browser, i (browser.contents.id)}
		<div class="scope">
			{#if workspace.browsers.length > 1}
				<header class="scope-head">
					<!-- Counted for the reader, not named for the dictionary. Every contents pile
					     is bound as ContentsPileID inside its own browser, which is what makes
					     one lookup serve them all, and is exactly why it cannot label anything
					     on screen: both piles would wear the same name. -->
					<span>pile {i + 1}</span>
					<button type="button" onclick={() => workspace.close(browser)} title="close this pile">
						×
					</button>
				</header>
			{/if}
			<Piles
				{browser}
				onnavigate={(target) => workspace.navigate(browser, browser.contents.db, target.slug)}
			/>
		</div>
	{/each}
</div>

{#if !primary?.contents.article}
	<p class="empty">
		This database declares no <code>!home</code> article, so there is nowhere to open.
	</p>
{/if}

<style>
	.crumb {
		font-size: 0.8rem;
		opacity: 0.6;
		margin: 0 0 0.5rem;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin: 0 0 1.2rem;
		padding-bottom: 0.6rem;
		border-bottom: 1px solid #e3e3e3;
	}
	.spacer {
		flex: 1;
	}
	.count {
		font-size: 0.85rem;
		color: #6a6a6a;
	}
	.sync {
		font-size: 0.8rem;
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	.bar button {
		font: inherit;
		font-size: 0.8rem;
		padding: 0.2rem 0.6rem;
		border: 1px solid var(--ink, #000);
		background: var(--paper, #fff);
		border-radius: 2px;
		cursor: pointer;
	}
	.bar button:disabled {
		color: #9a9a9a;
		border-color: #cfcfcf;
		cursor: default;
	}
	.piles {
		display: grid;
		gap: 1.5rem;
	}
	.piles.split {
		grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
	}
	.scope {
		min-width: 0;
	}
	.scope-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #6a6a6a;
		margin-bottom: 0.5rem;
	}
	.scope-head button {
		font: inherit;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 1rem;
		line-height: 1;
		color: #6a6a6a;
	}
	.empty {
		color: #6a6a6a;
	}
</style>
