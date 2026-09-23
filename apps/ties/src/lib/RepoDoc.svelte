<script>
	/**
	 * ```transclude
	 * path: packages/cabinet/BUG-JOURNAL.md
	 * ```
	 * A WillWrightShowForFood file, spliced live. The file stays in its room; this renders
	 * whatever is there at build time, and says where it came from.
	 */
	import { onMount } from 'svelte';
	import { loadRepoDoc, hasRepoDoc, githubUrl } from './repo-docs.js';

	let { spec } = $props();

	const path = $derived(String(spec.path ?? ''));
	const known = $derived(hasRepoDoc(path));
	let html = $state(null);
	let failed = $state(null);

	onMount(() => {
		if (!known) return;
		loadRepoDoc(path)
			.then((out) => (html = out))
			.catch((e) => (failed = e instanceof Error ? e.message : String(e)));
	});
</script>

<section class="repo-doc" data-applet="repo-doc">
	<header>
		<code>{path}</code>
		<a href={githubUrl(path)} target="_blank" rel="noopener">GitHub</a>
	</header>
	{#if html}
		<div class="doc">{@html html}</div>
	{:else if failed}
		<p class="note">Could not load: {failed}</p>
	{:else if known}
		<p class="note">Loading…</p>
	{:else}
		<p class="note">Not transcluded here yet. Read it on GitHub.</p>
	{/if}
</section>

<style>
	.repo-doc {
		margin: 0.8rem 0;
		border: 1px solid var(--ink, #000);
	}
	header {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.3rem 0.5rem;
		font-size: 0.75rem;
		border-bottom: 1px solid var(--ink, #000);
		background: rgba(0, 0, 0, 0.04);
	}
	header code {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.doc {
		padding: 0 0.8rem;
		overflow-x: auto;
	}
	.doc :global(pre) {
		overflow-x: auto;
		font-size: 0.8em;
	}
	.doc :global(table) {
		border-collapse: collapse;
		font-size: 0.85em;
	}
	.doc :global(th),
	.doc :global(td) {
		border: 1px solid #999;
		padding: 0.15rem 0.4rem;
		vertical-align: top;
	}
	.doc :global(img) {
		max-width: 100%;
	}
	.note {
		padding: 0 0.8rem;
		font-size: 0.85rem;
		opacity: 0.7;
	}
</style>
