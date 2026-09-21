<script>
	/**
	 * A database opens at its home article. Piles fill the window; definition and
	 * controls stay pinned. Split still opens a second tiled browser.
	 */
	import Piles from '$lib/Piles.svelte';
	import { Workspace } from '$lib/pile.svelte.js';

	let { data } = $props();

	const workspace = $derived.by(() => new Workspace([data.id]));

	function split() {
		workspace.open(data.id);
	}
</script>

<svelte:head>
	<title>{data.id} — HyperTIES</title>
</svelte:head>

<div class="frame">
	<div class="meta">
		<p class="crumb"><a href="../">HyperTIES</a> / {data.id}</p>
		<span class="count">{data.principals} articles</span>
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
		border-bottom: 1px solid var(--ink, #000);
		font-size: 0.72rem;
	}
	.crumb {
		margin: 0;
	}
	.spacer {
		flex: 1;
	}
	.count {
		opacity: 0.55;
	}
	.sync {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.meta button {
		font: inherit;
		font-size: 0.72rem;
		padding: 0.05rem 0.3rem;
		border: 1px solid var(--ink, #000);
		background: var(--paper, #fff);
		cursor: pointer;
	}
	.meta button:disabled {
		color: #999;
		border-color: #ccc;
		cursor: default;
	}
	.piles {
		flex: 1 1 auto;
		min-height: 0;
		display: grid;
	}
	.piles.split {
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
	}
	.scope {
		min-width: 0;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}
	.scope-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.65rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0.1rem 0.35rem;
		border-bottom: 1px solid var(--ink, #000);
	}
	.scope-head button {
		font: inherit;
		border: none;
		background: none;
		cursor: pointer;
	}
</style>
