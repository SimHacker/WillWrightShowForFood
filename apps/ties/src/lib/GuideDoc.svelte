<script>
	/** A guide: a markdown file in the repo, rendered; a link to it while it loads or if it can't. */
	import { loadRepoDoc, githubUrl } from './repo-docs.js';

	/** @type {{ at: string }} */
	let { at } = $props();
</script>

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

<style>
	.wait {
		margin: 0;
		padding: 0.75rem 0;
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
</style>
