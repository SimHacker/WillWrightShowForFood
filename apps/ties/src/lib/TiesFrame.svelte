<script>
	/**
	 * The tiled browser. Breadcrumbs are the visit path. Permalinks follow the cursor.
	 */
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import Piles from './Piles.svelte';
	import { Workspace } from './pile.svelte.js';
	import { articleHref, samePath } from './href.js';

	let { db, slug = null } = $props();

	const workspace = $derived.by(() => new Workspace([{ db, slug }]));
	const lead = $derived(workspace.browsers[0]?.contents);

	$effect(() => {
		const pile = lead;
		if (!pile) return;
		const step = pile.path[pile.cursor];
		if (!step?.slug) return;
		const href = articleHref(step.db, step.slug);
		if (samePath(page.url.pathname, href) && samePath(window.location.pathname, href)) return;
		pushState(href, {});
	});
</script>

<svelte:head>
	<title>
		{workspace.browsers[0]?.contents.article?.title ?? db} — HyperTIES
	</title>
</svelte:head>

<div class="frame">
	{#each workspace.browsers as browser (browser.contents.id)}
		<Piles
			{browser}
			onnavigate={(target) =>
				workspace.navigate(browser, target.db ?? browser.contents.db, target.slug)}
		/>
	{/each}
</div>

<style>
	.frame {
		height: 100%;
		min-height: 0;
	}
</style>
