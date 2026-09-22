<script>
	/**
	 * Offline shell: same tiled browser as the site, no router.
	 */
	import Piles from './Piles.svelte';
	import { Workspace } from './pile.svelte.js';
	import { ROOT } from './href.js';

	const workspace = $derived.by(() => new Workspace([ROOT]));
	const browser = $derived(workspace.browsers[0] ?? null);
</script>

<div class="frame">
	<div class="fill">
		{#if browser}
			<Piles
				{browser}
				onnavigate={(target) =>
					workspace.navigate(browser, target.db ?? browser.contents.db, target.slug)}
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
	.fill {
		flex: 1 1 auto;
		min-height: 0;
	}
</style>
